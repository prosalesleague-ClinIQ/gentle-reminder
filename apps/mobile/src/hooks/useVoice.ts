import { useCallback, useRef, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { useSettingsStore } from '../stores/settingsStore';

interface UseVoiceOptions {
  /** Language for TTS (default: 'en-US') */
  language?: string;
  /** Speaking rate (0.5 to 2.0, default: 0.78 for natural elderly-friendly pace) */
  rate?: number;
  /** Voice pitch (0.5 to 2.0, default: 1.05 for warmer tone) */
  pitch?: number;
  /** Preferred voice identifier (platform-specific) */
  voiceId?: string;
}

/**
 * Enhanced text-to-speech hook with realistic, warm voice settings.
 *
 * Optimized for dementia patients:
 * - Slower natural pace (0.78x) for comprehension
 * - Slightly higher pitch (1.05) for warmth and clarity
 * - Automatic voice selection preferring natural/enhanced voices
 * - Pauses between sentences for processing time
 * - Respects voice enabled setting from store
 */
export function useVoice(options: UseVoiceOptions = {}) {
  const {
    language = 'en-US',
    rate = 0.78,
    pitch = 1.05,
    voiceId,
  } = options;

  const voiceEnabled = useSettingsStore((s) => s.voiceEnabled);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<Speech.Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | undefined>(voiceId);
  const currentUtteranceRef = useRef<string | null>(null);

  // Load available voices and select the most natural one
  useEffect(() => {
    loadVoices();
  }, []);

  async function loadVoices() {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      setAvailableVoices(voices);

      if (!voiceId && voices.length > 0) {
        // Prefer natural/enhanced voices for realism
        const preferred = selectBestVoice(voices, language);
        if (preferred) {
          setSelectedVoice(preferred.identifier);
        }
      }
    } catch {
      // Voice enumeration may not work on all platforms
    }
  }

  // Stop speaking on unmount
  useEffect(() => {
    return () => {
      try { Speech.stop(); } catch { /* may fail on web */ }
    };
  }, []);

  /**
   * Speak the given text with realistic voice settings.
   * Automatically adds slight pauses between sentences for naturalness.
   */
  const speak = useCallback(
    (text: string): Promise<void> => {
      if (!voiceEnabled || !text.trim()) {
        return Promise.resolve();
      }

      // Add natural pauses between sentences for dementia-friendly pacing
      const processedText = addNaturalPauses(text);

      return new Promise<void>((resolve) => {
        try { Speech.stop(); } catch { /* may fail on web */ }
        currentUtteranceRef.current = text;
        setIsSpeaking(true);

        const speechOptions: Speech.SpeechOptions = {
          language,
          rate,
          pitch,
          voice: selectedVoice,
          onStart: () => setIsSpeaking(true),
          onDone: () => {
            setIsSpeaking(false);
            currentUtteranceRef.current = null;
            resolve();
          },
          onStopped: () => {
            setIsSpeaking(false);
            currentUtteranceRef.current = null;
            resolve();
          },
          onError: () => {
            setIsSpeaking(false);
            currentUtteranceRef.current = null;
            resolve();
          },
        };

        try {
          Speech.speak(processedText, speechOptions);
        } catch {
          setIsSpeaking(false);
          currentUtteranceRef.current = null;
          resolve();
        }
      });
    },
    [voiceEnabled, language, rate, pitch, selectedVoice],
  );

  const stop = useCallback(() => {
    try { Speech.stop(); } catch { /* may fail on web */ }
    setIsSpeaking(false);
    currentUtteranceRef.current = null;
  }, []);

  const speakIfNew = useCallback(
    (text: string) => {
      if (currentUtteranceRef.current !== text) {
        return speak(text);
      }
      return Promise.resolve();
    },
    [speak],
  );

  return {
    speak,
    speakIfNew,
    stop,
    isSpeaking,
    voiceEnabled,
    availableVoices,
    selectedVoice,
  };
}

/**
 * Select the most natural-sounding voice for the given language.
 * Prefers enhanced/premium voices over default ones.
 */
function selectBestVoice(voices: Speech.Voice[], language: string): Speech.Voice | null {
  const langVoices = voices.filter((v) =>
    v.language.startsWith(language.split('-')[0]),
  );

  if (langVoices.length === 0) return null;

  // Priority order for natural-sounding voices (iOS/macOS identifiers)
  const preferredKeywords = [
    'enhanced', 'premium', 'neural', 'natural',
    'Samantha', 'Karen', 'Daniel', 'Moira', 'Tessa',
    'Ava', 'Allison', 'Susan',
  ];

  for (const keyword of preferredKeywords) {
    const match = langVoices.find((v) =>
      v.identifier.toLowerCase().includes(keyword.toLowerCase()) ||
      v.name?.toLowerCase().includes(keyword.toLowerCase()),
    );
    if (match) return match;
  }

  // Fall back to first voice for the language
  return langVoices[0];
}

/**
 * Add natural pauses between sentences for dementia-friendly pacing.
 * Uses SSML-like breaks where supported, or adds slight delays.
 */
function addNaturalPauses(text: string): string {
  // On iOS, adding periods with spaces creates natural pauses
  // Replace single periods with period + slight pause indicator
  return text
    .replace(/\.\s+/g, '. ... ')
    .replace(/!\s+/g, '! ... ')
    .replace(/\?\s+/g, '? ... ');
}
