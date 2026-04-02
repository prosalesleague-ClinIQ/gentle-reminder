/**
 * Validator.ts
 *
 * FHIR R4 resource validator for the Gentle Reminder platform.
 * Performs structural validation of FHIR resources including required
 * field checks, type validation, and code system verification.
 */

import type {
  FHIRResource,
  FHIRPatient,
  FHIRObservation,
  FHIRCondition,
  FHIRMedicationRequest,
  FHIRCarePlan,
  FHIRDiagnosticReport,
  FHIRBundle,
  FHIRCodeableConcept,
  FHIRReference,
  FHIRIdentifier,
  ValidationResult,
  ValidationError,
  ValidationWarning,
} from './types';

// ---------------------------------------------------------------------------
// Validator
// ---------------------------------------------------------------------------

export class Validator {
  private errors: ValidationError[] = [];
  private warnings: ValidationWarning[] = [];

  // -------------------------------------------------------------------------
  // Generic resource validation
  // -------------------------------------------------------------------------

  /**
   * Validates any FHIR resource by dispatching to the appropriate
   * resource-specific validator.
   */
  validateResource(resource: FHIRResource): ValidationResult {
    this.reset();

    if (!resource) {
      this.addError('', 'Resource is null or undefined');
      return this.result();
    }

    if (!resource.resourceType) {
      this.addError('resourceType', 'resourceType is required');
      return this.result();
    }

    // Common validations
    this.validateMeta(resource);

    // Resource-specific validation
    switch (resource.resourceType) {
      case 'Patient':
        this.validatePatient(resource as FHIRPatient);
        break;
      case 'Observation':
        this.validateObservation(resource as FHIRObservation);
        break;
      case 'Condition':
        this.validateCondition(resource as FHIRCondition);
        break;
      case 'MedicationRequest':
        this.validateMedicationRequest(resource as FHIRMedicationRequest);
        break;
      case 'CarePlan':
        this.validateCarePlan(resource as FHIRCarePlan);
        break;
      case 'DiagnosticReport':
        this.validateDiagnosticReport(resource as FHIRDiagnosticReport);
        break;
      case 'Bundle':
        this.validateBundle(resource as FHIRBundle);
        break;
      default:
        this.addWarning('resourceType', `No specific validator for resourceType "${resource.resourceType}"`);
    }

    return this.result();
  }

  // -------------------------------------------------------------------------
  // Patient validation
  // -------------------------------------------------------------------------

  validatePatient(patient: FHIRPatient): ValidationResult {
    this.reset();

    this.requireField(patient, 'resourceType', 'Patient');
    if (patient.resourceType !== 'Patient') {
      this.addError('resourceType', `Expected "Patient", got "${patient.resourceType}"`);
    }

    // Name
    if (!patient.name || patient.name.length === 0) {
      this.addWarning('name', 'Patient should have at least one name');
    } else {
      patient.name.forEach((name, i) => {
        if (!name.family && !name.text) {
          this.addWarning(`name[${i}]`, 'Name should have a family name or text');
        }
      });
    }

    // Gender
    if (patient.gender) {
      const validGenders = ['male', 'female', 'other', 'unknown'];
      if (!validGenders.includes(patient.gender)) {
        this.addError('gender', `Invalid gender "${patient.gender}". Must be one of: ${validGenders.join(', ')}`);
      }
    }

    // Birth date format
    if (patient.birthDate) {
      if (!this.isValidDate(patient.birthDate)) {
        this.addError('birthDate', `Invalid date format: "${patient.birthDate}". Expected YYYY-MM-DD`);
      }
    } else {
      this.addWarning('birthDate', 'Patient should have a birthDate');
    }

    // Identifiers
    if (patient.identifier) {
      patient.identifier.forEach((id, i) => {
        this.validateIdentifier(id, `identifier[${i}]`);
      });
    }

    // Telecom
    if (patient.telecom) {
      const validSystems = ['phone', 'fax', 'email', 'pager', 'url', 'sms', 'other'];
      patient.telecom.forEach((t, i) => {
        if (t.system && !validSystems.includes(t.system)) {
          this.addError(`telecom[${i}].system`, `Invalid system "${t.system}"`);
        }
        if (!t.value) {
          this.addWarning(`telecom[${i}].value`, 'Telecom should have a value');
        }
      });
    }

    // Address
    if (patient.address) {
      patient.address.forEach((addr, i) => {
        if (addr.use) {
          const validUses = ['home', 'work', 'temp', 'old', 'billing'];
          if (!validUses.includes(addr.use)) {
            this.addError(`address[${i}].use`, `Invalid address use "${addr.use}"`);
          }
        }
      });
    }

    return this.result();
  }

  // -------------------------------------------------------------------------
  // Observation validation
  // -------------------------------------------------------------------------

  validateObservation(observation: FHIRObservation): ValidationResult {
    this.reset();

    this.requireField(observation, 'resourceType', 'Observation');
    if (observation.resourceType !== 'Observation') {
      this.addError('resourceType', `Expected "Observation", got "${observation.resourceType}"`);
    }

    // Status (required)
    if (!observation.status) {
      this.addError('status', 'Observation.status is required');
    } else {
      const validStatuses = ['registered', 'preliminary', 'final', 'amended', 'corrected', 'cancelled', 'entered-in-error', 'unknown'];
      if (!validStatuses.includes(observation.status)) {
        this.addError('status', `Invalid status "${observation.status}"`);
      }
    }

    // Code (required)
    if (!observation.code) {
      this.addError('code', 'Observation.code is required');
    } else {
      this.validateCodeableConcept(observation.code, 'code');
    }

    // Subject
    if (!observation.subject) {
      this.addWarning('subject', 'Observation should reference a subject');
    } else {
      this.validateReference(observation.subject, 'subject');
    }

    // Must have a value or a dataAbsentReason
    const hasValue =
      observation.valueQuantity !== undefined ||
      observation.valueCodeableConcept !== undefined ||
      observation.valueString !== undefined ||
      observation.valueBoolean !== undefined ||
      observation.valueInteger !== undefined ||
      observation.valueRange !== undefined ||
      observation.valueRatio !== undefined ||
      observation.valueDateTime !== undefined ||
      observation.valuePeriod !== undefined;

    if (!hasValue && !observation.dataAbsentReason && (!observation.component || observation.component.length === 0)) {
      this.addWarning('value[x]', 'Observation should have a value, dataAbsentReason, or components');
    }

    // Effective date/period
    if (!observation.effectiveDateTime && !observation.effectivePeriod && !observation.effectiveInstant) {
      this.addWarning('effective[x]', 'Observation should have an effective date or period');
    }

    // Category coding validation
    if (observation.category) {
      observation.category.forEach((cat, i) => {
        this.validateCodeableConcept(cat, `category[${i}]`);
      });
    }

    // Components validation
    if (observation.component) {
      observation.component.forEach((comp, i) => {
        if (!comp.code) {
          this.addError(`component[${i}].code`, 'Component code is required');
        } else {
          this.validateCodeableConcept(comp.code, `component[${i}].code`);
        }
      });
    }

    return this.result();
  }

  // -------------------------------------------------------------------------
  // Condition validation
  // -------------------------------------------------------------------------

  private validateCondition(condition: FHIRCondition): void {
    // Subject is required
    if (!condition.subject) {
      this.addError('subject', 'Condition.subject is required');
    } else {
      this.validateReference(condition.subject, 'subject');
    }

    // Code
    if (!condition.code) {
      this.addWarning('code', 'Condition should have a code');
    } else {
      this.validateCodeableConcept(condition.code, 'code');
    }

    // Clinical status
    if (condition.clinicalStatus) {
      this.validateCodeableConcept(condition.clinicalStatus, 'clinicalStatus');
    }

    // Verification status
    if (condition.verificationStatus) {
      this.validateCodeableConcept(condition.verificationStatus, 'verificationStatus');
    }
  }

  // -------------------------------------------------------------------------
  // MedicationRequest validation
  // -------------------------------------------------------------------------

  private validateMedicationRequest(medReq: FHIRMedicationRequest): void {
    // Status (required)
    if (!medReq.status) {
      this.addError('status', 'MedicationRequest.status is required');
    } else {
      const valid = ['active', 'on-hold', 'cancelled', 'completed', 'entered-in-error', 'stopped', 'draft', 'unknown'];
      if (!valid.includes(medReq.status)) {
        this.addError('status', `Invalid status "${medReq.status}"`);
      }
    }

    // Intent (required)
    if (!medReq.intent) {
      this.addError('intent', 'MedicationRequest.intent is required');
    } else {
      const valid = ['proposal', 'plan', 'order', 'original-order', 'reflex-order', 'filler-order', 'instance-order', 'option'];
      if (!valid.includes(medReq.intent)) {
        this.addError('intent', `Invalid intent "${medReq.intent}"`);
      }
    }

    // Subject (required)
    if (!medReq.subject) {
      this.addError('subject', 'MedicationRequest.subject is required');
    }

    // Medication (must have one)
    if (!medReq.medicationCodeableConcept && !medReq.medicationReference) {
      this.addError('medication[x]', 'MedicationRequest must have medicationCodeableConcept or medicationReference');
    }

    // Dosage validation
    if (medReq.dosageInstruction) {
      medReq.dosageInstruction.forEach((d, i) => {
        if (!d.text && !d.doseAndRate) {
          this.addWarning(`dosageInstruction[${i}]`, 'Dosage should have text or doseAndRate');
        }
      });
    }
  }

  // -------------------------------------------------------------------------
  // CarePlan validation
  // -------------------------------------------------------------------------

  private validateCarePlan(carePlan: FHIRCarePlan): void {
    // Status (required)
    if (!carePlan.status) {
      this.addError('status', 'CarePlan.status is required');
    }

    // Intent (required)
    if (!carePlan.intent) {
      this.addError('intent', 'CarePlan.intent is required');
    }

    // Subject (required)
    if (!carePlan.subject) {
      this.addError('subject', 'CarePlan.subject is required');
    }

    // Activities
    if (carePlan.activity) {
      carePlan.activity.forEach((act, i) => {
        if (act.detail) {
          if (!act.detail.status) {
            this.addError(`activity[${i}].detail.status`, 'Activity detail status is required');
          }
        }
      });
    }

    // Title recommended
    if (!carePlan.title) {
      this.addWarning('title', 'CarePlan should have a title');
    }
  }

  // -------------------------------------------------------------------------
  // DiagnosticReport validation
  // -------------------------------------------------------------------------

  private validateDiagnosticReport(report: FHIRDiagnosticReport): void {
    // Status (required)
    if (!report.status) {
      this.addError('status', 'DiagnosticReport.status is required');
    }

    // Code (required)
    if (!report.code) {
      this.addError('code', 'DiagnosticReport.code is required');
    } else {
      this.validateCodeableConcept(report.code, 'code');
    }

    // Subject recommended
    if (!report.subject) {
      this.addWarning('subject', 'DiagnosticReport should reference a subject');
    }

    // Effective date recommended
    if (!report.effectiveDateTime && !report.effectivePeriod) {
      this.addWarning('effective[x]', 'DiagnosticReport should have an effective date or period');
    }
  }

  // -------------------------------------------------------------------------
  // Bundle validation
  // -------------------------------------------------------------------------

  private validateBundle(bundle: FHIRBundle): void {
    if (!bundle.type) {
      this.addError('type', 'Bundle.type is required');
    }

    if (bundle.entry) {
      bundle.entry.forEach((entry, i) => {
        if (entry.resource) {
          if (!entry.resource.resourceType) {
            this.addError(`entry[${i}].resource.resourceType`, 'Resource must have a resourceType');
          }
        }
        if (!entry.fullUrl) {
          this.addWarning(`entry[${i}].fullUrl`, 'Entry should have a fullUrl');
        }
      });
    }
  }

  // -------------------------------------------------------------------------
  // Sub-element validators
  // -------------------------------------------------------------------------

  private validateMeta(resource: FHIRResource): void {
    if (resource.meta?.lastUpdated) {
      if (!this.isValidDateTime(resource.meta.lastUpdated)) {
        this.addWarning('meta.lastUpdated', `Invalid datetime format: "${resource.meta.lastUpdated}"`);
      }
    }
  }

  private validateIdentifier(identifier: FHIRIdentifier, path: string): void {
    if (!identifier.value && !identifier.system) {
      this.addWarning(path, 'Identifier should have a value or system');
    }
    if (identifier.use) {
      const valid = ['usual', 'official', 'temp', 'secondary', 'old'];
      if (!valid.includes(identifier.use)) {
        this.addError(`${path}.use`, `Invalid identifier use "${identifier.use}"`);
      }
    }
  }

  private validateCodeableConcept(concept: FHIRCodeableConcept, path: string): void {
    if (!concept.coding && !concept.text) {
      this.addWarning(path, 'CodeableConcept should have coding or text');
    }
    if (concept.coding) {
      concept.coding.forEach((coding, i) => {
        if (!coding.code && !coding.display) {
          this.addWarning(`${path}.coding[${i}]`, 'Coding should have a code or display');
        }
      });
    }
  }

  private validateReference(ref: FHIRReference, path: string): void {
    if (!ref.reference && !ref.identifier && !ref.display) {
      this.addWarning(path, 'Reference should have a reference, identifier, or display');
    }
    if (ref.reference && !ref.reference.includes('/') && !ref.reference.startsWith('#') && !ref.reference.startsWith('urn:')) {
      this.addWarning(`${path}.reference`, `Reference "${ref.reference}" should be a relative URL, fragment, or URN`);
    }
  }

  // -------------------------------------------------------------------------
  // Utility methods
  // -------------------------------------------------------------------------

  private requireField(obj: any, field: string, expectedResourceType?: string): void {
    if (obj[field] === undefined || obj[field] === null) {
      this.addError(field, `${field} is required`);
    }
  }

  private isValidDate(date: string): boolean {
    return /^\d{4}(-\d{2}(-\d{2})?)?$/.test(date);
  }

  private isValidDateTime(dt: string): boolean {
    // ISO 8601 basic check
    return !isNaN(Date.parse(dt));
  }

  private addError(path: string, message: string): void {
    this.errors.push({ path, message, severity: 'error' });
  }

  private addWarning(path: string, message: string): void {
    this.warnings.push({ path, message, severity: 'warning' });
  }

  private reset(): void {
    this.errors = [];
    this.warnings = [];
  }

  private result(): ValidationResult {
    return {
      valid: this.errors.length === 0,
      errors: [...this.errors],
      warnings: [...this.warnings],
    };
  }
}

export default Validator;
