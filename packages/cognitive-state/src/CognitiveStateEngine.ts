import {
  CognitiveState,
  SpeechFeatures,
  BehaviorFeatures,
  BiometricFeatures,
  StateClassification,
  StateScores,
  SignalContribution,
  SignalSource,
  SignalWeights,
  ClassificationThresholds,
} from './types';
import { processSpeechSignals } from './signals/SpeechSignalProcessor';
import { processBehaviorSignals } from './signals/BehaviorSignalProcessor';
import { processBiometricSignals } from './signals/BiometricSignalProcessor';

const DEFAULT_WEIGHTS: SignalWeights = {
  speech: 0.45,
  behavior: 0.30,
  biometric: 0.25,
};

const DEFAULT_THRESHOLDS: ClassificationThresholds = {
  minimumScore: 0.15,
  highConfidence: 0.7,
  lowConfidence: 0.35,
};

/**
 * Main cognitive state classification engine.
 *
 * Accepts multimodal signals (speech, behavior, biometric) and produces
 * a weighted classification of the patient's current cognitive state.
 * Any combination of signal types can be provided; weights are
 * automatically redistributed when signals are missing.
 */
export class CognitiveStateEngine {
  private weights: SignalWeights;
  private thresholds: ClassificationThresholds;

  constructor(
    weights: Partial<SignalWeights> = {},
    thresholds: Partial<ClassificationThresholds> = {}
  ) {
    this.weights = { ...DEFAULT_WEIGHTS, ...weights };
    this.thresholds = { ...DEFAULT_THRESHOLDS, ...thresholds };
  }

  /**
   * Classify the patient's cognitive state from available signals.
   * At least one signal source must be provided.
   */
  classifyState(
    speech?: SpeechFeatures,
    behavior?: BehaviorFeatures,
    biometric?: BiometricFeatures
  ): StateClassification {
    if (!speech && !behavior && !biometric) {
      return this.defaultClassification();
    }

    const contributions: SignalContribution[] = [];
    const combinedScores = this.initializeScores();

    // Compute active weight total for redistribution
    let activeWeightTotal = 0;
    if (speech) activeWeightTotal += this.weights.speech;
    if (behavior) activeWeightTotal += this.weights.behavior;
    if (biometric) activeWeightTotal += this.weights.biometric;

    // Process each available signal source
    if (speech) {
      const speechScores = processSpeechSignals(speech);
      const normalizedWeight = this.weights.speech / activeWeightTotal;
      this.mergeScores(
        combinedScores,
        speechScores,
        normalizedWeight,
        'speech',
        contributions
      );
    }

    if (behavior) {
      const behaviorScores = processBehaviorSignals(behavior);
      const normalizedWeight = this.weights.behavior / activeWeightTotal;
      this.mergeScores(
        combinedScores,
        behaviorScores,
        normalizedWeight,
        'behavior',
        contributions
      );
    }

    if (biometric) {
      const biometricScores = processBiometricSignals(biometric);
      const normalizedWeight = this.weights.biometric / activeWeightTotal;
      this.mergeScores(
        combinedScores,
        biometricScores,
        normalizedWeight,
        'biometric',
        contributions
      );
    }

    // Find the winning state
    const { topState, topScore } = this.findTopState(combinedScores);
    const confidence = this.getConfidence(combinedScores, topScore);

    // Determine which signal source contributed most to the winning state
    const triggerSource = this.determineTriggerSource(contributions, topState);

    return {
      state: topState,
      confidence,
      triggerSource,
      signals: contributions.filter(
        (c) => c.score >= this.thresholds.minimumScore
      ),
      timestamp: Date.now(),
    };
  }

  /**
   * Calculate confidence based on the separation between the top score
   * and other competing scores.
   */
  getConfidence(scores: StateScores, topScore?: number): number {
    const sorted = Object.values(scores).sort((a, b) => b - a);
    const best = topScore ?? sorted[0];
    const secondBest = sorted[1] ?? 0;

    if (best <= 0) return 0;

    // Confidence is based on both the absolute score and how much it
    // separates from the next-best candidate.
    const separation = best - secondBest;
    const absoluteConfidence = Math.min(1, best);
    const separationConfidence = Math.min(1, separation / best + 0.3);

    return Math.min(1, absoluteConfidence * 0.6 + separationConfidence * 0.4);
  }

  /**
   * Update signal weights at runtime (e.g., based on which sensors are
   * most reliable for a given patient).
   */
  updateWeights(weights: Partial<SignalWeights>): void {
    this.weights = { ...this.weights, ...weights };
  }

  // -- Private helpers --

  private initializeScores(): StateScores {
    return {
      [CognitiveState.CALM]: 0,
      [CognitiveState.CONFUSED]: 0,
      [CognitiveState.ANXIOUS]: 0,
      [CognitiveState.DISORIENTED]: 0,
      [CognitiveState.AGITATED]: 0,
      [CognitiveState.SAD]: 0,
      [CognitiveState.ENGAGED]: 0,
    };
  }

  private mergeScores(
    combined: StateScores,
    source: StateScores,
    weight: number,
    sourceType: SignalSource,
    contributions: SignalContribution[]
  ): void {
    for (const state of Object.values(CognitiveState)) {
      const weighted = source[state] * weight;
      combined[state] += weighted;
      contributions.push({
        source: sourceType,
        state,
        score: source[state],
        weight,
      });
    }
  }

  private findTopState(scores: StateScores): {
    topState: CognitiveState;
    topScore: number;
  } {
    let topState = CognitiveState.CALM;
    let topScore = -1;

    for (const [state, score] of Object.entries(scores)) {
      if (score > topScore) {
        topScore = score;
        topState = state as CognitiveState;
      }
    }

    return { topState, topScore };
  }

  private determineTriggerSource(
    contributions: SignalContribution[],
    winningState: CognitiveState
  ): SignalSource {
    const sourceScores: Record<SignalSource, number> = {
      speech: 0,
      behavior: 0,
      biometric: 0,
      combined: 0,
    };

    for (const c of contributions) {
      if (c.state === winningState && c.source !== 'combined') {
        sourceScores[c.source] += c.score * c.weight;
      }
    }

    let topSource: SignalSource = 'combined';
    let topScore = -1;
    for (const [source, score] of Object.entries(sourceScores)) {
      if (source !== 'combined' && score > topScore) {
        topScore = score;
        topSource = source as SignalSource;
      }
    }

    // If multiple sources contributed roughly equally, mark as combined
    const scores = Object.entries(sourceScores)
      .filter(([s]) => s !== 'combined')
      .map(([, v]) => v)
      .filter((v) => v > 0);

    if (scores.length > 1) {
      const max = Math.max(...scores);
      const allClose = scores.every((s) => s >= max * 0.7);
      if (allClose) return 'combined';
    }

    return topSource;
  }

  private defaultClassification(): StateClassification {
    return {
      state: CognitiveState.CALM,
      confidence: 0,
      triggerSource: 'combined',
      signals: [],
      timestamp: Date.now(),
    };
  }
}
