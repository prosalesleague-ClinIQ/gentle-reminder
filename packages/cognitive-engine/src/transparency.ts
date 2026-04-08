/**
 * Algorithm Transparency Module
 *
 * Provides human-readable explanations of cognitive scoring,
 * difficulty adaptation, and algorithm versioning for FDA SaMD
 * transparency requirements.
 */

import { DIFFICULTY_LEVELS } from './scoring/adaptive-difficulty';

const ALGORITHM_VERSION = '1.0.0';

// --- Types ---

export interface ScoreExplanation {
  algorithmVersion: string;
  overallScore: number;
  overallScoreDisplay: number;
  domains: DomainExplanation[];
  methodology: string;
  limitations: string[];
  disclaimer: string;
}

export interface DomainExplanation {
  domain: string;
  score: number;
  scoreDisplay: number;
  exerciseCount: number;
  interpretation: string;
}

export interface DifficultyExplanation {
  exerciseId: string;
  currentLevel: number;
  levelLabel: string;
  levelDescription: string;
  rationale: string;
  adaptationRules: string[];
}

interface SessionExercise {
  domain: string;
  score: number;
}

interface SessionData {
  exercises: SessionExercise[];
  overallScore: number;
  domainScores: Record<string, number>;
}

// --- Domain Display Names ---

const DOMAIN_NAMES: Record<string, string> = {
  ORIENTATION: 'Orientation',
  MEMORY: 'Memory',
  ATTENTION: 'Attention',
  LANGUAGE: 'Language',
  VISUOSPATIAL: 'Visuospatial',
  EXECUTIVE_FUNCTION: 'Executive Function',
  IDENTITY: 'Identity/Recognition',
};

// --- Score Interpretation ---

function interpretDomainScore(score: number): string {
  if (score >= 0.85) return 'Strong performance in this domain';
  if (score >= 0.70) return 'Good performance, within expected range';
  if (score >= 0.50) return 'Moderate performance, may warrant clinical attention';
  if (score >= 0.30) return 'Below expected range, clinical review recommended';
  return 'Significantly below expected range, clinical assessment recommended';
}

// --- Public API ---

/**
 * Generates a human-readable explanation of a cognitive session score.
 */
export function explainScore(sessionData: SessionData): ScoreExplanation {
  const domains: DomainExplanation[] = [];

  for (const [domainKey, domainScore] of Object.entries(sessionData.domainScores)) {
    if (domainScore <= 0) continue;

    const exercisesInDomain = sessionData.exercises.filter(
      (e) => e.domain === domainKey,
    );

    domains.push({
      domain: DOMAIN_NAMES[domainKey] ?? domainKey,
      score: round(domainScore, 3),
      scoreDisplay: Math.round(domainScore * 100),
      exerciseCount: exercisesInDomain.length,
      interpretation: interpretDomainScore(domainScore),
    });
  }

  return {
    algorithmVersion: ALGORITHM_VERSION,
    overallScore: round(sessionData.overallScore, 3),
    overallScoreDisplay: Math.round(sessionData.overallScore * 100),
    domains,
    methodology: [
      'The overall cognitive score is the equally-weighted arithmetic mean of all assessed domain scores.',
      'Each domain score is the arithmetic mean of individual exercise scores (0.0-1.0) within that domain.',
      'Only domains with at least one completed exercise contribute to the overall score.',
      'All scoring functions are deterministic: identical inputs always produce identical outputs.',
    ].join(' '),
    limitations: [
      'Scores may be affected by fatigue, mood, medication effects, time of day, and environmental factors.',
      'Touchscreen interaction ability may affect scores independently of cognitive function.',
      'Exercise content may have cultural or linguistic influences on performance.',
      'Scores are not validated for populations outside adults aged 65+ with mild-to-moderate dementia.',
    ],
    disclaimer:
      'These scores are supplementary clinical information only and do not constitute a diagnosis. ' +
      'All diagnostic and treatment decisions must be made by qualified healthcare professionals ' +
      'based on comprehensive clinical assessment.',
  };
}

/**
 * Generates a human-readable explanation of the current difficulty level
 * for a specific exercise.
 */
export function explainDifficulty(exerciseId: string, level: number): DifficultyExplanation {
  const clampedLevel = Math.max(1, Math.min(5, Math.round(level)));
  const difficultyLevel = DIFFICULTY_LEVELS[clampedLevel - 1];

  let rationale: string;
  if (clampedLevel === 1) {
    rationale =
      'Difficulty is set to the gentlest level to provide a supportive experience. ' +
      'This may be because the patient is new or has been experiencing difficulty with exercises.';
  } else if (clampedLevel <= 3) {
    rationale =
      'Difficulty is set to a comfortable level based on recent performance. ' +
      'The system targets a 70-85% success rate to maintain engagement without frustration.';
  } else {
    rationale =
      'Difficulty is elevated because the patient has demonstrated consistently strong performance. ' +
      'The system will reduce difficulty immediately if the patient begins to struggle.';
  }

  return {
    exerciseId,
    currentLevel: clampedLevel,
    levelLabel: difficultyLevel.label,
    levelDescription: difficultyLevel.description,
    rationale,
    adaptationRules: [
      'Difficulty increases by 1 level after sustained high performance (average > 85%, 3+ consecutive correct).',
      'Difficulty decreases by 1 level immediately when the patient struggles (average < 50% or 2+ consecutive incorrect).',
      'Difficulty never changes by more than 1 level at a time.',
      'The system targets a 70-85% success rate (the "comfort zone").',
      'Difficulty adjustments prioritize preventing frustration over maximizing challenge.',
    ],
  };
}

/**
 * Returns the current algorithm version information.
 */
export function getAlgorithmVersion(): {
  version: string;
  components: { name: string; version: string; description: string }[];
} {
  return {
    version: ALGORITHM_VERSION,
    components: [
      {
        name: 'cognitive-scorer',
        version: ALGORITHM_VERSION,
        description: 'Domain and composite score calculation using equally-weighted arithmetic mean',
      },
      {
        name: 'adaptive-difficulty',
        version: ALGORITHM_VERSION,
        description: 'Performance-based difficulty adjustment targeting 70-85% success rate',
      },
      {
        name: 'decline-detection',
        version: ALGORITHM_VERSION,
        description: 'Rolling window longitudinal trend analysis for cognitive decline detection',
      },
      {
        name: 'fatigue-detection',
        version: ALGORITHM_VERSION,
        description: 'Intra-session fatigue signal detection based on response time and accuracy patterns',
      },
    ],
  };
}

// --- Utility ---

function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
