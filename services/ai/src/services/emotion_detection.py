"""
Emotion Detection Service

Classifies emotional tone from text and optional audio features.
Uses keyword pattern matching and sentiment scoring as a baseline,
with scaffolding for ML model integration.
"""

import logging
import re
from typing import Any, Optional

logger = logging.getLogger("gentle-reminder.ai.emotion")


# Keyword patterns associated with each emotion
EMOTION_KEYWORDS: dict[str, list[str]] = {
    "calm": [
        "nice", "good", "fine", "okay", "pleasant", "comfortable",
        "peaceful", "relaxed", "quiet", "gentle", "lovely",
    ],
    "anxious": [
        "worried", "scared", "afraid", "nervous", "panic", "help",
        "wrong", "danger", "lost", "alone", "frightened", "hurry",
        "can't", "don't know", "what if",
    ],
    "confused": [
        "don't understand", "what", "where", "who", "when", "why",
        "forgot", "remember", "lost", "don't know", "confused",
        "which", "how", "again",
    ],
    "sad": [
        "sad", "miss", "lonely", "cry", "gone", "lost", "wish",
        "tired", "hurt", "sorry", "never", "used to", "before",
        "remember when", "passed away",
    ],
    "agitated": [
        "stop", "leave", "go away", "no", "hate", "angry", "mad",
        "want", "need", "now", "can't stand", "enough", "shut up",
        "frustrated",
    ],
    "engaged": [
        "love", "wonderful", "tell me", "really", "amazing", "great",
        "interesting", "yes", "more", "exciting", "beautiful", "happy",
        "laugh", "fun", "enjoy",
    ],
}

# Sentence-level sentiment patterns
POSITIVE_PATTERNS = [
    r"\b(happy|glad|pleased|wonderful|great|love|enjoy|beautiful)\b",
    r"\b(thank|grateful|appreciate)\b",
    r"!\s*$",  # Exclamation marks often indicate engagement
]

NEGATIVE_PATTERNS = [
    r"\b(hate|angry|upset|terrible|horrible|awful|worst)\b",
    r"\b(can't|won't|don't want|never)\b",
    r"\b(pain|hurt|suffering|miserable)\b",
]


class EmotionDetector:
    """Detects emotional tone from text and audio features."""

    def __init__(self):
        self._keyword_patterns: dict[str, list[re.Pattern]] = {}
        for emotion, keywords in EMOTION_KEYWORDS.items():
            self._keyword_patterns[emotion] = [
                re.compile(rf"\b{re.escape(kw)}\b", re.IGNORECASE)
                for kw in keywords
            ]

        self._positive_patterns = [
            re.compile(p, re.IGNORECASE) for p in POSITIVE_PATTERNS
        ]
        self._negative_patterns = [
            re.compile(p, re.IGNORECASE) for p in NEGATIVE_PATTERNS
        ]

        logger.info("EmotionDetector initialized with keyword patterns")

    def detect_emotion(
        self,
        text: str,
        audio_features: Optional[dict[str, Any]] = None,
    ) -> dict[str, Any]:
        """
        Detect the predominant emotion in text.

        Args:
            text: Transcript or text to analyze
            audio_features: Optional dict with keys like speech_rate,
                          pitch_variance, pause_duration

        Returns:
            dict with emotion, confidence, scores, and indicators
        """
        # Keyword-based scoring
        keyword_scores = self._score_keywords(text)

        # Sentiment-based adjustment
        sentiment = self._score_sentiment(text)
        self._apply_sentiment_adjustment(keyword_scores, sentiment)

        # Audio feature adjustment (if available)
        indicators: list[str] = []
        if audio_features:
            self._apply_audio_features(keyword_scores, audio_features, indicators)

        # Determine winner
        top_emotion = max(keyword_scores, key=keyword_scores.get)
        top_score = keyword_scores[top_emotion]

        # Calculate confidence based on separation
        sorted_scores = sorted(keyword_scores.values(), reverse=True)
        if top_score > 0 and len(sorted_scores) > 1:
            separation = top_score - sorted_scores[1]
            confidence = min(0.95, 0.4 + (separation / max(top_score, 1)) * 0.5)
        else:
            confidence = 0.3  # Low confidence when no keywords matched

        # Add keyword indicators
        indicators.extend(self._get_keyword_indicators(text, top_emotion))

        return {
            "emotion": top_emotion,
            "confidence": round(confidence, 3),
            "scores": {k: round(v, 3) for k, v in keyword_scores.items()},
            "indicators": indicators,
            "sentiment": sentiment,
        }

    def _score_keywords(self, text: str) -> dict[str, float]:
        """Score each emotion based on keyword frequency."""
        scores: dict[str, float] = {emotion: 0.0 for emotion in EMOTION_KEYWORDS}
        text_lower = text.lower()
        word_count = max(len(text_lower.split()), 1)

        for emotion, patterns in self._keyword_patterns.items():
            match_count = 0
            for pattern in patterns:
                match_count += len(pattern.findall(text_lower))
            # Normalize by text length to avoid bias toward longer text
            scores[emotion] = match_count / (word_count ** 0.5)

        return scores

    def _score_sentiment(self, text: str) -> dict[str, float]:
        """Basic positive/negative sentiment scoring."""
        positive_count = sum(
            len(p.findall(text)) for p in self._positive_patterns
        )
        negative_count = sum(
            len(p.findall(text)) for p in self._negative_patterns
        )

        total = positive_count + negative_count
        if total == 0:
            return {"positive": 0.5, "negative": 0.5, "valence": 0.0}

        return {
            "positive": positive_count / total,
            "negative": negative_count / total,
            "valence": (positive_count - negative_count) / total,
        }

    def _apply_sentiment_adjustment(
        self, scores: dict[str, float], sentiment: dict[str, float]
    ) -> None:
        """Adjust emotion scores based on overall sentiment."""
        valence = sentiment["valence"]

        # Positive valence boosts calm and engaged
        if valence > 0:
            scores["calm"] += valence * 0.3
            scores["engaged"] += valence * 0.2
        # Negative valence boosts sad and agitated
        elif valence < 0:
            scores["sad"] += abs(valence) * 0.2
            scores["agitated"] += abs(valence) * 0.15

    def _apply_audio_features(
        self,
        scores: dict[str, float],
        audio_features: dict[str, Any],
        indicators: list[str],
    ) -> None:
        """Adjust scores based on audio prosodic features."""
        speech_rate = audio_features.get("speech_rate")
        pitch_variance = audio_features.get("pitch_variance")
        pause_duration = audio_features.get("pause_duration")

        if speech_rate is not None:
            if speech_rate > 170:
                scores["anxious"] += 0.3
                indicators.append("elevated_speech_rate")
            elif speech_rate < 80:
                scores["sad"] += 0.3
                indicators.append("slow_speech_rate")

        if pitch_variance is not None:
            if pitch_variance > 50:
                scores["anxious"] += 0.2
                scores["agitated"] += 0.15
                indicators.append("high_pitch_variance")

        if pause_duration is not None:
            if pause_duration > 1200:
                scores["confused"] += 0.25
                scores["sad"] += 0.15
                indicators.append("long_pauses")

    def _get_keyword_indicators(self, text: str, emotion: str) -> list[str]:
        """Get the specific keywords that contributed to the classification."""
        indicators: list[str] = []
        if emotion not in self._keyword_patterns:
            return indicators

        for pattern in self._keyword_patterns[emotion]:
            matches = pattern.findall(text.lower())
            if matches:
                indicators.append(f"keyword:{matches[0]}")

        return indicators[:5]  # Limit to top 5 indicators
