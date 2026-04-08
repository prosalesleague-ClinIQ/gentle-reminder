"""
Transcription Service

Handles speech-to-text transcription with hesitation marker detection.
Supports three modes via WHISPER_MODE env var:
  - 'local'  : loads openai-whisper model on-device
  - 'api'    : uses OpenAI Whisper API (requires OPENAI_API_KEY)
  - 'stub'   : demo fallback with synthetic transcription (default)
"""

import io
import logging
import os
import re
import time
from typing import Any, Optional

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

# Retry configuration
MAX_RETRIES = 3
RETRY_BASE_DELAY = 1.0  # seconds


class TranscriptionService:
    """Speech-to-text transcription with cognitive biomarker extraction."""

    def __init__(self):
        self.whisper_mode = os.getenv("WHISPER_MODE", "stub").lower()
        # Legacy env var support
        if (
            self.whisper_mode == "stub"
            and os.getenv("ENABLE_WHISPER_API", "false").lower() == "true"
        ):
            self.whisper_mode = "api"

        self.whisper_model_name = os.getenv("WHISPER_MODEL", "base")
        self._compiled_hesitation = [
            re.compile(p, re.IGNORECASE) for p in HESITATION_PATTERNS
        ]
        self._compiled_questions = [
            re.compile(p, re.IGNORECASE) for p in QUESTION_PATTERNS
        ]

        # Lazy-loaded components
        self._local_model = None
        self._openai_client = None
        self._preprocessor = None
        self._cache = None

        # Initialize preprocessor and cache
        self._init_preprocessor()
        self._init_cache()

        logger.info(
            "Transcription service initialized (mode=%s, model=%s)",
            self.whisper_mode,
            self.whisper_model_name,
        )

    # ------------------------------------------------------------------
    # Initialization helpers
    # ------------------------------------------------------------------

    def _init_preprocessor(self) -> None:
        """Initialize the audio preprocessor if pydub is available."""
        try:
            from services.audio_preprocessor import AudioPreprocessor

            self._preprocessor = AudioPreprocessor()
            logger.info("Audio preprocessor initialized")
        except Exception as e:
            logger.warning("Audio preprocessor unavailable: %s", e)
            self._preprocessor = None

    def _init_cache(self) -> None:
        """Initialize the transcription cache."""
        try:
            from services.transcription_cache import TranscriptionCache

            max_size = int(os.getenv("TRANSCRIPTION_CACHE_SIZE", "256"))
            ttl = int(os.getenv("TRANSCRIPTION_CACHE_TTL", str(24 * 3600)))
            self._cache = TranscriptionCache(max_size=max_size, ttl_seconds=ttl)
            logger.info("Transcription cache initialized (max=%d, ttl=%ds)", max_size, ttl)
        except Exception as e:
            logger.warning("Transcription cache unavailable: %s", e)
            self._cache = None

    def _get_local_model(self):
        """Lazy-load the local Whisper model."""
        if self._local_model is None:
            import whisper

            logger.info("Loading local Whisper model: %s", self.whisper_model_name)
            self._local_model = whisper.load_model(self.whisper_model_name)
            logger.info("Whisper model loaded")
        return self._local_model

    def _get_openai_client(self):
        """Lazy-load the OpenAI client."""
        if self._openai_client is None:
            from openai import OpenAI

            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                raise ValueError(
                    "OPENAI_API_KEY environment variable is required for API mode"
                )
            self._openai_client = OpenAI(api_key=api_key)
            logger.info("OpenAI client initialized")
        return self._openai_client

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def transcribe(self, audio_bytes: bytes) -> dict[str, Any]:
        """
        Transcribe audio bytes to text.

        Returns:
            dict with keys: text, confidence, hesitation_markers, duration_seconds
        """
        # Check cache first
        if self._cache is not None:
            cached = self._cache.get(audio_bytes)
            if cached is not None:
                logger.debug("Returning cached transcription")
                return cached

        # Preprocess audio if preprocessor is available
        processed_audio = self._preprocess(audio_bytes)

        # Route to the appropriate backend
        if self.whisper_mode == "local":
            result = self._transcribe_local(processed_audio)
        elif self.whisper_mode == "api":
            result = self._transcribe_api(processed_audio)
        else:
            result = self._transcribe_stub(audio_bytes)

        # Cache the result
        if self._cache is not None and self.whisper_mode != "stub":
            self._cache.set(audio_bytes, result)

        return result

    def transcribe_with_timestamps(self, audio_bytes: bytes) -> dict[str, Any]:
        """
        Transcribe audio with word-level timestamps.

        Returns:
            dict with keys: text, confidence, hesitation_markers,
            duration_seconds, words (list of {word, start, end})
        """
        # Check cache (use a distinct key by appending a sentinel)
        ts_key = audio_bytes + b"__timestamps__"
        if self._cache is not None:
            cached = self._cache.get(ts_key)
            if cached is not None:
                return cached

        processed_audio = self._preprocess(audio_bytes)

        if self.whisper_mode == "local":
            result = self._transcribe_local_with_timestamps(processed_audio)
        elif self.whisper_mode == "api":
            result = self._transcribe_api_with_timestamps(processed_audio)
        else:
            result = self._transcribe_stub_with_timestamps(audio_bytes)

        if self._cache is not None and self.whisper_mode != "stub":
            self._cache.set(ts_key, result)

        return result

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

    @property
    def cache(self):
        """Expose the cache for stats reporting."""
        return self._cache

    # ------------------------------------------------------------------
    # Audio preprocessing
    # ------------------------------------------------------------------

    def _preprocess(self, audio_bytes: bytes) -> bytes:
        """Resample and trim audio if the preprocessor is available."""
        if self._preprocessor is None:
            return audio_bytes
        try:
            resampled = self._preprocessor.resample(audio_bytes, target_rate=16000)
            trimmed = self._preprocessor.trim_silence(resampled)
            return trimmed
        except Exception as e:
            logger.warning("Audio preprocessing failed, using raw bytes: %s", e)
            return audio_bytes

    # ------------------------------------------------------------------
    # Local Whisper backend
    # ------------------------------------------------------------------

    def _transcribe_local(self, audio_bytes: bytes) -> dict[str, Any]:
        """Transcribe using the local openai-whisper model with retry."""
        import tempfile

        for attempt in range(1, MAX_RETRIES + 1):
            try:
                model = self._get_local_model()

                # Whisper expects a file path; write to a temp file
                with tempfile.NamedTemporaryFile(suffix=".wav", delete=True) as tmp:
                    tmp.write(audio_bytes)
                    tmp.flush()
                    result = model.transcribe(tmp.name)

                text = result.get("text", "").strip()
                return {
                    "text": text,
                    "confidence": self._logprob_to_confidence(
                        result.get("segments", [])
                    ),
                    "hesitation_markers": self.detect_hesitations(text),
                    "duration_seconds": result.get("duration"),
                }
            except Exception as e:
                delay = RETRY_BASE_DELAY * (2 ** (attempt - 1))
                logger.warning(
                    "Local Whisper attempt %d/%d failed: %s (retry in %.1fs)",
                    attempt,
                    MAX_RETRIES,
                    e,
                    delay,
                )
                if attempt == MAX_RETRIES:
                    logger.error("All local Whisper retries exhausted, using stub")
                    return self._transcribe_stub(audio_bytes)
                time.sleep(delay)

        # Should not reach here, but satisfy type checker
        return self._transcribe_stub(audio_bytes)

    def _transcribe_local_with_timestamps(
        self, audio_bytes: bytes
    ) -> dict[str, Any]:
        """Local Whisper transcription with word-level timestamps."""
        import tempfile

        for attempt in range(1, MAX_RETRIES + 1):
            try:
                model = self._get_local_model()

                with tempfile.NamedTemporaryFile(suffix=".wav", delete=True) as tmp:
                    tmp.write(audio_bytes)
                    tmp.flush()
                    result = model.transcribe(tmp.name, word_timestamps=True)

                text = result.get("text", "").strip()
                words = []
                for seg in result.get("segments", []):
                    for w in seg.get("words", []):
                        words.append(
                            {
                                "word": w.get("word", "").strip(),
                                "start": round(w.get("start", 0.0), 3),
                                "end": round(w.get("end", 0.0), 3),
                            }
                        )

                return {
                    "text": text,
                    "confidence": self._logprob_to_confidence(
                        result.get("segments", [])
                    ),
                    "hesitation_markers": self.detect_hesitations(text),
                    "duration_seconds": result.get("duration"),
                    "words": words,
                }
            except Exception as e:
                delay = RETRY_BASE_DELAY * (2 ** (attempt - 1))
                logger.warning(
                    "Local Whisper timestamps attempt %d/%d failed: %s",
                    attempt,
                    MAX_RETRIES,
                    e,
                )
                if attempt == MAX_RETRIES:
                    return self._transcribe_stub_with_timestamps(audio_bytes)
                time.sleep(delay)

        return self._transcribe_stub_with_timestamps(audio_bytes)

    # ------------------------------------------------------------------
    # OpenAI API backend
    # ------------------------------------------------------------------

    def _transcribe_api(self, audio_bytes: bytes) -> dict[str, Any]:
        """Transcribe using the OpenAI Whisper API with retry."""
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                client = self._get_openai_client()
                audio_file = io.BytesIO(audio_bytes)
                audio_file.name = "audio.wav"

                response = client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    response_format="verbose_json",
                )

                text = response.text.strip()
                duration = getattr(response, "duration", None)

                return {
                    "text": text,
                    "confidence": self._api_segments_confidence(
                        getattr(response, "segments", [])
                    ),
                    "hesitation_markers": self.detect_hesitations(text),
                    "duration_seconds": duration,
                }
            except Exception as e:
                delay = RETRY_BASE_DELAY * (2 ** (attempt - 1))
                logger.warning(
                    "API Whisper attempt %d/%d failed: %s (retry in %.1fs)",
                    attempt,
                    MAX_RETRIES,
                    e,
                    delay,
                )
                if attempt == MAX_RETRIES:
                    logger.error("All API Whisper retries exhausted, using stub")
                    return self._transcribe_stub(audio_bytes)
                time.sleep(delay)

        return self._transcribe_stub(audio_bytes)

    def _transcribe_api_with_timestamps(
        self, audio_bytes: bytes
    ) -> dict[str, Any]:
        """OpenAI API transcription with word-level timestamps."""
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                client = self._get_openai_client()
                audio_file = io.BytesIO(audio_bytes)
                audio_file.name = "audio.wav"

                response = client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    response_format="verbose_json",
                    timestamp_granularities=["word"],
                )

                text = response.text.strip()
                words = []
                for w in getattr(response, "words", []):
                    words.append(
                        {
                            "word": w.get("word", "").strip() if isinstance(w, dict) else getattr(w, "word", "").strip(),
                            "start": round(
                                w.get("start", 0.0) if isinstance(w, dict) else getattr(w, "start", 0.0), 3
                            ),
                            "end": round(
                                w.get("end", 0.0) if isinstance(w, dict) else getattr(w, "end", 0.0), 3
                            ),
                        }
                    )

                return {
                    "text": text,
                    "confidence": self._api_segments_confidence(
                        getattr(response, "segments", [])
                    ),
                    "hesitation_markers": self.detect_hesitations(text),
                    "duration_seconds": getattr(response, "duration", None),
                    "words": words,
                }
            except Exception as e:
                delay = RETRY_BASE_DELAY * (2 ** (attempt - 1))
                logger.warning(
                    "API timestamps attempt %d/%d failed: %s",
                    attempt,
                    MAX_RETRIES,
                    e,
                )
                if attempt == MAX_RETRIES:
                    return self._transcribe_stub_with_timestamps(audio_bytes)
                time.sleep(delay)

        return self._transcribe_stub_with_timestamps(audio_bytes)

    # ------------------------------------------------------------------
    # Stub backend (demo / development)
    # ------------------------------------------------------------------

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

    def _transcribe_stub_with_timestamps(
        self, audio_bytes: bytes
    ) -> dict[str, Any]:
        """Stub transcription with synthetic word timestamps."""
        result = self._transcribe_stub(audio_bytes)
        words_text = result["text"].split()
        words = []
        t = 0.0
        for w in words_text:
            word_dur = 0.3
            words.append(
                {"word": w, "start": round(t, 3), "end": round(t + word_dur, 3)}
            )
            t += word_dur + 0.05
        result["words"] = words
        return result

    # ------------------------------------------------------------------
    # Confidence helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _logprob_to_confidence(segments: list) -> float:
        """Convert average log-probability from Whisper segments to 0-1 confidence."""
        if not segments:
            return 0.0
        total_logprob = 0.0
        count = 0
        for seg in segments:
            lp = seg.get("avg_logprob")
            if lp is not None:
                total_logprob += lp
                count += 1
        if count == 0:
            return 0.0
        # avg_logprob is typically negative; map roughly to 0-1
        import math

        avg = total_logprob / count
        return round(min(1.0, max(0.0, math.exp(avg))), 4)

    @staticmethod
    def _api_segments_confidence(segments) -> float:
        """Extract confidence from API verbose_json segments."""
        if not segments:
            return 0.85  # Reasonable default for API responses
        total = 0.0
        count = 0
        for seg in segments:
            lp = seg.get("avg_logprob") if isinstance(seg, dict) else getattr(seg, "avg_logprob", None)
            if lp is not None:
                total += lp
                count += 1
        if count == 0:
            return 0.85
        import math

        avg = total / count
        return round(min(1.0, max(0.0, math.exp(avg))), 4)
