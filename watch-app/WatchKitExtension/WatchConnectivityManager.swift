/**
 * WatchConnectivityManager.swift
 *
 * Manages bidirectional communication between the Apple Watch companion app
 * and the Gentle Reminder iPhone app via the WatchConnectivity framework.
 *
 * This class serves as the Watch-side counterpart to the TypeScript
 * WatchConnectivityBridge on the phone. It handles:
 *  - WCSession lifecycle (activation, reachability)
 *  - Sending health/motion data to the phone
 *  - Receiving medication reminders and cognitive prompts
 *  - Message queuing for when the phone is unreachable
 *  - Application context and user-info transfers for background sync
 *
 * Architecture:
 *  Watch App (SwiftUI) -> WatchConnectivityManager -> WCSession -> iPhone
 *  iPhone (React Native) -> NativeModule -> WCSession -> WatchConnectivityManager
 */

import Foundation
import WatchConnectivity
import WatchKit

// MARK: - Message Types

/// Mirrors the TypeScript WatchMessageType enum for type-safe messaging
enum WatchMessageType: String, Codable {
    case healthSync
    case motionSync
    case heartRate
    case stepCount
    case sleepData
    case fallAlert
    case medicationReminder
    case cognitivePrompt
    case configUpdate
    case ping
    case ack
}

// MARK: - Message Model

/// A structured message exchanged between Watch and Phone
struct WatchMessage: Codable {
    let id: String
    let type: WatchMessageType
    let payload: [String: AnyCodable]
    let timestamp: TimeInterval
    let compressed: Bool
    let retryCount: Int
}

// MARK: - Delegate Protocol

/// Protocol for objects that want to receive messages from the phone
protocol WatchConnectivityManagerDelegate: AnyObject {
    func didReceiveMedicationReminder(name: String, dosage: String, scheduledTime: Date)
    func didReceiveCognitivePrompt(prompt: String, category: String)
    func didReceiveConfigUpdate(config: [String: Any])
    func connectionStatusDidChange(isReachable: Bool)
}

// MARK: - Connection Status

enum ConnectionStatus: String {
    case connected
    case disconnected
    case notPaired
    case notInstalled
    case unknown
}

// MARK: - WatchConnectivityManager

final class WatchConnectivityManager: NSObject {

    // MARK: - Singleton

    static let shared = WatchConnectivityManager()

    // MARK: - Properties

    weak var delegate: WatchConnectivityManagerDelegate?

    private var session: WCSession?
    private var messageQueue: [WatchMessage] = []
    private let maxQueueSize = 100
    private let messageTTL: TimeInterval = 300 // 5 minutes
    private var isProcessingQueue = false
    private var pingTimer: Timer?

    /// Current connection status
    private(set) var connectionStatus: ConnectionStatus = .unknown

    /// Whether the paired iPhone is currently reachable
    var isReachable: Bool {
        return session?.isReachable ?? false
    }

    /// Whether the Watch app is paired with an iPhone
    var isPaired: Bool {
        return session?.isPaired ?? false
    }

    /// Whether the companion app is installed on the iPhone
    var isCompanionAppInstalled: Bool {
        return session?.isCompanionAppInstalled ?? false
    }

    // MARK: - Initialization

    private override init() {
        super.init()
    }

    // MARK: - Session Lifecycle

    /// Activates the WCSession. Call this early in the app lifecycle (e.g., ExtensionDelegate).
    func activate() {
        guard WCSession.isSupported() else {
            print("[WatchConnectivity] WCSession is not supported on this device")
            connectionStatus = .unknown
            return
        }

        session = WCSession.default
        session?.delegate = self
        session?.activate()
        print("[WatchConnectivity] Session activation requested")
    }

    /// Starts a periodic ping to keep the connection alive
    func startKeepAlive(interval: TimeInterval = 30.0) {
        stopKeepAlive()
        pingTimer = Timer.scheduledTimer(withTimeInterval: interval, repeats: true) { [weak self] _ in
            self?.sendPing()
        }
    }

    /// Stops the keep-alive ping timer
    func stopKeepAlive() {
        pingTimer?.invalidate()
        pingTimer = nil
    }

    // MARK: - Sending Messages

    /// Sends a message to the paired iPhone with reply handler
    func sendMessage(
        type: WatchMessageType,
        payload: [String: Any],
        replyHandler: (([String: Any]) -> Void)? = nil,
        errorHandler: ((Error) -> Void)? = nil
    ) {
        let message = createMessage(type: type, payload: payload)

        guard let session = session, session.isReachable else {
            print("[WatchConnectivity] Phone not reachable, queuing message")
            enqueueMessage(message)
            errorHandler?(WatchConnectivityError.phoneNotReachable)
            return
        }

        let dict = encodeMessage(message)

        session.sendMessage(dict, replyHandler: { reply in
            print("[WatchConnectivity] Message \(message.id) sent successfully")
            replyHandler?(reply)
        }, errorHandler: { error in
            print("[WatchConnectivity] Failed to send message: \(error.localizedDescription)")
            // Queue for retry
            if message.retryCount < 5 {
                var retryMessage = message
                // Note: In production, increment retryCount via a mutable copy
                self.enqueueMessage(retryMessage)
            }
            errorHandler?(error)
        })
    }

    /// Sends health data (heart rate, steps, sleep) to the phone
    func sendHealthData(_ data: [String: Any]) {
        sendMessage(type: .healthSync, payload: data)
    }

    /// Sends motion/accelerometer data to the phone
    func sendMotionData(_ data: [String: Any]) {
        sendMessage(type: .motionSync, payload: data)
    }

    /// Sends a heart rate reading to the phone
    func sendHeartRate(bpm: Double, timestamp: Date, confidence: Double = 1.0) {
        sendMessage(type: .heartRate, payload: [
            "bpm": bpm,
            "timestamp": timestamp.timeIntervalSince1970 * 1000,
            "source": "watch",
            "confidence": confidence
        ])
    }

    /// Sends a fall alert to the phone for immediate caregiver notification
    func sendFallAlert(
        severity: String,
        impactAcceleration: Double,
        latitude: Double? = nil,
        longitude: Double? = nil
    ) {
        var payload: [String: Any] = [
            "severity": severity,
            "accelerationPeak": impactAcceleration,
            "timestamp": Date().timeIntervalSince1970 * 1000,
            "confirmed": false
        ]
        if let lat = latitude, let lon = longitude {
            payload["location"] = ["latitude": lat, "longitude": lon]
        }
        sendMessage(type: .fallAlert, payload: payload)
    }

    // MARK: - Application Context (Background Transfer)

    /// Updates the application context for background data transfer
    /// Use this for data that should be available when the phone wakes up
    func updateApplicationContext(_ context: [String: Any]) {
        guard let session = session else { return }
        do {
            try session.updateApplicationContext(context)
            print("[WatchConnectivity] Application context updated")
        } catch {
            print("[WatchConnectivity] Failed to update context: \(error.localizedDescription)")
        }
    }

    /// Transfers user info in the background (queued, guaranteed delivery)
    func transferUserInfo(_ userInfo: [String: Any]) {
        guard let session = session else { return }
        session.transferUserInfo(userInfo)
        print("[WatchConnectivity] User info transfer queued")
    }

    /// Transfers a file to the paired iPhone
    func transferFile(_ fileURL: URL, metadata: [String: Any]? = nil) {
        guard let session = session else { return }
        session.transferFile(fileURL, metadata: metadata)
        print("[WatchConnectivity] File transfer queued: \(fileURL.lastPathComponent)")
    }

    // MARK: - Message Queue

    private func enqueueMessage(_ message: WatchMessage) {
        if messageQueue.count >= maxQueueSize {
            pruneQueue()
        }
        messageQueue.append(message)
        print("[WatchConnectivity] Message queued (total: \(messageQueue.count))")
    }

    private func pruneQueue() {
        let now = Date().timeIntervalSince1970 * 1000
        messageQueue.removeAll { now - $0.timestamp > messageTTL * 1000 }
        if messageQueue.count >= maxQueueSize {
            messageQueue.removeFirst()
        }
    }

    /// Flushes all queued messages when the phone becomes reachable
    func flushQueue() {
        guard !isProcessingQueue, isReachable else { return }
        isProcessingQueue = true

        let now = Date().timeIntervalSince1970 * 1000
        var sent = 0
        var failed = 0

        while !messageQueue.isEmpty {
            let message = messageQueue.removeFirst()

            // Skip expired messages
            if now - message.timestamp > messageTTL * 1000 {
                failed += 1
                continue
            }

            let dict = encodeMessage(message)
            session?.sendMessage(dict, replyHandler: { _ in
                sent += 1
            }, errorHandler: { _ in
                failed += 1
            })
        }

        isProcessingQueue = false
        print("[WatchConnectivity] Queue flushed: \(sent) sent, \(failed) failed")
    }

    // MARK: - Ping

    private func sendPing() {
        guard isReachable else { return }
        sendMessage(type: .ping, payload: ["ts": Date().timeIntervalSince1970 * 1000])
    }

    // MARK: - Message Encoding

    private func createMessage(type: WatchMessageType, payload: [String: Any]) -> WatchMessage {
        return WatchMessage(
            id: "wm_\(Int(Date().timeIntervalSince1970 * 1000))_\(UUID().uuidString.prefix(7))",
            type: type,
            payload: payload.mapValues { AnyCodable($0) },
            timestamp: Date().timeIntervalSince1970 * 1000,
            compressed: false,
            retryCount: 0
        )
    }

    private func encodeMessage(_ message: WatchMessage) -> [String: Any] {
        return [
            "id": message.id,
            "type": message.type.rawValue,
            "payload": message.payload.mapValues { $0.value },
            "timestamp": message.timestamp,
            "compressed": message.compressed
        ]
    }
}

// MARK: - WCSessionDelegate

extension WatchConnectivityManager: WCSessionDelegate {

    func session(
        _ session: WCSession,
        activationDidCompleteWith activationState: WCSessionActivationState,
        error: Error?
    ) {
        if let error = error {
            print("[WatchConnectivity] Activation failed: \(error.localizedDescription)")
            connectionStatus = .disconnected
            return
        }

        switch activationState {
        case .activated:
            connectionStatus = session.isReachable ? .connected : .disconnected
            print("[WatchConnectivity] Session activated, reachable: \(session.isReachable)")
            if session.isReachable {
                flushQueue()
            }
        case .inactive:
            connectionStatus = .disconnected
        case .notActivated:
            connectionStatus = .disconnected
        @unknown default:
            connectionStatus = .unknown
        }

        DispatchQueue.main.async { [weak self] in
            self?.delegate?.connectionStatusDidChange(isReachable: session.isReachable)
        }
    }

    func sessionReachabilityDidChange(_ session: WCSession) {
        connectionStatus = session.isReachable ? .connected : .disconnected
        print("[WatchConnectivity] Reachability changed: \(session.isReachable)")

        DispatchQueue.main.async { [weak self] in
            self?.delegate?.connectionStatusDidChange(isReachable: session.isReachable)
        }

        if session.isReachable {
            flushQueue()
        }
    }

    func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
        handleIncomingMessage(message)
    }

    func session(
        _ session: WCSession,
        didReceiveMessage message: [String: Any],
        replyHandler: @escaping ([String: Any]) -> Void
    ) {
        handleIncomingMessage(message)
        replyHandler(["status": "received", "timestamp": Date().timeIntervalSince1970 * 1000])
    }

    func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String: Any]) {
        print("[WatchConnectivity] Received application context")
        if let config = applicationContext["config"] as? [String: Any] {
            DispatchQueue.main.async { [weak self] in
                self?.delegate?.didReceiveConfigUpdate(config: config)
            }
        }
    }

    func session(_ session: WCSession, didReceiveUserInfo userInfo: [String: Any]) {
        print("[WatchConnectivity] Received user info transfer")
        handleIncomingMessage(userInfo)
    }

    // MARK: - Message Handling

    private func handleIncomingMessage(_ message: [String: Any]) {
        guard let typeString = message["type"] as? String,
              let type = WatchMessageType(rawValue: typeString) else {
            print("[WatchConnectivity] Unknown message type")
            return
        }

        let payload = message["payload"] as? [String: Any] ?? [:]

        DispatchQueue.main.async { [weak self] in
            switch type {
            case .medicationReminder:
                let name = payload["medication"] as? String ?? ""
                let dosage = payload["dosage"] as? String ?? ""
                let scheduledTime = Date(
                    timeIntervalSince1970: (payload["scheduledTime"] as? TimeInterval ?? 0) / 1000
                )
                self?.delegate?.didReceiveMedicationReminder(
                    name: name, dosage: dosage, scheduledTime: scheduledTime
                )
                // Also trigger haptic feedback for medication reminder
                WKInterfaceDevice.current().play(.notification)

            case .cognitivePrompt:
                let prompt = payload["prompt"] as? String ?? ""
                let category = payload["category"] as? String ?? ""
                self?.delegate?.didReceiveCognitivePrompt(prompt: prompt, category: category)
                WKInterfaceDevice.current().play(.click)

            case .configUpdate:
                self?.delegate?.didReceiveConfigUpdate(config: payload)

            case .ping:
                // Respond with ack
                self?.sendMessage(type: .ack, payload: ["ts": Date().timeIntervalSince1970 * 1000])

            default:
                print("[WatchConnectivity] Unhandled message type: \(type)")
            }
        }
    }
}

// MARK: - Errors

enum WatchConnectivityError: Error, LocalizedError {
    case phoneNotReachable
    case sessionNotActivated
    case encodingFailed
    case messageTooLarge

    var errorDescription: String? {
        switch self {
        case .phoneNotReachable: return "The paired iPhone is not reachable"
        case .sessionNotActivated: return "WCSession has not been activated"
        case .encodingFailed: return "Failed to encode message payload"
        case .messageTooLarge: return "Message payload exceeds maximum size"
        }
    }
}

// MARK: - AnyCodable Helper

/// Type-erased Codable wrapper for dictionary values
struct AnyCodable: Codable {
    let value: Any

    init(_ value: Any) {
        self.value = value
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if let intVal = try? container.decode(Int.self) { value = intVal }
        else if let doubleVal = try? container.decode(Double.self) { value = doubleVal }
        else if let boolVal = try? container.decode(Bool.self) { value = boolVal }
        else if let stringVal = try? container.decode(String.self) { value = stringVal }
        else { value = "" }
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        if let intVal = value as? Int { try container.encode(intVal) }
        else if let doubleVal = value as? Double { try container.encode(doubleVal) }
        else if let boolVal = value as? Bool { try container.encode(boolVal) }
        else if let stringVal = value as? String { try container.encode(stringVal) }
    }
}
