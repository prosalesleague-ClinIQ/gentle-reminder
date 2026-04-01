import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../../components/SafeText';
import { colors, spacing, layout } from '../../constants/theme';

const DEMO_SLEEP = [
  { night: 'Mon', hours: 7.2, quality: 85, wakeUps: 1 },
  { night: 'Tue', hours: 6.5, quality: 72, wakeUps: 2 },
  { night: 'Wed', hours: 8.0, quality: 90, wakeUps: 0 },
  { night: 'Thu', hours: 5.8, quality: 60, wakeUps: 3 },
  { night: 'Fri', hours: 7.5, quality: 82, wakeUps: 1 },
  { night: 'Sat', hours: 7.0, quality: 78, wakeUps: 1 },
  { night: 'Sun', hours: 6.8, quality: 75, wakeUps: 2 },
];

function getBarColor(hours: number): string {
  if (hours >= 7) return colors.feedback.celebrated;
  if (hours >= 6) return colors.feedback.guided;
  return '#C0392B';
}

export default function SleepScreen() {
  const lastNight = DEMO_SLEEP[DEMO_SLEEP.length - 1];
  const avgHours = DEMO_SLEEP.reduce((sum, n) => sum + n.hours, 0) / DEMO_SLEEP.length;
  const avgQuality = Math.round(
    DEMO_SLEEP.reduce((sum, n) => sum + n.quality, 0) / DEMO_SLEEP.length
  );
  const totalWakeUps = DEMO_SLEEP.reduce((sum, n) => sum + n.wakeUps, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SafeText variant="h1" bold center>
          Sleep Summary
        </SafeText>

        {/* Last Night Highlight */}
        <View style={styles.lastNightCard}>
          <SafeText variant="subheading" bold color={colors.primary[500]}>
            Last Night ({lastNight.night})
          </SafeText>
          <View style={styles.lastNightStats}>
            <View style={styles.lastNightStat}>
              <SafeText variant="display" bold color={colors.text.primary}>
                {lastNight.hours}
              </SafeText>
              <SafeText variant="body" color={colors.text.secondary}>
                hours
              </SafeText>
            </View>
            <View style={styles.lastNightStat}>
              <SafeText variant="display" bold color={colors.text.primary}>
                {lastNight.quality}%
              </SafeText>
              <SafeText variant="body" color={colors.text.secondary}>
                quality
              </SafeText>
            </View>
            <View style={styles.lastNightStat}>
              <SafeText variant="display" bold color={colors.text.primary}>
                {lastNight.wakeUps}
              </SafeText>
              <SafeText variant="body" color={colors.text.secondary}>
                wake-ups
              </SafeText>
            </View>
          </View>
        </View>

        {/* Weekly Average Card */}
        <View style={styles.averageCard}>
          <SafeText variant="subheading" bold color={colors.text.primary}>
            This Week
          </SafeText>
          <View style={styles.avgRow}>
            <View style={styles.avgItem}>
              <SafeText variant="h2" bold color={colors.feedback.celebrated}>
                {avgHours.toFixed(1)}h
              </SafeText>
              <SafeText variant="body" color={colors.text.secondary}>
                Avg Sleep
              </SafeText>
            </View>
            <View style={styles.avgItem}>
              <SafeText variant="h2" bold color={colors.primary[500]}>
                {avgQuality}%
              </SafeText>
              <SafeText variant="body" color={colors.text.secondary}>
                Avg Quality
              </SafeText>
            </View>
            <View style={styles.avgItem}>
              <SafeText variant="h2" bold color={colors.feedback.guided}>
                {totalWakeUps}
              </SafeText>
              <SafeText variant="body" color={colors.text.secondary}>
                Wake-ups
              </SafeText>
            </View>
          </View>
        </View>

        {/* Encouraging Message */}
        <View style={styles.encourageCard}>
          <SafeText variant="bodyLarge" bold center color={colors.feedback.celebrated}>
            You averaged {avgHours.toFixed(1)} hours this week - well done!
          </SafeText>
        </View>

        {/* Nightly Breakdown */}
        <SafeText variant="subheading" bold style={styles.sectionTitle}>
          Nightly Breakdown
        </SafeText>

        {DEMO_SLEEP.map((night) => (
          <View key={night.night} style={styles.nightCard}>
            <View style={styles.nightHeader}>
              <SafeText variant="bodyLarge" bold color={colors.text.primary}>
                {night.night}
              </SafeText>
              <SafeText variant="body" color={colors.text.secondary}>
                {night.wakeUps} wake-up{night.wakeUps !== 1 ? 's' : ''}
              </SafeText>
            </View>

            {/* Sleep hours bar */}
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    width: `${Math.min((night.hours / 10) * 100, 100)}%`,
                    backgroundColor: getBarColor(night.hours),
                  },
                ]}
              />
            </View>

            <View style={styles.nightFooter}>
              <SafeText variant="body" bold color={getBarColor(night.hours)}>
                {night.hours}h slept
              </SafeText>
              <SafeText variant="body" color={colors.primary[500]}>
                {night.quality}% quality
              </SafeText>
            </View>
          </View>
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
  lastNightCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary[50],
    borderRadius: layout.borderRadius,
    padding: spacing.xl,
    borderWidth: 2,
    borderColor: colors.primary[200],
  },
  lastNightStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.lg,
  },
  lastNightStat: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  averageCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  avgRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
  },
  avgItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  encourageCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.secondary[50],
    borderRadius: layout.borderRadius,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.secondary[200],
  },
  sectionTitle: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  nightCard: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  nightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  barContainer: {
    height: 20,
    backgroundColor: colors.border.light,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  bar: {
    height: '100%',
    borderRadius: 10,
  },
  nightFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
