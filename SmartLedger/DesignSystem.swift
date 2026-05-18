import SwiftUI

enum AppColor {
    static let background = Color(red: 0.953, green: 0.965, blue: 0.976)
    static let card = Color.white
    static let ink = Color(red: 0.063, green: 0.094, blue: 0.145)
    static let muted = Color(red: 0.388, green: 0.447, blue: 0.525)
    static let line = Color(red: 0.792, green: 0.827, blue: 0.878)
    static let subtle = Color(red: 0.902, green: 0.925, blue: 0.953)
    static let blue = Color(red: 0.129, green: 0.310, blue: 0.827)
    static let cyan = Color(red: 0.016, green: 0.588, blue: 0.698)
    static let green = Color(red: 0.078, green: 0.612, blue: 0.353)
    static let orange = Color(red: 0.918, green: 0.345, blue: 0.047)
    static let red = Color(red: 0.863, green: 0.149, blue: 0.149)
    static let purple = Color(red: 0.486, green: 0.227, blue: 0.929)

    static func tint(for category: BillCategory) -> Color {
        switch category {
        case .food:
            return orange
        case .transport:
            return cyan
        case .shopping:
            return purple
        case .housing:
            return blue
        case .entertainment:
            return red
        case .health:
            return green
        case .education:
            return blue
        case .utilities:
            return orange
        case .salary:
            return green
        case .savings:
            return green
        case .other:
            return muted
        }
    }

    static func tint(for severity: Advice.Severity) -> Color {
        switch severity {
        case .info:
            return blue
        case .warning:
            return orange
        case .danger:
            return red
        case .success:
            return green
        }
    }
}

struct CardStyle: ViewModifier {
    func body(content: Content) -> some View {
        content
            .background(AppColor.card)
            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .stroke(AppColor.line.opacity(0.65), lineWidth: 1)
            )
            .shadow(color: .black.opacity(0.06), radius: 18, x: 0, y: 10)
    }
}

extension View {
    func appCard() -> some View {
        modifier(CardStyle())
    }
}

extension Date {
    var ledgerShortText: String {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "zh_CN")
        formatter.dateFormat = "MM-dd HH:mm"
        return formatter.string(from: self)
    }
}
