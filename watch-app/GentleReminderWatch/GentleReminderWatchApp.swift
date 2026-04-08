/**
 * GentleReminderWatchApp.swift
 *
 * SwiftUI app entry point for the Gentle Reminder Apple Watch companion app.
 * Sets up the WatchDataStore as an environment object shared across all views,
 * activates WatchConnectivity and HealthKit on launch, and registers for
 * background tasks and notification handling.
 */

import SwiftUI
import WatchKit
import HealthKit
import UserNotifications

@main
struct GentleReminderWatchApp: App {

    // MARK: - State

    @StateObject private var dataStore = WatchDataStore()
    @WKApplicationDelegateAdaptor(AppDelegate.self) var appDelegate

    // MARK: - Body

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(dataStore)
                .onAppear {
                    setupServices()
                }
        }

        WKNotificationScene(controller: NotificationController.self, category: "medicationReminder")
        WKNotificationScene(controller: NotificationController.self, category: "fallAlert")
    }

    // MARK: - Setup

    private func setupServices() {
        // Activate Watch Connectivity
        WatchConnectivityManager.shared.activate()
        WatchConnectivityManager.shared.delegate = dataStore
        WatchConnectivityManager.shared.startKeepAlive(interval: 30)

        // Request HealthKit authorization and start observers
        HealthKitCollector.shared.requestAuthorization { success, _ in
            if success {
                HealthKitCollector.shared.startObservingHeartRate()
                HealthKitCollector.shared.enableBackgroundDelivery { _ in }
            }
        }
        HealthKitCollector.shared.delegate = dataStore

        // Start motion analysis
        try? MotionAnalyzer.shared.startAnalysis()
        MotionAnalyzer.shared.delegate = dataStore

        // Request notification permissions
        UNUserNotificationCenter.current().requestAuthorization(
            options: [.alert, .sound, .badge]
        ) { _, _ in }
    }
}

// MARK: - App Delegate

final class AppDelegate: NSObject, WKApplicationDelegate {

    func applicationDidFinishLaunching() {
        print("[GentleReminder Watch] App launched")
    }

    func applicationDidBecomeActive() {
        WatchConnectivityManager.shared.flushQueue()
        WatchConnectivityManager.shared.requestLatestMedications()
    }

    func applicationWillResignActive() {
        // Persist any pending state
    }

    func handle(_ backgroundTasks: Set<WKRefreshBackgroundTask>) {
        for task in backgroundTasks {
            switch task {
            case let connectivityTask as WKWatchConnectivityRefreshBackgroundTask:
                // Handle background WCSession transfers
                WatchConnectivityManager.shared.flushQueue()
                connectivityTask.setTaskCompletedWithSnapshot(false)

            case let snapshotTask as WKSnapshotRefreshBackgroundTask:
                snapshotTask.setTaskCompleted(
                    restoredDefaultState: true,
                    estimatedSnapshotExpiration: Date(timeIntervalSinceNow: 3600),
                    userInfo: nil
                )

            case let refreshTask as WKApplicationRefreshBackgroundTask:
                // Periodic data sync
                WatchConnectivityManager.shared.requestLatestMedications()
                refreshTask.setTaskCompletedWithSnapshot(false)

            default:
                task.setTaskCompletedWithSnapshot(false)
            }
        }
    }
}
