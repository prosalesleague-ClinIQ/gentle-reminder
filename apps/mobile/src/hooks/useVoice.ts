import { useCallback, useRef, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { useSettingsStore } from '../stores/settingsStore';

interface UseVoiceOptions {
  language?: string;
  rate?: number;
  pitch?: number;
  voiceId?: string;
  gender?: 'female' | 'male';
}

/**
 * Warm, realistic text-to-speech for dementia patients.
 *
 * Sounds like a caring family member, not a robot:
 * - Unhurried pace (0.72x) so every word lands gently
 * - Warm pitch (1.08) that conveys kindness
 * - Natural breathing pauses between sentences
 * - Prefers premium/neural voices on every platform
 * - Extra-warm mode for emotional moments (greetings, completions)
 */
export function useVoice(options: UseVoiceOptions = {}) {
  const {
    language = 'en-US',
    rate = 0.72,
    pitch = 1.08,
    voiceId,
    gender = 'female',
  } = options;

  const voiceEnabled = useSettingsStore((s) => s.voiceEnabled);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<Speech.Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | undefined>(voiceId);
  const currentUtteranceRef = useRef<string | null>(null);

  useEffect(() => {
    loadVoices();
  }, []);

  async function loadVoices() {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      setAvailableVoices(voices);
      if (!voiceId && voices.length > 0) {
        const preferred = selectWarmestVoice(voices, language, gender);
        if (preferred) setSelectedVoice(preferred.identifier);
      }
    } catch {}
  }

  useEffect(() => {
    return () => { try { Speech.stop(); } catch {} };
  }, []);

  const speak = useCallback(
    (text: string): Promise<void> => {
      if (!voiceEnabled || !text.trim()) return Promise.resolve();
      const processedText = makeWarmAndNatural(text);

      return new Promise<void>((resolve) => {
        try { Speech.stop(); } catch {}
        currentUtteranceRef.current = text;
        setIsSpeaking(true);

        try {
          Speech.speak(processedText, {
            language, rate, pitch, voice: selectedVoice,
            onStart: () => setIsSpeaking(true),
            onDone: () => { setIsSpeaking(false); currentUtteranceRef.current = null; resolve(); },
            onStopped: () => { setIsSpeaking(false); currentUtteranceRef.current = null; resolve(); },
            onError: () => { setIsSpeaking(false); currentUtteranceRef.current = null; resolve(); },
          });
        } catch {
          setIsSpeaking(false); currentUtteranceRef.current = null; resolve();
        }
      });
    },
    [voiceEnabled, language, rate, pitch, selectedVoice],
  );

  /** Speak with extra warmth for emotional moments. */
  const speakWarmly = useCallback(
    (text: string): Promise<void> => {
      if (!voiceEnabled || !text.trim()) return Promise.resolve();
      const warmText = makeWarmAndNatural(text);

      return new Promise<void>((resolve) => {
        try { Speech.stop(); } catch {}
        currentUtteranceRef.current = text;
        setIsSpeaking(true);

        try {
          Speech.speak(warmText, {
            language,
            rate: rate * 0.88,
            pitch: pitch + 0.05,
            voice: selectedVoice,
            onDone: () => { setIsSpeaking(false); currentUtteranceRef.current = null; resolve(); },
            onStopped: () => { setIsSpeaking(false); currentUtteranceRef.current = null; resolve(); },
            onError: () => { setIsSpeaking(false); currentUtteranceRef.current = null; resolve(); },
          });
        } catch {
          setIsSpeaking(false); currentUtteranceRef.current = null; resolve();
        }
      });
    },
    [voiceEnabled, language, rate, pitch, selectedVoice],
  );

  const stop = useCallback(() => {
    try { Speech.stop(); } catch {}
    setIsSpeaking(false);
    currentUtteranceRef.current = null;
  }, []);

  const speakIfNew = useCallback(
    (text: string) => {
      if (currentUtteranceRef.current !== text) return speak(text);
      return Promise.resolve();
    },
    [speak],
  );

  return { speak, speakIfNew, speakWarmly, stop, isSpeaking, voiceEnabled, availableVoices, selectedVoice };
}

/**
 * Select the warmest, most natural voice available.
 *
 * Priority: neural/premium > enhanced > known warm names > any match.
 * On Apple: Samantha (Enhanced), Ava (Premium) are most natural.
 * On Android: Google neural voices. On web: browser defaults.
 */
function selectWarmestVoice(
  voices: Speech.Voice[],
  language: string,
  gender: 'female' | 'male',
): Speech.Voice | null {
  const langVoices = voices.filter((v) => v.language.startsWith(language.split('-')[0]));
  if (langVoices.length === 0) return null;

  // Tier 1: Neural/premium (most human-sounding)
  for (const kw of ['neural', 'premium', 'wavenet', 'journey']) {
    const m = langVoices.find((v) =>
      ((v.identifier || '') + (v.name || '')).toLowerCase().includes(kw) && matchGender(v, gender),
    );
    if (m) return m;
  }

  // Tier 2: Enhanced
  const enhanced = langVoices.find((v) =>
    ((v.identifier || '') + (v.name || '')).toLowerCase().includes('enhanced') && matchGender(v, gender),
  );
  if (enhanced) return enhanced;

  // Tier 3: Known warm voices
  const warmNames = gender === 'female'
    ? ['Samantha', 'Ava', 'Allison', 'Susan', 'Karen', 'Moira', 'Tessa', 'Fiona',
       'Google UK English Female', 'Microsoft Zira', 'Microsoft Jenny']
    : ['Daniel', 'Aaron', 'Tom', 'Oliver', 'Google UK English Male', 'Microsoft David'];

  for (const name of warmNames) {
    const m = langVoices.find((v) =>
      ((v.identifier || '') + (v.name || '')).toLowerCase().includes(name.toLowerCase()),
    );
    if (m) return m;
  }

  return langVoices.find((v) => matchGender(v, gender)) || langVoices[0];
}

function matchGender(voice: Speech.Voice, gender: 'female' | 'male'): boolean {
  const id = ((voice.identifier || '') + (voice.name || '')).toLowerCase();
  return gender === 'female' ? !id.includes('male') || id.includes('female') : id.includes('male') && !id.includes('female');
}

/**
 * Transform text to sound warm and natural when spoken aloud.
 * - Breathing pauses between sentences
 * - Gentle pause before the patient's name (feels personal)
 * - Softens excessive exclamation marks
 */
function makeWarmAndNatural(text: string): string {
  let warm = text;
  warm = warm.replace(/\.\s+/g, '.  ...  ');
  warm = warm.replace(/!\s+/g, '!  ...  ');
  warm = warm.replace(/\?\s+/g, '?  ...  ');
  warm = warm.replace(/,\s+(\w)/g, ', ... $1');

  let exCount = 0;
  warm = warm.replace(/!/g, () => { exCount++; return exCount <= 1 ? '!' : '.'; });

  return warm;
}
