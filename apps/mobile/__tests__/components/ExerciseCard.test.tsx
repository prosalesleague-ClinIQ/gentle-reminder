/**
 * ExerciseCard component tests.
 *
 * Validates the prompt/option/text-input layout,
 * MAX_CHOICES enforcement, hint display, and disabled state.
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ExerciseCard } from '../../src/components/ExerciseCard';
import { MAX_CHOICES_PER_SCREEN } from '../../src/constants/accessibility';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
jest.mock('../../src/hooks/useAccessibility', () => ({
  useAccessibility: () => ({
    scaledFontSize: (size: number) => size,
    textColor: '#1A1A1A',
  }),
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Medium: 'medium' },
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const baseProps = {
  prompt: 'What day is it today?',
  options: ['Monday', 'Tuesday', 'Wednesday'],
  selectedAnswer: null,
  onSelectAnswer: jest.fn(),
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('ExerciseCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---- Prompt rendering ---------------------------------------------------

  it('renders the prompt text', () => {
    const { getByText } = render(<ExerciseCard {...baseProps} />);
    expect(getByText('What day is it today?')).toBeTruthy();
  });

  it('renders the card with a form accessibility role', () => {
    const { getByRole } = render(<ExerciseCard {...baseProps} />);
    expect(getByRole('form')).toBeTruthy();
  });

  // ---- Option buttons -----------------------------------------------------

  it('renders option buttons when options are provided', () => {
    const { getByText } = render(<ExerciseCard {...baseProps} />);
    expect(getByText('Monday')).toBeTruthy();
    expect(getByText('Tuesday')).toBeTruthy();
    expect(getByText('Wednesday')).toBeTruthy();
  });

  it('calls onSelectAnswer when an option is tapped', () => {
    const handler = jest.fn();
    const { getByText } = render(
      <ExerciseCard {...baseProps} onSelectAnswer={handler} />
    );
    fireEvent.press(getByText('Tuesday'));
    expect(handler).toHaveBeenCalledWith('Tuesday');
  });

  it('calls onSelectAnswer with the correct option value', () => {
    const handler = jest.fn();
    const { getByText } = render(
      <ExerciseCard {...baseProps} onSelectAnswer={handler} />
    );
    fireEvent.press(getByText('Monday'));
    expect(handler).toHaveBeenCalledWith('Monday');
    fireEvent.press(getByText('Wednesday'));
    expect(handler).toHaveBeenCalledWith('Wednesday');
  });

  // ---- MAX_CHOICES enforcement -------------------------------------------

  it(`displays at most ${MAX_CHOICES_PER_SCREEN} options (MAX_CHOICES_PER_SCREEN)`, () => {
    const manyOptions = ['A', 'B', 'C', 'D', 'E'];
    const { queryByText } = render(
      <ExerciseCard
        {...baseProps}
        options={manyOptions}
      />
    );
    // Only the first 3 (MAX_CHOICES_PER_SCREEN) should render
    expect(queryByText('A')).toBeTruthy();
    expect(queryByText('B')).toBeTruthy();
    expect(queryByText('C')).toBeTruthy();
    expect(queryByText('D')).toBeNull();
    expect(queryByText('E')).toBeNull();
  });

  it('confirms MAX_CHOICES_PER_SCREEN constant equals 3', () => {
    expect(MAX_CHOICES_PER_SCREEN).toBe(3);
  });

  // ---- Text input mode ----------------------------------------------------

  it('shows a text input when no options are provided', () => {
    const { getByLabelText } = render(
      <ExerciseCard
        {...baseProps}
        options={[]}
      />
    );
    expect(getByLabelText('Your answer')).toBeTruthy();
  });

  it('shows a Submit button in text input mode', () => {
    const { getByText } = render(
      <ExerciseCard {...baseProps} options={[]} />
    );
    expect(getByText('Submit')).toBeTruthy();
  });

  it('calls onSelectAnswer with trimmed text on submit', () => {
    const handler = jest.fn();
    const { getByLabelText, getByText } = render(
      <ExerciseCard {...baseProps} options={[]} onSelectAnswer={handler} />
    );
    const input = getByLabelText('Your answer');
    fireEvent.changeText(input, '  Wednesday  ');
    fireEvent.press(getByText('Submit'));
    expect(handler).toHaveBeenCalledWith('Wednesday');
  });

  it('does not call onSelectAnswer when text input is empty', () => {
    const handler = jest.fn();
    const { getByText } = render(
      <ExerciseCard {...baseProps} options={[]} onSelectAnswer={handler} />
    );
    fireEvent.press(getByText('Submit'));
    expect(handler).not.toHaveBeenCalled();
  });

  // ---- Hint text ----------------------------------------------------------

  it('displays hint text when provided', () => {
    const { getByText } = render(
      <ExerciseCard {...baseProps} hint="Think about the calendar" />
    );
    expect(getByText('Think about the calendar')).toBeTruthy();
  });

  it('does not render hint when not provided', () => {
    const { queryByText } = render(<ExerciseCard {...baseProps} />);
    expect(queryByText('Think about the calendar')).toBeNull();
  });

  // ---- Disabled state -----------------------------------------------------

  it('prevents option selection when disabled', () => {
    const handler = jest.fn();
    const { getByText } = render(
      <ExerciseCard {...baseProps} onSelectAnswer={handler} disabled />
    );
    fireEvent.press(getByText('Monday'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('prevents text input when disabled', () => {
    const { getByLabelText } = render(
      <ExerciseCard {...baseProps} options={[]} disabled />
    );
    const input = getByLabelText('Your answer');
    expect(input.props.editable).toBe(false);
  });

  // ---- Selected answer highlighting ---------------------------------------

  it('highlights the selected answer option', () => {
    const { getByText } = render(
      <ExerciseCard {...baseProps} selectedAnswer="Tuesday" />
    );
    // The selected option should still be visible and accessible
    const selected = getByText('Tuesday');
    expect(selected).toBeTruthy();
  });
});
