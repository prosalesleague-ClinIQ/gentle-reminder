import React, { Component, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeText } from './SafeText';
import { BigButton } from './BigButton';
import { colors, spacing, layout } from '../constants/theme';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <SafeText variant="display" center>💙</SafeText>
          <SafeText variant="h2" center bold color={colors.primary[500]} style={styles.title}>
            Something went wrong
          </SafeText>
          <SafeText variant="bodyLarge" center color={colors.text.secondary} style={styles.message}>
            {this.props.fallbackMessage || "Don't worry, everything is okay. Let's try again."}
          </SafeText>
          <BigButton title="Try Again" onPress={this.handleRetry} variant="primary" style={styles.button} />
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    padding: layout.screenPadding, backgroundColor: colors.background.warm,
    gap: spacing.xl,
  },
  title: { marginTop: spacing.lg },
  message: { maxWidth: 400 },
  button: { marginTop: spacing.xl, minWidth: 200 },
});
