/**
 * Core types for the digital biomarker engine.
 */

/** A single behavioral signal captured from a patient. */
export interface BehavioralSignal {
  patientId: string;
  source: string;
  signalType: string;
  value: number;
  unit?: string;
  recordedAt: Date;
}

/** The result of a biomarker analysis. */
export interface BiomarkerResult {
  type: string;
  /** Score from 0 to 1. Interpretation varies by biomarker. */
  score: number;
  /** Confidence in the score from 0 to 1. */
  confidence: number;
  trend: 'improving' | 'stable' | 'declining' | 'insufficient_data';
  metadata?: Record<string, unknown>;
}

/** A time-bounded window of signals for analysis. */
export interface SignalWindow {
  signals: BehavioralSignal[];
  startDate: Date;
  endDate: Date;
}

/** Configuration for biomarker analysis. */
export interface BiomarkerConfig {
  /** Number of days in the analysis window. */
  windowDays: number;
  /** Minimum number of samples required for a valid score. */
  minSamples: number;
  /** Weights for each biomarker type in composite scoring. */
  weights: Record<string, number>;
}

/** An alert raised when cognitive decline is detected. */
export interface DeclineAlert {
  biomarkerType: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  percentageChange: number;
  message: string;
}
