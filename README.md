# Gentle Reminder

A clinical-grade dementia and Alzheimer's cognitive support platform designed for iPad.

## What It Does

Gentle Reminder helps dementia patients maintain cognitive function through daily exercises, family connection, and memory preservation. It supports patients, families, caregivers, and clinicians with evidence-based therapeutic approaches.

### Core Features

- **Cognitive Sessions** - Guided orientation, identity recognition, and memory exercises
- **Family Connections** - Photo grid with voice/video messages from loved ones
- **Story Vault** - Voice recording and transcription of life memories
- **Gentle Scoring** - Never shows "wrong"; only celebrated, guided, or supported feedback
- **Caregiver Analytics** - Cognitive trends, engagement metrics, decline alerts

### Clinical Methods

- Reminiscence therapy (photo/music triggered recall)
- Validation therapy (emotionally supportive, never contradicts)
- Reality orientation (daily reinforcement of identity, date, location)
- Spaced repetition memory training
- Neuroplasticity training

## Architecture

Turborepo monorepo with npm workspaces:

```
gentle-reminder/
  apps/
    mobile/              Expo React Native (iPad)
    caregiver-dashboard/ Next.js (Phase 2)
    clinician-dashboard/ Next.js (Phase 3)
  packages/
    shared-types/        TypeScript interfaces
    ui-components/       Accessible primitives + theme
    auth/                JWT + RBAC
    database/            Prisma schema (PostgreSQL)
    cognitive-engine/    Exercise logic + scoring
  services/
    api/                 Express backend
    ai/                  Python FastAPI (Phase 2)
  infrastructure/
    docker/              Local development
    terraform/           AWS (Phase 2)
```

## Quick Start

### Prerequisites

- Node.js 20+
- Docker (for PostgreSQL)
- Expo CLI (`npx expo`)

### Setup

```bash
# Install dependencies
npm install

# Start PostgreSQL
cd infrastructure/docker && docker-compose up -d && cd ../..

# Generate Prisma client and run migrations
npm run db:generate
npm run db:migrate

# Seed demo data
npm run db:seed

# Start API server
npm run dev --workspace=services/api

# Start mobile app (in another terminal)
npm run dev --workspace=apps/mobile
```

### Demo Accounts

| Role       | Email                    | Password    |
|------------|--------------------------|-------------|
| Patient    | margaret@example.com     | demo123456  |
| Caregiver  | nurse.sarah@example.com  | demo123456  |
| Family     | lisa.thompson@example.com| demo123456  |
| Clinician  | dr.chen@example.com      | demo123456  |

## UX Design Principles

All enforced at the component level (not guidelines - hard constraints):

| Constraint | Value | Enforcement |
|-----------|-------|-------------|
| Minimum font size | 24pt | `Text` primitive floor |
| Minimum button height | 80px | `Button` primitive floor |
| Maximum choices per screen | 3 | Component validation |
| Contrast ratio | 7:1 (WCAG AAA) | Color palette design |
| Negative feedback | None | Only celebrated/guided/supported states |

## Testing

```bash
# Run all tests
npm test

# Run specific package tests
npm test --workspace=packages/cognitive-engine
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | Expo, React Native, TypeScript |
| Web Dashboards | Next.js, React |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| State | Zustand |
| Auth | JWT, RBAC (6 roles) |
| AI (Phase 2) | Python, FastAPI, Whisper |
| Graph (Phase 2) | Neo4j |
| Cloud (Phase 2) | AWS |

## Roadmap

- **Phase 1** (Current) - Mobile app MVP, backend API, database
- **Phase 2** - Caregiver dashboard, AI services, speech transcription
- **Phase 3** - Clinician dashboard, clinical reports, FDA SaMD preparation
- **Phase 4** - Memory graph (Neo4j), digital cognitive twin
- **Phase 5** - Clinical trial integration, hospital deployment
