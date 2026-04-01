export const typeDefs = `
  type Query {
    patient(id: ID!): Patient
    patients(limit: Int, offset: Int): PatientConnection!
    session(id: ID!): Session
    sessionHistory(patientId: ID!, limit: Int): [Session!]!
    cognitiveScores(patientId: ID!, days: Int): [CognitiveScore!]!
    alerts(patientId: ID, severity: String): [Alert!]!
    medications(patientId: ID!): [Medication!]!
    biomarkerScores(patientId: ID!): [BiomarkerScore!]!
    riskPredictions(patientId: ID!): [RiskPrediction!]!
  }

  type Patient {
    id: ID!
    userId: String!
    preferredName: String!
    city: String!
    cognitiveStage: String!
    dateOfBirth: String!
    sessions: [Session!]!
    familyMembers: [FamilyMember!]!
    cognitiveScores: [CognitiveScore!]!
    alerts: [Alert!]!
  }

  type PatientConnection {
    patients: [Patient!]!
    totalCount: Int!
  }

  type Session {
    id: ID!
    patientId: String!
    status: String!
    startedAt: String!
    completedAt: String
    durationSeconds: Int
    exerciseCount: Int!
    overallScore: Float
    exerciseResults: [ExerciseResult!]!
  }

  type ExerciseResult {
    id: ID!
    exerciseType: String!
    domain: String!
    prompt: String!
    isCorrect: Boolean!
    responseTimeMs: Int!
    feedbackType: String!
    score: Float!
  }

  type CognitiveScore {
    id: ID!
    overallScore: Float!
    orientationScore: Float!
    identityScore: Float!
    memoryScore: Float!
    recordedAt: String!
  }

  type FamilyMember {
    id: ID!
    displayName: String!
    relationship: String!
    photoUrl: String
  }

  type Alert {
    id: ID!
    type: String!
    severity: String!
    message: String!
    isRead: Boolean!
    createdAt: String!
  }

  type Medication {
    id: ID!
    name: String!
    dosage: String!
    frequency: String!
    isActive: Boolean!
  }

  type BiomarkerScore {
    id: ID!
    biomarkerType: String!
    score: Float!
    confidence: Float!
    trend: String
    createdAt: String!
  }

  type RiskPrediction {
    id: ID!
    riskType: String!
    probability: Float!
    timeframeDays: Int!
    confidence: Float!
    createdAt: String!
  }
`;
