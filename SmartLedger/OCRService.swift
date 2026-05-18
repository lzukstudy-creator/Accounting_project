import Foundation
import UIKit
import Vision

enum OCRRecognitionError: LocalizedError {
    case invalidImage
    case noTextFound

    var errorDescription: String? {
        switch self {
        case .invalidImage:
            "无法读取图片，请换一张账单截图或票据照片。"
        case .noTextFound:
            "没有识别到账单文字，可以使用示例账单或手动新增。"
        }
    }
}

enum OCRService {
    static func recognizeBill(from imageData: Data) async throws -> BillDraft {
        try await Task.detached(priority: .userInitiated) {
            guard let image = UIImage(data: imageData), let cgImage = image.cgImage else {
                throw OCRRecognitionError.invalidImage
            }

            let request = VNRecognizeTextRequest()
            request.recognitionLevel = .accurate
            request.recognitionLanguages = ["zh-Hans", "en-US"]
            request.usesLanguageCorrection = true

            let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
            try handler.perform([request])

            let lines = request.results?
                .compactMap { $0.topCandidates(1).first?.string }
                .filter { !$0.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty } ?? []

            guard !lines.isEmpty else { throw OCRRecognitionError.noTextFound }
            return parseRecognizedText(lines.joined(separator: "\n"))
        }.value
    }

    static func sampleDraft() -> BillDraft {
        BillDraft(
            type: .expense,
            amount: 128,
            category: .food,
            date: Date(),
            merchant: "面包店",
            account: "支付宝",
            paymentMethod: "移动支付",
            note: "AI 示例识别：面包、咖啡、甜点",
            confidence: 0.92
        )
    }

    static func parseRecognizedText(_ text: String) -> BillDraft {
        let normalized = text.replacingOccurrences(of: "￥", with: "¥")
        let amount = extractAmount(from: normalized)
        let category = inferCategory(from: normalized)
        let merchant = inferMerchant(from: normalized, fallback: category.rawValue)
        let date = extractDate(from: normalized) ?? Date()

        return BillDraft(
            type: .expense,
            amount: amount,
            category: category,
            date: date,
            merchant: merchant,
            account: inferAccount(from: normalized),
            paymentMethod: "移动支付",
            note: "OCR 识别文本：\(normalized.prefix(80))",
            confidence: amount > 0 ? 0.82 : 0.54
        )
    }

    private static func extractAmount(from text: String) -> Double {
        let preferredPatterns = [
            "(?:¥|RMB|CNY)\\s*([0-9]+(?:\\.[0-9]{1,2})?)",
            "(?:合计|总计|支付|金额|实付)[:： ]*([0-9]+(?:\\.[0-9]{1,2})?)"
        ]

        for pattern in preferredPatterns {
            if let value = firstNumber(matching: pattern, in: text) {
                return value
            }
        }

        let pattern = "([0-9]+(?:\\.[0-9]{1,2})?)"
        let values = allNumbers(matching: pattern, in: text)
            .filter { $0 > 0 && $0 < 100_000 }

        return values.max() ?? 0
    }

    private static func firstNumber(matching pattern: String, in text: String) -> Double? {
        guard let regex = try? NSRegularExpression(pattern: pattern, options: [.caseInsensitive]) else { return nil }
        let range = NSRange(text.startIndex..<text.endIndex, in: text)
        guard let match = regex.firstMatch(in: text, range: range), match.numberOfRanges > 1 else { return nil }
        guard let swiftRange = Range(match.range(at: 1), in: text) else { return nil }
        return Double(text[swiftRange])
    }

    private static func allNumbers(matching pattern: String, in text: String) -> [Double] {
        guard let regex = try? NSRegularExpression(pattern: pattern) else { return [] }
        let range = NSRange(text.startIndex..<text.endIndex, in: text)
        return regex.matches(in: text, range: range).compactMap { match in
            guard let swiftRange = Range(match.range(at: 1), in: text) else { return nil }
            return Double(text[swiftRange])
        }
    }

    private static func inferCategory(from text: String) -> BillCategory {
        let pairs: [(BillCategory, [String])] = [
            (.food, ["餐", "饭", "咖啡", "奶茶", "外卖", "面包", "餐厅", "火锅", "超市"]),
            (.transport, ["地铁", "公交", "打车", "滴滴", "车票", "高铁", "停车"]),
            (.shopping, ["淘宝", "京东", "购物", "商场", "服饰", "电商"]),
            (.housing, ["房租", "物业", "租金"]),
            (.entertainment, ["电影", "会员", "游戏", "音乐", "娱乐"]),
            (.health, ["医院", "药", "门诊"]),
            (.education, ["课程", "书", "培训", "教育"]),
            (.utilities, ["水费", "电费", "燃气", "话费", "宽带"])
        ]

        return pairs.first { _, keywords in
            keywords.contains { text.localizedCaseInsensitiveContains($0) }
        }?.0 ?? .other
    }

    private static func inferMerchant(from text: String, fallback: String) -> String {
        let ignored = ["金额", "合计", "支付", "时间", "订单", "交易", "收款", "付款", "¥", "￥"]
        let lines = text.split(whereSeparator: \.isNewline).map(String.init)
        if let line = lines.first(where: { candidate in
            let trimmed = candidate.trimmingCharacters(in: .whitespacesAndNewlines)
            guard trimmed.count >= 2 && trimmed.count <= 20 else { return false }
            return !ignored.contains { trimmed.localizedCaseInsensitiveContains($0) }
        }) {
            return line.trimmingCharacters(in: .whitespacesAndNewlines)
        }
        return fallback
    }

    private static func inferAccount(from text: String) -> String {
        if text.localizedCaseInsensitiveContains("微信") { return "微信" }
        if text.localizedCaseInsensitiveContains("支付宝") { return "支付宝" }
        if text.localizedCaseInsensitiveContains("银行卡") || text.localizedCaseInsensitiveContains("银行") { return "银行卡" }
        return "移动支付"
    }

    private static func extractDate(from text: String) -> Date? {
        let pattern = "([0-9]{4}[-/][0-9]{1,2}[-/][0-9]{1,2})(?:\\s+([0-9]{1,2}:[0-9]{2}))?"
        guard let regex = try? NSRegularExpression(pattern: pattern) else { return nil }
        let range = NSRange(text.startIndex..<text.endIndex, in: text)
        guard let match = regex.firstMatch(in: text, range: range), let dateRange = Range(match.range(at: 1), in: text) else {
            return nil
        }

        let datePart = String(text[dateRange]).replacingOccurrences(of: "/", with: "-")
        let timePart: String
        if match.numberOfRanges > 2, let range = Range(match.range(at: 2), in: text) {
            timePart = String(text[range])
        } else {
            timePart = "12:00"
        }

        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "zh_CN")
        formatter.dateFormat = "yyyy-MM-dd HH:mm"
        return formatter.date(from: "\(datePart) \(timePart)")
    }
}
