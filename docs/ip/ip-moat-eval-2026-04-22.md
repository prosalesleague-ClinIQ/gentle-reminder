# IP Moat Evaluation — Gentle Reminder Health Corp

**Date:** 2026-04-22
**Scope:** 23-patent provisional portfolio + defensive-measures stack
**Method:** 10-axis weighted scorecard via `/fortress-audit` companion agent
**Auditor context:** Pre-seed, $5M seed raise imminent. Investors will press on defensibility.

---

## 1. Executive summary

Gentle Reminder Health Corp has assembled a **substantial but unfiled** 23-patent provisional portfolio covering dementia-care AI. Every draft has titled claims, enabling-disclosure numeric parameters, reference code paths, and at least one independent + dependent claim set. A formal prior-art search file exists (`docs/ip/PRIOR-ART-SEARCH.md`), a scoped defensive-measures stack is documented (OpenTimestamps `.ots` files on all 23 drafts + manifest), and the portfolio is logically tiered into core / biomarkers / platform.

The moat is almost entirely **latent**: zero provisionals filed with USPTO; entity formation in-flight (Cert drafted, not yet executed); no patent attorney engaged; inventors `[TBD]` across all 23 drafts; no TM, no copyright, **no GPG-signed git commits** despite a full setup doc. Only OpenTimestamps is executed.

Core tier-1 inventions are legitimately non-trivial: IP #01 three-state feedback architecture, IP #02 asymmetric comfort zone, IP #06 sundowning detector, IP #23 midnight-discontinuity bedtime normalization. Broad tier-3 claims (multi-tenant SaaS, FHIR extensions, hash-chain audit, pure-TS stats) read on extensive prior art and are candidly flagged by the team's own PRIOR-ART-SEARCH as "LOW novelty — consider trade secret."

**FINAL_IP_MOAT_SCORE: 56 / 100**
**IP_MOAT_TIER: DEFENSIBLE** (low end; would lift to 70-75 within 90 days of filing execution)
**TOP_IP_ASSET:** IP #01 — Three-State Positive-Only Feedback System (`docs/ip/tier-1/01-gentle-feedback-scoring.md`). 17k-word spec, 12 claims, no direct prior-art patent identified. Architectural separation of patient-feedback channel from clinician data channel blocks Cogstate / Akili / Lumosity / Neurotrack in dementia-adapted cognitive assessment.
**TOP_IP_GAP:** Zero filings + inventors `[TBD]` on every draft + unsigned git commits + no TM + no copyright. Moat is a document library, not an enforceable right.

**Bottom line:** credible, well-organized *patent plan* with strong defensive instincts, not a filed portfolio. Value is in the clean runway to file. Core tier-1 concepts have real blocking power if filed promptly.

---

## 2. Moat scorecard (100 pts)

| # | Axis | Score /10 | Justification |
|---|------|----------:|---------------|
| 1 | Breadth | 7 | 23 distinct inventions spanning scoring, biomarkers, UX, regulatory, interop. Covers most of product value surface. Only USPTO targeted (1 jurisdiction). |
| 2 | Depth per claim | 6 | Tier-1 claims are well-delimited with layered dependents; tier-3 collapses to omnibus Claim 1 with "Claims 2-5: standard" placeholder. |
| 3 | Prior art posture | 6 | PRIOR-ART-SEARCH.md populated with 23 per-IP analyses citing specific patent numbers (Akili US9,610,051; Sonde US10,672,396; Linus US10,796,805; Cogstate US7,761,314). No professional search retained. |
| 4 | Commercial relevance | 8 | Every IP maps to a concrete codebase path. Tier-1 protects revenue-bearing feature surface. Tier-3 mostly protects infra that could be trade-secret instead. |
| 5 | Enablement / RTP | 7 | Tier-1 specs 4-8k words with pseudocode + parameter tables. Tier-3 ~2-3k words thinner. **Cap triggered on tier-3; total capped at 7.** |
| 6 | Freedom-to-operate risk | 5 | No FTO analysis. IP #17 (multi-tenant) vs Salesforce US7,299,240 and IP #20 (wearables) vs Apple HealthKit are obvious blocking risks. |
| 7 | Geographic coverage | 4 | US provisionals only. PCT pathway documented but not funded. No EU/JP/CN filings planned within 12mo. |
| 8 | Time-to-non-provisional | 3 | **Cap triggered:** no attorney engaged, no funded budget. 12-month clock doesn't start until filing. |
| 9 | Portfolio construction | 7 | Explicit tiering (5 core / 7 biomarker / 11 platform). Picket-fence around cognitive-engine (IPs #01/#02/#03/#04/#12). Tier-3 dilutes average. |
| 10 | Defensive measures | 3 | **Cap triggered:** no TM filed, no copyright registered. OTS done (27 .ots files). Git signing documented but **all recent commits unsigned** (`%G?` = N). |

**Caps evaluated:**
- "PRIOR-ART-SEARCH populated caps total at 69" — NOT triggered (file is substantive) ✅
- "Spec <2 pages / no figures / no pseudocode caps enablement at 5/10" — partial trigger on tier-3; capped to 7 (tier-1 compensates).
- "Claim reads directly on prior art → novelty cap 3/10, total 59" — NOT triggered (no element-for-element reads) ✅
- "No TM AND no copyright caps defensive-measures at 4/10" — TRIGGERED (axis 10 = 3, under cap)
- "No filing budget / attorney caps time-to-non-provisional at 3/10" — TRIGGERED (axis 8 = 3, at cap)

**FINAL TOTAL: 56 / 100**

---

## 3. Portfolio map

### Tier 1 — Core mechanics (5 patents) — **FILE ALL 5 IMMEDIATELY**

Architectural scoring/adaptation primitives unique to the dementia population.

| # | Title | Strength | Weakness |
|---|-------|----------|----------|
| 01 | Three-State Positive-Only Feedback | Strongest spec in portfolio (17k words, 12 claims, clinical lit citations). Novel architectural split of patient-facing vs clinician data channels. | Claim 1 step (c) "classifying into exactly one of three states" — design-around via 4 states. |
| 02 | Asymmetric Adaptive Difficulty | Specific non-obvious combination (2-fail / 4-success / 70-85% target). | Symmetric adaptive testing is well-patented (Akili, Lumosity) — asymmetry is the only delta. |
| 03 | Dementia-Adapted SM-2 | Five specific parameter changes from SM-2 baseline. | SM-2 is public; "parameter patents" are weaker. |
| 04 | Multimodal Cognitive State Classifier | Weight-redistribution + dual-factor confidence is novel combination. | Affectiva US8,219,438 is crowded space. |
| 05 | Dementia-Specific Speech Emotion | Keyword dictionaries + elderly-tuned acoustic thresholds. | Keywords arguably abstract under Alice; dictionary contents kept as trade secret. |

**Tier-1 score: 8/10** (structural), blocked on inventor/date completion.

### Tier 2 — Biomarkers + detection (7 patents) — **FILE 2, STRENGTHEN 4, DROP 1**

- **File-ready:** #06 (Sundowning — no direct prior art), #07 (Composite biomarker engine — medication inversion is unique).
- **Strengthen:** #08, #09, #10, #11 — spec depth < 4 pages, rely on numeric combination for novelty.
- **Drop:** #12 (Algorithm Transparency SaMD) — trade-secret instead.

**Tier-2 score: 6/10** (uneven).

### Tier 3 — Platform / infra (11 patents) — **FILE 3, DROP 8**

- **File:** #14 (Voice Companion protocol), #15 (Music Therapy fade-out + circadian), #23 (Circadian biomarkers — midnight-discontinuity).
- **Strengthen or drop:** #13 (Post-market surveillance), #19 (Response policies).
- **Drop outright (trade-secret or standard):** #12, #16, #17, #18, #20, #21, #22.

**Tier-3 score: 4/10.**

---

## 4. Patent-by-patent verdict table

| # | Title | Enablement | Closest prior art | Rec |
|---|-------|:----------:|-------------------|:---:|
| 01 | Three-State Positive Feedback | Strong | MMSE/MoCA, Cogstate US7,761,314 | **FILE NOW** |
| 02 | Asymmetric Adaptive Difficulty | Strong | Akili US9,610,051, Lumosity US9,536,427 | **FILE NOW** |
| 03 | Dementia-Adapted SM-2 | Strong | Wozniak SM-2, Duolingo US9,904,676 | **FILE NOW** |
| 04 | Multimodal Cognitive State | OK | Affectiva US8,219,438 | **FILE NOW** |
| 05 | Dementia Speech Emotion | OK | Sonde US10,672,396, Beyond Verbal US10,152,988 | **FILE NOW** |
| 06 | Sundowning Detection | OK | No direct prior-art patent | **FILE NOW** |
| 07 | Composite Biomarker Engine | OK | Evidation US10,943,696 | **FILE (after FTO)** |
| 08 | Multi-Window Decline | OK | Apple US10,278,630 | **FILE (after FTO)** |
| 09 | Speech Hesitation Biomarker | Thin | Sonde US10,672,396 | **STRENGTHEN** |
| 10 | Response Time Biomarker | Thin | Cogstate reaction-time patents | **STRENGTHEN** |
| 11 | 8-Feature Decline Predictor | Thin | Biogen BioPrint (pending) | **STRENGTHEN** |
| 12 | Algorithm Transparency SaMD | Thin | LIME/SHAP (open-source) | **DROP** (trade secret) |
| 13 | Post-Market Surveillance | Thin | FDA guidance docs | **STRENGTHEN** |
| 14 | Voice Companion | OK | Resemble US11,222,621 | **FILE** |
| 15 | Music Therapy Circadian | OK | Music Health US11,127,416 | **FILE** |
| 16 | Enforced Dementia UX | Thin | WCAG AAA (public) | **DROP** (trade secret) |
| 17 | Multi-Tenant Clinical Isolation | Thin | Salesforce US7,299,240 | **DROP** (trade secret) |
| 18 | CFR Part 11 Hash-Chain | Thin | Merkle-tree audit | **DROP** (trade secret) |
| 19 | Adaptive Response Policies | Thin | Woebot US11,087,094 | **STRENGTHEN** |
| 20 | Wearable Health Processing | Thin | Apple HealthKit portfolio | **DROP** (FTO risk) |
| 21 | FHIR Dementia Extensions | Thin | HL7 FHIR (public) | **DROP** (contribute to standard) |
| 22 | Pure TS Statistical Engine | Thin | jStat, simple-statistics (MIT) | **DROP** (defensive publish on arXiv) |
| 23 | Circadian Biomarkers | OK | Fitbit/Oura sleep patents | **FILE** |

**Revised filing count: 13-16 provisionals** ($3.9k-$4.8k micro-entity USPTO fees + attorney $6.5k-$24k).
**Dropped: 7** (saves $2.1k in USPTO fees + ~$5k-$17k in attorney review).
**Defensive publication:** #22 on arXiv = $0-cost blocker.

---

## 5. Prior-art posture

**Strengths:**
- PRIOR-ART-SEARCH.md is 18k words, populated with 23 per-IP analyses.
- Specific patent numbers cited: Cogstate US7,761,314 + US8,708,702; Akili US9,610,051 + US10,176,544; Lumosity US9,536,427; Sonde US10,672,396; Beyond Verbal US10,152,988; Affectiva US8,219,438; Linus Health US10,796,805; Evidation US10,943,696; Music Health US11,127,416; Voiceitt US10,878,801; Resemble US11,222,621; Salesforce US7,299,240; Snowflake US10,331,655; Apple US10,278,630; Woebot US11,087,094; Duolingo US9,904,676.
- Novelty candidly rated HIGH / MEDIUM / LOW.

**Weaknesses:**
- **No professional prior-art search performed.** Self-searches are subject to bias.
- **Missing competitor patents that investors will cite:**
  - Dthera Sciences (narrative therapy / reminiscence)
  - Cognito Therapeutics (40Hz gamma for Alzheimer's, heavily patented)
  - Kardia / AliveCor (cardiac biomarker overlap with sigma-based anomaly detection)
  - Neurotrack US9,861,308 + US10,485,459 (eye-tracking cognitive assessment)
  - Biofourmis (adjacent patient-monitoring — not cited at all)

**Posture score: 6/10.**

---

## 6. Freedom-to-operate risk

**No FTO analysis performed.** Biggest IP-related investor risk.

FTO concerns flagged:
1. **IP #17 (Multi-Tenant) vs Salesforce US7,299,240:** thin veneer implementation. **Trade-secret; abandon patent attempt.**
2. **IP #20 (Wearable) vs Apple HealthKit + Fitbit:** Apple has hundreds of patents on HealthKit. iOS commercialization = implicit license risk. **Defer; commission FTO opinion.**
3. **IP #11 (8-feature decline predictor) vs Biogen BioPrint:** Biogen/Eisai active in dementia digital biomarkers. Continuation-in-part risk.
4. **IP #03 (Dementia SM-2) vs Duolingo US9,904,676:** Duolingo's Half-Life Regression is narrower but claim scope should be reviewed.
5. **IP #14 (Voice Companion) vs Sonantic WO2021/108,555 + Resemble US11,222,621:** voice cloning foundation patents. Therapeutic-application patent likely clear; contract risk via ElevenLabs ToS.

**FTO budget recommendation:** $15k-$30k for attorney-led FTO on IP #01-#08 before non-provisional conversion. Funded from seed round.

**FTO score: 5/10.**

---

## 7. Geographic strategy

- **Current:** US provisional-only plan.
- **Gaps:** EU (EPO), UK, Japan (JPO — largest per-capita dementia market), China (CNIPA), Canada (CIPO).
- **Trademark geo:** US only Class 9 + 44. Madrid Protocol deferred "Year 2+" — **squatter risk on "Gentle Reminder" in EU/UK**.

**Recommendation:**
- File PCT at month 11 post-US-provisional ($4-6k).
- Pre-fund national-phase in EPO + JP + UK + CA ($100k-$200k) from seed round.
- File Madrid Protocol TM immediately post-US TM issuance (not "Year 2+").

**Geographic score: 4/10.**

---

## 8. Defensive measures

| Measure | Documented | Executed | Evidence |
|---------|:----------:|:--------:|----------|
| OpenTimestamps (OTS) | ✅ | ✅ | 27+ `.ots` files present on all 23 IP drafts + manifest. Bitcoin-anchored priority evidence. |
| GPG-signed git commits | ✅ (setup doc) | **❌** | `git log --pretty="%G?"` returns "N" on all 10 recent commits. **CRITICAL GAP. 30-min fix.** |
| US Copyright registration | ✅ | ❌ | No eCO account, no Batch 1 filings. |
| USPTO Trademark | ✅ | ❌ | TESS search not documented; `docs/legal/trademark-search-results/` empty. No SN. |
| Defensive publication | ✅ | ❌ | Applicable to IP #22 (pure-TS stats). |
| USPTO provisional patents | 23 drafts | ❌ | No filings, no attorney, inventors `[TBD]`. |
| Trade-secret policy | Partial | Partial | Numeric thresholds flagged; NDA discipline mixed. |
| Invention Assignment Agreement | Template exists | ❌ | No inventor signed. |

**Defensive score: 3/10 (capped at 4).**

---

## 9. Top 5 strengths (what investors will love)

1. **Rare patent-plan depth for pre-seed.** 23 drafts with titled claims + pseudocode + parameter tables + reference code paths. Most pre-seed healthtechs have 0-2. Signals seriousness.
2. **Clear picket-fence around the cognitive engine.** Tier-1 #01/#02/#03/#04/#05 reinforce each other — infringing any one likely triggers claims on 2-3 others.
3. **OTS cryptographic timestamping on all 23 drafts.** Low-cost, high-value defensive layer. Bitcoin-anchored tamper-evident priority evidence. Rare pre-filing.
4. **Candid self-assessment.** PRIOR-ART-SEARCH.md ranks HIGH/MEDIUM/LOW novelty and recommends trade-secret for 7 of 23. Investors respect honesty.
5. **Tight commercial tie.** Every draft cites a file path + function name in the actual codebase. Reduction-to-practice is real, not aspirational.

---

## 10. Top 5 weaknesses (what investors will question)

1. **Zero filings.** No provisional, no TM, no copyright. The moat is a plan, not a moat.
2. **No patent attorney engaged.** Three firms identified, no engagement letter. $500-$1,500 × 13-16 filings = $6.5k-$24k + rush fees if under deadline.
3. **Inventors `[TBD]` across every draft.** Cannot file. Each invention needs named inventor(s) + signed IAA. Blocks all filing.
4. **Git commits unsigned despite documented setup.** Tamper-evident authorship claim undermined. **30-min fix, zero excuse.**
5. **No FTO analysis + critical competitors missing** (Dthera, Cognito, Biofourmis, deeper Neurotrack read).

---

## 11. 30 / 60 / 90 filing plan

### Day 0-30 (month 1) — cost **$3k-$5.7k**
1. **Entity formation complete** (Delaware Cert in flight per Phase 39e).
2. **Engage patent attorney** — fixed-fee provisional at $500-$1,500 each. Target: Carr & Ferrell or Shay Glenn LLP.
3. **Complete INVENTOR-DISCLOSURE.md** — fill every `[TBD]`, extract conception dates from git history, sign IAA for each named inventor.
4. **Configure GPG signing + sign attestation commit today** (Weakness #4 = 30-min fix).
5. **File USPTO TM** — "GENTLE REMINDER" word mark, Class 9 + 44, TEAS Plus ITU = **$500**.
6. **Run TESS search** — save results to `docs/legal/trademark-search-results/` before filing.
7. **File Copyright Batch 1** (platform code + docs + IP portfolio) via eCO = **$195**.

### Day 30-60 (month 2) — cost **$6k-$10k**
1. **File 5 Tier-1 provisionals** — IP #01, #02, #03, #04, #05. USPTO $1.5k micro-entity + attorney $2.5k-$7.5k.
2. **File IP #06** (Sundowning) — strongest tier-2, no prior-art territory.
3. **Commission FTO search on Tier-1** — $5k-$15k.

### Day 60-90 (month 3) — cost **$4k-$8k**
1. **File 7 more provisionals** — #07, #08, #14, #15, #19, #23, plus one of #09/#10/#11 after strengthening.
2. **Drop/trade-secret:** #12, #16, #17, #18, #20, #21, #22 (7 patents).
3. **Defensive publication** of #22 (pure-TS stats) on arXiv — $0 competitor blocker.
4. **Calendar 11-month + 12-month deadlines** for PCT / non-provisional conversion.

### Cost summary
- **Day-30 out-of-pocket:** $3k-$5.7k ($500 TM + $195 copyright + $300 attorney retainer + $2k-$5k engagement)
- **Day-90 cumulative:** $15k-$25k (provisionals + TM + copyright + initial FTO)
- **Year-1 pre-conversion:** $35k-$50k (13 provisionals, FTO on tier-1, PCT prep)

---

## 12. Counterintuitive finding (investor respect)

**The 23 unfiled provisional drafts are currently a *liability*, not just an asset.**

They contain full enabling disclosure: specific thresholds (70-85% comfort zone, 2-fail/4-success asymmetry, midnight-discontinuity bedtime normalization, 0.4/0.3/0.3 hesitation fusion). Any uncontrolled leak — public repo, unNDA'd prospect, unengaged attorney, GitHub exfiltration — starts the US 12-month clock AND **destroys foreign patent rights absolutely** (EU/JP/CN/CA all require absolute novelty).

The optimal play: **file 5 lower-quality tier-1 provisionals THIS WEEK** and refine them into stronger non-provisionals over 12 months, rather than continue polishing drafts that grow more dangerous every day. **Speed-to-provisional beats polish.**

---

## 13. Unverified items

- Whether any draft has been disclosed outside the NDA perimeter (public repo, unNDA'd prospect, conference talk).
- Attorney engagement timing (no letter executed at time of audit).
- Inventor list finalization (all `[TBD]`).
- GPG key availability for git signing (setup documented but not executed).
- Whether any competitor has filed blocking claims since 2025-Q4 (USPTO app pipeline lag).
- Current priority date exposure — OTS timestamps establish *document* priority, not *patent* priority (filing date is what matters under AIA).

---

**FINAL_IP_MOAT_SCORE: 56 / 100**
**IP_MOAT_TIER: DEFENSIBLE** (low end; lifts to 70-75 within 90 days of filing execution)
**TOP_IP_ASSET:** IP #01 — Three-State Positive-Only Feedback (`docs/ip/tier-1/01-gentle-feedback-scoring.md`)
**TOP_IP_GAP:** Zero filings + `[TBD]` inventors + unsigned commits + no TM + no copyright. Moat is a document library, not an enforceable right.

---

## Appendix — source

Full agent evaluation (per-tier assessments, detailed prior-art analysis, FTO citations, cost breakdown):
`~/.claude/plans/fizzy-leaping-cat-agent-a0f22711afa5d71d6.md`
