import { Platform } from 'react-native';

/**
 * Music Therapy Engine for dementia care.
 *
 * Manages audio playback of therapeutic playlists with features
 * designed for cognitive support: memory-linked songs, mood-based
 * selection, sleep timers, and gentle volume fading.
 */

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number; // seconds
  url: string;
  category: 'piano' | 'nature' | 'classical' | 'lullaby' | 'memory';
  therapeuticPurpose: string;
  memoryNote?: string;
  year?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description: string;
  tracks: MusicTrack[];
  category: string;
  totalDuration: number; // seconds
}

export type RepeatMode = 'none' | 'one' | 'all';
export type PlaybackState = 'idle' | 'playing' | 'paused' | 'loading' | 'error';

interface PlaybackStatus {
  state: PlaybackState;
  currentTrack: MusicTrack | null;
  position: number; // seconds
  duration: number; // seconds
  volume: number; // 0–1
  playlistIndex: number;
  repeatMode: RepeatMode;
  shuffled: boolean;
}

type StatusCallback = (status: PlaybackStatus) => void;

// ── Demo Tracks ──────────────────────────────────────────────
// Placeholder URLs for development. Replace with real audio in production.
const DEMO_BASE = 'https://www.soundhelix.com/examples/mp3';

const ALL_TRACKS: MusicTrack[] = [
  // Piano
  { id: 'p1', title: 'Moonlight Sonata', artist: 'Beethoven', duration: 360, url: `${DEMO_BASE}/SoundHelix-Song-1.mp3`, category: 'piano', therapeuticPurpose: 'Calming, reduces agitation' },
  { id: 'p2', title: 'Clair de Lune', artist: 'Debussy', duration: 300, url: `${DEMO_BASE}/SoundHelix-Song-2.mp3`, category: 'piano', therapeuticPurpose: 'Promotes relaxation and peace' },
  { id: 'p3', title: 'Gymnopédie No. 1', artist: 'Satie', duration: 195, url: `${DEMO_BASE}/SoundHelix-Song-3.mp3`, category: 'piano', therapeuticPurpose: 'Gentle stimulation, reduces anxiety' },
  { id: 'p4', title: 'Für Elise', artist: 'Beethoven', duration: 180, url: `${DEMO_BASE}/SoundHelix-Song-4.mp3`, category: 'piano', therapeuticPurpose: 'Familiar melody, stimulates recall' },

  // Nature
  { id: 'n1', title: 'Ocean Waves', artist: 'Nature', duration: 600, url: `${DEMO_BASE}/SoundHelix-Song-5.mp3`, category: 'nature', therapeuticPurpose: 'Deep relaxation, sleep induction' },
  { id: 'n2', title: 'Forest Rain', artist: 'Nature', duration: 600, url: `${DEMO_BASE}/SoundHelix-Song-6.mp3`, category: 'nature', therapeuticPurpose: 'Calming, masks distracting noise' },
  { id: 'n3', title: 'Morning Birdsong', artist: 'Nature', duration: 480, url: `${DEMO_BASE}/SoundHelix-Song-7.mp3`, category: 'nature', therapeuticPurpose: 'Gentle awakening, orientation to morning' },
  { id: 'n4', title: 'Gentle Stream', artist: 'Nature', duration: 540, url: `${DEMO_BASE}/SoundHelix-Song-8.mp3`, category: 'nature', therapeuticPurpose: 'Continuous calm, reduces restlessness' },

  // Classical
  { id: 'c1', title: 'Canon in D', artist: 'Pachelbel', duration: 330, url: `${DEMO_BASE}/SoundHelix-Song-9.mp3`, category: 'classical', therapeuticPurpose: 'Structured rhythm, cognitive engagement' },
  { id: 'c2', title: 'Air on the G String', artist: 'Bach', duration: 300, url: `${DEMO_BASE}/SoundHelix-Song-10.mp3`, category: 'classical', therapeuticPurpose: 'Soothing, promotes well-being' },
  { id: 'c3', title: 'The Swan', artist: 'Saint-Saëns', duration: 195, url: `${DEMO_BASE}/SoundHelix-Song-11.mp3`, category: 'classical', therapeuticPurpose: 'Graceful movement, emotional connection' },

  // Lullabies
  { id: 'l1', title: 'Brahms Lullaby', artist: 'Brahms', duration: 180, url: `${DEMO_BASE}/SoundHelix-Song-12.mp3`, category: 'lullaby', therapeuticPurpose: 'Sleep induction, comfort' },
  { id: 'l2', title: 'Twinkle Twinkle', artist: 'Traditional', duration: 120, url: `${DEMO_BASE}/SoundHelix-Song-13.mp3`, category: 'lullaby', therapeuticPurpose: 'Familiar childhood melody, comfort' },
  { id: 'l3', title: 'Rock-a-bye Baby', artist: 'Traditional', duration: 150, url: `${DEMO_BASE}/SoundHelix-Song-14.mp3`, category: 'lullaby', therapeuticPurpose: 'Deep-rooted memory, soothing' },

  // Memory Lane (linked to patient memories)
  { id: 'm1', title: "Can't Help Falling in Love", artist: 'Elvis Presley', duration: 180, url: `${DEMO_BASE}/SoundHelix-Song-15.mp3`, category: 'memory', therapeuticPurpose: 'Reminiscence therapy', memoryNote: 'Our wedding song, June 1975', year: '1961' },
  { id: 'm2', title: 'What a Wonderful World', artist: 'Louis Armstrong', duration: 138, url: `${DEMO_BASE}/SoundHelix-Song-16.mp3`, category: 'memory', therapeuticPurpose: 'Reminiscence therapy', memoryNote: "Robert's favorite song", year: '1967' },
  { id: 'm3', title: 'Over the Rainbow', artist: 'Judy Garland', duration: 210, url: `${DEMO_BASE}/SoundHelix-Song-1.mp3`, category: 'memory', therapeuticPurpose: 'Reminiscence therapy', memoryNote: 'Grandma used to sing this every Sunday', year: '1939' },
  { id: 'm4', title: 'Moon River', artist: 'Andy Williams', duration: 168, url: `${DEMO_BASE}/SoundHelix-Song-2.mp3`, category: 'memory', therapeuticPurpose: 'Reminiscence therapy', memoryNote: 'Played at our anniversary dinner', year: '1961' },
];

// ── Playlists ────────────────────────────────────────────────

function buildPlaylist(id: string, name: string, description: string, category: string): MusicPlaylist {
  const tracks = ALL_TRACKS.filter((t) => t.category === category);
  return {
    id,
    name,
    description,
    tracks,
    category,
    totalDuration: tracks.reduce((sum, t) => sum + t.duration, 0),
  };
}

export const PLAYLISTS: MusicPlaylist[] = [
  buildPlaylist('piano', 'Peaceful Piano', 'Calming piano pieces to ease the mind', 'piano'),
  buildPlaylist('nature', 'Nature Sounds', 'Soothing sounds from the natural world', 'nature'),
  buildPlaylist('classical', 'Classical Favorites', 'Gentle classical music for well-being', 'classical'),
  buildPlaylist('lullaby', 'Gentle Lullabies', 'Soft melodies for rest and comfort', 'lullaby'),
  buildPlaylist('memory', 'Memory Lane', 'Songs linked to your special memories', 'memory'),
];

// ── Engine ───────────────────────────────────────────────────

class MusicTherapyEngine {
  private static instance: MusicTherapyEngine;
  private sound: any = null; // expo-av Audio.Sound or HTML5 Audio
  private currentPlaylist: MusicPlaylist | null = null;
  private playlistIndex: number = 0;
  private volume: number = 0.8;
  private repeatMode: RepeatMode = 'all';
  private shuffled: boolean = false;
  private state: PlaybackState = 'idle';
  private position: number = 0;
  private duration: number = 0;
  private sleepTimer: ReturnType<typeof setTimeout> | null = null;
  private fadeInterval: ReturnType<typeof setInterval> | null = null;
  private statusCallbacks: Set<StatusCallback> = new Set();
  private positionInterval: ReturnType<typeof setInterval> | null = null;

  private constructor() {}

  static getInstance(): MusicTherapyEngine {
    if (!MusicTherapyEngine.instance) {
      MusicTherapyEngine.instance = new MusicTherapyEngine();
    }
    return MusicTherapyEngine.instance;
  }

  // ── Playback Controls ──────────────────────────────────────

  async loadPlaylist(playlist: MusicPlaylist, startIndex: number = 0): Promise<void> {
    await this.stopInternal();
    this.currentPlaylist = playlist;
    this.playlistIndex = startIndex;
    await this.loadAndPlay(playlist.tracks[startIndex]);
  }

  async play(): Promise<void> {
    if (this.state === 'paused' && this.sound) {
      await this.resumeInternal();
    } else if (this.currentPlaylist) {
      await this.loadAndPlay(this.currentPlaylist.tracks[this.playlistIndex]);
    }
  }

  async pause(): Promise<void> {
    if (this.sound && this.state === 'playing') {
      try {
        if (Platform.OS === 'web') {
          (this.sound as HTMLAudioElement).pause();
        } else {
          await this.sound.pauseAsync();
        }
        this.state = 'paused';
        this.notifyStatus();
      } catch {}
    }
  }

  async next(): Promise<void> {
    if (!this.currentPlaylist) return;
    this.playlistIndex = (this.playlistIndex + 1) % this.currentPlaylist.tracks.length;
    await this.loadAndPlay(this.currentPlaylist.tracks[this.playlistIndex]);
  }

  async previous(): Promise<void> {
    if (!this.currentPlaylist) return;
    // If more than 3 seconds in, restart current track
    if (this.position > 3) {
      await this.seekTo(0);
      return;
    }
    this.playlistIndex = (this.playlistIndex - 1 + this.currentPlaylist.tracks.length) % this.currentPlaylist.tracks.length;
    await this.loadAndPlay(this.currentPlaylist.tracks[this.playlistIndex]);
  }

  async stop(): Promise<void> {
    await this.stopInternal();
    this.clearSleepTimer();
    this.notifyStatus();
  }

  async seekTo(seconds: number): Promise<void> {
    if (!this.sound) return;
    try {
      if (Platform.OS === 'web') {
        (this.sound as HTMLAudioElement).currentTime = seconds;
      } else {
        await this.sound.setPositionAsync(seconds * 1000);
      }
      this.position = seconds;
      this.notifyStatus();
    } catch {}
  }

  async setVolume(vol: number): Promise<void> {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.sound) {
      try {
        if (Platform.OS === 'web') {
          (this.sound as HTMLAudioElement).volume = this.volume;
        } else {
          await this.sound.setVolumeAsync(this.volume);
        }
      } catch {}
    }
    this.notifyStatus();
  }

  setRepeatMode(mode: RepeatMode): void {
    this.repeatMode = mode;
    this.notifyStatus();
  }

  // ── Sleep Timer ────────────────────────────────────────────

  setSleepTimer(minutes: number): void {
    this.clearSleepTimer();
    // Start fading 2 minutes before timer ends
    const fadeStart = Math.max(0, (minutes - 2) * 60 * 1000);
    const totalMs = minutes * 60 * 1000;

    if (minutes > 2) {
      this.sleepTimer = setTimeout(() => {
        this.startFadeOut();
      }, fadeStart);
    } else {
      this.startFadeOut();
    }

    // Hard stop at timer end
    this.sleepTimer = setTimeout(() => {
      this.stop();
    }, totalMs);
  }

  clearSleepTimer(): void {
    if (this.sleepTimer) {
      clearTimeout(this.sleepTimer);
      this.sleepTimer = null;
    }
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
  }

  // ── Status ─────────────────────────────────────────────────

  getStatus(): PlaybackStatus {
    return {
      state: this.state,
      currentTrack: this.currentPlaylist?.tracks[this.playlistIndex] || null,
      position: this.position,
      duration: this.duration,
      volume: this.volume,
      playlistIndex: this.playlistIndex,
      repeatMode: this.repeatMode,
      shuffled: this.shuffled,
    };
  }

  onStatusUpdate(callback: StatusCallback): () => void {
    this.statusCallbacks.add(callback);
    return () => this.statusCallbacks.delete(callback);
  }

  getPlaylists(): MusicPlaylist[] {
    return PLAYLISTS;
  }

  getTracksByCategory(category: string): MusicTrack[] {
    return ALL_TRACKS.filter((t) => t.category === category);
  }

  getAllTracks(): MusicTrack[] {
    return ALL_TRACKS;
  }

  // ── Internal ───────────────────────────────────────────────

  private async loadAndPlay(track: MusicTrack): Promise<void> {
    await this.stopInternal();
    this.state = 'loading';
    this.notifyStatus();

    try {
      if (Platform.OS === 'web') {
        this.sound = new Audio(track.url);
        this.sound.volume = this.volume;
        this.sound.onended = () => this.onTrackEnd();
        this.sound.onloadedmetadata = () => {
          this.duration = this.sound.duration || track.duration;
          this.notifyStatus();
        };
        await this.sound.play();
      } else {
        const { Audio } = require('expo-av');
        const { sound } = await Audio.Sound.createAsync(
          { uri: track.url },
          { shouldPlay: true, volume: this.volume },
          (status: any) => {
            if (status.isLoaded) {
              this.position = (status.positionMillis || 0) / 1000;
              this.duration = (status.durationMillis || track.duration * 1000) / 1000;
              if (status.didJustFinish) this.onTrackEnd();
              this.notifyStatus();
            }
          },
        );
        this.sound = sound;
      }

      this.state = 'playing';
      this.position = 0;
      this.duration = track.duration;
      this.startPositionTracking();
      this.notifyStatus();
    } catch (error) {
      this.state = 'error';
      this.notifyStatus();
    }
  }

  private async resumeInternal(): Promise<void> {
    if (!this.sound) return;
    try {
      if (Platform.OS === 'web') {
        await (this.sound as HTMLAudioElement).play();
      } else {
        await this.sound.playAsync();
      }
      this.state = 'playing';
      this.startPositionTracking();
      this.notifyStatus();
    } catch {}
  }

  private async stopInternal(): Promise<void> {
    this.stopPositionTracking();
    if (this.sound) {
      try {
        if (Platform.OS === 'web') {
          (this.sound as HTMLAudioElement).pause();
          (this.sound as HTMLAudioElement).currentTime = 0;
        } else {
          await this.sound.stopAsync();
          await this.sound.unloadAsync();
        }
      } catch {}
      this.sound = null;
    }
    this.state = 'idle';
    this.position = 0;
  }

  private onTrackEnd(): void {
    if (!this.currentPlaylist) return;

    if (this.repeatMode === 'one') {
      this.loadAndPlay(this.currentPlaylist.tracks[this.playlistIndex]);
    } else if (this.playlistIndex < this.currentPlaylist.tracks.length - 1) {
      this.playlistIndex++;
      this.loadAndPlay(this.currentPlaylist.tracks[this.playlistIndex]);
    } else if (this.repeatMode === 'all') {
      this.playlistIndex = 0;
      this.loadAndPlay(this.currentPlaylist.tracks[this.playlistIndex]);
    } else {
      this.state = 'idle';
      this.notifyStatus();
    }
  }

  private startFadeOut(): void {
    const originalVolume = this.volume;
    const steps = 20;
    const stepMs = (2 * 60 * 1000) / steps; // 2 minutes fade
    let currentStep = 0;

    this.fadeInterval = setInterval(() => {
      currentStep++;
      const newVol = originalVolume * (1 - currentStep / steps);
      this.setVolume(Math.max(0, newVol));
      if (currentStep >= steps) {
        if (this.fadeInterval) clearInterval(this.fadeInterval);
      }
    }, stepMs);
  }

  private startPositionTracking(): void {
    this.stopPositionTracking();
    if (Platform.OS === 'web') {
      this.positionInterval = setInterval(() => {
        if (this.sound && this.state === 'playing') {
          this.position = (this.sound as HTMLAudioElement).currentTime || 0;
          this.notifyStatus();
        }
      }, 1000);
    }
    // Native uses the status callback from createAsync
  }

  private stopPositionTracking(): void {
    if (this.positionInterval) {
      clearInterval(this.positionInterval);
      this.positionInterval = null;
    }
  }

  private notifyStatus(): void {
    const status = this.getStatus();
    this.statusCallbacks.forEach((cb) => {
      try { cb(status); } catch {}
    });
  }
}

export const musicEngine = MusicTherapyEngine.getInstance();
export { MusicTherapyEngine };
