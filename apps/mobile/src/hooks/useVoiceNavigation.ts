import { useEffect, useCallback } from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import { voiceNavigator, VoiceNavOption } from '../services/VoiceNavigator';

/**
 * React hook for voice navigation on any screen.
 *
 * Usage:
 *   const { announceOptions, selectOption } = useVoiceNavigation('home');
 *
 * When voice nav mode is on, the screen is automatically announced on mount.
 */
export function useVoiceNavigation(screenName: string) {
  const voiceNavMode = useSettingsStore((s) => s.voiceNavMode);
  const voiceNavSpeed = useSettingsStore((s) => s.voiceNavSpeed);

  // Sync speed setting to navigator
  useEffect(() => {
    voiceNavigator.setSpeed(voiceNavSpeed);
  }, [voiceNavSpeed]);

  // Sync enabled state
  useEffect(() => {
    // Don't call setEnabled here (that triggers announcement), just sync
    if (voiceNavigator.isEnabled() !== voiceNavMode) {
      voiceNavigator.setEnabled(voiceNavMode);
    }
  }, [voiceNavMode]);

  // Auto-announce screen on mount when voice nav is on
  useEffect(() => {
    if (voiceNavMode) {
      // Small delay to let the screen render first
      const timer = setTimeout(() => {
        voiceNavigator.announceScreen(screenName);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [screenName, voiceNavMode]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (voiceNavMode) {
        voiceNavigator.stop();
      }
    };
  }, [voiceNavMode]);

  const announceOptions = useCallback((options: VoiceNavOption[]) => {
    voiceNavigator.announceOptions(options);
  }, []);

  const announceResult = useCallback((message: string) => {
    voiceNavigator.announceResult(message);
  }, []);

  const selectOption = useCallback((index: number) => {
    voiceNavigator.handleOptionSelect(index);
  }, []);

  const repeat = useCallback(() => {
    voiceNavigator.repeatAnnouncement();
  }, []);

  const goBack = useCallback(() => {
    voiceNavigator.goBack();
  }, []);

  const goHome = useCallback(() => {
    voiceNavigator.goHome();
  }, []);

  const stopSpeaking = useCallback(() => {
    voiceNavigator.stop();
  }, []);

  return {
    isVoiceNavMode: voiceNavMode,
    isSpeaking: voiceNavigator.isSpeaking(),
    currentOptions: voiceNavigator.getCurrentOptions(),
    announceOptions,
    announceResult,
    selectOption,
    repeat,
    goBack,
    goHome,
    stopSpeaking,
  };
}
