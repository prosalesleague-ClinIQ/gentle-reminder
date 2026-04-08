import * as crypto from 'crypto';
import { PatientRecord, DeidentifiedRecord } from './types';

/**
 * De-identifies patient records for clinical trial export.
 * Removes PII while preserving clinically relevant data.
 * Uses SHA-256 for cryptographic hashing of identifiers.
 */
export class Deidentifier {
  /**
   * Generate a deterministic hashed subject ID from patient + trial + salt.
   * Uses SHA-256 for cryptographic de-identification.
   */
  static generateSubjectId(patientId: string, trialId: string, salt: string): string {
    const input = `${salt}:${trialId}:${patientId}`;
    return Deidentifier.sha256(input);
  }

  /**
   * De-identify a full patient record.
   * Removes: name, email, exact DOB (keeps age), city (keeps state).
   * Preserves: cognitive scores, biomarkers, session data.
   */
  static deidentifyPatient(patient: PatientRecord, salt: string): DeidentifiedRecord {
    const subjectId = Deidentifier.sha256(`${salt}:${patient.id}`);
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
   * De-identify a patient record with date shifting.
   * All dates in scores and biomarkers are shifted by a deterministic offset
   * derived from the patient ID and salt, preserving relative intervals.
   * The offset is between -180 and +180 days.
   */
  static deidentifyWithDateShift(
    patient: PatientRecord,
    salt: string
  ): DeidentifiedRecord {
    const record = Deidentifier.deidentifyPatient(patient, salt);
    const shiftDays = Deidentifier.computeDateShift(patient.id, salt);

    record.scores = record.scores.map((score) => ({
      ...score,
      date: Deidentifier.shiftDate(score.date, shiftDays),
    }));

    record.biomarkers = record.biomarkers.map((bm) => ({
      ...bm,
      date: Deidentifier.shiftDate(bm.date, shiftDays),
    }));

    return record;
  }

  /**
   * Truncate a zip/postal code to the first 3 characters for Safe Harbor compliance.
   * Returns '000' if the input is shorter than 3 characters.
   */
  static truncateZipCode(zipCode: string): string {
    if (!zipCode || zipCode.length < 3) return '000';
    return zipCode.substring(0, 3);
  }

  /**
   * Calculate age in years from a date of birth.
   * Ages 90 and above are capped at 90 per HIPAA Safe Harbor.
   */
  private static calculateAge(dob: Date): number {
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const monthDiff = now.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
      age--;
    }
    // HIPAA Safe Harbor: ages >= 90 reported as 90
    return Math.min(age, 90);
  }

  /**
   * SHA-256 hash of a string, returned as a hex digest.
   */
  private static sha256(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex');
  }

  /**
   * Compute a deterministic date shift (in days) for a patient.
   * Produces a value between -180 and +180 days based on a hash.
   */
  private static computeDateShift(patientId: string, salt: string): number {
    const hash = Deidentifier.sha256(`dateshift:${salt}:${patientId}`);
    // Use first 8 hex chars (32 bits) to derive a shift
    const hashInt = parseInt(hash.substring(0, 8), 16);
    // Map to range [-180, 180]
    return (hashInt % 361) - 180;
  }

  /**
   * Shift a date string by a number of days.
   * Returns an ISO date string (YYYY-MM-DD).
   */
  private static shiftDate(dateStr: string, days: number): string {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }
}
