/**
 * ContentView.swift
 *
 * Root view for the Gentle Reminder Apple Watch app.
 * Uses a TabView with 3 tabs: Today, Medications, and Breathing.
 * Each tab is designed with large, high-contrast text (17pt minimum)
 * appropriate for elderly users with potential visual impairments.
 */

import SwiftUI

struct ContentView: View {

    @EnvironmentObject var dataStore: WatchDataStore
    @State private var selectedTab: Int = 0

    var body: some View {
        ZStack {
            TabView(selection: $selectedTab) {
                TodayView()
                    .tag(0)

                MedicationListView()
                    .tag(1)

                BreathingView()
                    .tag(2)
            }
            .tabViewStyle(.carousel)

            // Fall alert overlay takes priority over everything
            if dataStore.isFallAlertActive {
                FallAlertOverlay()
                    .transition(.opacity)
                    .zIndex(100)
            }
        }
        .animation(.easeInOut, value: dataStore.isFallAlertActive)
    }
}

// MARK: - Fall Alert Overlay

/// Full-screen overlay shown when a fall is detected.
/// Displays a 60-second countdown with "I'm Okay" dismissal button.
struct FallAlertOverlay: View {

    @EnvironmentObject var dataStore: WatchDataStore

    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: "exclamationmark.triangle.fill")
                .font(.system(size: 36))
                .foregroundColor(.red)

            Text("Fall Detected")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(.white)

            if let seconds = dataStore.fallCountdownSeconds {
                Text("Alerting help in")
                    .font(.system(size: 17))
                    .foregroundColor(.white.opacity(0.8))

                Text("\(seconds)s")
                    .font(.system(size: 40, weight: .heavy, design: .rounded))
                    .foregroundColor(.red)
                    .monospacedDigit()
            }

            Button {
                dataStore.dismissFallAlert()
            } label: {
                Text("I'm Okay")
                    .font(.system(size: 18, weight: .semibold))
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .tint(.green)
        }
        .padding()
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.black)
    }
}

#if DEBUG
struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
            .environmentObject(WatchDataStore())
    }
}
#endif
