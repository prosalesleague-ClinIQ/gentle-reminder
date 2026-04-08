import { Platform } from 'react-native';
import * as Speech from 'expo-speech';

/**
 * Voice Cloning Service for Gentle Reminder.
 *
 * When a message or voice note is received from a family member,
 * this service plays it using the cloned voice of that person —
 * so the patient hears Lisa, Robert, Emma, or James speaking
 * directly to them, not a generic TTS voice.
 *
 * Architecture:
 * - Each family member has a VoiceProfile with an external voice ID
 *   (e.g., from ElevenLabs or similar TTS cloning service)
 * - When speaking as that person, we call the backend to generate
 *   audio using their cloned voice, then play the audio locally
 * - Falls back to a distinctive native TTS voice per person
 *   when cloning is unavailable (demo mode)
 *
 * In demo mode, each family member gets a unique pitch/rate
 * combination to sound different from the AI companion.
 */

export interface VoiceProfile {
  id: string;
  familyMemberId: string;
  name: string;
  relationship: string;
  externalVoiceId?: string; // ElevenLabs voice ID when available
  isCloned: boolean;
  // Demo mode: distinctive TTS parameters per person
  demoPitch: number;
  demoRate: number;
  demoGender: 'female' | 'male';
}

// ── Demo Voice Profiles ──────────────────────────────────────
// Each person gets a unique pitch/rate to sound distinct.

const DEMO_PROFILES: VoiceProfile[] = [
  {
    id: 'vp-lisa',
    familyMemberId: 'fm-lisa',
    name: 'Lisa',
    relationship: 'Daughter',
    isCloned: false,
    demoPitch: 1.2,   // Higher pitch — younger woman
    demoRate: 0.82,    // Slightly faster — energetic
    demoGender: 'female',
  },
  {
    id: 'vp-robert',
    familyMemberId: 'fm-robert',
    name: 'Robert',
    relationship: 'Husband',
    isCloned: false,
    demoPitch: 0.85,   // Lower pitch — older man
    demoRate: 0.68,    // Slower — gentle, measured
    demoGender: 'male',
  },
  {
    id: 'vp-emma',
    familyMemberId: 'fm-emma',
    name: 'Emma',
    relationship: 'Grandchild',
    isCloned: false,
    demoPitch: 1.35,   // High pitch — child's voice
    demoRate: 0.9,     // Faster — youthful energy
    demoGender: 'female',
  },
  {
    id: 'vp-james',
    familyMemberId: 'fm-james',
    name: 'James',
    relationship: 'Son',
    isCloned: false,
    demoPitch: 0.95,   // Medium-low — adult man
    demoRate: 0.75,    // Moderate pace
    demoGender: 'male',
  },
];

// API base URL for voice clone service
const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

class VoiceCloneService {
  private static instance: VoiceCloneService;
  private profiles: Map<string, VoiceProfile> = new Map();
  private currentSound: any = null; // expo-av Sound or HTML5 Audio
  private speaking = false;

  private constructor() {
    // Load demo profiles
    DEMO_PROFILES.forEach((p) => {
      this.profiles.set(p.name.toLowerCase(), p);
      this.profiles.set(p.familyMemberId, p);
    });
  }

  static getInstance(): VoiceCloneService {
    if (!VoiceCloneService.instance) {
      VoiceCloneService.instance = new VoiceCloneService();
    }
    return VoiceCloneService.instance;
  }

  /**
   * Register a voice profile (from API or local creation).
   */
  registerProfile(profile: VoiceProfile): void {
    this.profiles.set(profile.name.toLowerCase(), profile);
    this.profiles.set(profile.familyMemberId, profile);
  }

  /**
   * Get a voice profile by name or family member ID.
   */
  getProfile(nameOrId: string): VoiceProfile | undefined {
    return this.profiles.get(nameOrId.toLowerCase()) || this.profiles.get(nameOrId);
  }

  /**
   * Check if a cloned voice exists for a person.
   */
  hasClonedVoice(nameOrId: string): boolean {
    const profile = this.getProfile(nameOrId);
    return !!profile?.isCloned && !!profile?.externalVoiceId;
  }

  /**
   * Speak text in a family member's voice.
   *
   * If a cloned voice is available, calls the backend to generate
   * audio and plays it locally. Otherwise, uses a distinctive native
   * TTS voice with unique pitch/rate for that person.
   */
  async speakAs(nameOrId: string, text: string): Promise<void> {
    const profile = this.getProfile(nameOrId);
    if (!profile) {
      // Fallback to default TTS
      return this.speakWithDefaultTTS(text);
    }

    if (profile.isCloned && profile.externalVoiceId) {
      // Use cloned voice via backend API
      return this.speakWithClonedVoice(profile, text);
    }

    // Demo mode: use distinctive native TTS
    return this.speakWithDemoVoice(profile, text);
  }

  /**
   * Read a message from a sender — with introduction and their voice.
   *
   * Flow:
   * 1. AI companion voice says: "Lisa says..."
   * 2. Then Lisa's cloned/demo voice reads the actual message
   */
  async readMessage(
    senderName: string,
    senderRelationship: string,
    messageText: string,
    patientName: string = 'Friend',
  ): Promise<void> {
    // Step 1: Companion introduces
    await this.speakAsCompanion(
      `${patientName}, you have a message from ${senderName}, your ${senderRelationship}. Listen...`,
    );
    await this.pause(800);

    // Step 2: Read in sender's voice
    await this.speakAs(senderName, messageText);
  }

  /**
   * Play a greeting from a family member.
   */
  async playGreeting(nameOrId: string, greeting: string): Promise<void> {
    await this.speakAs(nameOrId, greeting);
  }

  isSpeaking(): boolean {
    return this.speaking;
  }

  stop(): void {
    try { Speech.stop(); } catch {}
    if (this.currentSound) {
      try {
        if (Platform.OS === 'web') {
          (this.currentSound as HTMLAudioElement).pause();
        } else {
          this.currentSound.stopAsync();
        }
      } catch {}
      this.currentSound = null;
    }
    this.speaking = false;
  }

  // ── Internal Methods ────────────────────────────────────────

  private async speakWithClonedVoice(profile: VoiceProfile, text: string): Promise<void> {
    this.speaking = true;
    try {
      // Call backend to generate speech with cloned voice
      const response = await fetch(`${API_BASE}/voices/${profile.id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        // Fall back to demo voice on API error
        return this.speakWithDemoVoice(profile, text);
      }

      const { data } = await response.json();
      const audioUrl = data.audioUrl;

      // Play the generated audio
      await this.playAudioUrl(audioUrl);
    } catch {
      // Fall back to demo voice
      return this.speakWithDemoVoice(profile, text);
    }
  }

  private async speakWithDemoVoice(profile: VoiceProfile, text: string): Promise<void> {
    this.speaking = true;
    const processed = this.addNaturalPauses(text);

    return new Promise<void>((resolve) => {
      try {
        Speech.stop();
      } catch {}

      try {
        Speech.speak(processed, {
          rate: profile.demoRate,
          pitch: profile.demoPitch,
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

  private async speakAsCompanion(text: string): Promise<void> {
    this.speaking = true;
    const processed = this.addNaturalPauses(text);

    return new Promise<void>((resolve) => {
      try { Speech.stop(); } catch {}
      try {
        Speech.speak(processed, {
          rate: 0.72,
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

  private async speakWithDefaultTTS(text: string): Promise<void> {
    this.speaking = true;
    return new Promise<void>((resolve) => {
      try { Speech.stop(); } catch {}
      try {
        Speech.speak(text, {
          rate: 0.72,
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

  private async playAudioUrl(url: string): Promise<void> {
    return new Promise<void>(async (resolve) => {
      try {
        if (Platform.OS === 'web') {
          const audio = new Audio(url);
          this.currentSound = audio;
          audio.onended = () => { this.speaking = false; this.currentSound = null; resolve(); };
          audio.onerror = () => { this.speaking = false; this.currentSound = null; resolve(); };
          await audio.play();
        } else {
          const { Audio } = require('expo-av');
          const { sound } = await Audio.Sound.createAsync(
            { uri: url },
            { shouldPlay: true },
            (status: any) => {
              if (status.didJustFinish) {
                this.speaking = false;
                this.currentSound = null;
                sound.unloadAsync();
                resolve();
              }
            },
          );
          this.currentSound = sound;
        }
      } catch {
        this.speaking = false;
        this.currentSound = null;
        resolve();
      }
    });
  }

  private addNaturalPauses(text: string): string {
    return text
      .replace(/\.\s+/g, '. ... ')
      .replace(/!\s+/g, '! ... ')
      .replace(/\?\s+/g, '? ... ')
      .replace(/,\s+/g, ', ... ');
  }

  private pause(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const voiceCloneService = VoiceCloneService.getInstance();
export { VoiceCloneService };
