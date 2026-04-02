export enum ExerciseType {
  ORIENTATION_DATE = 'orientation_date',
  ORIENTATION_NAME = 'orientation_name',
  ORIENTATION_LOCATION = 'orientation_location',
  IDENTITY_RECOGNITION = 'identity_recognition',
  MEMORY_SEQUENCE = 'memory_sequence',
  MEMORY_OBJECT = 'memory_object',
  MEMORY_CATEGORY = 'memory_category',
  PATTERN_MATCHING = 'pattern_matching',
  CLOCK_TIME = 'clock_time',
  ATTENTION_LETTER_CANCELLATION = 'attention_letter_cancellation',
  ATTENTION_DIGIT_SPAN = 'attention_digit_span',
  ATTENTION_TRAIL_MAKING = 'attention_trail_making',
  ATTENTION_COUNTING = 'attention_counting',
  ATTENTION_WORD_DETECTION = 'attention_word_detection',
  ATTENTION_SYMBOL_SEARCH = 'attention_symbol_search',
  EXECUTIVE_CATEGORIZATION = 'executive_categorization',
  EXECUTIVE_PROBLEM_SOLVING = 'executive_problem_solving',
  EXECUTIVE_SEQUENCING = 'executive_sequencing',
  EXECUTIVE_PLANNING = 'executive_planning',
  EXECUTIVE_INHIBITION = 'executive_inhibition',
  EXECUTIVE_FLEXIBILITY = 'executive_flexibility',
  VERBAL_LETTER_FLUENCY = 'verbal_letter_fluency',
  VERBAL_SEMANTIC_FLUENCY = 'verbal_semantic_fluency',
  VERBAL_SENTENCE_BUILDING = 'verbal_sentence_building',
  VERBAL_WORD_DEFINITION = 'verbal_word_definition',
  VERBAL_RHYMING = 'verbal_rhyming',
  VERBAL_STORYTELLING = 'verbal_storytelling',
  VISUAL_SPATIAL_DIRECTION = 'visual_spatial_direction',
  VISUAL_SPATIAL_MAZE = 'visual_spatial_maze',
  VISUAL_SPATIAL_RELATION = 'visual_spatial_relation',
  VISUAL_SPATIAL_CLOCK_POSITION = 'visual_spatial_clock_position',
  VISUAL_SPATIAL_MAP_READING = 'visual_spatial_map_reading',
  VISUAL_SPATIAL_SHAPE_MATCHING = 'visual_spatial_shape_matching',
}

export enum FeedbackType {
  CELEBRATED = 'celebrated',
  GUIDED = 'guided',
  SUPPORTED = 'supported',
}

export enum CognitiveDomain {
  ORIENTATION = 'orientation',
  IDENTITY = 'identity',
  MEMORY = 'memory',
  LANGUAGE = 'language',
  EXECUTIVE_FUNCTION = 'executive_function',
  ATTENTION = 'attention',
  VISUAL_SPATIAL = 'visual_spatial',
  VERBAL_FLUENCY = 'verbal_fluency',
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  domain: CognitiveDomain;
  prompt: string;
  expectedAnswer: string;
  options?: string[];
  difficulty: number;
  metadata?: Record<string, unknown>;
}

export interface ExerciseResult {
  id: string;
  sessionId: string;
  exerciseId: string;
  exerciseType: ExerciseType;
  domain: CognitiveDomain;
  prompt: string;
  expectedAnswer: string;
  givenAnswer: string;
  isCorrect: boolean;
  responseTimeMs: number;
  feedbackType: FeedbackType;
  score: number;
  attemptNumber: number;
  createdAt: Date;
}

export interface CreateExerciseResultInput {
  sessionId: string;
  exerciseType: ExerciseType;
  domain: CognitiveDomain;
  prompt: string;
  expectedAnswer: string;
  givenAnswer: string;
  isCorrect: boolean;
  responseTimeMs: number;
  feedbackType: FeedbackType;
  score: number;
  attemptNumber?: number;
}

export interface CognitiveScore {
  id: string;
  patientId: string;
  sessionId: string;
  overallScore: number;
  orientationScore: number;
  identityScore: number;
  memoryScore: number;
  languageScore: number;
  executiveFunctionScore: number;
  attentionScore: number;
  recordedAt: Date;
}

export interface ExercisePrompt {
  type: ExerciseType;
  domain: CognitiveDomain;
  prompt: string;
  expectedAnswer: string;
  options?: string[];
  hints?: string[];
  photoUrl?: string;
  audioUrl?: string;
}
