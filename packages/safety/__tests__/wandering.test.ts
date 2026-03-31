import {
  calculateDistance,
  isOutsideGeofence,
  detectWandering,
  getWanderingRisk,
} from '../src/WanderingDetector';
import { buildMovementProfile, isAnomalousLocation, isAnomalousTime } from '../src/LocationPatternModel';
import { detectFallRisk, getFallRiskScore } from '../src/FallDetector';
import { LocationPoint, Geofence, MovementProfile, AccelerometerReading } from '../src/types';

// ─── Helpers ───────────────────────────────────────────────────────

const HOME: LocationPoint = {
  latitude: 51.5074,
  longitude: -0.1278,
  timestamp: Date.now(),
};

function makeProfile(overrides: Partial<MovementProfile> = {}): MovementProfile {
  return {
    normalPaths: [],
    homeLocation: HOME,
    typicalRadius: 500,
    activeHours: { start: 7, end: 22 },
    ...overrides,
  };
}

function makePoint(
  lat: number,
  lon: number,
  timestamp?: number
): LocationPoint {
  return {
    latitude: lat,
    longitude: lon,
    timestamp: timestamp ?? Date.now(),
  };
}

// ─── Haversine Distance ────────────────────────────────────────────

describe('calculateDistance', () => {
  test('returns 0 for identical points', () => {
    const dist = calculateDistance(51.5074, -0.1278, 51.5074, -0.1278);
    expect(dist).toBeCloseTo(0, 0);
  });

  test('calculates known distance between London and Paris (~343 km)', () => {
    const dist = calculateDistance(51.5074, -0.1278, 48.8566, 2.3522);
    // Should be approximately 343 km
    expect(dist).toBeGreaterThan(330_000);
    expect(dist).toBeLessThan(360_000);
  });

  test('returns same distance regardless of direction', () => {
    const d1 = calculateDistance(51.5074, -0.1278, 48.8566, 2.3522);
    const d2 = calculateDistance(48.8566, 2.3522, 51.5074, -0.1278);
    expect(d1).toBeCloseTo(d2, 0);
  });
});

// ─── Geofence Detection ────────────────────────────────────────────

describe('isOutsideGeofence', () => {
  const fence: Geofence = {
    centerId: 'home',
    latitude: 51.5074,
    longitude: -0.1278,
    radiusMeters: 500,
    label: 'Home',
  };

  test('returns false when point is inside geofence', () => {
    const point = makePoint(51.5074, -0.1278);
    expect(isOutsideGeofence(point, fence)).toBe(false);
  });

  test('returns true when point is outside geofence', () => {
    // ~11 km away
    const point = makePoint(51.6, -0.1278);
    expect(isOutsideGeofence(point, fence)).toBe(true);
  });

  test('returns false when point is just inside boundary', () => {
    // ~100m north (well within 500m radius)
    const point = makePoint(51.5083, -0.1278);
    expect(isOutsideGeofence(point, fence)).toBe(false);
  });
});

// ─── Wandering Detection ───────────────────────────────────────────

describe('detectWandering', () => {
  test('returns null for empty points array', () => {
    const result = detectWandering([], makeProfile());
    expect(result).toBeNull();
  });

  test('returns null when patient is within typical radius during active hours', () => {
    const now = new Date();
    now.setHours(12); // Midday
    const points = [makePoint(51.5074, -0.1278, now.getTime())];
    const result = detectWandering(points, makeProfile());
    expect(result).toBeNull();
  });

  test('returns alert when patient is far outside typical radius', () => {
    const now = new Date();
    now.setHours(14);
    // ~11 km from home
    const points = [makePoint(51.6, -0.1278, now.getTime())];
    const result = detectWandering(points, makeProfile());
    expect(result).not.toBeNull();
    expect(result!.distanceFromHome).toBeGreaterThan(5000);
  });

  test('assigns higher severity for greater distance', () => {
    const now = new Date();
    now.setHours(14);
    // Very far away (~111 km)
    const points = [makePoint(52.5, -0.1278, now.getTime())];
    const result = detectWandering(points, makeProfile());
    expect(result).not.toBeNull();
    expect(result!.severity).toBe('critical');
  });
});

// ─── Wandering Risk Score ──────────────────────────────────────────

describe('getWanderingRisk', () => {
  test('returns 0 for empty points', () => {
    expect(getWanderingRisk([], makeProfile())).toBe(0);
  });

  test('returns low risk when at home during active hours', () => {
    const now = new Date();
    now.setHours(12);
    const points = [makePoint(51.5074, -0.1278, now.getTime())];
    const risk = getWanderingRisk(points, makeProfile());
    expect(risk).toBeLessThan(0.3);
  });

  test('returns higher risk when far from home', () => {
    const now = new Date();
    now.setHours(12);
    const points = [makePoint(51.6, -0.1278, now.getTime())];
    const risk = getWanderingRisk(points, makeProfile());
    expect(risk).toBeGreaterThan(0.2);
  });
});

// ─── Movement Profile Building ─────────────────────────────────────

describe('buildMovementProfile', () => {
  test('identifies home location from clustered points', () => {
    const points: LocationPoint[] = [];
    // 50 points at home
    for (let i = 0; i < 50; i++) {
      points.push(
        makePoint(
          51.5074 + (Math.random() - 0.5) * 0.0005,
          -0.1278 + (Math.random() - 0.5) * 0.0005,
          Date.now() - i * 3600_000
        )
      );
    }
    // 5 points away
    for (let i = 0; i < 5; i++) {
      points.push(makePoint(51.52, -0.12, Date.now() - (50 + i) * 3600_000));
    }

    const profile = buildMovementProfile(points);

    // Home should be close to the main cluster
    const homeDistFromExpected = calculateDistance(
      profile.homeLocation.latitude,
      profile.homeLocation.longitude,
      51.5074,
      -0.1278
    );
    expect(homeDistFromExpected).toBeLessThan(200);
  });

  test('computes reasonable typical radius', () => {
    const points: LocationPoint[] = [];
    for (let i = 0; i < 30; i++) {
      points.push(
        makePoint(
          51.5074 + (Math.random() - 0.5) * 0.005,
          -0.1278 + (Math.random() - 0.5) * 0.005,
          Date.now() - i * 3600_000
        )
      );
    }

    const profile = buildMovementProfile(points);
    expect(profile.typicalRadius).toBeGreaterThan(100);
    expect(profile.typicalRadius).toBeLessThan(5000);
  });
});

// ─── Fall Detection ────────────────────────────────────────────────

describe('FallDetector', () => {
  test('does not detect fall in normal walking data', () => {
    const readings: AccelerometerReading[] = [];
    const now = Date.now();
    for (let i = 0; i < 20; i++) {
      readings.push({
        x: Math.sin(i * 0.5) * 2,
        y: 9.81 + Math.random() * 0.5,
        z: Math.cos(i * 0.5) * 2,
        timestamp: now + i * 50,
      });
    }

    const result = detectFallRisk(readings);
    expect(result.isFall).toBe(false);
  });

  test('detects fall from impact followed by stillness', () => {
    const readings: AccelerometerReading[] = [];
    const now = Date.now();

    // Normal walking
    for (let i = 0; i < 5; i++) {
      readings.push({
        x: 1,
        y: 9.81,
        z: 1,
        timestamp: now + i * 50,
      });
    }

    // Free-fall phase (brief near-zero)
    readings.push({ x: 0.5, y: 2, z: 0.5, timestamp: now + 250 });

    // Impact spike
    readings.push({ x: 25, y: 30, z: 20, timestamp: now + 300 });

    // Stillness after impact (lying on ground)
    for (let i = 0; i < 10; i++) {
      readings.push({
        x: 0.1,
        y: 9.81,
        z: 0.1,
        timestamp: now + 350 + i * 300,
      });
    }

    const result = detectFallRisk(readings);
    expect(result.isFall).toBe(true);
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  test('getFallRiskScore returns 0 for insufficient data', () => {
    const score = getFallRiskScore([]);
    expect(score).toBe(0);
  });

  test('getFallRiskScore returns higher risk for unstable movement', () => {
    const now = Date.now();
    const stable: AccelerometerReading[] = [];
    const unstable: AccelerometerReading[] = [];

    for (let i = 0; i < 20; i++) {
      stable.push({ x: 0.5, y: 9.81, z: 0.5, timestamp: now + i * 100 });
      unstable.push({
        x: (Math.random() - 0.5) * 30,
        y: 9.81 + (Math.random() - 0.5) * 20,
        z: (Math.random() - 0.5) * 30,
        timestamp: now + i * 100,
      });
    }

    const stableScore = getFallRiskScore(stable);
    const unstableScore = getFallRiskScore(unstable);
    expect(unstableScore).toBeGreaterThan(stableScore);
  });
});
