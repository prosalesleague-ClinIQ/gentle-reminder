import { api } from './api';
import type {
  Memory,
  CreateMemoryInput,
  UpdateMemoryInput,
} from '@gentle-reminder/shared-types';

/**
 * Memory service - manages patient memories (stories, photos, recordings).
 */
export const memoryService = {
  /**
   * Get all memories for a patient.
   */
  async getMemories(
    patientId: string,
    page = 1,
    pageSize = 20,
  ): Promise<{ memories: Memory[]; totalCount: number }> {
    const response = await api.get<{ memories: Memory[]; totalCount: number }>(
      `/patients/${patientId}/memories?page=${page}&pageSize=${pageSize}`,
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get memories');
    }

    return response.data;
  },

  /**
   * Get a specific memory by ID.
   */
  async getMemory(memoryId: string): Promise<Memory> {
    const response = await api.get<Memory>(`/memories/${memoryId}`);

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get memory');
    }

    return response.data;
  },

  /**
   * Create a new memory entry.
   */
  async createMemory(input: CreateMemoryInput): Promise<Memory> {
    const response = await api.post<Memory>('/memories', input);

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to create memory');
    }

    return response.data;
  },

  /**
   * Update an existing memory.
   */
  async updateMemory(memoryId: string, input: UpdateMemoryInput): Promise<Memory> {
    const response = await api.patch<Memory>(`/memories/${memoryId}`, input);

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to update memory');
    }

    return response.data;
  },

  /**
   * Toggle a memory's favorite status.
   */
  async toggleFavorite(memoryId: string, isFavorite: boolean): Promise<Memory> {
    return this.updateMemory(memoryId, { isFavorite });
  },
};
