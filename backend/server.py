#!/usr/bin/env python3
import json
import sqlite3
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
WEB_ROOT = ROOT / "web-ledger"
DB_PATH = ROOT / "backend" / "data" / "ledger.db"
HOST = "127.0.0.1"
PORT = 4183


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
