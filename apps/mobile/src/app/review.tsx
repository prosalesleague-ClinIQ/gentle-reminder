import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../components/SafeText';
import { BigButton } from '../components/BigButton';
import { colors, spacing, layout } from '../constants/theme';

interface ReviewCard {
  question: string;
  answer: string;
}

const DEMO_CARDS: ReviewCard[] = [
  { question: 'Who is Lisa?', answer: 'Lisa is your daughter' },
  { question: 'Who is Robert?', answer: 'Robert is your husband' },
  { question: 'Who is Emma?', answer: 'Emma is your grandchild' },
  { question: 'Where do you live?', answer: 'You live in Portland' },
];

type Difficulty = 'hard' | 'good' | 'easy';

export default function ReviewScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState<Difficulty[]>([]);

  const card = DEMO_CARDS[currentIndex];

  const handleReveal = () => {
    setRevealed(true);
  };

  const handleRate = (difficulty: Difficulty) => {
    const newResults = [...results, difficulty];
    setResults(newResults);
    setRevealed(false);

    if (currentIndex + 1 >= DEMO_CARDS.length) {
      setFinished(true);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (finished) {
    const easyCount = results.filter(r => r === 'easy').length;
    const goodCount = results.filter(r => r === 'good').length;
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.completeContainer}>
            <SafeText variant="display" bold center color={colors.feedback.celebrated}>
              Review Complete!
            </SafeText>
            <View style={{ height: spacing.xl }} />
            <SafeText variant="h2" center color={colors.text.primary}>
              Wonderful work!
            </SafeText>
            <View style={{ height: spacing.md }} />
            <SafeText variant="body" center color={colors.text.secondary}>
              You reviewed all {DEMO_CARDS.length} cards. {easyCount + goodCount >= 3
                ? 'Your memory is doing great today!'
                : 'Every practice session helps strengthen your memory.'}
            </SafeText>
            <View style={{ height: spacing.md }} />
            <SafeText variant="body" center color={colors.text.muted}>
              Easy: {easyCount}  |  Good: {goodCount}  |  Hard: {results.filter(r => r === 'hard').length}
            </SafeText>
            <View style={{ height: spacing.xxxl }} />
            <BigButton
              title="Back to Home"
              onPress={() => router.back()}
              variant="primary"
              accessibilityHint="Return to the home screen"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <SafeText variant="h1" bold center color={colors.text.primary}>
          Memory Review
        </SafeText>
        <View style={{ height: spacing.sm }} />
        <SafeText variant="body" center color={colors.text.secondary}>
          Card {currentIndex + 1} of {DEMO_CARDS.length}
        </SafeText>

        {/* Progress dots */}
        <View style={styles.progressRow}>
          {DEMO_CARDS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                {
                  backgroundColor: i < currentIndex
                    ? colors.feedback.celebrated
                    : i === currentIndex
                    ? colors.primary
                    : '#D1D5DB',
                },
              ]}
            />
          ))}
        </View>

        {/* Card */}
        <View style={styles.card}>
          <SafeText variant="h2" bold center color={colors.text.primary}>
            {card.question}
          </SafeText>

          {revealed ? (
            <View style={styles.answerContainer}>
              <View style={styles.answerDivider} />
              <SafeText variant="h2" center color={colors.feedback.celebrated}>
                {card.answer}
              </SafeText>
            </View>
          ) : (
            <View style={{ height: spacing.xxxl }} />
          )}
        </View>

        {/* Actions */}
        {!revealed ? (
          <TouchableOpacity
            style={styles.revealButton}
            onPress={handleReveal}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Tap to reveal the answer"
            accessibilityHint="Shows the answer to the current question"
          >
            <SafeText variant="h3" bold center color="#FFFFFF">
              Tap to Reveal Answer
            </SafeText>
          </TouchableOpacity>
        ) : (
          <View style={styles.ratingRow}>
            <TouchableOpacity
              style={[styles.ratingButton, { backgroundColor: '#EF4444' }]}
              onPress={() => handleRate('hard')}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Hard - this was difficult to remember"
              accessibilityHint="Marks this card as hard and moves to the next"
            >
              <SafeText variant="h3" bold center color="#FFFFFF">
                Hard
              </SafeText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.ratingButton, { backgroundColor: '#F59E0B' }]}
              onPress={() => handleRate('good')}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Good - you remembered with some effort"
              accessibilityHint="Marks this card as good and moves to the next"
            >
              <SafeText variant="h3" bold center color="#FFFFFF">
                Good
              </SafeText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.ratingButton, { backgroundColor: '#10B981' }]}
              onPress={() => handleRate('easy')}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Easy - you remembered quickly"
              accessibilityHint="Marks this card as easy and moves to the next"
            >
              <SafeText variant="h3" bold center color="#FFFFFF">
                Easy
              </SafeText>
            </TouchableOpacity>
          </View>
        )}

        {/* Back button */}
        <View style={{ height: spacing.xxxl }} />
        <TouchableOpacity
          style={styles.backLink}
          onPress={() => router.back()}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back to home"
        >
          <SafeText variant="body" center color={colors.text.muted}>
            Back to Home
          </SafeText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.warm,
  },
  scrollContent: {
    padding: layout.screenPadding,
    paddingBottom: 120,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  progressDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.xxxl,
    minHeight: 260,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerContainer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  answerDivider: {
    width: 80,
    height: 3,
    backgroundColor: colors.feedback.celebrated,
    borderRadius: 2,
    marginBottom: spacing.xl,
  },
  revealButton: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: layout.borderRadius,
    paddingVertical: 24,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  ratingButton: {
    flex: 1,
    borderRadius: layout.borderRadius,
    paddingVertical: 24,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeContainer: {
    paddingTop: spacing.xxxl * 2,
    alignItems: 'center',
  },
  backLink: {
    padding: spacing.md,
    alignItems: 'center',
  },
});
