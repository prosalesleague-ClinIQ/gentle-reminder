# FDA SaMD Regulatory Roadmap

## Phase 1 (Complete) - Foundation

Built-in regulatory preparation:

- Granular audit trail (ExerciseResult records prompt, answer, timing, feedback)
- Versioned database migrations (Prisma numbered migrations)
- Deterministic scoring (no randomness in evaluation logic)
- Role-based data access separation
- HIPAA-aware architecture design

## Phase 2 (Complete) - Pre-Submission Documentation

### IEC 62304 Software Lifecycle

- [Software Development Plan](iec-62304/software-development-plan.md) -- Class B device, lifecycle model, tools, SOUP, verification strategy
- [Requirements Specification](iec-62304/requirements-specification.md) -- Functional, performance, safety, and security requirements
- [Architecture Design](iec-62304/architecture-design.md) -- System decomposition, data flows, security architecture, deployment

### ISO 14971 Risk Management

- [Risk Management Plan](iso-14971/risk-management-plan.md) -- Risk acceptability matrix, risk management activities, residual risk evaluation
- [Hazard Analysis (FMEA)](iso-14971/hazard-analysis-fmea.md) -- 8 hazards with severity, probability, detectability, RPN, mitigations

### Quality Management System

- [Quality Manual](qms/quality-manual.md) -- Quality policy, design controls, CAPA, complaint handling, document control, training

### Cybersecurity

- [Security Risk Assessment](cybersecurity/security-risk-assessment.md) -- STRIDE threat model for full system
- SBOM generation: `scripts/generate-sbom.sh` (CycloneDX format)

### Clinical Validation

- [Study Protocol](clinical-validation/study-protocol.md) -- 200 patients, 3 sites, 6 months, MMSE/MoCA correlation study

### Algorithm Transparency

- [Cognitive Scoring](algorithm-transparency/cognitive-scoring.md) -- 6 domains, equal weights, 0-100 scale, adaptive difficulty, decline detection

### Labeling

- [Indications for Use](labeling/indications-for-use.md) -- Intended use, population (65+ mild-to-moderate dementia), contraindications, warnings

## Phase 2 (Complete) - Post-Market Surveillance Implementation

- Post-market surveillance service: `services/api/src/services/postMarketSurveillance.ts`
- Surveillance API endpoints: `services/api/src/routes/surveillance.routes.ts`
  - `GET /api/surveillance/report` -- Safety report generation
  - `POST /api/surveillance/accuracy` -- Algorithm accuracy tracking
  - `POST /api/surveillance/complaint` -- Complaint reporting
  - `GET /api/surveillance/drift` -- Algorithm drift detection
- Algorithm transparency API: `packages/cognitive-engine/src/transparency.ts`
  - `explainScore()` -- Human-readable score breakdown
  - `explainDifficulty()` -- Difficulty level explanation
  - `getAlgorithmVersion()` -- Algorithm version information

## Phase 3 - FDA De Novo or 510(k)

- Clinical study data collection (per study protocol)
- Predicate device identification
- Software documentation package assembly
- FDA pre-submission meeting
- De Novo classification request or 510(k) submission

## Classification

Target: Class II SaMD (Software as a Medical Device)
Risk level: Medium (cognitive monitoring, not diagnosis)
Pathway: De Novo classification or 510(k) with predicate

## Key Regulatory Standards

- IEC 62304 (Software lifecycle)
- ISO 14971 (Risk management)
- ISO 13485 (Quality management systems)
- 21 CFR Part 11 (Electronic records)
- 21 CFR Part 820 (Quality system regulation)
- IEC 82304 (Health software)
- HIPAA (Health information privacy)
- HL7 FHIR R4 (Clinical data exchange)
