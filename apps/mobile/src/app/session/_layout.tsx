import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../constants/theme';

/**
 * Session stack navigator.
 * All session screens share this layout with no header (custom UI).
 * Gesture navigation is disabled to prevent accidental exits.
 */
export default function SessionLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.warm },
        gestureEnabled: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="start" />
      <Stack.Screen name="orientation" />
      <Stack.Screen name="identity" />
      <Stack.Screen name="memory-game" />
    </Stack>
  );
}
