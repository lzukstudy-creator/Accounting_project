import SwiftUI

struct DashboardView: View {
    @EnvironmentObject private var store: BillStore
    @State private var showingAddBill = false
    @State private var showingAdvisor = false
    @State private var showingSettings = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                header
                metricGrid

                if let firstAdvice = store.advice().first {
                    WarningBanner(advice: firstAdvice)
                }

                budgetCard

                SectionHeader(title: "最近账单", actionTitle: nil, action: nil)

                VStack(spacing: 10) {
                    ForEach(store.bills.prefix(5)) { bill in
                        BillRow(bill: bill)
                    }
                }
            }
            .padding(20)
        }
        .background(AppColor.background.ignoresSafeArea())
        .navigationTitle("智能记账")
        .toolbar {
            ToolbarItem(placement: .topBarLeading) {
                Button {
                    showingSettings = true
                } label: {
                    Image(systemName: "gearshape.fill")
                }
                .accessibilityLabel("设置")
            }

            ToolbarItemGroup(placement: .topBarTrailing) {
                Button {
                    showingAdvisor = true
                } label: {
                    Image(systemName: "sparkles")
                }
                .accessibilityLabel("AI 财务助手")

                Button {
                    showingAddBill = true
                } label: {
                    Image(systemName: "plus.circle.fill")
                }
                .accessibilityLabel("新增账单")
            }
        }
        .sheet(isPresented: $showingAddBill) {
            NavigationStack {
                BillEditorView()
            }
        }
        .sheet(isPresented: $showingAdvisor) {
            NavigationStack {
                AdvisorView()
            }
        }
        .sheet(isPresented: $showingSettings) {
            NavigationStack {
                SettingsView()
            }
        }
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("本月概览")
                .font(.title.weight(.bold))
                .foregroundColor(AppColor.ink)
            Text("自动汇总收入、支出、预算和储蓄建议。")
                .font(.subheadline)
                .foregroundColor(AppColor.muted)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var metricGrid: some View {
        let snapshot = store.snapshot()

        return LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
            MetricCard(title: "本月收入", value: currency(snapshot.income), note: "工资和其他收入", tint: AppColor.green, symbol: "arrow.down.left")
            MetricCard(title: "本月支出", value: currency(snapshot.expense), note: "预算使用 \(snapshot.budgetUsage.formatted(.percent.precision(.fractionLength(0))))", tint: AppColor.orange, symbol: "arrow.up.right")
            MetricCard(title: "本月结余", value: currency(snapshot.balance), note: "收入减支出", tint: AppColor.blue, symbol: "wallet.pass.fill")
            MetricCard(title: "储蓄目标", value: currency(store.budget.savingsGoal), note: "建议先存后花", tint: AppColor.purple, symbol: "safe.fill")
        }
    }

    private var budgetCard: some View {
        let snapshot = store.snapshot()
        let tint = AppColor.tint(for: store.budgetState())
        let remaining = max(0, store.budget.monthlyBudget - snapshot.expense)

        return VStack(alignment: .leading, spacing: 14) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("本月预算")
                        .font(.headline)
                    Text("剩余 \(currency(remaining))")
                        .font(.subheadline)
                        .foregroundColor(AppColor.muted)
                }
                Spacer()
                Text(currency(store.budget.monthlyBudget))
                    .font(.headline.weight(.bold))
                    .monospacedDigit()
            }

            ProgressBar(progress: snapshot.budgetUsage, tint: tint)

            HStack {
                Text("已用 \(snapshot.budgetUsage.formatted(.percent.precision(.fractionLength(0))))")
                Spacer()
                Button("查看 AI 建议") {
                    showingAdvisor = true
                }
                .fontWeight(.semibold)
            }
            .font(.caption)
            .foregroundColor(AppColor.muted)
        }
        .padding(18)
        .appCard()
    }
}
