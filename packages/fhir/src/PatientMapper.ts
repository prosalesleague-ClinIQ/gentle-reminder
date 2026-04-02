/**
 * PatientMapper.ts
 *
 * Bidirectional mapper between the Gentle Reminder internal Patient model
 * and the FHIR R4 Patient resource. Handles all transformations including
 * identifiers, names, addresses, contact points, and caregiver contacts.
 */

import type {
  FHIRPatient,
  FHIRIdentifier,
  FHIRHumanName,
  FHIRAddress,
  FHIRContactPoint,
  FHIRReference,
  FHIRCodeableConcept,
  FHIRPatientContact,
  InternalPatient,
} from './types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const GENTLE_REMINDER_SYSTEM = 'https://gentlereminder.health/patient-id';
const FHIR_IDENTIFIER_TYPE_MR = 'http://terminology.hl7.org/CodeSystem/v2-0203';

// ---------------------------------------------------------------------------
// PatientMapper
// ---------------------------------------------------------------------------

export class PatientMapper {

  // -------------------------------------------------------------------------
  // Internal -> FHIR
  // -------------------------------------------------------------------------

  /**
   * Maps an internal Gentle Reminder patient to a FHIR R4 Patient resource.
   */
  mapToFHIRPatient(patient: InternalPatient): FHIRPatient {
    const fhirPatient: FHIRPatient = {
      resourceType: 'Patient',
      id: patient.id,
      meta: {
        lastUpdated: new Date().toISOString(),
        profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient'],
      },
      identifier: [this.buildPatientIdentifier(patient.id, GENTLE_REMINDER_SYSTEM)],
      active: patient.active,
      name: [this.buildHumanName(patient.firstName, patient.lastName)],
      gender: patient.gender,
      birthDate: patient.dateOfBirth,
    };

    // Telecom (phone + email)
    const telecom: FHIRContactPoint[] = [];
    if (patient.phone) {
      telecom.push(this.buildContactPoint('phone', patient.phone, 'home'));
    }
    if (patient.email) {
      telecom.push(this.buildContactPoint('email', patient.email, 'home'));
    }
    if (telecom.length > 0) {
      fhirPatient.telecom = telecom;
    }

    // Address
    if (patient.address) {
      fhirPatient.address = [
        this.buildAddress(
          patient.address.city,
          patient.address.state,
          patient.address.postalCode,
          patient.address.country,
          patient.address.line1,
          patient.address.line2
        ),
      ];
    }

    // Caregiver as contact
    if (patient.caregiverId) {
      fhirPatient.contact = [
        this.buildCaregiverContact(patient.caregiverId),
      ];
    }

    // Managing organization (clinician)
    if (patient.clinicianId) {
      fhirPatient.generalPractitioner = [
        {
          reference: `Practitioner/${patient.clinicianId}`,
          display: 'Assigned Clinician',
        },
      ];
    }

    return fhirPatient;
  }

  // -------------------------------------------------------------------------
  // FHIR -> Internal
  // -------------------------------------------------------------------------

  /**
   * Maps a FHIR R4 Patient resource back to the internal format.
   */
  mapFromFHIRPatient(fhirPatient: FHIRPatient): InternalPatient {
    const officialName = this.extractName(fhirPatient.name, 'official') ?? this.extractName(fhirPatient.name);

    const phone = this.extractTelecom(fhirPatient.telecom, 'phone');
    const email = this.extractTelecom(fhirPatient.telecom, 'email');

    const address = fhirPatient.address?.[0];
    const caregiverContact = fhirPatient.contact?.find(c =>
      c.relationship?.some(r =>
        r.coding?.some(coding => coding.code === 'C' || coding.code === 'caregiver')
      )
    );

    const clinicianRef = fhirPatient.generalPractitioner?.[0];
    const clinicianId = clinicianRef?.reference?.replace('Practitioner/', '') ?? undefined;

    return {
      id: fhirPatient.id ?? this.generateId(),
      firstName: officialName?.given?.[0] ?? '',
      lastName: officialName?.family ?? '',
      dateOfBirth: fhirPatient.birthDate ?? '',
      gender: fhirPatient.gender ?? 'unknown',
      email: email ?? undefined,
      phone: phone ?? undefined,
      address: address
        ? {
            line1: address.line?.[0],
            line2: address.line?.[1],
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
          }
        : undefined,
      caregiverId: caregiverContact
        ? this.extractReferenceId(caregiverContact.organization?.reference)
        : undefined,
      clinicianId,
      active: fhirPatient.active ?? true,
    };
  }

  // -------------------------------------------------------------------------
  // Builder helpers
  // -------------------------------------------------------------------------

  /**
   * Builds a FHIR Identifier with system and value.
   */
  buildPatientIdentifier(id: string, system: string): FHIRIdentifier {
    return {
      use: 'official',
      type: {
        coding: [
          {
            system: FHIR_IDENTIFIER_TYPE_MR,
            code: 'MR',
            display: 'Medical record number',
          },
        ],
      },
      system,
      value: id,
    };
  }

  /**
   * Builds a FHIR HumanName from first and last name.
   */
  buildHumanName(
    firstName: string,
    lastName: string,
    use: FHIRHumanName['use'] = 'official'
  ): FHIRHumanName {
    return {
      use,
      family: lastName,
      given: firstName ? [firstName] : undefined,
      text: `${firstName} ${lastName}`.trim(),
    };
  }

  /**
   * Builds a FHIR Address.
   */
  buildAddress(
    city?: string,
    state?: string,
    postalCode?: string,
    country?: string,
    line1?: string,
    line2?: string
  ): FHIRAddress {
    const lines: string[] = [];
    if (line1) lines.push(line1);
    if (line2) lines.push(line2);

    const textParts = [...lines];
    if (city) textParts.push(city);
    if (state) textParts.push(state);
    if (postalCode) textParts.push(postalCode);

    return {
      use: 'home',
      type: 'physical',
      line: lines.length > 0 ? lines : undefined,
      city,
      state,
      postalCode,
      country: country ?? 'US',
      text: textParts.join(', '),
    };
  }

  /**
   * Builds a FHIR ContactPoint (phone, email, etc.).
   */
  buildContactPoint(
    system: FHIRContactPoint['system'],
    value: string,
    use: FHIRContactPoint['use'] = 'home'
  ): FHIRContactPoint {
    return { system, value, use };
  }

  /**
   * Builds a caregiver contact entry.
   */
  buildCaregiverContact(caregiverId: string): FHIRPatientContact {
    return {
      relationship: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v2-0131',
              code: 'C',
              display: 'Emergency Contact',
            },
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-RoleCode',
              code: 'caregiver',
              display: 'Caregiver',
            },
          ],
          text: 'Caregiver',
        },
      ],
      organization: {
        reference: `RelatedPerson/${caregiverId}`,
        display: 'Assigned Caregiver',
      },
    };
  }

  /**
   * Builds a FHIR Reference to a patient.
   */
  buildPatientReference(patientId: string, displayName?: string): FHIRReference {
    return {
      reference: `Patient/${patientId}`,
      type: 'Patient',
      display: displayName,
    };
  }

  // -------------------------------------------------------------------------
  // Extraction helpers (FHIR -> values)
  // -------------------------------------------------------------------------

  private extractName(names?: FHIRHumanName[], preferredUse?: FHIRHumanName['use']): FHIRHumanName | undefined {
    if (!names || names.length === 0) return undefined;
    if (preferredUse) {
      const match = names.find(n => n.use === preferredUse);
      if (match) return match;
    }
    return names[0];
  }

  private extractTelecom(
    telecoms?: FHIRContactPoint[],
    system?: FHIRContactPoint['system']
  ): string | undefined {
    if (!telecoms) return undefined;
    const match = system ? telecoms.find(t => t.system === system) : telecoms[0];
    return match?.value;
  }

  private extractReferenceId(reference?: string): string | undefined {
    if (!reference) return undefined;
    const parts = reference.split('/');
    return parts.length > 1 ? parts[parts.length - 1] : reference;
  }

  private generateId(): string {
    return `pt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }
}

export default PatientMapper;
