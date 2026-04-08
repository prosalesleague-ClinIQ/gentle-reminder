import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeText } from './SafeText';
import type { MusicPlaylist } from '../services/MusicTherapyEngine';
import { colors, spacing, layout, shadows } from '../constants/theme';

const CATEGORY_ICONS: Record<string, string> = {
  piano: '🎹',
  nature: '🌿',
  classical: '🎻',
  lullaby: '🌙',
  memory: '💛',
};

interface PlaylistCardProps {
  playlist: MusicPlaylist;
  onPress: (playlist: MusicPlaylist) => void;
  isPlaying?: boolean;
}

export function PlaylistCard({ playlist, onPress, isPlaying }: PlaylistCardProps) {
  const icon = CATEGORY_ICONS[playlist.category] || '🎵';
  const durationMin = Math.round(playlist.totalDuration / 60);

  return (
    <TouchableOpacity
      style={[styles.card, isPlaying && styles.cardPlaying]}
      onPress={() => onPress(playlist)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${playlist.name}. ${playlist.tracks.length} tracks, ${durationMin} minutes. ${playlist.description}. ${isPlaying ? 'Now playing.' : 'Tap to play.'}`}
    >
      <SafeText variant="h1" style={styles.icon}>{icon}</SafeText>
      <View style={styles.info}>
        <SafeText variant="h3" bold>{playlist.name}</SafeText>
        <SafeText variant="body" color={colors.text.secondary}>
          {playlist.tracks.length} tracks · {durationMin} min
        </SafeText>
        <SafeText variant="caption" color={colors.text.muted} numberOfLines={1}>
          {playlist.description}
        </SafeText>
      </View>
      <View style={[styles.playBadge, isPlaying && styles.playBadgePlaying]}>
        <SafeText variant="h3" bold color="#FFFFFF">
          {isPlaying ? '⏸' : '▶'}
        </SafeText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.card,
  },
  cardPlaying: {
    borderLeftWidth: 5,
    borderLeftColor: '#00897B',
  },
  icon: {
    fontSize: 40,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  playBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#00897B',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.button,
  },
  playBadgePlaying: {
    backgroundColor: '#E65100',
  },
});
