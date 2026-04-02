/**
 * Safety package integration tests.
 *
 * End-to-end tests for wandering detection, fall detection,
 * medication interaction checking, location pattern building,
 * and geofence boundary calculations using realistic data.
 */
import {
  calculateDistance,
  isOutsideGeofence,
  detectWandering,
  getWanderingRisk,
} from '../src/WanderingDetector';
import { detectFallRisk, getFallRiskScore } from '../src/FallDetector';
import { checkInteractions, MedicationInteractionChecker } from '../src/MedicationInteractionChecker';
import { buildMovementProfile, isAnomalousLocation, isAnomalousTime } from '../src/LocationPatternModel';
import type { LocationPoint, Geofence, MovementProfile, AccelerometerReading } from '../src/types';

// ---------------------------------------------------------------------------
// Realistic test coordinates (Dublin, Ireland area)
// ---------------------------------------------------------------------------
const HOME: LocationPoint = { latitude: 53.3498, longitude: -6.2603, timestamp: Date.now() };
const NEARBY: LocationPoint = { latitude: 53.3510, longitude: -6.2580, timestamp: Date.now() };
const FAR_AWAY: LocationPoint = { latitude: 53.5000, longitude: -6.0000, timestamp: Date.now() };
const VERY_FAR: LocationPoint = { latitude: 54.0000, longitude: -5.5000, timestamp: Date.now() };

const HOME_GEOFENCE: Geofence = {
  centerId: 'home',
  latitude: HOME.latitude,
  longitude: HOME.longitude,
  radiusMeters: 500,
  label: 'Home',
};

const DEFAULT_PROFILE: MovementProfile = {
  normalPaths: [],
  homeLocation: HOME,
  typicalRadius: 500,
  activeHours: { start: 7, end: 22 },
};

// ---------------------------------------------------------------------------
// 1. Wandering Detection with real GPS coordinates
// ---------------------------------------------------------------------------
describe('Wandering Detection - GPS coordinates', () => {
  it('calculates distance between two points using Haversine formula', () => {
    const dist = calculateDistance(53.3498, -6.2603, 53.3510, -6.2580);
    // These points are roughly 180m apart
    expect(dist).toBeGreaterThan(100);
    expect(dist).toBeLessThan(300);
  });

  it('returns 0 distance for the same point', () => {
    const dist = calculateDistance(53.3498, -6.2603, 53.3498, -6.2603);
    expect(dist).toBeCloseTo(0, 1);
  });

  it('calculates a larger distance for far-away points', () => {
    const dist = calculateDistance(53.3498, -6.2603, 54.0000, -5.5000);
    // Should be roughly 80+ km
    expect(dist).toBeGreaterThan(50000);
  });

  it('returns null when no points are provided', () => {
    const result = detectWandering([], DEFAULT_PROFILE);
    expect(result).toBeNull();
  });

  it('returns null when patient is within typical radius', () => {
    const points = [
      { ...HOME, timestamp: Date.now() - 60000 },
      { ...NEARBY, timestamp: Date.now() },
    ];
    const result = detectWandering(points, DEFAULT_PROFILE);
    expect(result).toBeNull();
  });

  it('detects wandering when patient is far from home', () => {
    const points = [
      { ...HOME, timestamp: Date.now() - 120000 },
      { latitude: 53.36, longitude: -6.24, timestamp: Date.now() - 60000 },
      { ...FAR_AWAY, timestamp: Date.now() },
    ];
    const result = detectWandering(points, DEFAULT_PROFILE);
    expect(result).not.toBeNull();
    expect(result!.severity).toBeDefined();
    expect(result!.distanceFromHome).toBeGreaterThan(500);
  });

  it('assigns critical severity for very distant wandering at night', () => {
    // Create a nighttime timestamp (3 AM)
    const nightTime = new Date();
    nightTime.setHours(3, 0, 0, 0);
    const nightTs = nightTime.getTime();

    const points = [
      { ...HOME, timestamp: nightTs - 120000 },
      { ...VERY_FAR, timestamp: nightTs },
    ];

    const profile: MovementProfile = {
      ...DEFAULT_PROFILE,
      typicalRadius: 500,
    };

    const result = detectWandering(points, profile);
    expect(result).not.toBeNull();
    // Very far + nighttime should be critical or high
    expect(['critical', 'high']).toContain(result!.severity);
  });

  it('computes wandering risk score between 0 and 1', () => {
    const points = [
      { ...HOME, timestamp: Date.now() - 60000 },
      { ...NEARBY, timestamp: Date.now() },
    ];
    const risk = getWanderingRisk(points, DEFAULT_PROFILE);
    expect(risk).toBeGreaterThanOrEqual(0);
    expect(risk).toBeLessThanOrEqual(1);
  });

  it('returns higher risk when further from home', () => {
    const nearRisk = getWanderingRisk(
      [{ ...HOME, timestamp: Date.now() }],
      DEFAULT_PROFILE
    );
    const farRisk = getWanderingRisk(
      [{ ...FAR_AWAY, timestamp: Date.now() }],
      DEFAULT_PROFILE
    );
    expect(farRisk).toBeGreaterThan(nearRisk);
  });

  it('returns 0 risk for empty points', () => {
    const risk = getWanderingRisk([], DEFAULT_PROFILE);
    expect(risk).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// 2. Geofence boundary calculations
// ---------------------------------------------------------------------------
describe('Geofence Boundaries', () => {
  it('detects a point inside the geofence', () => {
    expect(isOutsideGeofence(NEARBY, HOME_GEOFENCE)).toBe(false);
  });

  it('detects a point outside the geofence', () => {
    expect(isOutsideGeofence(FAR_AWAY, HOME_GEOFENCE)).toBe(true);
  });

  it('detects a point exactly at the center as inside', () => {
    expect(isOutsideGeofence(HOME, HOME_GEOFENCE)).toBe(false);
  });

  it('handles a very large geofence radius', () => {
    const bigFence: Geofence = { ...HOME_GEOFENCE, radiusMeters: 200000 };
    expect(isOutsideGeofence(FAR_AWAY, bigFence)).toBe(false);
  });

  it('handles a very small geofence radius', () => {
    const tinyFence: Geofence = { ...HOME_GEOFENCE, radiusMeters: 10 };
    expect(isOutsideGeofence(NEARBY, tinyFence)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 3. Fall Detection from accelerometer sequences
// ---------------------------------------------------------------------------
describe('Fall Detection', () => {
  const GRAVITY = 9.81;

  function makeReading(x: number, y: number, z: number, ts: number): AccelerometerReading {
    return { x, y, z, timestamp: ts };
  }

  it('returns no fall for insufficient data', () => {
    const data = [makeReading(0, 0, GRAVITY, 1000)];
    const result = detectFallRisk(data);
    expect(result.isFall).toBe(false);
    expect(result.confidence).toBe(0);
  });

  it('returns no fall for normal walking data', () => {
    const data: AccelerometerReading[] = [];
    const baseTs = Date.now();
    for (let i = 0; i < 20; i++) {
      // Normal walking: slight oscillation around gravity
      data.push(makeReading(
        Math.sin(i * 0.5) * 2,
        Math.cos(i * 0.5) * 2,
        GRAVITY + Math.sin(i * 0.3) * 1,
        baseTs + i * 100
      ));
    }
    const result = detectFallRisk(data);
    expect(result.isFall).toBe(false);
  });

  it('detects a fall with impact + stillness pattern', () => {
    const baseTs = Date.now();
    const data: AccelerometerReading[] = [];

    // Normal walking phase (5 readings)
    for (let i = 0; i < 5; i++) {
      data.push(makeReading(0.5, 0.5, GRAVITY, baseTs + i * 100));
    }

    // Free-fall phase (brief near-zero acceleration)
    data.push(makeReading(0.1, 0.1, 0.5, baseTs + 500));

    // Impact phase (high acceleration spike > 3g)
    data.push(makeReading(15, 20, 25, baseTs + 600));

    // Stillness phase after impact (lying still, near gravity)
    for (let i = 0; i < 10; i++) {
      data.push(makeReading(0.1, 0.1, GRAVITY + 0.05, baseTs + 700 + i * 300));
    }

    const result = detectFallRisk(data);
    expect(result.isFall).toBe(true);
    expect(result.confidence).toBeGreaterThanOrEqual(0.5);
  });

  it('does not detect a fall from a simple phone drop without stillness', () => {
    const baseTs = Date.now();
    const data: AccelerometerReading[] = [];

    // Normal
    for (let i = 0; i < 5; i++) {
      data.push(makeReading(1, 1, GRAVITY, baseTs + i * 100));
    }

    // Impact
    data.push(makeReading(20, 20, 30, baseTs + 500));

    // Movement continues after (no stillness - phone picked back up)
    for (let i = 0; i < 10; i++) {
      data.push(makeReading(
        3 + Math.random() * 5,
        3 + Math.random() * 5,
        GRAVITY + Math.random() * 5,
        baseTs + 600 + i * 300
      ));
    }

    const result = detectFallRisk(data);
    expect(result.isFall).toBe(false);
  });

  it('computes fall risk score between 0 and 1', () => {
    const data: AccelerometerReading[] = [];
    for (let i = 0; i < 20; i++) {
      data.push(makeReading(1, 1, GRAVITY, Date.now() + i * 100));
    }
    const score = getFallRiskScore(data);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
  });

  it('returns 0 fall risk for insufficient data', () => {
    const score = getFallRiskScore([makeReading(0, 0, GRAVITY, 1000)]);
    expect(score).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// 4. Medication Interaction Checking
// ---------------------------------------------------------------------------
describe('Medication Interaction Checking', () => {
  it('returns no warnings for a single medication', () => {
    const warnings = checkInteractions(['donepezil']);
    expect(warnings).toHaveLength(0);
  });

  it('returns no warnings for non-interacting medications', () => {
    const warnings = checkInteractions(['donepezil', 'lisinopril']);
    expect(warnings).toHaveLength(0);
  });

  it('detects severe interaction between donepezil and ibuprofen', () => {
    const warnings = checkInteractions(['donepezil', 'ibuprofen']);
    expect(warnings.length).toBeGreaterThanOrEqual(1);
    expect(warnings[0].severity).toBe('severe');
    expect(warnings[0].medications).toContain('donepezil');
    expect(warnings[0].medications).toContain('ibuprofen');
  });

  it('detects moderate interaction between memantine and amantadine', () => {
    const warnings = checkInteractions(['memantine', 'amantadine']);
    expect(warnings.length).toBeGreaterThanOrEqual(1);
    expect(warnings[0].severity).toBe('moderate');
  });

  it('detects severe interaction between donepezil and diphenhydramine', () => {
    const warnings = checkInteractions(['donepezil', 'diphenhydramine']);
    expect(warnings.length).toBeGreaterThanOrEqual(1);
    expect(warnings[0].severity).toBe('severe');
  });

  it('detects interaction using brand names (Aricept)', () => {
    const warnings = checkInteractions(['aricept', 'ibuprofen']);
    expect(warnings.length).toBeGreaterThanOrEqual(1);
  });

  it('detects multiple interactions across a drug list', () => {
    const warnings = checkInteractions([
      'donepezil',
      'ibuprofen',
      'diphenhydramine',
      'memantine',
      'amantadine',
    ]);
    // donepezil+ibuprofen (severe), donepezil+diphenhydramine (severe), memantine+amantadine (moderate)
    expect(warnings.length).toBeGreaterThanOrEqual(3);
  });

  it('is case-insensitive', () => {
    const warnings = checkInteractions(['DONEPEZIL', 'IBUPROFEN']);
    expect(warnings.length).toBeGreaterThanOrEqual(1);
  });

  it('MedicationInteractionChecker class detects severe interactions', () => {
    const checker = new MedicationInteractionChecker();
    expect(checker.hasSevereInteractions(['donepezil', 'ibuprofen'])).toBe(true);
    expect(checker.hasSevereInteractions(['memantine', 'amantadine'])).toBe(false);
  });

  it('MedicationInteractionChecker class returns severity counts', () => {
    const checker = new MedicationInteractionChecker();
    const counts = checker.getSeverityCount([
      'donepezil',
      'ibuprofen',
      'memantine',
      'amantadine',
    ]);
    expect(counts.severe).toBeGreaterThanOrEqual(1);
    expect(counts.moderate).toBeGreaterThanOrEqual(1);
  });

  it('returns empty warnings for an empty medication list', () => {
    const warnings = checkInteractions([]);
    expect(warnings).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// 5. Location Pattern Building from historical data
// ---------------------------------------------------------------------------
describe('Location Pattern Building', () => {
  function makeLocationHistory(count: number, baseLat: number, baseLon: number): LocationPoint[] {
    const points: LocationPoint[] = [];
    const baseTime = new Date('2025-03-01T10:00:00Z').getTime();
    for (let i = 0; i < count; i++) {
      points.push({
        latitude: baseLat + (Math.random() - 0.5) * 0.002,
        longitude: baseLon + (Math.random() - 0.5) * 0.002,
        timestamp: baseTime + i * 600000, // 10 min intervals
      });
    }
    return points;
  }

  it('builds a movement profile from historical data', () => {
    const history = makeLocationHistory(50, HOME.latitude, HOME.longitude);
    const profile = buildMovementProfile(history);

    expect(profile.homeLocation).toBeDefined();
    expect(profile.typicalRadius).toBeGreaterThan(0);
    expect(profile.activeHours).toBeDefined();
    expect(profile.activeHours.start).toBeLessThan(profile.activeHours.end);
  });

  it('identifies home location as the most frequent cluster', () => {
    const history = makeLocationHistory(100, HOME.latitude, HOME.longitude);
    const profile = buildMovementProfile(history);

    // Home should be near the center of our generated points
    const distFromExpected = calculateDistance(
      profile.homeLocation.latitude,
      profile.homeLocation.longitude,
      HOME.latitude,
      HOME.longitude
    );
    expect(distFromExpected).toBeLessThan(500);
  });

  it('computes a typical radius from the 90th percentile', () => {
    const history = makeLocationHistory(50, HOME.latitude, HOME.longitude);
    const profile = buildMovementProfile(history);

    // Typical radius should be at least the minimum of 100m
    expect(profile.typicalRadius).toBeGreaterThanOrEqual(100);
  });

  it('detects anomalous location far from home', () => {
    const history = makeLocationHistory(50, HOME.latitude, HOME.longitude);
    const profile = buildMovementProfile(history);

    const anomalous = isAnomalousLocation(VERY_FAR, profile);
    expect(anomalous).toBe(true);
  });

  it('does not flag nearby location as anomalous', () => {
    const history = makeLocationHistory(50, HOME.latitude, HOME.longitude);
    const profile = buildMovementProfile(history);

    const anomalous = isAnomalousLocation(
      { ...HOME, timestamp: Date.now() },
      profile
    );
    expect(anomalous).toBe(false);
  });

  it('detects anomalous time outside active hours', () => {
    const profile = buildMovementProfile(
      makeLocationHistory(50, HOME.latitude, HOME.longitude)
    );
    const nightTime = new Date('2025-03-01T03:00:00Z');
    expect(isAnomalousTime(nightTime, profile)).toBe(true);
  });

  it('does not flag normal daytime as anomalous', () => {
    const profile = buildMovementProfile(
      makeLocationHistory(50, HOME.latitude, HOME.longitude)
    );
    const dayTime = new Date('2025-03-01T10:00:00Z');
    expect(isAnomalousTime(dayTime, profile)).toBe(false);
  });
});
