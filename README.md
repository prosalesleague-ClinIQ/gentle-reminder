# Gentle Reminder

A clinical-grade dementia and Alzheimer's cognitive support platform. Built as a full-stack monorepo with a patient-facing iPad app, real-time caregiver dashboards, and clinical analytics -- all designed around evidence-based therapeutic methods and WCAG AAA accessibility standards.

## Live Links

| Resource | URL |
|----------|-----|
| GitHub Repository | [github.com/ChristoMac/gentle-reminder](https://github.com/ChristoMac/gentle-reminder) |
| Caregiver Dashboard | [gentle-reminder-dashboard.vercel.app](https://gentle-reminder-dashboard.vercel.app) |
| Clinician Dashboard | [gentle-reminder-clinical.vercel.app](https://gentle-reminder-clinical.vercel.app) |

## Architecture

```
gentle-reminder/
|
|-- apps/
|   |-- mobile/                  Expo React Native (iPad) - Patient-facing app
|   |-- caregiver-dashboard/     Next.js - Real-time caregiver portal
|   |-- clinician-dashboard/     Next.js - Clinical analytics and reporting
|
|-- packages/
|   |-- shared-types/            TypeScript interfaces shared across all apps
|   |-- ui-components/           Accessible UI primitives + theme system
|   |-- auth/                    JWT authentication + RBAC (6 roles)
|   |-- database/                Prisma ORM schema (PostgreSQL)
|   |-- cognitive-engine/        Exercise logic, scoring, session management
|   |-- report-generator/        PDF clinical report generation
|
|-- services/
|   |-- api/                     Express REST API + WebSocket server
|   |-- ai/                      Python FastAPI (Whisper, NLP, sentiment)
|
|-- e2e/                         Playwright E2E test suite
|
|-- infrastructure/
|   |-- docker/                  Local dev (PostgreSQL, Redis, Prometheus, Grafana)
|   |-- terraform/               AWS deployment configuration
|   |-- k8s/                     Kubernetes manifests + monitoring
```

## Features

### Mobile App (Expo / React Native)

- **Cognitive Sessions** -- Orientation, identity recognition, memory exercises with adaptive difficulty
- **Morning Routine** -- Daily guided check-in with date, weather, and mood tracking
- **Story Vault** -- Voice recording and transcription of life memories
- **Family Photos** -- Photo grid with voice and video messages from loved ones
- **Medications** -- Medication reminders with confirmation tracking
- **Tutorial Walkthrough** -- 4-step onboarding for new patients
- **Gentle Scoring** -- No negative feedback; only celebrated, guided, or supported states
- **SOS / Mood Check** -- Instant safety alerts and emotional state capture
- **Voice Companion** -- Conversational AI for comfort and engagement
- **Passive Cognitive Tests** -- Pattern recognition, clock drawing, reaction time

### Caregiver Dashboard (Next.js)

- **Patient Overview** -- Real-time cognitive scores, engagement metrics, and trends
- **Care Tasks** -- Urgent/daily/upcoming task management with priority and status tracking
- **Shift Handoff** -- Structured handoff notes between caregiver shifts
- **Family Portal** -- Family engagement tracking and communication hub
- **Alerts** -- Decline detection, missed medication, fall risk notifications
- **Analytics** -- Cognitive trend charts, session completion rates, engagement heatmaps
- **Engagement Tracking** -- Per-patient engagement scores and activity logs
- **Sleep Monitoring** -- Sleep pattern visualization and anomaly detection
- **Risk Assessment** -- Fall risk, wandering risk, and behavioral risk scoring
- **Messaging** -- Caregiver-to-family and caregiver-to-clinician messaging

### Clinician Dashboard (Next.js)

- **Clinical Overview** -- Facility-wide patient status and cognitive metrics
- **Patient Detail** -- Deep-dive into individual patient cognitive trajectories
- **Clinical Reports** -- PDF export of cognitive assessments for medical records
- **Biomarker Tracking** -- Longitudinal biomarker visualization
- **Treatment Plans** -- Evidence-based care plan management
- **Data Pipeline** -- Automated data collection, validation, and clinical export

### Backend (Express + PostgreSQL)

- **REST API** -- Full CRUD for patients, sessions, scores, medications, families
- **WebSocket Server** -- Real-time updates for dashboards and alerts
- **Authentication** -- JWT with role-based access control (Patient, Caregiver, Family, Clinician, Admin, System)
- **Medication Service** -- Scheduling, reminders, and adherence tracking
- **Session Management** -- Cognitive session orchestration and scoring pipeline

### Packages

- **cognitive-engine** -- Exercise generation, adaptive difficulty, scoring algorithms, spaced repetition
- **shared-types** -- TypeScript interfaces for patients, sessions, scores, medications, alerts
- **ui-components** -- Accessible primitives enforcing minimum font sizes, button heights, contrast ratios
- **auth** -- JWT token management, RBAC middleware, session validation
- **database** -- Prisma schema with 20+ models, migrations, seed data
- **report-generator** -- PDF clinical report templates and generation

## Clinical Methods

| Method | Implementation |
|--------|---------------|
| Reminiscence Therapy | Photo and music triggered recall sessions |
| Validation Therapy | Emotionally supportive responses, never contradicts the patient |
| Reality Orientation | Daily reinforcement of identity, date, location |
| Spaced Repetition | Adaptive memory training with increasing intervals |
| Neuroplasticity Training | Progressive cognitive exercises targeting multiple domains |

## UX Design Constraints

All enforced at the component level (hard constraints, not guidelines):

| Constraint | Value | Enforcement |
|-----------|-------|-------------|
| Minimum font size | 24pt | Text primitive floor |
| Minimum button height | 80px | Button primitive floor |
| Maximum choices per screen | 3 | Component validation |
| Contrast ratio | 7:1 (WCAG AAA) | Color palette design |
| Negative feedback | None | Only celebrated / guided / supported states |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | Expo, React Native, TypeScript |
| Web Dashboards | Next.js 14, React, TypeScript |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Real-time | WebSocket (ws) |
| State Management | Zustand |
| Authentication | JWT, RBAC (6 roles) |
| AI Services | Python, FastAPI, Whisper |
| PDF Reports | report-generator package |
| Monorepo | Turborepo, npm workspaces |
| Deployment | Vercel (dashboards), Docker (services) |

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

# Start caregiver dashboard (in another terminal)
npm run dev --workspace=apps/caregiver-dashboard

# Start clinician dashboard (in another terminal)
npm run dev --workspace=apps/clinician-dashboard
```

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Patient | margaret@example.com | demo123456 |
| Caregiver | nurse.sarah@example.com | demo123456 |
| Family | lisa.thompson@example.com | demo123456 |
| Clinician | dr.chen@example.com | demo123456 |

## Testing

```bash
# Run all tests
npm test

# Run specific package tests
npm test --workspace=packages/cognitive-engine
npm test --workspace=packages/auth
npm test --workspace=services/api
```

## Project Stats

| Metric | Value |
|--------|-------|
| Total Files | 930+ |
| Lines of Code | 52,000+ |
| Test Suites | 185+ tests |
| E2E Tests | Playwright (4 browsers + iPad) |
| Commits | 18 |
| Packages | 8 |
| Apps | 5 (mobile, caregiver, clinician, admin, family) |
| API Routes | 30+ |
| Database Models | 30+ |
| Languages | 10 (en, es, fr, de, zh, ja, ko, pt, ar, hi) |
| CI/CD | GitHub Actions (5 workflows) |

## Completed Roadmap

All roadmap items have been implemented across Phases 23-28:

- **Apple Watch Integration** -- SwiftUI Watch app with HealthKit, medication reminders, breathing exercise, fall detection with 60s countdown, complications
- **Real Whisper Integration** -- Dual-mode transcription (local Whisper model + OpenAI API), audio preprocessing, batch processing, caching
- **FHIR Compliance** -- Full HL7 FHIR R4 REST API with Patient/$everything, Observation search, CapabilityStatement, extensions, terminology service
- **FDA SaMD Pathway** -- IEC 62304, ISO 14971 FMEA, QMS, STRIDE cybersecurity, clinical validation protocol, algorithm transparency, labeling, post-market surveillance API
- **Memory Graph (Neo4j)** -- Production-hardened with JWT auth, rate limiting, pagination, structured logging, full-text search indexes, backup/restore
- **Clinical Trial Integration** -- Statistical analysis (t-test, Wilcoxon, Cohen's d), adverse event reporting, protocol deviation tracking, CFR Part 11 compliance, CDISC ODM-XML export, REDCap integration
- **Hospital Deployment** -- Multi-tenant architecture with Prisma tenant isolation, subdomain/header/JWT tenant resolution, K8s network policies, Prometheus monitoring, automated backups, Terraform per-tenant resources
- **Multilingual Support** -- 10 languages (en, es, fr, de, zh, ja, ko, pt, ar, hi) with RTL support, pluralization, locale-aware date/number formatting, dashboard i18n
- **Production Hardening** -- Push notification service (Expo + server), input sanitization middleware, health/readiness/metrics endpoints, Prometheus + Grafana monitoring stack, Playwright E2E test suite, admin tenants + system health pages, 5 GitHub Actions workflows

## License

Proprietary. All rights reserved.
