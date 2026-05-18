import SwiftUI

struct BillListView: View {
    @EnvironmentObject private var store: BillStore
    @State private var query = ""
    @State private var selectedCategory: BillCategory?
    @State private var selectedType: BillType?
    @State private var showingAddBill = false
    @State private var editingBill: Bill?

    var body: some View {
        VStack(spacing: 0) {
            filterBar

            if filteredBills.isEmpty {
                EmptyState(title: "没有匹配账单", message: "换一个筛选条件，或点击右上角新增账单。", symbol: "tray")
                    .padding(20)
                Spacer()
            } else {
                List {
                    ForEach(filteredBills) { bill in
                        BillRow(bill: bill)
                            .listRowSeparator(.hidden)
                            .listRowBackground(Color.clear)
                            .onTapGesture {
                                editingBill = bill
                            }
                            .swipeActions(edge: .trailing, allowsFullSwipe: true) {
                                Button(role: .destructive) {
                                    store.delete(bill)
                                } label: {
                                    Label("删除", systemImage: "trash")
                                }
                            }
                    }
                }
                .listStyle(.plain)
                .scrollContentBackground(.hidden)
            }
        }
        .background(AppColor.background.ignoresSafeArea())
        .navigationTitle("账单")
        .searchable(text: $query, prompt: "搜索商户、备注、账户")
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
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
        .sheet(item: $editingBill) { bill in
            NavigationStack {
                BillEditorView(bill: bill)
            }
        }
    }

    private var filterBar: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 10) {
                Menu {
                    Button("全部类型") { selectedType = nil }
                    ForEach(BillType.allCases) { type in
                        Button(type.rawValue) { selectedType = type }
                    }
                } label: {
                    filterChip(selectedType?.rawValue ?? "全部类型", active: selectedType != nil)
                }

                Menu {
                    Button("全部分类") { selectedCategory = nil }
                    ForEach(BillCategory.allCases) { category in
                        Button(category.rawValue) { selectedCategory = category }
                    }
                } label: {
                    filterChip(selectedCategory?.rawValue ?? "全部分类", active: selectedCategory != nil)
                }

                Button {
                    selectedType = .expense
                } label: {
                    filterChip("只看支出", active: selectedType == .expense)
                }

                Button {
                    selectedType = .income
                } label: {
                    filterChip("只看收入", active: selectedType == .income)
                }
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 12)
        }
        .background(AppColor.background)
    }

    private func filterChip(_ title: String, active: Bool) -> some View {
        Text(title)
            .font(.subheadline.weight(.semibold))
            .foregroundColor(active ? Color.white : AppColor.ink)
            .padding(.horizontal, 14)
            .padding(.vertical, 9)
            .background(active ? AppColor.blue : Color.white, in: Capsule())
            .overlay(Capsule().stroke(active ? AppColor.blue : AppColor.line, lineWidth: 1))
    }

    private var filteredBills: [Bill] {
        store.bills.filter { bill in
            let matchesQuery = query.isEmpty ||
                bill.merchant.localizedCaseInsensitiveContains(query) ||
                bill.note.localizedCaseInsensitiveContains(query) ||
                bill.account.localizedCaseInsensitiveContains(query)
            let matchesType = selectedType == nil || bill.type == selectedType
            let matchesCategory = selectedCategory == nil || bill.category == selectedCategory
            return matchesQuery && matchesType && matchesCategory
        }
    }
}
