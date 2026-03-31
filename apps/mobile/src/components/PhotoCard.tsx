import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { SafeText } from './SafeText';
import { colors, layout, spacing, shadows, fontSize, fontWeight } from '../constants/theme';

interface PhotoCardProps {
  /** Image URL */
  photoUrl?: string;
  /** Name label displayed below the photo */
  name: string;
  /** Optional subtitle (e.g., relationship) */
  subtitle?: string;
  /** Card size in pixels (default: 160) */
  size?: number;
  /** Callback when card is tapped */
  onPress?: () => void;
  /** Accessibility label */
  accessibilityLabel?: string;
}

/**
 * Photo display card with name label.
 * Used for family members, profile photos, and memory items.
 */
export function PhotoCard({
  photoUrl,
  name,
  subtitle,
  size = layout.photoCardSize,
  onPress,
  accessibilityLabel,
}: PhotoCardProps) {
  const content = (
    <View style={[styles.card, { width: size }]}>
      <View style={[styles.imageContainer, { width: size, height: size }]}>
        {photoUrl ? (
          <Image
            source={{ uri: photoUrl }}
            style={styles.image}
            contentFit="cover"
            accessibilityLabel={`Photo of ${name}`}
          />
        ) : (
          <View style={styles.placeholder}>
            <SafeText variant="h1" center color={colors.primary[300]}>
              {name.charAt(0).toUpperCase()}
            </SafeText>
          </View>
        )}
      </View>
      <SafeText
        variant="body"
        bold
        center
        numberOfLines={1}
        style={styles.name}
      >
        {name}
      </SafeText>
      {subtitle && (
        <SafeText
          variant="body"
          center
          color={colors.text.secondary}
          numberOfLines={1}
          style={styles.subtitle}
        >
          {subtitle}
        </SafeText>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || `View ${name}`}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    ...shadows.card,
  },
  imageContainer: {
    borderRadius: layout.borderRadius,
    overflow: 'hidden',
    backgroundColor: colors.background.secondary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[50],
  },
  name: {
    marginTop: spacing.sm,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
});
