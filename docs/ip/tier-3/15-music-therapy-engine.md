# Provisional Patent Application: Music Therapy Engine with Circadian Recommendations

**Docket No.:** GR-15-PROV | **Tier:** 3

## 1. TITLE
Music Therapy Engine with Circadian-Aware Recommendations and Gradual Fade-Out Sleep Timer

## 4. FIELD
Digital music therapy delivery for dementia patients.

## 5. BACKGROUND
Music therapy is evidence-based for dementia care (Aldridge 2000; Guetin 2009). No commercial implementation combines circadian recommendations with dementia-specific fade-out.

## 6. SUMMARY
Three novel components: (1) Sleep timer with 2-minute gradual fade (20 steps × 100ms × 5% volume); (2) Mood-based playlist mapping with clinical rationales citing specific research; (3) Circadian time-of-day recommendation (morning classical → afternoon nature → evening familiar).

## 8. DETAILED DESCRIPTION

### 8.1 Sleep Timer Fade
```
function setSleepTimer(totalMinutes):
  fadeStartTime = totalMinutes - 2  // start fade 2 min before end
  // 20 fade steps over 2 minutes
  stepInterval = (2 * 60 * 1000) / 20  // 6000 ms each
  stepVolumeDrop = 0.05  // 5% per step
```

### 8.2 Mood → Playlist Mapping
```
moodMappings = {
  'anxious':    { playlist: 'nature_sounds',      rationale: 'cortisol reduction 25%' },
  'sad':        { playlist: 'memory_songs',       rationale: 'music-evoked memories last longest' },
  'confused':   { playlist: 'classical_structured', rationale: 'baroque neural organization' },
  'agitated':   { playlist: 'slow_rhythm',        rationale: 'rhythm entrainment reduces agitation' },
}
```

### 8.3 Circadian Recommendations
```
circadianMap = {
  6-11:  'gentle_classical',    // morning orientation
  11-14: 'upbeat_familiar',     // midday engagement
  14-17: 'nature_sounds',       // sundowning prevention
  17-21: 'familiar_lullabies',  // evening comfort
  21-6:  'sleep_ambient',       // night
}
```

### 8.4 Reference Implementation
`apps/mobile/src/services/MusicTherapyEngine.ts`, `MusicRecommendation.ts`

## 9. CLAIMS

**Claim 1:** A method for providing music therapy to a dementia patient, comprising:
(a) upon receiving a sleep timer request of N minutes, scheduling playback termination at N minutes and scheduling a gradual volume fade starting at (N − 2) minutes, wherein the fade comprises approximately 20 equal volume decrements over 2 minutes;
(b) selecting a playlist based on a detected mood from a mapping including anxious-to-nature, sad-to-memory-songs, confused-to-classical, and agitated-to-slow-rhythm;
(c) applying a circadian override where morning windows select gentle classical, late-afternoon windows select nature sounds to prevent sundowning, and evening windows select familiar lullabies.

**Claim 2-5:** System, CRM, dependent claims on specific mappings.

## 10. ABSTRACT

A music therapy engine for dementia patients provides a sleep timer with 2-minute gradual fade-out in approximately 20 steps (preventing startle upon termination), mood-based playlist selection with clinical rationales (nature for anxious, memory songs for sad, classical for confused, slow rhythm for agitated), and circadian time-of-day overrides (morning classical, afternoon nature sounds for sundowning prevention, evening familiar lullabies).

Codebase: `apps/mobile/src/services/MusicTherapyEngine.ts`
