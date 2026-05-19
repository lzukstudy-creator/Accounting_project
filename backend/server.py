#!/usr/bin/env python3
import json
import re
import sqlite3
import uuid
from datetime import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
WEB_ROOT = ROOT / "web-ledger"
DB_PATH = ROOT / "backend" / "data" / "ledger.db"
HOST = "127.0.0.1"
PORT = 4183
MONTHS = {
    "jan": "01",
    "feb": "02",
    "mar": "03",
    "apr": "04",
    "may": "05",
    "jun": "06",
    "jul": "07",
    "aug": "08",
    "sep": "09",
    "sept": "09",
    "oct": "10",
    "nov": "11",
    "dec": "12",
}
CATEGORIES = ["餐饮", "交通", "购物", "住房", "娱乐", "医疗", "教育", "水电", "工资", "储蓄", "其他"]
PAYMENT_METHODS = ["微信", "支付宝", "银行卡", "Apple Pay"]


def default_state():
    return {
        "bills": [],
        "settings": {
            "monthlyIncome": 12000,
            "monthlyBudget": 8000,
            "savingsGoal": 2400,
            "displayCurrency": "GBP",
            "language": "zh",
            "warningThreshold": 0.8,
            "dangerThreshold": 1,
            "severeThreshold": 1.2,
            "categoryBudgets": {
                "餐饮": 1800,
                "交通": 600,
                "购物": 1200,
                "住房": 3000,
                "娱乐": 800,
                "医疗": 600,
                "教育": 800,
                "水电": 500,
                "其他": 600,
            },
        },
        "filters": {"query": "", "type": "全部类型", "category": "全部分类", "dateFrom": "", "dateTo": ""},
        "statsScope": "month",
    }


def connect():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS app_state (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          payload TEXT NOT NULL,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS bills (
          id TEXT PRIMARY KEY,
          type TEXT NOT NULL,
          amount REAL NOT NULL,
          currency TEXT NOT NULL,
          category TEXT NOT NULL,
          date TEXT NOT NULL,
          merchant TEXT,
          account TEXT,
          payment_method TEXT,
          note TEXT,
          source TEXT,
          confidence REAL,
          created_at TEXT,
          updated_at TEXT
        )
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.commit()
    return conn


def read_state():
    with connect() as conn:
        row = conn.execute("SELECT payload FROM app_state WHERE id = 1").fetchone()
    if not row:
        return default_state()
    try:
        return json.loads(row["payload"])
    except json.JSONDecodeError:
        return default_state()


def write_state(state):
    payload = json.dumps(state, ensure_ascii=False)
    with connect() as conn:
        conn.execute(
            """
            INSERT INTO app_state (id, payload, updated_at)
            VALUES (1, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(id) DO UPDATE SET payload = excluded.payload, updated_at = CURRENT_TIMESTAMP
            """,
            (payload,),
        )
        sync_tables(conn, state)
        conn.commit()


def sync_tables(conn, state):
    conn.execute("DELETE FROM bills")
    conn.execute("DELETE FROM settings")
    for item in state.get("bills", []):
        conn.execute(
            """
            INSERT OR REPLACE INTO bills (
              id, type, amount, currency, category, date, merchant, account,
              payment_method, note, source, confidence, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                item.get("id"),
                item.get("type", "支出"),
                float(item.get("amount") or 0),
                item.get("currency", "GBP"),
                item.get("category", "其他"),
                item.get("date"),
                item.get("merchant", ""),
                item.get("account", ""),
                item.get("paymentMethod", item.get("account", "")),
                item.get("note", ""),
                item.get("source", "手动"),
                item.get("confidence"),
                item.get("createdAt"),
                item.get("updatedAt"),
            ),
        )
    for key, value in state.get("settings", {}).items():
        conn.execute(
            "INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)",
            (key, json.dumps(value, ensure_ascii=False)),
        )


def normalize_receipt_text(text):
    return re.sub(r"\s+\n", "\n", str(text or "").replace("￥", "¥").replace("\r", "\n")).strip()


def parse_ocr_text(text):
    normalized = normalize_receipt_text(text)
    items = extract_bill_line_items(normalized)
    if not items:
        draft = parse_bill_text(normalized, normalized, 0)
        return [draft] if draft["amount"] > 0 else []
    shared_payment = infer_payment_method(normalized)
    shared_currency = infer_currency(normalized)
    drafts = []
    for index, item in enumerate(items):
        line = item["text"]
        draft = parse_bill_text(line, normalized, index)
        bill_type = infer_bill_type(line)
        payment = infer_explicit_payment_method(line) or shared_payment
        draft.update(
            {
                "type": bill_type,
                "category": infer_income_category(f"{normalized}\n{line}") if bill_type == "收入" else draft["category"],
                "currency": infer_explicit_currency(line) or shared_currency,
                "date": item.get("date") or draft["date"],
                "account": payment,
                "paymentMethod": payment,
                "note": f"后端 OCR 解析第 {index + 1} 条：{line[:90]}",
                "confidence": min(0.94, max(0.72, draft.get("confidence") or 0.72)),
            }
        )
        if draft["amount"] > 0:
            drafts.append(draft)
    return drafts


def parse_bill_text(text, full_text="", index=0):
    normalized = normalize_receipt_text(text)
    amount = extract_amount(normalized)
    bill_type = infer_bill_type(normalized)
    category = infer_income_category(normalized) if bill_type == "收入" else infer_category(normalized)
    payment = infer_payment_method(normalized)
    now = datetime.utcnow().isoformat(timespec="milliseconds") + "Z"
    return {
        "id": str(uuid.uuid4()),
        "type": bill_type,
        "amount": amount,
        "currency": infer_currency(normalized),
        "category": category,
        "date": extract_date(normalized) or now,
        "merchant": infer_merchant(normalized, category),
        "account": payment,
        "paymentMethod": payment,
        "note": f"后端 OCR 解析草稿：{normalized[:90]}",
        "tags": [],
        "source": "AI 扫描",
        "confidence": scan_confidence(normalized, amount),
        "createdAt": now,
        "updatedAt": now,
    }


def extract_bill_line_items(text):
    lines = [line.strip() for line in normalize_receipt_text(text).split("\n") if line.strip()]
    current_date = None
    candidates = []
    for line in lines:
        line_date = extract_date(line)
        if line_date and (is_date_only_line(line) or is_date_summary_line(line)):
            current_date = line_date
            continue
        if is_date_only_line(line) or is_date_summary_line(line):
            continue
        if is_non_transaction_info_line(line):
            continue
        if not extract_amount(line):
            continue
        if re.search(r"(?:合计|总计|小计|应付|实付|支付金额|付款金额|total|subtotal|tax|balance)", line, re.I):
            continue
        if re.match(r"^(?:¥|£|\$|€)?\s*[0-9][0-9,]*(?:\.[0-9]{1,2})?\s*(?:元|GBP|CNY|USD|EUR)?$", line, re.I):
            continue
        if not clean_merchant_candidate(line):
            continue
        candidates.append({"text": line, "date": current_date})
    return candidates


def infer_currency(text):
    return infer_explicit_currency(text) or "GBP"


def infer_explicit_currency(text):
    if re.search(r"(?:£|GBP|英镑)", text, re.I):
        return "GBP"
    if re.search(r"(?:¥|RMB|CNY|人民币|元)", text, re.I):
        return "CNY"
    if re.search(r"(?:€|EUR|欧元)", text, re.I):
        return "EUR"
    if re.search(r"(?:\$|USD|美元)", text, re.I):
        return "USD"
    return ""


def extract_amount(text):
    if is_date_summary_line(text) or is_non_transaction_info_line(text):
        return 0
    amount_value = r"([+-]?\s*[0-9][0-9,]*(?:\.[0-9]{1,2})?)"
    currency_mark = r"(?:¥|RMB|CNY|人民币|£|GBP|英镑|\$|USD|美元|€|EUR|欧元|元)?"
    stripped = strip_date_and_time_parts(text)
    preferred = [
        re.compile(rf"(?:实付|实际支付|付款金额|支付金额|应付|合计|总计|消费|支出|收款|收入|到账|Amount|Total)[:：\s]*{currency_mark}\s*{amount_value}", re.I),
        re.compile(rf"(?:¥|RMB|CNY|人民币|£|GBP|英镑|\$|USD|美元|€|EUR|欧元)\s*{amount_value}", re.I),
        re.compile(rf"{amount_value}\s*(?:元|英镑|人民币|美元|欧元)", re.I),
    ]
    for pattern in preferred:
        match = pattern.search(stripped)
        if match:
            return parse_amount_number(match.group(1))
    stripped = re.sub(r"(?:订单|单号|流水|交易号|编号|No\.?|ID)[:：\sA-Za-z0-9-]{4,}", " ", stripped, flags=re.I)
    values = []
    for match in re.finditer(r"([+-]?\s*[0-9][0-9,]*(?:\.[0-9]{1,2})?)", stripped):
        if is_likely_amount(match, stripped):
            value = parse_amount_number(match.group(1))
            if 0 < value < 100000:
                values.append(value)
    return max(values) if values else 0


def parse_amount_number(value):
    try:
        return abs(float(re.sub(r"\s+", "", str(value or "0").replace(",", ""))))
    except ValueError:
        return 0


def is_likely_amount(match, text):
    start = max(0, match.start() - 12)
    end = min(len(text), match.end() + 12)
    around = text[start:end]
    value = parse_amount_number(match.group(1))
    if is_likely_store_code_amount(match, text, value):
        return False
    if not has_money_signal(text) and value >= 1000 and re.search(r"[A-Za-z\u4e00-\u9fa5]", text):
        return False
    if re.search(r"[年月日:：]", around):
        return False
    if is_date_like_number(value) and re.search(r"(?:date|time|日期|时间|[-/.年月日])", around, re.I):
        return False
    if re.search(r"(?:订单|单号|流水|交易号|编号|电话|手机|No\.?|ID)", around, re.I):
        return False
    return True


def is_likely_store_code_amount(match, text, value):
    raw = re.sub(r"\s+", "", match.group(1) or "")
    if not float(value).is_integer() or value < 1000 or value > 999999 or re.search(r"[+\-.,]", raw):
        return False
    before = text[max(0, match.start() - 28):match.start()]
    after = text[match.end():min(len(text), match.end() + 18)]
    if re.search(r"(?:¥|RMB|CNY|人民币|£|GBP|英镑|\$|USD|美元|€|EUR|欧元|元)\s*$", before, re.I):
        return False
    if re.search(r"(?:元|GBP|CNY|USD|EUR)\b", after, re.I):
        return False
    return bool(re.search(r"[A-Za-z][A-Za-z\s'.&-]{1,}$", before.strip()) and re.search(r"^\s*(?:$|[A-Za-z]|[-+]\s*(?:[A-Za-z上]|[0-9]+\.[0-9]{1,2}))", after))


def has_money_signal(text):
    value = str(text or "")
    if re.search(r"(?:¥|RMB|CNY|人民币|£|GBP|英镑|\$|USD|美元|€|EUR|欧元|元)", value, re.I):
        return True
    if re.search(r"(?:实付|实际支付|付款金额|支付金额|应付|合计|总计|消费|支出|收款|收入|到账|Amount|Total)", value, re.I):
        return True
    if re.search(r"(^|[^\d])[+-]\s*(?:¥|RMB|CNY|人民币|£|GBP|英镑|\$|USD|美元|€|EUR|欧元|元)\s*[0-9][0-9,]*(?:\.[0-9]{1,2})?", value, re.I):
        return True
    if re.search(r"(^|[^\d])[+-]\s*[0-9][0-9,]*\.[0-9]{1,2}", value):
        return True
    if re.search(r"(^|[^\d])[+-]\s*[0-9][0-9,]*(?![0-9,])(?=$|\s)", value):
        return True
    if re.search(r"(^|[^\d])[0-9][0-9,]*\.[0-9]{1,2}(?!\s*[:：])", value):
        return True
    return False


def is_non_transaction_info_line(text):
    value = str(text or "").strip()
    if not value or has_money_signal(value):
        return False
    if re.match(r"^\d{3,6}\s+[A-Za-z][A-Za-z\s'.-]{2,}\s*[@+]?\s*[0-9]{1,2}[:：][0-9]{2}\s*$", value, re.I):
        return True
    if re.match(r"^\d{3,6}\s+[A-Za-z][A-Za-z\s'.-]{2,}$", value, re.I):
        return True
    if re.match(r"^[A-Za-z][A-Za-z\s'.-]{2,}\s*[@+]?\s*[0-9]{1,2}[:：][0-9]{2}\s*$", value, re.I):
        return True
    if re.match(r"^[A-Za-z][A-Za-z\s'.&-]{2,}\s+[0-9]{3,6}\s*$", value, re.I):
        return True
    if re.match(r"^[A-Za-z][A-Za-z\s'.&-]{2,}\s+[0-9]{3,6}\s+[A-Za-z][A-Za-z\s'.&-]{2,}$", value, re.I):
        return True
    return False


def is_likely_expense_charge_line(text):
    value = str(text or "")
    if not has_positive_amount(value):
        return False
    if re.search(r"(?:reversal|refund|退款|退回|返现|cash\s*back|received|income|salary|deposit|credit|到账|入账|转入)", value, re.I):
        return False
    return bool(re.search(r"(?:tesco|sainsbury|aldi|lidl|morrisons|waitrose|amazon|apple\.com/bill|hyperoptic|myprinting|imart|oriental|stores?\s+[0-9]{3,6})", value, re.I))


def is_date_like_number(value):
    return (1900 <= value <= 2100) or (float(value).is_integer() and 101 <= value <= 1231)


def infer_bill_type(text):
    normalized = re.sub(r"(?:收款方|收款账户|收款账号|收款人|收款商户|收款单位)", " ", str(text or ""))
    if re.search(r"(?:转账|转出|transfer)", normalized, re.I):
        return "转账"
    if is_likely_expense_charge_line(normalized):
        return "支出"
    if has_positive_amount(normalized):
        return "收入"
    if re.search(r"(?:工资|薪资|奖金|收入|到账|退款|退回|转入|入账|已收款|received|income|salary|refund|deposit|paid\s+in|credit)", normalized, re.I):
        return "收入"
    return "支出"


def has_positive_amount(text):
    stripped = strip_date_and_time_parts(text)
    return bool(re.search(r"(^|[^\d])\+\s*(?:¥|RMB|CNY|人民币|£|GBP|英镑|\$|USD|美元|€|EUR|欧元|元)?\s*[0-9][0-9,]*(?:\.[0-9]{1,2})?", stripped, re.I))


def infer_income_category(text):
    if re.search(r"(?:工资|薪资|奖金|公司|salary|payroll|bonus)", text, re.I):
        return "工资"
    if re.search(r"(?:存入|储蓄|deposit|saving)", text, re.I):
        return "储蓄"
    return "其他"


def infer_category(text):
    lower = str(text or "").lower()
    rules = [
        ("餐饮", ["餐", "饭", "咖啡", "奶茶", "外卖", "面包", "餐厅", "火锅", "食堂", "starbucks", "kfc", "mcdonald", "food", "guo h"]),
        ("交通", ["地铁", "公交", "打车", "车票", "高铁", "停车", "bus", "ticket", "train", "uber"]),
        ("购物", ["淘宝", "京东", "购物", "商场", "服饰", "电商", "超市", "tesco", "sainsbury", "amazon", "imart"]),
        ("住房", ["房租", "物业", "租金", "hyperoptic"]),
        ("娱乐", ["电影", "会员", "游戏", "音乐", "娱乐", "apple.com/bill"]),
        ("医疗", ["医院", "药", "门诊"]),
        ("教育", ["课程", "书", "培训", "教育", "myprinting"]),
        ("水电", ["水费", "电费", "燃气", "话费", "宽带"]),
    ]
    for category, keys in rules:
        if any(key in lower for key in keys):
            return category
    return "其他"


def infer_merchant(text, category):
    labeled = re.search(r"(?:商户|店铺|收款方|付款给|交易对象|Merchant)[:：\s]*([^\n]+)", text, re.I)
    if labeled:
        candidate = clean_merchant_candidate(labeled.group(1))
        if candidate:
            return candidate
    lines = [clean_merchant_candidate(part) for part in re.split(r"\n|\s{2,}", text)]
    for line in lines:
        if 2 <= len(line) <= 24:
            return line
    return category


def clean_merchant_candidate(value):
    candidate = str(value or "")
    candidate = re.sub(r"\.(png|jpg|jpeg|webp|heic)$", "", candidate, flags=re.I)
    candidate = re.sub(r"(?:实付|实际支付|付款金额|支付金额|应付|合计|总计|金额|时间|日期|订单|交易|账单|收据|小票)[:：]?", "", candidate)
    candidate = re.sub(r"[+-]?\s*(?:¥|RMB|CNY|人民币|£|GBP|英镑|\$|USD|美元|€|EUR|欧元|元)\s*[0-9][0-9,]*(?:\.[0-9]{1,2})?", "", candidate, flags=re.I)
    candidate = re.sub(r"[+-]?\s*[0-9][0-9,]*(?:\.[0-9]{1,2})?\s*(?:元|GBP|CNY|USD|EUR)?", "", candidate, flags=re.I)
    candidate = re.sub(r"[0-9]{4}[-/.年][0-9]{1,2}[-/.月][0-9]{1,2}日?", "", candidate)
    candidate = re.sub(r"[0-9]{1,2}[:：][0-9]{2}(?::[0-9]{2})?", "", candidate)
    candidate = re.sub(r"(?:^|\s)[上士土]\s*$", "", candidate)
    candidate = re.sub(r"(?:微信支付|支付宝|银行卡|Apple\s*Pay|支付成功|交易成功)", "", candidate, flags=re.I)
    candidate = re.sub(r"[+-]", "", candidate).strip()
    if not candidate or re.match(r"^[0-9¥£$€:：.\-/\s]+$", candidate):
        return ""
    if re.match(r"^(微信|支付宝|银行卡|Apple Pay|支付成功|交易成功)$", candidate, re.I):
        return ""
    return candidate[:24]


def infer_payment_method(text):
    return infer_explicit_payment_method(text) or "支付宝"


def infer_explicit_payment_method(text):
    if "微信" in text:
        return "微信"
    if "支付宝" in text:
        return "支付宝"
    if re.search(r"apple\s*pay", text, re.I):
        return "Apple Pay"
    if "银行" in text or "银行卡" in text or re.search(r"card|visa|mastercard", text, re.I):
        return "银行卡"
    return ""


def extract_date(text):
    normalized = normalize_receipt_text(text)
    time_match = re.search(r"([01]?[0-9]|2[0-3])[:：]([0-5][0-9])(?:[:：][0-5][0-9])?", normalized)
    time_text = f"{time_match.group(1).zfill(2)}:{time_match.group(2)}" if time_match else "12:00"
    patterns = [
        re.compile(r"((?:19|20)[0-9]{2})[-/.年\s]+([0-9]{1,2})[-/.月\s]+([0-9]{1,2})日?"),
        re.compile(r"([0-9]{1,2})[-/.月\s]+([0-9]{1,2})[-/.日\s]+((?:19|20)[0-9]{2})"),
        re.compile(r"([0-9]{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+((?:19|20)[0-9]{2})", re.I),
        re.compile(r"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+([0-9]{1,2}),?\s+((?:19|20)[0-9]{2})", re.I),
    ]
    for pattern in patterns:
        match = pattern.search(normalized)
        if not match:
            continue
        parts = normalize_date_match(match)
        if not parts:
            continue
        try:
            dt = datetime.fromisoformat(f"{parts['year']}-{parts['month']}-{parts['day']}T{time_text}")
            return dt.isoformat(timespec="milliseconds") + "Z"
        except ValueError:
            continue
    return None


def normalize_date_match(match):
    g = match.groups()
    if re.match(r"^[0-9]{4}$", g[0]):
        return {"year": g[0], "month": g[1].zfill(2), "day": g[2].zfill(2)}
    if re.match(r"^[A-Za-z]+$", g[0]):
        month = MONTHS.get(g[0][:4].lower()) or MONTHS.get(g[0][:3].lower())
        return {"year": g[2], "month": month, "day": g[1].zfill(2)}
    if re.match(r"^[A-Za-z]+$", g[1]):
        month = MONTHS.get(g[1][:4].lower()) or MONTHS.get(g[1][:3].lower())
        return {"year": g[2], "month": month, "day": g[0].zfill(2)}
    return {"year": g[2], "month": g[1].zfill(2), "day": g[0].zfill(2)}


def strip_date_and_time_parts(text):
    value = str(text or "")
    value = re.sub(r"(^|[^\d])((?:19|20)[0-9]{2}[-/.年\s]+[0-9]{1,2}[-/.月\s]+[0-9]{1,2}日?)(?=$|[^\d])", r"\1 ", value)
    value = re.sub(r"(^|[^\d])([0-9]{1,2}[-/.月\s]+[0-9]{1,2}[-/.日\s]+(?:19|20)[0-9]{2})(?=$|[^\d])", r"\1 ", value)
    value = re.sub(r"(^|[^\d])([0-9]{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+(?:19|20)[0-9]{2})(?=$|[^\d])", r"\1 ", value, flags=re.I)
    value = re.sub(r"(^|[^\d])((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+[0-9]{1,2},?\s+(?:19|20)[0-9]{2})(?=$|[^\d])", r"\1 ", value, flags=re.I)
    value = re.sub(r"(?:日期|时间|Date|Time)[:：\s]*", " ", value, flags=re.I)
    value = re.sub(r"[0-9]{1,2}[:：][0-9]{2}(?:[:：][0-9]{2})?", " ", value)
    return value


def is_date_only_line(line):
    stripped = re.sub(r"[^\dA-Za-z\u4e00-\u9fa5]", "", strip_date_and_time_parts(line)).strip()
    return bool(extract_date(line)) and len(stripped) == 0


def is_date_summary_line(line):
    if not extract_date(line) or not has_money_signal(line):
        return False
    stripped = strip_date_and_time_parts(line)
    stripped = re.sub(r"[+-]?\s*(?:¥|RMB|CNY|人民币|£|GBP|英镑|\$|USD|美元|€|EUR|欧元|元)\s*[0-9][0-9,]*(?:\.[0-9]{1,2})?", " ", stripped, flags=re.I)
    stripped = re.sub(r"[+-]?\s*[0-9][0-9,]*(?:\.[0-9]{1,2})?\s*(?:元|GBP|CNY|USD|EUR)?", " ", stripped, flags=re.I)
    stripped = re.sub(r"\b(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Mon|Tue|Tues|Wed|Thu|Thur|Fri|Sat|Sun)\b", " ", stripped, flags=re.I)
    stripped = re.sub(r"[,\\-–—|·\s]", "", stripped).strip()
    return len(stripped) == 0


def scan_confidence(text, amount):
    score = 0.58
    if amount > 0:
        score += 0.18
    if extract_date(text):
        score += 0.08
    if re.search(r"(?:商户|店铺|收款方|付款给|合计|总计|实付|支付金额|Amount|Total)", text, re.I):
        score += 0.08
    if re.search(r"(?:微信|支付宝|银行卡|Apple Pay|¥|£|\$|€|GBP|CNY|USD|EUR)", text, re.I):
        score += 0.06
    return min(0.96, score)


class LedgerHandler(BaseHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Accept")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/health":
            return self.json_response({"ok": True, "database": str(DB_PATH)})
        if path == "/api/state":
            return self.json_response(read_state())
        if path == "/api/bills":
            return self.json_response(read_state().get("bills", []))
        if path == "/api/settings":
            return self.json_response(read_state().get("settings", {}))
        return self.serve_static(path)

    def do_PUT(self):
        path = urlparse(self.path).path
        if path != "/api/state":
            return self.json_response({"error": "Not found"}, 404)
        state = self.read_json()
        if not isinstance(state, dict):
            return self.json_response({"error": "Invalid JSON body"}, 400)
        write_state(state)
        return self.json_response({"ok": True})

    def do_POST(self):
        path = urlparse(self.path).path
        if path == "/api/ocr/parse":
            body = self.read_json()
            if not isinstance(body, dict) or not str(body.get("text", "")).strip():
                return self.json_response({"error": "Text is required"}, 400)
            return self.json_response({"items": parse_ocr_text(body.get("text", ""))})
        state = read_state()
        if path == "/api/bills":
            bill = self.read_json()
            if not isinstance(bill, dict) or not bill.get("id"):
                return self.json_response({"error": "Bill requires an id"}, 400)
            state.setdefault("bills", []).insert(0, bill)
            write_state(state)
            return self.json_response(bill, 201)
        if path == "/api/reset":
            state = default_state()
            write_state(state)
            return self.json_response(state)
        return self.json_response({"error": "Not found"}, 404)

    def do_DELETE(self):
        path = urlparse(self.path).path
        if not path.startswith("/api/bills/"):
            return self.json_response({"error": "Not found"}, 404)
        bill_id = path.split("/", 3)[-1]
        state = read_state()
        state["bills"] = [item for item in state.get("bills", []) if item.get("id") != bill_id]
        write_state(state)
        return self.json_response({"ok": True})

    def read_json(self):
        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0:
            return None
        return json.loads(self.rfile.read(length).decode("utf-8"))

    def json_response(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def serve_static(self, path):
        target = WEB_ROOT / ("index.html" if path in ("", "/") else path.lstrip("/"))
        try:
            target = target.resolve()
            target.relative_to(WEB_ROOT.resolve())
        except ValueError:
            return self.json_response({"error": "Forbidden"}, 403)
        if not target.exists() or target.is_dir():
            target = WEB_ROOT / "index.html"
        content_type = "text/html; charset=utf-8"
        if target.suffix == ".css":
            content_type = "text/css; charset=utf-8"
        elif target.suffix == ".js":
            content_type = "application/javascript; charset=utf-8"
        elif target.suffix == ".wasm":
            content_type = "application/wasm"
        elif target.suffix == ".gz":
            content_type = "application/gzip"
        body = target.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        print(f"{self.address_string()} - {fmt % args}")


if __name__ == "__main__":
    connect().close()
    print(f"Smart Ledger backend running at http://{HOST}:{PORT}")
    print(f"SQLite database: {DB_PATH}")
    ThreadingHTTPServer((HOST, PORT), LedgerHandler).serve_forever()
