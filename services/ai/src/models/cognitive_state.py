"""
Cognitive State Classification Model

Classifies a patient's current cognitive state from speech and
behavior features using threshold-based feature engineering.
Designed to mirror the TypeScript CognitiveStateEngine for
server-side classification.
"""

import logging
from typing import Any, Optional

logger = logging.getLogger("gentle-reminder.ai.models.cognitive_state")

# Cognitive states matching the TypeScript enum
COGNITIVE_STATES = [
    "CALM", "CONFUSED", "ANXIOUS", "DISORIENTED",
    "AGITATED", "SAD", "ENGAGED",
]

# Feature thresholds for speech biomarkers
SPEECH_THRESHOLDS = {
    "speech_rate": {"low": 80, "normal": 130, "high": 180},
    "hesitation_count": {"low": 0, "moderate": 3, "high": 8},
    "pause_duration_ms": {"short": 300, "normal": 700, "long": 1500},
    "pitch_variance": {"low": 10, "normal": 30, "high": 60},
    "repeated_questions": {"none": 0, "some": 1, "many": 3},
}

# Feature thresholds for behavior
BEHAVIOR_THRESHOLDS = {
    "activity_level": {"low": 20, "moderate": 50, "high": 75, "very_high": 90},
    "routine_adherence": {"low": 0.3, "moderate": 0.6, "good": 0.8},
    "social_interaction": {"low": 20, "moderate": 50, "good": 70},
}


def _normalize(value: float, low: float, high: float) -> float:
    """Normalize a value to 0-1 range between low and high."""
    if high == low:
        return 1.0 if value >= high else 0.0
    return max(0.0, min(1.0, (value - low) / (high - low)))


class CognitiveStateModel:
    """
    Threshold-based cognitive state classifier.

    Uses weighted feature scoring to classify the patient's state.
    Designed as a lightweight alternative to ML models for
    real-time classification.
    """

    def __init__(self):
        self.speech_weight = 0.55
        self.behavior_weight = 0.45
        logger.info("CognitiveStateModel initialized")

    def classify(
        self,
        speech_features: Optional[dict[str, Any]] = None,
        behavior_features: Optional[dict[str, Any]] = None,
    ) -> dict[str, Any]:
        """
        Classify cognitive state from available features.

        Args:
            speech_features: dict with speech_rate, hesitation_count,
                           pause_duration_ms, pitch_variance, repeated_questions
            behavior_features: dict with activity_level, routine_adherence,
                             social_interaction, wandering_flag

        Returns:
            dict with state, confidence, scores, and contributing_features
        """
        scores = {state: 0.0 for state in COGNITIVE_STATES}
        contributing: list[dict[str, Any]] = []

        # Compute active weights
        total_weight = 0.0
        if speech_features:
            total_weight += self.speech_weight
        if behavior_features:
            total_weight += self.behavior_weight

        if total_weight == 0:
            return self._default_result()

        # Process speech features
        if speech_features:
            weight = self.speech_weight / total_weight
            speech_scores = self._score_speech(speech_features)
            for state in COGNITIVE_STATES:
                scores[state] += speech_scores[state] * weight
            contributing.append({
                "source": "speech",
                "weight": round(weight, 3),
                "raw_scores": {k: round(v, 3) for k, v in speech_scores.items()},
            })

        # Process behavior features
        if behavior_features:
            weight = self.behavior_weight / total_weight
            behavior_scores = self._score_behavior(behavior_features)
            for state in COGNITIVE_STATES:
                scores[state] += behavior_scores[state] * weight
            contributing.append({
                "source": "behavior",
                "weight": round(weight, 3),
                "raw_scores": {k: round(v, 3) for k, v in behavior_scores.items()},
            })

        # Find the top state
        top_state = max(scores, key=scores.get)
        top_score = scores[top_state]

        # Compute confidence
        sorted_scores = sorted(scores.values(), reverse=True)
        second_best = sorted_scores[1] if len(sorted_scores) > 1 else 0
        separation = top_score - second_best

        if top_score > 0:
            confidence = min(0.95, 0.3 + separation / top_score * 0.5 + top_score * 0.2)
        else:
            confidence = 0.0

        return {
            "state": top_state,
            "confidence": round(confidence, 3),
            "scores": {k: round(v, 3) for k, v in scores.items()},
            "contributing_features": contributing,
        }

    def _score_speech(self, features: dict[str, Any]) -> dict[str, float]:
        """Score each cognitive state based on speech features."""
        scores = {state: 0.0 for state in COGNITIVE_STATES}

        sr = features.get("speech_rate", 130)
        hc = features.get("hesitation_count", 0)
        pd = features.get("pause_duration_ms", 700)
        pv = features.get("pitch_variance", 30)
        rq = features.get("repeated_questions", 0)

        th = SPEECH_THRESHOLDS

        hesitation_norm = _normalize(hc, th["hesitation_count"]["moderate"], th["hesitation_count"]["high"])
        repetition_norm = _normalize(rq, th["repeated_questions"]["some"], th["repeated_questions"]["many"])
        fast_speech = _normalize(sr, th["speech_rate"]["normal"], th["speech_rate"]["high"])
        high_pitch = _normalize(pv, th["pitch_variance"]["normal"], th["pitch_variance"]["high"])
        slow_speech = _normalize(th["speech_rate"]["normal"] - sr, 0, th["speech_rate"]["normal"] - th["speech_rate"]["low"])
        long_pause = _normalize(pd, th["pause_duration_ms"]["normal"], th["pause_duration_ms"]["long"])

        # CONFUSED: high hesitation + repeated questions
        scores["CONFUSED"] = hesitation_norm * 0.5 + repetition_norm * 0.5

        # ANXIOUS: fast speech + high pitch
        scores["ANXIOUS"] = fast_speech * 0.5 + high_pitch * 0.5

        # SAD: slow speech + long pauses
        scores["SAD"] = slow_speech * 0.5 + long_pause * 0.5

        # AGITATED: very fast speech + high pitch + hesitation
        very_fast = _normalize(sr, th["speech_rate"]["high"], th["speech_rate"]["high"] * 1.3)
        scores["AGITATED"] = very_fast * 0.4 + high_pitch * 0.3 + hesitation_norm * 0.3

        # DISORIENTED: repeated questions + hesitation + pauses
        scores["DISORIENTED"] = repetition_norm * 0.6 + hesitation_norm * 0.2 + long_pause * 0.2

        # ENGAGED: normal rate, low hesitation
        normal_rate = 1.0 - abs(sr - th["speech_rate"]["normal"]) / (th["speech_rate"]["high"] - th["speech_rate"]["low"])
        scores["ENGAGED"] = max(0, normal_rate) * 0.5 + (1.0 - hesitation_norm) * 0.5

        # CALM: inverse of distress
        max_distress = max(scores["CONFUSED"], scores["ANXIOUS"], scores["SAD"], scores["AGITATED"])
        scores["CALM"] = max(0, 1.0 - max_distress)

        return scores

    def _score_behavior(self, features: dict[str, Any]) -> dict[str, float]:
        """Score each cognitive state based on behavior features."""
        scores = {state: 0.0 for state in COGNITIVE_STATES}

        al = features.get("activity_level", 50)
        ra = features.get("routine_adherence", 0.7)
        si = features.get("social_interaction", 50)
        wf = features.get("wandering_flag", False)

        th = BEHAVIOR_THRESHOLDS

        low_activity = _normalize(100 - al, 50, 90)
        high_activity = _normalize(al, th["activity_level"]["high"], th["activity_level"]["very_high"])
        low_social = _normalize(100 - si, 50, 90)
        routine_break = _normalize(1.0 - ra, 0.4, 0.8)
        low_routine = _normalize(1.0 - ra, 0.3, 0.8)
        good_social = _normalize(si, th["social_interaction"]["moderate"], th["social_interaction"]["good"])

        # DISORIENTED: wandering is the strongest indicator
        wandering_score = 0.8 if wf else 0.0
        scores["DISORIENTED"] = wandering_score * 0.7 + low_routine * 0.3

        # SAD: low activity + low social
        scores["SAD"] = low_activity * 0.5 + low_social * 0.5

        # AGITATED: high activity + low routine adherence
        scores["AGITATED"] = high_activity * 0.5 + routine_break * 0.5

        # ANXIOUS: moderate-high activity + low social
        mod_high = _normalize(al, 55, 80)
        scores["ANXIOUS"] = mod_high * 0.4 + low_social * 0.3 + routine_break * 0.3

        # CONFUSED: routine deviation
        routine_dev = _normalize(1.0 - ra, 0.2, 0.6)
        scores["CONFUSED"] = routine_dev * 0.6 + (0.2 if wf else 0.0) * 0.4

        # ENGAGED: good social + moderate activity
        moderate_act = 1.0 - abs(al - 50) / 50
        scores["ENGAGED"] = good_social * 0.5 + max(0, moderate_act) * 0.3 + ra * 0.2

        # CALM: good routine + moderate activity + no wandering
        no_wandering = 0.0 if wf else 1.0
        scores["CALM"] = ra * 0.4 + max(0, moderate_act) * 0.3 + no_wandering * 0.3

        return scores

    def _default_result(self) -> dict[str, Any]:
        return {
            "state": "CALM",
            "confidence": 0.0,
            "scores": {state: 0.0 for state in COGNITIVE_STATES},
            "contributing_features": [],
        }
