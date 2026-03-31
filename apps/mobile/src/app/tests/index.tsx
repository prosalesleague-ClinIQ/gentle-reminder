import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../../components/SafeText';
import { HomeButton } from '../../components/HomeButton';
import { colors, spacing, layout, shadows, fontSize, fontWeight } from '../../constants/theme';

interface GameCard {
  title: string;
  description: string;
  time: string;
  route: string;
  color: string;
  icon: string;
}

const GAMES: GameCard[] = [
  {
    title: 'Reaction Time',
    description: 'Tap the circle as fast as you can!',
    time: '~1 min',
    route: '/tests/reaction',
    color: '#E57373',
    icon: '🎯',
  },
  {
    title: 'Pattern Match',
    description: 'Are the two patterns the same?',
    time: '~2 min',
    route: '/tests/visual-match',
    color: '#64B5F6',
    icon: '🧩',
  },
  {
    title: 'Word Recall',
    description: 'Remember and type the words you see.',
    time: '~2 min',
    route: '/tests/word-recall',
    color: '#81C784',
    icon: '📝',
  },
];

/**
 * Brain Games selection screen.
 * Shows 3 large cards for the available cognitive micro-tests.
 */
export default function TestSelectionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SafeText variant="h1" bold center color={colors.text.primary} style={styles.heading}>
          Brain Games
        </SafeText>
        <SafeText variant="body" center color={colors.text.secondary} style={styles.subtitle}>
          Pick a game to play. Have fun!
        </SafeText>

        <View style={styles.cards}>
          {GAMES.map((game) => (
            <TouchableOpacity
              key={game.route}
              style={[styles.card, { borderLeftColor: game.color, borderLeftWidth: 6 }]}
              onPress={() => router.push(game.route as any)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`${game.title}. ${game.description}. Takes about ${game.time}`}
            >
              <View style={styles.cardHeader}>
                <SafeText variant="h2" bold style={styles.cardIcon}>
                  {game.icon}
                </SafeText>
                <View style={styles.cardText}>
                  <SafeText variant="h3" bold color={colors.text.primary}>
                    {game.title}
                  </SafeText>
                  <SafeText variant="body" color={colors.text.secondary}>
                    {game.description}
                  </SafeText>
                </View>
              </View>
              <View style={styles.timeTag}>
                <SafeText variant="body" color={colors.text.muted}>
                  {game.time}
                </SafeText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <HomeButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.warm,
  },
  scrollContent: {
    padding: layout.screenPadding,
    paddingBottom: 140,
  },
  heading: {
    marginTop: spacing.lg,
  },
  subtitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  cards: {
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.xl,
    ...shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  cardIcon: {
    width: 60,
    textAlign: 'center',
  },
  cardText: {
    flex: 1,
    gap: spacing.xs || 4,
  },
  timeTag: {
    marginTop: spacing.md,
    alignSelf: 'flex-end',
  },
});
