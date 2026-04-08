/**
 * Exercise Manager — connects adaptive difficulty and spaced repetition
 * to the mobile app's cognitive session flow.
 *
 * Wraps the cognitive-engine's algorithms to:
 * - Track performance window across exercises
 * - Adjust difficulty dynamically (never frustrating, always engaging)
 * - Schedule memory review cards using SM-2 spaced repetition
 * - Generate exercises at the current difficulty level
 * - Persist state between sessions
 */

import {
  calculateDifficulty,
  getDifficultyParams,
  getDifficultyLevel,
} from '@gentle-reminder/cognitive-engine/scoring/adaptive-difficulty';
import type { PerformanceWindow, DifficultyLevel } from '@gentle-reminder/cognitive-engine/scoring/adaptive-difficulty';
import {
  createCard,
  processReview,
  getReviewSchedule,
  generateFamilyCards,
} from '@gentle-reminder/cognitive-engine/exercises/spaced-repetition';
import type { MemoryCard, ReviewSchedule } from '@gentle-reminder/cognitive-engine/exercises/spaced-repetition';

// ── Performance Tracking ─────────────────────────────────────

class ExerciseManager {
  private static instance: ExerciseManager;
  private currentLevel: number = 1; // Start at easiest
  private performance: PerformanceWindow = {
    recentScores: [],
    averageResponseTimeMs: 0,
    consecutiveCorrect: 0,
    consecutiveIncorrect: 0,
  };
  private memoryCards: MemoryCard[] = [];
  private sessionScores: number[] = [];
  private totalResponseTimeMs: number = 0;
  private responseCount: number = 0;

  private constructor() {
    this.initializeDefaultCards();
  }

  static getInstance(): ExerciseManager {
    if (!ExerciseManager.instance) {
      ExerciseManager.instance = new ExerciseManager();
    }
    return ExerciseManager.instance;
  }

  // ── Adaptive Difficulty ────────────────────────────────────

  /**
   * Record the result of an exercise and recalculate difficulty.
   * Returns the new difficulty level.
   */
  recordExerciseResult(correct: boolean, responseTimeMs: number): DifficultyLevel {
    const score = correct ? 1.0 : 0.0;
    this.performance.recentScores.push(score);

    // Keep only the last 10 scores
    if (this.performance.recentScores.length > 10) {
      this.performance.recentScores.shift();
    }

    // Update consecutive counters
    if (correct) {
      this.performance.consecutiveCorrect++;
      this.performance.consecutiveIncorrect = 0;
    } else {
      this.performance.consecutiveIncorrect++;
      this.performance.consecutiveCorrect = 0;
    }

    // Update average response time
    this.totalResponseTimeMs += responseTimeMs;
    this.responseCount++;
    this.performance.averageResponseTimeMs = this.totalResponseTimeMs / this.responseCount;

    // Track session score
    this.sessionScores.push(score);

    // Calculate new difficulty
    this.currentLevel = calculateDifficulty(this.performance, this.currentLevel);

    return getDifficultyLevel(this.currentLevel);
  }

  /**
   * Get current difficulty parameters for exercise generation.
   */
  getDifficultyParams(): {
    optionCount: number;
    hintAvailable: boolean;
    timeLimit: number;
    promptComplexity: 'simple' | 'moderate' | 'complex';
  } {
    return getDifficultyParams(this.currentLevel);
  }

  /**
   * Get current difficulty level info.
   */
  getCurrentDifficulty(): DifficultyLevel {
    return getDifficultyLevel(this.currentLevel);
  }

  /**
   * Get session statistics.
   */
  getSessionStats(): {
    exercisesCompleted: number;
    averageScore: number;
    currentDifficulty: DifficultyLevel;
    averageResponseTimeMs: number;
  } {
    const avg = this.sessionScores.length > 0
      ? this.sessionScores.reduce((a, b) => a + b, 0) / this.sessionScores.length
      : 0;

    return {
      exercisesCompleted: this.sessionScores.length,
      averageScore: avg,
      currentDifficulty: getDifficultyLevel(this.currentLevel),
      averageResponseTimeMs: this.performance.averageResponseTimeMs,
    };
  }

  /**
   * Reset for a new session (keeps difficulty level from previous session).
   */
  startNewSession(): void {
    this.sessionScores = [];
    this.performance.consecutiveCorrect = 0;
    this.performance.consecutiveIncorrect = 0;
    // Keep recentScores and difficulty level from previous session
  }

  // ── Spaced Repetition ──────────────────────────────────────

  /**
   * Get cards due for review right now.
   */
  getReviewSchedule(): ReviewSchedule {
    return getReviewSchedule(this.memoryCards);
  }

  /**
   * Process a card review result.
   * Quality: 0 = forgot, 3 = recalled with difficulty, 5 = perfect recall.
   */
  reviewCard(cardId: string, quality: number): MemoryCard | null {
    const index = this.memoryCards.findIndex((c) => c.id === cardId);
    if (index === -1) return null;

    const updated = processReview(this.memoryCards[index], quality);
    this.memoryCards[index] = updated;
    return updated;
  }

  /**
   * Add a new memory card for spaced repetition.
   */
  addMemoryCard(params: {
    prompt: string;
    answer: string;
    category: 'person' | 'place' | 'event' | 'fact';
    photoUrl?: string;
  }): MemoryCard {
    const card = createCard({
      id: `card-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      ...params,
    });
    this.memoryCards.push(card);
    return card;
  }

  /**
   * Get all memory cards.
   */
  getAllCards(): MemoryCard[] {
    return [...this.memoryCards];
  }

  /**
   * Get the number of cards due now.
   */
  getDueCardCount(): number {
    return getReviewSchedule(this.memoryCards).dueNow.length;
  }

  // ── Private ────────────────────────────────────────────────

  private initializeDefaultCards(): void {
    // Create demo family cards
    const familyCards = generateFamilyCards([
      { name: 'Lisa', relationship: 'daughter' },
      { name: 'Robert', relationship: 'husband' },
      { name: 'Emma', relationship: 'grandchild' },
      { name: 'James', relationship: 'son' },
    ]);
    this.memoryCards.push(...familyCards);

    // Add some place/event cards
    this.memoryCards.push(
      createCard({
        id: 'place-home',
        prompt: 'Where do you live?',
        answer: 'You live at 42 Maple Street',
        category: 'place',
      }),
      createCard({
        id: 'event-wedding',
        prompt: 'When were you married?',
        answer: 'You married Robert in June 1975',
        category: 'event',
      }),
      createCard({
        id: 'fact-birthday',
        prompt: 'When is your birthday?',
        answer: 'Your birthday is March 15th',
        category: 'fact',
      }),
    );
  }
}

export const exerciseManager = ExerciseManager.getInstance();
export { ExerciseManager };
