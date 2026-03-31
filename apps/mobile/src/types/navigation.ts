/**
 * Navigation type definitions for the Gentle Reminder mobile app.
 * Used with expo-router for type-safe navigation.
 */

/** Root-level route names */
export type RootRoutes = '/' | '/login' | '/(tabs)' | '/session';

/** Tab route names */
export type TabRoutes = '/(tabs)/home' | '/(tabs)/family' | '/(tabs)/stories';

/** Session route names */
export type SessionRoutes =
  | '/session/start'
  | '/session/orientation'
  | '/session/identity'
  | '/session/memory-game';

/** All route names combined */
export type AppRoutes = RootRoutes | TabRoutes | SessionRoutes;

/** Session navigation parameters */
export interface SessionParams {
  sessionId?: string;
  exerciseIndex?: number;
}

/** Family member detail parameters */
export interface FamilyDetailParams {
  memberId: string;
}

/** Story detail parameters */
export interface StoryDetailParams {
  storyId: string;
}
