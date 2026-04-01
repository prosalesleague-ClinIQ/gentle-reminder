import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../../components/SafeText';
import { BigButton } from '../../components/BigButton';
import { colors, spacing, layout, shadows } from '../../constants/theme';

interface DemoMed {
  id: string;
  name: string;
  dosage: string;
  time: string;
  status: 'taken' | 'pending' | 'missed';
  instructions?: string;
}

const INITIAL_MEDS: DemoMed[] = [
  { id: '1', name: 'Donepezil', dosage: '10mg', time: '8:00 AM', status: 'taken', instructions: 'Take with food' },
  { id: '2', name: 'Memantine', dosage: '5mg', time: '12:00 PM', status: 'pending', instructions: 'Take with water' },
  { id: '3', name: 'Vitamin D', dosage: '1000 IU', time: '8:00 AM', status: 'taken' },
  { id: '4', name: 'Blood Pressure Med', dosage: '25mg', time: '6:00 PM', status: 'pending' },
];

const STATUS_COLORS = {
  taken: colors.feedback.celebrated,
  pending: colors.feedback.guided,
  missed: colors.text.muted,
};

const STATUS_LABELS = {
  taken: '✓ Taken',
  pending: 'Due Now',
  missed: 'Missed',
};

export default function MedicationsScreen() {
  const [meds, setMeds] = useState(INITIAL_MEDS);

  const handleMarkTaken = (id: string) => {
    setMeds((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'taken' as const } : m)),
    );
  };

  const takenCount = meds.filter((m) => m.status === 'taken').length;
  const totalCount = meds.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SafeText variant="h1" bold style={styles.title}>
          Today's Medications
        </SafeText>

        <View style={styles.summaryCard}>
          <SafeText variant="h2" center bold color={colors.primary[500]}>
            {takenCount} of {totalCount}
          </SafeText>
          <SafeText variant="body" center color={colors.text.secondary}>
            medications taken today
          </SafeText>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(takenCount / totalCount) * 100}%` }]} />
          </View>
        </View>

        {meds.map((med) => (
          <View key={med.id} style={styles.medCard}>
            <View style={styles.medHeader}>
              <View style={styles.medInfo}>
                <SafeText variant="h3" bold>{med.name}</SafeText>
                <SafeText variant="bodyLarge" color={colors.text.secondary}>
                  {med.dosage} · {med.time}
                </SafeText>
                {med.instructions && (
                  <SafeText variant="body" color={colors.text.muted}>
                    {med.instructions}
                  </SafeText>
                )}
              </View>
              <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[med.status] + '20' }]}>
                <SafeText variant="body" bold color={STATUS_COLORS[med.status]}>
                  {STATUS_LABELS[med.status]}
                </SafeText>
              </View>
            </View>
            {med.status === 'pending' && (
              <BigButton
                title="Mark as Taken"
                onPress={() => handleMarkTaken(med.id)}
                variant="secondary"
                style={styles.takeButton}
              />
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background.warm },
  scrollContent: { padding: layout.screenPadding, paddingBottom: 120 },
  title: { marginBottom: spacing.lg },
  summaryCard: {
    backgroundColor: colors.background.card, borderRadius: layout.borderRadius,
    padding: spacing.xl, marginBottom: spacing.xl, alignItems: 'center',
    gap: spacing.sm, ...shadows.card,
  },
  progressBar: {
    width: '100%', height: 8, backgroundColor: colors.border.light,
    borderRadius: 4, marginTop: spacing.sm, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', backgroundColor: colors.feedback.celebrated, borderRadius: 4,
  },
  medCard: {
    backgroundColor: colors.background.card, borderRadius: layout.borderRadius,
    padding: spacing.xl, marginBottom: spacing.lg, ...shadows.card,
  },
  medHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
  },
  medInfo: { flex: 1, gap: spacing.xs },
  statusBadge: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    borderRadius: 20, marginLeft: spacing.md,
  },
  takeButton: { marginTop: spacing.lg },
});
