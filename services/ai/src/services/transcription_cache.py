"""
Transcription Cache

Thread-safe LRU cache for transcription results, keyed by SHA-256 hash
of the audio content. Avoids re-transcribing identical audio files.
"""

import hashlib
import logging
import threading
import time
from collections import OrderedDict
from typing import Any, Optional

logger = logging.getLogger("gentle-reminder.ai.transcription-cache")

# Default cache configuration
DEFAULT_MAX_SIZE = 256
DEFAULT_TTL_SECONDS = 24 * 60 * 60  # 24 hours


class TranscriptionCache:
    """LRU cache for transcription results with TTL expiration."""

    def __init__(
        self,
        max_size: int = DEFAULT_MAX_SIZE,
        ttl_seconds: int = DEFAULT_TTL_SECONDS,
    ) -> None:
        self._max_size = max_size
        self._ttl_seconds = ttl_seconds
        self._cache: OrderedDict[str, dict[str, Any]] = OrderedDict()
        self._lock = threading.Lock()
        self._hits = 0
        self._misses = 0

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    @staticmethod
    def _hash_audio(audio_bytes: bytes) -> str:
        """Compute SHA-256 hex digest for audio content."""
        return hashlib.sha256(audio_bytes).hexdigest()

    def get(self, audio_bytes: bytes) -> Optional[dict[str, Any]]:
        """
        Look up a cached transcription result.

        Returns the cached result dict, or None on cache miss / expiry.
        """
        key = self._hash_audio(audio_bytes)

        with self._lock:
            entry = self._cache.get(key)
            if entry is None:
                self._misses += 1
                return None

            # Check TTL
            if time.time() - entry["timestamp"] > self._ttl_seconds:
                del self._cache[key]
                self._misses += 1
                logger.debug("Cache entry expired for %s...", key[:12])
                return None

            # Move to end (most recently used)
            self._cache.move_to_end(key)
            self._hits += 1
            logger.debug("Cache hit for %s...", key[:12])
            return entry["result"]

    def set(self, audio_bytes: bytes, result: dict[str, Any]) -> None:
        """
        Store a transcription result in the cache.

        Evicts the least-recently-used entry if the cache is full.
        """
        key = self._hash_audio(audio_bytes)

        with self._lock:
            # If key already present, remove it so we re-insert at end
            if key in self._cache:
                del self._cache[key]

            self._cache[key] = {
                "result": result,
                "timestamp": time.time(),
            }

            # Evict LRU entries if over capacity
            while len(self._cache) > self._max_size:
                evicted_key, _ = self._cache.popitem(last=False)
                logger.debug("Evicted LRU cache entry %s...", evicted_key[:12])

    def clear(self) -> int:
        """
        Clear all cached entries.

        Returns the number of entries that were removed.
        """
        with self._lock:
            count = len(self._cache)
            self._cache.clear()
            logger.info("Cache cleared (%d entries removed)", count)
            return count

    def stats(self) -> dict[str, Any]:
        """
        Return cache statistics.

        Returns a dict with size, max_size, ttl_seconds, hits, misses,
        and hit_rate.
        """
        with self._lock:
            total = self._hits + self._misses
            return {
                "size": len(self._cache),
                "max_size": self._max_size,
                "ttl_seconds": self._ttl_seconds,
                "hits": self._hits,
                "misses": self._misses,
                "hit_rate": (self._hits / total) if total > 0 else 0.0,
            }
