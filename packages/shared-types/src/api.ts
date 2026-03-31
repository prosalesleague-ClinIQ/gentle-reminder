export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AnalyticsTrend {
  date: string;
  value: number;
  label?: string;
}

export interface CognitiveTrends {
  patientId: string;
  period: string;
  overallTrend: AnalyticsTrend[];
  orientationTrend: AnalyticsTrend[];
  identityTrend: AnalyticsTrend[];
  memoryTrend: AnalyticsTrend[];
  sessionCompletionRate: number;
  averageSessionDuration: number;
}

export interface AlertPayload {
  id: string;
  patientId: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
}

export enum AlertType {
  COGNITIVE_DECLINE = 'cognitive_decline',
  MISSED_SESSIONS = 'missed_sessions',
  EMOTIONAL_CHANGE = 'emotional_change',
  RESPONSE_TIME_INCREASE = 'response_time_increase',
  SESSION_ABANDONMENT = 'session_abandonment',
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}
