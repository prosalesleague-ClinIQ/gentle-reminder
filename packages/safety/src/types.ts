export interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy?: number;
}

export interface Geofence {
  centerId: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  label: string;
}

export interface WanderingAlert {
  patientId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: LocationPoint;
  distanceFromHome: number;
  duration: number;
  timestamp: number;
}

export interface MovementProfile {
  normalPaths: LocationPoint[][];
  homeLocation: LocationPoint;
  typicalRadius: number;
  activeHours: { start: number; end: number };
}

export interface AccelerometerReading {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}
