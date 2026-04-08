// Mock data for the Family Dashboard

export interface PatientInfo {
  id: string;
  name: string;
  age: number;
  stage: 'Mild' | 'Moderate' | 'Severe';
  primaryCaregiver: string;
  facilityName: string;
  roomNumber: string;
}

export interface CognitiveScore {
  date: string;
  overall: number;
  orientation: number;
  memory: number;
  attention: number;
  language: number;
  visuospatial: number;
}

export interface Session {
  id: string;
  date: string;
  duration: string;
  score: number;
  exercisesCompleted: number;
  exercisesTotal: number;
  type: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: string;
  adherence: number;
  status: 'taken' | 'pending' | 'missed';
  nextDose?: string;
}

export interface MedicationAdherence {
  day: string;
  adherence: number;
}

export interface MedicationChange {
  id: string;
  date: string;
  medication: string;
  change: string;
  prescribedBy: string;
}

export interface Message {
  id: string;
  threadId: string;
  sender: string;
  senderRole: 'caregiver' | 'clinician' | 'family' | 'system';
  content: string;
  timestamp: string;
  type: 'text' | 'photo' | 'session_summary';
  read: boolean;
}

export interface Thread {
  id: string;
  title: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  type: 'caregiver' | 'clinician' | 'system';
}

export interface Photo {
  id: string;
  url: string;
  caption: string;
  category: 'Family' | 'Events' | 'Places';
  uploadedBy: string;
  uploadedAt: string;
}

export interface VoiceRecording {
  id: string;
  title: string;
  duration: string;
  recordedBy: string;
  recordedAt: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
  downloadUrl: string;
}

export interface BillingPlan {
  name: string;
  price: number;
  billingCycle: 'monthly' | 'annual';
  renewalDate: string;
  sessionsIncluded: number;
  sessionsUsed: number;
  storageGb: number;
  storageUsedGb: number;
  usersIncluded: number;
  usersActive: number;
}

export interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  provider: string;
  location: string;
}

// --- Patient Info ---
export const patient: PatientInfo = {
  id: 'p1',
  name: 'Margaret Wilson',
  age: 78,
  stage: 'Mild',
  primaryCaregiver: 'Sarah Mitchell',
  facilityName: 'Sunrise Memory Care',
  roomNumber: '214',
};

// --- Cognitive Scores (30 days) ---
export const cognitiveScores: CognitiveScore[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 2, 8 + i);
  const base = 72 + Math.sin(i * 0.3) * 6;
  return {
    date: date.toISOString().split('T')[0],
    overall: Math.round(base + (Math.random() - 0.5) * 4),
    orientation: Math.round(base + 5 + (Math.random() - 0.5) * 6),
    memory: Math.round(base - 8 + (Math.random() - 0.5) * 6),
    attention: Math.round(base + 2 + (Math.random() - 0.5) * 5),
    language: Math.round(base + 8 + (Math.random() - 0.5) * 4),
    visuospatial: Math.round(base - 3 + (Math.random() - 0.5) * 5),
  };
});

// --- Sessions ---
export const sessions: Session[] = [
  { id: 's1', date: '2026-04-06', duration: '22 min', score: 76, exercisesCompleted: 5, exercisesTotal: 6, type: 'Memory Recall' },
  { id: 's2', date: '2026-04-05', duration: '18 min', score: 80, exercisesCompleted: 4, exercisesTotal: 4, type: 'Photo Recognition' },
  { id: 's3', date: '2026-04-04', duration: '25 min', score: 72, exercisesCompleted: 6, exercisesTotal: 7, type: 'Orientation Check' },
  { id: 's4', date: '2026-04-03', duration: '15 min', score: 78, exercisesCompleted: 3, exercisesTotal: 3, type: 'Daily Routine' },
  { id: 's5', date: '2026-04-02', duration: '20 min', score: 74, exercisesCompleted: 5, exercisesTotal: 5, type: 'Memory Recall' },
  { id: 's6', date: '2026-04-01', duration: '19 min', score: 81, exercisesCompleted: 4, exercisesTotal: 5, type: 'Photo Recognition' },
  { id: 's7', date: '2026-03-31', duration: '23 min', score: 69, exercisesCompleted: 4, exercisesTotal: 6, type: 'Orientation Check' },
  { id: 's8', date: '2026-03-30', duration: '17 min', score: 77, exercisesCompleted: 5, exercisesTotal: 5, type: 'Memory Recall' },
  { id: 's9', date: '2026-03-29', duration: '21 min', score: 73, exercisesCompleted: 4, exercisesTotal: 5, type: 'Daily Routine' },
  { id: 's10', date: '2026-03-28', duration: '16 min', score: 82, exercisesCompleted: 3, exercisesTotal: 3, type: 'Photo Recognition' },
];

// --- Medications ---
export const medications: Medication[] = [
  { id: 'm1', name: 'Donepezil', dosage: '10mg', schedule: 'Once daily, evening', adherence: 96, status: 'taken' },
  { id: 'm2', name: 'Memantine', dosage: '10mg', schedule: 'Twice daily', adherence: 88, status: 'pending', nextDose: '6:00 PM' },
  { id: 'm3', name: 'Vitamin D3', dosage: '2000 IU', schedule: 'Once daily, morning', adherence: 92, status: 'taken' },
  { id: 'm4', name: 'Sertraline', dosage: '50mg', schedule: 'Once daily, morning', adherence: 100, status: 'taken' },
  { id: 'm5', name: 'Melatonin', dosage: '3mg', schedule: 'Once daily, bedtime', adherence: 85, status: 'pending', nextDose: '9:00 PM' },
];

export const medicationAdherence: MedicationAdherence[] = [
  { day: 'Mon', adherence: 100 },
  { day: 'Tue', adherence: 80 },
  { day: 'Wed', adherence: 100 },
  { day: 'Thu', adherence: 60 },
  { day: 'Fri', adherence: 100 },
  { day: 'Sat', adherence: 80 },
  { day: 'Sun', adherence: 100 },
];

export const medicationChanges: MedicationChange[] = [
  { id: 'mc1', date: '2026-03-28', medication: 'Memantine', change: 'Dosage increased from 5mg to 10mg', prescribedBy: 'Dr. Chen' },
  { id: 'mc2', date: '2026-03-15', medication: 'Melatonin', change: 'Added to regimen for sleep support', prescribedBy: 'Dr. Chen' },
  { id: 'mc3', date: '2026-02-20', medication: 'Donepezil', change: 'Dosage increased from 5mg to 10mg', prescribedBy: 'Dr. Patel' },
];

// --- Messages ---
export const threads: Thread[] = [
  {
    id: 't1',
    title: 'Daily Update - April 6',
    participants: ['Sarah Mitchell', 'You'],
    lastMessage: 'Mom had a great morning today! She recognized...',
    lastMessageTime: '2026-04-06T10:30:00',
    unreadCount: 2,
    type: 'caregiver',
  },
  {
    id: 't2',
    title: 'Medication Adjustment Note',
    participants: ['Dr. Chen', 'You'],
    lastMessage: 'The increased Memantine dosage appears to be...',
    lastMessageTime: '2026-04-05T14:15:00',
    unreadCount: 0,
    type: 'clinician',
  },
  {
    id: 't3',
    title: 'Weekly Summary - Week 14',
    participants: ['System', 'You'],
    lastMessage: 'Weekly cognitive summary: Overall trend stable...',
    lastMessageTime: '2026-04-04T08:00:00',
    unreadCount: 1,
    type: 'system',
  },
  {
    id: 't4',
    title: 'Photo from Garden Activity',
    participants: ['Sarah Mitchell', 'You'],
    lastMessage: 'She loved the garden today! Here are some photos.',
    lastMessageTime: '2026-04-03T16:45:00',
    unreadCount: 0,
    type: 'caregiver',
  },
  {
    id: 't5',
    title: 'Appointment Reminder',
    participants: ['Dr. Patel', 'You'],
    lastMessage: 'Just a reminder about the follow-up on April 12th.',
    lastMessageTime: '2026-04-02T09:00:00',
    unreadCount: 0,
    type: 'clinician',
  },
];

export const messages: Message[] = [
  {
    id: 'msg1',
    threadId: 't1',
    sender: 'Sarah Mitchell',
    senderRole: 'caregiver',
    content: 'Good morning! Margaret had a wonderful start to the day. She was alert and in good spirits during breakfast.',
    timestamp: '2026-04-06T08:15:00',
    type: 'text',
    read: true,
  },
  {
    id: 'msg2',
    threadId: 't1',
    sender: 'Sarah Mitchell',
    senderRole: 'caregiver',
    content: 'She completed her morning memory exercises and scored 76%. She particularly enjoyed the photo recognition activity with family pictures.',
    timestamp: '2026-04-06T10:30:00',
    type: 'session_summary',
    read: false,
  },
  {
    id: 'msg3',
    threadId: 't1',
    sender: 'You',
    senderRole: 'family',
    content: 'That is wonderful to hear! Did she mention anything about the garden? She always loved tending to the roses.',
    timestamp: '2026-04-06T11:00:00',
    type: 'text',
    read: true,
  },
  {
    id: 'msg4',
    threadId: 't2',
    sender: 'Dr. Chen',
    senderRole: 'clinician',
    content: 'The increased Memantine dosage appears to be well-tolerated. No adverse effects reported. We will continue monitoring for the next 2 weeks before our follow-up.',
    timestamp: '2026-04-05T14:15:00',
    type: 'text',
    read: true,
  },
  {
    id: 'msg5',
    threadId: 't3',
    sender: 'System',
    senderRole: 'system',
    content: 'Weekly cognitive summary: Overall trend stable at 75%. Memory domain showing slight improvement (+3%). Orientation remains consistent. 5 of 7 scheduled sessions completed this week.',
    timestamp: '2026-04-04T08:00:00',
    type: 'session_summary',
    read: false,
  },
  {
    id: 'msg6',
    threadId: 't4',
    sender: 'Sarah Mitchell',
    senderRole: 'caregiver',
    content: 'She loved the garden today! She spent 30 minutes walking through the flower beds and even helped water the plants. Here are some photos from the activity.',
    timestamp: '2026-04-03T16:45:00',
    type: 'photo',
    read: true,
  },
  {
    id: 'msg7',
    threadId: 't5',
    sender: 'Dr. Patel',
    senderRole: 'clinician',
    content: 'Just a reminder about Margaret\'s follow-up appointment on April 12th at 2:00 PM. We will review her cognitive assessments and discuss the care plan going forward.',
    timestamp: '2026-04-02T09:00:00',
    type: 'text',
    read: true,
  },
];

// --- Photos ---
export const photos: Photo[] = [
  { id: 'ph1', url: '/photos/family1.jpg', caption: 'Margaret with grandchildren at Easter', category: 'Family', uploadedBy: 'Jennifer Wilson', uploadedAt: '2026-04-01' },
  { id: 'ph2', url: '/photos/family2.jpg', caption: 'Birthday celebration - March 2026', category: 'Events', uploadedBy: 'Jennifer Wilson', uploadedAt: '2026-03-15' },
  { id: 'ph3', url: '/photos/garden1.jpg', caption: 'Garden walk at Sunrise Care', category: 'Places', uploadedBy: 'Sarah Mitchell', uploadedAt: '2026-04-03' },
  { id: 'ph4', url: '/photos/family3.jpg', caption: 'Margaret and David - Anniversary', category: 'Family', uploadedBy: 'Jennifer Wilson', uploadedAt: '2026-02-14' },
  { id: 'ph5', url: '/photos/event1.jpg', caption: 'Music therapy group session', category: 'Events', uploadedBy: 'Sarah Mitchell', uploadedAt: '2026-03-22' },
  { id: 'ph6', url: '/photos/place1.jpg', caption: 'Sunrise Care community room', category: 'Places', uploadedBy: 'Sarah Mitchell', uploadedAt: '2026-03-10' },
  { id: 'ph7', url: '/photos/family4.jpg', caption: 'Video call with son Michael', category: 'Family', uploadedBy: 'Jennifer Wilson', uploadedAt: '2026-03-28' },
  { id: 'ph8', url: '/photos/event2.jpg', caption: 'Art class - watercolor painting', category: 'Events', uploadedBy: 'Sarah Mitchell', uploadedAt: '2026-03-20' },
];

export const voiceRecordings: VoiceRecording[] = [
  { id: 'vr1', title: 'Good morning message from Jennifer', duration: '0:42', recordedBy: 'Jennifer Wilson', recordedAt: '2026-04-05' },
  { id: 'vr2', title: 'Grandkids saying hello', duration: '1:15', recordedBy: 'Jennifer Wilson', recordedAt: '2026-04-01' },
  { id: 'vr3', title: 'Family song - You Are My Sunshine', duration: '2:30', recordedBy: 'Michael Wilson', recordedAt: '2026-03-25' },
  { id: 'vr4', title: 'Story about the old house', duration: '3:10', recordedBy: 'Jennifer Wilson', recordedAt: '2026-03-18' },
];

// --- Billing ---
export const billingPlan: BillingPlan = {
  name: 'Family Care Plus',
  price: 49.99,
  billingCycle: 'monthly',
  renewalDate: '2026-05-01',
  sessionsIncluded: 30,
  sessionsUsed: 22,
  storageGb: 10,
  storageUsedGb: 3.2,
  usersIncluded: 5,
  usersActive: 3,
};

export const invoices: Invoice[] = [
  { id: 'inv1', date: '2026-04-01', amount: 49.99, status: 'paid', description: 'Family Care Plus - April 2026', downloadUrl: '#' },
  { id: 'inv2', date: '2026-03-01', amount: 49.99, status: 'paid', description: 'Family Care Plus - March 2026', downloadUrl: '#' },
  { id: 'inv3', date: '2026-02-01', amount: 49.99, status: 'paid', description: 'Family Care Plus - February 2026', downloadUrl: '#' },
  { id: 'inv4', date: '2026-01-01', amount: 39.99, status: 'paid', description: 'Family Care Standard - January 2026', downloadUrl: '#' },
  { id: 'inv5', date: '2025-12-01', amount: 39.99, status: 'paid', description: 'Family Care Standard - December 2025', downloadUrl: '#' },
];

// --- Appointments ---
export const nextAppointment: Appointment = {
  id: 'apt1',
  title: 'Follow-up with Dr. Patel',
  date: '2026-04-12',
  time: '2:00 PM',
  provider: 'Dr. Patel',
  location: 'Sunrise Memory Care, Room 102',
};
