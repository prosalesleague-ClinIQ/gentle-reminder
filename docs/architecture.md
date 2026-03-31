# Architecture Overview

## System Design

Gentle Reminder uses a monorepo architecture with clear separation between:

1. **Apps** - User-facing applications (mobile, web dashboards)
2. **Packages** - Shared libraries consumed by multiple apps
3. **Services** - Backend microservices
4. **Infrastructure** - Deployment and DevOps

## Package Dependency Graph

```
shared-types (zero dependencies)
    |
    +-- auth (depends on shared-types)
    |
    +-- database (depends on shared-types)
    |
    +-- cognitive-engine (depends on shared-types)
    |
    +-- ui-components (depends on shared-types)
    |
    +-- api service (depends on auth, database, cognitive-engine, shared-types)
    |
    +-- mobile app (depends on ui-components, cognitive-engine, shared-types)
```

## Key Design Decisions

### Session State Machine

Sessions follow a strict linear progression to prevent patient disorientation:

```
IDLE -> STARTING -> ORIENTATION -> IDENTITY -> MEMORY -> COMPLETING -> COMPLETED
                                                              |
                                                         ABANDONED
```

Navigation is state-driven. The patient cannot skip or reorder exercises.

### Gentle Feedback System

The system architecturally prevents negative feedback. All exercise evaluations produce one of exactly three states:

- **Celebrated** - Correct answer, positive reinforcement
- **Guided** - Close answer, gentle correction with the right answer
- **Supported** - Wrong/no answer, warmly provided with the answer

### RBAC Model

Six roles with hierarchical permissions:

```
system_admin > facility_admin > clinician > caregiver > family_member > patient
```

Each API endpoint declares required role and resource via middleware.

### Data Flow

```
Patient (iPad) -> API Server -> PostgreSQL
                      |
                  Prisma ORM
                      |
                Cognitive Engine (scoring)
                      |
                Caregiver Dashboard (reads analytics)
```

### FDA SaMD Preparation

Built into Phase 1:
- Granular audit trail (ExerciseResult records every interaction)
- Versioned database migrations (Prisma)
- Deterministic scoring (no randomness in evaluation)
- No diagnostic or prescriptive claims
- Role-based data separation
