import SwiftUI

struct StatisticsView: View {
    @EnvironmentObject private var store: BillStore
    @State private var scope: StatisticsScope = .month

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                Picker("统计维度", selection: $scope) {
                    ForEach(StatisticsScope.allCases) { scope in
                        Text(scope.rawValue).tag(scope)
                    }
                }
                .pickerStyle(.segmented)

                metricGrid

                VStack(alignment: .leading, spacing: 12) {
                    SectionHeader(title: "近 7 日支出趋势", actionTitle: nil, action: nil)
                    SimpleBarChart(values: store.dailyExpenseSeries(), tint: AppColor.blue)
                }

                categorySection
            }
            .padding(20)
        }
        .background(AppColor.background.ignoresSafeArea())
        .navigationTitle("统计分析")
    }

    private var metricGrid: some View {
        let snapshot = store.snapshot(for: scope)

        return LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
            MetricCard(title: "\(scope.rawValue)收入", value: currency(snapshot.income), note: "收入合计", tint: AppColor.green, symbol: "banknote.fill")
            MetricCard(title: "\(scope.rawValue)支出", value: currency(snapshot.expense), note: "支出合计", tint: AppColor.orange, symbol: "creditcard.fill")
            MetricCard(title: "\(scope.rawValue)结余", value: currency(snapshot.balance), note: "收入 - 支出", tint: AppColor.blue, symbol: "sum")
            MetricCard(title: "预算使用", value: snapshot.budgetUsage.formatted(.percent.precision(.fractionLength(0))), note: "按月预算计算", tint: AppColor.purple, symbol: "speedometer")
        }
    }

    private var categorySection: some View {
        let totals = store.categoryTotals(scope: scope)
        let maxTotal = max(totals.map { $0.total }.max() ?? 1, 1)

        return VStack(alignment: .leading, spacing: 12) {
            SectionHeader(title: "分类占比", actionTitle: nil, action: nil)

            if totals.isEmpty {
                EmptyState(title: "暂无支出数据", message: "新增账单后会自动生成分类统计。", symbol: "chart.pie")
            } else {
                VStack(spacing: 14) {
                    ForEach(totals.indices, id: \.self) { index in
                        let item = totals[index]
                        VStack(alignment: .leading, spacing: 8) {
                            HStack {
                                Label(item.category.rawValue, systemImage: item.category.symbolName)
                                    .font(.subheadline.weight(.semibold))
                                    .foregroundColor(AppColor.ink)
                                Spacer()
                                Text(currency(item.total))
                                    .font(.subheadline.weight(.bold))
                                    .foregroundColor(AppColor.tint(for: item.category))
                            }

                            ProgressBar(progress: item.total / maxTotal, tint: AppColor.tint(for: item.category))
                        }
                        .padding(14)
                        .background(Color.white)
                        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                    }
                }
            }
        }
    }
}
