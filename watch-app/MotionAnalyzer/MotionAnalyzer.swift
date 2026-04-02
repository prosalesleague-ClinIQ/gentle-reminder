/**
 * MotionAnalyzer.swift
 *
 * CoreMotion-based motion analyzer for the Gentle Reminder Watch app.
 * Processes accelerometer and gyroscope data to detect falls, analyze
 * gait patterns, and monitor mobility in dementia patients.
 *
 * Capabilities:
 *  - Real-time accelerometer and gyroscope monitoring
 *  - Fall detection using freefall + impact + post-impact algorithm
 *  - Gait analysis (cadence, stride, symmetry, stability)
 *  - Step counting with cadence tracking
 *  - Activity classification (walking, sitting, standing, lying)
 *  - Motion data buffering for batch transfer to iPhone
 *
 * Architecture:
 *  CMMotionManager -> MotionAnalyzer -> WatchConnectivityManager -> iPhone
 *  CMMotionManager -> MotionAnalyzer -> Delegate (Watch UI)
 */

import Foundation
import CoreMotion
import WatchKit

// MARK: - Delegate Protocol

protocol MotionAnalyzerDelegate: AnyObject {
    func didDetectFall(_ event: FallDetectionEvent)
    func didUpdateGaitMetrics(_ metrics: GaitMetrics)
    func didClassifyActivity(_ activity: ActivityClassification)
    func didUpdateStepCadence(cadence: Double, totalSteps: Int)
    func motionAnalyzerDidEncounterError(_ error: MotionAnalyzerError)
}

// MARK: - Supporting Types

struct FallDetectionEvent {
    let id: String
    let timestamp: Date
    let severity: FallSeverity
    let impactAcceleration: Double // peak g-force
    let freefallDuration: TimeInterval // seconds
    let postImpactMovement: Bool
    let confidenceScore: Double // 0.0 - 1.0

    enum FallSeverity: String {
        case minor
        case moderate
        case severe
    }
}

struct GaitMetrics {
    let timestamp: Date
    let cadence: Double        // steps per minute
    let strideLength: Double   // meters (estimated)
    let walkingSpeed: Double   // m/s
    let asymmetry: Double      // 0-1 (0 = perfect symmetry)
    let regularity: Double     // 0-1 (1 = very regular)
    let stability: Double      // 0-1 (1 = very stable)
    let fallRisk: FallRiskLevel

    enum FallRiskLevel: String {
        case low
        case moderate
        case high
    }
}

struct ActivityClassification {
    let timestamp: Date
    let activity: ActivityType
    let confidence: Double
    let duration: TimeInterval

    enum ActivityType: String {
        case walking
        case sitting
        case standing
        case lyingDown
        case unknown
    }
}

struct MotionSample {
    let timestamp: Date
    let acceleration: SIMD3<Double>     // x, y, z in g
    let rotationRate: SIMD3<Double>     // x, y, z in rad/s
    let gravity: SIMD3<Double>          // x, y, z in g
    let userAcceleration: SIMD3<Double> // gravity-free acceleration
    let attitude: (roll: Double, pitch: Double, yaw: Double)
}

enum MotionAnalyzerError: Error, LocalizedError {
    case accelerometerNotAvailable
    case gyroscopeNotAvailable
    case deviceMotionNotAvailable
    case alreadyRunning
    case notRunning

    var errorDescription: String? {
        switch self {
        case .accelerometerNotAvailable: return "Accelerometer is not available"
        case .gyroscopeNotAvailable: return "Gyroscope is not available"
        case .deviceMotionNotAvailable: return "Device motion is not available"
        case .alreadyRunning: return "Motion analyzer is already running"
        case .notRunning: return "Motion analyzer is not running"
        }
    }
}

// MARK: - Constants

private enum MotionConstants {
    static let sampleRate: TimeInterval = 1.0 / 50.0   // 50 Hz
    static let freefallThresholdG: Double = 0.3
    static let impactThresholdG: Double = 3.0
    static let severeImpactG: Double = 6.0
    static let moderateImpactG: Double = 4.0
    static let freefallMinDuration: TimeInterval = 0.15 // 150ms
    static let postImpactWindow: TimeInterval = 3.0     // 3 seconds
    static let bufferSize: Int = 2500                    // ~50 seconds at 50Hz
    static let gaitAnalysisWindow: Int = 500             // ~10 seconds
    static let stepDetectionThreshold: Double = 0.15
    static let minStepInterval: TimeInterval = 0.25
    static let maxStepInterval: TimeInterval = 2.0
    static let activityWindowSize: Int = 250             // ~5 seconds
}

// MARK: - MotionAnalyzer

final class MotionAnalyzer {

    // MARK: - Singleton

    static let shared = MotionAnalyzer()

    // MARK: - Properties

    weak var delegate: MotionAnalyzerDelegate?

    private let motionManager: CMMotionManager
    private let pedometer: CMPedometer
    private let queue: OperationQueue

    // State
    private var isRunning = false
    private var sampleBuffer: [MotionSample] = []
    private var stepTimestamps: [Date] = []
    private var lastStepTime: Date?
    private var totalStepCount: Int = 0
    private var currentActivity: ActivityClassification.ActivityType = .unknown
    private var activityStartTime: Date = Date()

    // Fall detection state machine
    private enum FallDetectionState {
        case idle
        case freefallDetected(startTime: Date)
        case impactDetected(freefallStart: Date, peakG: Double, impactTime: Date)
        case monitoring(event: FallDetectionEvent)
    }
    private var fallState: FallDetectionState = .idle
    private var freefallStartSample: Int?

    // MARK: - Initialization

    private init() {
        motionManager = CMMotionManager()
        pedometer = CMPedometer()
        queue = OperationQueue()
        queue.name = "com.gentlereminder.motionanalyzer"
        queue.maxConcurrentOperationCount = 1
        sampleBuffer.reserveCapacity(MotionConstants.bufferSize)
    }

    // MARK: - Start / Stop

    /// Start collecting and analyzing motion data
    func startAnalysis() throws {
        guard !isRunning else {
            throw MotionAnalyzerError.alreadyRunning
        }

        guard motionManager.isDeviceMotionAvailable else {
            throw MotionAnalyzerError.deviceMotionNotAvailable
        }

        isRunning = true
        sampleBuffer.removeAll(keepingCapacity: true)
        stepTimestamps.removeAll()
        totalStepCount = 0
        fallState = .idle

        // Configure motion manager
        motionManager.deviceMotionUpdateInterval = MotionConstants.sampleRate

        // Start device motion updates (fused sensor data)
        motionManager.startDeviceMotionUpdates(
            using: .xArbitraryCorrectedZVertical,
            to: queue
        ) { [weak self] motion, error in
            guard let self = self, let motion = motion else {
                if let error = error {
                    self?.delegate?.motionAnalyzerDidEncounterError(
                        .deviceMotionNotAvailable
                    )
                    print("[MotionAnalyzer] Device motion error: \(error)")
                }
                return
            }

            self.processMotionSample(motion)
        }

        // Start pedometer for ground-truth step counting
        if CMPedometer.isStepCountingAvailable() {
            pedometer.startUpdates(from: Date()) { [weak self] data, error in
                if let data = data {
                    self?.totalStepCount = data.numberOfSteps.intValue
                }
            }
        }

        print("[MotionAnalyzer] Analysis started at \(MotionConstants.sampleRate * 1000)ms intervals")
    }

    /// Stop motion analysis
    func stopAnalysis() {
        guard isRunning else { return }

        motionManager.stopDeviceMotionUpdates()
        motionManager.stopAccelerometerUpdates()
        motionManager.stopGyroUpdates()
        pedometer.stopUpdates()

        isRunning = false
        print("[MotionAnalyzer] Analysis stopped")
    }

    // MARK: - Core Processing Loop

    private func processMotionSample(_ motion: CMDeviceMotion) {
        let sample = MotionSample(
            timestamp: Date(),
            acceleration: SIMD3(
                motion.userAcceleration.x + motion.gravity.x,
                motion.userAcceleration.y + motion.gravity.y,
                motion.userAcceleration.z + motion.gravity.z
            ),
            rotationRate: SIMD3(
                motion.rotationRate.x,
                motion.rotationRate.y,
                motion.rotationRate.z
            ),
            gravity: SIMD3(motion.gravity.x, motion.gravity.y, motion.gravity.z),
            userAcceleration: SIMD3(
                motion.userAcceleration.x,
                motion.userAcceleration.y,
                motion.userAcceleration.z
            ),
            attitude: (
                roll: motion.attitude.roll,
                pitch: motion.attitude.pitch,
                yaw: motion.attitude.yaw
            )
        )

        // Add to ring buffer
        sampleBuffer.append(sample)
        if sampleBuffer.count > MotionConstants.bufferSize {
            sampleBuffer.removeFirst(sampleBuffer.count - MotionConstants.bufferSize)
        }

        // Run analysis pipelines
        runFallDetection(sample)
        runStepDetection(sample)

        // Periodic analyses (every ~1 second = 50 samples)
        if sampleBuffer.count % 50 == 0 {
            runActivityClassification()
        }

        // Gait analysis every ~5 seconds
        if sampleBuffer.count % 250 == 0 && sampleBuffer.count >= MotionConstants.gaitAnalysisWindow {
            runGaitAnalysis()
        }
    }

    // MARK: - Fall Detection

    private func runFallDetection(_ sample: MotionSample) {
        let magnitude = simd_length(sample.acceleration)

        switch fallState {
        case .idle:
            // Phase 1: Detect freefall (low acceleration magnitude)
            if magnitude < MotionConstants.freefallThresholdG {
                fallState = .freefallDetected(startTime: sample.timestamp)
                freefallStartSample = sampleBuffer.count - 1
            }

        case .freefallDetected(let startTime):
            let freefallDuration = sample.timestamp.timeIntervalSince(startTime)

            if magnitude >= MotionConstants.impactThresholdG {
                // Phase 2: Impact detected after freefall
                if freefallDuration >= MotionConstants.freefallMinDuration {
                    fallState = .impactDetected(
                        freefallStart: startTime,
                        peakG: magnitude,
                        impactTime: sample.timestamp
                    )
                } else {
                    fallState = .idle // Too short, not a real freefall
                }
            } else if magnitude > MotionConstants.freefallThresholdG * 2 &&
                      freefallDuration < MotionConstants.freefallMinDuration {
                // False alarm: magnitude returned to normal too quickly
                fallState = .idle
            }

        case .impactDetected(let freefallStart, var peakG, let impactTime):
            let timeSinceImpact = sample.timestamp.timeIntervalSince(impactTime)

            // Track peak during impact window
            if magnitude > peakG {
                peakG = magnitude
                fallState = .impactDetected(
                    freefallStart: freefallStart,
                    peakG: peakG,
                    impactTime: impactTime
                )
            }

            if timeSinceImpact >= MotionConstants.postImpactWindow {
                // Phase 3: Assess post-impact movement
                let recentSamples = Array(sampleBuffer.suffix(Int(MotionConstants.postImpactWindow / MotionConstants.sampleRate)))
                let avgPostMagnitude = recentSamples.reduce(0.0) { $0 + simd_length($1.acceleration) }
                    / Double(max(recentSamples.count, 1))
                let postImpactMovement = avgPostMagnitude > 1.2

                // Determine severity
                let severity: FallDetectionEvent.FallSeverity
                if peakG >= MotionConstants.severeImpactG { severity = .severe }
                else if peakG >= MotionConstants.moderateImpactG { severity = .moderate }
                else { severity = .minor }

                // Calculate confidence
                let freefallDuration = impactTime.timeIntervalSince(freefallStart)
                let confidence = min(1.0,
                    (peakG / MotionConstants.severeImpactG) * 0.5 +
                    (freefallDuration / 0.5) * 0.3 +
                    0.2
                )

                let event = FallDetectionEvent(
                    id: "fall_\(Int(Date().timeIntervalSince1970 * 1000))",
                    timestamp: freefallStart,
                    severity: severity,
                    impactAcceleration: peakG,
                    freefallDuration: freefallDuration,
                    postImpactMovement: postImpactMovement,
                    confidenceScore: confidence
                )

                // Trigger haptic alert
                WKInterfaceDevice.current().play(.notification)

                DispatchQueue.main.async { [weak self] in
                    self?.delegate?.didDetectFall(event)
                }

                // Send to phone immediately
                WatchConnectivityManager.shared.sendFallAlert(
                    severity: severity.rawValue,
                    impactAcceleration: peakG
                )

                fallState = .idle
            }

        case .monitoring:
            fallState = .idle
        }
    }

    // MARK: - Step Detection

    private func runStepDetection(_ sample: MotionSample) {
        let verticalAccel = abs(sample.userAcceleration.z)

        // Simple peak detection on vertical axis
        guard sampleBuffer.count >= 5 else { return }
        let idx = sampleBuffer.count - 3 // Look at sample 2 back (to check neighbors)
        guard idx >= 2 && idx < sampleBuffer.count - 2 else { return }

        let prev2 = abs(sampleBuffer[idx - 2].userAcceleration.z)
        let prev1 = abs(sampleBuffer[idx - 1].userAcceleration.z)
        let current = abs(sampleBuffer[idx].userAcceleration.z)
        let next1 = abs(sampleBuffer[idx + 1].userAcceleration.z)
        let next2 = abs(sampleBuffer[idx + 2].userAcceleration.z)

        let isPeak = current > prev1 && current > prev2 &&
                     current > next1 && current > next2 &&
                     current > MotionConstants.stepDetectionThreshold

        if isPeak {
            let stepTime = sampleBuffer[idx].timestamp
            if let lastStep = lastStepTime {
                let interval = stepTime.timeIntervalSince(lastStep)
                if interval >= MotionConstants.minStepInterval && interval <= MotionConstants.maxStepInterval {
                    stepTimestamps.append(stepTime)
                    lastStepTime = stepTime

                    // Cadence from last 10 steps
                    let recentSteps = Array(stepTimestamps.suffix(10))
                    if recentSteps.count >= 2 {
                        let window = recentSteps.last!.timeIntervalSince(recentSteps.first!)
                        if window > 0 {
                            let cadence = Double(recentSteps.count - 1) / window * 60.0

                            DispatchQueue.main.async { [weak self] in
                                self?.delegate?.didUpdateStepCadence(
                                    cadence: cadence,
                                    totalSteps: self?.totalStepCount ?? 0
                                )
                            }
                        }
                    }
                }
            } else {
                lastStepTime = stepTime
                stepTimestamps.append(stepTime)
            }
        }
    }

    // MARK: - Gait Analysis

    private func runGaitAnalysis() {
        guard stepTimestamps.count >= 6 else { return }
        let recentSteps = Array(stepTimestamps.suffix(20))
        guard recentSteps.count >= 4 else { return }

        // Cadence
        let windowDuration = recentSteps.last!.timeIntervalSince(recentSteps.first!)
        guard windowDuration > 0 else { return }
        let cadence = Double(recentSteps.count - 1) / windowDuration * 60.0

        // Step intervals
        var intervals: [TimeInterval] = []
        for i in 1..<recentSteps.count {
            intervals.append(recentSteps[i].timeIntervalSince(recentSteps[i - 1]))
        }

        let meanInterval = intervals.reduce(0, +) / Double(intervals.count)
        let intervalStd = sqrt(intervals.reduce(0) { $0 + ($1 - meanInterval) * ($1 - meanInterval) } / Double(intervals.count))
        let cadenceCV = meanInterval > 0 ? intervalStd / meanInterval : 0

        // Asymmetry (odd vs even intervals)
        let oddIntervals = intervals.enumerated().filter { $0.offset % 2 == 0 }.map(\.element)
        let evenIntervals = intervals.enumerated().filter { $0.offset % 2 == 1 }.map(\.element)
        let oddMean = oddIntervals.isEmpty ? 0 : oddIntervals.reduce(0, +) / Double(oddIntervals.count)
        let evenMean = evenIntervals.isEmpty ? 0 : evenIntervals.reduce(0, +) / Double(evenIntervals.count)
        let asymmetry = (oddMean + evenMean) > 0 ? abs(oddMean - evenMean) / ((oddMean + evenMean) / 2) : 0

        // Regularity
        let regularity = max(0, 1 - cadenceCV)

        // Stability from vertical acceleration variance
        let recentAccel = sampleBuffer.suffix(MotionConstants.gaitAnalysisWindow)
        let zValues = recentAccel.map { $0.userAcceleration.z }
        let zMean = zValues.reduce(0, +) / Double(zValues.count)
        let zStd = sqrt(zValues.reduce(0) { $0 + ($1 - zMean) * ($1 - zMean) } / Double(zValues.count))
        let stability = max(0, min(1, 1 - zStd / 2))

        // Stride length estimate
        let strideLength = 0.4 * pow(cadence / 120.0, 0.33) * meanInterval

        // Fall risk
        let fallRisk: GaitMetrics.FallRiskLevel
        if cadenceCV > 0.15 || asymmetry > 0.2 || stability < 0.5 {
            fallRisk = .high
        } else if cadenceCV > 0.08 || asymmetry > 0.1 || stability < 0.7 {
            fallRisk = .moderate
        } else {
            fallRisk = .low
        }

        let metrics = GaitMetrics(
            timestamp: Date(),
            cadence: cadence,
            strideLength: strideLength,
            walkingSpeed: strideLength * cadence / 60.0,
            asymmetry: asymmetry,
            regularity: regularity,
            stability: stability,
            fallRisk: fallRisk
        )

        DispatchQueue.main.async { [weak self] in
            self?.delegate?.didUpdateGaitMetrics(metrics)
        }
    }

    // MARK: - Activity Classification

    private func runActivityClassification() {
        guard sampleBuffer.count >= MotionConstants.activityWindowSize else { return }
        let window = Array(sampleBuffer.suffix(MotionConstants.activityWindowSize))

        // Features
        let accelMagnitudes = window.map { simd_length($0.userAcceleration) }
        let accelMean = accelMagnitudes.reduce(0, +) / Double(accelMagnitudes.count)
        let accelStd = sqrt(accelMagnitudes.reduce(0) { $0 + ($1 - accelMean) * ($1 - accelMean) } / Double(accelMagnitudes.count))

        // Gravity angle (orientation)
        let lastGravity = window.last!.gravity
        let pitch = atan2(lastGravity.y, sqrt(lastGravity.x * lastGravity.x + lastGravity.z * lastGravity.z))

        // Classify
        let activity: ActivityClassification.ActivityType
        let confidence: Double

        if accelStd > 0.15 && accelMean > 0.1 {
            activity = .walking
            confidence = min(1.0, accelStd / 0.3)
        } else if abs(pitch) > 1.2 { // Nearly horizontal
            activity = .lyingDown
            confidence = min(1.0, abs(pitch) / 1.5)
        } else if accelStd < 0.03 && accelMean < 0.05 {
            if abs(pitch) < 0.3 {
                activity = .standing
                confidence = 0.7
            } else {
                activity = .sitting
                confidence = 0.6
            }
        } else {
            activity = .unknown
            confidence = 0.3
        }

        // Only report if activity changed
        if activity != currentActivity {
            let duration = Date().timeIntervalSince(activityStartTime)
            let classification = ActivityClassification(
                timestamp: Date(),
                activity: activity,
                confidence: confidence,
                duration: duration
            )
            currentActivity = activity
            activityStartTime = Date()

            DispatchQueue.main.async { [weak self] in
                self?.delegate?.didClassifyActivity(classification)
            }
        }
    }

    // MARK: - Data Export

    /// Get buffered motion data for transfer to iPhone
    func getBufferedData() -> [[String: Any]] {
        return sampleBuffer.map { sample in
            [
                "timestamp": sample.timestamp.timeIntervalSince1970 * 1000,
                "ax": sample.acceleration.x,
                "ay": sample.acceleration.y,
                "az": sample.acceleration.z,
                "rx": sample.rotationRate.x,
                "ry": sample.rotationRate.y,
                "rz": sample.rotationRate.z,
                "gx": sample.gravity.x,
                "gy": sample.gravity.y,
                "gz": sample.gravity.z,
                "roll": sample.attitude.roll,
                "pitch": sample.attitude.pitch,
                "yaw": sample.attitude.yaw,
            ]
        }
    }

    /// Clear the sample buffer after successful transfer
    func clearBuffer() {
        sampleBuffer.removeAll(keepingCapacity: true)
    }

    // MARK: - Status

    var isAnalyzing: Bool { isRunning }
    var bufferCount: Int { sampleBuffer.count }
    var detectedSteps: Int { totalStepCount }
}
