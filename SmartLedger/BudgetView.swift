import SwiftUI

struct BudgetView: View {
    @EnvironmentObject private var store: BillStore
    @State private var monthlyIncome = ""
    @State private var monthlyBudget = ""
    @State private var savingsGoal = ""
    @State private var showingAdvisor = false
    @State private var saved = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                budgetSummary
                editorCard
                categoryBudgets

                Button {
                    showingAdvisor = true
                } label: {
                    Label("查看 AI 工资分配建议", systemImage: "sparkles")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding()
                }
                .buttonStyle(.borderedProminent)
                .accentColor(AppColor.green)
            }
            .padding(20)
        }
        .background(AppColor.background.ignoresSafeArea())
        .navigationTitle("预算管理")
        .onAppear(perform: syncFromStore)
        .sheet(isPresented: $showingAdvisor) {
            NavigationStack {
                AdvisorView()
            }
        }
        .alert("预算已保存", isPresented: $saved) {
            Button("好") { }
        } message: {
            Text("首页、统计和 AI 建议会基于新的预算重新计算。")
        }
    }

    private var budgetSummary: some View {
        let snapshot = store.snapshot()
        let tint = AppColor.tint(for: store.budgetState())

        return VStack(alignment: .leading, spacing: 14) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("本月预算状态")
                        .font(.headline)
                    Text("已支出 \(currency(snapshot.expense)) / \(currency(store.budget.monthlyBudget))")
                        .font(.subheadline)
                        .foregroundColor(AppColor.muted)
                }
                Spacer()
                Text(snapshot.budgetUsage.formatted(.percent.precision(.fractionLength(0))))
                    .font(.title2.weight(.bold))
                    .foregroundColor(tint)
            }

            ProgressBar(progress: snapshot.budgetUsage, tint: tint)
        }
        .padding(18)
        .appCard()
    }

    private var editorCard: some View {
        VStack(alignment: .leading, spacing: 14) {
            SectionHeader(title: "收入与预算", actionTitle: nil, action: nil)

            TextField("月收入", text: $monthlyIncome)
                .keyboardType(.decimalPad)
                .textFieldStyle(.roundedBorder)

            TextField("月预算", text: $monthlyBudget)
                .keyboardType(.decimalPad)
                .textFieldStyle(.roundedBorder)

            TextField("每月储蓄目标", text: $savingsGoal)
                .keyboardType(.decimalPad)
                .textFieldStyle(.roundedBorder)

            Button {
                saveBudget()
            } label: {
                Label("保存预算", systemImage: "checkmark.circle.fill")
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .accentColor(AppColor.blue)
        }
        .padding(18)
        .appCard()
    }

    private var categoryBudgets: some View {
        VStack(alignment: .leading, spacing: 12) {
            SectionHeader(title: "分类预算", actionTitle: nil, action: nil)

            ForEach(BillCategory.expenseDefaults) { category in
                let budget = store.budget.categoryBudgets[category.rawValue] ?? 0
                let spent = store.categoryTotals().first(where: { $0.category == category })?.total ?? 0

                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        Label(category.rawValue, systemImage: category.symbolName)
                            .font(.subheadline.weight(.semibold))
                        Spacer()
                        Text("\(currency(spent)) / \(currency(budget))")
                            .font(.caption.weight(.semibold))
                            .foregroundColor(AppColor.muted)
                    }

                    ProgressBar(progress: budget > 0 ? spent / budget : 0, tint: AppColor.tint(for: category))
                }
                .padding(14)
                .background(Color.white)
                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                .overlay(
                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                        .stroke(AppColor.line.opacity(0.7), lineWidth: 1)
                )
            }
        }
    }

    private func syncFromStore() {
        monthlyIncome = String(format: "%.0f", store.budget.monthlyIncome)
        monthlyBudget = String(format: "%.0f", store.budget.monthlyBudget)
        savingsGoal = String(format: "%.0f", store.budget.savingsGoal)
    }

    private func saveBudget() {
        store.budget.monthlyIncome = Double(monthlyIncome) ?? store.budget.monthlyIncome
        store.budget.monthlyBudget = Double(monthlyBudget) ?? store.budget.monthlyBudget
        store.budget.savingsGoal = Double(savingsGoal) ?? store.budget.savingsGoal
        saved = true
    }
}
