/**
 * 21 CFR Part 11 compliance utilities.
 * Provides electronic signatures, audit trails, and data integrity checks
 * using SHA-256 hashing via Node's crypto module.
 */

import * as crypto from 'crypto';
import {
  ElectronicSignature,
  SignedRecord,
  AuditTrailEntry,
  AuditAction,
  SignatureMeaning,
} from './types';

/**
 * Compute a SHA-256 checksum of arbitrary data.
 * Serializes objects to a stable JSON representation before hashing.
 */
export function checksumData(data: unknown): string {
  const serialized = typeof data === 'string' ? data : stableStringify(data);
  return crypto.createHash('sha256').update(serialized).digest('hex');
}

/**
 * Sign a record with an electronic signature.
 * The signature includes a SHA-256 hash of the data, the userId, meaning, and timestamp.
 */
export function signRecord<T>(
  record: T,
  userId: string,
  meaning: SignatureMeaning
): SignedRecord<T> {
  const timestamp = new Date().toISOString();
  const dataHash = checksumData(record);
  const signatureInput = `${dataHash}:${userId}:${meaning}:${timestamp}`;
  const hash = crypto.createHash('sha256').update(signatureInput).digest('hex');

  const signature: ElectronicSignature = {
    userId,
    meaning,
    timestamp,
    hash,
  };

  return { data: record, signature };
}

/**
 * Verify the integrity of a signed record.
 * Recomputes the hash from the data and signature fields to confirm nothing was altered.
 */
export function verifySignature<T>(signedRecord: SignedRecord<T>): boolean {
  const { data, signature } = signedRecord;
  const dataHash = checksumData(data);
  const signatureInput = `${dataHash}:${signature.userId}:${signature.meaning}:${signature.timestamp}`;
  const expectedHash = crypto.createHash('sha256').update(signatureInput).digest('hex');

  return signature.hash === expectedHash;
}

/**
 * Generate a complete audit trail from a list of actions.
 * Each entry receives a unique ID, timestamp, and integrity checksum.
 */
export function generateAuditTrail(actions: AuditAction[]): AuditTrailEntry[] {
  let previousChecksum = '0'.repeat(64); // genesis block

  return actions.map((action, index) => {
    const timestamp = new Date().toISOString();
    const id = `AUDIT-${Date.now()}-${(index + 1).toString().padStart(4, '0')}`;

    const entryContent = [
      previousChecksum,
      id,
      timestamp,
      action.userId,
      action.action,
      action.resourceType,
      action.resourceId,
      action.previousValue ?? '',
      action.newValue ?? '',
      action.reason ?? '',
    ].join('|');

    const checksum = crypto.createHash('sha256').update(entryContent).digest('hex');

    const entry: AuditTrailEntry = {
      id,
      timestamp,
      userId: action.userId,
      action: action.action,
      resourceType: action.resourceType,
      resourceId: action.resourceId,
      previousValue: action.previousValue,
      newValue: action.newValue,
      reason: action.reason,
      checksum,
    };

    previousChecksum = checksum;
    return entry;
  });
}

/**
 * Verify the integrity of an audit trail by re-checking the checksum chain.
 */
export function verifyAuditTrail(entries: AuditTrailEntry[]): boolean {
  let previousChecksum = '0'.repeat(64);

  for (const entry of entries) {
    const entryContent = [
      previousChecksum,
      entry.id,
      entry.timestamp,
      entry.userId,
      entry.action,
      entry.resourceType,
      entry.resourceId,
      entry.previousValue ?? '',
      entry.newValue ?? '',
      entry.reason ?? '',
    ].join('|');

    const expectedChecksum = crypto.createHash('sha256').update(entryContent).digest('hex');
    if (entry.checksum !== expectedChecksum) return false;

    previousChecksum = entry.checksum;
  }

  return true;
}

/**
 * Stable JSON.stringify that sorts object keys for deterministic hashing.
 */
function stableStringify(obj: unknown): string {
  if (obj === null || obj === undefined) return 'null';
  if (typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) {
    return '[' + obj.map(stableStringify).join(',') + ']';
  }
  const keys = Object.keys(obj as Record<string, unknown>).sort();
  const parts = keys.map(
    (k) => `${JSON.stringify(k)}:${stableStringify((obj as Record<string, unknown>)[k])}`
  );
  return '{' + parts.join(',') + '}';
}
