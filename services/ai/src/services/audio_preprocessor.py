"""
Audio Preprocessor

Handles audio format detection, resampling, chunking, and silence trimming
for the transcription pipeline. Supports m4a, wav, aac, mp3, ogg, and webm.
"""

import io
import logging
import struct
from typing import Optional

logger = logging.getLogger("gentle-reminder.ai.audio-preprocessor")

# Map magic bytes / signatures to format names
_FORMAT_SIGNATURES = {
    b"RIFF": "wav",
    b"\xff\xfb": "mp3",
    b"\xff\xf3": "mp3",
    b"\xff\xf2": "mp3",
    b"ID3": "mp3",
    b"OggS": "ogg",
    b"\x1aE\xdf\xa3": "webm",
    b"fLaC": "flac",
}

# ftyp-box brand identifiers for ISO base media (MP4 / M4A / AAC containers)
_FTYP_BRANDS = {
    b"M4A ": "m4a",
    b"M4B ": "m4a",
    b"mp41": "m4a",
    b"mp42": "m4a",
    b"isom": "m4a",
    b"aac ": "aac",
}


class AudioPreprocessor:
    """Prepares raw audio bytes for Whisper transcription."""

    def __init__(self) -> None:
        self._pydub_available: Optional[bool] = None

    # ------------------------------------------------------------------
    # Lazy pydub import
    # ------------------------------------------------------------------
    def _ensure_pydub(self):
        if self._pydub_available is None:
            try:
                import pydub  # noqa: F401

                self._pydub_available = True
            except ImportError:
                self._pydub_available = False
        if not self._pydub_available:
            raise RuntimeError(
                "pydub is required for audio preprocessing. "
                "Install it with: pip install pydub"
            )

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def detect_format(self, audio_bytes: bytes) -> str:
        """
        Detect audio format from the raw bytes.

        Returns one of: wav, mp3, ogg, webm, m4a, aac, flac, unknown.
        """
        if len(audio_bytes) < 12:
            return "unknown"

        # Check simple magic-byte signatures first
        for sig, fmt in _FORMAT_SIGNATURES.items():
            if audio_bytes[: len(sig)] == sig:
                return fmt

        # Check for ISO base media file format (MP4 / M4A / AAC)
        # Bytes 4-7 should be "ftyp", brand at bytes 8-12
        if audio_bytes[4:8] == b"ftyp":
            brand = audio_bytes[8:12]
            return _FTYP_BRANDS.get(brand, "m4a")

        return "unknown"

    def resample(
        self, audio_bytes: bytes, target_rate: int = 16000
    ) -> bytes:
        """
        Convert arbitrary audio bytes to 16 kHz mono WAV.

        Parameters
        ----------
        audio_bytes : bytes
            Raw audio in any supported format.
        target_rate : int
            Target sample rate in Hz (default 16000).

        Returns
        -------
        bytes
            WAV-encoded audio at *target_rate* Hz, mono, 16-bit PCM.
        """
        self._ensure_pydub()
        from pydub import AudioSegment

        fmt = self.detect_format(audio_bytes)
        seg = self._load_segment(audio_bytes, fmt)

        # Convert to mono, target sample rate, 16-bit
        seg = seg.set_channels(1).set_frame_rate(target_rate).set_sample_width(2)

        buf = io.BytesIO()
        seg.export(buf, format="wav")
        return buf.getvalue()

    def chunk_audio(
        self,
        audio_bytes: bytes,
        chunk_duration: int = 25,
        overlap: int = 5,
    ) -> list[bytes]:
        """
        Split audio into overlapping chunks.

        Parameters
        ----------
        audio_bytes : bytes
            WAV audio (should already be resampled to 16 kHz mono).
        chunk_duration : int
            Duration of each chunk in seconds.
        overlap : int
            Overlap between consecutive chunks in seconds.

        Returns
        -------
        list[bytes]
            List of WAV-encoded chunks.
        """
        self._ensure_pydub()
        from pydub import AudioSegment

        seg = AudioSegment.from_wav(io.BytesIO(audio_bytes))
        total_ms = len(seg)
        chunk_ms = chunk_duration * 1000
        overlap_ms = overlap * 1000
        step_ms = chunk_ms - overlap_ms

        # If the whole file fits in one chunk, return as-is
        if total_ms <= chunk_ms:
            return [audio_bytes]

        chunks: list[bytes] = []
        start = 0
        while start < total_ms:
            end = min(start + chunk_ms, total_ms)
            chunk_seg = seg[start:end]
            buf = io.BytesIO()
            chunk_seg.export(buf, format="wav")
            chunks.append(buf.getvalue())
            start += step_ms

        logger.info(
            "Split %.1fs audio into %d chunks (chunk=%ds, overlap=%ds)",
            total_ms / 1000,
            len(chunks),
            chunk_duration,
            overlap,
        )
        return chunks

    def trim_silence(
        self,
        audio_bytes: bytes,
        silence_thresh: int = -40,
        min_silence_len: int = 500,
    ) -> bytes:
        """
        Remove leading and trailing silence from WAV audio.

        Parameters
        ----------
        audio_bytes : bytes
            WAV audio bytes.
        silence_thresh : int
            Silence threshold in dBFS (default -40).
        min_silence_len : int
            Minimum silence length in ms to consider (default 500).

        Returns
        -------
        bytes
            Trimmed WAV audio.
        """
        self._ensure_pydub()
        from pydub import AudioSegment
        from pydub.silence import detect_leading_silence

        seg = AudioSegment.from_wav(io.BytesIO(audio_bytes))

        # Trim leading silence
        lead = detect_leading_silence(seg, silence_threshold=silence_thresh)
        # Trim trailing silence (reverse, detect leading, reverse back)
        trail = detect_leading_silence(
            seg.reverse(), silence_threshold=silence_thresh
        )

        trimmed = seg[lead : len(seg) - trail] if trail > 0 else seg[lead:]

        # Don't return empty audio
        if len(trimmed) < 100:
            return audio_bytes

        buf = io.BytesIO()
        trimmed.export(buf, format="wav")
        return buf.getvalue()

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _load_segment(self, audio_bytes: bytes, fmt: str):
        """Load audio bytes into a pydub AudioSegment."""
        from pydub import AudioSegment

        buf = io.BytesIO(audio_bytes)

        format_map = {
            "wav": "wav",
            "mp3": "mp3",
            "ogg": "ogg",
            "webm": "webm",
            "m4a": "m4a",
            "aac": "aac",
            "flac": "flac",
        }

        pydub_fmt = format_map.get(fmt)
        if pydub_fmt:
            try:
                return AudioSegment.from_file(buf, format=pydub_fmt)
            except Exception as e:
                logger.warning(
                    "Failed to load as %s, trying auto-detect: %s", fmt, e
                )

        # Fallback: let pydub/ffmpeg auto-detect
        buf.seek(0)
        return AudioSegment.from_file(buf)
