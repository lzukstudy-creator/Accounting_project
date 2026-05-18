import PhotosUI
import SwiftUI

struct AIScannerView: View {
    @EnvironmentObject private var store: BillStore
    @State private var selectedItem: PhotosPickerItem?
    @State private var draft: BillDraft?
    @State private var isScanning = false
    @State private var errorMessage: String?
    @State private var didAddBill = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                introCard

                HStack(spacing: 12) {
                    PhotosPicker(selection: $selectedItem, matching: .images) {
                        Label("上传账单图片", systemImage: "photo.on.rectangle")
                            .font(.headline)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(AppColor.purple, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
                            .foregroundColor(.white)
                    }

                    Button {
                        draft = OCRService.sampleDraft()
                    } label: {
                        Label("示例识别", systemImage: "sparkles")
                            .font(.headline)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(AppColor.green, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
                            .foregroundColor(.white)
                    }
                }

                if isScanning {
                    HStack(spacing: 12) {
                        ProgressView()
                        Text("正在识别图片文字...")
                            .foregroundColor(AppColor.muted)
                    }
                    .padding(18)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .appCard()
                }

                if let errorMessage {
                    WarningBanner(advice: Advice(title: "识别失败", message: errorMessage, severity: .warning))
                }

                if draft != nil {
                    resultEditor
                } else {
                    EmptyState(
                        title: "等待账单图片",
                        message: "选择支付截图、票据照片或使用示例识别。识别结果会先生成草稿，确认后才会入账。",
                        symbol: "viewfinder"
                    )
                }
            }
            .padding(20)
        }
        .background(AppColor.background.ignoresSafeArea())
        .navigationTitle("AI 扫描")
        .onChange(of: selectedItem) { _, newItem in
            Task { await recognize(newItem) }
        }
        .alert("已自动添加账单", isPresented: $didAddBill) {
            Button("好") { }
        } message: {
            Text("账单已经写入列表，并会同步更新首页和统计。")
        }
    }

    private var introCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "doc.text.viewfinder")
                    .font(.title2)
                    .foregroundColor(AppColor.purple)
                Text("AI 扫描识别账单")
                    .font(.title3.weight(.bold))
                    .foregroundColor(AppColor.ink)
            }

            Text("支持上传截图或票据照片，使用系统 OCR 提取金额、商户、时间和分类。结果可修改，确认后自动记账。")
                .font(.subheadline)
                .foregroundColor(AppColor.muted)
        }
        .padding(18)
        .appCard()
    }

    private var resultEditor: some View {
        VStack(alignment: .leading, spacing: 16) {
            SectionHeader(title: "识别结果", actionTitle: nil, action: nil)

            HStack {
                Text("置信度")
                    .foregroundColor(AppColor.muted)
                Spacer()
                Text(confidenceText)
                    .fontWeight(.bold)
                    .foregroundColor(AppColor.purple)
            }

            TextField("金额", value: binding(\.amount, fallback: 0), format: .number.precision(.fractionLength(2)))
                .keyboardType(.decimalPad)
                .textFieldStyle(.roundedBorder)

            Picker("类型", selection: binding(\.type, fallback: .expense)) {
                ForEach(BillType.allCases) { type in
                    Text(type.rawValue).tag(type)
                }
            }
            .pickerStyle(.segmented)

            Picker("分类", selection: binding(\.category, fallback: .food)) {
                ForEach(BillCategory.allCases) { category in
                    Label(category.rawValue, systemImage: category.symbolName).tag(category)
                }
            }

            DatePicker("时间", selection: binding(\.date, fallback: Date()))
            TextField("商户", text: binding(\.merchant, fallback: ""))
                .textFieldStyle(.roundedBorder)
            TextField("账户", text: binding(\.account, fallback: ""))
                .textFieldStyle(.roundedBorder)
            TextField("备注", text: binding(\.note, fallback: ""), axis: .vertical)
                .textFieldStyle(.roundedBorder)
                .lineLimit(2...4)

            Button {
                confirmDraft()
            } label: {
                Label("确认入账", systemImage: "checkmark.circle.fill")
                    .font(.headline)
                    .frame(maxWidth: .infinity)
                    .padding()
            }
            .buttonStyle(.borderedProminent)
            .accentColor(AppColor.purple)
            .disabled((draft?.amount ?? 0) <= 0)
        }
        .padding(18)
        .appCard()
    }

    private var confidenceText: String {
        (draft?.confidence ?? 0).formatted(.percent.precision(.fractionLength(0)))
    }

    private func binding<T>(_ keyPath: WritableKeyPath<BillDraft, T>, fallback defaultValue: T) -> Binding<T> {
        Binding(
            get: { draft?[keyPath: keyPath] ?? defaultValue },
            set: { draft?[keyPath: keyPath] = $0 }
        )
    }

    private func confirmDraft() {
        guard let draft else { return }
        store.addRecognizedDraft(draft)
        self.draft = nil
        didAddBill = true
    }

    private func recognize(_ item: PhotosPickerItem?) async {
        guard let item else { return }
        isScanning = true
        errorMessage = nil

        do {
            guard let data = try await item.loadTransferable(type: Data.self) else {
                throw OCRRecognitionError.invalidImage
            }
            draft = try await OCRService.recognizeBill(from: data)
        } catch {
            errorMessage = error.localizedDescription
        }

        isScanning = false
    }
}
