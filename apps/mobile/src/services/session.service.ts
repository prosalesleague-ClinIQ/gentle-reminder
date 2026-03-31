import { api } from './api';
import type {
  Session,
  CreateSessionInput,
  CompleteSessionInput,
  SessionSummary,
} from '@gentle-reminder/shared-types';

/**
 * Session service - manages cognitive exercise sessions.
 */
export const sessionService = {
  /**
   * Start a new cognitive session for a patient.
   */
  async startSession(input: CreateSessionInput): Promise<Session> {
    const response = await api.post<Session>('/sessions', input);

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to start session');
    }

    return response.data;
  },

  /**
   * Complete (finish) an active session.
   */
  async completeSession(input: CompleteSessionInput): Promise<SessionSummary> {
    const response = await api.post<SessionSummary>(
      `/sessions/${input.sessionId}/complete`,
      { notes: input.notes },
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to complete session');
    }

    return response.data;
  },

  /**
   * Abandon (cancel) an active session.
   */
  async abandonSession(sessionId: string): Promise<void> {
    const response = await api.post(`/sessions/${sessionId}/abandon`);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to abandon session');
    }
  },

  /**
   * Get session history for a patient.
   */
  async getHistory(
    patientId: string,
    page = 1,
    pageSize = 10,
  ): Promise<{ sessions: SessionSummary[]; totalCount: number }> {
    const response = await api.get<{ sessions: SessionSummary[]; totalCount: number }>(
      `/patients/${patientId}/sessions?page=${page}&pageSize=${pageSize}`,
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get session history');
    }

    return response.data;
  },

  /**
   * Get a specific session's summary and results.
   */
  async getSession(sessionId: string): Promise<SessionSummary> {
    const response = await api.get<SessionSummary>(`/sessions/${sessionId}`);

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get session');
    }

    return response.data;
  },
};
