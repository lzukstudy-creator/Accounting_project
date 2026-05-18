import SwiftUI

@main
struct SmartLedgerApp: App {
    @StateObject private var store = BillStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(store)
        }
    }
}
