import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeText } from './SafeText';
import { musicEngine } from '../services/MusicTherapyEngine';
import type { PlaybackState, MusicTrack } from '../services/MusicTherapyEngine';
import { colors, spacing, shadows } from '../constants/theme';

/**
 * Compact mini player bar that shows when music is playing.
 * Tap to open the full music screen.
 */
export function MusicMiniPlayer() {
  const router = useRouter();
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [state, setState] = useState<PlaybackState>('idle');

  useEffect(() => {
    const unsubscribe = musicEngine.onStatusUpdate((status) => {
      setCurrentTrack(status.currentTrack);
      setState(status.state);
    });
    // Initialize from current status
    const initial = musicEngine.getStatus();
    setCurrentTrack(initial.currentTrack);
    setState(initial.state);
    return unsubscribe;
  }, []);

  if (!currentTrack || state === 'idle') return null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push('/music' as any)}
      accessibilityRole="button"
      accessibilityLabel={`Now playing: ${currentTrack.title} by ${currentTrack.artist}. Tap to open music player.`}
    >
      <View style={styles.trackInfo}>
        <SafeText variant="body" bold color="#FFFFFF" numberOfLines={1}>
          {currentTrack.title}
        </SafeText>
        <SafeText variant="caption" color="#E5E7EB" numberOfLines={1}>
          {currentTrack.artist}
        </SafeText>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={(e) => {
            e.stopPropagation();
            state === 'playing' ? musicEngine.pause() : musicEngine.play();
          }}
          accessibilityRole="button"
          accessibilityLabel={state === 'playing' ? 'Pause' : 'Play'}
        >
          <SafeText variant="h2" color="#FFFFFF">
            {state === 'playing' ? '⏸' : '▶️'}
          </SafeText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={(e) => {
            e.stopPropagation();
            musicEngine.next();
          }}
          accessibilityRole="button"
          accessibilityLabel="Next track"
        >
          <SafeText variant="h2" color="#FFFFFF">⏭</SafeText>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100, // Above tab bar
    left: 12,
    right: 12,
    height: 72,
    backgroundColor: '#1F2937',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    ...shadows.card,
    elevation: 8,
  },
  trackInfo: {
    flex: 1,
    gap: 2,
  },
  controls: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
