import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../components/SafeText';
import { BigButton } from '../components/BigButton';
import { colors, spacing, layout, shadows } from '../constants/theme';

interface JournalEntry {
  date: string;
  text: string;
}

const DEMO_ENTRIES: JournalEntry[] = [
  { date: 'March 30', text: 'Lisa visited today. We looked at photos together.' },
  { date: 'March 29', text: 'Had a lovely walk in the garden. The roses are blooming.' },
  { date: 'March 28', text: 'Played music this morning. Remembered our wedding song.' },
];

export default function JournalScreen() {
  const router = useRouter();
  const [journalText, setJournalText] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const todayString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
          My Journal
        </SafeText>
        <SafeText variant="body" color={colors.text.secondary} style={styles.dateText}>
          {todayString}
        </SafeText>

        {/* Text Input Area */}
        <View style={styles.inputCard}>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder="Write about your day..."
            placeholderTextColor={colors.text.muted}
            value={journalText}
            onChangeText={setJournalText}
            textAlignVertical="top"
            accessibilityLabel="Journal entry text input"
            accessibilityHint="Write about your day here"
          />
        </View>

        {/* Save Button */}
        <BigButton
          title={saved ? 'Saved!' : 'Save Entry'}
          onPress={handleSave}
          variant="primary"
          style={saved ? styles.savedButton : undefined}
          accessibilityHint="Save your journal entry"
        />

        {/* Previous Entries */}
        <SafeText variant="h2" bold style={styles.sectionTitle}>
          Previous Entries
        </SafeText>

        {DEMO_ENTRIES.map((entry) => (
          <View key={entry.date} style={styles.entryCard}>
            <SafeText variant="h3" bold color={colors.primary[500]}>
              {entry.date}
            </SafeText>
            <SafeText variant="body" style={styles.entryText}>
              {entry.text}
            </SafeText>
          </View>
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
    marginBottom: spacing.xs,
  },
  dateText: {
    marginBottom: spacing.xl,
  },
  inputCard: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  textInput: {
    height: 200,
    fontSize: 24,
    color: colors.text.primary,
    padding: spacing.sm,
    lineHeight: 36,
  },
  savedButton: {
    backgroundColor: '#43A047',
  },
  sectionTitle: {
    marginTop: spacing.xxxl,
    marginBottom: spacing.md,
  },
  entryCard: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
    borderLeftWidth: 5,
    borderLeftColor: '#FFB74D',
    ...shadows.card,
  },
  entryText: {
    lineHeight: 34,
  },
});
