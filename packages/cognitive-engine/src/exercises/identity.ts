import { ExerciseType, CognitiveDomain, FeedbackType } from '@gentle-reminder/shared-types';
import { GeneratedPrompt, AnswerEvaluation, PatientContext } from './types';

export function generateIdentityPrompt(context: PatientContext): GeneratedPrompt | null {
  const membersWithPhotos = context.familyMembers.filter((m) => m.photoUrl);
  const candidates = membersWithPhotos.length > 0 ? membersWithPhotos : context.familyMembers;

  if (candidates.length === 0) return null;

  const target = candidates[Math.floor(Math.random() * candidates.length)];

  // Build options: target + up to 2 other family members
  const others = context.familyMembers
    .filter((m) => m.displayName !== target.displayName)
    .slice(0, 2);
  const options = [target.displayName, ...others.map((o) => o.displayName)].sort(
    () => Math.random() - 0.5,
  );

  return {
    type: ExerciseType.IDENTITY_RECOGNITION,
    domain: CognitiveDomain.IDENTITY,
    prompt: 'Who is this person?',
    expectedAnswer: target.displayName,
    acceptableAnswers: [
      target.displayName,
      target.displayName.toLowerCase(),
    ],
    options: options.length >= 2 ? options : undefined,
    hints: [
      `This is your ${target.relationship}`,
      `Their name starts with "${target.displayName[0]}"`,
    ],
    photoUrl: target.photoUrl,
  };
}

export function generateRelationshipPrompt(context: PatientContext): GeneratedPrompt | null {
  if (context.familyMembers.length === 0) return null;

  const target = context.familyMembers[Math.floor(Math.random() * context.familyMembers.length)];

  return {
    type: ExerciseType.IDENTITY_RECOGNITION,
    domain: CognitiveDomain.IDENTITY,
    prompt: `How is ${target.displayName} related to you?`,
    expectedAnswer: target.relationship,
    acceptableAnswers: [
      target.relationship,
      target.relationship.toLowerCase(),
    ],
    hints: [
      `Think about your family...`,
      `${target.displayName} is your ${target.relationship}`,
    ],
    photoUrl: target.photoUrl,
  };
}

export function evaluateIdentityAnswer(
  givenAnswer: string,
  expectedAnswer: string,
  acceptableAnswers: string[],
): AnswerEvaluation {
  const normalizedGiven = givenAnswer.trim().toLowerCase();
  const isCorrect = acceptableAnswers.some(
    (acceptable) => normalizedGiven === acceptable.toLowerCase(),
  );

  if (isCorrect) {
    return {
      isCorrect: true,
      feedbackType: FeedbackType.CELEBRATED,
      score: 1.0,
      feedbackMessage: `Yes! That's ${expectedAnswer}! You remembered!`,
      correctAnswer: expectedAnswer,
    };
  }

  // Check for nickname or partial name match
  const isPartial =
    expectedAnswer.toLowerCase().includes(normalizedGiven) ||
    normalizedGiven.includes(expectedAnswer.toLowerCase());

  if (isPartial && normalizedGiven.length >= 2) {
    return {
      isCorrect: false,
      feedbackType: FeedbackType.GUIDED,
      score: 0.5,
      feedbackMessage: `Almost! This is ${expectedAnswer}. You were so close!`,
      correctAnswer: expectedAnswer,
    };
  }

  return {
    isCorrect: false,
    feedbackType: FeedbackType.SUPPORTED,
    score: 0.0,
    feedbackMessage: `This is ${expectedAnswer}. It's wonderful to see them, isn't it?`,
    correctAnswer: expectedAnswer,
  };
}
