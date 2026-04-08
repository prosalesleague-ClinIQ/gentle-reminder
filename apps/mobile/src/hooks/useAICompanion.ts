import { useEffect, useCallback, useRef } from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import { aiCompanion } from '../services/AICompanion';
import { voiceCloneService } from '../services/VoiceCloneService';

/**
 * React hook that connects the AI Companion to any screen.
 *
 * Usage:
 *   const ai = useAICompanion('home');
 *   // Screen is auto-narrated on mount
 *   // Use ai.narrateExercise(), ai.readMessage(), etc.
 *
 * The companion automatically:
 * - Narrates the screen when entered
 * - Detects inactivity and prompts gently
 * - Cleans up on unmount
 */
export function useAICompanion(screenKey: string, options?: { patientName?: string }) {
  const voiceEnabled = useSettingsStore((s) => s.voiceEnabled);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (options?.patientName) {
      aiCompanion.setPatientName(options.patientName);
    }
    return () => {
      mounted.current = false;
      aiCompanion.stop();
      aiCompanion.clearInactivityMonitor();
    };
  }, []);

  // Auto-narrate screen on mount
  useEffect(() => {
    if (voiceEnabled && screenKey) {
      const timer = setTimeout(() => {
        if (mounted.current) {
          aiCompanion.narrateScreen(screenKey);
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [screenKey, voiceEnabled]);

  // Start inactivity monitor on exercise screens
  useEffect(() => {
    if (voiceEnabled && screenKey.startsWith('session-')) {
      aiCompanion.startInactivityMonitor(30000);
    }
    return () => aiCompanion.clearInactivityMonitor();
  }, [screenKey, voiceEnabled]);

  const narrateExercise = useCallback(async (prompt: string, exerciseType: string) => {
    if (!voiceEnabled) return;
    aiCompanion.resetInactivityMonitor();
    await aiCompanion.narrateExercise(prompt, exerciseType);
  }, [voiceEnabled]);

  const narrateFeedback = useCallback(async (
    type: 'celebrated' | 'guided' | 'supported',
    message: string,
  ) => {
    if (!voiceEnabled) return;
    aiCompanion.resetInactivityMonitor();
    await aiCompanion.narrateFeedback(type, message);
  }, [voiceEnabled]);

  const narrateTransition = useCallback(async () => {
    if (!voiceEnabled) return;
    await aiCompanion.narrateTransition();
  }, [voiceEnabled]);

  const encourage = useCallback(async () => {
    if (!voiceEnabled) return;
    await aiCompanion.encourage();
  }, [voiceEnabled]);

  /**
   * Read a message in the sender's cloned voice.
   * If no clone exists, uses a distinctive demo voice.
   */
  const readMessage = useCallback(async (
    senderName: string,
    relationship: string,
    messageText: string,
  ) => {
    if (!voiceEnabled) return;
    await voiceCloneService.readMessage(
      senderName,
      relationship,
      messageText,
      options?.patientName || 'Friend',
    );
  }, [voiceEnabled, options?.patientName]);

  /**
   * Play a family member greeting in their voice.
   */
  const playFamilyVoice = useCallback(async (name: string, greeting: string) => {
    if (!voiceEnabled) return;
    await voiceCloneService.speakAs(name, greeting);
  }, [voiceEnabled]);

  const narratePhoto = useCallback(async (
    description: string,
    people?: string[],
    date?: string,
  ) => {
    if (!voiceEnabled) return;
    await aiCompanion.narratePhoto(description, people, date);
  }, [voiceEnabled]);

  const narrateMedication = useCallback(async (
    name: string,
    dosage: string,
    time: string,
    instructions?: string,
  ) => {
    if (!voiceEnabled) return;
    await aiCompanion.narrateMedication(name, dosage, time, instructions);
  }, [voiceEnabled]);

  const speak = useCallback(async (text: string) => {
    if (!voiceEnabled) return;
    await aiCompanion.speak(text);
  }, [voiceEnabled]);

  const stop = useCallback(() => {
    aiCompanion.stop();
    voiceCloneService.stop();
  }, []);

  return {
    narrateExercise,
    narrateFeedback,
    narrateTransition,
    encourage,
    readMessage,
    playFamilyVoice,
    narratePhoto,
    narrateMedication,
    speak,
    stop,
    isSpeaking: aiCompanion.isSpeaking() || voiceCloneService.isSpeaking(),
  };
}
