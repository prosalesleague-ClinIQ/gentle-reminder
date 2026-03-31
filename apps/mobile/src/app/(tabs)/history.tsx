import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../../components/SafeText';
import { colors, spacing, layout, shadows } from '../../constants/theme';

/**
 * Session History screen.
 * Shows past cognitive exercise sessions with scores and stats.
 */

interface DemoSession {
  date: string;
  score: number;
  exercises: number;
  duration: string;
}

const DEMO_SESSIONS: DemoSession[] = [
  { date: 'March 30, 2026', score: 82, exercises: 8, duration: '7 min' },
  { date: 'March 29, 2026', score: 75, exercises: 8, duration: '6 min' },
  { date: 'March 28, 2026', score: 68, exercises: 6, duration: '5 min' },
  { date: 'March 26, 2026', score: 88, exercises: 8, duration: '8 min' },
  { date: 'March 25, 2026', score: 45, exercises: 4, duration: '4 min' },
];

function getScoreColor(score: number): string {
  if (score >= 80) return colors.feedback.celebrated;
  if (score >= 50) return colors.feedback.supported;
  return colors.feedback.guided;
}

function getStatusMessage(score: number): string {
  if (score >= 80) return 'Wonderful session!';
  if (score >= 50) return 'Good work!';
  return 'Thank you for practicing!';
}

function SessionCard({ session }: { session: DemoSession }) {
  const barColor = getScoreColor(session.score);
  const statusMessage = getStatusMessage(session.score);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <SafeText variant="bodyLarge" bold>
          {session.date}
        </SafeText>
        <View style={styles.scoreContainer}>
          <SafeText variant="bodyLarge" bold color={barColor}>
            {session.score}%
          </SafeText>
        </View>
      </View>

      {/* Color-coded score bar */}
      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            {
              backgroundColor: barColor,
              width: `${session.score}%`,
            },
          ]}
        />
      </View>

      <View style={styles.statsRow}>
        <SafeText variant="body">
          {session.exercises} exercises
        </SafeText>
        <SafeText variant="body">
          {session.duration}
        </SafeText>
      </View>

      <SafeText variant="body" bold color={barColor}>
        {statusMessage}
      </SafeText>
    </View>
  );
}

export default function HistoryScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SafeText variant="h1" bold style={styles.title}>
          Session History
        </SafeText>

        {DEMO_SESSIONS.map((session, index) => (
          <SessionCard key={index} session={session} />
        ))}
      </ScrollView>
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
    paddingBottom: 120,
  },
  title: {
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: layout.cardPadding,
    marginBottom: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barBackground: {
    height: 12,
    backgroundColor: colors.border.light,
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
