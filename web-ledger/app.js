const STORAGE_KEY = "smart-ledger-web-v1";
const API_STATE_PATH = "/api/state";

const categories = ["餐饮", "交通", "购物", "住房", "娱乐", "医疗", "教育", "水电", "工资", "储蓄", "其他"];
const expenseCategories = ["餐饮", "交通", "购物", "住房", "娱乐", "医疗", "教育", "水电", "其他"];
const types = ["支出", "收入", "转账"];
const sources = ["手动", "AI 扫描", "导入", "周期"];
const paymentMethods = ["微信", "支付宝", "银行卡", "Apple Pay"];
const currencies = [
  { code: "GBP", label: "英镑 GBP" },
  { code: "CNY", label: "人民币 CNY" },
  { code: "USD", label: "美元 USD" },
  { code: "EUR", label: "欧元 EUR" }
];
const exchangeRatesFromGBP = {
  GBP: 1,
  CNY: 9.1,
  USD: 1.27,
  EUR: 1.17
};
const routeLabels = {
  dashboard: { zh: "首页", en: "Home" },
  bills: { zh: "账单", en: "Bills" },
  scanner: { zh: "AI 扫描", en: "AI Scan" },
  stats: { zh: "统计", en: "Stats" },
  budget: { zh: "预算", en: "Budget" },
  advisor: { zh: "AI 建议", en: "AI Advice" },
  settings: { zh: "设置", en: "Settings" }
};
const valueLabels = {
  "餐饮": "Food",
  "交通": "Transport",
  "购物": "Shopping",
  "住房": "Housing",
  "娱乐": "Entertainment",
  "医疗": "Medical",
  "教育": "Education",
  "水电": "Utilities",
  "工资": "Salary",
  "储蓄": "Savings",
  "其他": "Other",
  "支出": "Expense",
  "收入": "Income",
  "转账": "Transfer",
  "手动": "Manual",
  "AI 扫描": "AI Scan",
  "导入": "Import",
  "周期": "Recurring",
  "微信": "WeChat",
  "支付宝": "Alipay",
  "银行卡": "Bank Card",
  "移动支付": "Mobile Pay",
  "全部类型": "All Types",
  "全部分类": "All Categories",
  "按日": "Daily",
  "按月": "Monthly",
  "按年": "Yearly",
  "英镑 GBP": "Pound GBP",
  "人民币 CNY": "Chinese Yuan CNY",
  "美元 USD": "US Dollar USD",
  "欧元 EUR": "Euro EUR"
  ,
  "午餐": "Lunch",
  "咖啡": "Coffee",
  "打车": "Taxi",
  "超市": "Supermarket",
  "公司": "Company",
  "房租": "Rent",
  "面包店": "Bakery",
  "电商平台": "Online Store",
  "电影": "Cinema",
  "视频会员": "Video Subscription",
  "月工资": "Monthly salary",
  "固定支出": "Fixed expense",
  "生活用品": "Daily supplies",
  "自动续费": "Auto renewal"
};
const i18n = {
  zh: {
    appTitle: "智能记账 Web",
    brand: "智能记账",
    navLabel: "主导航",
    eyebrow: "本地演示版 · 自动保存",
    seedData: "恢复演示数据",
    quickAdd: "新增账单",
    displayCurrencyTitle: "展示币种",
    displayCurrencyDesc: "切换后首页、账单、统计、预算和 AI 建议会自动换算显示。",
    monthlyTrend: "本月支出趋势",
    categoryShare: "分类占比",
    viewStats: "查看统计",
    recentBills: "最近账单",
    manageBills: "管理账单",
    billManagement: "账单管理",
    billManagementDesc: "支持新增、编辑、删除、查询和组合筛选。",
    deleteSelected: "删除选中",
    searchPlaceholder: "搜索商户、账户、备注",
    clearFilters: "清空筛选",
    scannerTitle: "AI 扫描识别",
    scannerDesc: "使用免费浏览器 OCR 识别图片，也可以粘贴账单文字自动提取字段。",
    uploadReceipt: "上传票据或支付截图",
    uploadHint: "免费 OCR 在本机浏览器运行，首次加载会稍慢",
    noImage: "暂无图片",
    receiptPlaceholder: "也可以粘贴账单文字，例如：面包店 合计 ¥128 2026-05-17 12:30 支付宝",
    autoAdd: "识别后自动添加到账单",
    recognize: "AI 识别账单",
    sampleReceipt: "使用示例票据",
    scanResult: "识别结果",
    waitingScan: "等待识别",
    statsTitle: "统计分析",
    statsDesc: "按日、月、年查看收入、支出、结余和分类结构。",
    expenseBar: "支出柱状图",
    categoryRank: "分类排名",
    budgetTitle: "预算与收入",
    budgetDesc: "设置月收入、月预算、储蓄目标和预警阈值。",
    budgetAlert: "预算预警",
    categoryBudget: "分类预算",
    advisorTitle: "AI 财务建议",
    advisorDesc: "基于收入、预算和历史消费，分析应控制的花销并建议工资分配。",
    salaryPlan: "工资分配建议",
    spendingAdvice: "消费控制建议",
    settingsTitle: "数据上传与设置",
    settingsDesc: "导入 CSV、导出演示数据或清空本地缓存。",
    uploadData: "上传账单数据",
    importCsv: "导入 CSV",
    exportCsv: "导出 CSV",
    localData: "本地数据",
    localDataDesc: "所有账单和预算数据会保存在当前浏览器的 localStorage 中，适合演示和原型评审。",
    copyTemplate: "复制 CSV 模板",
    clearAll: "清空全部数据",
    close: "关闭",
    cancel: "取消",
    save: "保存",
    editBill: "编辑账单",
    addBill: "新增账单",
    languageTitle: "切换语言",
    langButton: "中",
    currencyDisplay: "展示",
    table: { date: "日期", type: "类型", category: "分类", merchant: "商户", payment: "支付方式", currency: "币种", amount: "金额", note: "备注", source: "来源", actions: "操作" }
  },
  en: {
    appTitle: "Smart Ledger Web",
    brand: "Smart Ledger",
    navLabel: "Primary navigation",
    eyebrow: "Local demo · Autosaved",
    seedData: "Restore Demo",
    quickAdd: "Add Bill",
    displayCurrencyTitle: "Display Currency",
    displayCurrencyDesc: "Switch currency for Home, Bills, Stats, Budget, and AI Advice.",
    monthlyTrend: "Monthly Spending Trend",
    categoryShare: "Category Share",
    viewStats: "View Stats",
    recentBills: "Recent Bills",
    manageBills: "Manage Bills",
    billManagement: "Bill Management",
    billManagementDesc: "Create, edit, delete, search, and filter bills.",
    deleteSelected: "Delete Selected",
    searchPlaceholder: "Search merchant, account, or notes",
    clearFilters: "Clear Filters",
    scannerTitle: "AI Receipt Scan",
    scannerDesc: "Use free browser OCR for images, or paste receipt text to extract fields.",
    uploadReceipt: "Upload receipt or payment screenshot",
    uploadHint: "Free OCR runs locally in your browser. First load may be slower.",
    noImage: "No image",
    receiptPlaceholder: "Paste receipt text, e.g. Bakery Total £12.80 2026-05-17 12:30 Alipay",
    autoAdd: "Auto-add after recognition",
    recognize: "Recognize Bill",
    sampleReceipt: "Use Sample Receipt",
    scanResult: "Scan Result",
    waitingScan: "Waiting",
    statsTitle: "Analytics",
    statsDesc: "View income, spending, balance, and category structure by day, month, or year.",
    expenseBar: "Spending Bar Chart",
    categoryRank: "Category Ranking",
    budgetTitle: "Budget & Income",
    budgetDesc: "Set monthly income, budget, savings target, and alert threshold.",
    budgetAlert: "Budget Alert",
    categoryBudget: "Category Budget",
    advisorTitle: "AI Financial Advice",
    advisorDesc: "Analyze spending control points and salary allocation from income, budget, and history.",
    salaryPlan: "Salary Allocation",
    spendingAdvice: "Spending Control Advice",
    settingsTitle: "Data Upload & Settings",
    settingsDesc: "Import CSV, export demo data, or clear local cache.",
    uploadData: "Upload Bill Data",
    importCsv: "Import CSV",
    exportCsv: "Export CSV",
    localData: "Local Data",
    localDataDesc: "Bills and budget data are stored in this browser's localStorage, suitable for demos and prototype reviews.",
    copyTemplate: "Copy CSV Template",
    clearAll: "Clear All Data",
    close: "Close",
    cancel: "Cancel",
    save: "Save",
    editBill: "Edit Bill",
    addBill: "Add Bill",
    languageTitle: "Switch language",
    langButton: "EN",
    currencyDisplay: "display",
    table: { date: "Date", type: "Type", category: "Category", merchant: "Merchant", payment: "Payment", currency: "Currency", amount: "Amount", note: "Note", source: "Source", actions: "Actions" }
  }
};
const quickPresets = [
  { label: "午餐", amount: 38, category: "餐饮", account: "支付宝" },
  { label: "咖啡", amount: 28, category: "餐饮", account: "微信" },
  { label: "打车", amount: 26, category: "交通", account: "微信" },
  { label: "超市", amount: 88, category: "购物", account: "支付宝" }
];
const categoryColors = {
  "餐饮": "#ea580c",
  "交通": "#0496b2",
  "购物": "#7c3aed",
  "住房": "#214fd3",
  "娱乐": "#dc2626",
  "医疗": "#149c5a",
  "教育": "#214fd3",
  "水电": "#ea580c",
  "工资": "#149c5a",
  "储蓄": "#149c5a",
  "其他": "#637083"
};

let apiBase = "";
let apiEnabled = false;
let state = loadState();
let currentRoute = "dashboard";
let editingBillId = null;
let scanDraft = null;
let receiptPreviewUrl = "";
const selectedBillIds = new Set();

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function seedBills() {
  const now = new Date();
  const date = (offset, hour, minute = 0) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offset);
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
  };

  return [
    bill({ type: "收入", amount: 12000, category: "工资", date: date(-4, 9), merchant: "公司", account: "银行卡", note: "月工资" }),
    bill({ type: "支出", amount: 3000, category: "住房", date: date(-3, 8), merchant: "房租", account: "银行卡", note: "固定支出" }),
    bill({ type: "支出", amount: 38, category: "餐饮", date: date(0, 12, 20), merchant: "午餐", account: "支付宝" }),
    bill({ type: "支出", amount: 26, category: "交通", date: date(0, 8, 42), merchant: "打车", account: "微信" }),
    bill({ type: "支出", amount: 128, category: "餐饮", date: date(-1, 19, 40), merchant: "面包店", account: "支付宝", source: "AI 扫描", confidence: 0.92 }),
    bill({ type: "支出", amount: 268, category: "购物", date: date(-2, 21, 15), merchant: "电商平台", account: "微信", note: "生活用品" }),
    bill({ type: "支出", amount: 68, category: "娱乐", date: date(-5, 20), merchant: "电影", account: "支付宝" }),
    bill({ type: "支出", amount: 18, category: "娱乐", date: date(-6, 9), merchant: "视频会员", account: "银行卡", note: "自动续费" })
  ];
}

function defaultState() {
  return {
    bills: seedBills(),
    settings: {
      monthlyIncome: 12000,
      monthlyBudget: 8000,
      savingsGoal: 2400,
      displayCurrency: "GBP",
      language: "zh",
      warningThreshold: 0.8,
      dangerThreshold: 1,
      severeThreshold: 1.2,
      categoryBudgets: {
        "餐饮": 1800,
        "交通": 600,
        "购物": 1200,
        "住房": 3000,
        "娱乐": 800,
        "医疗": 600,
        "教育": 800,
        "水电": 500,
        "其他": 600
      }
    },
    filters: {
      query: "",
      type: "全部类型",
      category: "全部分类",
      dateFrom: "",
      dateTo: ""
    },
    statsScope: "month"
  };
}

function bill(overrides) {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    type: "支出",
    amount: 0,
    category: "其他",
    date: now,
    merchant: "未命名账单",
    account: "支付宝",
    paymentMethod: "移动支付",
    currency: "GBP",
    note: "",
    tags: [],
    source: "手动",
    confidence: null,
    createdAt: now,
    updatedAt: now,
    ...overrides
  };
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return defaultState();
  try {
    const parsed = JSON.parse(saved);
    return { ...defaultState(), ...parsed, settings: { ...defaultState().settings, ...parsed.settings } };
  } catch {
    return defaultState();
  }
}

function savedLocalState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try {
    return mergeState(JSON.parse(saved));
  } catch {
    return null;
  }
}

function apiBaseCandidates() {
  const candidates = [];
  if (window.LEDGER_API_BASE) candidates.push(window.LEDGER_API_BASE);
  if (window.location.protocol.startsWith("http")) candidates.push(window.location.origin);
  candidates.push("http://127.0.0.1:4183");
  return [...new Set(candidates)].map((value) => String(value || "").replace(/\/$/, ""));
}

async function loadStateFromAPI() {
  for (const base of apiBaseCandidates()) {
    try {
      const response = await fetch(`${base}${API_STATE_PATH}`, { headers: { Accept: "application/json" } });
      if (!response.ok) continue;
      const remoteState = await response.json();
      apiBase = base;
      apiEnabled = true;
      return mergeState(remoteState);
    } catch {
      // Keep localStorage fallback when the backend is not running.
    }
  }
  apiEnabled = false;
  return null;
}

function mergeState(remoteState) {
  const defaults = defaultState();
  return {
    ...defaults,
    ...remoteState,
    bills: Array.isArray(remoteState?.bills) ? remoteState.bills : defaults.bills,
    settings: { ...defaults.settings, ...(remoteState?.settings || {}) },
    filters: { ...defaults.filters, ...(remoteState?.filters || {}) },
    statsScope: remoteState?.statsScope || defaults.statsScope
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (apiEnabled) saveStateToAPI();
}

function saveStateToAPI() {
  clearTimeout(saveStateToAPI.timer);
  saveStateToAPI.timer = setTimeout(async () => {
    try {
      const response = await fetch(`${apiBase}${API_STATE_PATH}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state)
      });
      if (!response.ok) throw new Error(`API save failed: ${response.status}`);
    } catch (error) {
      console.warn(error);
      apiEnabled = false;
    }
  }, 150);
}

function language() {
  return state.settings.language === "en" ? "en" : "zh";
}

function t(path) {
  const parts = path.split(".");
  let value = i18n[language()];
  for (const part of parts) value = value?.[part];
  return value ?? path;
}

function label(value) {
  if (language() !== "en") return value;
  return valueLabels[value] || value;
}

function locale() {
  return language() === "en" ? "en-GB" : "zh-CN";
}

function money(value, fromCurrency = "GBP") {
  return formatMoney(convertAmount(value || 0, fromCurrency, displayCurrency()), displayCurrency());
}

function formatMoney(value, currency = "GBP") {
  const code = currencies.some((item) => item.code === currency) ? currency : "GBP";
  return new Intl.NumberFormat(locale(), {
    style: "currency",
    currency: code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value || 0);
}

function displayCurrency() {
  return normalizeCurrency(state.settings.displayCurrency || "GBP");
}

function convertAmount(value, fromCurrency = "GBP", toCurrency = "GBP") {
  const from = normalizeCurrency(fromCurrency);
  const to = normalizeCurrency(toCurrency);
  const amountInGBP = Number(value || 0) / exchangeRatesFromGBP[from];
  return amountInGBP * exchangeRatesFromGBP[to];
}

function percent(value) {
  return new Intl.NumberFormat(locale(), { style: "percent", maximumFractionDigits: 0 }).format(value || 0);
}

function formatDate(value, withTime = true) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  const options = withTime
    ? { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }
    : { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Intl.DateTimeFormat(locale(), options).format(date);
}

function inputDate(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function inputDateTime(value) {
  const date = value ? new Date(value) : new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;");
}

function safeText(value) {
  return String(value ?? "").trim();
}

function displayText(value) {
  const text = safeText(value);
  return text || "-";
}

function displayValue(value) {
  const text = displayText(value);
  return text === "-" ? text : label(text);
}

function displayBillAmount(item) {
  if (item.amount === "" || item.amount === null || item.amount === undefined) return "-";
  const amount = Number(item.amount);
  if (!Number.isFinite(amount)) return "-";
  const sign = item.type === "收入" ? "+" : item.type === "支出" ? "-" : "";
  return `${sign}${money(amount, item.currency)}`;
}

function billAmountClass(item) {
  if (item.type === "收入") return "income";
  if (item.type === "支出") return "expense";
  return "";
}

function billTimestamp(item) {
  const time = new Date(item.date).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function setRoute(route) {
  currentRoute = route;
  $$(".nav-item").forEach((item) => item.classList.toggle("is-active", item.dataset.route === route));
  $$(".view").forEach((view) => view.classList.toggle("is-active", view.dataset.view === route));
  $("#pageTitle").textContent = routeLabels[route]?.[language()] ?? t("brand");
  renderAll();
}

function snapshot(scope = "month") {
  const scoped = scopedBills(scope);
  const income = scoped.filter((item) => item.type === "收入").reduce((sum, item) => sum + convertAmount(item.amount, item.currency, "GBP"), 0);
  const expense = scoped.filter((item) => item.type === "支出").reduce((sum, item) => sum + convertAmount(item.amount, item.currency, "GBP"), 0);
  return {
    income,
    expense,
    balance: income - expense,
    budgetUsage: state.settings.monthlyBudget > 0 ? expense / state.settings.monthlyBudget : 0
  };
}

function scopedBills(scope = "month", base = new Date()) {
  return state.bills.filter((item) => {
    const date = new Date(item.date);
    if (Number.isNaN(date.getTime())) return false;
    if (scope === "day") return sameDay(date, base);
    if (scope === "year") return date.getFullYear() === base.getFullYear();
    return date.getFullYear() === base.getFullYear() && date.getMonth() === base.getMonth();
  });
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function categoryTotals(scope = "month") {
  const totals = new Map();
  scopedBills(scope)
    .filter((item) => item.type === "支出")
    .forEach((item) => totals.set(item.category, (totals.get(item.category) ?? 0) + convertAmount(item.amount, item.currency, "GBP")));
  return Array.from(totals.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

function budgetSeverity() {
  const usage = snapshot("month").budgetUsage;
  if (usage >= state.settings.dangerThreshold) return "danger";
  if (usage >= state.settings.warningThreshold) return "warning";
  return "success";
}

function renderAll() {
  applyStaticI18n();
  renderStorageMode();
  renderDashboard();
  renderBillFilters();
  renderBillTable();
  renderScanDraft();
  renderStats();
  renderBudget();
  renderAdvisor();
}

function renderStorageMode() {
  const eyebrow = $(".eyebrow");
  if (!eyebrow) return;
  if (language() === "en") {
    eyebrow.textContent = apiEnabled ? "Backend database · Autosaved" : "Local demo · Autosaved";
  } else {
    eyebrow.textContent = apiEnabled ? "后台数据库 · 自动保存" : "本地演示版 · 自动保存";
  }
}

function applyStaticI18n() {
  document.documentElement.lang = language() === "en" ? "en" : "zh-CN";
  document.title = t("appTitle");
  $("#brandName").textContent = t("brand");
  $(".nav").setAttribute("aria-label", t("navLabel"));
  Object.entries(routeLabels).forEach(([route, labels]) => {
    const item = $(`.nav-item[data-route="${route}"]`);
    if (item) item.textContent = labels[language()];
  });
  $("#pageTitle").textContent = routeLabels[currentRoute]?.[language()] ?? t("brand");
  $(".eyebrow").textContent = t("eyebrow");
  $("#seedDataBtn").textContent = t("seedData");
  $("#quickAddBtn").textContent = t("quickAdd");
  $("#languageToggle").textContent = t("langButton");
  $("#languageToggle").setAttribute("aria-label", t("languageTitle"));
  $("#languageToggle").setAttribute("title", t("languageTitle"));
  const staticText = {
    ".display-currency-panel h2": "displayCurrencyTitle",
    ".display-currency-panel p": "displayCurrencyDesc",
    "#dashboardView .large .panel-head h2": "monthlyTrend",
    "#categoryBreakdown": "",
    "#dashboardView .content-grid .panel:not(.large) .panel-head h2": "categoryShare",
    "[data-jump='stats']": "viewStats",
    "#dashboardView > .panel:last-child .panel-head h2": "recentBills",
    "[data-jump='bills']": "manageBills",
    "#billsView h2": "billManagement",
    "#billsView .panel-head p": "billManagementDesc",
    "#addBillBtn": "addBill",
    "#clearFiltersBtn": "clearFilters",
    "#scannerView h2": "scannerTitle",
    "#scannerView .panel-head p": "scannerDesc",
    ".upload-box span": "uploadReceipt",
    ".upload-box small": "uploadHint",
    "#autoAddToggle + span": "autoAdd",
    "#recognizeBtn": "recognize",
    "#sampleScanBtn": "sampleReceipt",
    "#scannerView .content-grid > .panel:nth-child(2) h2": "scanResult",
    "#statsView h2": "statsTitle",
    "#statsView .panel-head p": "statsDesc",
    "#statsView .panel.inset:first-child h3": "expenseBar",
    "#statsView .panel.inset:nth-child(2) h3": "categoryRank",
    "#budgetView h2": "budgetTitle",
    "#budgetView .panel-head p": "budgetDesc",
    "#budgetView .content-grid > .panel:nth-child(2) h2": "budgetAlert",
    "#budgetView .content-grid > .panel:nth-child(2) h3": "categoryBudget",
    "#advisorView h2": "advisorTitle",
    "#advisorView .panel-head p": "advisorDesc",
    "#advisorView .panel.inset:first-child h3": "salaryPlan",
    "#advisorView .panel.inset:nth-child(2) h3": "spendingAdvice",
    "#settingsView h2": "settingsTitle",
    "#settingsView .panel-head p": "settingsDesc",
    "#settingsView .panel.inset:first-child h3": "uploadData",
    "#importCsvBtn": "importCsv",
    "#downloadCsvBtn": "exportCsv",
    "#settingsView .panel.inset:nth-child(2) h3": "localData",
    "#settingsView .panel.inset:nth-child(2) p": "localDataDesc",
    "#copyTemplateBtn": "copyTemplate",
    "#clearAllBtn": "clearAll",
    "#billDialog .dialog-actions .ghost-btn": "cancel",
    "#saveBillBtn": "save"
  };
  Object.entries(staticText).forEach(([selector, key]) => {
    if (!key) return;
    const node = $(selector);
    if (node) node.textContent = t(key);
  });
  $("#searchInput").placeholder = t("searchPlaceholder");
  $("#receiptText").placeholder = t("receiptPlaceholder");
  $("#csvPaste").placeholder = language() === "en"
    ? "type,amount,currency,category,date,merchant,account,note\nExpense,38,GBP,Food,2026-05-17,Lunch,Alipay,Weekday lunch"
    : "type,amount,currency,category,date,merchant,account,note\n支出,38,GBP,餐饮,2026-05-17,午餐,支付宝,工作日午餐";
  if ($("#imagePreview").classList.contains("is-empty")) $("#imagePreview").textContent = t("noImage");
  $("[value='day']").textContent = label("按日");
  $("[value='month']").textContent = label("按月");
  $("[value='year']").textContent = label("按年");
  $$("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  $("#selectAllBills").setAttribute("aria-label", language() === "en" ? "Select all bills" : "全选账单");
  $("#billDialog .icon-btn").setAttribute("aria-label", t("close"));
  $("#imagePreviewTitle").textContent = language() === "en" ? "Image Preview" : "图片预览";
  $("#closeImagePreviewBtn").setAttribute("aria-label", t("close"));
}

function metricHTML(title, value, note, accent) {
  return `
    <article class="metric-card accent-${accent}">
      <span>${escapeHTML(title)}</span>
      <strong>${escapeHTML(value)}</strong>
      <small>${escapeHTML(note)}</small>
    </article>
  `;
}

function renderDashboard() {
  const snap = snapshot("month");
  const displayCode = displayCurrency();
  $("#displayCurrency").innerHTML = currencyOptions(displayCode);
  $("#dashboardMetrics").innerHTML = [
    metricHTML(language() === "en" ? "Monthly Income" : "本月收入", money(snap.income), language() === "en" ? "Salary and other income" : "工资和其他收入", "green"),
    metricHTML(language() === "en" ? "Monthly Spending" : "本月支出", money(snap.expense), `${language() === "en" ? "Budget used" : "预算使用"} ${percent(snap.budgetUsage)}`, "orange"),
    metricHTML(language() === "en" ? "Monthly Balance" : "本月结余", money(snap.balance), language() === "en" ? "Income minus spending" : "收入减支出", "blue"),
    metricHTML(language() === "en" ? "Savings Goal" : "储蓄目标", money(state.settings.savingsGoal), language() === "en" ? "Save first, spend later" : "建议先存后花", "purple")
  ].join("");

  const advice = buildAdvice()[0];
  $("#budgetAlert").innerHTML = alertHTML(advice);
  $("#monthScopeLabel").textContent = language() === "en"
    ? new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date())
    : `${new Date().getFullYear()} 年 ${new Date().getMonth() + 1} 月`;

  renderCategoryBreakdown("#categoryBreakdown", "month");
  renderBillCards("#recentBills", [...state.bills].sort(sortByDate).slice(0, 5));
  drawBarChart($("#trendChart"), currentMonthDailySeries(), "#214fd3");
}

function alertHTML(advice) {
  return `
    <div class="alert ${advice.severity}">
      <span class="pill">${severityText(advice.severity)}</span>
      <div>
        <strong>${escapeHTML(advice.title)}</strong>
        <p>${escapeHTML(advice.message)}</p>
      </div>
    </div>
  `;
}

function severityText(severity) {
  const labels = language() === "en"
    ? { success: "OK", warning: "Reminder", danger: "Alert", info: "Tip" }
    : { success: "正常", warning: "提醒", danger: "预警", info: "建议" };
  return labels[severity] ?? (language() === "en" ? "Notice" : "提示");
}

function renderBillCards(selector, bills) {
  const target = $(selector);
  if (!bills.length) {
    target.innerHTML = `<div class="muted">${language() === "en" ? "No bills yet" : "暂无账单"}</div>`;
    return;
  }
  target.innerHTML = bills.map((item) => `
    <article class="bill-card compact-row">
      <span class="pill">${escapeHTML(displayValue(item.category))}</span>
      <div class="bill-meta">
        <strong>${escapeHTML(displayValue(item.merchant))}</strong>
        <span>${escapeHTML(displayValue(item.paymentMethod || item.account))} · ${escapeHTML(displayCurrency())} ${t("currencyDisplay")} · ${formatDate(item.date)} · ${escapeHTML(displayValue(item.source))}</span>
      </div>
      <div class="amount ${billAmountClass(item)}">
        ${escapeHTML(displayBillAmount(item))}
      </div>
    </article>
  `).join("");
}

function renderBillFilters() {
  $("#typeFilter").innerHTML = optionHTML(["全部类型", ...types], state.filters.type);
  $("#categoryFilter").innerHTML = optionHTML(["全部分类", ...categories], state.filters.category);
  $("#searchInput").value = state.filters.query;
  $("#dateFrom").value = state.filters.dateFrom;
  $("#dateTo").value = state.filters.dateTo;
}

function optionHTML(list, selected) {
  return list.map((value) => `<option value="${escapeHTML(value)}" ${value === selected ? "selected" : ""}>${escapeHTML(label(value))}</option>`).join("");
}

function currencyOptions(selected) {
  return currencies.map((item) => `<option value="${item.code}" ${item.code === selected ? "selected" : ""}>${escapeHTML(label(item.label))}</option>`).join("");
}

function filteredBills() {
  const { query, type, category, dateFrom, dateTo } = state.filters;
  return [...state.bills]
    .filter((item) => {
      const queryText = [item.merchant, item.account, item.paymentMethod, item.note, item.category, item.source]
        .map(safeText)
        .join(" ")
        .toLowerCase();
      const matchesQuery = !query || queryText.includes(query.toLowerCase());
      const matchesType = type === "全部类型" || item.type === type;
      const matchesCategory = category === "全部分类" || item.category === category;
      const time = new Date(item.date).getTime();
      const hasValidTime = !Number.isNaN(time);
      const after = !dateFrom || (hasValidTime && time >= new Date(dateFrom).getTime());
      const before = !dateTo || (hasValidTime && time <= new Date(`${dateTo}T23:59:59`).getTime());
      return matchesQuery && matchesType && matchesCategory && after && before;
    })
    .sort(sortByDate);
}

function sortByDate(a, b) {
  return billTimestamp(b) - billTimestamp(a);
}

function renderBillTable() {
  const bills = filteredBills();
  pruneSelectedBills();
  renderBatchDeleteState(bills);
  $("#billTableBody").innerHTML = bills.length ? bills.map((item) => `
    <tr>
      <td class="select-col">
        <input class="bill-select" type="checkbox" value="${escapeHTML(item.id)}" aria-label="${language() === "en" ? "Select bill" : "选择账单"}" ${selectedBillIds.has(item.id) ? "checked" : ""} />
      </td>
      <td>${formatDate(item.date)}</td>
      <td>${escapeHTML(displayValue(item.type))}</td>
      <td><span class="pill">${escapeHTML(displayValue(item.category))}</span></td>
      <td>${escapeHTML(displayValue(item.merchant))}</td>
      <td>${escapeHTML(displayValue(item.paymentMethod || item.account))}</td>
      <td>${escapeHTML(displayText(item.currency))}</td>
      <td class="align-right amount ${billAmountClass(item)}">${escapeHTML(displayBillAmount(item))}</td>
      <td class="note-col">${escapeHTML(displayValue(item.note))}</td>
      <td>${escapeHTML(displayValue(item.source))}${item.confidence ? ` · ${percent(item.confidence)}` : ""}</td>
      <td class="align-right">
        <div class="row-actions">
          <button class="mini-btn" data-edit="${item.id}" type="button">${language() === "en" ? "Edit" : "编辑"}</button>
          <button class="mini-btn delete" data-delete="${item.id}" type="button">${language() === "en" ? "Delete" : "删除"}</button>
        </div>
      </td>
    </tr>
  `).join("") : `<tr><td colspan="11" class="muted">${language() === "en" ? "No matching bills" : "没有匹配账单"}</td></tr>`;
  renderBatchDeleteState(bills);
}

function pruneSelectedBills() {
  const validIds = new Set(state.bills.map((item) => item.id));
  selectedBillIds.forEach((id) => {
    if (!validIds.has(id)) selectedBillIds.delete(id);
  });
}

function renderBatchDeleteState(visibleBills = filteredBills()) {
  const deleteButton = $("#batchDeleteBtn");
  const selectAll = $("#selectAllBills");
  if (!deleteButton || !selectAll) return;

  const visibleIds = visibleBills.map((item) => item.id);
  const selectedVisibleCount = visibleIds.filter((id) => selectedBillIds.has(id)).length;
  const selectedCount = selectedBillIds.size;
  deleteButton.disabled = selectedCount === 0;
  const baseText = language() === "en" ? "Delete Selected" : "删除选中";
  deleteButton.textContent = selectedCount ? `${baseText} (${selectedCount})` : baseText;
  selectAll.checked = visibleIds.length > 0 && selectedVisibleCount === visibleIds.length;
  selectAll.indeterminate = selectedVisibleCount > 0 && selectedVisibleCount < visibleIds.length;
  selectAll.disabled = visibleIds.length === 0;
}

function deleteSelectedBills() {
  if (!selectedBillIds.size) {
    showToast(language() === "en" ? "Please select bills to delete first" : "请先勾选要删除的账单");
    return;
  }
  const count = selectedBillIds.size;
  if (!confirm(language() === "en" ? `Delete ${count} selected bill(s)?` : `确认删除选中的 ${count} 条账单？`)) return;
  state.bills = state.bills.filter((item) => !selectedBillIds.has(item.id));
  selectedBillIds.clear();
  saveState();
  renderAll();
  showToast(language() === "en" ? `Deleted ${count} bill(s)` : `已删除 ${count} 条账单`);
}

function openBillDialog(targetBill = null) {
  editingBillId = targetBill?.id ?? null;
  $("#billDialogTitle").textContent = targetBill ? t("editBill") : t("addBill");
  const data = targetBill ?? bill({ date: new Date().toISOString(), merchant: "", amount: 0 });
  $("#quickPresets").style.display = targetBill ? "none" : "grid";
  $("#quickPresets").innerHTML = quickPresets.map((preset) => `
    <button class="quick-preset" type="button" data-preset="${escapeHTML(preset.label)}">
      <strong>${escapeHTML(label(preset.label))}</strong>
      <span>${money(preset.amount)} · ${escapeHTML(label(preset.category))}</span>
    </button>
  `).join("");
  $("#billFormFields").innerHTML = billFormFields(data);
  $("#billDialog").showModal();
}

function billFormFields(data) {
  return `
    ${field(language() === "en" ? "Amount" : "金额", `<input id="bill_amount" type="number" min="0" step="0.01" value="${Number(data.amount) || ""}" placeholder="${language() === "en" ? "Amount is enough" : "只填金额也可以"}" autofocus />`)}
    ${field(language() === "en" ? "Currency" : "币种", currencySelect("bill_currency", data.currency || "GBP"))}
    ${field(language() === "en" ? "Payment" : "支付方式", select("bill_payment", paymentMethods, normalizePaymentMethod(data.paymentMethod)))}
    ${field(language() === "en" ? "Category" : "分类", select("bill_category", categories, data.category))}
    ${field(language() === "en" ? "Name / Note" : "名称 / 备注", `<input id="bill_merchant" value="${escapeHTML(data.merchant)}" placeholder="${language() === "en" ? "e.g. Lunch, supermarket, salary" : "例如 午餐、超市、工资"}" />`, "full")}
    ${field(language() === "en" ? "Date" : "日期", `<input id="bill_date" type="date" value="${inputDate(data.date)}" />`)}
    ${field(language() === "en" ? "Type" : "类型", select("bill_type", types, data.type))}
  `;
}

function normalizePaymentMethod(value) {
  if (paymentMethods.includes(value)) return value;
  if (value === "移动支付" || !value) return "支付宝";
  return "支付宝";
}

function field(label, control, extra = "") {
  return `<label class="form-field ${extra}"><span>${label}</span>${control}</label>`;
}

function select(id, list, selected) {
  return `<select id="${id}">${optionHTML(list, selected)}</select>`;
}

function currencySelect(id, selected) {
  return `<select id="${id}">${currencyOptions(selected)}</select>`;
}

function saveBillFromDialog() {
  const amount = Number($("#bill_amount").value);
  if (!amount || amount <= 0) {
    showToast(language() === "en" ? "Please enter a valid amount" : "请填写有效金额");
    return;
  }
  const payload = {
    type: $("#bill_type").value,
    amount,
    currency: $("#bill_currency")?.value || "GBP",
    category: $("#bill_category").value,
    date: new Date(`${$("#bill_date").value || inputDate(new Date())}T12:00:00`).toISOString(),
    merchant: $("#bill_merchant").value.trim() || $("#bill_category").value,
    account: $("#bill_payment")?.value || "支付宝",
    paymentMethod: $("#bill_payment")?.value.trim() || "移动支付",
    note: $("#bill_note")?.value.trim() || "",
    source: $("#bill_source")?.value || "手动",
    updatedAt: new Date().toISOString()
  };

  if (editingBillId) {
    state.bills = state.bills.map((item) => item.id === editingBillId ? { ...item, ...payload } : item);
  } else {
    state.bills.unshift(bill(payload));
  }
  saveState();
  $("#billDialog").close();
  renderAll();
  showToast(editingBillId ? (language() === "en" ? "Bill updated" : "账单已更新") : (language() === "en" ? "Bill added" : "账单已新增"));
}

async function recognizeBill() {
  const text = $("#receiptText").value.trim();
  const file = $("#receiptFile").files?.[0];
  const ocrText = text ? "" : await recognizeReceiptImage(file);
  const raw = text || ocrText || file?.name || "";
  if (!raw.trim()) {
    showToast(language() === "en" ? "Upload an image or paste receipt text first" : "请先上传图片或粘贴账单文字");
    return;
  }
  scanDraft = await parseBillDraftsWithBackend(raw, file, { fileOnly: !text && !!file && !ocrText, ocrText });
  if ($("#autoAddToggle").checked) {
    const added = addScanDraft();
    showToast(added ? (language() === "en" ? `AI auto-added ${added} bill(s)` : `AI 已自动添加 ${added} 条账单`) : (language() === "en" ? "Please confirm the recognized amount first" : "请先确认识别金额"));
  } else {
    renderScanDraft();
    showToast(language() === "en" ? "Editable bill draft generated" : "已生成可编辑账单草稿");
  }
}

async function parseBillDraftsWithBackend(text, file, options = {}) {
  if (options.fileOnly) return parseBillDrafts(text, file, options);
  for (const base of apiBaseCandidates()) {
    try {
      const response = await fetch(`${base}/api/ocr/parse`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ text })
      });
      if (!response.ok) continue;
      const payload = await response.json();
      if (Array.isArray(payload.items)) {
        apiBase = base;
        apiEnabled = true;
        const items = payload.items.map((item) => bill({
          ...item,
          source: item.source || "AI 扫描",
          confidence: item.confidence ?? 0.82
        }));
        return items.length ? items : parseBillDrafts(text, file, options);
      }
    } catch {
      // Keep the browser-side parser as a no-network fallback.
    }
  }
  return parseBillDrafts(text, file, options);
}

function parseBillDrafts(text, file, options = {}) {
  const normalized = normalizeReceiptText(text);
  if (options.fileOnly) return [parseBillText(normalized, file, options)];

  const lineItems = extractBillLineItems(normalized);
  if (!lineItems.length) return [parseBillText(normalized, file, options)];

  const sharedDate = extractDate(normalized);
  const sharedPaymentMethod = inferPaymentMethod(normalized);
  const sharedCurrency = inferCurrency(normalized);
  return lineItems.map((item, index) => {
    const line = item.text;
    const draft = parseBillText(line, file, { ...options, lineItem: true });
    const type = inferBillType(line);
    const linePaymentMethod = inferExplicitPaymentMethod(line) || sharedPaymentMethod;
    return {
      ...draft,
      type,
      category: type === "收入" ? inferIncomeCategory(`${normalized}\n${line}`) : draft.category,
      currency: inferExplicitCurrency(line) || sharedCurrency,
      date: item.date || draft.date || sharedDate,
      account: linePaymentMethod,
      paymentMethod: linePaymentMethod,
      note: language() === "en" ? `${options.ocrText ? "Free OCR" : "AI"} recognized item ${index + 1}: ${line.slice(0, 90)}` : `${options.ocrText ? "免费 OCR" : "AI"} 识别第 ${index + 1} 条：${line.slice(0, 90)}`,
      confidence: Math.min(0.94, Math.max(0.72, draft.confidence || 0.72))
    };
  });
}

function extractBillLines(text) {
  return extractBillLineItems(text).map((item) => item.text);
}

function extractBillLineItems(text) {
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  let currentDate = null;
  const candidates = [];
  lines.forEach((line) => {
    const lineDate = extractDate(line);
    if (lineDate && (isDateOnlyLine(line) || isDateSummaryLine(line))) {
      currentDate = lineDate;
      return;
    }
    if (isDateOnlyLine(line)) return false;
    if (isDateSummaryLine(line)) return false;
    if (isNonTransactionInfoLine(line)) return false;
    if (!extractAmount(line)) return false;
    if (/(?:合计|总计|小计|应付|实付|支付金额|付款金额|total|subtotal|tax|balance)/i.test(line)) return false;
    if (/^(?:¥|£|\$|€)?\s*[0-9][0-9,]*(?:\.[0-9]{1,2})?\s*(?:元|GBP|CNY|USD|EUR)?$/i.test(line)) return false;
    if (!cleanMerchantCandidate(line).length) return false;
    candidates.push({ text: line, date: currentDate });
  });
  return candidates;
}

async function recognizeReceiptImage(file) {
  if (!file) return "";
  const hasOCR = window.Tesseract?.recognize || await Promise.race([
    window.__loadFreeOCR || Promise.resolve(false),
    new Promise((resolve) => setTimeout(() => resolve(false), 8000))
  ]);
  if (!hasOCR || !window.Tesseract?.recognize) {
    showToast(language() === "en" ? "Free OCR is not ready. Try again later or paste receipt text." : "免费 OCR 未加载完成，请稍后重试或粘贴账单文字");
    return "";
  }

  const button = $("#recognizeBtn");
  const originalText = button.textContent;
  button.disabled = true;
  try {
    button.textContent = language() === "en" ? "OCR 0%" : "OCR 识别中 0%";
    showToast(language() === "en" ? "Recognizing image with free OCR" : "正在用免费 OCR 识别图片");
    const result = await window.Tesseract.recognize(file, "chi_sim+eng", {
      workerPath: "./vendor/tesseract/worker.min.js",
      corePath: "./vendor/tesseract-core/",
      langPath: "./vendor/tesseract-lang/",
      logger: (event) => {
        if (event.status === "recognizing text") {
          button.textContent = language() === "en" ? `OCR ${Math.round((event.progress || 0) * 100)}%` : `OCR 识别中 ${Math.round((event.progress || 0) * 100)}%`;
        }
      }
    });
    const text = result?.data?.text?.trim() || "";
    if (text) $("#receiptText").value = text;
    return text;
  } catch (error) {
    console.error(error);
    showToast(language() === "en" ? "Free OCR failed. Paste receipt text and try again." : "免费 OCR 识别失败，可粘贴账单文字再试");
    return "";
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

function parseBillText(text, file, options = {}) {
  const normalized = normalizeReceiptText(text);
  const fileOnly = Boolean(options.fileOnly);
  const currency = inferCurrency(normalized);
  const amount = fileOnly ? 0 : extractAmount(normalized);
  const type = inferBillType(normalized);
  const category = type === "收入" ? inferIncomeCategory(normalized) : inferCategory(normalized);
  const paymentMethod = fileOnly ? "支付宝" : inferPaymentMethod(normalized);
  return bill({
    type,
    amount,
    currency,
    category,
    date: extractDate(normalized) || (file?.lastModified ? new Date(file.lastModified).toISOString() : new Date().toISOString()),
    merchant: inferMerchant(normalized, file, category),
    account: paymentMethod,
    paymentMethod,
    note: fileOnly
      ? (language() === "en" ? `AI draft: image uploaded. Add the amount, or paste receipt text and scan again. File: ${file?.name || normalized}` : `AI 识别草稿：图片已上传，请补充金额，或粘贴账单文字后重新识别。文件：${file?.name || normalized}`)
      : options.ocrText
        ? (language() === "en" ? `Free OCR draft: ${normalized.slice(0, 90)}` : `免费 OCR 识别草稿：${normalized.slice(0, 90)}`)
      : amount > 0 ? (language() === "en" ? `AI draft: ${normalized.slice(0, 90)}` : `AI 识别草稿：${normalized.slice(0, 90)}`) : (language() === "en" ? `AI draft: please add amount. ${normalized.slice(0, 70)}` : `AI 识别草稿：请补充金额。${normalized.slice(0, 70)}`),
    source: "AI 扫描",
    confidence: scanConfidence(normalized, amount, fileOnly)
  });
}

function normalizeReceiptText(text) {
  return String(text || "")
    .replaceAll("￥", "¥")
    .replace(/\r/g, "\n")
    .replace(/\s+\n/g, "\n")
    .trim();
}

function inferCurrency(text) {
  return inferExplicitCurrency(text) || "GBP";
}

function inferExplicitCurrency(text) {
  if (/(?:£|GBP|英镑)/i.test(text)) return "GBP";
  if (/(?:¥|RMB|CNY|人民币|元)/i.test(text)) return "CNY";
  if (/(?:€|EUR|欧元)/i.test(text)) return "EUR";
  if (/(?:\$|USD|美元)/i.test(text)) return "USD";
  return "";
}

function extractAmount(text) {
  if (isDateSummaryLine(text)) return 0;
  if (isNonTransactionInfoLine(text)) return 0;
  const amountValue = "([+-]?\\s*[0-9][0-9,]*(?:\\.[0-9]{1,2})?)";
  const currencyMark = "(?:¥|RMB|CNY|人民币|£|GBP|英镑|\\$|USD|美元|€|EUR|欧元|元)?";
  const dateStrippedText = stripDateAndTimeParts(text);
  const preferred = [
    new RegExp(`(?:实付|实际支付|付款金额|支付金额|应付|合计|总计|消费|支出|收款|收入|到账|Amount|Total)[:：\\s]*${currencyMark}\\s*${amountValue}`, "i"),
    new RegExp(`(?:¥|RMB|CNY|人民币|£|GBP|英镑|\\$|USD|美元|€|EUR|欧元)\\s*${amountValue}`, "i"),
    new RegExp(`${amountValue}\\s*(?:元|英镑|人民币|美元|欧元)`, "i")
  ];
  for (const pattern of preferred) {
    const match = dateStrippedText.match(pattern);
    if (match) return parseAmountNumber(match[1]);
  }
  const stripped = dateStrippedText
    .replace(/(?:订单|单号|流水|交易号|编号|No\.?|ID)[:：\sA-Za-z0-9-]{4,}/gi, " ");
  const values = [...stripped.matchAll(/([+-]?\s*[0-9][0-9,]*(?:\.[0-9]{1,2})?)/g)]
    .filter((item) => isLikelyAmount(item, stripped))
    .map((item) => parseAmountNumber(item[1]))
    .filter((num) => num > 0 && num < 100000);
  return values.length ? Math.max(...values) : 0;
}

function parseAmountNumber(value) {
  return Math.abs(Number(String(value || "0").replaceAll(",", "").replace(/\s+/g, "")));
}

function isLikelyAmount(match, text) {
  const start = Math.max(0, match.index - 12);
  const end = Math.min(text.length, match.index + match[0].length + 12);
  const around = text.slice(start, end);
  const value = parseAmountNumber(match[1]);
  if (!hasMoneySignal(text) && value >= 1000 && /[A-Za-z\u4e00-\u9fa5]/.test(text)) return false;
  if (/[年月日:：]/.test(around)) return false;
  if (isDateLikeNumber(value) && /(?:date|time|日期|时间|[-/.年年月日])/i.test(around)) return false;
  if (/(?:订单|单号|流水|交易号|编号|电话|手机|No\.?|ID)/i.test(around)) return false;
  return true;
}

function hasMoneySignal(text) {
  const value = String(text || "");
  if (/(?:¥|RMB|CNY|人民币|£|GBP|英镑|\$|USD|美元|€|EUR|欧元|元)/i.test(value)) return true;
  if (/(?:实付|实际支付|付款金额|支付金额|应付|合计|总计|消费|支出|收款|收入|到账|Amount|Total)/i.test(value)) return true;
  if (/(^|[^\d])[+-]\s*(?:¥|RMB|CNY|人民币|£|GBP|英镑|\$|USD|美元|€|EUR|欧元|元)\s*[0-9][0-9,]*(?:\.[0-9]{1,2})?/i.test(value)) return true;
  if (/(^|[^\d])[+-]\s*[0-9][0-9,]*\.[0-9]{1,2}/.test(value)) return true;
  if (/(^|[^\d])[+-]\s*[0-9][0-9,]*(?![0-9,])(?=$|\s)/.test(value)) return true;
  if (/(^|[^\d])[0-9][0-9,]*\.[0-9]{1,2}(?!\s*[:：])/.test(value)) return true;
  return false;
}

function isNonTransactionInfoLine(text) {
  const value = String(text || "").trim();
  if (!value || hasMoneySignal(value)) return false;
  if (/^\d{3,6}\s+[A-Za-z][A-Za-z\s'.-]{2,}\s*[@+]?\s*[0-9]{1,2}[:：][0-9]{2}\s*$/i.test(value)) return true;
  if (/^\d{3,6}\s+[A-Za-z][A-Za-z\s'.-]{2,}$/i.test(value)) return true;
  if (/^[A-Za-z][A-Za-z\s'.-]{2,}\s*[@+]?\s*[0-9]{1,2}[:：][0-9]{2}\s*$/i.test(value)) return true;
  if (/^[A-Za-z][A-Za-z\s'.&-]{2,}\s+[0-9]{3,6}\s*$/i.test(value)) return true;
  if (/^[A-Za-z][A-Za-z\s'.&-]{2,}\s+[0-9]{3,6}\s+[A-Za-z][A-Za-z\s'.&-]{2,}$/i.test(value)) return true;
  return false;
}

function isLikelyExpenseChargeLine(text) {
  const value = String(text || "");
  if (!hasPositiveAmount(value)) return false;
  if (/(?:reversal|refund|退款|退回|返现|cash\s*back|received|income|salary|deposit|credit|到账|入账|转入)/i.test(value)) return false;
  return /(?:tesco|sainsbury|aldi|lidl|morrisons|waitrose|amazon|apple\.com\/bill|hyperoptic|myprinting|imart|oriental|stores?\s+[0-9]{3,6})/i.test(value);
}

function isDateLikeNumber(value) {
  return (value >= 1900 && value <= 2100) || (Number.isInteger(value) && value >= 101 && value <= 1231);
}

function inferBillType(text) {
  const normalized = String(text || "").replace(/(?:收款方|收款账户|收款账号|收款人|收款商户|收款单位)/g, " ");
  if (/(?:转账|转出|transfer)/i.test(normalized)) return "转账";
  if (isLikelyExpenseChargeLine(normalized)) return "支出";
  if (hasPositiveAmount(normalized)) return "收入";
  if (/(?:工资|薪资|奖金|收入|到账|退款|退回|转入|入账|已收款|received|income|salary|refund|deposit|paid\s+in|credit)/i.test(normalized)) return "收入";
  return "支出";
}

function hasPositiveAmount(text) {
  const stripped = stripDateAndTimeParts(text);
  return /(^|[^\d])\+\s*(?:¥|RMB|CNY|人民币|£|GBP|英镑|\$|USD|美元|€|EUR|欧元|元)?\s*[0-9][0-9,]*(?:\.[0-9]{1,2})?/i.test(stripped);
}

function inferIncomeCategory(text) {
  if (/(?:工资|薪资|奖金|公司|salary|payroll|bonus)/i.test(text)) return "工资";
  if (/(?:存入|储蓄|deposit|saving)/i.test(text)) return "储蓄";
  return "其他";
}

function inferCategory(text) {
  const lowerText = text.toLowerCase();
  const rules = [
    ["餐饮", ["餐", "饭", "咖啡", "奶茶", "外卖", "面包", "餐厅", "火锅", "食堂", "starbucks", "kfc", "mcdonald"]],
    ["交通", ["地铁", "公交", "打车", "车票", "高铁", "停车", "bus", "ticket", "train", "uber"]],
    ["购物", ["淘宝", "京东", "购物", "商场", "服饰", "电商", "超市", "tesco", "sainsbury", "amazon"]],
    ["住房", ["房租", "物业", "租金"]],
    ["娱乐", ["电影", "会员", "游戏", "音乐", "娱乐"]],
    ["医疗", ["医院", "药", "门诊"]],
    ["教育", ["课程", "书", "培训", "教育"]],
    ["水电", ["水费", "电费", "燃气", "话费", "宽带"]]
  ];
  return rules.find(([, keys]) => keys.some((key) => lowerText.includes(key)))?.[0] ?? "其他";
}

function inferMerchant(text, file, category) {
  const labeled = text.match(/(?:商户|店铺|收款方|付款给|交易对象|Merchant)[:：\s]*([^\n]+)/i);
  if (labeled) {
    const candidate = cleanMerchantCandidate(labeled[1]);
    if (candidate) return candidate;
  }
  const lines = text.split(/\n|\s{2,}/).map(cleanMerchantCandidate).filter(Boolean);
  const line = lines.find((item) => item.length >= 2 && item.length <= 24);
  if (line) return line;
  if (file?.name) return file.name.replace(/\.[^.]+$/, "").slice(0, 18);
  return category;
}

function cleanMerchantCandidate(value) {
  const candidate = String(value || "")
    .replace(/\.(png|jpg|jpeg|webp|heic)$/i, "")
    .replace(/(?:实付|实际支付|付款金额|支付金额|应付|合计|总计|金额|时间|日期|订单|交易|账单|收据|小票)[:：]?/g, "")
    .replace(/[+-]?\s*(?:¥|RMB|CNY|人民币|£|GBP|英镑|\$|USD|美元|€|EUR|欧元|元)\s*[0-9][0-9,]*(?:\.[0-9]{1,2})?/gi, "")
    .replace(/[+-]?\s*[0-9][0-9,]*(?:\.[0-9]{1,2})?\s*(?:元|GBP|CNY|USD|EUR)?/gi, "")
    .replace(/[0-9]{4}[-/.年][0-9]{1,2}[-/.月][0-9]{1,2}日?/g, "")
    .replace(/[0-9]{1,2}:[0-9]{2}(?::[0-9]{2})?/g, "")
    .replace(/(?:微信支付|支付宝|银行卡|Apple\s*Pay|支付成功|交易成功)/gi, "")
    .replace(/[+-]/g, "")
    .trim();
  if (!candidate || /^[0-9¥£$€:：.\-/\s]+$/.test(candidate)) return "";
  if (/^(微信|支付宝|银行卡|Apple Pay|支付成功|交易成功)$/i.test(candidate)) return "";
  return candidate.slice(0, 24);
}

function inferPaymentMethod(text) {
  return inferExplicitPaymentMethod(text) || "支付宝";
}

function inferExplicitPaymentMethod(text) {
  if (text.includes("微信")) return "微信";
  if (text.includes("支付宝")) return "支付宝";
  if (/apple\s*pay/i.test(text)) return "Apple Pay";
  if (text.includes("银行") || text.includes("银行卡") || /card|visa|mastercard/i.test(text)) return "银行卡";
  return "";
}

function extractDate(text) {
  const normalized = normalizeReceiptText(text);
  const time = normalized.match(/([01]?[0-9]|2[0-3])[:：]([0-5][0-9])(?:[:：][0-5][0-9])?/);
  const timeText = time ? `${time[1].padStart(2, "0")}:${time[2]}` : "12:00";
  const patterns = [
    /((?:19|20)[0-9]{2})[-/.年\s]+([0-9]{1,2})[-/.月\s]+([0-9]{1,2})日?/,
    /([0-9]{1,2})[-/.月\s]+([0-9]{1,2})[-/.日\s]+((?:19|20)[0-9]{2})/,
    /([0-9]{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+((?:19|20)[0-9]{2})/i,
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+([0-9]{1,2}),?\s+((?:19|20)[0-9]{2})/i
  ];
  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (!match) continue;
    const parts = normalizeDateMatch(match);
    if (!parts) continue;
    const date = `${parts.year}-${parts.month}-${parts.day}T${timeText}`;
    const parsed = new Date(date);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }
  return null;
}

function normalizeDateMatch(match) {
  const monthNames = {
    jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
    jul: "07", aug: "08", sep: "09", sept: "09", oct: "10", nov: "11", dec: "12"
  };
  if (/^[0-9]{4}$/.test(match[1])) {
    return { year: match[1], month: match[2].padStart(2, "0"), day: match[3].padStart(2, "0") };
  }
  if (/^[A-Za-z]+$/.test(match[1])) {
    return { year: match[3], month: monthNames[match[1].slice(0, 4).toLowerCase()] || monthNames[match[1].slice(0, 3).toLowerCase()], day: match[2].padStart(2, "0") };
  }
  if (/^[A-Za-z]+$/.test(match[2])) {
    return { year: match[3], month: monthNames[match[2].slice(0, 4).toLowerCase()] || monthNames[match[2].slice(0, 3).toLowerCase()], day: match[1].padStart(2, "0") };
  }
  return { year: match[3], month: match[2].padStart(2, "0"), day: match[1].padStart(2, "0") };
}

function stripDateAndTimeParts(text) {
  return String(text || "")
    .replace(/(^|[^\d])((?:19|20)[0-9]{2}[-/.年\s]+[0-9]{1,2}[-/.月\s]+[0-9]{1,2}日?)(?=$|[^\d])/g, "$1 ")
    .replace(/(^|[^\d])([0-9]{1,2}[-/.月\s]+[0-9]{1,2}[-/.日\s]+(?:19|20)[0-9]{2})(?=$|[^\d])/g, "$1 ")
    .replace(/(^|[^\d])([0-9]{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+(?:19|20)[0-9]{2})(?=$|[^\d])/gi, "$1 ")
    .replace(/(^|[^\d])((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+[0-9]{1,2},?\s+(?:19|20)[0-9]{2})(?=$|[^\d])/gi, "$1 ")
    .replace(/(?:日期|时间|Date|Time)[:：\s]*/gi, " ")
    .replace(/[0-9]{1,2}[:：][0-9]{2}(?:[:：][0-9]{2})?/g, " ");
}

function isDateOnlyLine(line) {
  const stripped = stripDateAndTimeParts(line).replace(/[^\dA-Za-z\u4e00-\u9fa5]/g, "").trim();
  return Boolean(extractDate(line)) && stripped.length === 0;
}

function isDateSummaryLine(line) {
  if (!extractDate(line) || !hasMoneySignal(line)) return false;
  const stripped = stripDateAndTimeParts(line)
    .replace(/[+-]?\s*(?:¥|RMB|CNY|人民币|£|GBP|英镑|\$|USD|美元|€|EUR|欧元|元)\s*[0-9][0-9,]*(?:\.[0-9]{1,2})?/gi, " ")
    .replace(/[+-]?\s*[0-9][0-9,]*(?:\.[0-9]{1,2})?\s*(?:元|GBP|CNY|USD|EUR)?/gi, " ")
    .replace(/\b(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Mon|Tue|Tues|Wed|Thu|Thur|Fri|Sat|Sun)\b/gi, " ")
    .replace(/[,\-–—|·\s]/g, "")
    .trim();
  return stripped.length === 0;
}

function scanConfidence(text, amount, fileOnly = false) {
  let score = fileOnly ? 0.36 : 0.58;
  if (amount > 0) score += 0.18;
  if (extractDate(text)) score += 0.08;
  if (/(?:商户|店铺|收款方|付款给|合计|总计|实付|支付金额|Amount|Total)/i.test(text)) score += 0.08;
  if (/(?:微信|支付宝|银行卡|Apple Pay|¥|£|\$|€|GBP|CNY|USD|EUR)/i.test(text)) score += 0.06;
  return Math.min(0.96, score);
}

function renderScanDraft() {
  const form = $("#scanDraftForm");
  if (!scanDraft) {
    $("#scanConfidence").textContent = t("waitingScan");
    form.innerHTML = `<div class="muted">${language() === "en" ? "Upload an image, paste text, or use the sample. An editable bill draft will appear here." : "上传图片、粘贴文字或使用示例后，这里会出现可编辑账单草稿。"}</div>`;
    return;
  }
  const drafts = Array.isArray(scanDraft) ? scanDraft : [scanDraft];
  const averageConfidence = drafts.reduce((sum, item) => sum + (item.confidence || 0), 0) / drafts.length;
  $("#scanConfidence").textContent = drafts.length > 1
    ? (language() === "en" ? `${drafts.length} items · confidence ${percent(averageConfidence)}` : `${drafts.length} 条 · 置信度 ${percent(averageConfidence)}`)
    : (language() === "en" ? `Confidence ${percent(averageConfidence || 0)}` : `置信度 ${percent(averageConfidence || 0)}`);
  if (drafts.length > 1) {
    form.innerHTML = `
      <div class="table-wrap scan-draft-table form-field full">
        <table>
          <thead>
            <tr>
              <th>${t("table.type")}</th>
              <th>${t("table.category")}</th>
              <th>${t("table.merchant")}</th>
              <th>${t("table.currency")}</th>
              <th class="align-right">${t("table.amount")}</th>
              <th>${t("table.payment")}</th>
            </tr>
          </thead>
          <tbody>
            ${drafts.map((item) => `
              <tr>
                <td>${escapeHTML(displayValue(item.type))}</td>
                <td>${escapeHTML(displayValue(item.category))}</td>
                <td>${escapeHTML(displayValue(item.merchant))}</td>
                <td>${escapeHTML(displayText(item.currency))}</td>
                <td class="align-right amount ${billAmountClass(item)}">${escapeHTML(displayBillAmount(item))}</td>
                <td>${escapeHTML(displayValue(item.paymentMethod || item.account))}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <div class="muted form-field full">${language() === "en" ? "Multiple bills recognized. Confirm to add all of them to the bill list." : "已识别到多条账单，确认后会一次性添加到账单列表。"}</div>
      <div class="button-row form-field full">
        <button class="primary-btn" id="confirmScanBtn" type="button">${language() === "en" ? "Add All" : "全部入账"}</button>
        <button class="ghost-btn" id="clearScanBtn" type="button">${language() === "en" ? "Clear Draft" : "清空草稿"}</button>
      </div>
    `;
    return;
  }
  const draft = drafts[0];
  form.innerHTML = `
    ${field(t("table.type"), select("scan_type", types, draft.type))}
    ${field(t("table.amount"), `<input id="scan_amount" type="number" min="0" step="0.01" value="${Number(draft.amount) || ""}" />`)}
    ${field(t("table.currency"), currencySelect("scan_currency", draft.currency || "GBP"))}
    ${field(t("table.payment"), select("scan_payment", paymentMethods, normalizePaymentMethod(draft.paymentMethod || draft.account)))}
    ${field(t("table.category"), select("scan_category", categories, draft.category))}
    ${field(language() === "en" ? "Time" : "时间", `<input id="scan_date" type="datetime-local" value="${inputDateTime(draft.date)}" />`)}
    ${field(t("table.merchant"), `<input id="scan_merchant" value="${escapeHTML(draft.merchant)}" />`)}
    ${field(t("table.note"), `<textarea id="scan_note" rows="3">${escapeHTML(draft.note)}</textarea>`, "full")}
    <div class="button-row form-field full">
      <button class="primary-btn" id="confirmScanBtn" type="button">${language() === "en" ? "Confirm Add" : "确认入账"}</button>
      <button class="ghost-btn" id="clearScanBtn" type="button">${language() === "en" ? "Clear Draft" : "清空草稿"}</button>
    </div>
  `;
}

function addScanDraft() {
  if (!scanDraft) return 0;
  const drafts = Array.isArray(scanDraft) ? scanDraft : [scanDraft];
  if (drafts.length > 1) {
    const validDrafts = drafts.filter((item) => Number(item.amount) > 0);
    if (!validDrafts.length) {
      renderScanDraft();
      return 0;
    }
    state.bills.unshift(...validDrafts.map((item) => bill({
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })));
    const count = validDrafts.length;
    scanDraft = null;
    saveState();
    renderAll();
    return count;
  }
  const draft = drafts[0];
  const amount = Number($("#scan_amount")?.value ?? draft.amount);
  if (!amount || amount <= 0) {
    renderScanDraft();
    return 0;
  }
  const paymentMethod = $("#scan_payment")?.value || draft.paymentMethod || draft.account || "支付宝";
  const finalizedDraft = {
    ...draft,
    type: $("#scan_type")?.value ?? draft.type,
    amount,
    currency: $("#scan_currency")?.value || draft.currency || "GBP",
    category: $("#scan_category")?.value ?? draft.category,
    date: $("#scan_date")?.value ? new Date($("#scan_date").value).toISOString() : draft.date,
    merchant: $("#scan_merchant")?.value.trim() || draft.merchant,
    account: paymentMethod,
    paymentMethod,
    note: $("#scan_note")?.value.trim() || draft.note,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  state.bills.unshift(finalizedDraft);
  scanDraft = null;
  saveState();
  renderAll();
  return 1;
}

function renderStats() {
  const scope = state.statsScope;
  $("#statsScope").value = scope;
  const snap = snapshot(scope);
  $("#statsMetrics").innerHTML = [
    metricHTML(language() === "en" ? "Income" : "收入", money(snap.income), language() === "en" ? "Income in selected period" : "所选周期收入", "green"),
    metricHTML(language() === "en" ? "Spending" : "支出", money(snap.expense), language() === "en" ? "Spending in selected period" : "所选周期支出", "orange"),
    metricHTML(language() === "en" ? "Balance" : "结余", money(snap.balance), language() === "en" ? "Income minus spending" : "收入减支出", "blue"),
    metricHTML(language() === "en" ? "Budget Used" : "预算使用", percent(snap.budgetUsage), language() === "en" ? "Based on monthly budget" : "按月预算计算", "purple")
  ].join("");
  drawBarChart($("#statsChart"), scope === "year" ? monthlySeries() : dailySeries(scope === "day" ? 1 : 12), "#0496b2");
  renderCategoryBreakdown("#statsCategoryList", scope);
}

function renderCategoryBreakdown(selector, scope) {
  const totals = categoryTotals(scope);
  const max = Math.max(1, ...totals.map((item) => item.total));
  const target = $(selector);
  if (!totals.length) {
    target.innerHTML = `<div class="muted">${language() === "en" ? "No category spending data" : "暂无分类支出数据"}</div>`;
    return;
  }
  target.innerHTML = totals.map((item) => `
    <div class="category-row">
      <span class="pill">${escapeHTML(label(item.category))}</span>
      <div class="bill-meta">
        <strong>${money(item.total)}</strong>
        <div class="progress" style="--bar:${categoryColors[item.category] || "#214fd3"}; --value:${Math.max(4, item.total / max * 100)}%"><span></span></div>
      </div>
      <span class="muted">${percent(item.total / totals.reduce((sum, entry) => sum + entry.total, 0))}</span>
    </div>
  `).join("");
}

function dailySeries(days) {
  const result = [];
  for (let index = days - 1; index >= 0; index -= 1) {
    const day = new Date();
    day.setDate(day.getDate() - index);
    const total = state.bills
      .filter((item) => item.type === "支出" && sameDay(new Date(item.date), day))
      .reduce((sum, item) => sum + convertAmount(item.amount, item.currency, "GBP"), 0);
    result.push({ label: `${day.getMonth() + 1}/${day.getDate()}`, total });
  }
  return result;
}

function currentMonthDailySeries(base = new Date()) {
  const year = base.getFullYear();
  const month = base.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = new Date(year, month, index + 1);
    const total = state.bills
      .filter((item) => {
        const date = new Date(item.date);
        return item.type === "支出" &&
          date.getFullYear() === year &&
          date.getMonth() === month &&
          date.getDate() === day.getDate();
      })
      .reduce((sum, item) => sum + convertAmount(item.amount, item.currency, "GBP"), 0);
    return { label: `${month + 1}/${index + 1}`, total };
  });
}

function monthlySeries() {
  const year = new Date().getFullYear();
  return Array.from({ length: 12 }, (_, month) => {
    const total = state.bills
      .filter((item) => {
        const date = new Date(item.date);
        return item.type === "支出" && date.getFullYear() === year && date.getMonth() === month;
      })
      .reduce((sum, item) => sum + convertAmount(item.amount, item.currency, "GBP"), 0);
    return { label: language() === "en" ? new Intl.DateTimeFormat("en-GB", { month: "short" }).format(new Date(year, month, 1)) : `${month + 1}月`, total };
  });
}

function drawBarChart(canvas, values, color) {
  const ctx = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || 900;
  const height = 260;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  ctx.scale(ratio, ratio);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i += 1) {
    const y = 30 + i * 50;
    ctx.beginPath();
    ctx.moveTo(36, y);
    ctx.lineTo(width - 16, y);
    ctx.stroke();
  }
  const max = Math.max(1, ...values.map((item) => item.total));
  const gap = 10;
  const chartWidth = width - 60;
  const barWidth = Math.max(12, (chartWidth - gap * (values.length - 1)) / values.length);
  values.forEach((item, index) => {
    const displayTotal = convertAmount(item.total, "GBP", displayCurrency());
    const x = 36 + index * (barWidth + gap);
    const barHeight = Math.max(6, (item.total / max) * 150);
    const y = 190 - barHeight;
    ctx.fillStyle = item.total ? color : "#e2e8f0";
    roundRect(ctx, x, y, barWidth, barHeight, 6);
    ctx.fill();
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(item.label, x + barWidth / 2, 222);
    if (displayTotal > 0) {
      ctx.font = "11px system-ui";
      ctx.fillText(formatMoney(displayTotal, displayCurrency()), x + barWidth / 2, Math.max(18, y - 8));
    }
  });
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function renderBudget() {
  const snap = snapshot("month");
  const severity = budgetSeverity();
  $("#budgetStatePill").textContent = severityText(severity);
  const shownIncome = Math.round(convertAmount(state.settings.monthlyIncome, "GBP", displayCurrency()));
  const shownBudget = Math.round(convertAmount(state.settings.monthlyBudget, "GBP", displayCurrency()));
  const shownSavings = Math.round(convertAmount(state.settings.savingsGoal, "GBP", displayCurrency()));
  $("#budgetForm").innerHTML = `
    ${field(`${language() === "en" ? "Monthly Income" : "月收入"}（${displayCurrency()}）`, `<input id="monthlyIncome" type="number" value="${shownIncome}" />`)}
    ${field(`${language() === "en" ? "Monthly Budget" : "月预算"}（${displayCurrency()}）`, `<input id="monthlyBudget" type="number" value="${shownBudget}" />`)}
    ${field(`${language() === "en" ? "Savings Goal" : "储蓄目标"}（${displayCurrency()}）`, `<input id="savingsGoal" type="number" value="${shownSavings}" />`)}
    ${field(language() === "en" ? "Alert Threshold" : "提醒阈值", `<input id="warningThreshold" type="number" min="0" max="1" step="0.05" value="${state.settings.warningThreshold}" />`)}
    <div class="form-field full"><button class="primary-btn" id="saveBudgetBtn" type="button">${language() === "en" ? "Save Budget Settings" : "保存预算设置"}</button></div>
  `;
  $("#budgetProgressPanel").innerHTML = `
    <div class="alert ${severity}">
      <span class="pill">${percent(snap.budgetUsage)}</span>
      <div>
        <strong>${language() === "en" ? "Spent" : "已支出"} ${money(snap.expense)} / ${money(state.settings.monthlyBudget)}</strong>
        <p>${budgetMessage(snap.budgetUsage)}</p>
      </div>
    </div>
    <div class="progress" style="--bar:${severity === "danger" ? "var(--red)" : severity === "warning" ? "var(--orange)" : "var(--green)"}; --value:${Math.min(125, snap.budgetUsage * 100)}%; margin: 16px 0 20px"><span></span></div>
  `;
  $("#categoryBudgetEditor").innerHTML = expenseCategories.map((category) => {
    const budget = state.settings.categoryBudgets[category] || 0;
    const spent = categoryTotals("month").find((item) => item.category === category)?.total || 0;
    const shownCategoryBudget = Math.round(convertAmount(budget, "GBP", displayCurrency()));
    return `
      <div class="budget-row">
        <span class="pill">${label(category)}</span>
        <div class="bill-meta">
          <strong>${money(spent)} / ${money(budget)}</strong>
          <div class="progress" style="--bar:${categoryColors[category]}; --value:${budget ? Math.min(125, spent / budget * 100) : 0}%"><span></span></div>
        </div>
        <input class="category-budget-input" data-category="${category}" type="number" value="${shownCategoryBudget}" />
      </div>
    `;
  }).join("");
}

function budgetMessage(usage) {
  if (language() === "en") {
    if (usage >= state.settings.severeThreshold) return "Spending is far over plan. Pause non-essential shopping and entertainment now.";
    if (usage >= state.settings.dangerThreshold) return "Spending is over plan. Reduce takeout, entertainment, and impulse purchases.";
    if (usage >= state.settings.warningThreshold) return "Budget is nearly used up. Control frequent small expenses next.";
    return "Budget is healthy. Keep your current rhythm.";
  }
  if (usage >= state.settings.severeThreshold) return "花销已严重超预期，建议立刻暂停非必要购物和娱乐。";
  if (usage >= state.settings.dangerThreshold) return "花销已超预期，建议减少外卖、娱乐和冲动消费。";
  if (usage >= state.settings.warningThreshold) return "预算即将用完，接下来需要控制高频小额支出。";
  return "预算状态健康，继续保持当前节奏。";
}

function saveBudgetSettings() {
  state.settings.monthlyIncome = convertAmount(Number($("#monthlyIncome").value) || convertAmount(state.settings.monthlyIncome, "GBP", displayCurrency()), displayCurrency(), "GBP");
  state.settings.monthlyBudget = convertAmount(Number($("#monthlyBudget").value) || convertAmount(state.settings.monthlyBudget, "GBP", displayCurrency()), displayCurrency(), "GBP");
  state.settings.savingsGoal = convertAmount(Number($("#savingsGoal").value) || convertAmount(state.settings.savingsGoal, "GBP", displayCurrency()), displayCurrency(), "GBP");
  state.settings.warningThreshold = Number($("#warningThreshold").value) || 0.8;
  saveState();
  renderAll();
  showToast(language() === "en" ? "Budget settings saved" : "预算设置已保存");
}

function renderAdvisor() {
  const income = state.settings.monthlyIncome;
  const savings = Math.max(income * 0.2, state.settings.savingsGoal);
  const salaryPlan = language() === "en"
    ? [
      ["Needs", income * 0.5, "Rent, commute, utilities, basic meals", "blue"],
      ["Savings", savings, "Save right after payday", "green"],
      ["Flexible Spending", income * 0.25, "Shopping, entertainment, and takeout", "orange"],
      ["Emergency Buffer", income * 0.05, "Medical, repairs, and unexpected costs", "purple"]
    ]
    : [
      ["必要支出", income * 0.5, "房租、通勤、水电、基础餐饮", "blue"],
      ["储蓄", savings, "发薪后先存，避免月底被动储蓄", "green"],
      ["弹性消费", income * 0.25, "购物、娱乐、外卖从这里扣减", "orange"],
      ["备用金", income * 0.05, "医疗、维修和意外开销", "purple"]
    ];
  $("#salaryPlan").innerHTML = salaryPlan.map(([title, value, note, accent]) => `
    <div class="salary-row accent-${accent}">
      <span class="pill">${escapeHTML(title)}</span>
      <div class="bill-meta">
        <strong>${money(value)}</strong>
        <span>${escapeHTML(note)}</span>
      </div>
      <span>${percent(income ? value / income : 0)}</span>
    </div>
  `).join("");
  $("#adviceList").innerHTML = buildAdvice().map(alertHTML).join("");
}

function buildAdvice() {
  const snap = snapshot("month");
  const totals = categoryTotals("month");
  const advice = [];
  if (snap.budgetUsage >= state.settings.dangerThreshold) {
    advice.push(language() === "en"
      ? { title: "Spending is over plan", message: "This month's spending has exceeded budget. Reduce takeout, shopping, and entertainment.", severity: "danger" }
      : { title: "花销已超预期", message: "本月支出已经超过预算，建议减少外卖、购物和娱乐支出。", severity: "danger" });
  } else if (snap.budgetUsage >= state.settings.warningThreshold) {
    advice.push(language() === "en"
      ? { title: "Budget is near the limit", message: "A large share of this month's budget is used. Set a daily cap for the next week.", severity: "warning" }
      : { title: "预算接近上限", message: "本月预算已经使用较多，建议为未来一周设置每日消费上限。", severity: "warning" });
  } else {
    advice.push(language() === "en"
      ? { title: "Budget is healthy", message: "Current spending is within budget. Keep saving first and spending after.", severity: "success" }
      : { title: "预算状态健康", message: "当前支出仍在预算内，可以继续保持先储蓄后消费。", severity: "success" });
  }
  if (totals[0]) {
    const ratio = snap.expense ? totals[0].total / snap.expense : 0;
    advice.push({
      title: language() === "en" ? `${label(totals[0].category)} is the top category` : `${totals[0].category} 是最高支出`,
      message: language() === "en" ? `${label(totals[0].category)} accounts for ${percent(ratio)} of monthly spending. Try reducing it by 10%-20% next month.` : `${totals[0].category}占本月支出的 ${percent(ratio)}，建议下月减少 10%-20%。`,
      severity: ratio > 0.3 ? "warning" : "info"
    });
  }
  advice.push({
    title: language() === "en" ? "Salary allocation advice" : "工资分配建议",
    message: language() === "en" ? `From monthly income ${money(state.settings.monthlyIncome)}, prioritize saving ${money(Math.max(state.settings.monthlyIncome * 0.2, state.settings.savingsGoal))}.` : `月收入 ${money(state.settings.monthlyIncome)} 中，建议优先储蓄 ${money(Math.max(state.settings.monthlyIncome * 0.2, state.settings.savingsGoal))}。`,
    severity: "info"
  });
  return advice;
}

function parseCSV(text) {
  const rows = text.split(/\r?\n/).filter((line) => line.trim());
  if (rows.length < 2) return [];
  const headers = splitCSV(rows[0]).map((item) => item.trim().toLowerCase());
  return rows.slice(1).map((row) => {
    const values = splitCSV(row);
    const value = (...names) => {
      for (const name of names) {
        const index = headers.indexOf(name);
        if (index >= 0) return values[index]?.trim() ?? "";
      }
      return "";
    };
    const amount = Number(value("amount", "金额"));
    if (!amount) return null;
    const rawType = fromDisplayValue(value("type", "类型"));
    const rawCategory = fromDisplayValue(value("category", "分类"));
    return bill({
      type: types.includes(rawType) ? rawType : "支出",
      amount,
      currency: normalizeCurrency(value("currency", "币种")),
      category: categories.includes(rawCategory) ? rawCategory : "其他",
      date: new Date(value("date", "日期", "time") || Date.now()).toISOString(),
      merchant: value("merchant", "商户", "交易对象") || (language() === "en" ? "Imported Bill" : "导入账单"),
      account: value("account", "账户") || (language() === "en" ? "Imported Account" : "导入账户"),
      note: value("note", "备注"),
      source: "导入"
    });
  }).filter(Boolean);
}

function fromDisplayValue(value) {
  const text = String(value || "").trim();
  const found = Object.entries(valueLabels).find(([, translated]) => translated.toLowerCase() === text.toLowerCase());
  return found?.[0] || text;
}

function normalizeCurrency(value) {
  const code = String(value || "").trim().toUpperCase();
  return currencies.some((item) => item.code === code) ? code : "GBP";
}

function splitCSV(row) {
  const result = [];
  let current = "";
  let quoted = false;
  for (const char of row) {
    if (char === "\"") quoted = !quoted;
    else if (char === "," && !quoted) {
      result.push(current);
      current = "";
    } else current += char;
  }
  result.push(current);
  return result;
}

async function importCSV() {
  const file = $("#csvFile").files?.[0];
  const pasted = $("#csvPaste").value.trim();
  const text = pasted || (file ? await file.text() : "");
  const imported = parseCSV(text);
  if (!imported.length) {
    showToast(language() === "en" ? "No importable bills recognized" : "没有识别到可导入账单");
    return;
  }
  const unique = imported.filter((candidate) => !state.bills.some((item) =>
    item.type === candidate.type &&
    item.category === candidate.category &&
    Math.abs(Number(item.amount) - Number(candidate.amount)) < 0.01 &&
    inputDate(item.date) === inputDate(candidate.date) &&
    item.merchant === candidate.merchant
  ));
  state.bills.unshift(...unique);
  saveState();
  renderAll();
  showToast(language() === "en" ? `Imported ${unique.length} new bill(s)` : `已导入 ${unique.length} 条新账单`);
}

function exportCSV() {
  const header = "type,amount,currency,category,date,merchant,account,note";
  const rows = state.bills.map((item) => [
    item.type,
    item.amount,
    item.currency || "GBP",
    item.category,
    inputDate(item.date),
    item.merchant,
    item.account,
    item.note
  ].map(csvCell).join(","));
  const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "smart-ledger-bills.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function csvCell(value) {
  const text = String(value ?? "");
  return text.includes(",") ? `"${text.replaceAll("\"", "\"\"")}"` : text;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function bindEvents() {
  $$(".nav-item").forEach((item) => item.addEventListener("click", () => setRoute(item.dataset.route)));
  $$("[data-jump]").forEach((item) => item.addEventListener("click", () => setRoute(item.dataset.jump)));
  $("#quickAddBtn").addEventListener("click", () => openBillDialog());
  $("#addBillBtn").addEventListener("click", () => openBillDialog());
  $("#saveBillBtn").addEventListener("click", saveBillFromDialog);
  $("#languageToggle").addEventListener("click", () => {
    state.settings.language = language() === "en" ? "zh" : "en";
    saveState();
    renderAll();
    showToast(language() === "en" ? "Switched to English" : "已切换为中文");
  });
  $("#seedDataBtn").addEventListener("click", () => {
    const currentLanguage = language();
    state = defaultState();
    state.settings.language = currentLanguage;
    selectedBillIds.clear();
    saveState();
    renderAll();
    showToast(language() === "en" ? "Demo data restored" : "演示数据已恢复");
  });
  $("#clearFiltersBtn").addEventListener("click", () => {
    state.filters = defaultState().filters;
    renderAll();
  });
  ["searchInput", "typeFilter", "categoryFilter", "dateFrom", "dateTo"].forEach((id) => {
    $(`#${id}`).addEventListener("input", () => {
      state.filters = {
        query: $("#searchInput").value,
        type: $("#typeFilter").value,
        category: $("#categoryFilter").value,
        dateFrom: $("#dateFrom").value,
        dateTo: $("#dateTo").value
      };
      saveState();
      renderBillTable();
    });
  });
  $("#batchDeleteBtn").addEventListener("click", deleteSelectedBills);
  $("#selectAllBills").addEventListener("change", (event) => {
    const visibleBills = filteredBills();
    visibleBills.forEach((item) => {
      if (event.target.checked) selectedBillIds.add(item.id);
      else selectedBillIds.delete(item.id);
    });
    renderBillTable();
  });
  document.addEventListener("click", (event) => {
    const editId = event.target.closest("[data-edit]")?.dataset.edit;
    const deleteId = event.target.closest("[data-delete]")?.dataset.delete;
    const presetLabel = event.target.closest("[data-preset]")?.dataset.preset;
    if (editId) openBillDialog(state.bills.find((item) => item.id === editId));
    if (deleteId && confirm(language() === "en" ? "Delete this bill?" : "确认删除这条账单？")) {
      state.bills = state.bills.filter((item) => item.id !== deleteId);
      selectedBillIds.delete(deleteId);
      saveState();
      renderAll();
      showToast(language() === "en" ? "Bill deleted" : "账单已删除");
    }
    if (presetLabel) {
      const preset = quickPresets.find((item) => item.label === presetLabel);
      if (preset) {
        $("#bill_amount").value = preset.amount;
        $("#bill_category").value = preset.category;
        $("#bill_merchant").value = preset.label;
        const paymentInput = $("#bill_payment");
        if (paymentInput) paymentInput.value = normalizePaymentMethod(preset.account);
      }
    }
    if (event.target.id === "confirmScanBtn") {
      const added = addScanDraft();
      showToast(added ? (language() === "en" ? `Added ${added} bill(s)` : `已添加 ${added} 条账单`) : (language() === "en" ? "Please confirm a valid amount first" : "请先确认有效金额"));
    }
    if (event.target.id === "clearScanBtn") {
      scanDraft = null;
      renderScanDraft();
    }
    if (event.target.id === "saveBudgetBtn") saveBudgetSettings();
  });
  document.addEventListener("input", (event) => {
    if (event.target.classList.contains("category-budget-input")) {
      state.settings.categoryBudgets[event.target.dataset.category] = convertAmount(Number(event.target.value) || 0, displayCurrency(), "GBP");
      saveState();
      renderAll();
    }
  });
  document.addEventListener("change", (event) => {
    if (event.target.classList.contains("bill-select")) {
      if (event.target.checked) selectedBillIds.add(event.target.value);
      else selectedBillIds.delete(event.target.value);
      renderBatchDeleteState(filteredBills());
    }
  });
  $("#displayCurrency").addEventListener("change", (event) => {
    state.settings.displayCurrency = normalizeCurrency(event.target.value);
    saveState();
    renderAll();
    showToast(language() === "en" ? `Display currency switched to ${state.settings.displayCurrency}` : `已切换为 ${state.settings.displayCurrency} 展示`);
  });
  $("#receiptFile").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    const preview = $("#imagePreview");
    if (receiptPreviewUrl) {
      URL.revokeObjectURL(receiptPreviewUrl);
      receiptPreviewUrl = "";
    }
    scanDraft = null;
    $("#receiptText").value = "";
    renderScanDraft();
    if (!file) {
      preview.className = "image-preview is-empty";
      preview.textContent = t("noImage");
      $("#largeImagePreview").removeAttribute("src");
      return;
    }
    receiptPreviewUrl = URL.createObjectURL(file);
    const previewAlt = language() === "en" ? "Receipt image preview" : "账单图片预览";
    preview.className = "image-preview has-image";
    preview.innerHTML = `
      <button class="preview-trigger" id="openImagePreviewBtn" type="button" aria-label="${language() === "en" ? "Preview uploaded image" : "预览上传图片"}">
        <img alt="${previewAlt}" src="${receiptPreviewUrl}" />
        <span class="preview-hint">${language() === "en" ? "Click to preview" : "点击预览"}</span>
      </button>
    `;
    $("#largeImagePreview").src = receiptPreviewUrl;
    $("#largeImagePreview").alt = previewAlt;
    showToast(language() === "en" ? "New image selected. Please scan again." : "已选择新图片，请重新识别");
  });
  document.addEventListener("click", (event) => {
    if (event.target.closest("#openImagePreviewBtn") && receiptPreviewUrl) {
      $("#largeImagePreview").src = receiptPreviewUrl;
      $("#imagePreviewDialog").showModal();
    }
    if (event.target.closest("#closeImagePreviewBtn")) {
      $("#imagePreviewDialog").close();
    }
  });
  $("#recognizeBtn").addEventListener("click", recognizeBill);
  $("#sampleScanBtn").addEventListener("click", () => {
    $("#receiptText").value = "面包店 合计 ¥128 2026-05-17 12:30 支付宝";
    recognizeBill();
  });
  $("#statsScope").addEventListener("change", (event) => {
    state.statsScope = event.target.value;
    saveState();
    renderStats();
  });
  $("#importCsvBtn").addEventListener("click", importCSV);
  $("#downloadCsvBtn").addEventListener("click", exportCSV);
  $("#copyTemplateBtn").addEventListener("click", async () => {
    await navigator.clipboard.writeText(language() === "en" ? "type,amount,currency,category,date,merchant,account,note\nExpense,38,GBP,Food,2026-05-17,Lunch,Alipay,Weekday lunch" : "type,amount,currency,category,date,merchant,account,note\n支出,38,GBP,餐饮,2026-05-17,午餐,支付宝,工作日午餐");
    showToast(language() === "en" ? "CSV template copied" : "CSV 模板已复制");
  });
  $("#clearAllBtn").addEventListener("click", () => {
    if (!confirm(language() === "en" ? "Clear all local bills and budget data?" : "确认清空全部本地账单和预算？")) return;
    const currentLanguage = language();
    state = defaultState();
    state.settings.language = currentLanguage;
    selectedBillIds.clear();
    saveState();
    renderAll();
    showToast(language() === "en" ? "Data cleared and demo data restored" : "数据已清空并恢复演示数据");
  });
  window.addEventListener("resize", () => {
    renderDashboard();
    renderStats();
  });
}

async function boot() {
  const localState = savedLocalState();
  const remoteState = await loadStateFromAPI();
  if (remoteState) {
    const shouldMigrateLocal = localState?.bills?.length && !remoteState.bills?.length;
    state = shouldMigrateLocal ? localState : remoteState;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (shouldMigrateLocal) saveStateToAPI();
  }
  bindEvents();
  renderAll();
}

boot();
