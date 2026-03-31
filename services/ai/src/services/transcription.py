"""
Transcription Service

Handles speech-to-text transcription with hesitation marker detection.
Uses Whisper API when configured; falls back to stub for development.
"""

import logging
import os
import re
from typing import Any

logger = logging.getLogger("gentle-reminder.ai.transcription")

# Hesitation patterns commonly found in dementia patient speech
HESITATION_PATTERNS = [
    r"\b(um+)\b",
    r"\b(uh+)\b",
    r"\b(er+)\b",
    r"\b(ah+)\b",
    r"\b(hmm+)\b",
    r"\b(well\.{2,})\b",
    r"\b(you know)\b",
    r"\b(I mean)\b",
    r"\b(sort of)\b",
    r"\b(kind of)\b",
    r"\.{3,}",  # Extended ellipsis indicating trailing off
]

# Patterns indicating repeated questions
QUESTION_PATTERNS = [
    r"what (day|time) is it",
    r"where am i",
    r"who are you",
    r"what('s| is) (happening|going on)",
    r"when (are|is|do|did)",
    r"where (are|is) (my|the)",
]


class TranscriptionService:
    """Speech-to-text transcription with cognitive biomarker extraction."""

    def __init__(self):
        self.use_whisper = os.getenv("ENABLE_WHISPER_API", "false").lower() == "true"
        self.whisper_model = os.getenv("WHISPER_MODEL", "base")
        self._compiled_hesitation = [
            re.compile(p, re.IGNORECASE) for p in HESITATION_PATTERNS
        ]
        self._compiled_questions = [
            re.compile(p, re.IGNORECASE) for p in QUESTION_PATTERNS
        ]

        if self.use_whisper:
            logger.info("Whisper API enabled (model: %s)", self.whisper_model)
        else:
            logger.info("Whisper API disabled; using stub transcription")

    def transcribe(self, audio_bytes: bytes) -> dict[str, Any]:
        """
        Transcribe audio bytes to text.

        Returns:
            dict with keys: text, confidence, hesitation_markers, duration_seconds
        """
        if self.use_whisper:
            return self._transcribe_whisper(audio_bytes)
        return self._transcribe_stub(audio_bytes)

    def detect_hesitations(self, text: str) -> list[dict[str, Any]]:
        """
        Detect hesitation markers in transcript text.

        Returns a list of hesitation occurrences with type, match text,
        and character position.
        """
        markers: list[dict[str, Any]] = []

        for pattern in self._compiled_hesitation:
            for match in pattern.finditer(text):
                markers.append(
                    {
                        "type": "hesitation",
                        "text": match.group(),
                        "start": match.start(),
                        "end": match.end(),
                    }
                )

        # Sort by position in text
        markers.sort(key=lambda m: m["start"])
        return markers

    def detect_repeated_questions(self, text: str) -> list[dict[str, Any]]:
        """
        Detect questions that may indicate confusion or disorientation.

        Returns matched question patterns with frequency counts.
        """
        question_counts: dict[str, int] = {}
        results: list[dict[str, Any]] = []

        # Split into sentences
        sentences = re.split(r"[.!?]+", text)

        for sentence in sentences:
            sentence = sentence.strip().lower()
            for pattern in self._compiled_questions:
                match = pattern.search(sentence)
                if match:
                    key = match.group()
                    question_counts[key] = question_counts.get(key, 0) + 1

        for question, count in question_counts.items():
            results.append(
                {
                    "question_pattern": question,
                    "count": count,
                    "is_repeated": count > 1,
                }
            )

        return results

    def _transcribe_whisper(self, audio_bytes: bytes) -> dict[str, Any]:
        """
        Transcribe using OpenAI Whisper API.

        NOTE: This is scaffolded for integration. The actual API call
        requires the openai-whisper package and a valid model.
        """
        try:
            # Scaffold: In production, this would call whisper.load_model()
            # and process the audio. For now, we raise to fall back.
            # import whisper
            # model = whisper.load_model(self.whisper_model)
            # result = model.transcribe(audio_bytes)
            # return {
            #     "text": result["text"],
            #     "confidence": result.get("avg_logprob", 0.0),
            #     "hesitation_markers": self.detect_hesitations(result["text"]),
            #     "duration_seconds": result.get("duration"),
            # }
            raise NotImplementedError("Whisper integration pending deployment config")
        except Exception as e:
            logger.warning("Whisper transcription failed, using stub: %s", str(e))
            return self._transcribe_stub(audio_bytes)

    def _transcribe_stub(self, audio_bytes: bytes) -> dict[str, Any]:
        """
        Stub transcription for development and testing.

        Returns a placeholder result based on audio size to simulate
        processing behavior.
        """
        estimated_duration = len(audio_bytes) / 16000  # Rough estimate for 16kHz mono
        stub_text = (
            "Hello, um, I was just thinking about... "
            "what day is it? I went to the, uh, the place... "
            "you know, the garden. It was lovely."
        )

        logger.debug(
            "Stub transcription: %d bytes -> ~%.1fs",
            len(audio_bytes),
            estimated_duration,
        )

        return {
            "text": stub_text,
            "confidence": 0.75,
            "hesitation_markers": self.detect_hesitations(stub_text),
            "duration_seconds": estimated_duration,
        }
