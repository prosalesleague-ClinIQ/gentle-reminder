# Database Schema

## Overview

PostgreSQL database with 17 models managed by Prisma ORM.

## Entity Relationship

```
User 1--1 Patient
User 1--1 Caregiver
User 1--* FamilyMember (optional)

Patient 1--* CaregiverAssignment *--1 Caregiver
Patient 1--* FamilyMember
Patient 1--* Session
Patient 1--* CognitiveScore
Patient 1--* Memory
Patient 1--* Photo
Patient 1--* VoiceRecording
Patient 1--* EngagementMetric
Patient 1--* Alert

Session 1--* ExerciseResult
Session 1--1 CognitiveScore

Memory 1--* MemoryTag
Memory 1--1 StoryTranscript (optional)

User 1--* AuditLog
```

## Key Tables

### ExerciseResult (Clinical Audit Trail)
Records every patient interaction for regulatory compliance:
- `prompt` - Exact question shown
- `expectedAnswer` - Correct answer
- `givenAnswer` - Patient's response
- `isCorrect` - Boolean evaluation
- `responseTimeMs` - Milliseconds to respond
- `feedbackType` - celebrated/guided/supported
- `score` - Normalized 0.0-1.0

### CognitiveScore (Domain Scores)
Aggregated per-session scores across 6 cognitive domains:
- orientation, identity, memory, language, executive function, attention
- All normalized 0.0-1.0 for trend analysis

### EngagementMetric (Daily Aggregates)
One row per patient per day summarizing activity:
- Sessions completed/abandoned
- Average response time and score
- Total duration
