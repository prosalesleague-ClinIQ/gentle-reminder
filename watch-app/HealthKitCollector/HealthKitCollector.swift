/**
 * HealthKitCollector.swift
 *
 * Comprehensive HealthKit data collector for the Gentle Reminder Watch app.
 * Manages authorization, queries, observer queries, and background delivery
 * for all health data types relevant to dementia patient monitoring.
 *
 * Collected data types:
 *  - Heart rate (continuous and resting)
 *  - Heart rate variability (SDNN)
 *  - Step count and distance
 *  - Sleep analysis (all stages)
 *  - Blood oxygen saturation
 *  - Activity summaries (energy, exercise, stand hours)
 *  - Walking heart rate average
 *  - Respiratory rate
 *
 * Data Flow:
 *  HealthKit Store -> HealthKitCollector -> WatchConnectivityManager -> iPhone
 */

import Foundation
import HealthKit

// MARK: - Delegate Protocol

protocol HealthKitCollectorDelegate: AnyObject {
    func didCollectHeartRate(bpm: Double, timestamp: Date, context: HeartRateContext)
    func didCollectSteps(count: Int, start: Date, end: Date)
    func didCollectSleepData(stage: SleepStageType, start: Date, end: Date)
    func didCollectHRV(sdnn: Double, timestamp: Date)
    func didCollectOxygenSaturation(percentage: Double, timestamp: Date)
    func didCollectActivitySummary(_ summary: DailyActivitySummary)
    func didEncounterError(_ error: HealthKitCollectorError)
}

// MARK: - Supporting Types

enum HeartRateContext: String {
    case sedentary
    case active
    case workout
    case unknown
}

enum SleepStageType: Int {
    case inBed = 0
    case asleepUnspecified = 1
    case awake = 2
    case asleepCore = 3
    case asleepDeep = 4
    case asleepREM = 5

    var displayName: String {
        switch self {
        case .inBed: return "In Bed"
        case .asleepUnspecified: return "Asleep"
        case .awake: return "Awake"
        case .asleepCore: return "Core Sleep"
        case .asleepDeep: return "Deep Sleep"
        case .asleepREM: return "REM Sleep"
        }
    }
}

struct DailyActivitySummary {
    let date: Date
    let activeEnergyBurned: Double     // kcal
    let activeEnergyGoal: Double
    let exerciseMinutes: Double
    let exerciseGoal: Double
    let standHours: Int
    let standGoal: Int
    let stepCount: Int
    let distanceWalkingRunning: Double  // meters
    let flightsClimbed: Int
}

enum HealthKitCollectorError: Error, LocalizedError {
    case healthKitNotAvailable
    case authorizationDenied(String)
    case queryFailed(String)
    case noData(String)
    case backgroundDeliveryFailed(String)

    var errorDescription: String? {
        switch self {
        case .healthKitNotAvailable:
            return "HealthKit is not available on this device"
        case .authorizationDenied(let type):
            return "Authorization denied for \(type)"
        case .queryFailed(let details):
            return "HealthKit query failed: \(details)"
        case .noData(let type):
            return "No data available for \(type)"
        case .backgroundDeliveryFailed(let type):
            return "Background delivery setup failed for \(type)"
        }
    }
}

// MARK: - HealthKitCollector

final class HealthKitCollector {

    // MARK: - Singleton

    static let shared = HealthKitCollector()

    // MARK: - Properties

    weak var delegate: HealthKitCollectorDelegate?

    private let healthStore: HKHealthStore
    private var observerQueries: [HKObserverQuery] = []
    private var anchorQueries: [HKAnchoredObjectQuery] = []
    private var isAuthorized = false
    private var anchors: [String: HKQueryAnchor] = [:]

    /// Types we want to read from HealthKit
    private let readTypes: Set<HKObjectType> = {
        var types: Set<HKObjectType> = []
        // Quantity types
        let quantityIdentifiers: [HKQuantityTypeIdentifier] = [
            .heartRate,
            .restingHeartRate,
            .heartRateVariabilitySDNN,
            .walkingHeartRateAverage,
            .stepCount,
            .distanceWalkingRunning,
            .flightsClimbed,
            .activeEnergyBurned,
            .basalEnergyBurned,
            .appleExerciseTime,
            .oxygenSaturation,
            .respiratoryRate,
            .bodyTemperature,
        ]
        for id in quantityIdentifiers {
            if let type = HKObjectType.quantityType(forIdentifier: id) {
                types.insert(type)
            }
        }
        // Category types
        if let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis) {
            types.insert(sleepType)
        }
        // Activity summary
        types.insert(HKObjectType.activitySummaryType())
        return types
    }()

    // MARK: - Initialization

    private init() {
        healthStore = HKHealthStore()
    }

    // MARK: - Authorization

    /// Request authorization for all required HealthKit data types
    func requestAuthorization(completion: @escaping (Bool, Error?) -> Void) {
        guard HKHealthStore.isHealthDataAvailable() else {
            completion(false, HealthKitCollectorError.healthKitNotAvailable)
            return
        }

        healthStore.requestAuthorization(toShare: nil, read: readTypes) { [weak self] success, error in
            self?.isAuthorized = success
            if success {
                print("[HealthKitCollector] Authorization granted")
            } else {
                print("[HealthKitCollector] Authorization failed: \(error?.localizedDescription ?? "unknown")")
            }
            completion(success, error)
        }
    }

    /// Check authorization status for a specific type
    func authorizationStatus(for typeIdentifier: HKQuantityTypeIdentifier) -> HKAuthorizationStatus {
        guard let type = HKObjectType.quantityType(forIdentifier: typeIdentifier) else {
            return .notDetermined
        }
        return healthStore.authorizationStatus(for: type)
    }

    // MARK: - Heart Rate

    /// Query heart rate samples within a date range
    func queryHeartRate(
        from startDate: Date,
        to endDate: Date,
        limit: Int = 1000,
        completion: @escaping ([HKQuantitySample], Error?) -> Void
    ) {
        guard let heartRateType = HKQuantityType.quantityType(forIdentifier: .heartRate) else {
            completion([], HealthKitCollectorError.queryFailed("Heart rate type not available"))
            return
        }

        let predicate = HKQuery.predicateForSamples(
            withStart: startDate, end: endDate, options: .strictStartDate
        )
        let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: true)

        let query = HKSampleQuery(
            sampleType: heartRateType,
            predicate: predicate,
            limit: limit,
            sortDescriptors: [sortDescriptor]
        ) { _, results, error in
            guard let samples = results as? [HKQuantitySample] else {
                completion([], error)
                return
            }

            // Notify delegate for each sample
            for sample in samples {
                let bpm = sample.quantity.doubleValue(for: HKUnit(from: "count/min"))
                let context = self.extractHeartRateContext(from: sample)
                self.delegate?.didCollectHeartRate(bpm: bpm, timestamp: sample.startDate, context: context)
            }

            completion(samples, nil)
        }

        healthStore.execute(query)
    }

    /// Extract motion context metadata from a heart rate sample
    private func extractHeartRateContext(from sample: HKQuantitySample) -> HeartRateContext {
        guard let metadata = sample.metadata,
              let contextValue = metadata[HKMetadataKeyHeartRateMotionContext] as? NSNumber else {
            return .unknown
        }
        switch contextValue.intValue {
        case 1: return .sedentary
        case 2: return .active
        default: return .unknown
        }
    }

    // MARK: - Heart Rate Variability

    /// Query HRV (SDNN) samples
    func queryHRV(
        from startDate: Date,
        to endDate: Date,
        completion: @escaping ([(sdnn: Double, date: Date)], Error?) -> Void
    ) {
        guard let hrvType = HKQuantityType.quantityType(forIdentifier: .heartRateVariabilitySDNN) else {
            completion([], HealthKitCollectorError.queryFailed("HRV type not available"))
            return
        }

        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: .strictStartDate)
        let sort = NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: true)

        let query = HKSampleQuery(
            sampleType: hrvType, predicate: predicate, limit: 500, sortDescriptors: [sort]
        ) { _, results, error in
            guard let samples = results as? [HKQuantitySample] else {
                completion([], error)
                return
            }

            let readings = samples.map { sample -> (sdnn: Double, date: Date) in
                let sdnn = sample.quantity.doubleValue(for: HKUnit.secondUnit(with: .milli))
                self.delegate?.didCollectHRV(sdnn: sdnn, timestamp: sample.startDate)
                return (sdnn: sdnn, date: sample.startDate)
            }

            completion(readings, nil)
        }

        healthStore.execute(query)
    }

    // MARK: - Step Count

    /// Query step count with hourly breakdown
    func queryStepCount(
        from startDate: Date,
        to endDate: Date,
        completion: @escaping (Int, [(start: Date, end: Date, steps: Int)], Error?) -> Void
    ) {
        guard let stepType = HKQuantityType.quantityType(forIdentifier: .stepCount) else {
            completion(0, [], HealthKitCollectorError.queryFailed("Step type not available"))
            return
        }

        // Use statistics collection for hourly breakdown
        let interval = DateComponents(hour: 1)
        let query = HKStatisticsCollectionQuery(
            quantityType: stepType,
            quantitySamplePredicate: HKQuery.predicateForSamples(
                withStart: startDate, end: endDate, options: .strictStartDate
            ),
            options: .cumulativeSum,
            anchorDate: Calendar.current.startOfDay(for: startDate),
            intervalComponents: interval
        )

        query.initialResultsHandler = { [weak self] _, results, error in
            guard let collection = results else {
                completion(0, [], error)
                return
            }

            var totalSteps = 0
            var hourlyBreakdown: [(start: Date, end: Date, steps: Int)] = []

            collection.enumerateStatistics(from: startDate, to: endDate) { statistics, _ in
                let steps = Int(statistics.sumQuantity()?.doubleValue(for: .count()) ?? 0)
                totalSteps += steps
                if steps > 0 {
                    hourlyBreakdown.append((
                        start: statistics.startDate,
                        end: statistics.endDate,
                        steps: steps
                    ))
                }
            }

            self?.delegate?.didCollectSteps(count: totalSteps, start: startDate, end: endDate)
            completion(totalSteps, hourlyBreakdown, nil)
        }

        healthStore.execute(query)
    }

    // MARK: - Sleep Analysis

    /// Query sleep analysis samples for a night
    func querySleepAnalysis(
        from startDate: Date,
        to endDate: Date,
        completion: @escaping ([(stage: SleepStageType, start: Date, end: Date, duration: TimeInterval)], Error?) -> Void
    ) {
        guard let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis) else {
            completion([], HealthKitCollectorError.queryFailed("Sleep type not available"))
            return
        }

        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: .strictStartDate)
        let sort = NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: true)

        let query = HKSampleQuery(
            sampleType: sleepType, predicate: predicate, limit: 500, sortDescriptors: [sort]
        ) { [weak self] _, results, error in
            guard let samples = results as? [HKCategorySample] else {
                completion([], error)
                return
            }

            let readings = samples.compactMap { sample -> (stage: SleepStageType, start: Date, end: Date, duration: TimeInterval)? in
                guard let stage = SleepStageType(rawValue: sample.value) else { return nil }
                let duration = sample.endDate.timeIntervalSince(sample.startDate)
                self?.delegate?.didCollectSleepData(stage: stage, start: sample.startDate, end: sample.endDate)
                return (stage: stage, start: sample.startDate, end: sample.endDate, duration: duration)
            }

            completion(readings, nil)
        }

        healthStore.execute(query)
    }

    // MARK: - Oxygen Saturation

    /// Query blood oxygen saturation
    func queryOxygenSaturation(
        from startDate: Date,
        to endDate: Date,
        completion: @escaping ([(percentage: Double, date: Date)], Error?) -> Void
    ) {
        guard let spo2Type = HKQuantityType.quantityType(forIdentifier: .oxygenSaturation) else {
            completion([], HealthKitCollectorError.queryFailed("SpO2 type not available"))
            return
        }

        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: .strictStartDate)
        let sort = NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: true)

        let query = HKSampleQuery(
            sampleType: spo2Type, predicate: predicate, limit: 500, sortDescriptors: [sort]
        ) { [weak self] _, results, error in
            guard let samples = results as? [HKQuantitySample] else {
                completion([], error)
                return
            }

            let readings = samples.map { sample -> (percentage: Double, date: Date) in
                let pct = sample.quantity.doubleValue(for: .percent()) * 100
                self?.delegate?.didCollectOxygenSaturation(percentage: pct, timestamp: sample.startDate)
                return (percentage: pct, date: sample.startDate)
            }

            completion(readings, nil)
        }

        healthStore.execute(query)
    }

    // MARK: - Activity Summary

    /// Query activity summaries for a date range
    func queryActivitySummary(
        from startDate: Date,
        to endDate: Date,
        completion: @escaping ([DailyActivitySummary], Error?) -> Void
    ) {
        let calendar = Calendar.current
        let startComponents = calendar.dateComponents([.year, .month, .day], from: startDate)
        let endComponents = calendar.dateComponents([.year, .month, .day], from: endDate)

        let predicate = HKQuery.predicate(
            forActivitySummariesBetweenStart: startComponents,
            end: endComponents
        )

        let query = HKActivitySummaryQuery(predicate: predicate) { [weak self] _, summaries, error in
            guard let summaries = summaries else {
                completion([], error)
                return
            }

            let results: [DailyActivitySummary] = summaries.compactMap { summary in
                let components = summary.dateComponents(for: calendar)
                guard let date = calendar.date(from: components) else { return nil }

                let dailySummary = DailyActivitySummary(
                    date: date,
                    activeEnergyBurned: summary.activeEnergyBurned.doubleValue(for: .kilocalorie()),
                    activeEnergyGoal: summary.activeEnergyBurnedGoal.doubleValue(for: .kilocalorie()),
                    exerciseMinutes: summary.appleExerciseTime.doubleValue(for: .minute()),
                    exerciseGoal: summary.exerciseTimeGoal?.doubleValue(for: .minute()) ?? 30,
                    standHours: Int(summary.appleStandHours.doubleValue(for: .count())),
                    standGoal: Int(summary.standHoursGoal?.doubleValue(for: .count()) ?? 12),
                    stepCount: 0, // Steps come from separate query
                    distanceWalkingRunning: 0,
                    flightsClimbed: 0
                )

                self?.delegate?.didCollectActivitySummary(dailySummary)
                return dailySummary
            }

            completion(results, nil)
        }

        healthStore.execute(query)
    }

    // MARK: - Observer Queries (Real-time)

    /// Start observing heart rate changes in real-time
    func startObservingHeartRate() {
        guard let heartRateType = HKQuantityType.quantityType(forIdentifier: .heartRate) else { return }

        let query = HKObserverQuery(sampleType: heartRateType, predicate: nil) { [weak self] _, completionHandler, error in
            if let error = error {
                self?.delegate?.didEncounterError(.queryFailed(error.localizedDescription))
                completionHandler()
                return
            }

            // Fetch the most recent sample
            self?.fetchMostRecentSample(type: heartRateType) { sample in
                if let sample = sample {
                    let bpm = sample.quantity.doubleValue(for: HKUnit(from: "count/min"))
                    let context = self?.extractHeartRateContext(from: sample) ?? .unknown
                    self?.delegate?.didCollectHeartRate(bpm: bpm, timestamp: sample.startDate, context: context)
                }
                completionHandler()
            }
        }

        healthStore.execute(query)
        observerQueries.append(query)
    }

    /// Start observing sleep analysis changes
    func startObservingSleep() {
        guard let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis) else { return }

        let query = HKObserverQuery(sampleType: sleepType, predicate: nil) { [weak self] _, completionHandler, error in
            if error != nil {
                completionHandler()
                return
            }

            // Fetch recent sleep samples
            let predicate = HKQuery.predicateForSamples(
                withStart: Calendar.current.date(byAdding: .hour, value: -12, to: Date()),
                end: Date(),
                options: .strictStartDate
            )
            let sort = NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: false)

            let sampleQuery = HKSampleQuery(
                sampleType: sleepType, predicate: predicate, limit: 10, sortDescriptors: [sort]
            ) { _, results, _ in
                if let samples = results as? [HKCategorySample] {
                    for sample in samples {
                        if let stage = SleepStageType(rawValue: sample.value) {
                            self?.delegate?.didCollectSleepData(
                                stage: stage, start: sample.startDate, end: sample.endDate
                            )
                        }
                    }
                }
                completionHandler()
            }

            self?.healthStore.execute(sampleQuery)
        }

        healthStore.execute(query)
        observerQueries.append(query)
    }

    // MARK: - Background Delivery

    /// Enable background delivery for critical health metrics
    func enableBackgroundDelivery(completion: @escaping (Bool) -> Void) {
        let criticalTypes: [HKQuantityTypeIdentifier] = [
            .heartRate,
            .heartRateVariabilitySDNN,
            .oxygenSaturation,
        ]

        var successCount = 0
        let totalTypes = criticalTypes.count

        for identifier in criticalTypes {
            guard let type = HKQuantityType.quantityType(forIdentifier: identifier) else { continue }

            healthStore.enableBackgroundDelivery(
                for: type,
                frequency: .immediate
            ) { success, error in
                if success {
                    successCount += 1
                    print("[HealthKitCollector] Background delivery enabled for \(identifier.rawValue)")
                } else if let error = error {
                    print("[HealthKitCollector] Background delivery failed for \(identifier.rawValue): \(error)")
                }

                if successCount + (totalTypes - successCount) == totalTypes {
                    completion(successCount == totalTypes)
                }
            }
        }

        // Also enable for sleep
        if let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis) {
            healthStore.enableBackgroundDelivery(for: sleepType, frequency: .hourly) { success, error in
                if !success, let error = error {
                    print("[HealthKitCollector] Sleep background delivery failed: \(error)")
                }
            }
        }
    }

    /// Disable all background delivery
    func disableAllBackgroundDelivery(completion: @escaping (Bool) -> Void) {
        healthStore.disableAllBackgroundDelivery { success, error in
            if let error = error {
                print("[HealthKitCollector] Disable background delivery failed: \(error)")
            }
            completion(success)
        }
    }

    // MARK: - Helpers

    /// Fetch the most recent sample of a given type
    private func fetchMostRecentSample(
        type: HKSampleType,
        completion: @escaping (HKQuantitySample?) -> Void
    ) {
        let sort = NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: false)
        let query = HKSampleQuery(
            sampleType: type, predicate: nil, limit: 1, sortDescriptors: [sort]
        ) { _, results, _ in
            completion(results?.first as? HKQuantitySample)
        }
        healthStore.execute(query)
    }

    /// Stop all observer queries and clean up
    func stopAllObservers() {
        for query in observerQueries {
            healthStore.stop(query)
        }
        observerQueries.removeAll()

        for query in anchorQueries {
            healthStore.stop(query)
        }
        anchorQueries.removeAll()

        print("[HealthKitCollector] All observer queries stopped")
    }
}
