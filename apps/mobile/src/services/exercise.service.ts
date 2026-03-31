import { api } from './api';
import type {
  ExerciseResult,
  CreateExerciseResultInput,
  ExercisePrompt,
} from '@gentle-reminder/shared-types';

/**
 * Exercise service - submits exercise results and fetches prompts.
 */
export const exerciseService = {
  /**
   * Submit the result of a single exercise within a session.
   */
  async submitResult(input: CreateExerciseResultInput): Promise<ExerciseResult> {
    const response = await api.post<ExerciseResult>(
      `/sessions/${input.sessionId}/results`,
      input,
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to submit exercise result');
    }

    return response.data;
  },

  /**
   * Get exercise prompts for a session (server may personalize based on patient data).
   */
  async getPrompts(sessionId: string): Promise<ExercisePrompt[]> {
    const response = await api.get<ExercisePrompt[]>(
      `/sessions/${sessionId}/prompts`,
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get exercise prompts');
    }

    return response.data;
  },

  /**
   * Get all results for a session.
   */
  async getSessionResults(sessionId: string): Promise<ExerciseResult[]> {
    const response = await api.get<ExerciseResult[]>(
      `/sessions/${sessionId}/results`,
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get session results');
    }

    return response.data;
  },
};
