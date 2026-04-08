/**
 * MedicationListView.swift
 *
 * Scrollable list of today's medications for the Gentle Reminder Watch app.
 * Each medication shows name, scheduled time, and dosage with a "Taken"
 * checkmark button. Shows "All taken!" when every medication is marked complete.
 *
 * Design: Large, high-contrast text (minimum 17pt). Digital Crown scrolling
 * is enabled via the default List/ScrollView behavior.
 */

import SwiftUI
import WatchKit

struct MedicationListView: View {

    @EnvironmentObject var dataStore: WatchDataStore

    var body: some View {
        Group {
            if dataStore.medications.isEmpty {
                emptyState
            } else if dataStore.allMedicationsTaken {
                allTakenState
            } else {
                medicationList
            }
        }
        .navigationTitle("Medications")
    }

    // MARK: - Empty State

    private var emptyState: some View {
        VStack(spacing: 12) {
            Image(systemName: "pills")
                .font(.system(size: 36))
                .foregroundColor(.gray)

            Text("No medications")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(.white)

            Text("Your medications will appear here when synced from your phone.")
                .font(.system(size: 15))
                .foregroundColor(.white.opacity(0.6))
                .multilineTextAlignment(.center)

            if !dataStore.isPhoneReachable {
                Button {
                    WatchConnectivityManager.shared.requestLatestMedications()
                    WKInterfaceDevice.current().play(.click)
                } label: {
                    Label("Sync Now", systemImage: "arrow.triangle.2.circlepath")
                        .font(.system(size: 15))
                }
                .buttonStyle(.bordered)
                .padding(.top, 4)
            }
        }
        .padding()
    }

    // MARK: - All Taken

    private var allTakenState: some View {
        ScrollView {
            VStack(spacing: 12) {
                Image(systemName: "checkmark.circle.fill")
                    .font(.system(size: 44))
                    .foregroundColor(.green)

                Text("All taken!")
                    .font(.system(size: 22, weight: .bold))
                    .foregroundColor(.green)

                Text("Great job! All \(dataStore.medications.count) medications taken today.")
                    .font(.system(size: 17))
                    .foregroundColor(.white.opacity(0.7))
                    .multilineTextAlignment(.center)

                Divider()
                    .padding(.vertical, 8)

                // Show completed medications
                ForEach(dataStore.medications) { medication in
                    HStack(spacing: 8) {
                        Image(systemName: "checkmark.circle.fill")
                            .font(.system(size: 17))
                            .foregroundColor(.green.opacity(0.6))

                        VStack(alignment: .leading, spacing: 2) {
                            Text(medication.name)
                                .font(.system(size: 17))
                                .foregroundColor(.white.opacity(0.5))
                                .strikethrough()

                            Text(medication.formattedTime)
                                .font(.system(size: 15))
                                .foregroundColor(.white.opacity(0.3))
                        }

                        Spacer()
                    }
                }
            }
            .padding(.horizontal, 4)
        }
    }

    // MARK: - Medication List

    private var medicationList: some View {
        List {
            ForEach(dataStore.medications) { medication in
                MedicationRow(medication: medication) {
                    dataStore.markMedicationTaken(medication.id)
                }
            }
        }
        .listStyle(.carousel)
    }
}

// MARK: - Medication Row

struct MedicationRow: View {

    let medication: WatchMedication
    let onTaken: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            // Medication name
            HStack {
                Text(medication.name)
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(medication.isTaken ? .white.opacity(0.4) : .white)
                    .strikethrough(medication.isTaken)
                    .lineLimit(2)

                Spacer()

                if medication.isTaken {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 22))
                        .foregroundColor(.green)
                }
            }

            // Time and dosage
            HStack(spacing: 12) {
                Label {
                    Text(medication.formattedTime)
                        .font(.system(size: 15))
                } icon: {
                    Image(systemName: "clock")
                        .font(.system(size: 13))
                }
                .foregroundColor(medication.isTaken ? .white.opacity(0.3) : .cyan)

                Text(medication.dosage)
                    .font(.system(size: 15))
                    .foregroundColor(medication.isTaken ? .white.opacity(0.3) : .white.opacity(0.7))
            }

            // Take button
            if !medication.isTaken {
                Button {
                    onTaken()
                } label: {
                    HStack {
                        Image(systemName: "checkmark")
                            .font(.system(size: 15, weight: .bold))
                        Text("Taken")
                            .font(.system(size: 17, weight: .semibold))
                    }
                    .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .tint(.green)
                .padding(.top, 4)
            }
        }
        .padding(.vertical, 4)
        .accessibilityElement(children: .combine)
        .accessibilityLabel(accessibilityDescription)
        .accessibilityAction(named: "Mark as taken") {
            if !medication.isTaken {
                onTaken()
            }
        }
    }

    private var accessibilityDescription: String {
        let status = medication.isTaken ? "Taken" : "Pending"
        return "\(medication.name), \(medication.dosage), scheduled at \(medication.formattedTime). \(status)"
    }
}

#if DEBUG
struct MedicationListView_Previews: PreviewProvider {
    static var previews: some View {
        let store = WatchDataStore()
        store.medications = [
            WatchMedication(id: "1", name: "Donepezil", dosage: "10mg", scheduledTime: Date(), isTaken: false),
            WatchMedication(id: "2", name: "Memantine", dosage: "5mg", scheduledTime: Date().addingTimeInterval(3600), isTaken: false),
            WatchMedication(id: "3", name: "Vitamin D", dosage: "1000 IU", scheduledTime: Date().addingTimeInterval(7200), isTaken: true),
        ]
        return MedicationListView()
            .environmentObject(store)
    }
}
#endif
