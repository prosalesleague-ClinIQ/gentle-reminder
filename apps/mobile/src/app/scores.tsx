import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SafeText } from '../components/SafeText';
import { BigButton } from '../components/BigButton';
import { colors, spacing, layout, shadows } from '../constants/theme';

const WEEKLY_SCORES = [
  { day: 'Mon', score: 72 },
  { day: 'Tue', score: 75 },
  { day: 'Wed', score: 82 },
  { day: 'Thu', score: 78 },
  { day: 'Fri', score: 80 },
  { day: 'Sat', score: 85 },
  { day: 'Sun', score: 78 },
];

const DOMAINS = [
  { name: 'Orientation', score: 82 },
  { name: 'Identity', score: 88 },
  { name: 'Memory', score: 64 },
  { name: 'Language', score: 71 },
];

function getBarColor(score: number): string {
  if (score >= 75) return '#4CAF50';
  if (score >= 60) return '#2196F3';
  return '#FF9800';
}

function getDomainBarColor(score: number): string {
  if (score >= 75) return '#4CAF50';
  if (score >= 60) return '#FF9800';
  return '#F44336';
}

export default function ScoresScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Heading */}
        <SafeText variant="display" bold center color={colors.primary[500]} style={styles.heading}>
          My Progress
        </SafeText>
        <SafeText variant="body" center color={colors.text.secondary} style={styles.subheading}>
          You are doing wonderfully. Keep it up!
        </SafeText>

        {/* Current Score Circle */}
        <View style={styles.scoreCircleContainer}>
          <View style={styles.scoreCircle}>
            <SafeText variant="display" bold color="#4CAF50" style={{ fontSize: 48 }}>
              78
            </SafeText>
          </View>
          <SafeText variant="h3" bold center style={styles.scoreLabel}>
            Cognitive Health Score
          </SafeText>
        </View>

        {/* 7-Day Bar Chart */}
        <View style={styles.chartCard}>
          <SafeText variant="h3" bold style={styles.chartTitle}>
            Last 7 Days
          </SafeText>
          <View style={styles.chartContainer}>
            {WEEKLY_SCORES.map((item) => (
              <View key={item.day} style={styles.barColumn}>
                <SafeText variant="body" bold center color={colors.text.secondary}>
                  {item.score}%
                </SafeText>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${item.score}%`,
                        backgroundColor: getBarColor(item.score),
                      },
                    ]}
                  />
                </View>
                <SafeText variant="body" bold center color={colors.text.primary}>
                  {item.day}
                </SafeText>
              </View>
            ))}
          </View>
        </View>

        {/* Domain Breakdown */}
        <View style={styles.domainCard}>
          <SafeText variant="h3" bold style={styles.chartTitle}>
            Domain Breakdown
          </SafeText>
          {DOMAINS.map((domain) => (
            <View key={domain.name} style={styles.domainRow}>
              <View style={styles.domainLabelRow}>
                <SafeText variant="body" bold>
                  {domain.name}
                </SafeText>
                <SafeText variant="body" bold color={getDomainBarColor(domain.score)}>
                  {domain.score}%
                </SafeText>
              </View>
              <View style={styles.domainBarTrack}>
                <View
                  style={[
                    styles.domainBar,
                    {
                      width: `${domain.score}%`,
                      backgroundColor: getDomainBarColor(domain.score),
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Encouraging Note */}
        <View style={styles.encourageCard}>
          <SafeText variant="bodyLarge" center color={colors.primary[700]} bold>
            Your memory exercises are improving!
          </SafeText>
          <SafeText variant="body" center color={colors.text.secondary} style={{ marginTop: spacing.sm }}>
            Every session makes a difference. You should be proud.
          </SafeText>
        </View>

        {/* Back Button */}
        <View style={styles.backButton}>
          <BigButton
            title="Back to Home"
            onPress={() => router.back()}
            variant="secondary"
            accessibilityHint="Go back to the home screen"
          />
        </View>
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
  heading: {
    marginTop: spacing.lg,
  },
  subheading: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  scoreCircleContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  scoreCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 8,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.card,
    ...shadows.card,
  },
  scoreLabel: {
    marginTop: spacing.md,
  },
  chartCard: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.card,
  },
  chartTitle: {
    marginBottom: spacing.lg,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 220,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  barTrack: {
    width: 28,
    height: 160,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: 8,
  },
  domainCard: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.card,
  },
  domainRow: {
    marginBottom: spacing.md,
  },
  domainLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  domainBarTrack: {
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  domainBar: {
    height: '100%',
    borderRadius: 8,
  },
  encourageCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: layout.borderRadius,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  backButton: {
    marginTop: spacing.md,
  },
});
