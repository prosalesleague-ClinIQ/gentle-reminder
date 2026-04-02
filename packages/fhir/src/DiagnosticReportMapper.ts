/**
 * DiagnosticReportMapper.ts
 *
 * Builds FHIR R4 DiagnosticReport resources for cognitive assessments
 * and decline trend reports. Uses SNOMED CT codes for dementia subtypes
 * and LOINC codes for cognitive assessment panels.
 */

import type {
  FHIRDiagnosticReport,
  FHIRReference,
  FHIRCodeableConcept,
  FHIRObservation,
  FHIRPeriod,
  InternalCognitiveScore,
} from './types';
import { LOINC_CODES, SNOMED_CODES } from './types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LOINC_SYSTEM = 'http://loinc.org';
const SNOMED_SYSTEM = 'http://snomed.info/sct';
const DIAGNOSTIC_CATEGORY_SYSTEM = 'http://terminology.hl7.org/CodeSystem/v2-0074';
const GENTLE_REMINDER_SYSTEM = 'https://gentlereminder.health';

// Dementia subtype SNOMED codes for diagnostic conclusions
const DEMENTIA_SUBTYPES: Record<string, { code: string; display: string }> = {
  alzheimers: SNOMED_CODES.ALZHEIMERS_DISEASE,
  vascular: SNOMED_CODES.VASCULAR_DEMENTIA,
  lewy_body: SNOMED_CODES.LEWY_BODY_DEMENTIA,
  frontotemporal: SNOMED_CODES.FRONTOTEMPORAL_DEMENTIA,
  mixed: SNOMED_CODES.MIXED_DEMENTIA,
  unspecified: SNOMED_CODES.DEMENTIA_UNSPECIFIED,
  mci: SNOMED_CODES.MILD_COGNITIVE_IMPAIRMENT,
};

// Severity SNOMED codes
const SEVERITY_CODES: Record<string, { code: string; display: string }> = {
  mild: SNOMED_CODES.MILD,
  moderate: SNOMED_CODES.MODERATE,
  severe: SNOMED_CODES.SEVERE,
};

// ---------------------------------------------------------------------------
// Trend Analysis Types
// ---------------------------------------------------------------------------

export interface CognitiveTrend {
  domain: string;
  direction: 'improving' | 'stable' | 'declining';
  slopePerMonth: number;
  significance: boolean;
  startScore: number;
  endScore: number;
  periodMonths: number;
}

// ---------------------------------------------------------------------------
// DiagnosticReportMapper
// ---------------------------------------------------------------------------

export class DiagnosticReportMapper {

  /**
   * Builds a FHIR DiagnosticReport for a cognitive assessment session.
   * Includes all observation results and a narrative conclusion.
   */
  buildCognitiveAssessmentReport(
    patientRef: FHIRReference,
    scores: InternalCognitiveScore[],
    period: FHIRPeriod,
    observationRefs?: FHIRReference[]
  ): FHIRDiagnosticReport {
    const report: FHIRDiagnosticReport = {
      resourceType: 'DiagnosticReport',
      id: `report_cog_${Date.now()}`,
      meta: {
        lastUpdated: new Date().toISOString(),
        profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-diagnosticreport-note'],
      },
      identifier: [
        {
          system: `${GENTLE_REMINDER_SYSTEM}/report-id`,
          value: `report_cog_${Date.now()}`,
        },
      ],
      status: 'final',
      category: [
        {
          coding: [{
            system: DIAGNOSTIC_CATEGORY_SYSTEM,
            code: 'NRS',
            display: 'Neurology',
          }],
        },
        {
          coding: [{
            system: `${GENTLE_REMINDER_SYSTEM}/report-category`,
            code: 'cognitive-assessment',
            display: 'Cognitive Assessment Report',
          }],
        },
      ],
      code: {
        coding: [{
          system: LOINC_SYSTEM,
          code: '11488-4',
          display: 'Consult note',
        }, {
          system: `${GENTLE_REMINDER_SYSTEM}/report-type`,
          code: 'cognitive-assessment-report',
          display: 'Cognitive Assessment Report',
        }],
        text: 'Cognitive Assessment Report',
      },
      subject: patientRef,
      effectivePeriod: period,
      issued: new Date().toISOString(),
    };

    // Add observation results
    if (observationRefs && observationRefs.length > 0) {
      report.result = observationRefs;
    } else if (scores.length > 0) {
      report.result = scores.map(s => ({
        reference: `Observation/${s.id}`,
        display: `${s.domain} score: ${s.score}/${s.maxScore}`,
      }));
    }

    // Build narrative conclusion
    const conclusion = this.buildCognitiveConclusion(scores);
    report.conclusion = conclusion.text;
    report.conclusionCode = conclusion.codes;

    return report;
  }

  /**
   * Builds a FHIR DiagnosticReport for cognitive decline trends.
   * Analyzes score trajectories over time and generates clinical conclusions.
   */
  buildDeclineReport(
    patientRef: FHIRReference,
    trends: CognitiveTrend[],
    period: FHIRPeriod,
    dementiaSubtype?: string
  ): FHIRDiagnosticReport {
    const report: FHIRDiagnosticReport = {
      resourceType: 'DiagnosticReport',
      id: `report_decline_${Date.now()}`,
      meta: {
        lastUpdated: new Date().toISOString(),
      },
      identifier: [
        {
          system: `${GENTLE_REMINDER_SYSTEM}/report-id`,
          value: `report_decline_${Date.now()}`,
        },
      ],
      status: 'final',
      category: [
        {
          coding: [{
            system: DIAGNOSTIC_CATEGORY_SYSTEM,
            code: 'NRS',
            display: 'Neurology',
          }],
        },
        {
          coding: [{
            system: `${GENTLE_REMINDER_SYSTEM}/report-category`,
            code: 'cognitive-trend',
            display: 'Cognitive Trend Analysis',
          }],
        },
      ],
      code: {
        coding: [{
          system: LOINC_SYSTEM,
          code: '11488-4',
          display: 'Consult note',
        }, {
          system: `${GENTLE_REMINDER_SYSTEM}/report-type`,
          code: 'cognitive-decline-report',
          display: 'Cognitive Decline Trend Report',
        }],
        text: 'Cognitive Decline Trend Report',
      },
      subject: patientRef,
      effectivePeriod: period,
      issued: new Date().toISOString(),
    };

    // Build decline conclusion
    const conclusion = this.buildDeclineConclusion(trends, dementiaSubtype);
    report.conclusion = conclusion.text;
    report.conclusionCode = conclusion.codes;

    return report;
  }

  // -------------------------------------------------------------------------
  // Conclusion builders
  // -------------------------------------------------------------------------

  private buildCognitiveConclusion(
    scores: InternalCognitiveScore[]
  ): { text: string; codes: FHIRCodeableConcept[] } {
    if (scores.length === 0) {
      return { text: 'No cognitive assessment data available.', codes: [] };
    }

    const domains = [...new Set(scores.map(s => s.domain))];
    const overallScores = scores.filter(s => s.domain === 'overall');
    const latestOverall = overallScores.length > 0
      ? overallScores.reduce((latest, s) => s.date > latest.date ? s : latest)
      : null;

    const parts: string[] = [];
    parts.push(`Cognitive assessment covering ${domains.length} domain(s): ${domains.join(', ')}.`);

    if (latestOverall) {
      const pct = Math.round((latestOverall.score / latestOverall.maxScore) * 100);
      parts.push(`Overall score: ${latestOverall.score}/${latestOverall.maxScore} (${pct}%) on ${latestOverall.instrument}.`);
    }

    // Domain-specific summaries
    for (const domain of domains) {
      if (domain === 'overall') continue;
      const domainScores = scores.filter(s => s.domain === domain);
      const latest = domainScores.reduce((l, s) => s.date > l.date ? s : l);
      const pct = latest.maxScore > 0 ? Math.round((latest.score / latest.maxScore) * 100) : 0;
      parts.push(`${domain}: ${latest.score}/${latest.maxScore} (${pct}%).`);
    }

    // Severity classification
    const codes: FHIRCodeableConcept[] = [];
    if (latestOverall) {
      const ratio = latestOverall.score / latestOverall.maxScore;
      if (ratio >= 0.85) {
        codes.push(this.buildSnomedConcept(SNOMED_CODES.MILD_COGNITIVE_IMPAIRMENT));
        parts.push('Findings consistent with normal to mild cognitive impairment.');
      } else if (ratio >= 0.6) {
        codes.push(this.buildSnomedConcept(SNOMED_CODES.MILD_COGNITIVE_IMPAIRMENT));
        codes.push(this.buildSnomedConcept(SEVERITY_CODES.mild));
        parts.push('Findings suggestive of mild cognitive impairment.');
      } else if (ratio >= 0.4) {
        codes.push(this.buildSnomedConcept(SNOMED_CODES.DEMENTIA_UNSPECIFIED));
        codes.push(this.buildSnomedConcept(SEVERITY_CODES.moderate));
        parts.push('Findings suggestive of moderate cognitive impairment.');
      } else {
        codes.push(this.buildSnomedConcept(SNOMED_CODES.DEMENTIA_UNSPECIFIED));
        codes.push(this.buildSnomedConcept(SEVERITY_CODES.severe));
        parts.push('Findings suggestive of severe cognitive impairment.');
      }
    }

    return { text: parts.join(' '), codes };
  }

  private buildDeclineConclusion(
    trends: CognitiveTrend[],
    dementiaSubtype?: string
  ): { text: string; codes: FHIRCodeableConcept[] } {
    const codes: FHIRCodeableConcept[] = [];
    const parts: string[] = [];

    if (trends.length === 0) {
      return { text: 'Insufficient data for trend analysis.', codes: [] };
    }

    const declining = trends.filter(t => t.direction === 'declining' && t.significance);
    const stable = trends.filter(t => t.direction === 'stable');
    const improving = trends.filter(t => t.direction === 'improving' && t.significance);

    parts.push(`Trend analysis over ${trends[0].periodMonths} month(s) across ${trends.length} domain(s).`);

    if (declining.length > 0) {
      parts.push(`Significant decline detected in: ${declining.map(t => t.domain).join(', ')}.`);
      for (const t of declining) {
        const monthlyPct = Math.abs(t.slopePerMonth);
        parts.push(`${t.domain}: declined ${monthlyPct.toFixed(1)}%/month (${t.startScore} -> ${t.endScore}).`);
      }
    }

    if (stable.length > 0) {
      parts.push(`Stable performance in: ${stable.map(t => t.domain).join(', ')}.`);
    }

    if (improving.length > 0) {
      parts.push(`Improvement detected in: ${improving.map(t => t.domain).join(', ')}.`);
    }

    // Add dementia subtype code
    if (dementiaSubtype) {
      const subtype = DEMENTIA_SUBTYPES[dementiaSubtype.toLowerCase()];
      if (subtype) {
        codes.push(this.buildSnomedConcept(subtype));
      }
    }

    // Overall assessment
    if (declining.length > stable.length + improving.length) {
      parts.push('Overall cognitive trajectory shows progressive decline. Consider care plan adjustment.');
    } else if (improving.length > declining.length) {
      parts.push('Overall cognitive trajectory shows positive response to interventions.');
    } else {
      parts.push('Cognitive function remains relatively stable.');
    }

    return { text: parts.join(' '), codes };
  }

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  private buildSnomedConcept(entry: { code: string; display: string }): FHIRCodeableConcept {
    return {
      coding: [{
        system: SNOMED_SYSTEM,
        code: entry.code,
        display: entry.display,
      }],
      text: entry.display,
    };
  }
}

export default DiagnosticReportMapper;
