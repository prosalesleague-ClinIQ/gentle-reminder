import { LocationPoint, Geofence, WanderingAlert, MovementProfile } from './types';

const EARTH_RADIUS_METERS = 6_371_000;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculates the distance in meters between two geographic points using the Haversine formula.
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_METERS * c;
}

/**
 * Checks whether a location point is outside a given geofence boundary.
 */
export function isOutsideGeofence(point: LocationPoint, fence: Geofence): boolean {
  const distance = calculateDistance(
    point.latitude,
    point.longitude,
    fence.latitude,
    fence.longitude
  );
  return distance > fence.radiusMeters;
}

/**
 * Checks if a timestamp falls outside the patient's typical active hours.
 */
function isUnusualTime(timestamp: number, profile: MovementProfile): boolean {
  const hour = new Date(timestamp).getHours();
  return hour < profile.activeHours.start || hour >= profile.activeHours.end;
}

/**
 * Determines the severity of a wandering event based on distance and context.
 */
function determineSeverity(
  distanceFromHome: number,
  isNighttime: boolean,
  typicalRadius: number
): WanderingAlert['severity'] {
  const ratio = distanceFromHome / typicalRadius;

  if (ratio > 5 || (ratio > 3 && isNighttime)) {
    return 'critical';
  }
  if (ratio > 3 || (ratio > 2 && isNighttime)) {
    return 'high';
  }
  if (ratio > 1.5) {
    return 'medium';
  }
  return 'low';
}

/**
 * Analyzes a sequence of location points against a movement profile to detect wandering.
 * Returns a WanderingAlert if wandering is detected, or null otherwise.
 */
export function detectWandering(
  points: LocationPoint[],
  profile: MovementProfile
): WanderingAlert | null {
  if (points.length === 0) return null;

  const latestPoint = points[points.length - 1];
  const distanceFromHome = calculateDistance(
    latestPoint.latitude,
    latestPoint.longitude,
    profile.homeLocation.latitude,
    profile.homeLocation.longitude
  );

  const outsideRadius = distanceFromHome > profile.typicalRadius;
  const nighttime = isUnusualTime(latestPoint.timestamp, profile);

  // Check for rapid movement away from home
  let rapidMovement = false;
  if (points.length >= 2) {
    const prevPoint = points[points.length - 2];
    const prevDistance = calculateDistance(
      prevPoint.latitude,
      prevPoint.longitude,
      profile.homeLocation.latitude,
      profile.homeLocation.longitude
    );
    const timeDelta = (latestPoint.timestamp - prevPoint.timestamp) / 1000; // seconds
    if (timeDelta > 0) {
      const speedMps = Math.abs(distanceFromHome - prevDistance) / timeDelta;
      // Walking speed > 2 m/s is unusual for dementia patients
      rapidMovement = speedMps > 2;
    }
  }

  // Must meet at least one wandering criterion
  if (!outsideRadius && !nighttime && !rapidMovement) {
    return null;
  }

  // Calculate duration outside typical radius
  let duration = 0;
  if (points.length >= 2) {
    const firstOutsideIdx = points.findIndex((p) => {
      const d = calculateDistance(
        p.latitude,
        p.longitude,
        profile.homeLocation.latitude,
        profile.homeLocation.longitude
      );
      return d > profile.typicalRadius;
    });
    if (firstOutsideIdx >= 0) {
      duration = latestPoint.timestamp - points[firstOutsideIdx].timestamp;
    }
  }

  const severity = determineSeverity(distanceFromHome, nighttime, profile.typicalRadius);

  return {
    patientId: '',
    severity,
    location: latestPoint,
    distanceFromHome: Math.round(distanceFromHome),
    duration,
    timestamp: latestPoint.timestamp,
  };
}

/**
 * Computes a wandering risk score from 0 to 1 based on recent location data.
 */
export function getWanderingRisk(
  recentPoints: LocationPoint[],
  profile: MovementProfile
): number {
  if (recentPoints.length === 0) return 0;

  let risk = 0;

  // Factor 1: Distance from home (0-0.4)
  const latest = recentPoints[recentPoints.length - 1];
  const distFromHome = calculateDistance(
    latest.latitude,
    latest.longitude,
    profile.homeLocation.latitude,
    profile.homeLocation.longitude
  );
  const distanceRatio = Math.min(distFromHome / (profile.typicalRadius * 3), 1);
  risk += distanceRatio * 0.4;

  // Factor 2: Unusual time (0-0.2)
  if (isUnusualTime(latest.timestamp, profile)) {
    risk += 0.2;
  }

  // Factor 3: Trajectory away from home (0-0.2)
  if (recentPoints.length >= 3) {
    const distances = recentPoints.map((p) =>
      calculateDistance(
        p.latitude,
        p.longitude,
        profile.homeLocation.latitude,
        profile.homeLocation.longitude
      )
    );
    const increasing = distances.every((d, i) => i === 0 || d >= distances[i - 1]);
    if (increasing && distances[distances.length - 1] > profile.typicalRadius * 0.5) {
      risk += 0.2;
    }
  }

  // Factor 4: Speed (0-0.2)
  if (recentPoints.length >= 2) {
    const p1 = recentPoints[recentPoints.length - 2];
    const p2 = recentPoints[recentPoints.length - 1];
    const dist = calculateDistance(p1.latitude, p1.longitude, p2.latitude, p2.longitude);
    const timeSec = (p2.timestamp - p1.timestamp) / 1000;
    if (timeSec > 0) {
      const speed = dist / timeSec;
      if (speed > 1.5) {
        risk += Math.min((speed / 5) * 0.2, 0.2);
      }
    }
  }

  return Math.min(risk, 1);
}
