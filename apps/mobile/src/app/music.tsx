import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../components/SafeText';
import { PlaylistCard } from '../components/PlaylistCard';
import { TrackRow } from '../components/TrackRow';
import { useVoice } from '../hooks/useVoice';
import { musicEngine, PLAYLISTS } from '../services/MusicTherapyEngine';
import { getPersonalRecommendations } from '../services/MusicRecommendation';
import type { MusicTrack, MusicPlaylist, PlaybackState } from '../services/MusicTherapyEngine';
import { colors, spacing, layout, shadows } from '../constants/theme';

type TabCategory = 'recommended' | 'piano' | 'nature' | 'classical' | 'lullaby' | 'memory';

const TABS: { key: TabCategory; label: string }[] = [
  { key: 'recommended', label: 'For You' },
  { key: 'piano', label: 'Piano' },
  { key: 'nature', label: 'Nature' },
  { key: 'classical', label: 'Classical' },
  { key: 'lullaby', label: 'Lullabies' },
  { key: 'memory', label: 'Memories' },
];

const SLEEP_OPTIONS = [15, 30, 45, 60];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function MusicScreen() {
  const router = useRouter();
  const { speak } = useVoice();
  const [activeTab, setActiveTab] = useState<TabCategory>('recommended');
  const [playState, setPlayState] = useState<PlaybackState>('idle');
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [showSleepTimer, setShowSleepTimer] = useState(false);
  const [sleepMinutes, setSleepMinutes] = useState<number | null>(null);

  const recommendations = getPersonalRecommendations();

  useEffect(() => {
    const unsubscribe = musicEngine.onStatusUpdate((status) => {
      setPlayState(status.state);
      setCurrentTrack(status.currentTrack);
      setPosition(status.position);
      setDuration(status.duration);
      setVolume(status.volume);
    });
    const initial = musicEngine.getStatus();
    setPlayState(initial.state);
    setCurrentTrack(initial.currentTrack);
    setPosition(initial.position);
    return unsubscribe;
  }, []);

  const handlePlayPlaylist = useCallback((playlist: MusicPlaylist) => {
    musicEngine.loadPlaylist(playlist);
    speak(`Playing ${playlist.name}.`);
  }, [speak]);

  const handlePlayTrack = useCallback((track: MusicTrack, index: number) => {
    const playlist = PLAYLISTS.find((p) => p.category === track.category);
    if (playlist) {
      musicEngine.loadPlaylist(playlist, index);
    }
    if (track.memoryNote) {
      speak(`This reminds you of: ${track.memoryNote}`);
    }
  }, [speak]);

  const handleSleepTimer = (minutes: number) => {
    musicEngine.setSleepTimer(minutes);
    setSleepMinutes(minutes);
    setShowSleepTimer(false);
    speak(`Sleep timer set for ${minutes} minutes. The music will gently fade.`);
  };

  const progressPercent = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <SafeText variant="h3" color={colors.primary[500]}>Back</SafeText>
        </TouchableOpacity>

        <SafeText variant="h1" bold style={styles.heading}>
          Music Therapy
        </SafeText>

        {/* Now Playing Card */}
        {currentTrack && (
          <View style={styles.nowPlayingCard}>
            <SafeText variant="caption" color={colors.text.secondary}>Now Playing</SafeText>
            <SafeText variant="h2" bold>{currentTrack.title}</SafeText>
            <SafeText variant="body" color={colors.text.secondary}>{currentTrack.artist}</SafeText>
            {currentTrack.memoryNote && (
              <SafeText variant="body" color="#FF7043" style={styles.memoryNote}>
                💛 {currentTrack.memoryNote}
              </SafeText>
            )}

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
              </View>
              <View style={styles.timeRow}>
                <SafeText variant="caption" color={colors.text.muted}>{formatTime(position)}</SafeText>
                <SafeText variant="caption" color={colors.text.muted}>{formatTime(duration)}</SafeText>
              </View>
            </View>

            {/* Playback Controls */}
            <View style={styles.controlsRow}>
              <TouchableOpacity
                style={styles.controlBtn}
                onPress={() => musicEngine.previous()}
                accessibilityLabel="Previous track"
              >
                <SafeText variant="h2" bold color="#FFFFFF">⏮</SafeText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.controlBtn, styles.playBtn]}
                onPress={() => playState === 'playing' ? musicEngine.pause() : musicEngine.play()}
                accessibilityLabel={playState === 'playing' ? 'Pause' : 'Play'}
              >
                <SafeText variant="h1" bold color="#FFFFFF">
                  {playState === 'playing' ? '⏸' : '▶'}
                </SafeText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlBtn}
                onPress={() => musicEngine.next()}
                accessibilityLabel="Next track"
              >
                <SafeText variant="h2" bold color="#FFFFFF">⏭</SafeText>
              </TouchableOpacity>
            </View>

            {/* Volume */}
            <View style={styles.volumeRow}>
              <SafeText variant="caption" color={colors.text.muted}>🔈</SafeText>
              <View style={styles.volumeTrack}>
                <View style={[styles.volumeFill, { width: `${volume * 100}%` }]} />
              </View>
              <TouchableOpacity onPress={() => musicEngine.setVolume(Math.min(1, volume + 0.1))}>
                <SafeText variant="caption" color={colors.text.muted}>🔊</SafeText>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Sleep Timer + Stop */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowSleepTimer(!showSleepTimer)}
            accessibilityLabel="Set sleep timer"
          >
            <SafeText variant="body" bold color="#FFFFFF">
              🌙 Sleep Timer{sleepMinutes ? ` (${sleepMinutes}m)` : ''}
            </SafeText>
          </TouchableOpacity>

          {playState !== 'idle' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.stopButton]}
              onPress={() => musicEngine.stop()}
              accessibilityLabel="Stop music"
            >
              <SafeText variant="body" bold color="#FFFFFF">⏹ Stop</SafeText>
            </TouchableOpacity>
          )}
        </View>

        {showSleepTimer && (
          <View style={styles.sleepOptions}>
            {SLEEP_OPTIONS.map((mins) => (
              <TouchableOpacity
                key={mins}
                style={styles.sleepOption}
                onPress={() => handleSleepTimer(mins)}
                accessibilityLabel={`${mins} minute sleep timer`}
              >
                <SafeText variant="h3" bold color="#FFFFFF">{mins}m</SafeText>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Category Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === tab.key }}
            >
              <SafeText
                variant="body"
                bold
                color={activeTab === tab.key ? '#FFFFFF' : colors.text.secondary}
              >
                {tab.label}
              </SafeText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Content by Tab */}
        {activeTab === 'recommended' ? (
          <View>
            <SafeText variant="h2" bold style={styles.sectionTitle}>
              Recommended for You
            </SafeText>
            {recommendations.map((rec, i) => (
              <View key={i} style={styles.recommendCard}>
                <PlaylistCard
                  playlist={rec.playlist}
                  onPress={handlePlayPlaylist}
                  isPlaying={currentTrack?.category === rec.playlist.category && playState === 'playing'}
                />
                <SafeText variant="caption" color={colors.text.muted} style={styles.rationale}>
                  {rec.rationale}
                </SafeText>
              </View>
            ))}
          </View>
        ) : (
          <View>
            {/* Playlist header */}
            {PLAYLISTS.filter((p) => p.category === activeTab).map((playlist) => (
              <View key={playlist.id}>
                <PlaylistCard
                  playlist={playlist}
                  onPress={handlePlayPlaylist}
                  isPlaying={currentTrack?.category === playlist.category && playState === 'playing'}
                />
                {/* Track listing */}
                <View style={styles.trackList}>
                  {playlist.tracks.map((track, i) => (
                    <TrackRow
                      key={track.id}
                      track={track}
                      index={i}
                      isPlaying={currentTrack?.id === track.id && playState === 'playing'}
                      onPress={handlePlayTrack}
                    />
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF8E1' },
  scrollContent: { padding: layout.screenPadding, paddingBottom: 140 },
  backButton: { marginBottom: spacing.md, padding: spacing.sm, alignSelf: 'flex-start' },
  heading: { marginBottom: spacing.xl },

  // Now Playing
  nowPlayingCard: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    ...shadows.card,
    borderLeftWidth: 6,
    borderLeftColor: '#FF7043',
  },
  memoryNote: { marginTop: spacing.xs, fontStyle: 'italic' },
  progressContainer: { width: '100%', marginTop: spacing.md },
  progressTrack: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: '#FF7043', borderRadius: 4 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  controlsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginTop: spacing.md },
  controlBtn: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#374151', alignItems: 'center', justifyContent: 'center',
    ...shadows.button,
  },
  playBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#00897B' },
  volumeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, width: '100%', marginTop: spacing.md },
  volumeTrack: { flex: 1, height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
  volumeFill: { height: 6, backgroundColor: '#00897B', borderRadius: 3 },

  // Actions
  actionRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  actionButton: {
    flex: 1, height: 56, backgroundColor: '#5B21B6', borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', ...shadows.button,
  },
  stopButton: { backgroundColor: '#DC2626' },
  sleepOptions: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  sleepOption: {
    flex: 1, height: 56, backgroundColor: '#7C3AED', borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },

  // Tabs
  tabBar: { marginBottom: spacing.lg, flexGrow: 0 },
  tab: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderRadius: 24, marginRight: spacing.sm, backgroundColor: '#F3F4F6',
  },
  tabActive: { backgroundColor: '#00897B' },

  // Content
  sectionTitle: { marginBottom: spacing.md },
  recommendCard: { marginBottom: spacing.lg },
  rationale: { marginTop: -spacing.sm, paddingHorizontal: spacing.md, fontStyle: 'italic' },
  trackList: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
});
