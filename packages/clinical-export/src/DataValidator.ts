/**
 * Clinical data validation utilities.
 * Range checks, consistency checks, completeness checks, and domain-specific validations.
 */

import {
  DataValidationResult,
  ValidationIssue,
  CrossFieldRule,
} from './types';

// ── Generic Validators ──

/**
 * Check whether a numeric value falls within an acceptable range.
 */
export function rangeCheck(
  value: number,
  min: number,
  max: number,
  fieldName: string = 'value'
): ValidationIssue | null {
  if (value < min || value > max) {
    return {
      field: fieldName,
      message: `${fieldName} (${value}) is outside acceptable range [${min}, ${max}]`,
      severity: 'error',
      value,
    };
  }
  return null;
}

/**
 * Check a set of records for internal consistency.
 * Ensures chronological ordering and no duplicate timestamps.
 */
export function consistencyCheck(
  records: Array<{ date: string; [key: string]: unknown }>
): DataValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  const dates = records.map((r) => new Date(r.date).getTime());

  // Check chronological ordering
  for (let i = 1; i < dates.length; i++) {
    if (dates[i] < dates[i - 1]) {
      errors.push({
        field: 'date',
        message: `Record at index ${i} has date before record at index ${i - 1} (non-chronological order)`,
        severity: 'error',
        value: records[i].date,
      });
    }
  }

  // Check for duplicate timestamps
  const seen = new Set<number>();
  for (let i = 0; i < dates.length; i++) {
    if (seen.has(dates[i])) {
      warnings.push({
        field: 'date',
        message: `Duplicate timestamp at index ${i}: ${records[i].date}`,
        severity: 'warning',
        value: records[i].date,
      });
    }
    seen.add(dates[i]);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Check that all required fields are present and non-null in a record.
 */
export function completenessCheck(
  record: Record<string, unknown>,
  requiredFields: string[]
): DataValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  for (const field of requiredFields) {
    const value = record[field];
    if (value === undefined || value === null) {
      errors.push({
        field,
        message: `Required field '${field}' is missing or null`,
        severity: 'error',
      });
    } else if (value === '') {
      warnings.push({
        field,
        message: `Field '${field}' is present but empty`,
        severity: 'warning',
        value,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Apply cross-field validation rules to a record.
 */
export function crossFieldValidation(
  record: Record<string, unknown>,
  rules: CrossFieldRule[]
): DataValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  for (const rule of rules) {
    const issue = rule.validate(record);
    if (issue) {
      if (issue.severity === 'error') {
        errors.push(issue);
      } else {
        warnings.push(issue);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ── Domain-Specific Validators ──

/**
 * Validate a cognitive assessment score.
 * Scores should be 0-100, with warnings for extreme values.
 */
export function validateCognitiveScore(score: number): DataValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  if (typeof score !== 'number' || isNaN(score)) {
    errors.push({
      field: 'cognitiveScore',
      message: 'Cognitive score must be a valid number',
      severity: 'error',
      value: score,
    });
    return { valid: false, errors, warnings };
  }

  const rangeIssue = rangeCheck(score, 0, 100, 'cognitiveScore');
  if (rangeIssue) {
    errors.push(rangeIssue);
  }

  // Warn on extreme but valid scores
  if (score === 0) {
    warnings.push({
      field: 'cognitiveScore',
      message: 'Cognitive score of 0 is unusual and may indicate a data entry error',
      severity: 'warning',
      value: score,
    });
  }
  if (score === 100) {
    warnings.push({
      field: 'cognitiveScore',
      message: 'Perfect cognitive score of 100 is rare and should be verified',
      severity: 'warning',
      value: score,
    });
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Validate a biomarker reading based on its type.
 * Each biomarker type has specific acceptable ranges.
 */
export function validateBiomarker(
  type: string,
  value: number
): DataValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  if (typeof value !== 'number' || isNaN(value)) {
    errors.push({
      field: type,
      message: `Biomarker ${type} must be a valid number`,
      severity: 'error',
      value,
    });
    return { valid: false, errors, warnings };
  }

  // Known biomarker ranges (extendable)
  const biomarkerRanges: Record<string, { min: number; max: number; warnMin?: number; warnMax?: number }> = {
    // Amyloid beta (pg/mL in CSF)
    amyloid_beta: { min: 0, max: 2000, warnMin: 200, warnMax: 1500 },
    // Tau protein (pg/mL in CSF)
    tau: { min: 0, max: 1200, warnMin: 50, warnMax: 800 },
    // Phosphorylated tau (pg/mL)
    p_tau: { min: 0, max: 200, warnMin: 10, warnMax: 120 },
    // Neurofilament light chain (pg/mL)
    nfl: { min: 0, max: 500, warnMin: 5, warnMax: 300 },
    // MMSE score
    mmse: { min: 0, max: 30 },
    // MoCA score
    moca: { min: 0, max: 30 },
  };

  const range = biomarkerRanges[type.toLowerCase()];
  if (!range) {
    warnings.push({
      field: type,
      message: `Unknown biomarker type '${type}' - no validation range available`,
      severity: 'warning',
      value,
    });
    return { valid: true, errors, warnings };
  }

  const rangeIssue = rangeCheck(value, range.min, range.max, type);
  if (rangeIssue) {
    errors.push(rangeIssue);
  }

  // Warning ranges for clinically unusual values
  if (range.warnMin !== undefined && value < range.warnMin && !rangeIssue) {
    warnings.push({
      field: type,
      message: `${type} value (${value}) is below typical clinical range (${range.warnMin})`,
      severity: 'warning',
      value,
    });
  }
  if (range.warnMax !== undefined && value > range.warnMax && !rangeIssue) {
    warnings.push({
      field: type,
      message: `${type} value (${value}) is above typical clinical range (${range.warnMax})`,
      severity: 'warning',
      value,
    });
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Merge multiple validation results into a single result.
 */
export function mergeValidationResults(
  ...results: DataValidationResult[]
): DataValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  for (const result of results) {
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
