import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../components/SafeText';
import { BigButton } from '../components/BigButton';
import { useVoice } from '../hooks/useVoice';
import { colors, spacing, layout, shadows } from '../constants/theme';

interface Playlist {
  name: string;
  tracks: number;
  duration: string;
}

interface MemorySong {
  title: string;
  memory: string;
  year?: string;
}

const PLAYLISTS: Playlist[] = [
  { name: 'Peaceful Piano', tracks: 12, duration: '45 min' },
  { name: 'Nature Sounds', tracks: 8, duration: '30 min' },
  { name: 'Classical Favorites', tracks: 15, duration: '60 min' },
];

const MEMORY_SONGS: MemorySong[] = [
  { title: "Can't Help Falling in Love", memory: 'Our wedding song', year: '1975' },
  { title: 'What a Wonderful World', memory: "Robert's favorite" },
  { title: 'Over the Rainbow', memory: 'Grandma used to sing this' },
];

export default function MusicScreen() {
  const router = useRouter();
  const { speak } = useVoice();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMemorySong = (song: MemorySong) => {
    speak(`This reminds you of ${song.memory}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
          Music & Memories
        </SafeText>

        {/* Now Playing */}
        <View style={styles.nowPlayingCard}>
          <SafeText variant="body" color={colors.text.secondary}>Now Playing</SafeText>
          <SafeText variant="h2" bold>Moonlight Sonata</SafeText>
          <SafeText variant="body" color={colors.text.secondary}>Beethoven</SafeText>
          <TouchableOpacity
            style={[styles.playPauseButton, isPlaying && styles.playPauseButtonActive]}
            onPress={() => setIsPlaying(!isPlaying)}
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? 'Pause music' : 'Play music'}
          >
            <SafeText variant="h2" bold color="#FFFFFF">
              {isPlaying ? 'Pause' : 'Play'}
            </SafeText>
          </TouchableOpacity>
        </View>

        {/* Calming Music */}
        <SafeText variant="h2" bold style={styles.sectionTitle}>
          Calming Music
        </SafeText>

        {PLAYLISTS.map((playlist) => (
          <TouchableOpacity
            key={playlist.name}
            style={styles.playlistCard}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Play ${playlist.name}, ${playlist.tracks} tracks, ${playlist.duration}`}
          >
            <View style={styles.playlistInfo}>
              <SafeText variant="h3" bold>{playlist.name}</SafeText>
              <SafeText variant="body" color={colors.text.secondary}>
                {playlist.tracks} tracks - {playlist.duration}
              </SafeText>
            </View>
            <View style={styles.smallPlayButton}>
              <SafeText variant="h3" bold color="#FFFFFF">Play</SafeText>
            </View>
          </TouchableOpacity>
        ))}

        {/* Memory Songs */}
        <SafeText variant="h2" bold style={styles.sectionTitle}>
          Memory Songs
        </SafeText>

        {MEMORY_SONGS.map((song) => (
          <TouchableOpacity
            key={song.title}
            style={styles.memorySongCard}
            onPress={() => handleMemorySong(song)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`${song.title}, ${song.memory}${song.year ? `, ${song.year}` : ''}`}
          >
            <View style={styles.memorySongInfo}>
              <SafeText variant="h3" bold>{song.title}</SafeText>
              <SafeText variant="body" color={colors.text.secondary}>
                {song.memory}{song.year ? ` - ${song.year}` : ''}
              </SafeText>
            </View>
            <View style={styles.memoryPlayButton}>
              <SafeText variant="h3" bold color="#FFFFFF">Play</SafeText>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  scrollContent: {
    padding: layout.screenPadding,
    paddingBottom: 120,
  },
  backButton: {
    marginBottom: spacing.md,
    padding: spacing.sm,
    alignSelf: 'flex-start',
  },
  heading: {
    marginBottom: spacing.xl,
  },
  nowPlayingCard: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
    ...shadows.card,
    borderLeftWidth: 6,
    borderLeftColor: '#FF7043',
  },
  playPauseButton: {
    marginTop: spacing.md,
    backgroundColor: '#00897B',
    borderRadius: layout.buttonBorderRadius,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.lg,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    ...shadows.button,
  },
  playPauseButtonActive: {
    backgroundColor: '#E65100',
  },
  sectionTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  playlistCard: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.card,
  },
  playlistInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  smallPlayButton: {
    backgroundColor: '#00897B',
    borderRadius: 16,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.button,
  },
  memorySongCard: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 5,
    borderLeftColor: '#FFB74D',
    ...shadows.card,
  },
  memorySongInfo: {
    flex: 1,
    gap: spacing.xs,
    marginRight: spacing.md,
  },
  memoryPlayButton: {
    backgroundColor: '#FF7043',
    borderRadius: 16,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.button,
  },
});
