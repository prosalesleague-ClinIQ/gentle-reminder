/**
 * NotificationView.swift
 *
 * Custom notification UI for the Gentle Reminder Watch app.
 * Handles two notification categories:
 *  - medicationReminder: Shows medication name, dosage, and action buttons
 *  - fallAlert: Shows fall detection alert with emergency contact info
 *
 * Uses WKUserNotificationHostingController for SwiftUI-based notification
 * interfaces with large, high-contrast text (minimum 17pt).
 */

import SwiftUI
import WatchKit
import UserNotifications

// MARK: - Notification Controller

final class NotificationController: WKUserNotificationHostingController<NotificationContentView> {

    var medicationName: String = ""
    var medicationDosage: String = ""
    var medicationId: String = ""
    var notificationType: NotificationType = .medication
    var fallSeverity: String = ""

    enum NotificationType {
        case medication
        case fallAlert
    }

    override var body: NotificationContentView {
        NotificationContentView(
            type: notificationType,
            medicationName: medicationName,
            medicationDosage: medicationDosage,
            fallSeverity: fallSeverity
        )
    }

    override func didReceive(_ notification: UNNotification) {
        let content = notification.request.content
        let userInfo = content.userInfo

        let category = content.categoryIdentifier

        if category == "fallAlert" {
            notificationType = .fallAlert
            fallSeverity = userInfo["severity"] as? String ?? "unknown"
        } else {
            notificationType = .medication
            medicationName = userInfo["medication"] as? String ?? content.title
            medicationDosage = userInfo["dosage"] as? String ?? content.subtitle
            medicationId = userInfo["medicationId"] as? String ?? ""
        }

        // Haptic feedback
        switch notificationType {
        case .medication:
            WKInterfaceDevice.current().play(.notification)
        case .fallAlert:
            WKInterfaceDevice.current().play(.notification)
            // Additional strong haptic for fall alerts
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                WKInterfaceDevice.current().play(.notification)
            }
        }
    }
}

// MARK: - Notification Content View

struct NotificationContentView: View {

    let type: NotificationController.NotificationType
    let medicationName: String
    let medicationDosage: String
    let fallSeverity: String

    var body: some View {
        switch type {
        case .medication:
            medicationNotification
        case .fallAlert:
            fallAlertNotification
        }
    }

    // MARK: - Medication Notification

    private var medicationNotification: some View {
        VStack(spacing: 10) {
            // Header icon
            Image(systemName: "pills.circle.fill")
                .font(.system(size: 36))
                .foregroundColor(.cyan)
                .accessibilityHidden(true)

            // Title
            Text("Time for your medication")
                .font(.system(size: 17, weight: .semibold))
                .foregroundColor(.white.opacity(0.8))
                .multilineTextAlignment(.center)

            // Medication name (prominent)
            Text(medicationName)
                .font(.system(size: 22, weight: .bold))
                .foregroundColor(.white)
                .multilineTextAlignment(.center)
                .lineLimit(2)
                .minimumScaleFactor(0.8)

            // Dosage
            if !medicationDosage.isEmpty {
                Text(medicationDosage)
                    .font(.system(size: 18, weight: .medium))
                    .foregroundColor(.cyan)
            }

            // Time
            Text(timeString)
                .font(.system(size: 15))
                .foregroundColor(.white.opacity(0.5))
        }
        .padding()
        .accessibilityElement(children: .combine)
        .accessibilityLabel("Medication reminder: \(medicationName), \(medicationDosage)")
    }

    // MARK: - Fall Alert Notification

    private var fallAlertNotification: some View {
        VStack(spacing: 10) {
            // Alert icon
            Image(systemName: "exclamationmark.triangle.fill")
                .font(.system(size: 40))
                .foregroundColor(.red)
                .accessibilityHidden(true)

            // Title
            Text("Fall Detected")
                .font(.system(size: 22, weight: .bold))
                .foregroundColor(.red)

            // Severity
            Text(severityText)
                .font(.system(size: 17, weight: .medium))
                .foregroundColor(.white.opacity(0.8))
                .multilineTextAlignment(.center)

            // Instructions
            Text("Open the app to dismiss or emergency contacts will be notified.")
                .font(.system(size: 15))
                .foregroundColor(.white.opacity(0.6))
                .multilineTextAlignment(.center)
                .lineLimit(4)
        }
        .padding()
        .accessibilityElement(children: .combine)
        .accessibilityLabel("Fall detected. \(severityText). Open app to dismiss alert.")
    }

    // MARK: - Helpers

    private var timeString: String {
        let formatter = DateFormatter()
        formatter.timeStyle = .short
        return formatter.string(from: Date())
    }

    private var severityText: String {
        switch fallSeverity {
        case "severe":
            return "A severe impact was detected. Are you okay?"
        case "moderate":
            return "A fall was detected. Are you okay?"
        case "confirmed":
            return "Fall confirmed. Notifying your emergency contacts."
        default:
            return "Possible fall detected. Are you okay?"
        }
    }
}

// MARK: - Notification Action Identifiers

/// Constants for notification action identifiers used in UNNotificationAction setup
enum NotificationActionIdentifier {
    static let takeMedication = "TAKE_MEDICATION"
    static let snoozeMedication = "SNOOZE_MEDICATION"
    static let dismissFall = "DISMISS_FALL"
    static let callEmergency = "CALL_EMERGENCY"
}

/// Registers notification categories and actions.
/// Call this during app initialization.
func registerNotificationCategories() {
    let takeAction = UNNotificationAction(
        identifier: NotificationActionIdentifier.takeMedication,
        title: "Take Now",
        options: [.foreground]
    )

    let snoozeAction = UNNotificationAction(
        identifier: NotificationActionIdentifier.snoozeMedication,
        title: "Snooze 15min",
        options: []
    )

    let medicationCategory = UNNotificationCategory(
        identifier: "medicationReminder",
        actions: [takeAction, snoozeAction],
        intentIdentifiers: [],
        options: [.customDismissAction]
    )

    let dismissFallAction = UNNotificationAction(
        identifier: NotificationActionIdentifier.dismissFall,
        title: "I'm Okay",
        options: [.foreground]
    )

    let emergencyAction = UNNotificationAction(
        identifier: NotificationActionIdentifier.callEmergency,
        title: "Call Help",
        options: [.foreground, .destructive]
    )

    let fallCategory = UNNotificationCategory(
        identifier: "fallAlert",
        actions: [dismissFallAction, emergencyAction],
        intentIdentifiers: [],
        options: [.customDismissAction]
    )

    UNUserNotificationCenter.current().setNotificationCategories([
        medicationCategory,
        fallCategory,
    ])
}
