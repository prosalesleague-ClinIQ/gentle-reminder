/**
 * ComplicationViews.swift
 *
 * ClockKit complications for the Gentle Reminder Watch app.
 * Provides three complication families:
 *  - Circular: Current heart rate display
 *  - Modular Large: Next medication time and name
 *  - Graphic Corner: Cognitive score gauge
 *
 * These complications surface critical health and medication data
 * directly on the watch face for quick glanceability.
 */

import ClockKit
import SwiftUI

// MARK: - Complication Data Source

final class ComplicationController: NSObject, CLKComplicationDataSource {

    // MARK: - Supported Families

    func getComplicationDescriptors(handler: @escaping ([CLKComplicationDescriptor]) -> Void) {
        let descriptors = [
            CLKComplicationDescriptor(
                identifier: "heartRate",
                displayName: "Heart Rate",
                supportedFamilies: [
                    .circularSmall,
                    .graphicCircular,
                    .utilitarianSmall,
                ]
            ),
            CLKComplicationDescriptor(
                identifier: "nextMedication",
                displayName: "Next Medication",
                supportedFamilies: [
                    .modularLarge,
                    .graphicRectangular,
                    .utilitarianLarge,
                ]
            ),
            CLKComplicationDescriptor(
                identifier: "cognitiveScore",
                displayName: "Cognitive Score",
                supportedFamilies: [
                    .graphicCorner,
                    .graphicCircular,
                ]
            ),
        ]
        handler(descriptors)
    }

    // MARK: - Timeline

    func getCurrentTimelineEntry(
        for complication: CLKComplication,
        withHandler handler: @escaping (CLKComplicationTimelineEntry?) -> Void
    ) {
        let entry = createTimelineEntry(for: complication, date: Date())
        handler(entry)
    }

    func getTimelineEntries(
        for complication: CLKComplication,
        after date: Date,
        limit: Int,
        withHandler handler: @escaping ([CLKComplicationTimelineEntry]?) -> Void
    ) {
        // Provide entries for the next few hours for medication times
        handler(nil)
    }

    func getTimelineEndDate(
        for complication: CLKComplication,
        withHandler handler: @escaping (Date?) -> Void
    ) {
        handler(Date(timeIntervalSinceNow: 86400)) // 24 hours
    }

    func getPrivacyBehavior(
        for complication: CLKComplication,
        withHandler handler: @escaping (CLKComplicationPrivacyBehavior) -> Void
    ) {
        handler(.showOnLockScreen)
    }

    // MARK: - Template Creation

    func getLocalizableSampleTemplate(
        for complication: CLKComplication,
        withHandler handler: @escaping (CLKComplicationTemplate?) -> Void
    ) {
        let template = createTemplate(for: complication, heartRate: 72, medicationName: "Donepezil", medicationTime: "8:00 AM", cognitiveScore: 85)
        handler(template)
    }

    // MARK: - Entry Creation

    private func createTimelineEntry(
        for complication: CLKComplication,
        date: Date
    ) -> CLKComplicationTimelineEntry? {
        // Read current values from UserDefaults (shared with the app)
        let defaults = UserDefaults.standard
        let heartRate = defaults.double(forKey: "complication.heartRate")
        let medName = defaults.string(forKey: "complication.nextMedName") ?? ""
        let medTime = defaults.string(forKey: "complication.nextMedTime") ?? ""
        let cogScore = defaults.integer(forKey: "complication.cognitiveScore")

        guard let template = createTemplate(
            for: complication,
            heartRate: heartRate > 0 ? heartRate : 72,
            medicationName: medName.isEmpty ? "--" : medName,
            medicationTime: medTime.isEmpty ? "--:--" : medTime,
            cognitiveScore: cogScore > 0 ? cogScore : 0
        ) else {
            return nil
        }

        return CLKComplicationTimelineEntry(date: date, complicationTemplate: template)
    }

    private func createTemplate(
        for complication: CLKComplication,
        heartRate: Double,
        medicationName: String,
        medicationTime: String,
        cognitiveScore: Int
    ) -> CLKComplicationTemplate? {

        switch complication.family {

        // MARK: - Circular Small (Heart Rate)
        case .circularSmall:
            return createCircularHeartRate(bpm: Int(heartRate))

        // MARK: - Graphic Circular (Heart Rate or Cognitive Score)
        case .graphicCircular:
            if complication.identifier == "cognitiveScore" {
                return createGraphicCircularCognitiveScore(score: cognitiveScore)
            }
            return createGraphicCircularHeartRate(bpm: Int(heartRate))

        // MARK: - Modular Large (Next Medication)
        case .modularLarge:
            return createModularLargeMedication(name: medicationName, time: medicationTime)

        // MARK: - Graphic Rectangular (Next Medication)
        case .graphicRectangular:
            return createGraphicRectangularMedication(name: medicationName, time: medicationTime)

        // MARK: - Graphic Corner (Cognitive Score)
        case .graphicCorner:
            return createGraphicCornerCognitiveScore(score: cognitiveScore)

        // MARK: - Utilitarian Small (Heart Rate)
        case .utilitarianSmall:
            return createUtilitarianSmallHeartRate(bpm: Int(heartRate))

        // MARK: - Utilitarian Large (Next Medication)
        case .utilitarianLarge:
            return createUtilitarianLargeMedication(name: medicationName, time: medicationTime)

        default:
            return nil
        }
    }

    // MARK: - Heart Rate Templates

    private func createCircularHeartRate(bpm: Int) -> CLKComplicationTemplate {
        let template = CLKComplicationTemplateCircularSmallStackText()
        template.line1TextProvider = CLKSimpleTextProvider(text: "\(bpm)")
        template.line2TextProvider = CLKSimpleTextProvider(text: "BPM")
        return template
    }

    private func createGraphicCircularHeartRate(bpm: Int) -> CLKComplicationTemplate {
        let template = CLKComplicationTemplateGraphicCircularStackText()
        template.line1TextProvider = CLKSimpleTextProvider(text: "\(bpm)")
        template.line2TextProvider = CLKSimpleTextProvider(text: "BPM")
        return template
    }

    private func createUtilitarianSmallHeartRate(bpm: Int) -> CLKComplicationTemplate {
        let template = CLKComplicationTemplateUtilitarianSmallFlat()
        template.textProvider = CLKSimpleTextProvider(text: "\(bpm) BPM")
        template.imageProvider = CLKImageProvider(
            onePieceImage: UIImage(systemName: "heart.fill")!
        )
        return template
    }

    // MARK: - Medication Templates

    private func createModularLargeMedication(name: String, time: String) -> CLKComplicationTemplate {
        let template = CLKComplicationTemplateModularLargeStandardBody()
        template.headerTextProvider = CLKSimpleTextProvider(text: "Next Medication")
        template.body1TextProvider = CLKSimpleTextProvider(text: name)
        template.body2TextProvider = CLKSimpleTextProvider(text: time)
        template.headerImageProvider = CLKImageProvider(
            onePieceImage: UIImage(systemName: "pills.fill")!
        )
        return template
    }

    private func createGraphicRectangularMedication(name: String, time: String) -> CLKComplicationTemplate {
        let template = CLKComplicationTemplateGraphicRectangularStandardBody()
        template.headerTextProvider = CLKSimpleTextProvider(text: "Next Medication")
        template.body1TextProvider = CLKSimpleTextProvider(text: name)
        template.body2TextProvider = CLKSimpleTextProvider(text: time)
        template.headerImageProvider = CLKFullColorImageProvider(
            fullColorImage: UIImage(systemName: "pills.fill")!
        )
        return template
    }

    private func createUtilitarianLargeMedication(name: String, time: String) -> CLKComplicationTemplate {
        let template = CLKComplicationTemplateUtilitarianLargeFlat()
        template.textProvider = CLKSimpleTextProvider(text: "\(time) \(name)")
        template.imageProvider = CLKImageProvider(
            onePieceImage: UIImage(systemName: "pills")!
        )
        return template
    }

    // MARK: - Cognitive Score Templates

    private func createGraphicCornerCognitiveScore(score: Int) -> CLKComplicationTemplate {
        let fraction = Float(score) / 100.0
        let gaugeProvider = CLKSimpleGaugeProvider(
            style: .fill,
            gaugeColor: gaugeColor(for: score),
            fillFraction: fraction
        )

        let template = CLKComplicationTemplateGraphicCornerGaugeText()
        template.outerTextProvider = CLKSimpleTextProvider(text: "\(score)")
        template.leadingTextProvider = CLKSimpleTextProvider(text: "0")
        template.trailingTextProvider = CLKSimpleTextProvider(text: "100")
        template.gaugeProvider = gaugeProvider
        return template
    }

    private func createGraphicCircularCognitiveScore(score: Int) -> CLKComplicationTemplate {
        let fraction = Float(score) / 100.0
        let gaugeProvider = CLKSimpleGaugeProvider(
            style: .ring,
            gaugeColor: gaugeColor(for: score),
            fillFraction: fraction
        )

        let template = CLKComplicationTemplateGraphicCircularClosedGaugeText()
        template.centerTextProvider = CLKSimpleTextProvider(text: "\(score)")
        template.gaugeProvider = gaugeProvider
        return template
    }

    // MARK: - Helpers

    private func gaugeColor(for score: Int) -> UIColor {
        switch score {
        case 80...100: return .systemGreen
        case 60..<80: return .systemYellow
        case 40..<60: return .systemOrange
        default: return .systemRed
        }
    }
}

// MARK: - SwiftUI Complication Views (WidgetKit-style for watchOS 9+)

/// Heart rate circular complication view
struct HeartRateComplicationView: View {
    let bpm: Int

    var body: some View {
        VStack(spacing: 0) {
            Image(systemName: "heart.fill")
                .font(.system(size: 12))
                .foregroundColor(.red)
            Text("\(bpm)")
                .font(.system(size: 18, weight: .bold, design: .rounded))
                .foregroundColor(.white)
                .monospacedDigit()
        }
    }
}

/// Medication modular large complication view
struct MedicationComplicationView: View {
    let name: String
    let time: String

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(spacing: 4) {
                Image(systemName: "pills.fill")
                    .font(.system(size: 14))
                    .foregroundColor(.cyan)
                Text("Next Medication")
                    .font(.system(size: 14))
                    .foregroundColor(.white.opacity(0.6))
            }
            Text(name)
                .font(.system(size: 17, weight: .semibold))
                .foregroundColor(.white)
            Text(time)
                .font(.system(size: 15))
                .foregroundColor(.cyan)
        }
    }
}

/// Cognitive score gauge complication view
struct CognitiveScoreComplicationView: View {
    let score: Int

    var body: some View {
        Gauge(value: Double(score), in: 0...100) {
            Image(systemName: "brain.head.profile")
                .foregroundColor(.purple)
        } currentValueLabel: {
            Text("\(score)")
                .font(.system(size: 14, weight: .bold, design: .rounded))
        }
        .gaugeStyle(.accessoryCircular)
        .tint(gaugeGradient)
    }

    private var gaugeGradient: Gradient {
        Gradient(colors: [.red, .orange, .yellow, .green])
    }
}
