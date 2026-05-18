import SwiftUI

struct MetricCard: View {
    var title: String
    var value: String
    var note: String
    var tint: Color
    var symbol: String

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: symbol)
                    .font(.headline)
                    .foregroundColor(tint)
                Spacer()
            }

            Text(title)
                .font(.caption)
                .foregroundColor(AppColor.muted)

            Text(value)
                .font(.system(.title2, design: .rounded, weight: .bold))
                .foregroundColor(AppColor.ink)
                .lineLimit(1)
                .minimumScaleFactor(0.75)

            Text(note)
                .font(.caption2)
                .foregroundColor(AppColor.muted)
                .lineLimit(2)
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(tint.opacity(0.1))
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .stroke(tint.opacity(0.3), lineWidth: 1)
        )
    }
}

struct WarningBanner: View {
    var advice: Advice

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: iconName)
                .font(.title3.weight(.semibold))
                .foregroundColor(tint)
                .frame(width: 28, height: 28)
                .background(tint.opacity(0.12), in: Circle())

            VStack(alignment: .leading, spacing: 4) {
                Text(advice.title)
                    .font(.headline)
                    .foregroundColor(AppColor.ink)
                Text(advice.message)
                    .font(.subheadline)
                    .foregroundColor(AppColor.muted)
            }

            Spacer(minLength: 0)
        }
        .padding(16)
        .background(tint.opacity(0.1))
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .stroke(tint.opacity(0.3), lineWidth: 1)
        )
    }

    private var tint: Color { AppColor.tint(for: advice.severity) }

    private var iconName: String {
        switch advice.severity {
        case .info: "sparkles"
        case .warning: "exclamationmark.triangle.fill"
        case .danger: "exclamationmark.octagon.fill"
        case .success: "checkmark.seal.fill"
        }
    }
}

struct BillRow: View {
    var bill: Bill

    var body: some View {
        HStack(spacing: 12) {
            CategoryIcon(category: bill.category)

            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 6) {
                    Text(bill.merchant)
                        .font(.subheadline.weight(.semibold))
                        .foregroundColor(AppColor.ink)
                        .lineLimit(1)

                    if bill.source != .manual {
                        Text(bill.source.rawValue)
                            .font(.caption2.weight(.semibold))
                            .foregroundColor(AppColor.blue)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(AppColor.blue.opacity(0.1), in: Capsule())
                    }
                }

                Text("\(bill.category.rawValue) · \(bill.account) · \(bill.date.ledgerShortText)")
                    .font(.caption)
                    .foregroundColor(AppColor.muted)
                    .lineLimit(1)
            }

            Spacer()

            Text(amountText)
                .font(.subheadline.weight(.bold))
                .foregroundColor(bill.type == .income ? AppColor.green : AppColor.red)
                .monospacedDigit()
        }
        .padding(14)
        .background(Color.white)
        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .stroke(AppColor.line.opacity(0.7), lineWidth: 1)
        )
    }

    private var amountText: String {
        let prefix = bill.type == .income ? "+" : "-"
        return "\(prefix)\(currency(bill.amount))"
    }
}

struct CategoryIcon: View {
    var category: BillCategory

    var body: some View {
        Image(systemName: category.symbolName)
            .font(.subheadline.weight(.bold))
            .foregroundColor(AppColor.tint(for: category))
            .frame(width: 36, height: 36)
            .background(AppColor.tint(for: category).opacity(0.12), in: Circle())
    }
}

struct ProgressBar: View {
    var progress: Double
    var tint: Color

    var body: some View {
        GeometryReader { proxy in
            let clamped = CGFloat(min(max(progress, 0), 1.25))
            ZStack(alignment: .leading) {
                Capsule()
                    .fill(AppColor.subtle)
                Capsule()
                    .fill(tint)
                    .frame(width: max(8, proxy.size.width * clamped))
            }
        }
        .frame(height: 10)
        .clipShape(Capsule())
    }
}

struct SectionHeader: View {
    var title: String
    var actionTitle: String?
    var action: (() -> Void)?

    var body: some View {
        HStack {
            Text(title)
                .font(.headline)
                .foregroundColor(AppColor.ink)
            Spacer()
            if let actionTitle, let action {
                Button(actionTitle, action: action)
                    .font(.subheadline.weight(.semibold))
            }
        }
    }
}

struct EmptyState: View {
    var title: String
    var message: String
    var symbol: String

    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: symbol)
                .font(.largeTitle)
                .foregroundColor(AppColor.blue)
            Text(title)
                .font(.headline)
                .foregroundColor(AppColor.ink)
            Text(message)
                .font(.subheadline)
                .foregroundColor(AppColor.muted)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(28)
        .appCard()
    }
}

struct SimpleBarChart: View {
    var values: [(label: String, total: Double)]
    var tint: Color = AppColor.blue

    var body: some View {
        let maxValue = max(values.map { $0.total }.max() ?? 1, 1)

        HStack(alignment: .bottom, spacing: 10) {
            ForEach(values.indices, id: \.self) { index in
                let item = values[index]
                VStack(spacing: 8) {
                    RoundedRectangle(cornerRadius: 6)
                        .fill(item.total == 0 ? AppColor.subtle : tint)
                        .frame(height: CGFloat(max(10.0, item.total / maxValue * 120)))
                    Text(item.label)
                        .font(.caption2)
                        .foregroundColor(AppColor.muted)
                }
                .frame(maxWidth: .infinity)
            }
        }
        .frame(height: 160)
        .padding(16)
        .appCard()
    }
}
