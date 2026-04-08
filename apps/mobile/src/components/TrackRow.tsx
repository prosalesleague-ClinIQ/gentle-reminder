import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeText } from './SafeText';
import type { MusicTrack } from '../services/MusicTherapyEngine';
import { colors, spacing } from '../constants/theme';

interface TrackRowProps {
  track: MusicTrack;
  index: number;
  isPlaying: boolean;
  onPress: (track: MusicTrack, index: number) => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function TrackRow({ track, index, isPlaying, onPress }: TrackRowProps) {
  return (
    <TouchableOpacity
      style={[styles.row, isPlaying && styles.rowPlaying]}
      onPress={() => onPress(track, index)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Track ${index + 1}: ${track.title} by ${track.artist}. ${formatTime(track.duration)}.${track.memoryNote ? ` Memory: ${track.memoryNote}.` : ''} ${isPlaying ? 'Now playing.' : 'Tap to play.'}`}
    >
      <View style={styles.number}>
        <SafeText
          variant="body"
          bold
          color={isPlaying ? '#00897B' : colors.text.muted}
        >
          {isPlaying ? '♪' : `${index + 1}`}
        </SafeText>
      </View>
      <View style={styles.info}>
        <SafeText
          variant="body"
          bold
          color={isPlaying ? '#00897B' : colors.text.primary}
        >
          {track.title}
        </SafeText>
        <SafeText variant="caption" color={colors.text.secondary}>
          {track.artist}
          {track.memoryNote ? ` · ${track.memoryNote}` : ''}
        </SafeText>
      </View>
      <SafeText variant="caption" color={colors.text.muted}>
        {formatTime(track.duration)}
      </SafeText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: spacing.md,
  },
  rowPlaying: {
    backgroundColor: '#F0FFF4',
    borderRadius: 12,
    borderBottomWidth: 0,
    marginBottom: 2,
  },
  number: {
    width: 32,
    alignItems: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
});
