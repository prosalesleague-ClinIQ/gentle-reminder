import {
  ExportConfig,
  DeidentifiedRecord,
  CognitiveScoreEntry,
} from './types';

const CSV_HEADERS = [
  'subject_id',
  'date',
  'cognitive_score',
  'orientation',
  'identity',
  'memory',
  'response_time_ms',
  'session_duration',
];

/**
 * Exports clinical data in CSV, JSON, or FHIR format.
 */
export class DataExporter {
  /**
   * Export de-identified records to CSV format.
   * Each score entry becomes a row.
   */
  static exportToCSV(data: DeidentifiedRecord[], config: ExportConfig): string {
    const filtered = DataExporter.filterByConfig(data, config);
    const lines: string[] = [CSV_HEADERS.join(',')];

    for (const record of filtered) {
      for (const score of record.scores) {
        if (config.dateRange && !DataExporter.isInDateRange(score.date, config.dateRange)) {
          continue;
        }
        lines.push(
          [
            record.subjectId,
            score.date,
            score.overallScore,
            score.orientation ?? '',
            score.identity ?? '',
            score.memory ?? '',
            score.responseTimeMs ?? '',
            score.sessionDurationMs ?? '',
          ].join(',')
        );
      }
    }

    return lines.join('\n');
  }

  /**
   * Export de-identified records to JSON format.
   */
  static exportToJSON(data: DeidentifiedRecord[], config: ExportConfig): string {
    const filtered = DataExporter.filterByConfig(data, config);
    const output = filtered.map((record) => {
      const scores = config.dateRange
        ? record.scores.filter((s) => DataExporter.isInDateRange(s.date, config.dateRange!))
        : record.scores;

      return {
        subjectId: record.subjectId,
        age: record.age,
        gender: record.gender,
        cognitiveStage: record.cognitiveStage,
        scores,
        ...(config.includeRaw ? { biomarkers: record.biomarkers } : {}),
      };
    });

    return JSON.stringify(output, null, 2);
  }

  /**
   * Export de-identified records as FHIR Observation resource scaffolds.
   * Returns a FHIR Bundle containing Observation resources.
   */
  static exportToFHIR(
    data: DeidentifiedRecord[],
    config: ExportConfig
  ): object {
    const filtered = DataExporter.filterByConfig(data, config);
    const entries: object[] = [];

    for (const record of filtered) {
      for (const score of record.scores) {
        if (config.dateRange && !DataExporter.isInDateRange(score.date, config.dateRange)) {
          continue;
        }
        entries.push({
          resource: {
            resourceType: 'Observation',
            status: 'final',
            category: [
              {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                    code: 'survey',
                    display: 'Survey',
                  },
                ],
              },
            ],
            code: {
              coding: [
                {
                  system: 'http://gentle-reminder.health/cognitive-assessment',
                  code: 'cognitive-score',
                  display: 'Cognitive Assessment Score',
                },
              ],
            },
            subject: {
              reference: `Patient/${record.subjectId}`,
            },
            effectiveDateTime: score.date,
            valueQuantity: {
              value: score.overallScore,
              unit: 'score',
              system: 'http://gentle-reminder.health/units',
            },
            component: DataExporter.buildFHIRComponents(score),
          },
        });
      }
    }

    return {
      resourceType: 'Bundle',
      type: 'collection',
      total: entries.length,
      entry: entries,
    };
  }

  private static buildFHIRComponents(score: CognitiveScoreEntry): object[] {
    const components: object[] = [];

    if (score.orientation !== undefined) {
      components.push({
        code: { text: 'orientation' },
        valueQuantity: { value: score.orientation, unit: 'score' },
      });
    }
    if (score.identity !== undefined) {
      components.push({
        code: { text: 'identity' },
        valueQuantity: { value: score.identity, unit: 'score' },
      });
    }
    if (score.memory !== undefined) {
      components.push({
        code: { text: 'memory' },
        valueQuantity: { value: score.memory, unit: 'score' },
      });
    }
    if (score.responseTimeMs !== undefined) {
      components.push({
        code: { text: 'response_time' },
        valueQuantity: { value: score.responseTimeMs, unit: 'ms' },
      });
    }

    return components;
  }

  private static filterByConfig(
    data: DeidentifiedRecord[],
    config: ExportConfig
  ): DeidentifiedRecord[] {
    if (config.patientIds && config.patientIds.length > 0) {
      return data.filter((r) => config.patientIds.includes(r.subjectId));
    }
    return data;
  }

  private static isInDateRange(
    dateStr: string,
    range: { start: Date; end: Date }
  ): boolean {
    const date = new Date(dateStr);
    return date >= range.start && date <= range.end;
  }
}
