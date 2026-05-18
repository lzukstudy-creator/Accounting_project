import SwiftUI

struct ContentView: View {
    var body: some View {
        TabView {
            NavigationView {
                DashboardView()
            }
            .navigationViewStyle(StackNavigationViewStyle())
            .tabItem {
                Label("首页", systemImage: "house.fill")
            }

            NavigationView {
                BillListView()
            }
            .navigationViewStyle(StackNavigationViewStyle())
            .tabItem {
                Label("账单", systemImage: "list.bullet.rectangle.fill")
            }

            NavigationView {
                AIScannerView()
            }
            .navigationViewStyle(StackNavigationViewStyle())
            .tabItem {
                Label("扫描", systemImage: "viewfinder")
            }

            NavigationView {
                StatisticsView()
            }
            .navigationViewStyle(StackNavigationViewStyle())
            .tabItem {
                Label("统计", systemImage: "chart.bar.fill")
            }

            NavigationView {
                BudgetView()
            }
            .navigationViewStyle(StackNavigationViewStyle())
            .tabItem {
                Label("预算", systemImage: "target")
            }
        }
        .accentColor(AppColor.blue)
    }
}
