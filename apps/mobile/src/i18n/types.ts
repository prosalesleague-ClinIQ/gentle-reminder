export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'ko' | 'pt';

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

  // Session
  ready: string;
  letsBegin: string;
  sessionComplete: string;
  goHome: string;

  // Exercises
  whatDayIsIt: string;
  whatIsYourName: string;
  whatCityAreWeIn: string;
  whoIsThisPerson: string;

  // Feedback
  thatsWonderful: string;
  youreClose: string;
  thatsOkay: string;

  // Settings
  settings: string;
  fontSize: string;
  voiceGuidance: string;
  highContrast: string;
  language: string;
  resetDefaults: string;

  // Medications
  todaysMedications: string;
  markAsTaken: string;

  // SOS
  needHelp: string;
  helpOnTheWay: string;
  imOkay: string;
}
