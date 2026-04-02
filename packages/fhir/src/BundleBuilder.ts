/**
 * BundleBuilder.ts
 *
 * Constructs FHIR R4 Bundles for various clinical workflows in the Gentle
 * Reminder platform. Supports patient bundles, cognitive report bundles,
 * medication bundles, and transaction bundles.
 */

import type {
  FHIRBundle,
  FHIRBundleEntry,
  FHIRResource,
  FHIRPatient,
  FHIRObservation,
  FHIRCondition,
  FHIRMedicationRequest,
  FHIRCarePlan,
  FHIRDiagnosticReport,
  FHIRReference,
  ValidationResult,
  InternalPatient,
  InternalCognitiveScore,
  InternalSession,
  InternalMedication,
} from './types';
import { PatientMapper } from './PatientMapper';
import { ObservationMapper } from './ObservationMapper';
import { MedicationMapper } from './MedicationMapper';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BUNDLE_PROFILE = 'http://hl7.org/fhir/StructureDefinition/Bundle';

// ---------------------------------------------------------------------------
// BundleBuilder
// ---------------------------------------------------------------------------

export class BundleBuilder {
  private patientMapper: PatientMapper;
  private observationMapper: ObservationMapper;
  private medicationMapper: MedicationMapper;

  constructor() {
    this.patientMapper = new PatientMapper();
    this.observationMapper = new ObservationMapper();
    this.medicationMapper = new MedicationMapper();
  }

  // -------------------------------------------------------------------------
  // Patient Bundle
  // -------------------------------------------------------------------------

  /**
   * Builds a comprehensive patient bundle containing the patient resource,
   * observations (cognitive scores, biomarkers), and conditions.
   */
  buildPatientBundle(
    patient: FHIRPatient,
    observations: FHIRObservation[],
    conditions: FHIRCondition[]
  ): FHIRBundle {
    const bundle = this.createBundle('collection');
    const patientRef: FHIRReference = {
      reference: `Patient/${patient.id}`,
      display: patient.name?.[0]?.text,
    };

    // Patient entry
    this.addEntry(bundle, patient, `urn:uuid:${patient.id}`);

    // Condition entries
    for (const condition of conditions) {
      condition.subject = patientRef;
      this.addEntry(bundle, condition, `urn:uuid:${condition.id ?? this.generateId()}`);
    }

    // Observation entries
    for (const obs of observations) {
      obs.subject = patientRef;
      this.addEntry(bundle, obs, `urn:uuid:${obs.id ?? this.generateId()}`);
    }

    bundle.total = bundle.entry?.length ?? 0;
    return bundle;
  }

  // -------------------------------------------------------------------------
  // Cognitive Report Bundle
  // -------------------------------------------------------------------------

  /**
   * Builds a bundle containing cognitive assessment results over a period.
   * Includes the patient, all score observations, and session observations.
   */
  buildCognitiveReportBundle(
    patient: InternalPatient,
    scores: InternalCognitiveScore[],
    sessions: InternalSession[]
  ): FHIRBundle {
    const bundle = this.createBundle('collection');
    const fhirPatient = this.patientMapper.mapToFHIRPatient(patient);
    const patientRef: FHIRReference = {
      reference: `Patient/${patient.id}`,
      display: `${patient.firstName} ${patient.lastName}`,
    };

    // Patient
    this.addEntry(bundle, fhirPatient, `urn:uuid:${patient.id}`);

    // Cognitive score observations
    for (const score of scores) {
      const obs = this.observationMapper.mapCognitiveScoreToObservation(score, patientRef);
      this.addEntry(bundle, obs, `urn:uuid:${score.id}`);
    }

    // Session observations
    for (const session of sessions) {
      const obs = this.observationMapper.mapSessionToObservation(session, patientRef);
      this.addEntry(bundle, obs, `urn:uuid:${session.id}`);
    }

    // Summary observation (aggregate)
    if (scores.length > 0) {
      const summaryObs = this.buildSummaryObservation(scores, patientRef);
      this.addEntry(bundle, summaryObs, `urn:uuid:summary_${patient.id}`);
    }

    bundle.total = bundle.entry?.length ?? 0;
    return bundle;
  }

  // -------------------------------------------------------------------------
  // Medication Bundle
  // -------------------------------------------------------------------------

  /**
   * Builds a bundle containing a patient and their medication requests.
   */
  buildMedicationBundle(
    patient: InternalPatient,
    medications: InternalMedication[]
  ): FHIRBundle {
    const bundle = this.createBundle('collection');
    const fhirPatient = this.patientMapper.mapToFHIRPatient(patient);
    const patientRef: FHIRReference = {
      reference: `Patient/${patient.id}`,
      display: `${patient.firstName} ${patient.lastName}`,
    };

    // Patient
    this.addEntry(bundle, fhirPatient, `urn:uuid:${patient.id}`);

    // Medication requests
    for (const med of medications) {
      const fhirMed = this.medicationMapper.mapToFHIRMedicationRequest(med, patientRef);
      this.addEntry(bundle, fhirMed, `urn:uuid:${med.id}`);
    }

    bundle.total = bundle.entry?.length ?? 0;
    return bundle;
  }

  // -------------------------------------------------------------------------
  // Transaction Bundle (for FHIR server submission)
  // -------------------------------------------------------------------------

  /**
   * Builds a transaction bundle for submitting multiple resources atomically.
   */
  buildTransactionBundle(resources: FHIRResource[]): FHIRBundle {
    const bundle = this.createBundle('transaction');

    for (const resource of resources) {
      const entry: FHIRBundleEntry = {
        fullUrl: `urn:uuid:${resource.id ?? this.generateId()}`,
        resource,
        request: {
          method: resource.id ? 'PUT' : 'POST',
          url: resource.id
            ? `${resource.resourceType}/${resource.id}`
            : resource.resourceType,
        },
      };
      bundle.entry!.push(entry);
    }

    bundle.total = bundle.entry?.length ?? 0;
    return bundle;
  }

  // -------------------------------------------------------------------------
  // Document Bundle
  // -------------------------------------------------------------------------

  /**
   * Builds a FHIR Document bundle with a Composition as the first entry.
   * Used for formal clinical documents (e.g., cognitive assessment report).
   */
  buildDocumentBundle(
    patient: FHIRPatient,
    title: string,
    sections: Array<{ title: string; text: string; entries: FHIRResource[] }>,
    author?: FHIRReference
  ): FHIRBundle {
    const bundle = this.createBundle('document');

    // Composition (required first entry in a document bundle)
    const composition: FHIRResource = {
      resourceType: 'Composition',
      id: this.generateId(),
      meta: { lastUpdated: new Date().toISOString() },
      status: 'final',
      type: {
        coding: [{
          system: 'http://loinc.org',
          code: '11488-4',
          display: 'Consult note',
        }],
      },
      subject: { reference: `Patient/${patient.id}` },
      date: new Date().toISOString(),
      title,
      author: author ? [author] : undefined,
      section: sections.map(s => ({
        title: s.title,
        text: { status: 'generated' as const, div: `<div xmlns="http://www.w3.org/1999/xhtml"><p>${s.text}</p></div>` },
        entry: s.entries.map(e => ({ reference: `${e.resourceType}/${e.id}` })),
      })),
    } as any;

    this.addEntry(bundle, composition, `urn:uuid:${composition.id}`);
    this.addEntry(bundle, patient, `urn:uuid:${patient.id}`);

    for (const section of sections) {
      for (const entry of section.entries) {
        this.addEntry(bundle, entry, `urn:uuid:${entry.id ?? this.generateId()}`);
      }
    }

    bundle.total = bundle.entry?.length ?? 0;
    return bundle;
  }

  // -------------------------------------------------------------------------
  // Entry management
  // -------------------------------------------------------------------------

  /**
   * Adds a resource entry to a bundle.
   */
  addEntry(bundle: FHIRBundle, resource: FHIRResource, fullUrl?: string): void {
    if (!bundle.entry) {
      bundle.entry = [];
    }

    const entry: FHIRBundleEntry = {
      fullUrl: fullUrl ?? `urn:uuid:${resource.id ?? this.generateId()}`,
      resource,
    };

    // For transaction bundles, add request
    if (bundle.type === 'transaction') {
      entry.request = {
        method: resource.id ? 'PUT' : 'POST',
        url: resource.id
          ? `${resource.resourceType}/${resource.id}`
          : resource.resourceType,
      };
    }

    bundle.entry.push(entry);
  }

  /**
   * Removes an entry from a bundle by resource ID.
   */
  removeEntry(bundle: FHIRBundle, resourceId: string): boolean {
    if (!bundle.entry) return false;
    const initialLength = bundle.entry.length;
    bundle.entry = bundle.entry.filter(e => e.resource?.id !== resourceId);
    if (bundle.total !== undefined) {
      bundle.total = bundle.entry.length;
    }
    return bundle.entry.length < initialLength;
  }

  /**
   * Finds an entry in a bundle by resource type and ID.
   */
  findEntry(bundle: FHIRBundle, resourceType: string, resourceId: string): FHIRBundleEntry | undefined {
    return bundle.entry?.find(
      e => e.resource?.resourceType === resourceType && e.resource?.id === resourceId
    );
  }

  // -------------------------------------------------------------------------
  // Validation
  // -------------------------------------------------------------------------

  /**
   * Validates basic bundle structure.
   */
  validateBundle(bundle: FHIRBundle): ValidationResult {
    const errors: ValidationResult['errors'] = [];
    const warnings: ValidationResult['warnings'] = [];

    if (bundle.resourceType !== 'Bundle') {
      errors.push({ path: 'resourceType', message: 'resourceType must be "Bundle"', severity: 'error' });
    }

    if (!bundle.type) {
      errors.push({ path: 'type', message: 'Bundle.type is required', severity: 'error' });
    }

    const validTypes = ['document', 'message', 'transaction', 'transaction-response', 'batch', 'batch-response', 'history', 'searchset', 'collection'];
    if (bundle.type && !validTypes.includes(bundle.type)) {
      errors.push({ path: 'type', message: `Invalid bundle type: ${bundle.type}`, severity: 'error' });
    }

    if (bundle.type === 'document') {
      if (!bundle.entry || bundle.entry.length === 0) {
        errors.push({ path: 'entry', message: 'Document bundles must have at least one entry', severity: 'error' });
      } else if (bundle.entry[0].resource?.resourceType !== 'Composition') {
        errors.push({ path: 'entry[0]', message: 'First entry in a document bundle must be a Composition', severity: 'error' });
      }
    }

    if (bundle.type === 'transaction' || bundle.type === 'batch') {
      bundle.entry?.forEach((entry, i) => {
        if (!entry.request) {
          errors.push({ path: `entry[${i}].request`, message: 'Transaction/batch entries must have a request', severity: 'error' });
        }
        if (entry.request && !entry.request.method) {
          errors.push({ path: `entry[${i}].request.method`, message: 'Request method is required', severity: 'error' });
        }
        if (entry.request && !entry.request.url) {
          errors.push({ path: `entry[${i}].request.url`, message: 'Request URL is required', severity: 'error' });
        }
      });
    }

    // Check for duplicate IDs
    const ids = new Set<string>();
    bundle.entry?.forEach((entry, i) => {
      const id = entry.resource?.id;
      if (id) {
        if (ids.has(id)) {
          warnings.push({ path: `entry[${i}].resource.id`, message: `Duplicate resource ID: ${id}`, severity: 'warning' });
        }
        ids.add(id);
      }
    });

    // Check fullUrl presence
    bundle.entry?.forEach((entry, i) => {
      if (!entry.fullUrl) {
        warnings.push({ path: `entry[${i}].fullUrl`, message: 'Entry missing fullUrl', severity: 'warning' });
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------

  private createBundle(type: FHIRBundle['type']): FHIRBundle {
    return {
      resourceType: 'Bundle',
      id: this.generateId(),
      meta: {
        lastUpdated: new Date().toISOString(),
        profile: [BUNDLE_PROFILE],
      },
      type,
      timestamp: new Date().toISOString(),
      entry: [],
    };
  }

  private buildSummaryObservation(
    scores: InternalCognitiveScore[],
    patientRef: FHIRReference
  ): FHIRObservation {
    const avgScore = scores.reduce((s, sc) => s + (sc.maxScore > 0 ? sc.score / sc.maxScore : 0), 0) / scores.length;
    const domains = [...new Set(scores.map(s => s.domain))];

    return {
      resourceType: 'Observation',
      id: `summary_${Date.now()}`,
      status: 'final',
      category: [{
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/observation-category',
          code: 'survey',
          display: 'Survey',
        }],
      }],
      code: {
        coding: [{
          system: 'https://gentlereminder.health/observation-type',
          code: 'cognitive-summary',
          display: 'Cognitive Assessment Summary',
        }],
        text: 'Cognitive Assessment Summary',
      },
      subject: patientRef,
      effectiveDateTime: new Date().toISOString(),
      valueQuantity: {
        value: Math.round(avgScore * 1000) / 10,
        unit: '%',
        system: 'http://unitsofmeasure.org',
        code: '%',
      },
      component: domains.map(domain => {
        const domainScores = scores.filter(s => s.domain === domain);
        const domainAvg = domainScores.reduce((s, sc) => s + sc.score, 0) / domainScores.length;
        return {
          code: {
            coding: [{
              system: 'https://gentlereminder.health/cognitive-domain',
              code: domain,
              display: `${domain} domain average`,
            }],
          },
          valueQuantity: {
            value: Math.round(domainAvg * 100) / 100,
            unit: '{score}',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
        };
      }),
      note: [{
        text: `Summary of ${scores.length} cognitive assessments across ${domains.length} domains`,
      }],
    };
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  }
}

export default BundleBuilder;
