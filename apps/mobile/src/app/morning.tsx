import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../components/SafeText';
import { BigButton } from '../components/BigButton';
import { useVoice } from '../hooks/useVoice';
import { colors, spacing, layout, shadows } from '../constants/theme';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function MorningOrientationScreen() {
  const router = useRouter();
  const { speakWarmly } = useVoice();
  const now = new Date();
  const dayName = DAY_NAMES[now.getDay()];
  const monthName = MONTH_NAMES[now.getMonth()];
  const date = now.getDate();
  const year = now.getFullYear();
  const hour = now.getHours();

  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

  useEffect(() => {
    speakWarmly(
      `${greeting}, dear. Today is ${dayName}, ${monthName} ${date}. ` +
      `You are safe at home. Everything is just fine.`
    );
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <SafeText variant="display" center bold color={colors.primary[500]}>
          {greeting}!
        </SafeText>

        <View style={styles.dateCard}>
          <SafeText variant="h1" center bold color={colors.text.primary}>
            {dayName}
          </SafeText>
          <SafeText variant="h2" center color={colors.primary[500]}>
            {monthName} {date}, {year}
          </SafeText>
        </View>

        <View style={styles.infoCard}>
          <SafeText variant="h3" center bold>You are safe at home</SafeText>
          <SafeText variant="bodyLarge" center color={colors.text.secondary} style={{ marginTop: spacing.md }}>
            Portland, Oregon
          </SafeText>
        </View>

        <View style={styles.weatherCard}>
          <SafeText variant="h3" center>{'☀️'} Today's Weather</SafeText>
          <SafeText variant="bodyLarge" center color={colors.text.secondary}>
            Partly cloudy, 62°F
          </SafeText>
        </View>

        <View style={styles.scheduleCard}>
          <SafeText variant="h3" center bold>Today's Plan</SafeText>
          <View style={styles.scheduleItem}>
            <SafeText variant="body" color={colors.primary[500]}>9:00 AM</SafeText>
            <SafeText variant="body">Morning exercise session</SafeText>
          </View>
          <View style={styles.scheduleItem}>
            <SafeText variant="body" color={colors.primary[500]}>12:00 PM</SafeText>
            <SafeText variant="body">Take medication</SafeText>
          </View>
          <View style={styles.scheduleItem}>
            <SafeText variant="body" color={colors.primary[500]}>3:00 PM</SafeText>
            <SafeText variant="body">Lisa is visiting</SafeText>
          </View>
        </View>

        <BigButton
          title="Continue to Home"
          onPress={() => router.replace('/(tabs)/home')}
          variant="primary"
          style={styles.continueButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background.warm },
  content: { padding: layout.screenPadding, gap: spacing.xl, paddingBottom: 120 },
  dateCard: {
    backgroundColor: colors.background.card, borderRadius: layout.borderRadius,
    padding: spacing.xxl, alignItems: 'center', gap: spacing.md, ...shadows.card,
  },
  infoCard: {
    backgroundColor: colors.secondary[50] || '#EDF5F0', borderRadius: layout.borderRadius,
    padding: spacing.xl, ...shadows.card,
  },
  weatherCard: {
    backgroundColor: colors.background.card, borderRadius: layout.borderRadius,
    padding: spacing.xl, gap: spacing.sm, ...shadows.card,
  },
  scheduleCard: {
    backgroundColor: colors.background.card, borderRadius: layout.borderRadius,
    padding: spacing.xl, gap: spacing.lg, ...shadows.card,
  },
  scheduleItem: {
    flexDirection: 'row', gap: spacing.lg, alignItems: 'center',
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border.light,
  },
  continueButton: { marginTop: spacing.lg },
});
