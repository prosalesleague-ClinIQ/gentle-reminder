export enum SessionStatus {
  STARTED = 'started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

export enum SessionPhase {
  IDLE = 'idle',
  STARTING = 'starting',
  ORIENTATION = 'orientation',
  IDENTITY = 'identity',
  MEMORY = 'memory',
  COMPLETING = 'completing',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

export interface Session {
  id: string;
  patientId: string;
  status: SessionStatus;
  startedAt: Date;
  completedAt?: Date;
  durationSeconds?: number;
  exerciseCount: number;
  overallScore?: number;
  notes?: string;
  createdAt: Date;
}

export interface CreateSessionInput {
  patientId: string;
}

export interface CompleteSessionInput {
  sessionId: string;
  notes?: string;
}

export interface SessionSummary {
  id: string;
  status: SessionStatus;
  startedAt: Date;
  completedAt?: Date;
  durationSeconds?: number;
  exerciseCount: number;
  overallScore?: number;
  exerciseResults: ExerciseResultSummary[];
}

export interface ExerciseResultSummary {
  exerciseType: string;
  score: number;
  responseTimeMs: number;
  feedbackType: string;
}
