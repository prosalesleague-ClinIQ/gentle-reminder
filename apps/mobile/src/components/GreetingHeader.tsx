import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { SafeText } from './SafeText';
import { getGreeting, getFriendlyDate } from '../utils/greeting';
import { colors, spacing, layout } from '../constants/theme';

interface GreetingHeaderProps {
  /** Patient's preferred name */
  preferredName: string;
  /** Profile photo URL */
  profilePhotoUrl?: string;
  /** Override the greeting hour (for testing) */
  hour?: number;
}

/**
 * Greeting header with profile photo, personalized greeting, and today's date.
 */
export function GreetingHeader({
  preferredName,
  profilePhotoUrl,
  hour,
}: GreetingHeaderProps) {
  const greeting = getGreeting(preferredName, hour);
  const todayDate = getFriendlyDate();

  return (
    <View style={styles.container} accessibilityRole="header">
      <View style={styles.photoContainer}>
        {profilePhotoUrl ? (
          <Image
            source={{ uri: profilePhotoUrl }}
            style={styles.photo}
            contentFit="cover"
            accessibilityLabel={`Profile photo of ${preferredName}`}
          />
        ) : (
          <View style={styles.photoPlaceholder}>
            <SafeText variant="display" center color={colors.primary[300]}>
              {preferredName.charAt(0).toUpperCase()}
            </SafeText>
          </View>
        )}
      </View>
      <SafeText variant="h1" center bold style={styles.greeting}>
        {greeting}
      </SafeText>
      <SafeText variant="bodyLarge" center color={colors.text.secondary}>
        {todayDate}
      </SafeText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  photoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    borderWidth: 3,
    borderColor: colors.primary[200],
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[50],
  },
  greeting: {
    marginBottom: spacing.xs,
  },
});
