import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../components/SafeText';
import { BigButton } from '../components/BigButton';
import { colors, spacing, layout, shadows } from '../constants/theme';

interface Appointment {
  time: string;
  title: string;
  color: string;
}

const TODAY_APPOINTMENTS: Appointment[] = [
  { time: '9:00 AM', title: 'Morning exercise session', color: '#1976D2' },
  { time: '2:00 PM', title: 'Lisa visiting', color: '#E91E63' },
  { time: '4:00 PM', title: 'Dr. Chen appointment', color: '#43A047' },
];

const TOMORROW_APPOINTMENTS: Appointment[] = [
  { time: '10:00 AM', title: 'Cognitive session', color: '#7C4DFF' },
  { time: '3:00 PM', title: 'James calling', color: '#FF7043' },
];

const WEEK_SUMMARY = [
  { label: '5 sessions scheduled', color: '#1976D2' },
  { label: '2 family visits', color: '#E91E63' },
  { label: '1 doctor appointment', color: '#43A047' },
];

export default function CalendarScreen() {
  const router = useRouter();
  const [reminderSet, setReminderSet] = useState(false);

  const handleAddReminder = () => {
    setReminderSet(true);
    setTimeout(() => setReminderSet(false), 3000);
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
          My Schedule
        </SafeText>

        {/* Today Card */}
        <View style={styles.todayCard}>
          <SafeText variant="body" color={colors.text.secondary}>Today</SafeText>
          <SafeText variant="h2" bold>Tuesday, March 31, 2026</SafeText>

          <View style={styles.appointmentsList}>
            {TODAY_APPOINTMENTS.map((apt) => (
              <View key={apt.time} style={styles.appointmentRow}>
                <View style={[styles.colorDot, { backgroundColor: apt.color }]} />
                <View style={styles.appointmentInfo}>
                  <SafeText variant="h3" bold>{apt.time}</SafeText>
                  <SafeText variant="body">{apt.title}</SafeText>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Tomorrow */}
        <SafeText variant="h2" bold style={styles.sectionTitle}>
          Tomorrow
        </SafeText>

        {TOMORROW_APPOINTMENTS.map((apt) => (
          <View key={apt.time} style={styles.appointmentCard}>
            <View style={[styles.colorDot, { backgroundColor: apt.color }]} />
            <View style={styles.appointmentInfo}>
              <SafeText variant="h3" bold>{apt.time}</SafeText>
              <SafeText variant="body">{apt.title}</SafeText>
            </View>
          </View>
        ))}

        {/* This Week Summary */}
        <SafeText variant="h2" bold style={styles.sectionTitle}>
          This Week
        </SafeText>

        <View style={styles.weekSummaryCard}>
          {WEEK_SUMMARY.map((item) => (
            <View key={item.label} style={styles.summaryRow}>
              <View style={[styles.colorDot, { backgroundColor: item.color }]} />
              <SafeText variant="body">{item.label}</SafeText>
            </View>
          ))}
        </View>

        {/* Add Reminder Button */}
        <View style={styles.buttonContainer}>
          <BigButton
            title={reminderSet ? 'Reminder set!' : 'Add Reminder'}
            onPress={handleAddReminder}
            variant="primary"
            style={reminderSet ? styles.reminderSetButton : undefined}
            accessibilityHint="Set a new reminder"
          />
        </View>

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
  todayCard: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.xl,
    gap: spacing.sm,
    marginBottom: spacing.xl,
    borderLeftWidth: 6,
    borderLeftColor: '#FF7043',
    ...shadows.card,
  },
  appointmentsList: {
    marginTop: spacing.md,
    gap: spacing.lg,
  },
  appointmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  appointmentInfo: {
    flex: 1,
    gap: 2,
  },
  sectionTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  appointmentCard: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.card,
  },
  weekSummaryCard: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.xl,
    gap: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.card,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
  reminderSetButton: {
    backgroundColor: '#43A047',
  },
});
