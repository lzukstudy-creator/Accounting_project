import SwiftUI

struct AdvisorView: View {
    @EnvironmentObject private var store: BillStore
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                hero
                salaryPlan

                VStack(alignment: .leading, spacing: 12) {
                    SectionHeader(title: "AI 财务建议", actionTitle: nil, action: nil)
                    ForEach(store.advice()) { advice in
                        WarningBanner(advice: advice)
                    }
                }

                controlTargets
            }
            .padding(20)
        }
        .background(AppColor.background.ignoresSafeArea())
        .navigationTitle("AI 财务助手")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .cancellationAction) {
                Button("关闭") { dismiss() }
            }
        }
    }

    private var hero: some View {
        VStack(alignment: .leading, spacing: 10) {
            Label("消费习惯诊断", systemImage: "sparkles")
                .font(.title3.weight(.bold))
                .foregroundColor(AppColor.green)

            Text("根据本月账单、预算和收入，自动分析哪些花销应该控制，并给出下月工资分配建议。")
                .font(.subheadline)
                .foregroundColor(AppColor.muted)
        }
        .padding(18)
        .appCard()
    }

    private var salaryPlan: some View {
        let income = store.budget.monthlyIncome
        let items: [(String, Double, Color, String)] = [
            ("必要支出", income * 0.5, AppColor.blue, "房租、通勤、水电、基础餐饮"),
            ("储蓄", max(income * 0.2, store.budget.savingsGoal), AppColor.green, "发薪后先转入储蓄账户"),
            ("弹性消费", income * 0.25, AppColor.orange, "购物、娱乐、外卖从这里控制"),
            ("备用金", income * 0.05, AppColor.purple, "医疗、维修和意外开销")
        ]

        return VStack(alignment: .leading, spacing: 12) {
            SectionHeader(title: "工资分配", actionTitle: nil, action: nil)

            ForEach(items.indices, id: \.self) { index in
                let item = items[index]
                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        Text(item.0)
                            .font(.subheadline.weight(.bold))
                        Spacer()
                        Text(currency(item.1))
                            .font(.subheadline.weight(.bold))
                            .foregroundColor(item.2)
                    }
                    Text(item.3)
                        .font(.caption)
                        .foregroundColor(AppColor.muted)
                    ProgressBar(progress: income > 0 ? item.1 / income : 0, tint: item.2)
                }
                .padding(14)
                .background(Color.white)
                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
            }
        }
    }

    private var controlTargets: some View {
        let totals = Array(store.categoryTotals().prefix(3))

        return VStack(alignment: .leading, spacing: 12) {
            SectionHeader(title: "优先控制项", actionTitle: nil, action: nil)

            if totals.isEmpty {
                EmptyState(title: "暂无控制项", message: "当账单变多后，AI 会找出增长最快和占比最高的分类。", symbol: "scope")
            } else {
                ForEach(totals.indices, id: \.self) { index in
                    let item = totals[index]
                    HStack(spacing: 12) {
                        CategoryIcon(category: item.category)
                        VStack(alignment: .leading, spacing: 4) {
                            Text(item.category.rawValue)
                                .font(.headline)
                            Text("本月已花 \(currency(item.total))，建议下月减少 10%-20%。")
                                .font(.caption)
                                .foregroundColor(AppColor.muted)
                        }
                        Spacer()
                    }
                    .padding(14)
                    .background(Color.white)
                    .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                }
            }
        }
    }
}
