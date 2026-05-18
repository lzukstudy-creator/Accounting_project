import SwiftUI

struct BillEditorView: View {
    @EnvironmentObject private var store: BillStore
    @Environment(\.dismiss) private var dismiss

    private let bill: Bill?

    @State private var type: BillType
    @State private var amountText: String
    @State private var category: BillCategory
    @State private var date: Date
    @State private var merchant: String
    @State private var account: String
    @State private var paymentMethod: String
    @State private var note: String

    init(bill: Bill? = nil) {
        self.bill = bill
        _type = State(initialValue: bill?.type ?? .expense)
        _amountText = State(initialValue: bill.map { String(format: "%.2f", $0.amount) } ?? "")
        _category = State(initialValue: bill?.category ?? .food)
        _date = State(initialValue: bill?.date ?? Date())
        _merchant = State(initialValue: bill?.merchant ?? "")
        _account = State(initialValue: bill?.account ?? "支付宝")
        _paymentMethod = State(initialValue: bill?.paymentMethod ?? "移动支付")
        _note = State(initialValue: bill?.note ?? "")
    }

    var body: some View {
        Form {
            Section("类型与金额") {
                Picker("类型", selection: $type) {
                    ForEach(BillType.allCases) { type in
                        Text(type.rawValue).tag(type)
                    }
                }
                .pickerStyle(.segmented)

                TextField("金额", text: $amountText)
                    .keyboardType(.decimalPad)
                    .font(.title3.weight(.bold))
            }

            Section("账单信息") {
                Picker("分类", selection: $category) {
                    ForEach(categoryOptions) { category in
                        Label(category.rawValue, systemImage: category.symbolName).tag(category)
                    }
                }

                DatePicker("时间", selection: $date)
                TextField("商户", text: $merchant)
                TextField("账户", text: $account)
                TextField("支付方式", text: $paymentMethod)
                TextField("备注", text: $note, axis: .vertical)
                    .lineLimit(2...4)
            }

            if let bill, bill.source != .manual {
                Section("来源") {
                    LabeledContent("来源", value: bill.source.rawValue)
                    if let confidence = bill.confidence {
                        LabeledContent("AI 置信度", value: confidence.formatted(.percent.precision(.fractionLength(0))))
                    }
                }
            }
        }
        .navigationTitle(bill == nil ? "新增账单" : "编辑账单")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .cancellationAction) {
                Button("取消") { dismiss() }
            }

            ToolbarItem(placement: .confirmationAction) {
                Button("保存") { save() }
                    .disabled(Double(amountText) == nil || (Double(amountText) ?? 0) <= 0)
            }
        }
        .onChange(of: type) {
            if type == .income && ![BillCategory.salary, .other, .savings].contains(category) {
                category = .salary
            } else if type == .expense && !BillCategory.expenseDefaults.contains(category) {
                category = .food
            }
        }
    }

    private var categoryOptions: [BillCategory] {
        switch type {
        case .expense:
            BillCategory.expenseDefaults
        case .income:
            [.salary, .savings, .other]
        case .transfer:
            [.savings, .other]
        }
    }

    private func save() {
        guard let amount = Double(amountText), amount > 0 else { return }

        let saved = Bill(
            id: bill?.id ?? UUID(),
            type: type,
            amount: amount,
            category: category,
            date: date,
            merchant: merchant.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? category.rawValue : merchant,
            account: account.isEmpty ? "默认账户" : account,
            paymentMethod: paymentMethod.isEmpty ? "未知" : paymentMethod,
            note: note,
            source: bill?.source ?? .manual,
            confidence: bill?.confidence,
            createdAt: bill?.createdAt ?? Date(),
            updatedAt: Date()
        )

        if bill == nil {
            store.add(saved)
        } else {
            store.update(saved)
        }
        dismiss()
    }
}
