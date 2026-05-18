import SwiftUI
import UniformTypeIdentifiers
import UIKit

struct SettingsView: View {
    @EnvironmentObject private var store: BillStore
    @Environment(\.dismiss) private var dismiss
    @State private var showingImporter = false
    @State private var alertMessage: String?
    @State private var confirmReset = false

    var body: some View {
        List {
            Section("数据") {
                Button {
                    let count = store.importSampleData()
                    alertMessage = "已导入 \(count) 条示例账单。"
                } label: {
                    Label("导入示例账单", systemImage: "square.and.arrow.down")
                }

                Button {
                    showingImporter = true
                } label: {
                    Label("选择 CSV 文件导入", systemImage: "doc.badge.plus")
                }

                Button {
                    UIPasteboard.general.string = csvTemplate
                    alertMessage = "CSV 模板已复制，可按模板整理银行流水或支付账单。"
                } label: {
                    Label("复制 CSV 模板", systemImage: "doc.on.doc")
                }
            }

            Section("预算与分类") {
                LabeledContent("月收入", value: currency(store.budget.monthlyIncome))
                LabeledContent("月预算", value: currency(store.budget.monthlyBudget))
                LabeledContent("储蓄目标", value: currency(store.budget.savingsGoal))
                LabeledContent("账单数量", value: "\(store.bills.count)")
            }

            Section("隐私") {
                Text("图片识别使用设备本地 OCR。账单数据保存在本机应用目录中，可通过重置演示数据清空。")
                    .font(.footnote)
                    .foregroundColor(AppColor.muted)
            }

            Section {
                Button(role: .destructive) {
                    confirmReset = true
                } label: {
                    Label("重置演示数据", systemImage: "arrow.counterclockwise")
                }
            }
        }
        .navigationTitle("设置")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .cancellationAction) {
                Button("关闭") { dismiss() }
            }
        }
        .fileImporter(
            isPresented: $showingImporter,
            allowedContentTypes: [.commaSeparatedText, .plainText],
            allowsMultipleSelection: false
        ) { result in
            importFile(result)
        }
        .alert("提示", isPresented: Binding(get: { alertMessage != nil }, set: { if !$0 { alertMessage = nil } })) {
            Button("好") { alertMessage = nil }
        } message: {
            Text(alertMessage ?? "")
        }
        .confirmationDialog("确认重置数据？", isPresented: $confirmReset, titleVisibility: .visible) {
            Button("重置", role: .destructive) {
                store.resetDemoData()
            }
        } message: {
            Text("这会恢复演示账单和默认预算。")
        }
    }

    private var csvTemplate: String {
        """
        type,amount,category,date,merchant,account,note
        支出,38,餐饮,2026-05-01 12:20,午餐,支付宝,工作日午餐
        收入,12000,工资,2026-05-05 09:30,公司,银行卡,月工资
        """
    }

    private func importFile(_ result: Result<[URL], Error>) {
        do {
            guard let url = try result.get().first else { return }
            let canAccess = url.startAccessingSecurityScopedResource()
            defer {
                if canAccess { url.stopAccessingSecurityScopedResource() }
            }
            let contents = try String(contentsOf: url, encoding: .utf8)
            let count = try store.importCSV(contents: contents)
            alertMessage = "已导入 \(count) 条新账单。"
        } catch {
            alertMessage = error.localizedDescription
        }
    }
}
