import React, { useEffect } from 'react';
import { Slot, Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../constants/theme';

/**
 * Root layout with SafeAreaProvider.
 * Always renders the Stack navigator so Expo Router can mount routes.
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background.primary },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="onboarding" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="morning" options={{ animation: 'fade' }} />
        <Stack.Screen name="tutorial" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="photos" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="tests" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="sos" options={{ animation: 'fade', gestureEnabled: true }} />
        <Stack.Screen name="mood" options={{ animation: 'fade', gestureEnabled: true }} />
        <Stack.Screen name="profile" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="export" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="music" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="journal" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="calendar" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen
          name="session"
          options={{
            gestureEnabled: false,
            animation: 'slide_from_right',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
