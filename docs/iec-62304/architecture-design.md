# Software Architecture Design Document

**Document ID:** SAD-001
**IEC 62304 Reference:** Clause 5.3 - Software Architectural Design
**Version:** 1.0
**Effective Date:** 2026-04-06
**Author:** Regulatory Affairs

---

## 1. Purpose

This document describes the software architecture of the Gentle Reminder cognitive health monitoring platform, including system decomposition, data flows, security architecture, and deployment topology.

## 2. System Overview

Gentle Reminder is structured as a TypeScript monorepo containing four applications, fifteen shared packages, and three backend services. The architecture supports multi-tenant deployment for healthcare organizations while maintaining strict data isolation.

## 3. Monorepo Structure

```
gentle-reminder/
  apps/
    mobile/           # React Native / Expo (iOS, Android, watchOS)
    web/              # Next.js patient-facing portal
    caregiver-web/    # Next.js caregiver dashboard
    admin/            # Next.js admin and clinical portal
  packages/
    cognitive-engine/ # Exercise generation, scoring, adaptive difficulty
    shared-types/     # TypeScript type definitions shared across all apps
    auth/             # Authentication, RBAC, JWT token management
    ui/               # Shared React Native component library
    api-client/       # Typed API client for frontend apps
    database/         # Prisma schema, migrations, database utilities
    fhir/             # FHIR R4 resource builders and validators
    notifications/    # Push notification, SMS, email delivery
    analytics/        # Cognitive trend analysis and reporting
    config/           # Shared configuration and environment management
    i18n/             # Internationalization (8 languages)
    voice/            # Voice interaction engine
    wearables/        # Wearable device integration (watchOS, health APIs)
    billing/          # Subscription and billing management
    llm-agent/        # LLM-powered conversational agent
  services/
    api/              # Express.js REST API server
    fhir-gateway/     # FHIR R4 integration service
    alert-engine/     # Real-time alert processing and delivery
```

## 4. Component Architecture

### 4.1 Cognitive Engine (Safety-Critical)

The cognitive engine is the core clinical component responsible for:

- **Exercise Generation:** Creates domain-specific prompts with adaptive difficulty
- **Answer Evaluation:** Deterministic scoring of patient responses (0.0 - 1.0)
- **Session Scoring:** Aggregates exercise scores into domain and overall scores
- **Adaptive Difficulty:** Adjusts exercise difficulty to maintain 70-85% success rate
- **Decline Detection:** Analyzes longitudinal score trends for cognitive decline

Domains: Orientation, Memory, Attention, Language, Visuospatial, Executive Function

Score calculation: `overallScore = mean(activeDomainScores)` where each domain score is the mean of individual exercise scores within that domain. All scoring functions are pure (no side effects, no randomness) to ensure determinism.

### 4.2 API Server

Express.js REST API serving all client applications:

- Authentication and session management (JWT + refresh tokens)
- CRUD operations for patients, caregivers, families, exercises, sessions
- Cognitive score computation and storage
- Medication reminder management
- Wearable data ingestion
- Clinical reporting endpoints
- Post-market surveillance data collection

### 4.3 Alert Engine

Real-time event processing service:

- Processes fall detection events from wearable devices
- Monitors medication reminder acknowledgments
- Detects significant cognitive score changes
- Routes alerts to appropriate caregivers via configured channels
- Maintains alert delivery audit trail

### 4.4 FHIR Gateway

HL7 FHIR R4 integration service:

- Transforms internal data models to FHIR R4 resources
- Validates resources against FHIR R4 profiles
- Supports Patient, Observation, and MedicationStatement resources
- Provides FHIR-compliant REST endpoints for EHR integration

## 5. Data Flow Diagrams

### 5.1 Patient Cognitive Assessment Flow

```
Patient Device -> API Server -> Cognitive Engine (score calculation)
                                     |
                                     v
                              PostgreSQL (exercise results, scores)
                                     |
                                     v
                              Analytics Package (trend analysis)
                                     |
                     +---------------+---------------+
                     |               |               |
                     v               v               v
              Caregiver Alert   Clinical Report   FHIR Export
              (if decline)      (on demand)       (to EHR)
```

### 5.2 Medication Reminder Flow

```
Scheduled Trigger -> API Server -> Notification Service -> Patient Device
                                                              |
                                        [acknowledged?]-------+
                                              |           |
                                             YES          NO (timeout)
                                              |           |
                                              v           v
                                        Log adherence   Escalate to caregiver
```

### 5.3 Real-Time Alert Flow

```
Wearable Device -> API Server -> Alert Engine -> Priority Classification
                                                       |
                                        +--------------+--------------+
                                        |              |              |
                                        v              v              v
                                  Push Notification   SMS          Email
                                        |
                                        v
                                  Acknowledgment Tracking
```

## 6. Data Architecture

### 6.1 Primary Database (PostgreSQL)

- Patient demographics and clinical metadata
- Exercise results with full audit trail (prompt, answer, timing, score, feedback)
- Medication schedules and adherence records
- Session data and cognitive scores
- User accounts and RBAC permissions
- Tenant configuration
- Audit logs (21 CFR Part 11 compliant)

### 6.2 Graph Database (Neo4j)

- Patient-caregiver relationship networks
- Family connections and care team structures
- Memory associations for identity exercises

### 6.3 Cache Layer (Redis)

- Session tokens and rate limiting
- Real-time alert state management
- Pub/sub for alert engine communication

## 7. Security Architecture

### 7.1 Authentication

- JWT access tokens (15-minute expiry) with RS256 signing
- Refresh token rotation with secure HTTP-only cookies
- Multi-factor authentication support
- Biometric authentication on mobile (Face ID / Touch ID)

### 7.2 Authorization

- Role-Based Access Control (RBAC) with five roles: Patient, Caregiver, Clinician, Admin, SuperAdmin
- Resource-level permissions (e.g., a caregiver can only view assigned patients)
- Tenant isolation enforced at the database query layer
- All authorization decisions logged for audit

### 7.3 Data Protection

- AES-256 encryption at rest for all PHI in PostgreSQL
- TLS 1.3 for all data in transit
- Field-level encryption for highly sensitive data (SSN, insurance IDs)
- Automatic PHI redaction in application logs

### 7.4 Tenant Isolation

- Each tenant has a unique identifier enforced on every database query
- Row-level security policies in PostgreSQL
- API middleware validates tenant context on every request
- Cross-tenant data access is architecturally impossible without bypassing the ORM layer

## 8. Deployment Architecture

### 8.1 Web Applications

- **Platform:** Vercel
- **Strategy:** Immutable deployments with instant rollback
- **Environments:** Production, Staging, Preview (per pull request)

### 8.2 Mobile Applications

- **Platform:** Expo Application Services (EAS)
- **Distribution:** Apple App Store, Google Play Store
- **Updates:** Over-the-air updates for JavaScript bundles via EAS Update

### 8.3 Backend Services

- **Platform:** Kubernetes (managed)
- **Strategy:** Rolling deployments with health checks
- **Scaling:** Horizontal pod autoscaling based on CPU and request latency
- **Database:** Managed PostgreSQL with automated backups and point-in-time recovery

### 8.4 Environments

| Environment | Purpose | Data |
|-------------|---------|------|
| Development | Local development | Synthetic data |
| Staging | Pre-release validation | Anonymized data |
| Production | Live system | Real PHI (encrypted) |

## 9. Reliability and Fault Tolerance

- Database: Multi-AZ deployment with automated failover
- API: Multiple replicas behind load balancer with health checks
- Alerts: Retry with exponential backoff for failed notification delivery
- Offline: Mobile app queues data locally when connectivity is lost
- Monitoring: Application performance monitoring with alerting on error rate spikes

## 10. Interfaces

### 10.1 External Interfaces

| Interface | Protocol | Purpose |
|-----------|----------|---------|
| FHIR R4 REST API | HTTPS | EHR integration |
| Apple Push Notification Service | HTTPS | iOS push notifications |
| Firebase Cloud Messaging | HTTPS | Android push notifications |
| Twilio API | HTTPS | SMS delivery |
| SendGrid API | HTTPS | Email delivery |

### 10.2 Internal Interfaces

All internal service communication uses authenticated HTTPS with mutual TLS. Inter-service communication follows request-response patterns via REST APIs and event-driven patterns via Redis pub/sub.

## 11. Document References

| Document | Location |
|----------|----------|
| Software Development Plan | `docs/iec-62304/software-development-plan.md` |
| Requirements Specification | `docs/iec-62304/requirements-specification.md` |
| Risk Management Plan | `docs/iso-14971/risk-management-plan.md` |
| Cybersecurity Risk Assessment | `docs/cybersecurity/security-risk-assessment.md` |
