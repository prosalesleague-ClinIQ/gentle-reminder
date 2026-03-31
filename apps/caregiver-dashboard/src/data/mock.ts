// Mock data for the caregiver dashboard

export interface Patient {
  id: string;
  name: string;
  age: number;
  city: string;
  stage: 'Mild' | 'Moderate' | 'Severe';
  overallScore: number;
  trend: 'up' | 'down' | 'stable';
  lastSession: string;
  orientation: number;
  identity: number;
  memory: number;
  sessions: SessionSummary[];
}

export interface SessionSummary {
  id: string;
  date: string;
  type: string;
  score: number;
  duration: string;
  completed: boolean;
}

export interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  read: boolean;
}

export interface ActivityItem {
  id: string;
  message: string;
  timestamp: string;
  type: 'session' | 'alert' | 'milestone';
}

export const patients: Patient[] = [
  {
    id: 'p1',
    name: 'Margaret Thompson',
    age: 82,
    city: 'Portland, OR',
    stage: 'Mild',
    overallScore: 78,
    trend: 'down',
    lastSession: '2026-03-30',
    orientation: 82,
    identity: 88,
    memory: 64,
    sessions: [
      { id: 's1', date: '2026-03-30', type: 'Memory Recall', score: 72, duration: '18 min', completed: true },
      { id: 's2', date: '2026-03-28', type: 'Photo Recognition', score: 85, duration: '12 min', completed: true },
      { id: 's3', date: '2026-03-26', type: 'Orientation Check', score: 78, duration: '15 min', completed: true },
      { id: 's4', date: '2026-03-24', type: 'Memory Recall', score: 80, duration: '20 min', completed: true },
      { id: 's5', date: '2026-03-22', type: 'Daily Routine', score: 75, duration: '10 min', completed: false },
    ],
  },
  {
    id: 'p2',
    name: 'Harold Jenkins',
    age: 79,
    city: 'Seattle, WA',
    stage: 'Moderate',
    overallScore: 62,
    trend: 'down',
    lastSession: '2026-03-29',
    orientation: 55,
    identity: 70,
    memory: 58,
    sessions: [
      { id: 's6', date: '2026-03-29', type: 'Photo Recognition', score: 60, duration: '22 min', completed: true },
      { id: 's7', date: '2026-03-27', type: 'Memory Recall', score: 58, duration: '25 min', completed: true },
      { id: 's8', date: '2026-03-25', type: 'Orientation Check', score: 55, duration: '18 min', completed: false },
      { id: 's9', date: '2026-03-23', type: 'Daily Routine', score: 65, duration: '14 min', completed: true },
    ],
  },
  {
    id: 'p3',
    name: 'Dorothy Williams',
    age: 75,
    city: 'Eugene, OR',
    stage: 'Mild',
    overallScore: 85,
    trend: 'up',
    lastSession: '2026-03-31',
    orientation: 90,
    identity: 92,
    memory: 74,
    sessions: [
      { id: 's10', date: '2026-03-31', type: 'Memory Recall', score: 88, duration: '15 min', completed: true },
      { id: 's11', date: '2026-03-29', type: 'Photo Recognition', score: 90, duration: '10 min', completed: true },
      { id: 's12', date: '2026-03-27', type: 'Orientation Check', score: 85, duration: '12 min', completed: true },
      { id: 's13', date: '2026-03-25', type: 'Daily Routine', score: 82, duration: '8 min', completed: true },
    ],
  },
  {
    id: 'p4',
    name: 'Frank Anderson',
    age: 88,
    city: 'Boise, ID',
    stage: 'Severe',
    overallScore: 45,
    trend: 'stable',
    lastSession: '2026-03-28',
    orientation: 35,
    identity: 52,
    memory: 40,
    sessions: [
      { id: 's14', date: '2026-03-28', type: 'Photo Recognition', score: 42, duration: '30 min', completed: true },
      { id: 's15', date: '2026-03-26', type: 'Memory Recall', score: 38, duration: '28 min', completed: false },
      { id: 's16', date: '2026-03-24', type: 'Orientation Check', score: 45, duration: '20 min', completed: true },
    ],
  },
];

export const alerts: Alert[] = [
  {
    id: 'a1',
    patientId: 'p1',
    patientName: 'Margaret Thompson',
    message: 'Memory score dropped 18% over the past two weeks',
    severity: 'high',
    timestamp: '2026-03-31T09:15:00',
    read: false,
  },
  {
    id: 'a2',
    patientId: 'p2',
    patientName: 'Harold Jenkins',
    message: '3 missed sessions in the past 7 days',
    severity: 'high',
    timestamp: '2026-03-30T14:30:00',
    read: false,
  },
  {
    id: 'a3',
    patientId: 'p3',
    patientName: 'Dorothy Williams',
    message: 'Response time increased 35% during last session',
    severity: 'medium',
    timestamp: '2026-03-31T08:00:00',
    read: false,
  },
  {
    id: 'a4',
    patientId: 'p4',
    patientName: 'Frank Anderson',
    message: 'Orientation score below 40% threshold for 3 consecutive sessions',
    severity: 'high',
    timestamp: '2026-03-29T11:45:00',
    read: true,
  },
  {
    id: 'a5',
    patientId: 'p2',
    patientName: 'Harold Jenkins',
    message: 'Photo recognition accuracy declining - review recommended',
    severity: 'low',
    timestamp: '2026-03-28T16:20:00',
    read: true,
  },
];

export const recentActivity: ActivityItem[] = [
  {
    id: 'act1',
    message: 'Dorothy Williams completed Memory Recall session (88%)',
    timestamp: '12 minutes ago',
    type: 'session',
  },
  {
    id: 'act2',
    message: 'Alert: Margaret Thompson memory score dropped 18%',
    timestamp: '1 hour ago',
    type: 'alert',
  },
  {
    id: 'act3',
    message: 'Harold Jenkins missed scheduled session',
    timestamp: '3 hours ago',
    type: 'alert',
  },
  {
    id: 'act4',
    message: 'Frank Anderson completed Photo Recognition session (42%)',
    timestamp: '5 hours ago',
    type: 'session',
  },
  {
    id: 'act5',
    message: 'Dorothy Williams reached 7-day streak milestone',
    timestamp: '1 day ago',
    type: 'milestone',
  },
];
