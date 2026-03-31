import React, { ReactNode } from 'react';
import { View, ViewProps, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { layout, shadows, spacing } from '../theme/spacing';

interface CardProps extends ViewProps {
  children: ReactNode;
  padded?: boolean;
  style?: ViewStyle;
}

export function Card({ children, padded = true, style, ...props }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        padded && styles.padded,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    ...shadows.card,
  },
  padded: {
    padding: layout.cardPadding,
  },
});
