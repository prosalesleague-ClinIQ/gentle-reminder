import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../components/SafeText';
import { BigButton } from '../components/BigButton';
import { colors, fontSize, fontWeight, spacing, layout } from '../constants/theme';
import { MIN_BUTTON_HEIGHT } from '../constants/accessibility';

/**
 * Login screen with large, accessible input fields.
 * Designed for elderly users - simple layout, big text, clear labels.
 */
export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = useCallback(async () => {
    if (!email.trim() || !password.trim()) return;

    setIsLoading(true);
    setError(null);

    // Demo mode: skip API, go straight to home
    // In production, this would call authService.login()
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)/home');
    }, 500);
  }, [email, password, router]);

  // Demo shortcut: tap title 3 times to skip login
  const handleDemoLogin = useCallback(() => {
    router.replace('/(tabs)/home');
  }, [router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <SafeText
              variant="display"
              center
              bold
              color={colors.primary[500]}
              onPress={handleDemoLogin}
            >
              Gentle Reminder
            </SafeText>
            <SafeText variant="bodyLarge" center color={colors.text.secondary} style={styles.subtitle}>
              Welcome back
            </SafeText>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <SafeText variant="body" center color={colors.feedback.guided}>
                {error}
              </SafeText>
            </View>
          )}

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <SafeText variant="body" bold>
                Email
              </SafeText>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={(text) => {
                  setError(null);
                  setEmail(text);
                }}
                placeholder="Enter your email"
                placeholderTextColor={colors.text.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                accessibilityLabel="Email address"
              />
            </View>

            <View style={styles.inputGroup}>
              <SafeText variant="body" bold>
                Password
              </SafeText>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={(text) => {
                  setError(null);
                  setPassword(text);
                }}
                placeholder="Enter your password"
                placeholderTextColor={colors.text.muted}
                secureTextEntry
                accessibilityLabel="Password"
              />
            </View>
          </View>

          <BigButton
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            disabled={!email.trim() || !password.trim()}
            style={styles.loginButton}
          />

          <SafeText
            variant="body"
            center
            color={colors.text.muted}
            style={styles.demoHint}
          >
            Tap the title to enter demo mode
          </SafeText>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: layout.screenPadding,
  },
  header: {
    marginBottom: spacing.xxxl,
  },
  subtitle: {
    marginTop: spacing.sm,
  },
  errorContainer: {
    backgroundColor: colors.accent[50],
    borderRadius: layout.buttonBorderRadius,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.xl,
    marginBottom: spacing.xxxl,
  },
  inputGroup: {
    gap: spacing.sm,
  },
  input: {
    height: MIN_BUTTON_HEIGHT,
    borderWidth: 2,
    borderColor: colors.border.medium,
    borderRadius: layout.buttonBorderRadius,
    paddingHorizontal: spacing.lg,
    fontSize: fontSize.body,
    fontWeight: fontWeight.regular,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
  },
  loginButton: {
    marginTop: spacing.lg,
  },
  demoHint: {
    marginTop: spacing.xl,
  },
});
