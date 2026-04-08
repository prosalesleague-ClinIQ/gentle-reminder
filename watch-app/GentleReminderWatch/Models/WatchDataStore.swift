/**
 * WatchDataStore.swift
 *
 * Central ObservableObject that holds all watch-side state for the
 * Gentle Reminder companion app. Receives updates from WCSession
 * (via WatchConnectivityManager), HealthKit, and MotionAnalyzer.
 *
 * Published properties drive SwiftUI view updates for:
 *  - Medications list and completion status
 *  - Heart rate and health metrics
 *  - Cognitive score
 *  - Time-based greeting
 *  - Fall detection state
 *  - Connection status
 */

import Foundation
import Combine
import WatchKit

// MARK: - Medication Model

struct WatchMedication: Identifiable, Codable {
    let id: String
    let name: String
    let dosage: String
    let scheduledTime: Date
    var isTaken: Bool

    var formattedTime: String {
        let formatter = DateFormatter()
        formatter.timeStyle = .short
        return formatter.string(from: scheduledTime)
    }
}

// MARK: - WatchDataStore

final class WatchDataStore: ObservableObject {

    // MARK: - Published Properties

    /// Current list of medications for today
    @Published var medications: [WatchMedication] = []

    /// Most recent heart rate in BPM
    @Published var heartRate: Double = 0

    /// Latest cognitive score (0-100)
    @Published var cognitiveScore: Int = 0

    /// Time-based greeting string
    @Published var greeting: String = "Good morning"

    /// Whether all medications have been taken
    @Published var allMedicationsTaken: Bool = false

    /// Number of pending (untaken) medications
    @Published var pendingMedicationCount: Int = 0

    /// Next upcoming medication
    @Published var nextMedication: WatchMedication? = nil

    /// Connection status to iPhone
    @Published var isPhoneReachable: Bool = false

    /// Fall detection countdown (nil when no fall detected)
    @Published var fallCountdownSeconds: Int? = nil

    /// Whether a fall alert is actively showing
    @Published var isFallAlertActive: Bool = false

    /// Current step count for today
    @Published var stepCount: Int = 0

    /// Blood oxygen percentage
    @Published var oxygenSaturation: Double = 0

    // MARK: - Private

    private var greetingTimer: Timer?
    private var fallCountdownTimer: Timer?

    // MARK: - Initialization

    init() {
        updateGreeting()
        startGreetingTimer()
        loadPersistedMedications()
    }

    deinit {
        greetingTimer?.invalidate()
        fallCountdownTimer?.invalidate()
    }

    // MARK: - Greeting

    private func updateGreeting() {
        let hour = Calendar.current.component(.hour, from: Date())
        switch hour {
        case 5..<12:
            greeting = "Good morning"
        case 12..<17:
            greeting = "Good afternoon"
        case 17..<22:
            greeting = "Good evening"
        default:
            greeting = "Good night"
        }
    }

    private func startGreetingTimer() {
        greetingTimer = Timer.scheduledTimer(withTimeInterval: 300, repeats: true) { [weak self] _ in
            DispatchQueue.main.async {
                self?.updateGreeting()
            }
        }
    }

    // MARK: - Medication Management

    func markMedicationTaken(_ medicationId: String) {
        guard let index = medications.firstIndex(where: { $0.id == medicationId }) else { return }
        medications[index].isTaken = true
        updateMedicationStatus()
        persistMedications()

        // Send confirmation to phone
        WatchConnectivityManager.shared.sendMedicationConfirmation(
            medicationId: medicationId,
            timestamp: Date()
        )

        // Haptic feedback
        WKInterfaceDevice.current().play(.success)
    }

    func snoozeMedication(_ medicationId: String, minutes: Int = 15) {
        guard let index = medications.firstIndex(where: { $0.id == medicationId }) else { return }
        let newTime = Date(timeIntervalSinceNow: TimeInterval(minutes * 60))
        let med = medications[index]
        medications[index] = WatchMedication(
            id: med.id,
            name: med.name,
            dosage: med.dosage,
            scheduledTime: newTime,
            isTaken: false
        )
        updateMedicationStatus()
        persistMedications()

        // Haptic feedback
        WKInterfaceDevice.current().play(.click)
    }

    private func updateMedicationStatus() {
        let pending = medications.filter { !$0.isTaken }
        pendingMedicationCount = pending.count
        allMedicationsTaken = pending.isEmpty && !medications.isEmpty

        // Find next upcoming medication
        let now = Date()
        nextMedication = pending
            .filter { $0.scheduledTime >= now }
            .sorted { $0.scheduledTime < $1.scheduledTime }
            .first ?? pending.first
    }

    // MARK: - Fall Alert

    func startFallCountdown() {
        isFallAlertActive = true
        fallCountdownSeconds = 60

        fallCountdownTimer?.invalidate()
        fallCountdownTimer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] timer in
            DispatchQueue.main.async {
                guard let self = self else {
                    timer.invalidate()
                    return
                }
                if let seconds = self.fallCountdownSeconds, seconds > 0 {
                    self.fallCountdownSeconds = seconds - 1
                    // Haptic pulse every 10 seconds
                    if seconds % 10 == 0 {
                        WKInterfaceDevice.current().play(.notification)
                    }
                } else {
                    // Countdown expired - send confirmed fall alert
                    self.confirmFallAlert()
                    timer.invalidate()
                }
            }
        }
    }

    func dismissFallAlert() {
        isFallAlertActive = false
        fallCountdownSeconds = nil
        fallCountdownTimer?.invalidate()
        fallCountdownTimer = nil
        WKInterfaceDevice.current().play(.success)
    }

    private func confirmFallAlert() {
        isFallAlertActive = false
        fallCountdownSeconds = nil
        fallCountdownTimer?.invalidate()
        fallCountdownTimer = nil

        // Send confirmed fall alert to phone for caregiver notification
        WatchConnectivityManager.shared.sendFallAlert(
            severity: "confirmed",
            impactAcceleration: 0
        )
    }

    // MARK: - Persistence (UserDefaults)

    private let medicationsKey = "com.gentlereminder.watch.medications"

    private func persistMedications() {
        if let data = try? JSONEncoder().encode(medications) {
            UserDefaults.standard.set(data, forKey: medicationsKey)
        }
    }

    private func loadPersistedMedications() {
        guard let data = UserDefaults.standard.data(forKey: medicationsKey),
              let saved = try? JSONDecoder().decode([WatchMedication].self, from: data) else {
            return
        }

        // Only load if from today
        let calendar = Calendar.current
        let savedFromToday = saved.filter { calendar.isDateInToday($0.scheduledTime) }
        if !savedFromToday.isEmpty {
            medications = savedFromToday
            updateMedicationStatus()
        }
    }
}

// MARK: - WatchConnectivityManagerDelegate

extension WatchDataStore: WatchConnectivityManagerDelegate {

    func didReceiveMedicationReminder(name: String, dosage: String, scheduledTime: Date) {
        let medication = WatchMedication(
            id: "med_\(Int(scheduledTime.timeIntervalSince1970))",
            name: name,
            dosage: dosage,
            scheduledTime: scheduledTime,
            isTaken: false
        )

        // Add if not already present
        if !medications.contains(where: { $0.name == name && Calendar.current.isDate($0.scheduledTime, equalTo: scheduledTime, toGranularity: .minute) }) {
            medications.append(medication)
            medications.sort { $0.scheduledTime < $1.scheduledTime }
            updateMedicationStatus()
            persistMedications()
        }
    }

    func didReceiveCognitivePrompt(prompt: String, category: String) {
        // Store the prompt for the cognitive exercise button
        print("[WatchDataStore] Received cognitive prompt: \(category)")
    }

    func didReceiveConfigUpdate(config: [String: Any]) {
        // Handle full medication list sync
        if let medList = config["medications"] as? [[String: Any]] {
            var newMeds: [WatchMedication] = []
            for medDict in medList {
                guard let name = medDict["name"] as? String,
                      let dosage = medDict["dosage"] as? String,
                      let timeInterval = medDict["scheduledTime"] as? TimeInterval else { continue }

                let id = medDict["id"] as? String ?? "med_\(Int(timeInterval))"
                let isTaken = medDict["isTaken"] as? Bool ?? false

                newMeds.append(WatchMedication(
                    id: id,
                    name: name,
                    dosage: dosage,
                    scheduledTime: Date(timeIntervalSince1970: timeInterval / 1000),
                    isTaken: isTaken
                ))
            }
            medications = newMeds.sorted { $0.scheduledTime < $1.scheduledTime }
            updateMedicationStatus()
            persistMedications()
        }

        if let score = config["cognitiveScore"] as? Int {
            cognitiveScore = score
        }
    }

    func connectionStatusDidChange(isReachable: Bool) {
        self.isPhoneReachable = isReachable
    }
}

// MARK: - HealthKitCollectorDelegate

extension WatchDataStore: HealthKitCollectorDelegate {

    func didCollectHeartRate(bpm: Double, timestamp: Date, context: HeartRateContext) {
        DispatchQueue.main.async {
            self.heartRate = bpm
        }
        // Forward to phone
        WatchConnectivityManager.shared.sendHeartRate(bpm: bpm, timestamp: timestamp)
    }

    func didCollectSteps(count: Int, start: Date, end: Date) {
        DispatchQueue.main.async {
            self.stepCount = count
        }
    }

    func didCollectSleepData(stage: SleepStageType, start: Date, end: Date) {
        // Forward to phone via health sync
    }

    func didCollectHRV(sdnn: Double, timestamp: Date) {
        // Forward to phone
    }

    func didCollectOxygenSaturation(percentage: Double, timestamp: Date) {
        DispatchQueue.main.async {
            self.oxygenSaturation = percentage
        }
    }

    func didCollectActivitySummary(_ summary: DailyActivitySummary) {
        // Forward to phone
    }

    func didEncounterError(_ error: HealthKitCollectorError) {
        print("[WatchDataStore] HealthKit error: \(error.localizedDescription)")
    }
}

// MARK: - MotionAnalyzerDelegate

extension WatchDataStore: MotionAnalyzerDelegate {

    func didDetectFall(_ event: FallDetectionEvent) {
        DispatchQueue.main.async {
            self.startFallCountdown()
        }
    }

    func didUpdateGaitMetrics(_ metrics: GaitMetrics) {
        // Forward to phone for long-term tracking
    }

    func didClassifyActivity(_ activity: ActivityClassification) {
        // Could update UI with current activity
    }

    func didUpdateStepCadence(cadence: Double, totalSteps: Int) {
        DispatchQueue.main.async {
            self.stepCount = totalSteps
        }
    }

    func motionAnalyzerDidEncounterError(_ error: MotionAnalyzerError) {
        print("[WatchDataStore] Motion error: \(error.localizedDescription)")
    }
}
