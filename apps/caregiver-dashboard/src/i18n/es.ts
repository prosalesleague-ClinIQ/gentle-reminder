import type { DashboardTranslationKey } from './en';

export const es: Record<DashboardTranslationKey, string> = {
  // Navigation
  dashboard: 'Panel de control',
  patients: 'Pacientes',
  tasks: 'Tareas de cuidado',
  alerts: 'Alertas',
  messages: 'Mensajes',
  analytics: 'Análisis',
  shiftHandoff: 'Cambio de turno',
  settings: 'Configuración',

  // Patient Overview
  patientOverview: 'Resumen del paciente',
  cognitiveScore: 'Puntuación cognitiva',
  lastSession: 'Última sesión',
  nextMedication: 'Próximo medicamento',
  riskAssessment: 'Evaluación de riesgo',
  engagementLevel: 'Nivel de participación',

  // Care Tasks
  highPriority: 'Prioridad alta',
  mediumPriority: 'Prioridad media',
  lowPriority: 'Prioridad baja',
  markComplete: 'Marcar como completado',
  assignTo: 'Asignar a',
  dueDate: 'Fecha límite',
  overdue: 'Vencido',

  // Alerts
  declineDetected: 'Deterioro cognitivo detectado',
  missedMedication: 'Medicamento omitido',
  fallRisk: 'Alerta de riesgo de caída',
  wanderingAlert: 'Alerta de deambulación',
  behavioralChange: 'Cambio conductual',
  acknowledge: 'Confirmar',
  dismiss: 'Descartar',

  // Clinical Terms
  orientation: 'Orientación',
  memory: 'Memoria',
  attention: 'Atención',
  language: 'Lenguaje',
  visuospatial: 'Visuoespacial',
  executiveFunction: 'Función ejecutiva',
  improving: 'Mejorando',
  stable: 'Estable',
  declining: 'En declive',

  // Biomarkers
  heartRate: 'Frecuencia cardíaca',
  bloodPressure: 'Presión arterial',
  sleepQuality: 'Calidad del sueño',
  activityLevel: 'Nivel de actividad',
  hrv: 'Variabilidad del ritmo cardíaco',
  spo2: 'Oxígeno en sangre',
  steps: 'Pasos',

  // Shift Handoff
  shiftSummary: 'Resumen del turno',
  notableEvents: 'Eventos destacados',
  medicationStatus: 'Estado de medicación',
  moodObservations: 'Observaciones del ánimo',
  handoffNotes: 'Notas del cambio de turno',

  // Time
  today: 'Hoy',
  yesterday: 'Ayer',
  thisWeek: 'Esta semana',
  thisMonth: 'Este mes',
  lastUpdated: 'Última actualización',

  // Actions
  viewDetails: 'Ver detalles',
  exportReport: 'Exportar informe',
  addNote: 'Agregar nota',
  contactFamily: 'Contactar familia',
  scheduleAppointment: 'Programar cita',
};
