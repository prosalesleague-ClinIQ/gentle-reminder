"""Tests for the transcription cache module."""

import time
from services.ai.src.services.transcription_cache import TranscriptionCache


class TestTranscriptionCache:
    """Test suite for TranscriptionCache LRU cache."""

    def test_cache_miss_returns_none(self):
        cache = TranscriptionCache(max_size=10, ttl_seconds=3600)
        result = cache.get(b"audio data that was never cached")
        assert result is None

    def test_cache_put_and_get(self):
        cache = TranscriptionCache(max_size=10, ttl_seconds=3600)
        audio = b"test audio content"
        transcription = {"text": "Hello, this is a test", "language": "en"}

        cache.put(audio, transcription)
        result = cache.get(audio)
        assert result is not None
        assert result["text"] == "Hello, this is a test"

    def test_cache_hit_increments_counter(self):
        cache = TranscriptionCache(max_size=10, ttl_seconds=3600)
        audio = b"test audio"
        cache.put(audio, {"text": "test"})

        cache.get(audio)
        cache.get(audio)
        stats = cache.stats()
        assert stats["hits"] >= 2

    def test_cache_miss_increments_counter(self):
        cache = TranscriptionCache(max_size=10, ttl_seconds=3600)
        cache.get(b"nonexistent1")
        cache.get(b"nonexistent2")
        stats = cache.stats()
        assert stats["misses"] >= 2

    def test_cache_evicts_oldest_when_full(self):
        cache = TranscriptionCache(max_size=2, ttl_seconds=3600)
        cache.put(b"audio1", {"text": "first"})
        cache.put(b"audio2", {"text": "second"})
        cache.put(b"audio3", {"text": "third"})

        # First entry should have been evicted
        assert cache.get(b"audio1") is None
        assert cache.get(b"audio3") is not None

    def test_cache_respects_ttl(self):
        cache = TranscriptionCache(max_size=10, ttl_seconds=1)
        audio = b"expiring audio"
        cache.put(audio, {"text": "will expire"})

        # Should be available immediately
        assert cache.get(audio) is not None

        # Wait for TTL to expire
        time.sleep(1.1)
        assert cache.get(audio) is None

    def test_hash_audio_is_deterministic(self):
        audio = b"consistent audio data"
        hash1 = TranscriptionCache._hash_audio(audio)
        hash2 = TranscriptionCache._hash_audio(audio)
        assert hash1 == hash2

    def test_different_audio_produces_different_hashes(self):
        hash1 = TranscriptionCache._hash_audio(b"audio A")
        hash2 = TranscriptionCache._hash_audio(b"audio B")
        assert hash1 != hash2

    def test_cache_clear(self):
        cache = TranscriptionCache(max_size=10, ttl_seconds=3600)
        cache.put(b"audio1", {"text": "one"})
        cache.put(b"audio2", {"text": "two"})
        cache.clear()
        assert cache.get(b"audio1") is None
        assert cache.get(b"audio2") is None

    def test_stats_returns_expected_fields(self):
        cache = TranscriptionCache(max_size=10, ttl_seconds=3600)
        stats = cache.stats()
        assert "hits" in stats
        assert "misses" in stats
        assert "size" in stats
        assert "max_size" in stats
