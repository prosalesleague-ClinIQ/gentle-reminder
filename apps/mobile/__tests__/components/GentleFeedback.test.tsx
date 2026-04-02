/**
 * GentleFeedback component tests.
 *
 * This is a critical dementia-care component. It must:
 * - NEVER show "wrong" or red indicators
 * - Only use celebrated (green), guided (amber), supported (blue)
 * - Always provide encouraging, positive feedback
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import { GentleFeedback } from '../../src/components/GentleFeedback';
import { FeedbackType } from '@gentle-reminder/shared-types';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
jest.mock('../../src/hooks/useAccessibility', () => ({
  useAccessibility: () => ({
    scaledFontSize: (size: number) => size,
    textColor: '#1A1A1A',
  }),
}));

jest.mock('../../src/hooks/useVoice', () => ({
  useVoice: () => ({
    speak: jest.fn(),
    stop: jest.fn(),
    isSpeaking: false,
  }),
}));

jest.mock('../../src/utils/scoring', () => ({
  getFeedbackMessage: (type: string, name?: string) => {
    const messages: Record<string, string> = {
      celebrated: `Wonderful, ${name || 'friend'}!`,
      guided: `Good try, ${name || 'friend'}. Let me help.`,
      supported: `That is okay, ${name || 'friend'}. Let us try together.`,
    };
    return messages[type] || 'Keep going!';
  },
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getAllText(container: any): string {
  const texts: string[] = [];
  function walk(node: any) {
    if (typeof node === 'string') {
      texts.push(node);
    }
    if (node?.props?.children) {
      const children = Array.isArray(node.props.children)
        ? node.props.children
        : [node.props.children];
      children.forEach(walk);
    }
  }
  walk(container);
  return texts.join(' ').toLowerCase();
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('GentleFeedback', () => {
  // ---- Celebrated state (correct answer) ----------------------------------

  it('renders celebrated feedback', () => {
    const { getByText } = render(
      <GentleFeedback feedbackType={FeedbackType.CELEBRATED} speakFeedback={false} />
    );
    expect(getByText(/Wonderful/i)).toBeTruthy();
  });

  it('displays a star icon for celebrated state', () => {
    const { getByText } = render(
      <GentleFeedback feedbackType={FeedbackType.CELEBRATED} speakFeedback={false} />
    );
    expect(getByText(/⭐/)).toBeTruthy();
  });

  // ---- Guided state (partially correct) -----------------------------------

  it('renders guided feedback', () => {
    const { getByText } = render(
      <GentleFeedback feedbackType={FeedbackType.GUIDED} speakFeedback={false} />
    );
    expect(getByText(/Good try/i)).toBeTruthy();
  });

  it('displays a compass icon for guided state', () => {
    const { getByText } = render(
      <GentleFeedback feedbackType={FeedbackType.GUIDED} speakFeedback={false} />
    );
    expect(getByText(/🧭/)).toBeTruthy();
  });

  // ---- Supported state (incorrect, but never "wrong") ---------------------

  it('renders supported feedback', () => {
    const { getByText } = render(
      <GentleFeedback feedbackType={FeedbackType.SUPPORTED} speakFeedback={false} />
    );
    expect(getByText(/okay/i)).toBeTruthy();
  });

  it('displays a heart icon for supported state', () => {
    const { getByText } = render(
      <GentleFeedback feedbackType={FeedbackType.SUPPORTED} speakFeedback={false} />
    );
    expect(getByText(/💙/)).toBeTruthy();
  });

  // ---- CRITICAL: Never shows "wrong" or red -------------------------------

  it('NEVER renders the word "wrong" in celebrated feedback', () => {
    const { toJSON } = render(
      <GentleFeedback feedbackType={FeedbackType.CELEBRATED} speakFeedback={false} />
    );
    const fullText = JSON.stringify(toJSON()).toLowerCase();
    expect(fullText).not.toContain('wrong');
  });

  it('NEVER renders the word "wrong" in guided feedback', () => {
    const { toJSON } = render(
      <GentleFeedback feedbackType={FeedbackType.GUIDED} speakFeedback={false} />
    );
    const fullText = JSON.stringify(toJSON()).toLowerCase();
    expect(fullText).not.toContain('wrong');
  });

  it('NEVER renders the word "wrong" in supported feedback', () => {
    const { toJSON } = render(
      <GentleFeedback feedbackType={FeedbackType.SUPPORTED} speakFeedback={false} />
    );
    const fullText = JSON.stringify(toJSON()).toLowerCase();
    expect(fullText).not.toContain('wrong');
  });

  it('NEVER renders the word "incorrect" in any feedback state', () => {
    const types = [FeedbackType.CELEBRATED, FeedbackType.GUIDED, FeedbackType.SUPPORTED];
    for (const type of types) {
      const { toJSON } = render(
        <GentleFeedback feedbackType={type} speakFeedback={false} />
      );
      const fullText = JSON.stringify(toJSON()).toLowerCase();
      expect(fullText).not.toContain('incorrect');
    }
  });

  it('NEVER renders the word "failed" in any feedback state', () => {
    const types = [FeedbackType.CELEBRATED, FeedbackType.GUIDED, FeedbackType.SUPPORTED];
    for (const type of types) {
      const { toJSON } = render(
        <GentleFeedback feedbackType={type} speakFeedback={false} />
      );
      const fullText = JSON.stringify(toJSON()).toLowerCase();
      expect(fullText).not.toContain('failed');
    }
  });

  // ---- Custom message override --------------------------------------------

  it('displays a custom message when provided', () => {
    const { getByText } = render(
      <GentleFeedback
        feedbackType={FeedbackType.CELEBRATED}
        message="You remembered perfectly, Margaret!"
        speakFeedback={false}
      />
    );
    expect(getByText('You remembered perfectly, Margaret!')).toBeTruthy();
  });

  // ---- Personalized name --------------------------------------------------

  it('includes the patient preferred name in feedback', () => {
    const { getByText } = render(
      <GentleFeedback
        feedbackType={FeedbackType.CELEBRATED}
        preferredName="Margaret"
        speakFeedback={false}
      />
    );
    expect(getByText(/Margaret/)).toBeTruthy();
  });

  // ---- Animation / mount --------------------------------------------------

  it('has an alert accessibility role for screen readers', () => {
    const { getByRole } = render(
      <GentleFeedback feedbackType={FeedbackType.CELEBRATED} speakFeedback={false} />
    );
    expect(getByRole('alert')).toBeTruthy();
  });

  it('sets accessibilityLabel to the feedback message', () => {
    const { getByRole } = render(
      <GentleFeedback feedbackType={FeedbackType.CELEBRATED} speakFeedback={false} />
    );
    const alert = getByRole('alert');
    expect(alert.props.accessibilityLabel).toMatch(/Wonderful/i);
  });

  // ---- FeedbackType enum values are exactly 3 -----------------------------

  it('only has three FeedbackType values (celebrated, guided, supported)', () => {
    const values = Object.values(FeedbackType);
    expect(values).toHaveLength(3);
    expect(values).toContain('celebrated');
    expect(values).toContain('guided');
    expect(values).toContain('supported');
  });
});
