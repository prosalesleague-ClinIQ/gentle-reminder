import { PatientRecord, DeidentifiedRecord } from './types';

/**
 * De-identifies patient records for clinical trial export.
 * Removes PII while preserving clinically relevant data.
 */
export class Deidentifier {
  /**
   * Generate a deterministic hashed subject ID from patient + trial + salt.
   * Uses a simple but consistent hash suitable for non-cryptographic de-identification.
   */
  static generateSubjectId(patientId: string, trialId: string, salt: string): string {
    const input = `${salt}:${trialId}:${patientId}`;
    return Deidentifier.hashString(input);
  }

  /**
   * De-identify a full patient record.
   * Removes: name, email, exact DOB (keeps age), city (keeps state).
   * Preserves: cognitive scores, biomarkers, session data.
   */
  static deidentifyPatient(patient: PatientRecord, salt: string): DeidentifiedRecord {
    const subjectId = Deidentifier.hashString(`${salt}:${patient.id}`);
    const age = Deidentifier.calculateAge(patient.dateOfBirth);

    return {
      subjectId,
      age,
      gender: patient.gender,
      cognitiveStage: patient.cognitiveStage,
      scores: patient.sessions.map((session) => ({
        date: session.date,
        overallScore: session.overallScore,
        orientation: session.orientation,
        identity: session.identity,
        memory: session.memory,
        responseTimeMs: session.responseTimeMs,
        sessionDurationMs: session.durationMs,
      })),
      biomarkers: patient.biomarkers,
    };
  }

  /**
   * Calculate age in years from a date of birth.
   */
  private static calculateAge(dob: Date): number {
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const monthDiff = now.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }

  /**
   * Simple deterministic hash function.
   * Produces a hex string from any input. Not cryptographically secure
   * but sufficient for de-identification subject IDs in trial contexts.
   */
  private static hashString(input: string): string {
    let h1 = 0xdeadbeef;
    let h2 = 0x41c6ce57;

    for (let i = 0; i < input.length; i++) {
      const ch = input.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }

    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    const hash = 4294967296 * (2097151 & h2) + (h1 >>> 0);
    return hash.toString(16).padStart(12, '0');
  }
}
