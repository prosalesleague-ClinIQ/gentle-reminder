import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import {
  DEFAULT_FONT_SCALE,
  DEFAULT_VOICE_ENABLED,
  DEFAULT_HIGH_CONTRAST,
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

  /** Reset all settings to defaults */
  resetSettings: () => void;
}

const persistSettings = async (state: Partial<SettingsState>) => {
  try {
    const data = JSON.stringify({
      fontScale: state.fontScale,
      voiceEnabled: state.voiceEnabled,
      highContrastMode: state.highContrastMode,
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

  resetSettings: () => {
    set({
      fontScale: DEFAULT_FONT_SCALE,
      voiceEnabled: DEFAULT_VOICE_ENABLED,
      highContrastMode: DEFAULT_HIGH_CONTRAST,
    });
    persistSettings({
      fontScale: DEFAULT_FONT_SCALE,
      voiceEnabled: DEFAULT_VOICE_ENABLED,
      highContrastMode: DEFAULT_HIGH_CONTRAST,
    });
  },
}));
