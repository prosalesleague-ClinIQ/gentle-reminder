/**
 * MedicationReminderView.swift
 *
 * Full-screen medication reminder view pushed by a notification.
 * Displays the medication name in large text, dosage, and provides
 * "Take Now" and "Snooze 15min" action buttons with haptic feedback.
 *
 * Design: High-contrast, large text (minimum 17pt) optimized for
 * elderly users who may need to act quickly on medication reminders.
 */

import SwiftUI
import WatchKit

struct MedicationReminderView: View {

    @EnvironmentObject var dataStore: WatchDataStore
    @Environment(\.dismiss) private var dismiss

    let medication: WatchMedication

    // Animation state for the pill icon
    @State private var isPulsing = false

    var body: some View {
        ScrollView {
            VStack(spacing: 14) {

                // MARK: - Icon
                Image(systemName: "pills.circle.fill")
                    .font(.system(size: 48))
                    .foregroundColor(.cyan)
                    .scaleEffect(isPulsing ? 1.1 : 1.0)
                    .animation(
                        .easeInOut(duration: 1.0).repeatForever(autoreverses: true),
                        value: isPulsing
                    )
                    .onAppear { isPulsing = true }
                    .accessibilityHidden(true)

                // MARK: - Medication Name
                Text(medication.name)
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)
                    .lineLimit(3)
                    .minimumScaleFactor(0.8)

                // MARK: - Dosage
                Text(medication.dosage)
                    .font(.system(size: 20, weight: .medium))
                    .foregroundColor(.cyan)

                // MARK: - Scheduled Time
                Text("Scheduled: \(medication.formattedTime)")
                    .font(.system(size: 17))
                    .foregroundColor(.white.opacity(0.6))

                Spacer()
                    .frame(height: 8)

                // MARK: - Take Now Button
                Button {
                    dataStore.markMedicationTaken(medication.id)
                    WKInterfaceDevice.current().play(.success)
                    dismiss()
                } label: {
                    HStack(spacing: 8) {
                        Image(systemName: "checkmark.circle.fill")
                            .font(.system(size: 20))
                        Text("Take Now")
                            .font(.system(size: 18, weight: .bold))
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 4)
                }
                .buttonStyle(.borderedProminent)
                .tint(.green)

                // MARK: - Snooze Button
                Button {
                    dataStore.snoozeMedication(medication.id, minutes: 15)
                    WKInterfaceDevice.current().play(.click)
                    dismiss()
                } label: {
                    HStack(spacing: 8) {
                        Image(systemName: "clock.arrow.circlepath")
                            .font(.system(size: 18))
                        Text("Snooze 15min")
                            .font(.system(size: 17, weight: .medium))
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 4)
                }
                .buttonStyle(.bordered)
                .tint(.orange)
            }
            .padding()
        }
        .onAppear {
            // Strong haptic on appearance
            WKInterfaceDevice.current().play(.notification)
        }
        .accessibilityElement(children: .contain)
        .accessibilityLabel("Medication reminder for \(medication.name), \(medication.dosage)")
    }
}

#if DEBUG
struct MedicationReminderView_Previews: PreviewProvider {
    static var previews: some View {
        MedicationReminderView(
            medication: WatchMedication(
                id: "preview_1",
                name: "Donepezil",
                dosage: "10mg",
                scheduledTime: Date(),
                isTaken: false
            )
        )
        .environmentObject(WatchDataStore())
    }
}
#endif
