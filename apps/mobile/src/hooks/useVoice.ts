import { useCallback, useRef, useState, useEffect } from 'react';
import * as Speech from 'expo-speech';
import { useSettingsStore } from '../stores/settingsStore';

interface UseVoiceOptions {
  /** Language for TTS (default: 'en-US') */
  language?: string;
  /** Speaking rate (0.5 to 2.0, default: 0.85 for elderly users) */
  rate?: number;
  /** Voice pitch (0.5 to 2.0, default: 1.0) */
  pitch?: number;
}

/**
 * Text-to-speech hook using expo-speech.
 * Respects the voice enabled setting from settings store.
 * Uses a slower rate by default for elderly users.
 */
export function useVoice(options: UseVoiceOptions = {}) {
  const { language = 'en-US', rate = 0.85, pitch = 1.0 } = options;
  const voiceEnabled = useSettingsStore((s) => s.voiceEnabled);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentUtteranceRef = useRef<string | null>(null);

  // Stop speaking on unmount
  useEffect(() => {
    return () => {
      try { Speech.stop(); } catch { /* may fail on web */ }
    };
  }, []);

  /**
   * Speak the given text. If voice is disabled in settings, this is a no-op.
   * Returns a promise that resolves when speech finishes or is interrupted.
   */
  const speak = useCallback(
    (text: string): Promise<void> => {
      if (!voiceEnabled || !text.trim()) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        try {
          // Stop any current speech first
          Speech.stop();
        } catch { /* may fail on web */ }
        currentUtteranceRef.current = text;
        setIsSpeaking(true);

        try {
          Speech.speak(text, {
            language,
            rate,
            pitch,
            onStart: () => {
              setIsSpeaking(true);
            },
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
          });
        } catch {
          // expo-speech may fail on web - resolve gracefully
          setIsSpeaking(false);
          currentUtteranceRef.current = null;
          resolve();
        }
      });
    },
    [voiceEnabled, language, rate, pitch],
  );

  /**
   * Stop any current speech.
   */
  const stop = useCallback(() => {
    try { Speech.stop(); } catch { /* may fail on web */ }
    setIsSpeaking(false);
    currentUtteranceRef.current = null;
  }, []);

  /**
   * Speak text only if it differs from what is currently being spoken.
   * Useful for preventing re-reads on re-renders.
   */
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
  };
}
