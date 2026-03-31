import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../constants/theme';

/**
 * Brain Games stack navigator.
 * All cognitive test screens share this layout with no header.
 */
export default function TestsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.warm },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="reaction" />
      <Stack.Screen name="visual-match" />
      <Stack.Screen name="word-recall" />
    </Stack>
  );
}
