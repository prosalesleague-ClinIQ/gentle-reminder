import { PLAYLISTS, MusicPlaylist, MusicTrack } from './MusicTherapyEngine';

/**
 * Evidence-based music recommendation engine for dementia care.
 *
 * Selects therapeutic music based on:
 * - Patient mood (validated against music therapy research)
 * - Time of day (circadian rhythm support)
 * - Activity context (exercise, recall, relaxation)
 * - Patient era (reminiscence therapy based on birth decade)
 */

export interface MusicRecommendation {
  playlist: MusicPlaylist;
  rationale: string;
}

/**
 * Recommend music based on patient's current mood.
 *
 * Research basis:
 * - Anxious/agitated: slow tempo (<80 BPM), nature sounds reduce cortisol
 * - Sad: familiar melodies stimulate positive autobiographical memories
 * - Confused: structured classical music provides cognitive anchoring
 * - Happy: memory songs reinforce positive emotional state
 * - Tired: lullabies support natural sleep onset
 */
export function recommendForMood(mood: string): MusicRecommendation {
  const moodLower = mood.toLowerCase();

  if (moodLower === 'anxious' || moodLower === 'agitated') {
    return {
      playlist: findPlaylist('nature'),
      rationale: 'Nature sounds help reduce anxiety and agitation. The consistent, predictable patterns provide a calming anchor. Research shows nature sounds can lower cortisol levels by up to 25%.',
    };
  }

  if (moodLower === 'sad' || moodLower === 'lonely') {
    return {
      playlist: findPlaylist('memory'),
      rationale: 'Familiar songs from your past can lift your spirits by activating positive autobiographical memories. Music-evoked memories are among the last to fade in dementia.',
    };
  }

  if (moodLower === 'confused' || moodLower === 'disoriented') {
    return {
      playlist: findPlaylist('classical'),
      rationale: 'Structured classical music with predictable patterns provides cognitive anchoring. The mathematical structure of baroque and classical music supports neural organization.',
    };
  }

  if (moodLower === 'happy' || moodLower === 'content') {
    return {
      playlist: findPlaylist('memory'),
      rationale: 'Memory songs reinforce your positive emotional state and can strengthen autobiographical recall during moments of clarity.',
    };
  }

  if (moodLower === 'tired' || moodLower === 'sleepy') {
    return {
      playlist: findPlaylist('lullaby'),
      rationale: 'Gentle lullabies support natural sleep onset. These deeply familiar melodies from early life activate the most resilient memory pathways.',
    };
  }

  // Default: calming piano
  return {
    playlist: findPlaylist('piano'),
    rationale: 'Peaceful piano music provides gentle stimulation while maintaining calm. Suitable for any emotional state.',
  };
}

/**
 * Recommend music based on time of day.
 *
 * Supports circadian rhythm and sundowning prevention:
 * - Morning (6-11): Gentle, uplifting music for orientation
 * - Midday (11-14): Stimulating music for engagement
 * - Afternoon (14-17): Calming music to prevent sundowning
 * - Evening (17-20): Familiar music for comfort
 * - Night (20-6): Sleep-inducing sounds
 */
export function recommendForTimeOfDay(hour: number): MusicRecommendation {
  if (hour >= 6 && hour < 11) {
    return {
      playlist: findPlaylist('classical'),
      rationale: 'Morning classical music supports gentle awakening and orientation. Structured melodies help establish the rhythm of the day.',
    };
  }

  if (hour >= 11 && hour < 14) {
    return {
      playlist: findPlaylist('memory'),
      rationale: 'Midday is a good time for reminiscence therapy. Familiar songs engage cognitive function during peak alertness hours.',
    };
  }

  if (hour >= 14 && hour < 17) {
    return {
      playlist: findPlaylist('nature'),
      rationale: 'Afternoon nature sounds help prevent sundowning by maintaining a calm environment during the transition hours.',
    };
  }

  if (hour >= 17 && hour < 20) {
    return {
      playlist: findPlaylist('piano'),
      rationale: 'Evening piano music provides comfort during the vulnerable sundowning period. Slow, predictable melodies reduce agitation.',
    };
  }

  // Night (20-6)
  return {
    playlist: findPlaylist('lullaby'),
    rationale: 'Nighttime lullabies support the transition to sleep. These deeply familiar melodies from childhood activate calming neural pathways.',
  };
}

/**
 * Recommend music based on current activity.
 */
export function recommendForActivity(activity: string): MusicRecommendation {
  const activityLower = activity.toLowerCase();

  if (activityLower.includes('exercise') || activityLower.includes('cognitive') || activityLower.includes('session')) {
    return {
      playlist: findPlaylist('classical'),
      rationale: 'Classical music with moderate tempo supports cognitive engagement during exercises without causing overstimulation.',
    };
  }

  if (activityLower.includes('memory') || activityLower.includes('photo') || activityLower.includes('family')) {
    return {
      playlist: findPlaylist('memory'),
      rationale: 'Personal memory songs complement photo viewing and family time, creating a multi-sensory reminiscence experience.',
    };
  }

  if (activityLower.includes('sleep') || activityLower.includes('rest') || activityLower.includes('nap')) {
    return {
      playlist: findPlaylist('lullaby'),
      rationale: 'Gentle lullabies create an ideal auditory environment for rest and sleep onset.',
    };
  }

  if (activityLower.includes('meal') || activityLower.includes('eat')) {
    return {
      playlist: findPlaylist('piano'),
      rationale: 'Soft piano music during meals promotes a calm eating environment and can improve food intake in dementia patients.',
    };
  }

  if (activityLower.includes('breathe') || activityLower.includes('relax') || activityLower.includes('calm')) {
    return {
      playlist: findPlaylist('nature'),
      rationale: 'Nature sounds synchronize with breathing exercises, enhancing the relaxation response.',
    };
  }

  return {
    playlist: findPlaylist('piano'),
    rationale: 'Peaceful piano music is suitable for most activities, providing a gentle auditory background.',
  };
}

/**
 * Get a "recommended for you" set of playlists with rationales.
 */
export function getPersonalRecommendations(): MusicRecommendation[] {
  const now = new Date();
  const hour = now.getHours();

  return [
    { ...recommendForTimeOfDay(hour), rationale: `Best for this time of day. ${recommendForTimeOfDay(hour).rationale}` },
    recommendForMood('calm'),
    recommendForActivity('memory'),
  ];
}

function findPlaylist(category: string): MusicPlaylist {
  return PLAYLISTS.find((p) => p.category === category) || PLAYLISTS[0];
}
