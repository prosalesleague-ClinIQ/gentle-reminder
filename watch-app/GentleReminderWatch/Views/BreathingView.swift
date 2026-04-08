/**
 * BreathingView.swift
 *
 * Guided breathing exercise view with animated circle visualization.
 * Uses a 4-second breathe in, 4-second hold, 6-second breathe out rhythm
 * with haptic pulses on phase transitions and a round counter.
 *
 * Design: Calming color palette, large text labels (minimum 17pt),
 * smooth circle animation, and gentle haptic guidance suitable for
 * elderly users managing anxiety or stress.
 */

import SwiftUI
import WatchKit

// MARK: - Breathing Phase

enum BreathingPhase: String {
    case breatheIn = "Breathe In"
    case hold = "Hold"
    case breatheOut = "Breathe Out"
    case idle = "Ready"

    var duration: TimeInterval {
        switch self {
        case .breatheIn: return 4.0
        case .hold: return 4.0
        case .breatheOut: return 6.0
        case .idle: return 0
        }
    }

    var color: Color {
        switch self {
        case .breatheIn: return .cyan
        case .hold: return .blue
        case .breatheOut: return .teal
        case .idle: return .gray
        }
    }

    var circleScale: CGFloat {
        switch self {
        case .breatheIn: return 1.0
        case .hold: return 1.0
        case .breatheOut: return 0.4
        case .idle: return 0.5
        }
    }

    var next: BreathingPhase {
        switch self {
        case .breatheIn: return .hold
        case .hold: return .breatheOut
        case .breatheOut: return .breatheIn
        case .idle: return .breatheIn
        }
    }
}

// MARK: - BreathingView

struct BreathingView: View {

    @State private var phase: BreathingPhase = .idle
    @State private var isActive = false
    @State private var roundCount = 0
    @State private var secondsRemaining: Int = 0
    @State private var circleScale: CGFloat = 0.5

    private let totalRounds = 5
    private var phaseTimer: Timer? = nil

    var body: some View {
        VStack(spacing: 10) {
            if isActive {
                activeView
            } else {
                idleView
            }
        }
        .navigationTitle("Breathe")
    }

    // MARK: - Idle State

    private var idleView: some View {
        VStack(spacing: 16) {
            // Breathing circle (static)
            Circle()
                .fill(
                    RadialGradient(
                        colors: [.cyan.opacity(0.6), .blue.opacity(0.2)],
                        center: .center,
                        startRadius: 5,
                        endRadius: 50
                    )
                )
                .frame(width: 80, height: 80)
                .scaleEffect(0.5)

            Text("Guided Breathing")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(.white)

            Text("4-4-6 rhythm")
                .font(.system(size: 15))
                .foregroundColor(.white.opacity(0.6))

            Button {
                startBreathing()
            } label: {
                Text("Begin")
                    .font(.system(size: 18, weight: .bold))
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .tint(.cyan)
        }
        .padding()
    }

    // MARK: - Active State

    private var activeView: some View {
        VStack(spacing: 8) {
            // Round counter
            Text("Round \(roundCount)/\(totalRounds)")
                .font(.system(size: 15))
                .foregroundColor(.white.opacity(0.5))

            Spacer()

            // Animated breathing circle
            ZStack {
                // Outer glow
                Circle()
                    .fill(phase.color.opacity(0.15))
                    .frame(width: 120, height: 120)
                    .scaleEffect(circleScale * 1.2)

                // Main circle
                Circle()
                    .fill(
                        RadialGradient(
                            colors: [phase.color, phase.color.opacity(0.3)],
                            center: .center,
                            startRadius: 5,
                            endRadius: 55
                        )
                    )
                    .frame(width: 100, height: 100)
                    .scaleEffect(circleScale)

                // Timer text in center
                Text("\(secondsRemaining)")
                    .font(.system(size: 24, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                    .monospacedDigit()
            }
            .animation(.easeInOut(duration: phase.duration), value: circleScale)

            Spacer()

            // Phase label
            Text(phase.rawValue)
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(phase.color)
                .animation(.easeInOut(duration: 0.3), value: phase.rawValue)

            // Stop button
            Button {
                stopBreathing()
            } label: {
                Text("Stop")
                    .font(.system(size: 17))
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.bordered)
            .tint(.red.opacity(0.8))
            .padding(.top, 4)
        }
        .padding(.horizontal, 4)
    }

    // MARK: - Breathing Logic

    private func startBreathing() {
        isActive = true
        roundCount = 1
        transitionToPhase(.breatheIn)
        WKInterfaceDevice.current().play(.start)
    }

    private func stopBreathing() {
        isActive = false
        phase = .idle
        roundCount = 0
        circleScale = 0.5
        WKInterfaceDevice.current().play(.stop)
    }

    private func transitionToPhase(_ newPhase: BreathingPhase) {
        phase = newPhase
        secondsRemaining = Int(newPhase.duration)

        // Animate the circle
        withAnimation(.easeInOut(duration: newPhase.duration)) {
            circleScale = newPhase.circleScale
        }

        // Haptic pulse on transition
        WKInterfaceDevice.current().play(.click)

        // Countdown timer
        startCountdown(for: newPhase)
    }

    private func startCountdown(for currentPhase: BreathingPhase) {
        let duration = Int(currentPhase.duration)
        secondsRemaining = duration

        // Use a repeating 1-second timer for countdown
        var elapsed = 0
        Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { timer in
            elapsed += 1
            DispatchQueue.main.async {
                self.secondsRemaining = max(0, duration - elapsed)

                if elapsed >= duration {
                    timer.invalidate()
                    self.advancePhase()
                }
            }
        }
    }

    private func advancePhase() {
        guard isActive else { return }

        let next = phase.next

        // Check if we completed a full cycle (breatheOut -> breatheIn)
        if phase == .breatheOut {
            if roundCount >= totalRounds {
                // Exercise complete
                completeExercise()
                return
            }
            roundCount += 1
        }

        transitionToPhase(next)
    }

    private func completeExercise() {
        isActive = false
        phase = .idle
        circleScale = 0.5

        // Success haptic
        WKInterfaceDevice.current().play(.success)
    }
}

#if DEBUG
struct BreathingView_Previews: PreviewProvider {
    static var previews: some View {
        BreathingView()
    }
}
#endif
