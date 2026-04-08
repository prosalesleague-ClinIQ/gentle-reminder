/**
 * TodayView.swift
 *
 * Main dashboard view for the Gentle Reminder Watch app.
 * Shows a time-based greeting, current heart rate from HealthKit,
 * pending medication count, and a cognitive exercise prompt button.
 *
 * Design: Large, high-contrast text (minimum 17pt) with ScrollView
 * for content overflow on smaller watch screens.
 */

import SwiftUI
import HealthKit

struct TodayView: View {

    @EnvironmentObject var dataStore: WatchDataStore

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {

                // MARK: - Greeting
                Text(dataStore.greeting)
                    .font(.system(size: 22, weight: .bold))
                    .foregroundColor(.white)
                    .accessibilityAddTraits(.isHeader)

                Divider()
                    .background(Color.white.opacity(0.3))

                // MARK: - Heart Rate
                HStack(spacing: 8) {
                    Image(systemName: "heart.fill")
                        .font(.system(size: 20))
                        .foregroundColor(.red)
                        .accessibilityHidden(true)

                    if dataStore.heartRate > 0 {
                        Text("\(Int(dataStore.heartRate))")
                            .font(.system(size: 28, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                            .monospacedDigit()
                        +
                        Text(" bpm")
                            .font(.system(size: 17, weight: .regular))
                            .foregroundColor(.white.opacity(0.7))
                    } else {
                        Text("Measuring...")
                            .font(.system(size: 17))
                            .foregroundColor(.white.opacity(0.6))
                    }
                }
                .accessibilityElement(children: .combine)
                .accessibilityLabel(
                    dataStore.heartRate > 0
                        ? "Heart rate: \(Int(dataStore.heartRate)) beats per minute"
                        : "Heart rate: measuring"
                )

                // MARK: - Medications Pending
                HStack(spacing: 8) {
                    Image(systemName: "pills.fill")
                        .font(.system(size: 20))
                        .foregroundColor(.cyan)
                        .accessibilityHidden(true)

                    if dataStore.allMedicationsTaken {
                        Text("All taken!")
                            .font(.system(size: 17, weight: .semibold))
                            .foregroundColor(.green)
                    } else if dataStore.pendingMedicationCount > 0 {
                        Text("\(dataStore.pendingMedicationCount) pending")
                            .font(.system(size: 17, weight: .semibold))
                            .foregroundColor(.orange)
                    } else {
                        Text("No medications")
                            .font(.system(size: 17))
                            .foregroundColor(.white.opacity(0.6))
                    }
                }
                .accessibilityElement(children: .combine)
                .accessibilityLabel(medicationAccessibilityLabel)

                // Next medication time
                if let next = dataStore.nextMedication, !next.isTaken {
                    HStack(spacing: 6) {
                        Image(systemName: "clock.fill")
                            .font(.system(size: 14))
                            .foregroundColor(.white.opacity(0.5))
                            .accessibilityHidden(true)

                        Text("Next: \(next.name) at \(next.formattedTime)")
                            .font(.system(size: 15))
                            .foregroundColor(.white.opacity(0.7))
                            .lineLimit(2)
                    }
                    .padding(.leading, 4)
                }

                Divider()
                    .background(Color.white.opacity(0.3))

                // MARK: - Steps
                HStack(spacing: 8) {
                    Image(systemName: "figure.walk")
                        .font(.system(size: 20))
                        .foregroundColor(.green)
                        .accessibilityHidden(true)

                    Text("\(dataStore.stepCount)")
                        .font(.system(size: 20, weight: .semibold, design: .rounded))
                        .foregroundColor(.white)
                        .monospacedDigit()
                    +
                    Text(" steps")
                        .font(.system(size: 17))
                        .foregroundColor(.white.opacity(0.7))
                }
                .accessibilityElement(children: .combine)
                .accessibilityLabel("\(dataStore.stepCount) steps today")

                Divider()
                    .background(Color.white.opacity(0.3))

                // MARK: - Cognitive Exercise
                NavigationLink {
                    CognitiveExercisePromptView()
                        .environmentObject(dataStore)
                } label: {
                    HStack(spacing: 8) {
                        Image(systemName: "brain.head.profile")
                            .font(.system(size: 20))
                            .foregroundColor(.purple)

                        VStack(alignment: .leading, spacing: 2) {
                            Text("Brain Exercise")
                                .font(.system(size: 17, weight: .semibold))
                                .foregroundColor(.white)

                            if dataStore.cognitiveScore > 0 {
                                Text("Score: \(dataStore.cognitiveScore)/100")
                                    .font(.system(size: 15))
                                    .foregroundColor(.white.opacity(0.6))
                            }
                        }

                        Spacer()

                        Image(systemName: "chevron.right")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(.white.opacity(0.4))
                    }
                }
                .buttonStyle(.plain)
                .accessibilityLabel(
                    dataStore.cognitiveScore > 0
                        ? "Brain exercise. Current score: \(dataStore.cognitiveScore) out of 100"
                        : "Start a brain exercise"
                )

                // MARK: - Connection Status
                if !dataStore.isPhoneReachable {
                    HStack(spacing: 6) {
                        Image(systemName: "iphone.slash")
                            .font(.system(size: 14))
                            .foregroundColor(.yellow)
                        Text("Phone not connected")
                            .font(.system(size: 14))
                            .foregroundColor(.yellow.opacity(0.8))
                    }
                    .padding(.top, 4)
                }
            }
            .padding(.horizontal, 4)
        }
        .navigationTitle("Today")
    }

    // MARK: - Helpers

    private var medicationAccessibilityLabel: String {
        if dataStore.allMedicationsTaken {
            return "All medications taken"
        } else if dataStore.pendingMedicationCount > 0 {
            return "\(dataStore.pendingMedicationCount) medications pending"
        } else {
            return "No medications scheduled"
        }
    }
}

// MARK: - Cognitive Exercise Prompt

/// Simple prompt view that encourages the user to do a cognitive exercise
/// on their paired iPhone. On the watch, we show a motivational prompt.
struct CognitiveExercisePromptView: View {

    @EnvironmentObject var dataStore: WatchDataStore
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                Image(systemName: "brain.head.profile")
                    .font(.system(size: 40))
                    .foregroundColor(.purple)

                Text("Time for a\nbrain exercise!")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)

                Text("Open the app on your iPhone to start a cognitive exercise.")
                    .font(.system(size: 17))
                    .foregroundColor(.white.opacity(0.7))
                    .multilineTextAlignment(.center)

                if dataStore.cognitiveScore > 0 {
                    VStack(spacing: 4) {
                        Text("Current Score")
                            .font(.system(size: 15))
                            .foregroundColor(.white.opacity(0.5))

                        Text("\(dataStore.cognitiveScore)")
                            .font(.system(size: 36, weight: .bold, design: .rounded))
                            .foregroundColor(.purple)
                    }
                }

                Button {
                    // Send cognitive prompt request to phone
                    WatchConnectivityManager.shared.sendMessage(
                        type: .cognitivePrompt,
                        payload: ["action": "startExercise"]
                    )
                    WKInterfaceDevice.current().play(.click)
                    dismiss()
                } label: {
                    Text("Notify Phone")
                        .font(.system(size: 17, weight: .semibold))
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .tint(.purple)
            }
            .padding()
        }
    }
}

#if DEBUG
struct TodayView_Previews: PreviewProvider {
    static var previews: some View {
        let store = WatchDataStore()
        store.heartRate = 72
        store.pendingMedicationCount = 2
        store.stepCount = 3421
        store.cognitiveScore = 85
        return TodayView()
            .environmentObject(store)
    }
}
#endif
