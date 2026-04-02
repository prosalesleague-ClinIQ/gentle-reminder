import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../components/SafeText';
import { BigButton } from '../components/BigButton';
import { useVoice } from '../hooks/useVoice';
import { colors, spacing, layout, shadows } from '../constants/theme';

interface RoutineItem {
  id: string;
  label: string;
  timeSuggestion: string;
}

const MORNING_ITEMS: RoutineItem[] = [
  { id: 'm1', label: 'Wake up and stretch', timeSuggestion: '7:00 AM' },
  { id: 'm2', label: 'Take morning medication', timeSuggestion: '7:30 AM' },
  { id: 'm3', label: 'Eat breakfast', timeSuggestion: '8:00 AM' },
  { id: 'm4', label: 'Morning exercise session', timeSuggestion: '9:00 AM' },
  { id: 'm5', label: 'Call or visit with family', timeSuggestion: '10:00 AM' },
];

const AFTERNOON_ITEMS: RoutineItem[] = [
  { id: 'a1', label: 'Eat lunch', timeSuggestion: '12:00 PM' },
  { id: 'a2', label: 'Take afternoon medication', timeSuggestion: '12:30 PM' },
  { id: 'a3', label: 'Brain games or reading', timeSuggestion: '1:00 PM' },
  { id: 'a4', label: 'Afternoon walk or activity', timeSuggestion: '3:00 PM' },
  { id: 'a5', label: 'Light snack and rest', timeSuggestion: '4:00 PM' },
];

const EVENING_ITEMS: RoutineItem[] = [
  { id: 'e1', label: 'Eat dinner', timeSuggestion: '6:00 PM' },
  { id: 'e2', label: 'Take evening medication', timeSuggestion: '6:30 PM' },
  { id: 'e3', label: 'Watch favourite show or music', timeSuggestion: '7:00 PM' },
  { id: 'e4', label: 'Prepare for bed', timeSuggestion: '8:30 PM' },
  { id: 'e5', label: 'Relaxation and lights out', timeSuggestion: '9:00 PM' },
];

function getTimeOfDay(): { label: string; items: RoutineItem[] } {
  const hour = new Date().getHours();
  if (hour < 12) {
    return { label: 'Morning', items: MORNING_ITEMS };
  } else if (hour < 17) {
    return { label: 'Afternoon', items: AFTERNOON_ITEMS };
  } else {
    return { label: 'Evening', items: EVENING_ITEMS };
  }
}

export default function RoutineScreen() {
  const router = useRouter();
  const { speakWarmly } = useVoice();
  const { label: timeLabel, items } = useMemo(() => getTimeOfDay(), []);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const completedCount = Object.values(checked).filter(Boolean).length;
  const totalCount = items.length;
  const allDone = completedCount === totalCount;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  const toggleItem = (id: string) => {
    setChecked((prev) => {
      const newChecked = { ...prev, [id]: !prev[id] };
      const newCount = Object.values(newChecked).filter(Boolean).length;
      if (newCount === totalCount) {
        speakWarmly(`Wonderful! You've completed your ${timeLabel.toLowerCase()} routine.`);
      } else if (!prev[id]) {
        speakWarmly("Great job, that's one more done.");
      }
      return newChecked;
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <SafeText variant="h1" bold center style={styles.heading}>
          My Daily Routine
        </SafeText>
        <SafeText variant="h2" bold center color={colors.primary[500]} style={styles.timeLabel}>
          {timeLabel} Routine
        </SafeText>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
          <SafeText variant="body" bold center style={styles.progressText}>
            {completedCount} of {totalCount} done
          </SafeText>
        </View>

        {/* Checklist items */}
        <View style={styles.list}>
          {items.map((item) => {
            const isDone = !!checked[item.id];
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.itemRow, isDone && styles.itemRowDone]}
                onPress={() => toggleItem(item.id)}
                activeOpacity={0.7}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isDone }}
                accessibilityLabel={`${item.label}. ${isDone ? 'Done' : 'Not done'}. Suggested time: ${item.timeSuggestion}`}
              >
                <View style={[styles.checkbox, isDone && styles.checkboxChecked]}>
                  {isDone && (
                    <SafeText variant="h2" bold color="#FFFFFF" center>
                      {'\u2713'}
                    </SafeText>
                  )}
                </View>
                <View style={styles.itemContent}>
                  <SafeText
                    variant="h3"
                    bold={!isDone}
                    color={isDone ? colors.text.muted : colors.text.primary}
                    style={isDone ? styles.strikethrough : undefined}
                  >
                    {item.label}
                  </SafeText>
                  <SafeText variant="body" color={colors.text.secondary}>
                    {item.timeSuggestion}
                  </SafeText>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Completion message */}
        {allDone && (
          <View style={styles.completionCard}>
            <SafeText variant="h2" bold center color={colors.feedback.celebrated}>
              {'\u2B50'} Wonderful!
            </SafeText>
            <SafeText variant="body" center color={colors.text.primary} style={{ marginTop: spacing.sm }}>
              You've completed your {timeLabel.toLowerCase()} routine.
            </SafeText>
          </View>
        )}

        {/* Back button */}
        <BigButton
          title="Back to Home"
          onPress={() => router.back()}
          variant="secondary"
          accessibilityHint="Go back to the home screen"
        />
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
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  timeLabel: {
    marginBottom: spacing.lg,
  },
  progressContainer: {
    marginBottom: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressBarBg: {
    width: '100%',
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.border.light,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 8,
    backgroundColor: colors.feedback.celebrated,
  },
  progressText: {
    marginTop: spacing.xs,
  },
  list: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.lg,
    minHeight: 80,
    gap: spacing.lg,
    ...shadows.card,
  },
  itemRowDone: {
    backgroundColor: '#E8F5E9',
  },
  checkbox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: colors.border.medium,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: colors.feedback.celebrated,
    borderColor: colors.feedback.celebrated,
  },
  itemContent: {
    flex: 1,
    gap: 4,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
  completionCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: layout.borderRadius,
    padding: spacing.xxl,
    marginBottom: spacing.xl,
    alignItems: 'center',
    ...shadows.card,
  },
});
