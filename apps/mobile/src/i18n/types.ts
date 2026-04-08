export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'ko' | 'pt' | 'ar' | 'hi';

export const RTL_LANGUAGES: SupportedLanguage[] = ['ar'];

export interface TranslationStrings {
  // Common
  appName: string;
  welcome: string;
  continue: string;
  back: string;
  close: string;
  save: string;
  cancel: string;
  yes: string;
  no: string;
  loading: string;
  error: string;
  retry: string;
  done: string;
  next: string;
  previous: string;
  delete: string;
  edit: string;
  search: string;
  noResults: string;

  // Greetings
  goodMorning: string;
  goodAfternoon: string;
  goodEvening: string;

  // Home
  startSession: string;
  seeFamily: string;
  myMemories: string;
  brainGames: string;
  relaxBreathe: string;
  memoryReview: string;
  dailyBriefing: string;
  musicTherapy: string;
  photoSlideshow: string;
  journal: string;

  // Session
  ready: string;
  letsBegin: string;
  sessionComplete: string;
  goHome: string;
  sessionScore: string;
  sessionsCompleted: string;
  timeSpent: string;

  // Exercises
  whatDayIsIt: string;
  whatIsYourName: string;
  whatCityAreWeIn: string;
  whoIsThisPerson: string;
  drawAClock: string;
  findTheWord: string;
  matchThePattern: string;
  countTheItems: string;
  completeTheSequence: string;
  nameTheColor: string;

  // Feedback
  thatsWonderful: string;
  youreClose: string;
  thatsOkay: string;
  keepGoing: string;
  almostThere: string;
  greatProgress: string;

  // Settings
  settings: string;
  fontSize: string;
  voiceGuidance: string;
  highContrast: string;
  language: string;
  resetDefaults: string;
  notifications: string;
  soundEffects: string;
  autoPlayVoice: string;
  darkMode: string;

  // Medications
  todaysMedications: string;
  markAsTaken: string;
  medicationReminder: string;
  nextDose: string;
  missedDose: string;
  medicationHistory: string;
  allTaken: string;
  medicationsRemaining: string;

  // SOS
  needHelp: string;
  helpOnTheWay: string;
  imOkay: string;
  emergencyContact: string;
  callCaregiver: string;

  // Mood / Wellness
  howAreYouFeeling: string;
  happy: string;
  calm: string;
  anxious: string;
  confused: string;
  tired: string;
  sad: string;
  thankYouForSharing: string;

  // Breathing
  breatheIn: string;
  holdBreath: string;
  breatheOut: string;
  breathingExercise: string;
  roundsCompleted: string;

  // Family
  familyPhotos: string;
  addPhoto: string;
  whoIsThis: string;
  familyMembers: string;
  sendMessage: string;
  voiceMessage: string;

  // Memory / Story Vault
  recordMemory: string;
  playRecording: string;
  myStories: string;
  addNewStory: string;
  storyDate: string;

  // Clinical / Biomarkers
  cognitiveScore: string;
  orientation: string;
  memory: string;
  attention: string;
  languageSkill: string;
  visuospatial: string;
  trendImproving: string;
  trendStable: string;
  trendDeclining: string;
  heartRate: string;
  sleepQuality: string;
  stepsToday: string;
  riskLevel: string;
  lowRisk: string;
  moderateRisk: string;
  highRisk: string;

  // Calendar / Routine
  todaysSchedule: string;
  upcomingEvents: string;
  morningRoutine: string;
  afternoonRoutine: string;
  eveningRoutine: string;
  noEventsToday: string;

  // Accessibility
  tapToSelect: string;
  swipeForMore: string;
  speakAnswer: string;
  listenAgain: string;
}
