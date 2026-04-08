"""Tests for the audio preprocessor module."""

import pytest
from services.ai.src.services.audio_preprocessor import AudioPreprocessor


class TestAudioPreprocessor:
    """Test suite for AudioPreprocessor."""

    def setup_method(self):
        self.preprocessor = AudioPreprocessor()

    def test_detect_wav_format(self):
        # WAV files start with RIFF header
        wav_header = b"RIFF" + b"\x00" * 100
        fmt = self.preprocessor.detect_format(wav_header)
        assert fmt == "wav"

    def test_detect_mp3_format_with_id3(self):
        mp3_header = b"ID3" + b"\x00" * 100
        fmt = self.preprocessor.detect_format(mp3_header)
        assert fmt == "mp3"

    def test_detect_mp3_format_with_sync(self):
        mp3_header = b"\xff\xfb" + b"\x00" * 100
        fmt = self.preprocessor.detect_format(mp3_header)
        assert fmt == "mp3"

    def test_detect_ogg_format(self):
        ogg_header = b"OggS" + b"\x00" * 100
        fmt = self.preprocessor.detect_format(ogg_header)
        assert fmt == "ogg"

    def test_detect_flac_format(self):
        flac_header = b"fLaC" + b"\x00" * 100
        fmt = self.preprocessor.detect_format(flac_header)
        assert fmt == "flac"

    def test_detect_unknown_format(self):
        unknown = b"\x00\x01\x02\x03" + b"\x00" * 100
        fmt = self.preprocessor.detect_format(unknown)
        assert fmt is None or fmt == "unknown"

    def test_empty_audio_raises(self):
        with pytest.raises((ValueError, Exception)):
            self.preprocessor.detect_format(b"")

    def test_preprocessor_initializes(self):
        pp = AudioPreprocessor()
        assert pp is not None
