export const en = {
  // Navigation
  dashboard: 'Dashboard',
  patients: 'Patients',
  tasks: 'Care Tasks',
  alerts: 'Alerts',
  messages: 'Messages',
  analytics: 'Analytics',
  shiftHandoff: 'Shift Handoff',
  settings: 'Settings',

  // Patient Overview
  patientOverview: 'Patient Overview',
  cognitiveScore: 'Cognitive Score',
  lastSession: 'Last Session',
  nextMedication: 'Next Medication',
  riskAssessment: 'Risk Assessment',
  engagementLevel: 'Engagement Level',

  // Care Tasks
  highPriority: 'High Priority',
  mediumPriority: 'Medium Priority',
  lowPriority: 'Low Priority',
  markComplete: 'Mark Complete',
  assignTo: 'Assign To',
  dueDate: 'Due Date',
  overdue: 'Overdue',

  // Alerts
  declineDetected: 'Cognitive Decline Detected',
  missedMedication: 'Missed Medication',
  fallRisk: 'Fall Risk Alert',
  wanderingAlert: 'Wandering Alert',
  behavioralChange: 'Behavioral Change',
  acknowledge: 'Acknowledge',
  dismiss: 'Dismiss',

  // Clinical Terms
  orientation: 'Orientation',
  memory: 'Memory',
  attention: 'Attention',
  language: 'Language',
  visuospatial: 'Visuospatial',
  executiveFunction: 'Executive Function',
  improving: 'Improving',
  stable: 'Stable',
  declining: 'Declining',

  // Biomarkers
  heartRate: 'Heart Rate',
  bloodPressure: 'Blood Pressure',
  sleepQuality: 'Sleep Quality',
  activityLevel: 'Activity Level',
  hrv: 'Heart Rate Variability',
  spo2: 'Blood Oxygen',
  steps: 'Steps',

  // Shift Handoff
  shiftSummary: 'Shift Summary',
  notableEvents: 'Notable Events',
  medicationStatus: 'Medication Status',
  moodObservations: 'Mood Observations',
  handoffNotes: 'Handoff Notes',

  // Time
  today: 'Today',
  yesterday: 'Yesterday',
  thisWeek: 'This Week',
  thisMonth: 'This Month',
  lastUpdated: 'Last Updated',

  // Actions
  viewDetails: 'View Details',
  exportReport: 'Export Report',
  addNote: 'Add Note',
  contactFamily: 'Contact Family',
  scheduleAppointment: 'Schedule Appointment',
} as const;

export type DashboardTranslationKey = keyof typeof en;
