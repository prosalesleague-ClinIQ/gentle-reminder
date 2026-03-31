import { LocationPoint, MovementProfile } from './types';
import { calculateDistance } from './WanderingDetector';

const CLUSTER_RADIUS_METERS = 100;
const DEFAULT_ACTIVE_HOURS = { start: 7, end: 22 };

interface Cluster {
  latitude: number;
  longitude: number;
  count: number;
  points: LocationPoint[];
}

/**
 * Groups nearby location points into clusters using a simple greedy approach.
 */
function clusterPoints(points: LocationPoint[], radiusMeters: number): Cluster[] {
  const clusters: Cluster[] = [];

  for (const point of points) {
    let assigned = false;
    for (const cluster of clusters) {
      const dist = calculateDistance(
        point.latitude,
        point.longitude,
        cluster.latitude,
        cluster.longitude
      );
      if (dist <= radiusMeters) {
        // Update cluster centroid as weighted average
        const totalCount = cluster.count + 1;
        cluster.latitude =
          (cluster.latitude * cluster.count + point.latitude) / totalCount;
        cluster.longitude =
          (cluster.longitude * cluster.count + point.longitude) / totalCount;
        cluster.count = totalCount;
        cluster.points.push(point);
        assigned = true;
        break;
      }
    }

    if (!assigned) {
      clusters.push({
        latitude: point.latitude,
        longitude: point.longitude,
        count: 1,
        points: [point],
      });
    }
  }

  return clusters;
}

/**
 * Identifies the home location as the centroid of the most frequent cluster.
 */
function findHomeLocation(clusters: Cluster[]): LocationPoint {
  if (clusters.length === 0) {
    return { latitude: 0, longitude: 0, timestamp: 0 };
  }

  const sorted = [...clusters].sort((a, b) => b.count - a.count);
  const home = sorted[0];

  return {
    latitude: home.latitude,
    longitude: home.longitude,
    timestamp: 0,
  };
}

/**
 * Calculates the typical radius as the 90th percentile distance from home.
 */
function computeTypicalRadius(points: LocationPoint[], home: LocationPoint): number {
  if (points.length === 0) return 500; // default 500m

  const distances = points.map((p) =>
    calculateDistance(p.latitude, p.longitude, home.latitude, home.longitude)
  );

  distances.sort((a, b) => a - b);
  const idx = Math.floor(distances.length * 0.9);
  const radius = distances[idx];

  // Minimum 100m radius
  return Math.max(radius, 100);
}

/**
 * Determines active hours from historical points by finding the range
 * that covers 90% of activity.
 */
function computeActiveHours(
  points: LocationPoint[]
): { start: number; end: number } {
  if (points.length < 10) return DEFAULT_ACTIVE_HOURS;

  const hourCounts = new Array(24).fill(0);
  for (const p of points) {
    const hour = new Date(p.timestamp).getHours();
    hourCounts[hour]++;
  }

  const total = hourCounts.reduce((sum: number, c: number) => sum + c, 0);
  const threshold = total * 0.05; // Hours with less than 5% of activity are inactive

  let start = 0;
  let end = 23;

  for (let h = 0; h < 24; h++) {
    if (hourCounts[h] >= threshold) {
      start = h;
      break;
    }
  }

  for (let h = 23; h >= 0; h--) {
    if (hourCounts[h] >= threshold) {
      end = h + 1;
      break;
    }
  }

  return { start, end };
}

/**
 * Extracts normal movement paths from historical data by grouping
 * consecutive points that form common routes.
 */
function extractNormalPaths(
  points: LocationPoint[],
  home: LocationPoint
): LocationPoint[][] {
  if (points.length < 5) return [];

  const sorted = [...points].sort((a, b) => a.timestamp - b.timestamp);
  const paths: LocationPoint[][] = [];
  let currentPath: LocationPoint[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const point = sorted[i];

    if (currentPath.length === 0) {
      currentPath.push(point);
      continue;
    }

    const prevPoint = currentPath[currentPath.length - 1];
    const timeDelta = point.timestamp - prevPoint.timestamp;

    // Break path if gap > 30 minutes
    if (timeDelta > 30 * 60 * 1000) {
      if (currentPath.length >= 3) {
        paths.push(currentPath);
      }
      currentPath = [point];
    } else {
      currentPath.push(point);
    }
  }

  if (currentPath.length >= 3) {
    paths.push(currentPath);
  }

  return paths;
}

/**
 * Builds a complete movement profile from historical location data.
 */
export function buildMovementProfile(
  historicalPoints: LocationPoint[]
): MovementProfile {
  const clusters = clusterPoints(historicalPoints, CLUSTER_RADIUS_METERS);
  const homeLocation = findHomeLocation(clusters);
  const typicalRadius = computeTypicalRadius(historicalPoints, homeLocation);
  const activeHours = computeActiveHours(historicalPoints);
  const normalPaths = extractNormalPaths(historicalPoints, homeLocation);

  return {
    normalPaths,
    homeLocation,
    typicalRadius,
    activeHours,
  };
}

/**
 * Checks if a location is anomalous relative to the patient's movement profile.
 */
export function isAnomalousLocation(
  point: LocationPoint,
  profile: MovementProfile
): boolean {
  const distFromHome = calculateDistance(
    point.latitude,
    point.longitude,
    profile.homeLocation.latitude,
    profile.homeLocation.longitude
  );

  // Beyond twice the typical radius is anomalous
  if (distFromHome > profile.typicalRadius * 2) {
    return true;
  }

  // Check if near any known path
  for (const path of profile.normalPaths) {
    for (const pathPoint of path) {
      const dist = calculateDistance(
        point.latitude,
        point.longitude,
        pathPoint.latitude,
        pathPoint.longitude
      );
      if (dist < 200) {
        // Within 200m of a known path
        return false;
      }
    }
  }

  // If outside typical radius and not near any known path
  if (distFromHome > profile.typicalRadius) {
    return true;
  }

  return false;
}

/**
 * Checks if a timestamp is anomalous relative to the patient's active hours.
 */
export function isAnomalousTime(
  timestamp: Date,
  profile: MovementProfile
): boolean {
  const hour = timestamp.getHours();
  return hour < profile.activeHours.start || hour >= profile.activeHours.end;
}
