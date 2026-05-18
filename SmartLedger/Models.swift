import Foundation

enum BillType: String, CaseIterable, Codable, Identifiable {
    case expense = "支出"
    case income = "收入"
    case transfer = "转账"

    var id: String { rawValue }

    var symbolName: String {
        switch self {
        case .expense:
            return "arrow.up.right"
        case .income:
            return "arrow.down.left"
        case .transfer:
            return "arrow.left.arrow.right"
        }
    }
}

enum BillCategory: String, CaseIterable, Codable, Identifiable {
    case food = "餐饮"
    case transport = "交通"
    case shopping = "购物"
    case housing = "住房"
    case entertainment = "娱乐"
    case health = "医疗"
    case education = "教育"
    case utilities = "水电"
    case salary = "工资"
    case savings = "储蓄"
    case other = "其他"

    var id: String { rawValue }

    var symbolName: String {
        switch self {
        case .food:
            return "fork.knife"
        case .transport:
            return "tram.fill"
        case .shopping:
            return "bag.fill"
        case .housing:
            return "house.fill"
        case .entertainment:
            return "sparkles"
        case .health:
            return "cross.case.fill"
        case .education:
            return "book.fill"
        case .utilities:
            return "bolt.fill"
        case .salary:
            return "banknote.fill"
        case .savings:
            return "safe.fill"
        case .other:
            return "square.grid.2x2.fill"
        }
    }

    static var expenseDefaults: [BillCategory] {
        [.food, .transport, .shopping, .housing, .entertainment, .health, .education, .utilities, .other]
    }
}

enum BillSource: String, Codable, CaseIterable, Identifiable {
    case manual = "手动"
    case aiScan = "AI 扫描"
    case imported = "导入"
    case recurring = "周期"

    var id: String { rawValue }
}

struct Bill: Identifiable, Codable, Hashable {
    var id: UUID
    var type: BillType
    var amount: Double
    var category: BillCategory
    var date: Date
    var merchant: String
    var account: String
    var paymentMethod: String
    var note: String
    var tags: [String]
    var source: BillSource
    var confidence: Double?
    var createdAt: Date
    var updatedAt: Date

    init(
        id: UUID = UUID(),
        type: BillType,
        amount: Double,
        category: BillCategory,
        date: Date,
        merchant: String,
        account: String = "支付宝",
        paymentMethod: String = "移动支付",
        note: String = "",
        tags: [String] = [],
        source: BillSource = .manual,
        confidence: Double? = nil,
        createdAt: Date = Date(),
        updatedAt: Date = Date()
    ) {
        self.id = id
        self.type = type
        self.amount = abs(amount)
        self.category = category
        self.date = date
        self.merchant = merchant
        self.account = account
        self.paymentMethod = paymentMethod
        self.note = note
        self.tags = tags
        self.source = source
        self.confidence = confidence
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }

    var signedAmount: Double {
        switch type {
        case .expense:
            return -amount
        case .income:
            return amount
        case .transfer:
            return 0
        }
    }
}

struct BillDraft: Identifiable, Hashable {
    var id = UUID()
    var type: BillType = .expense
    var amount: Double = 0
    var category: BillCategory = .other
    var date: Date = Date()
    var merchant: String = "未识别商户"
    var account: String = "支付宝"
    var paymentMethod: String = "移动支付"
    var note: String = ""
    var confidence: Double = 0.72

    func makeBill(source: BillSource) -> Bill {
        Bill(
            type: type,
            amount: amount,
            category: category,
            date: date,
            merchant: merchant,
            account: account,
            paymentMethod: paymentMethod,
            note: note,
            source: source,
            confidence: confidence
        )
    }
}

struct BudgetSettings: Codable, Equatable {
    var monthlyIncome: Double
    var monthlyBudget: Double
    var warningThreshold: Double
    var dangerThreshold: Double
    var severeThreshold: Double
    var savingsGoal: Double
    var categoryBudgets: [String: Double]

    static let `default` = BudgetSettings(
        monthlyIncome: 12_000,
        monthlyBudget: 8_000,
        warningThreshold: 0.8,
        dangerThreshold: 1.0,
        severeThreshold: 1.2,
        savingsGoal: 2_400,
        categoryBudgets: [
            BillCategory.food.rawValue: 1_800,
            BillCategory.transport.rawValue: 600,
            BillCategory.shopping.rawValue: 1_200,
            BillCategory.housing.rawValue: 3_000,
            BillCategory.entertainment.rawValue: 800
        ]
    )
}

struct Advice: Identifiable, Hashable {
    var id = UUID()
    var title: String
    var message: String
    var severity: Severity

    enum Severity: String, Hashable {
        case info
        case warning
        case danger
        case success
    }
}

enum StatisticsScope: String, CaseIterable, Identifiable {
    case day = "日"
    case month = "月"
    case year = "年"

    var id: String { rawValue }
}

struct LedgerSnapshot {
    var income: Double
    var expense: Double
    var balance: Double
    var budgetUsage: Double
}
