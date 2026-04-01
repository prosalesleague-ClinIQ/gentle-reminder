import { Platform } from 'react-native';

/**
 * App configuration.
 * In demo mode (no API_URL), the app uses local demo data.
 * When API_URL is set, the app connects to the live backend.
 */

// API URL - change this when backend is deployed
export const API_URL = Platform.select({
  web: 'http://localhost:3000/api/v1',
  ios: 'http://localhost:3000/api/v1',
  android: 'http://10.0.2.2:3000/api/v1',
  default: 'http://localhost:3000/api/v1',
});

export const WS_URL = Platform.select({
  web: 'ws://localhost:3000',
  ios: 'ws://localhost:3000',
  android: 'ws://10.0.2.2:3000',
  default: 'ws://localhost:3000',
});

export const IS_DEMO_MODE = true; // Set to false when API is available

export const APP_VERSION = '1.0.0';
export const BUILD_NUMBER = '16';

export const config = {
  api: {
    url: API_URL,
    wsUrl: WS_URL,
    timeout: 10000,
  },
  demo: {
    enabled: IS_DEMO_MODE,
    patientName: 'Margaret',
    preferredName: 'Maggie',
    city: 'Portland',
  },
  session: {
    maxDurationSeconds: 900, // 15 minutes
    exerciseCount: 8,
    autoAdvanceDelayMs: 2500,
  },
  voice: {
    rate: 0.78,
    pitch: 1.05,
    language: 'en-US',
  },
};
