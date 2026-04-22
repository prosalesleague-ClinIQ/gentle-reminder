# Inventor Disclosure — Gentle Reminder Health Corp Patent Portfolio

**Compiled:** 2026-04-22 from git-commit evidence
**Status:** DRAFT — user to verify inventor list per patent before any filing
**Purpose:** Close fortress IP-Moat Weakness #3 (`[TBD]` inventors blocking every filing)

---

## Conception date methodology

For each of the 23 provisional patent drafts, the **conception date** is set to the date the draft was first committed to git (`git log --reverse --format="%ai" -- <file>`). These dates are further corroborated by the OpenTimestamps `.ots` proofs anchored to Bitcoin at the time of commit (see `docs/ip-protection/01-cryptographic-timestamping.md`).

All 23 drafts share the same first-commit date (**2026-04-17 14:46:10 -0700**, commit `2e78f2e`) because they were introduced as a cohesive IP-portfolio in a single commit. This is the legally binding conception date for provisional-patent purposes.

**If any invention was actually conceived earlier** — e.g., during the 53K-LOC codebase development — that earlier date can be claimed instead by citing the specific earlier commit that implements the technique. For each of the tier-1 patents, the corresponding source file (cited in each IP draft's "Reference Implementation" section) has its own `git log --follow` history that establishes an earlier reduction-to-practice date.

---

## Inventor designation — user to confirm

The default proposed inventor per patent is **Christopher McPherson** (sole inventor). Any co-inventor must have made an **inventive contribution** to at least one claim, not merely helped with implementation or testing. Per 35 U.S.C. § 116, co-inventors must all sign the oath/declaration.

Verify each tier below against the four team members (per `CLAUDE.md`):
- **Christopher McPherson** (founder, CEO/COO)
- **Leo Kinsman** (CTO)
- **Chris Hamel** (CFO)
- **Jayla Patzer** (National Director Clinic & Provider Partnerships)

Rule of thumb: **Christopher McPherson = sole inventor on every draft** is the most likely correct answer for a pre-seed, pre-team-formation portfolio drafted in a single sitting. If Leo, Chris, or Jayla contributed specific inventive claims (not just discussions, not just code help), add them per-patent below.

---

## Per-patent inventor + conception data

Every entry is pre-populated; **user to confirm inventor list** before signing each IAA and filing each provisional.

### Tier 1 — Core Mechanics

| # | Title | File | Conception Date | Proposed Inventor(s) |
|---|-------|------|:---------------:|----------------------|
| 01 | Three-State Positive-Only Feedback | tier-1/01-gentle-feedback-scoring.md | 2026-04-17 | Christopher McPherson |
| 02 | Asymmetric Adaptive Difficulty Engine | tier-1/02-adaptive-difficulty-engine.md | 2026-04-17 | Christopher McPherson |
| 03 | Dementia-Adapted Spaced Repetition | tier-1/03-dementia-spaced-repetition.md | 2026-04-17 | Christopher McPherson |
| 04 | Multimodal Cognitive State Classifier | tier-1/04-multimodal-cognitive-state.md | 2026-04-17 | Christopher McPherson |
| 05 | Dementia-Specific Speech Emotion | tier-1/05-dementia-speech-emotion.md | 2026-04-17 | Christopher McPherson |

### Tier 2 — Biomarkers + Detection

| # | Title | File | Conception Date | Proposed Inventor(s) |
|---|-------|------|:---------------:|----------------------|
| 06 | Sundowning Detection | tier-2/06-sundowning-detection.md | 2026-04-17 | Christopher McPherson |
| 07 | Composite Biomarker Engine | tier-2/07-composite-biomarker-engine.md | 2026-04-17 | Christopher McPherson |
| 08 | Multi-Window Decline Detection | tier-2/08-multi-window-decline-detection.md | 2026-04-17 | Christopher McPherson |
| 09 | Speech Hesitation Biomarker | tier-2/09-speech-hesitation-biomarker.md | 2026-04-17 | Christopher McPherson |
| 10 | Response Time Biomarker | tier-2/10-response-time-biomarker.md | 2026-04-17 | Christopher McPherson |
| 11 | 8-Feature Decline Predictor ML | tier-2/11-decline-predictor-ml.md | 2026-04-17 | Christopher McPherson |
| 12 | Algorithm Transparency for SaMD | tier-2/12-algorithm-transparency.md | 2026-04-17 | Christopher McPherson |

### Tier 3 — Platform / Infrastructure

| # | Title | File | Conception Date | Proposed Inventor(s) |
|---|-------|------|:---------------:|----------------------|
| 13 | Post-Market Surveillance | tier-3/13-post-market-surveillance.md | 2026-04-17 | Christopher McPherson |
| 14 | Voice Companion System | tier-3/14-voice-companion-system.md | 2026-04-17 | Christopher McPherson |
| 15 | Music Therapy Engine | tier-3/15-music-therapy-engine.md | 2026-04-17 | Christopher McPherson |
| 16 | Enforced Dementia UX | tier-3/16-enforced-dementia-ux.md | 2026-04-17 | Christopher McPherson |
| 17 | Multi-Tenant Clinical Isolation | tier-3/17-multi-tenant-clinical-isolation.md | 2026-04-17 | Christopher McPherson |
| 18 | CFR Part 11 Hash-Chain Audit | tier-3/18-cfr11-hash-chain-audit.md | 2026-04-17 | Christopher McPherson |
| 19 | Adaptive Response Policies | tier-3/19-adaptive-response-policies.md | 2026-04-17 | Christopher McPherson |
| 20 | Wearable Health Processing | tier-3/20-wearable-health-processing.md | 2026-04-17 | Christopher McPherson |
| 21 | FHIR Dementia Extensions | tier-3/21-fhir-dementia-extensions.md | 2026-04-17 | Christopher McPherson |
| 22 | Pure TS Statistical Engine | tier-3/22-pure-ts-statistical-engine.md | 2026-04-17 | Christopher McPherson |
| 23 | Circadian Biomarkers | tier-3/23-circadian-biomarkers.md | 2026-04-17 | Christopher McPherson |

---

## What this unblocks

- **Weakness #3 (inventors `[TBD]`):** every draft now has a concrete proposed inventor. Filing is no longer blocked on "who do we name?"
- **Weakness #4 (conception date):** extracted from git-commit evidence for every draft.
- **IP-Moat time-to-non-provisional axis (capped at 3/10):** once attorney is engaged + this doc is signed, cap lifts.
- **Attorney engagement letter:** attorney needs this doc + a signed Invention Assignment Agreement per named inventor before filing.

## Next actions (sequenced)

1. User confirms: are all 23 drafts sole-inventor Christopher McPherson? (If yes → sign 1 IAA, file 23 filings against 1 oath each. If co-inventors exist for specific drafts → list per-patent + sign per-inventor IAAs.)
2. User engages patent attorney (Carr & Ferrell, Shay Glenn LLP, or Carson/Wojcik/Miller IP per outreach list) — fixed-fee $500-$1,500 per provisional.
3. User signs Invention Assignment Agreement (`docs/legal/ip-assignment-agreement-template.md`) assigning all 23 inventions to Gentle Reminder Health Corp.
4. Provisional filings begin on schedule per `docs/ip/ip-moat-eval-2026-04-22.md` §11 — start with the 6 FILE-NOW tier-1 + IP #06.

## Related

- `docs/ip/INVENTOR-DISCLOSURE.md` — original `[TBD]` template (retain for attorney-filled version).
- `docs/legal/ip-assignment-agreement-template.md` — IAA template (FIAA-001).
- `docs/legal/formation/founder-ip-assignment-filled.md` — founder IP assignment (already drafted, pending Cert + signature).
- `docs/ip-protection/01-cryptographic-timestamping.md` — OTS anchors corroborating conception dates.
- `docs/ip-protection/GPG-SIGNING-RUNBOOK.md` — GPG setup to sign future IP-related commits.
