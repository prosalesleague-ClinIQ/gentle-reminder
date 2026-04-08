# Software Development Plan

**Document ID:** SDP-001
**IEC 62304 Reference:** Clause 5 - Software Development Process
**Software Safety Classification:** Class B
**Version:** 1.0
**Effective Date:** 2026-04-06
**Author:** Regulatory Affairs

---

## 1. Purpose

This Software Development Plan defines the lifecycle activities, deliverables, and verification strategies for the Gentle Reminder cognitive health monitoring platform, classified as a Class B Software as a Medical Device (SaMD) under IEC 62304:2006/AMD1:2015.

## 2. Scope

The plan covers all software components of Gentle Reminder:

- Mobile applications (iOS, Android, watchOS)
- Web applications (patient portal, caregiver dashboard, admin panel, clinical portal)
- Backend services (API server, FHIR integration, real-time alert engine)
- Shared packages (cognitive engine, scoring algorithms, auth, shared types)

## 3. Software Safety Classification

**Classification: Class B** -- Software system that can contribute to a hazardous situation which could result in non-serious injury.

Rationale: Gentle Reminder provides cognitive monitoring and medication reminders. Incorrect cognitive scores or missed medication reminders could delay clinical intervention but are not expected to directly cause serious injury or death. The system is intended as a supplementary clinical tool, not a primary diagnostic device.

## 4. Lifecycle Model

The project follows an iterative incremental lifecycle model adapted for continuous delivery:

| Phase | Activities | Deliverables |
|-------|-----------|-------------|
| Planning | Requirements analysis, risk assessment | SDP, SRS, Risk Management Plan |
| Architecture | System/software design | Architecture Design Document |
| Implementation | Coding, unit testing | Source code, unit test results |
| Verification | Integration testing, system testing | Test reports, traceability matrix |
| Release | Validation, deployment | Release notes, deployment records |
| Maintenance | Post-market surveillance, CAPA | Surveillance reports, CAPA records |

## 5. Development Environment and Tools

### 5.1 Programming Languages

| Language | Component | Version |
|----------|-----------|---------|
| TypeScript | All web/server code | 5.x |
| Python | ML pipeline, analytics | 3.11+ |
| Swift | watchOS app, iOS native modules | 5.9+ |
| SQL | Database queries | PostgreSQL 15 |
| Cypher | Graph queries | Neo4j 5.x |

### 5.2 Frameworks and Runtime

| Tool | Purpose | Version |
|------|---------|---------|
| React Native / Expo | Mobile applications | SDK 51+ |
| Next.js | Web applications | 14.x |
| Express.js | API server | 4.x |
| Prisma | ORM / database migrations | 5.x |

### 5.3 Build and Configuration Management

| Tool | Purpose |
|------|---------|
| Git | Version control (all source, configs, documentation) |
| Turborepo | Monorepo build orchestration |
| GitHub Actions | CI/CD pipeline |
| EAS Build | Mobile app builds |
| Vercel | Web application deployment |

### 5.4 Configuration Management

- All source code is version-controlled in a Git monorepo
- Branching strategy: trunk-based development with short-lived feature branches
- All merges require pull request review by at least one qualified reviewer
- Database schema changes managed through numbered Prisma migrations
- Semantic versioning (MAJOR.MINOR.PATCH) for all released packages
- Build artifacts are tagged with Git commit SHA for traceability

## 6. SOUP (Software of Unknown Provenance)

The following SOUP items are used in safety-relevant contexts:

| SOUP Component | Version | Purpose | Risk Assessment | Verification |
|----------------|---------|---------|----------------|--------------|
| React Native | 0.74+ | Mobile UI framework | Medium -- UI rendering errors could display incorrect scores | Integration tests verify score display accuracy |
| Express.js | 4.x | HTTP server | Low -- well-established, extensive CVE tracking | Dependency scanning via npm audit |
| Prisma | 5.x | Database ORM | Medium -- data integrity depends on correct query generation | Migration tests, query result verification |
| jsonwebtoken | 9.x | Authentication tokens | High -- auth bypass could expose PHI | Security testing, token validation tests |
| bcrypt | 5.x | Password hashing | High -- weak hashing could compromise credentials | Algorithm verification, known-answer tests |
| @react-native-community/netinfo | 11.x | Network status detection | Medium -- false offline status could delay alerts | Integration tests on various network states |
| expo-notifications | 0.28+ | Push notification delivery | High -- failed delivery could miss critical medication reminders | End-to-end alert delivery tests |
| ioredis | 5.x | Real-time caching and pub/sub | Medium -- cache failures could affect alert latency | Failover and timeout testing |
| zod | 3.x | Input validation | Medium -- validation bypass could allow malformed data | Schema validation unit tests |
| neo4j-driver | 5.x | Graph database client | Low -- relationship queries for family/care networks | Query result verification tests |

All SOUP items are tracked in `package.json` files with pinned versions. Dependency updates follow a review and regression testing process before promotion to production.

## 7. Verification Strategy

### 7.1 Unit Testing

- **Framework:** Jest with TypeScript support
- **Coverage target:** 80% line coverage for safety-critical modules (cognitive engine, scoring, alert delivery)
- **Scope:** All scoring functions, exercise evaluation logic, alert routing, authentication

### 7.2 Integration Testing

- **Framework:** Jest with Supertest for API testing
- **Scope:** API endpoint correctness, database operations, FHIR data exchange, inter-service communication
- **Environment:** Test database with seeded data, mock external services

### 7.3 End-to-End Testing

- **Framework:** Playwright (web), Detox (mobile)
- **Scope:** Critical user journeys -- exercise completion, medication reminder flow, caregiver alert receipt, score viewing
- **Execution:** Automated in CI pipeline on every pull request

### 7.4 Security Testing

- Automated dependency vulnerability scanning (npm audit, Snyk)
- Static analysis for common vulnerability patterns
- Authentication and authorization boundary testing
- PHI data exposure testing

### 7.5 Traceability

Each requirement in the Software Requirements Specification is traced to:
1. Design elements in the Architecture Design Document
2. Implementation modules in source code
3. Verification test cases with pass/fail results

## 8. Risk Management Integration

Software development activities integrate with the Risk Management Plan (ISO 14971). Risk control measures identified in the Hazard Analysis are implemented as software requirements and verified through targeted test cases. See `docs/iso-14971/risk-management-plan.md`.

## 9. Problem Resolution

Software problems (bugs, anomalies, CAPA items) are tracked in the issue tracking system with the following severity levels:

| Severity | Description | Response Time |
|----------|-------------|---------------|
| Critical | Safety-related defect, PHI exposure | Immediate hotfix, 24-hour resolution target |
| Major | Feature failure affecting clinical workflow | 72-hour resolution target |
| Minor | Cosmetic or low-impact defect | Next scheduled release |

## 10. Maintenance Plan

### 10.1 Post-Release Activities

- Continuous monitoring of algorithm accuracy via post-market surveillance system
- Automated anomaly detection for cognitive scoring drift
- Monthly dependency vulnerability scanning and patching
- Quarterly review of complaint data and adverse event reports

### 10.2 Change Control

All changes to released software follow the change control process:
1. Change request documented with rationale and risk assessment
2. Impact analysis covering affected requirements, design, and tests
3. Implementation with full regression testing
4. Review and approval before release

## 11. Document References

| Document | Location |
|----------|----------|
| Requirements Specification | `docs/iec-62304/requirements-specification.md` |
| Architecture Design | `docs/iec-62304/architecture-design.md` |
| Risk Management Plan | `docs/iso-14971/risk-management-plan.md` |
| Hazard Analysis (FMEA) | `docs/iso-14971/hazard-analysis-fmea.md` |
| Quality Manual | `docs/qms/quality-manual.md` |
| Cybersecurity Risk Assessment | `docs/cybersecurity/security-risk-assessment.md` |
