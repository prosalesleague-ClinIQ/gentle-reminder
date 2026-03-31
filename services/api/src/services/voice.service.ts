import { getDatabase } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import type { PaginationMeta } from '@gentle-reminder/shared-types';

/**
 * Voice profile service.
 * Manages voice cloning profiles and speech generation with consent tracking.
 * Uses ElevenLabs API scaffold — actual integration requires an API key.
 */

// ── Types ─────────────────────────────────────────────────

export interface VoiceProfile {
  id: string;
  patientId: string;
  familyMemberId: string;
  familyMemberName: string;
  externalVoiceId?: string;
  consentGivenAt: string;
  consentGivenBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateSpeechResult {
  audioUrl: string;
  durationMs: number;
  voiceProfileId: string;
}

// ── In-memory store (demo mode) ───────────────────────────

const voiceProfiles: Map<string, VoiceProfile> = new Map();

function initDemoProfiles() {
  if (voiceProfiles.size > 0) return;

  const demoPatientId = 'demo-patient-margaret';
  const now = new Date().toISOString();

  const profiles: VoiceProfile[] = [
    {
      id: 'voice-lisa',
      patientId: demoPatientId,
      familyMemberId: 'family-lisa',
      familyMemberName: 'Lisa',
      consentGivenAt: now,
      consentGivenBy: 'Lisa Thompson',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'voice-robert',
      patientId: demoPatientId,
      familyMemberId: 'family-robert',
      familyMemberName: 'Robert',
      consentGivenAt: now,
      consentGivenBy: 'Robert Thompson',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'voice-emma',
      patientId: demoPatientId,
      familyMemberId: 'family-emma',
      familyMemberName: 'Emma',
      consentGivenAt: now,
      consentGivenBy: 'Lisa Thompson (guardian)',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'voice-james',
      patientId: demoPatientId,
      familyMemberId: 'family-james',
      familyMemberName: 'James',
      consentGivenAt: now,
      consentGivenBy: 'James Thompson',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const profile of profiles) {
    voiceProfiles.set(profile.id, profile);
  }
}

// ── Service methods ───────────────────────────────────────

/**
 * List all voice profiles for a patient.
 */
export async function listVoiceProfiles(patientId: string): Promise<VoiceProfile[]> {
  initDemoProfiles();

  return Array.from(voiceProfiles.values()).filter(
    (p) => p.patientId === patientId && p.isActive,
  );
}

/**
 * Create a new voice profile with consent tracking.
 */
export async function createVoiceProfile(data: {
  patientId: string;
  familyMemberId: string;
  familyMemberName: string;
  consentGivenBy: string;
  audioSampleUrl?: string;
}): Promise<VoiceProfile> {
  initDemoProfiles();

  const id = `voice-${crypto.randomUUID()}`;
  const now = new Date().toISOString();

  const profile: VoiceProfile = {
    id,
    patientId: data.patientId,
    familyMemberId: data.familyMemberId,
    familyMemberName: data.familyMemberName,
    consentGivenAt: now,
    consentGivenBy: data.consentGivenBy,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  // In production: call ElevenLabs to clone voice from audio sample
  // const externalVoiceId = await elevenLabsClone(data.audioSampleUrl);
  // profile.externalVoiceId = externalVoiceId;

  voiceProfiles.set(id, profile);
  return profile;
}

/**
 * Delete (soft-deactivate) a voice profile.
 */
export async function deleteVoiceProfile(id: string): Promise<void> {
  initDemoProfiles();

  const profile = voiceProfiles.get(id);
  if (!profile) {
    throw AppError.notFound('Voice profile');
  }

  profile.isActive = false;
  profile.updatedAt = new Date().toISOString();
}

/**
 * Generate speech from text using a voice profile.
 * Returns a demo audio URL in demo mode.
 */
export async function generateSpeech(
  text: string,
  voiceProfileId: string,
): Promise<GenerateSpeechResult> {
  initDemoProfiles();

  const profile = voiceProfiles.get(voiceProfileId);
  if (!profile) {
    throw AppError.notFound('Voice profile');
  }
  if (!profile.isActive) {
    throw AppError.badRequest('Voice profile is deactivated');
  }

  // In production: call ElevenLabs text-to-speech API
  // const audioBuffer = await elevenLabs.textToSpeech(profile.externalVoiceId, text);
  // const audioUrl = await uploadToStorage(audioBuffer);

  const estimatedDurationMs = Math.max(1000, text.split(' ').length * 300);

  return {
    audioUrl: `https://demo.gentle-reminder.app/audio/${voiceProfileId}/${Date.now()}.mp3`,
    durationMs: estimatedDurationMs,
    voiceProfileId,
  };
}

/**
 * Create a voice clone from an audio sample.
 * Scaffold for ElevenLabs voice cloning integration.
 */
export async function createVoiceClone(
  familyMemberId: string,
  audioSampleUrl: string,
): Promise<{ externalVoiceId: string; status: string }> {
  // In production:
  // 1. Download audio from audioSampleUrl
  // 2. Call ElevenLabs voice cloning API
  // 3. Store the external voice ID

  console.log(`[Voice] Voice clone requested for family member ${familyMemberId}`);
  console.log(`[Voice] Audio sample: ${audioSampleUrl}`);

  return {
    externalVoiceId: `el_clone_${familyMemberId}`,
    status: 'pending',
  };
}
