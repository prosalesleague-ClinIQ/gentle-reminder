export interface RawSignal {
  source: string;
  type: string;
  value: number;
  unit?: string;
  timestamp: number;
  patientId: string;
  metadata?: Record<string, unknown>;
}

export interface NormalizedSignal extends RawSignal {
  normalizedValue: number;
  quality: number;
}

export interface SignalBatch {
  patientId: string;
  signals: RawSignal[];
  receivedAt: number;
}

export interface ProcessedFeatures {
  patientId: string;
  features: Record<string, number>;
  computedAt: number;
}

export interface PipelineConfig {
  batchSize: number;
  windowMinutes: number;
  qualityThreshold: number;
}

export interface AlertPayload {
  patientId: string;
  signalType: string;
  value: number;
  reason: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: number;
}

export interface DailySummary {
  patientId: string;
  date: string;
  heartRate: {
    avg: number;
    min: number;
    max: number;
    resting: number;
  };
  steps: {
    total: number;
    hourly: number[];
  };
  sleep: {
    duration: number;
    quality: number;
    wakeCount: number;
  };
  cognitiveActivity: {
    sessions: number;
    avgScore: number;
    exercises: number;
  };
  alerts: AlertPayload[];
}
