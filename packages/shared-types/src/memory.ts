export enum MemoryType {
  STORY = 'story',
  PHOTO = 'photo',
  VOICE_RECORDING = 'voice_recording',
  VIDEO = 'video',
  MUSIC = 'music',
}

export interface Memory {
  id: string;
  patientId: string;
  type: MemoryType;
  title: string;
  description?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  transcription?: string;
  aiSummary?: string;
  tags: string[];
  isFavorite: boolean;
  recordedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMemoryInput {
  patientId: string;
  type: MemoryType;
  title: string;
  description?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  transcription?: string;
  tags?: string[];
  recordedAt?: string;
}

export interface UpdateMemoryInput {
  title?: string;
  description?: string;
  transcription?: string;
  aiSummary?: string;
  tags?: string[];
  isFavorite?: boolean;
}

export interface StoryTranscript {
  id: string;
  memoryId: string;
  rawTranscription: string;
  cleanedTranscription?: string;
  aiSummary?: string;
  keyPeople: string[];
  keyPlaces: string[];
  keyEvents: string[];
  emotionalTone?: string;
  createdAt: Date;
}
