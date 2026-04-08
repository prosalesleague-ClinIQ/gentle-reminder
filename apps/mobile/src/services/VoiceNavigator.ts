import * as Speech from 'expo-speech';
import { router } from 'expo-router';
import { VOICE_NAV_RATES } from '../constants/accessibility';

/**
 * Voice Navigation Engine for visually impaired users.
 *
 * Provides full audio-first navigation through every screen in the app.
 * When enabled, every screen is announced with its name, description,
 * and available options as numbered choices. Users tap numbered buttons
 * to navigate.
 */

export interface VoiceNavOption {
  label: string;
  description?: string;
  route?: string;
  action?: () => void;
}

export interface ScreenVoiceConfig {
  name: string;
  greeting: string;
  options: VoiceNavOption[];
}

type VoiceNavSpeed = 'slow' | 'normal' | 'fast';

// ── Screen Navigation Map ────────────────────────────────────
// Every screen's voice description and navigable options.

const SCREEN_MAP: Record<string, ScreenVoiceConfig> = {
  home: {
    name: 'Home',
    greeting: 'You are on the Home screen. Here are your choices.',
    options: [
      { label: 'Start a cognitive session', route: '/session/start' },
      { label: 'See your family', route: '/(tabs)/family' },
      { label: 'Music and memories', route: '/music' },
      { label: 'Brain games', route: '/session/start' },
      { label: 'Relax and breathe', route: '/breathing' },
      { label: 'Check your medications', route: '/(tabs)/medications' },
      { label: 'My daily routine', route: '/routine' },
    ],
  },
  family: {
    name: 'Family',
    greeting: 'You are on the Family screen. You can see your loved ones here.',
    options: [
      { label: 'View family photos', route: '/photos' },
      { label: 'Listen to family voices', route: '/(tabs)/voices' },
      { label: 'Send a message', route: '/family-message' },
      { label: 'Go home', route: '/(tabs)/home' },
    ],
  },
  stories: {
    name: 'Stories',
    greeting: 'You are on the Stories screen. Your memories are here.',
    options: [
      { label: 'Record a new memory', description: 'Tell a story and we will save it' },
      { label: 'Listen to your stories', description: 'Hear stories you have recorded' },
      { label: 'View photo memories', route: '/slideshow' },
      { label: 'Go home', route: '/(tabs)/home' },
    ],
  },
  medications: {
    name: 'Medications',
    greeting: 'You are on the Medications screen. I can read your medications to you.',
    options: [
      { label: 'Hear today\'s medications', description: 'I will read each medication and its schedule' },
      { label: 'Mark a medication as taken' },
      { label: 'View medication history' },
      { label: 'Go home', route: '/(tabs)/home' },
    ],
  },
  sleep: {
    name: 'Sleep',
    greeting: 'You are on the Sleep screen. Here is your sleep information.',
    options: [
      { label: 'Hear last night\'s sleep summary' },
      { label: 'View sleep trends' },
      { label: 'Go home', route: '/(tabs)/home' },
    ],
  },
  activity: {
    name: 'Activity',
    greeting: 'You are on the Activity screen. Here is your recent activity.',
    options: [
      { label: 'Hear today\'s activity summary' },
      { label: 'View activity timeline' },
      { label: 'Go home', route: '/(tabs)/home' },
    ],
  },
  settings: {
    name: 'Settings',
    greeting: 'You are on the Settings screen. You can change how the app works.',
    options: [
      { label: 'Change text size' },
      { label: 'Toggle voice guidance' },
      { label: 'Toggle high contrast' },
      { label: 'Change language' },
      { label: 'Go home', route: '/(tabs)/home' },
    ],
  },
  'voice-assist': {
    name: 'Voice Assist',
    greeting: 'You are on the Voice Assist screen. Voice navigation helps you use the app by listening.',
    options: [
      { label: 'Turn voice navigation on or off' },
      { label: 'Change voice speed' },
      { label: 'Test the voice' },
      { label: 'Go home', route: '/(tabs)/home' },
    ],
  },
  music: {
    name: 'Music Therapy',
    greeting: 'You are on the Music screen. Music can help you relax and remember.',
    options: [
      { label: 'Play calming piano music' },
      { label: 'Play nature sounds' },
      { label: 'Play classical music' },
      { label: 'Play memory songs', description: 'Songs linked to your special memories' },
      { label: 'Stop music' },
      { label: 'Go home', route: '/(tabs)/home' },
    ],
  },
  breathing: {
    name: 'Breathing Exercise',
    greeting: 'You are on the Breathing screen. I will guide you through a calming breathing exercise.',
    options: [
      { label: 'Start breathing exercise' },
      { label: 'Go home', route: '/(tabs)/home' },
    ],
  },
  mood: {
    name: 'Mood Check',
    greeting: 'How are you feeling right now? I\'ll read your choices.',
    options: [
      { label: 'I feel happy' },
      { label: 'I feel calm' },
      { label: 'I feel anxious' },
      { label: 'I feel confused' },
      { label: 'I feel tired' },
      { label: 'Go home', route: '/(tabs)/home' },
    ],
  },
  journal: {
    name: 'Journal',
    greeting: 'You are on the Journal screen. You can record your thoughts here.',
    options: [
      { label: 'Record a new journal entry' },
      { label: 'Listen to past entries' },
      { label: 'Go home', route: '/(tabs)/home' },
    ],
  },
};

// Fallback for unregistered screens
const DEFAULT_SCREEN: ScreenVoiceConfig = {
  name: 'Unknown',
  greeting: 'You are on a screen. Here are your options.',
  options: [
    { label: 'Go back', action: () => router.back() },
    { label: 'Go home', route: '/(tabs)/home' },
  ],
};

class VoiceNavigator {
  private static instance: VoiceNavigator;
  private currentScreen: string = 'home';
  private currentOptions: VoiceNavOption[] = [];
  private speed: VoiceNavSpeed = 'slow';
  private enabled: boolean = false;
  private speaking: boolean = false;

  private constructor() {}

  static getInstance(): VoiceNavigator {
    if (!VoiceNavigator.instance) {
      VoiceNavigator.instance = new VoiceNavigator();
    }
    return VoiceNavigator.instance;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (enabled) {
      this.speakText('Voice navigation is now on. I will guide you through every screen. Tap the numbered buttons to make a choice. Tap Repeat to hear your options again.');
    }
  }

  setSpeed(speed: VoiceNavSpeed): void {
    this.speed = speed;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  isSpeaking(): boolean {
    return this.speaking;
  }

  /**
   * Announce a screen by its route name. Called when entering any screen.
   */
  async announceScreen(screenName: string): Promise<void> {
    if (!this.enabled) return;

    this.currentScreen = screenName;
    const config = SCREEN_MAP[screenName] || DEFAULT_SCREEN;
    this.currentOptions = config.options;

    // Build announcement
    let announcement = config.greeting;
    announcement += ` You have ${config.options.length} choices. `;

    config.options.forEach((opt, i) => {
      announcement += `Option ${i + 1}: ${opt.label}. `;
      if (opt.description) {
        announcement += `${opt.description}. `;
      }
    });

    await this.speakText(announcement);
  }

  /**
   * Announce custom options (for dynamic content like exercise choices).
   */
  async announceOptions(options: VoiceNavOption[]): Promise<void> {
    if (!this.enabled) return;

    this.currentOptions = options;
    let announcement = `You have ${options.length} choices. `;
    options.forEach((opt, i) => {
      announcement += `Option ${i + 1}: ${opt.label}. `;
    });

    await this.speakText(announcement);
  }

  /**
   * Announce a result or feedback message.
   */
  async announceResult(message: string): Promise<void> {
    if (!this.enabled) return;
    await this.speakText(message);
  }

  /**
   * Re-announce the current screen.
   */
  async repeatAnnouncement(): Promise<void> {
    await this.announceScreen(this.currentScreen);
  }

  /**
   * Execute the option at the given 1-based index.
   */
  handleOptionSelect(index: number): void {
    if (!this.enabled) return;

    const option = this.currentOptions[index - 1];
    if (!option) {
      this.speakText(`That option is not available. You have ${this.currentOptions.length} choices.`);
      return;
    }

    if (option.route) {
      this.speakText(`Going to ${option.label}.`);
      setTimeout(() => {
        try {
          router.push(option.route as any);
        } catch {
          router.navigate(option.route as any);
        }
      }, 800);
    } else if (option.action) {
      this.speakText(option.label);
      setTimeout(() => option.action!(), 600);
    } else {
      this.speakText(`${option.label}. This feature will be available with voice soon.`);
    }
  }

  /**
   * Navigate back with voice confirmation.
   */
  goBack(): void {
    if (!this.enabled) return;
    this.speakText('Going back.');
    setTimeout(() => router.back(), 600);
  }

  /**
   * Navigate home with voice confirmation.
   */
  goHome(): void {
    if (!this.enabled) return;
    this.speakText('Going to the Home screen.');
    setTimeout(() => router.push('/(tabs)/home' as any), 600);
  }

  /**
   * Get current screen options for rendering overlay buttons.
   */
  getCurrentOptions(): VoiceNavOption[] {
    return this.currentOptions;
  }

  /**
   * Stop any current speech.
   */
  stop(): void {
    try { Speech.stop(); } catch {}
    this.speaking = false;
  }

  private async speakText(text: string): Promise<void> {
    this.speaking = true;
    try { Speech.stop(); } catch {}

    const rate = VOICE_NAV_RATES[this.speed] || VOICE_NAV_RATES.slow;
    // Add pauses for clarity
    const processed = text
      .replace(/\.\s+/g, '. ... ')
      .replace(/:\s+/g, ': ... ');

    return new Promise<void>((resolve) => {
      try {
        Speech.speak(processed, {
          rate,
          pitch: 1.08,
          language: 'en-US',
          onDone: () => { this.speaking = false; resolve(); },
          onStopped: () => { this.speaking = false; resolve(); },
          onError: () => { this.speaking = false; resolve(); },
        });
      } catch {
        this.speaking = false;
        resolve();
      }
    });
  }
}

export const voiceNavigator = VoiceNavigator.getInstance();
export { VoiceNavigator };
