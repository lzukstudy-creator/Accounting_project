import Foundation
import SwiftUI

final class BillStore: ObservableObject {
    @Published var bills: [Bill] = [] {
        didSet { save() }
    }

    @Published var budget: BudgetSettings = .default {
        didSet { save() }
    }

    private let fileURL: URL
    private let calendar = Calendar.current

    init() {
        let directory = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("SmartLedger", isDirectory: true)
        try? FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
        fileURL = directory.appendingPathComponent("ledger.json")
        load()
    }

    func add(_ bill: Bill) {
        bills.insert(bill, at: 0)
    }

    func update(_ bill: Bill) {
        guard let index = bills.firstIndex(where: { $0.id == bill.id }) else { return }
        var updated = bill
        updated.updatedAt = Date()
        bills[index] = updated
    }

    func delete(_ bill: Bill) {
        bills.removeAll { $0.id == bill.id }
    }

    func delete(at offsets: IndexSet, from visibleBills: [Bill]) {
        let ids = offsets.map { visibleBills[$0].id }
        bills.removeAll { ids.contains($0.id) }
    }

    func resetDemoData() {
        budget = .default
        bills = Self.demoBills()
    }

    func addRecognizedDraft(_ draft: BillDraft) {
        add(draft.makeBill(source: .aiScan))
    }

    func importCSV(contents: String) throws -> Int {
        let imported = try BillCSVImporter.parse(contents)
        guard !imported.isEmpty else { return 0 }
        let unique = imported.filter { candidate in
            !bills.contains { existing in
                abs(existing.amount - candidate.amount) < 0.01 &&
                existing.type == candidate.type &&
                calendar.isDate(existing.date, inSameDayAs: candidate.date) &&
                existing.merchant.localizedCaseInsensitiveContains(candidate.merchant)
            }
        }
        bills.insert(contentsOf: unique, at: 0)
        return unique.count
    }

    func importSampleData() -> Int {
        let csv = """
        type,amount,category,date,merchant,account,note
        支出,38,餐饮,2026-05-01 12:20,午餐,支付宝,工作日午餐
        支出,268,购物,2026-05-02 20:15,电商平台,微信,生活用品
        支出,18,娱乐,2026-05-03 09:00,视频会员,银行卡,自动续费
        收入,12000,工资,2026-05-05 09:30,公司,银行卡,月工资
        支出,128,餐饮,2026-05-06 19:40,面包店,支付宝,AI 样例
        """
        return (try? importCSV(contents: csv)) ?? 0
    }

    func bills(in scope: StatisticsScope, around date: Date = Date()) -> [Bill] {
        bills.filter { bill in
            switch scope {
            case .day:
                return calendar.isDate(bill.date, inSameDayAs: date)
            case .month:
                return calendar.isDate(bill.date, equalTo: date, toGranularity: .month)
            case .year:
                return calendar.isDate(bill.date, equalTo: date, toGranularity: .year)
            }
        }
    }

    func snapshot(for scope: StatisticsScope = .month) -> LedgerSnapshot {
        let scoped = bills(in: scope)
        let income = scoped.filter { $0.type == .income }.reduce(0) { $0 + $1.amount }
        let expense = scoped.filter { $0.type == .expense }.reduce(0) { $0 + $1.amount }
        let usage = budget.monthlyBudget > 0 ? expense / budget.monthlyBudget : 0
        return LedgerSnapshot(income: income, expense: expense, balance: income - expense, budgetUsage: usage)
    }

    func categoryTotals(scope: StatisticsScope = .month) -> [(category: BillCategory, total: Double)] {
        let expenses = bills(in: scope).filter { $0.type == .expense }
        return BillCategory.expenseDefaults.compactMap { category in
            let total = expenses.filter { $0.category == category }.reduce(0) { $0 + $1.amount }
            return total > 0 ? (category, total) : nil
        }
        .sorted { $0.total > $1.total }
    }

    func dailyExpenseSeries(days: Int = 7) -> [(label: String, total: Double)] {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "zh_CN")
        formatter.dateFormat = "M/d"

        return (0..<days).reversed().map { offset in
            let day = calendar.date(byAdding: .day, value: -offset, to: Date()) ?? Date()
            let total = bills
                .filter { $0.type == .expense && calendar.isDate($0.date, inSameDayAs: day) }
                .reduce(0) { $0 + $1.amount }
            return (formatter.string(from: day), total)
        }
    }

    func budgetState() -> Advice.Severity {
        let usage = snapshot().budgetUsage
        if usage >= budget.severeThreshold { return .danger }
        if usage >= budget.dangerThreshold { return .danger }
        if usage >= budget.warningThreshold { return .warning }
        return .success
    }

    func advice() -> [Advice] {
        var result: [Advice] = []
        let snapshot = snapshot()
        let categories = categoryTotals()

        if snapshot.budgetUsage >= budget.dangerThreshold {
            result.append(Advice(
                title: "花销已超预期",
                message: "本月预算已使用 \(percent(snapshot.budgetUsage))，建议暂停非必要购物和娱乐支出。",
                severity: .danger
            ))
        } else if snapshot.budgetUsage >= budget.warningThreshold {
            result.append(Advice(
                title: "预算接近上限",
                message: "本月预算已使用 \(percent(snapshot.budgetUsage))，接下来优先控制高频小额消费。",
                severity: .warning
            ))
        } else {
            result.append(Advice(
                title: "预算状态健康",
                message: "当前支出仍在预算内，可以继续保持先储蓄、后消费的节奏。",
                severity: .success
            ))
        }

        if let top = categories.first {
            let ratio = snapshot.expense > 0 ? top.total / snapshot.expense : 0
            result.append(Advice(
                title: "\(top.category.rawValue) 是最高支出",
                message: "\(top.category.rawValue)占本月支出的 \(percent(ratio))。建议为该分类设置单独预算，并记录每周上限。",
                severity: ratio > 0.3 ? .warning : .info
            ))
        }

        let recommendedSavings = max(budget.monthlyIncome * 0.2, budget.savingsGoal)
        result.append(Advice(
            title: "工资分配建议",
            message: "月收入 \(currency(budget.monthlyIncome)) 可优先储蓄 \(currency(recommendedSavings))，必要支出控制在 \(currency(budget.monthlyIncome * 0.5)) 以内。",
            severity: .info
        ))

        let flexible = max(0, budget.monthlyIncome - recommendedSavings - budget.monthlyIncome * 0.5)
        result.append(Advice(
            title: "下月可自由支配",
            message: "建议弹性消费不超过 \(currency(flexible))，购物、娱乐和外卖从这里扣减。",
            severity: .info
        ))

        return result
    }

    private func load() {
        guard let data = try? Data(contentsOf: fileURL) else {
            bills = Self.demoBills()
            budget = .default
            return
        }

        do {
            let payload = try JSONDecoder.ledger.decode(Payload.self, from: data)
            bills = payload.bills.sorted { $0.date > $1.date }
            budget = payload.budget
        } catch {
            bills = Self.demoBills()
            budget = .default
        }
    }

    private func save() {
        let payload = Payload(bills: bills, budget: budget)
        guard let data = try? JSONEncoder.ledger.encode(payload) else { return }
        try? data.write(to: fileURL, options: [.atomic])
    }

    private struct Payload: Codable {
        var bills: [Bill]
        var budget: BudgetSettings
    }

    private static func demoBills() -> [Bill] {
        let calendar = Calendar.current
        func date(_ dayOffset: Int, hour: Int, minute: Int = 0) -> Date {
            let base = calendar.date(byAdding: .day, value: dayOffset, to: Date()) ?? Date()
            return calendar.date(bySettingHour: hour, minute: minute, second: 0, of: base) ?? base
        }

        return [
            Bill(type: .income, amount: 12_000, category: .salary, date: date(-4, hour: 9), merchant: "公司", account: "银行卡", note: "月工资"),
            Bill(type: .expense, amount: 3_000, category: .housing, date: date(-3, hour: 8), merchant: "房租", account: "银行卡", note: "固定支出"),
            Bill(type: .expense, amount: 38, category: .food, date: date(0, hour: 12, minute: 20), merchant: "午餐", account: "支付宝"),
            Bill(type: .expense, amount: 26, category: .transport, date: date(0, hour: 8, minute: 42), merchant: "打车", account: "微信"),
            Bill(type: .expense, amount: 128, category: .food, date: date(-1, hour: 19, minute: 40), merchant: "面包店", account: "支付宝", source: .aiScan, confidence: 0.92),
            Bill(type: .expense, amount: 268, category: .shopping, date: date(-2, hour: 21, minute: 15), merchant: "电商平台", account: "微信", note: "生活用品"),
            Bill(type: .expense, amount: 68, category: .entertainment, date: date(-5, hour: 20), merchant: "电影", account: "支付宝"),
            Bill(type: .expense, amount: 18, category: .entertainment, date: date(-6, hour: 9), merchant: "视频会员", account: "银行卡", note: "自动续费")
        ].sorted { $0.date > $1.date }
    }
}

enum BillCSVImporter {
    static func parse(_ contents: String) throws -> [Bill] {
        let rows = contents
            .split(whereSeparator: \.isNewline)
            .map { String($0) }
            .filter { !$0.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty }

        guard rows.count > 1 else { return [] }
        let headers = splitCSVRow(rows[0]).map { $0.trimmingCharacters(in: .whitespacesAndNewlines).lowercased() }

        return rows.dropFirst().compactMap { row in
            let values = splitCSVRow(row)
            guard !values.isEmpty else { return nil }

            func value(_ names: [String]) -> String {
                for name in names {
                    if let index = headers.firstIndex(of: name), values.indices.contains(index) {
                        return values[index].trimmingCharacters(in: .whitespacesAndNewlines)
                    }
                }
                return ""
            }

            let type = BillType(rawValue: value(["type", "类型", "收支"])) ?? .expense
            let amountText = value(["amount", "金额", "money"]).replacingOccurrences(of: "¥", with: "")
            let amount = Double(amountText) ?? 0
            guard amount > 0 else { return nil }

            let category = BillCategory(rawValue: value(["category", "分类"])) ?? .other
            let date = parseDate(value(["date", "日期", "time", "时间"])) ?? Date()
            let merchant = value(["merchant", "商户", "title", "交易对象"])
            let account = value(["account", "账户", "支付账户"])
            let note = value(["note", "备注"])

            return Bill(
                type: type,
                amount: amount,
                category: category,
                date: date,
                merchant: merchant.isEmpty ? category.rawValue : merchant,
                account: account.isEmpty ? "导入账户" : account,
                note: note,
                source: .imported
            )
        }
    }

    private static func splitCSVRow(_ row: String) -> [String] {
        var result: [String] = []
        var current = ""
        var quoted = false

        for character in row {
            if character == "\"" {
                quoted.toggle()
            } else if character == "," && !quoted {
                result.append(current)
                current = ""
            } else {
                current.append(character)
            }
        }

        result.append(current)
        return result
    }

    private static func parseDate(_ text: String) -> Date? {
        guard !text.isEmpty else { return nil }
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "zh_CN")
        for format in ["yyyy-MM-dd HH:mm", "yyyy/MM/dd HH:mm", "yyyy-MM-dd", "yyyy/MM/dd", "MM-dd HH:mm"] {
            formatter.dateFormat = format
            if let date = formatter.date(from: text) { return date }
        }
        return nil
    }
}

extension JSONEncoder {
    static var ledger: JSONEncoder {
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        encoder.dateEncodingStrategy = .iso8601
        return encoder
    }
}

extension JSONDecoder {
    static var ledger: JSONDecoder {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return decoder
    }
}

func currency(_ value: Double) -> String {
    let formatter = NumberFormatter()
    formatter.numberStyle = .currency
    formatter.currencyCode = "CNY"
    formatter.maximumFractionDigits = 0
    formatter.locale = Locale(identifier: "zh_CN")
    return formatter.string(from: NSNumber(value: value)) ?? "¥\(Int(value))"
}

func percent(_ value: Double) -> String {
    let formatter = NumberFormatter()
    formatter.numberStyle = .percent
    formatter.maximumFractionDigits = 0
    return formatter.string(from: NSNumber(value: value)) ?? "\(Int(value * 100))%"
}
