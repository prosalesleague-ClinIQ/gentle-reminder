import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import {
  DEFAULT_FONT_SCALE,
  DEFAULT_VOICE_ENABLED,
  DEFAULT_HIGH_CONTRAST,
  DEFAULT_VOICE_NAV_MODE,
  DEFAULT_VOICE_NAV_SPEED,
  DEFAULT_ANNOUNCE_ON_FOCUS,
  MIN_FONT_SCALE,
  MAX_FONT_SCALE,
  FONT_SCALE_STEP,
} from '../constants/accessibility';

const SETTINGS_KEY = 'gentle_reminder_settings';

interface SettingsState {
  /** Font scale multiplier (1.0 = normal, up to 1.5) */
  fontScale: number;

  /** Whether voice guidance (TTS) is enabled */
  voiceEnabled: boolean;

  /** Whether high contrast mode is on */
  highContrastMode: boolean;

  /** Whether full voice navigation mode is enabled */
  voiceNavMode: boolean;

  /** Voice navigation speech speed */
  voiceNavSpeed: 'slow' | 'normal' | 'fast';

  /** Whether elements are announced on focus */
  announceOnFocus: boolean;

  /** Whether settings have been loaded from storage */
  isInitialized: boolean;

  /** Load settings from secure storage */
  initialize: () => Promise<void>;

  /** Increase font scale */
  increaseFontScale: () => void;

  /** Decrease font scale */
  decreaseFontScale: () => void;

  /** Set font scale directly */
  setFontScale: (scale: number) => void;

  /** Toggle voice guidance */
  toggleVoice: () => void;

  /** Toggle high contrast mode */
  toggleHighContrast: () => void;

  /** Toggle voice navigation mode */
  toggleVoiceNav: () => void;

  /** Set voice navigation speech speed */
  setVoiceNavSpeed: (speed: 'slow' | 'normal' | 'fast') => void;

  /** Toggle announce on focus */
  toggleAnnounceOnFocus: () => void;

  /** Reset all settings to defaults */
  resetSettings: () => void;
}

const persistSettings = async (state: Partial<SettingsState>) => {
  try {
    const data = JSON.stringify({
      fontScale: state.fontScale,
      voiceEnabled: state.voiceEnabled,
      highContrastMode: state.highContrastMode,
      voiceNavMode: state.voiceNavMode,
      voiceNavSpeed: state.voiceNavSpeed,
      announceOnFocus: state.announceOnFocus,
    });
    await SecureStore.setItemAsync(SETTINGS_KEY, data);
  } catch {
    // Storage errors are non-critical
  }
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  fontScale: DEFAULT_FONT_SCALE,
  voiceEnabled: DEFAULT_VOICE_ENABLED,
  highContrastMode: DEFAULT_HIGH_CONTRAST,
  voiceNavMode: DEFAULT_VOICE_NAV_MODE,
  voiceNavSpeed: DEFAULT_VOICE_NAV_SPEED,
  announceOnFocus: DEFAULT_ANNOUNCE_ON_FOCUS,
  isInitialized: false,

  initialize: async () => {
    try {
      const stored = await SecureStore.getItemAsync(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set({
          fontScale: parsed.fontScale ?? DEFAULT_FONT_SCALE,
          voiceEnabled: parsed.voiceEnabled ?? DEFAULT_VOICE_ENABLED,
          highContrastMode: parsed.highContrastMode ?? DEFAULT_HIGH_CONTRAST,
          voiceNavMode: parsed.voiceNavMode ?? DEFAULT_VOICE_NAV_MODE,
          voiceNavSpeed: parsed.voiceNavSpeed ?? DEFAULT_VOICE_NAV_SPEED,
          announceOnFocus: parsed.announceOnFocus ?? DEFAULT_ANNOUNCE_ON_FOCUS,
          isInitialized: true,
        });
      } else {
        set({ isInitialized: true });
      }
    } catch {
      set({ isInitialized: true });
    }
  },

  increaseFontScale: () => {
    const current = get().fontScale;
    const newScale = Math.min(current + FONT_SCALE_STEP, MAX_FONT_SCALE);
    set({ fontScale: newScale });
    persistSettings({ ...get(), fontScale: newScale });
  },

  decreaseFontScale: () => {
    const current = get().fontScale;
    const newScale = Math.max(current - FONT_SCALE_STEP, MIN_FONT_SCALE);
    set({ fontScale: newScale });
    persistSettings({ ...get(), fontScale: newScale });
  },

  setFontScale: (scale) => {
    const clamped = Math.min(Math.max(scale, MIN_FONT_SCALE), MAX_FONT_SCALE);
    set({ fontScale: clamped });
    persistSettings({ ...get(), fontScale: clamped });
  },

  toggleVoice: () => {
    const newValue = !get().voiceEnabled;
    set({ voiceEnabled: newValue });
    persistSettings({ ...get(), voiceEnabled: newValue });
  },

  toggleHighContrast: () => {
    const newValue = !get().highContrastMode;
    set({ highContrastMode: newValue });
    persistSettings({ ...get(), highContrastMode: newValue });
  },

  toggleVoiceNav: () => {
    const newValue = !get().voiceNavMode;
    // Voice nav requires voice to be enabled
    const updates: Partial<SettingsState> = { voiceNavMode: newValue };
    if (newValue && !get().voiceEnabled) {
      updates.voiceEnabled = true;
    }
    set(updates);
    persistSettings({ ...get(), ...updates });
  },

  setVoiceNavSpeed: (speed) => {
    set({ voiceNavSpeed: speed });
    persistSettings({ ...get(), voiceNavSpeed: speed });
  },

  toggleAnnounceOnFocus: () => {
    const newValue = !get().announceOnFocus;
    set({ announceOnFocus: newValue });
    persistSettings({ ...get(), announceOnFocus: newValue });
  },

  resetSettings: () => {
    set({
      fontScale: DEFAULT_FONT_SCALE,
      voiceEnabled: DEFAULT_VOICE_ENABLED,
      highContrastMode: DEFAULT_HIGH_CONTRAST,
      voiceNavMode: DEFAULT_VOICE_NAV_MODE,
      voiceNavSpeed: DEFAULT_VOICE_NAV_SPEED,
      announceOnFocus: DEFAULT_ANNOUNCE_ON_FOCUS,
    });
    persistSettings({
      fontScale: DEFAULT_FONT_SCALE,
      voiceEnabled: DEFAULT_VOICE_ENABLED,
      highContrastMode: DEFAULT_HIGH_CONTRAST,
      voiceNavMode: DEFAULT_VOICE_NAV_MODE,
      voiceNavSpeed: DEFAULT_VOICE_NAV_SPEED,
      announceOnFocus: DEFAULT_ANNOUNCE_ON_FOCUS,
    });
  },
}));
