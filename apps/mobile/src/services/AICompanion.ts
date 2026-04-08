import * as Speech from 'expo-speech';
import { VOICE_NAV_RATES } from '../constants/accessibility';

/**
 * AI Voice Companion — a warm, ever-present guide that talks the patient
 * through every feature, game mode, and interaction in the app.
 *
 * Unlike VoiceNavigator (which provides numbered menu navigation for
 * visually impaired users), AICompanion provides contextual narration:
 * - Explains what each screen does before the patient interacts
 * - Guides through games step-by-step ("Now I'll show you 3 pictures...")
 * - Celebrates achievements with genuine warmth
 * - Reads messages in the sender's voice (via VoiceCloneService)
 * - Provides transitions between activities
 * - Detects inactivity and offers gentle prompts
 */

export type CompanionMood = 'warm' | 'encouraging' | 'celebratory' | 'calming' | 'gentle';

interface CompanionConfig {
  patientName: string;
  rate: number;
  pitch: number;
  language: string;
  voiceId?: string;
}

const DEFAULT_CONFIG: CompanionConfig = {
  patientName: 'Friend',
  rate: 0.72,
  pitch: 1.08,
  language: 'en-US',
};

// ── Contextual Scripts ────────────────────────────────────────
// Pre-written warm narrations for every feature and game mode.

const SCREEN_NARRATIONS: Record<string, (name: string) => string> = {
  // Home & Navigation
  home: (name) => `Welcome back, ${name}. It's so nice to see you. You can start a brain exercise, look at family photos, listen to music, or just relax. What would you like to do?`,
  'home-morning': (name) => `Good morning, ${name}! I hope you slept well. Let's have a wonderful day together. Would you like to start with a gentle exercise, or maybe listen to some music first?`,
  'home-afternoon': (name) => `Good afternoon, ${name}. How are you doing? We could do some brain games, look at your family photos, or just sit and listen to calming music.`,
  'home-evening': (name) => `Good evening, ${name}. You've had a lovely day. Maybe we can wind down with some gentle music, or you could record a memory in your journal.`,

  // Cognitive Session Flow
  'session-start': (name) => `Alright, ${name}, let's do some gentle exercises together. There's no rush at all. I'll guide you through each one, and remember, there are no wrong answers here. Let's begin whenever you're ready.`,
  'session-orientation': (name) => `This first one is easy, ${name}. I'm going to ask you about today. Just take your time and tell me what you think.`,
  'session-identity': (name) => `Now I'm going to show you a photo of someone you know. Take a good look, and tell me who you think it is. There's no hurry.`,
  'session-memory-game': (name) => `This next one is a memory game, ${name}. I'll show you some things, and you just tell me what you remember. You're doing wonderfully.`,
  'session-pattern': (name) => `Now we have a pattern game. I'll show you some numbers in a row, and you tell me which number comes next. It's like a little puzzle!`,
  'session-clock': (name) => `For this one, ${name}, we're going to look at a clock. Just tell me what time you think it shows. Take all the time you need.`,
  'session-complete': (name) => `You did it, ${name}! I'm so proud of you. Every time we do these exercises together, it helps keep your mind active and strong. You're amazing.`,

  // Exercise Feedback
  'feedback-celebrated': (name) => `That's wonderful, ${name}! You got it exactly right. I knew you could do it!`,
  'feedback-guided': (name) => `You're so close, ${name}! That was a really good try. The answer is just a little different. Let me show you.`,
  'feedback-supported': (name) => `That's perfectly okay, ${name}. This one was tricky. Let me help you with the answer. There's nothing to worry about at all.`,

  // Music Therapy
  music: (name) => `Welcome to your music room, ${name}. Music is wonderful for the mind and soul. I have calming piano, nature sounds, classical favorites, gentle lullabies, and special songs that hold your memories. What would you like to hear?`,
  'music-memory-song': (name) => `This song holds a special memory for you, ${name}. Close your eyes and let it take you back.`,
  'music-sleep': (name) => `I've set a sleep timer for you, ${name}. The music will gently fade as you drift off. Sweet dreams.`,

  // Breathing
  breathing: (name) => `Let's do a breathing exercise together, ${name}. This will help you feel calm and relaxed. I'll guide you through each breath. Just follow my voice.`,
  'breathing-in': (_name) => `Breathe in slowly... nice and deep...`,
  'breathing-hold': (_name) => `Now hold it gently...`,
  'breathing-out': (_name) => `And slowly breathe out... let everything go...`,

  // Family & Photos
  family: (name) => `Here are your family members, ${name}. These are the people who love you very much. Tap on anyone to see their photos or hear a message from them.`,
  photos: (name) => `Your photo album, ${name}. These are beautiful moments from your life. Tap any photo to see it bigger and hear the story behind it.`,
  slideshow: (name) => `Sit back and enjoy your slideshow, ${name}. I'll tell you about each photo as it appears.`,

  // Medications
  medications: (name) => `Here are your medications for today, ${name}. I'll read each one to you. When you've taken a medication, just tap the checkmark.`,

  // Journal
  journal: (name) => `Your journal, ${name}. This is a safe place to share your thoughts. You can speak and I'll write it down for you, or you can type if you prefer.`,

  // Mood
  mood: (name) => `How are you feeling right now, ${name}? There's no right or wrong answer. Just pick the one that feels closest to how you are.`,

  // Messages
  messages: (name) => `You have messages from your loved ones, ${name}. Let me read them to you. I'll use their voice so it feels like they're right here with you.`,

  // SOS
  sos: (name) => `Don't worry, ${name}. Help is on the way. You are safe. I'm right here with you. Everything is going to be okay.`,

  // Settings
  settings: (name) => `These are your settings, ${name}. You can change how things look and sound. I can help you with any of these.`,
};

// ── Transition Phrases ────────────────────────────────────────
const TRANSITIONS = {
  toNextExercise: [
    'Great, let\'s try the next one.',
    'Ready for another one? Here we go.',
    'You\'re doing so well. Let\'s keep going.',
    'Wonderful. On to the next one.',
  ],
  encouragement: [
    'You\'re doing beautifully.',
    'Take your time, there\'s no rush at all.',
    'I\'m right here with you.',
    'You\'re stronger than you know.',
  ],
  inactivityPrompt: [
    'Are you still there? Take your time, I\'m not going anywhere.',
    'No rush at all. Whenever you\'re ready.',
    'I\'m right here whenever you want to continue.',
  ],
};

function randomFrom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── AI Companion Class ────────────────────────────────────────

class AICompanion {
  private static instance: AICompanion;
  private config: CompanionConfig = { ...DEFAULT_CONFIG };
  private speaking = false;
  private inactivityTimer: ReturnType<typeof setTimeout> | null = null;
  private onInactivityCallback: (() => void) | null = null;

  private constructor() {}

  static getInstance(): AICompanion {
    if (!AICompanion.instance) {
      AICompanion.instance = new AICompanion();
    }
    return AICompanion.instance;
  }

  setConfig(config: Partial<CompanionConfig>): void {
    this.config = { ...this.config, ...config };
  }

  setPatientName(name: string): void {
    this.config.patientName = name;
  }

  isSpeaking(): boolean {
    return this.speaking;
  }

  // ── Core Narration ──────────────────────────────────────────

  /**
   * Narrate a screen — provides contextual explanation of where the user
   * is and what they can do.
   */
  async narrateScreen(screenKey: string): Promise<void> {
    // Check for time-of-day variants
    const hour = new Date().getHours();
    let key = screenKey;
    if (screenKey === 'home') {
      if (hour < 12) key = 'home-morning';
      else if (hour < 17) key = 'home-afternoon';
      else key = 'home-evening';
    }

    const narrator = SCREEN_NARRATIONS[key] || SCREEN_NARRATIONS[screenKey];
    if (narrator) {
      await this.speak(narrator(this.config.patientName), 'warm');
    }
  }

  /**
   * Narrate an exercise prompt — reads the question with encouragement.
   */
  async narrateExercise(prompt: string, exerciseType: string): Promise<void> {
    // First, explain the exercise type
    const introKey = `session-${exerciseType}`;
    const intro = SCREEN_NARRATIONS[introKey];
    if (intro) {
      await this.speak(intro(this.config.patientName), 'encouraging');
      await this.pause(800);
    }
    // Then read the actual prompt
    await this.speak(prompt, 'warm');
  }

  /**
   * Narrate exercise feedback with appropriate emotion.
   */
  async narrateFeedback(feedbackType: 'celebrated' | 'guided' | 'supported', message: string): Promise<void> {
    const key = `feedback-${feedbackType}`;
    const narrator = SCREEN_NARRATIONS[key];

    const mood: CompanionMood =
      feedbackType === 'celebrated' ? 'celebratory' :
      feedbackType === 'guided' ? 'encouraging' : 'gentle';

    if (narrator) {
      await this.speak(narrator(this.config.patientName), mood);
      await this.pause(500);
    }
    // Also speak the specific feedback message
    await this.speak(message, mood);
  }

  /**
   * Transition between exercises.
   */
  async narrateTransition(): Promise<void> {
    await this.speak(randomFrom(TRANSITIONS.toNextExercise), 'encouraging');
  }

  /**
   * Give encouragement (can be called anytime).
   */
  async encourage(): Promise<void> {
    await this.speak(
      `${randomFrom(TRANSITIONS.encouragement)}, ${this.config.patientName}.`,
      'warm',
    );
  }

  /**
   * Read a message in a personalized way, introducing the sender.
   * If voice cloning is available, the message body will be played
   * using the sender's cloned voice (handled by VoiceCloneService).
   */
  async narrateMessage(senderName: string, relationship: string, message: string): Promise<void> {
    // Companion introduces the message
    await this.speak(
      `You have a message from ${senderName}, your ${relationship}. Let me read it to you.`,
      'warm',
    );
    await this.pause(600);
    // The actual message — this will be intercepted by VoiceCloneService
    // if a cloned voice exists for this sender
    await this.speak(message, 'warm');
  }

  /**
   * Narrate a photo or memory with context.
   */
  async narratePhoto(description: string, people?: string[], date?: string): Promise<void> {
    let narration = '';
    if (people && people.length > 0) {
      narration += `In this photo, I can see ${people.join(' and ')}. `;
    }
    if (date) {
      narration += `This was taken on ${date}. `;
    }
    narration += description;
    await this.speak(narration, 'warm');
  }

  /**
   * Read a medication with full details.
   */
  async narrateMedication(name: string, dosage: string, time: string, instructions?: string): Promise<void> {
    let text = `Your next medication is ${name}, ${dosage}, due at ${time}.`;
    if (instructions) {
      text += ` ${instructions}.`;
    }
    await this.speak(text, 'warm');
  }

  // ── Inactivity Detection ────────────────────────────────────

  /**
   * Start monitoring for inactivity. After the timeout, speaks a gentle
   * prompt to check if the patient is still engaged.
   */
  startInactivityMonitor(timeoutMs: number = 30000, callback?: () => void): void {
    this.clearInactivityMonitor();
    this.onInactivityCallback = callback || null;
    this.inactivityTimer = setTimeout(async () => {
      await this.speak(
        randomFrom(TRANSITIONS.inactivityPrompt),
        'gentle',
      );
      if (this.onInactivityCallback) this.onInactivityCallback();
    }, timeoutMs);
  }

  /**
   * Reset the inactivity timer (call on any user interaction).
   */
  resetInactivityMonitor(timeoutMs: number = 30000): void {
    if (this.inactivityTimer) {
      this.startInactivityMonitor(timeoutMs, this.onInactivityCallback || undefined);
    }
  }

  clearInactivityMonitor(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  // ── Speech Engine ───────────────────────────────────────────

  async speak(text: string, mood: CompanionMood = 'warm'): Promise<void> {
    if (!text.trim()) return;

    const { rate, pitch } = this.getMoodParams(mood);
    const processed = this.processText(text, mood);

    this.speaking = true;
    try { Speech.stop(); } catch {}

    return new Promise<void>((resolve) => {
      try {
        Speech.speak(processed, {
          rate,
          pitch,
          language: this.config.language,
          voice: this.config.voiceId,
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

  stop(): void {
    try { Speech.stop(); } catch {}
    this.speaking = false;
  }

  private getMoodParams(mood: CompanionMood): { rate: number; pitch: number } {
    const base = this.config;
    switch (mood) {
      case 'celebratory':
        return { rate: base.rate * 1.05, pitch: base.pitch + 0.08 };
      case 'encouraging':
        return { rate: base.rate * 0.95, pitch: base.pitch + 0.03 };
      case 'calming':
        return { rate: base.rate * 0.85, pitch: base.pitch - 0.03 };
      case 'gentle':
        return { rate: base.rate * 0.80, pitch: base.pitch };
      case 'warm':
      default:
        return { rate: base.rate, pitch: base.pitch };
    }
  }

  private processText(text: string, mood: CompanionMood): string {
    let processed = text;
    // Add breathing pauses
    processed = processed.replace(/\.\s+/g, '. ... ');
    processed = processed.replace(/\?\s+/g, '? ... ');
    // Soften exclamation marks for calming/gentle moods
    if (mood === 'calming' || mood === 'gentle') {
      processed = processed.replace(/!/g, '.');
    }
    // Add comma pauses
    processed = processed.replace(/,\s+/g, ', ... ');
    return processed;
  }

  private pause(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const aiCompanion = AICompanion.getInstance();
export { AICompanion };
