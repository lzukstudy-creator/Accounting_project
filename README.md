# Smart Ledger / 智能记账

一个支持中英文切换、AI OCR 账单识别、预算预警和财务建议的记账项目。当前项目包含：

- `web-ledger/`：前端页面，支持账单 CRUD、AI 扫描、统计、预算、CSV 导入导出。
- `backend/`：Python 后端 API，使用免费 SQLite 数据库存储数据。
- `SmartLedger/`：早期 SwiftUI iOS MVP 原型代码。

## 推荐运行方式：前后端分离演示

后端不需要安装额外依赖，使用 Python 标准库即可运行：

```bash
python3 backend/server.py
```

然后打开：

```text
http://127.0.0.1:4183/
```

前端会优先连接后端 API，并把数据保存到 SQLite：

```text
backend/data/ledger.db
```

页面顶部会显示「后台数据库 · 自动保存」或 `Backend database · Autosaved`，表示已经接入后端数据库。

## API 接口

```text
GET    /api/health       健康检查
GET    /api/state        获取完整前端状态
PUT    /api/state        保存完整前端状态
GET    /api/bills        获取账单列表
POST   /api/bills        新增一条账单
DELETE /api/bills/{id}   删除一条账单
GET    /api/settings     获取预算和语言等设置
POST   /api/reset        重置数据库状态
```

## 免费数据库选择

当前接入的是 SQLite，适合本地演示和作品集展示：

- 免费，无需注册账号。
- 无需安装数据库服务。
- 数据真实保存到 `.db` 文件。
- 后续可以迁移到 Supabase / PostgreSQL。

## 纯前端兜底

如果只用静态服务器打开 `web-ledger/index.html`，项目仍会使用浏览器 `localStorage` 保存数据，方便离线演示。

## 主要功能

- 首页 Dashboard：本月收入、支出、结余、储蓄目标、预算状态和月度趋势。
- 账单管理：新增、编辑、删除、批量删除、搜索、筛选。
- AI 扫描：免费浏览器 OCR 识别图片，也支持粘贴账单文字，多条账单可自动入账。
- 统计分析：按日、月、年查看收入、支出、结余和分类结构。
- 预算管理：设置月收入、月预算、储蓄目标、分类预算和预警阈值。
- AI 财务建议：根据收入、预算和历史消费给出控制开支和工资分配建议。
- 中英文切换：首页顶部小图标切换中文 / English。
