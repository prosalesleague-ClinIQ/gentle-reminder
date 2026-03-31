"""
Story Summarization Service

Summarizes patient stories and conversations, extracting key people,
places, events, and emotional tone. Uses extractive summarization
with sentence scoring and keyword extraction.
"""

import logging
import re
from collections import Counter
from typing import Any

logger = logging.getLogger("gentle-reminder.ai.summarization")

# Common stop words to exclude from keyword extraction
STOP_WORDS = frozenset({
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "was", "are", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "shall", "can", "i", "me", "my",
    "we", "our", "you", "your", "he", "she", "it", "they", "them", "this",
    "that", "these", "those", "not", "no", "so", "if", "then", "than",
    "just", "about", "very", "really", "also", "up", "out", "all", "some",
    "there", "here", "when", "what", "which", "who", "how", "as", "into",
})

# Patterns for named entity extraction (simple rule-based)
PERSON_PATTERNS = [
    r"\b(?:my|our)\s+(mother|father|sister|brother|husband|wife|son|daughter|grandmother|grandfather|granddaughter|grandson|uncle|aunt|cousin|friend|neighbor|doctor|nurse)\b",
    r"\b(?:Mrs?|Ms|Dr|Prof)\.?\s+[A-Z][a-z]+\b",
    r"\b[A-Z][a-z]{2,}\b(?=\s+(?:said|told|asked|went|came|was|loved|used to))",
]

PLACE_PATTERNS = [
    r"\b(?:in|at|to|from|near)\s+(?:the\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b",
    r"\b(?:the\s+)?(garden|kitchen|park|church|school|hospital|house|home|shop|market|beach|farm|lake|river)\b",
    r"\b(?:my|our|the)\s+(hometown|village|city|street|road|neighborhood)\b",
]

# Emotional tone keywords
TONE_KEYWORDS = {
    "nostalgic": ["remember", "used to", "back then", "those days", "years ago", "when I was"],
    "happy": ["happy", "joy", "wonderful", "beautiful", "love", "laugh", "fun", "great"],
    "sad": ["sad", "miss", "lost", "gone", "passed", "died", "never again", "wish"],
    "warm": ["family", "together", "home", "love", "care", "gentle", "kind"],
    "proud": ["proud", "achieved", "accomplished", "won", "built", "created", "first"],
    "anxious": ["worried", "scared", "afraid", "nervous", "unsure", "don't know"],
}


class StorySummarizer:
    """Summarizes stories with entity and tone extraction."""

    def __init__(self):
        self._person_patterns = [
            re.compile(p, re.IGNORECASE) for p in PERSON_PATTERNS
        ]
        self._place_patterns = [re.compile(p, re.IGNORECASE) for p in PLACE_PATTERNS]
        logger.info("StorySummarizer initialized")

    def summarize(
        self, text: str, max_sentences: int = 5
    ) -> dict[str, Any]:
        """
        Produce an extractive summary with entity and tone extraction.

        Args:
            text: Full story text to summarize
            max_sentences: Maximum sentences in the summary

        Returns:
            dict with summary, key_people, key_places, key_events,
            emotional_tone, word_count
        """
        sentences = self._split_sentences(text)
        if not sentences:
            return self._empty_result()

        words = text.lower().split()
        word_count = len(words)

        # Score and rank sentences
        sentence_scores = self._score_sentences(sentences, words)

        # Select top sentences maintaining original order
        ranked = sorted(
            enumerate(sentence_scores),
            key=lambda x: x[1],
            reverse=True,
        )
        top_indices = sorted([idx for idx, _ in ranked[:max_sentences]])
        summary_sentences = [sentences[i] for i in top_indices]
        summary = " ".join(summary_sentences)

        # Extract entities
        key_people = self._extract_people(text)
        key_places = self._extract_places(text)
        key_events = self._extract_events(sentences, sentence_scores)

        # Detect emotional tone
        emotional_tone = self._detect_tone(text)

        return {
            "summary": summary,
            "key_people": key_people,
            "key_places": key_places,
            "key_events": key_events,
            "emotional_tone": emotional_tone,
            "word_count": word_count,
            "sentence_count": len(sentences),
            "compression_ratio": round(
                len(summary_sentences) / max(len(sentences), 1), 2
            ),
        }

    def _split_sentences(self, text: str) -> list[str]:
        """Split text into sentences."""
        # Handle common abbreviations to avoid false splits
        cleaned = text.replace("Mr.", "Mr").replace("Mrs.", "Mrs")
        cleaned = cleaned.replace("Dr.", "Dr").replace("Ms.", "Ms")

        raw = re.split(r"(?<=[.!?])\s+", cleaned)
        return [s.strip() for s in raw if len(s.strip()) > 10]

    def _score_sentences(
        self, sentences: list[str], all_words: list[str]
    ) -> list[float]:
        """
        Score sentences using multiple heuristics:
        - Keyword frequency (TF-based)
        - Position bias (first and last sentences score higher)
        - Length normalization
        - Entity presence bonus
        """
        # Build word frequency (excluding stop words)
        word_freq = Counter(
            w for w in all_words if w not in STOP_WORDS and len(w) > 2
        )
        max_freq = max(word_freq.values()) if word_freq else 1

        scores: list[float] = []
        n = len(sentences)

        for i, sentence in enumerate(sentences):
            words = sentence.lower().split()
            if not words:
                scores.append(0.0)
                continue

            # TF-based score
            tf_score = sum(
                word_freq.get(w, 0) / max_freq
                for w in words
                if w not in STOP_WORDS
            ) / len(words)

            # Position bias: first 2 and last sentence get a boost
            position_score = 0.0
            if i < 2:
                position_score = 0.15 * (2 - i)
            elif i == n - 1:
                position_score = 0.1

            # Length normalization: prefer medium-length sentences
            length_score = min(len(words) / 20, 1.0) * 0.1

            # Entity bonus
            entity_score = 0.0
            for pattern in self._person_patterns + self._place_patterns:
                if pattern.search(sentence):
                    entity_score += 0.1
            entity_score = min(entity_score, 0.3)

            total = tf_score + position_score + length_score + entity_score
            scores.append(total)

        return scores

    def _extract_people(self, text: str) -> list[str]:
        """Extract mentioned people using pattern matching."""
        people: set[str] = set()

        for pattern in self._person_patterns:
            for match in pattern.finditer(text):
                person = match.group().strip()
                # Clean up possessives
                person = re.sub(r"^(my|our)\s+", "", person, flags=re.IGNORECASE)
                people.add(person.title())

        return sorted(people)[:10]

    def _extract_places(self, text: str) -> list[str]:
        """Extract mentioned places using pattern matching."""
        places: set[str] = set()

        for pattern in self._place_patterns:
            for match in pattern.finditer(text):
                # Use the first capture group if available, else the full match
                place = match.group(1) if match.lastindex else match.group()
                place = place.strip()
                if len(place) > 2 and place.lower() not in STOP_WORDS:
                    places.add(place.title())

        return sorted(places)[:10]

    def _extract_events(
        self, sentences: list[str], scores: list[float]
    ) -> list[str]:
        """
        Extract key events as the highest-scoring sentences
        that contain action verbs.
        """
        action_patterns = re.compile(
            r"\b(went|came|built|started|married|moved|opened|won|found|"
            r"celebrated|graduated|worked|traveled|visited|met|joined|"
            r"bought|sold|born|died|retired)\b",
            re.IGNORECASE,
        )

        events: list[tuple[float, str]] = []
        for i, sentence in enumerate(sentences):
            if action_patterns.search(sentence):
                events.append((scores[i], sentence.strip()))

        events.sort(key=lambda x: x[0], reverse=True)
        return [e[1] for e in events[:5]]

    def _detect_tone(self, text: str) -> dict[str, Any]:
        """Detect the overall emotional tone of the story."""
        text_lower = text.lower()
        tone_scores: dict[str, int] = {}

        for tone, keywords in TONE_KEYWORDS.items():
            count = sum(1 for kw in keywords if kw in text_lower)
            if count > 0:
                tone_scores[tone] = count

        if not tone_scores:
            return {"primary": "neutral", "secondary": None, "scores": {}}

        sorted_tones = sorted(
            tone_scores.items(), key=lambda x: x[1], reverse=True
        )
        primary = sorted_tones[0][0]
        secondary = sorted_tones[1][0] if len(sorted_tones) > 1 else None

        return {
            "primary": primary,
            "secondary": secondary,
            "scores": tone_scores,
        }

    def _empty_result(self) -> dict[str, Any]:
        return {
            "summary": "",
            "key_people": [],
            "key_places": [],
            "key_events": [],
            "emotional_tone": {
                "primary": "neutral",
                "secondary": None,
                "scores": {},
            },
            "word_count": 0,
            "sentence_count": 0,
            "compression_ratio": 0,
        }
