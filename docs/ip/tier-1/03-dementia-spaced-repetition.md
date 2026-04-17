# Provisional Patent Application: Dementia-Adapted Spaced Repetition Method

**Docket No.:** GR-03-PROV
**Filing Priority Tier:** 1
**Applicant:** [Gentle Reminder, Inc.]
**Inventors:** [TBD]

## 1. TITLE
Modified SuperMemo-2 Spaced Repetition Method for Memory Reinforcement in Dementia Patients

## 2. CROSS-REFERENCE
Not applicable.

## 3. FEDERALLY SPONSORED RESEARCH
Not applicable.

## 4. FIELD
Memory reinforcement algorithms for progressive cognitive decline, particularly spaced repetition systems (SRS) for dementia patients.

## 5. BACKGROUND

### 5.1 Problem
Standard spaced repetition algorithms (SM-2, Anki, Leitner) are designed for healthy adults acquiring new knowledge. They use long intervals (up to 365+ days), reset cards to zero on failure, and assume learning curves that stabilize with repeated successful recall. For dementia patients, these behaviors are catastrophic:
- 365-day intervals mean patients lose memory associations before reinforcement
- Failure resets cause psychological distress and destroy progress feeling
- The expected upward learning curve contradicts the downward decline curve of dementia

### 5.2 Prior Art
- Wozniak, P.A. (1990). SuperMemo-2 (SM-2) algorithm — public
- Anki implementations (ankiweb.net) — open-source SM-2
- Duolingo Half-Life Regression (US 9,904,676) — proprietary spaced repetition
- Leitner (1972) — flashcard system, public domain

### 5.3 Limitations of Prior Art
All identified SRS algorithms assume a progressively-improving learner. None adapt to declining memory populations. None cap maximum intervals at dementia-relevant durations. All reset on failure, which is counterproductive for progressive decline.

## 6. BRIEF SUMMARY

The invention is a modified spaced repetition algorithm derived from SM-2 with five specific adaptations for dementia populations: (1) maximum interval capped at 7 days (vs SM-2's 365+); (2) failure halves the interval instead of resetting to zero; (3) minimum interval of 1 hour (vs SM-2's 1 day); (4) gentler ease factor floor of 1.5 (vs SM-2's 1.3); and (5) three-phase initial spacing of 1 hour → 6 hours → computed. These adaptations preserve memory associations during progressive decline.

## 7. BRIEF DESCRIPTION OF DRAWINGS

- **FIG. 1** — Comparison of standard SM-2 interval growth vs dementia-adapted interval growth over time
- **FIG. 2** — Card state transitions in the modified algorithm
- **FIG. 3** — Ease factor evolution under the modified quality-adjustment formula

## 8. DETAILED DESCRIPTION

### 8.1 System Architecture
- Card deck management
- Review queue scheduler
- Quality capture (0-5 scale on recall)
- Modified SM-2 algorithm
- Daily review session builder

### 8.2 Core Method (`processReview`)

```
function processReview(card, quality):
  // quality: 0=total blank, 3=correct with difficulty, 5=perfect recall
  if quality >= 3:  // successful recall
    if card.repetition == 0:
      newInterval = 1  // 1 hour (not 1 day as in SM-2)
    elif card.repetition == 1:
      newInterval = 6  // 6 hours
    else:
      newInterval = card.interval * card.easeFactor
    card.repetition += 1
  else:  // failed recall — DO NOT RESET
    card.repetition = max(card.repetition - 1, 0)
    newInterval = max(card.interval * 0.5, 1)  // halve, don't reset

  // Ease factor adjustment (modified SM-2)
  newEF = card.easeFactor + (0.1 - (5 - quality) * (0.06 + (5 - quality) * 0.02))
  card.easeFactor = max(newEF, 1.5)  // floor at 1.5 (SM-2 is 1.3)

  // Cap maximum interval for dementia retention
  card.interval = min(newInterval, 168)  // 7 days in hours
  card.nextReview = now() + card.interval hours
```

### 8.3 Specific Parameters

| Parameter | Standard SM-2 | Dementia-Adapted | Rationale |
|-----------|:-------------:|:----------------:|-----------|
| Maximum interval | 365+ days | 7 days (168 hours) | Dementia memory loss rate |
| Minimum interval | 1 day | 1 hour | Gentler re-exposure |
| Ease factor floor | 1.3 | 1.5 | Reduced punishment for failure |
| Failure behavior | Reset to 0 | Halve interval | Preserve progress feeling |
| Initial interval 1 | 1 day | 1 hour | Close-range anchor |
| Initial interval 2 | 6 days | 6 hours | Same-day reinforcement |
| Quality scale | 0-5 | 0-5 | (unchanged) |
| Success threshold | quality ≥ 3 | quality ≥ 3 | (unchanged) |

### 8.4 Card Data Structure

```typescript
interface Card {
  id: string;
  content: string;        // word, face, place, event
  category: 'person' | 'place' | 'event' | 'fact';
  photoUrl?: string;      // optional anchor image
  interval: number;       // hours (not days)
  repetition: number;     // count of successful recalls
  easeFactor: number;     // 1.5 min, ~2.5 typical, 3.0 max
  nextReview: Date;
  createdAt: Date;
  lastReviewed?: Date;
}
```

### 8.5 Alternative Embodiments
- **Embodiment A:** Domain-specific intervals (faster decay for verbal, slower for visual)
- **Embodiment B:** Caregiver-adjusted intervals based on observed patient state
- **Embodiment C:** Integration with photo-based reinforcement anchors

### 8.6 Reference Implementation
`packages/cognitive-engine/src/exercises/spaced-repetition.ts`
Function: `processReview()`, `createCard()`

## 9. CLAIMS

**Claim 1:** A method for scheduling memory-reinforcement reviews for a patient with progressive cognitive decline, comprising:
(a) storing a card comprising content, an interval, a repetition count, an ease factor, and a next-review timestamp;
(b) presenting the card to the patient at the next-review timestamp;
(c) receiving a quality rating from 0 to 5 representing recall success;
(d) upon quality ≥ 3, increasing the repetition count and computing a new interval;
(e) upon quality < 3, decrementing the repetition count by 1 but not below 0, and setting the new interval to half of the current interval but not less than 1 hour;
(f) updating the ease factor per a quality-adjustment formula with a floor of 1.5;
(g) capping the new interval at a maximum of 168 hours (7 days); and
(h) storing an updated next-review timestamp.

**Claim 2:** The method of Claim 1, wherein the initial interval upon first successful review is 1 hour and the second successful review interval is 6 hours.

**Claim 3:** The method of Claim 1, wherein the ease factor update formula is:
EF_new = EF_old + 0.1 − (5 − q) × (0.06 + (5 − q) × 0.02)
where q is the quality rating.

**Claim 4:** The method of Claim 1, wherein a failed recall does not reset the repetition count to zero, unlike the SuperMemo-2 algorithm.

**Claim 5:** The method of Claim 1, wherein the card further comprises a category selected from: person, place, event, or fact.

**Claim 6:** The method of Claim 1, wherein the card further comprises an optional image serving as a memory anchor.

**Claim 7:** A system comprising one or more processors and memory storing instructions to perform the method of Claim 1.

**Claim 8:** A non-transitory computer-readable medium storing instructions that cause one or more processors to perform the method of Claim 1.

**Claim 9:** The method of Claim 1, wherein intervals are expressed in units of hours rather than days, providing sub-daily precision for dementia-relevant memory reinforcement.

## 10. ABSTRACT

A modified spaced repetition method for dementia patients derived from the SuperMemo-2 (SM-2) algorithm with five specific adaptations: (1) maximum review interval capped at 7 days (168 hours); (2) failed recalls halve the interval rather than resetting to zero; (3) minimum interval of 1 hour; (4) ease factor floor of 1.5 (less punitive than SM-2's 1.3); and (5) three-phase initial spacing of 1 hour → 6 hours → computed. The algorithm uses hour-level precision rather than day-level, and preserves the patient's progress trajectory even after failed recalls to avoid psychological distress. Suitable for memory reinforcement of persons, places, events, and facts in populations with Alzheimer's disease, vascular dementia, and mild cognitive impairment.

## REFERENCES
- Wozniak, P.A. (1990). Optimization of learning. Master's thesis, Poznan University.
- Anki SRS documentation (ankiweb.net)
- US 9,904,676 (Duolingo)
- Leitner, S. (1972). So lernt man lernen (How to learn to learn)

Codebase: `packages/cognitive-engine/src/exercises/spaced-repetition.ts`

## APPLICANT NOTES
**Commercial value:** Enables dementia-specific memory reinforcement products. Licensable to pharma (anti-amyloid therapy cognitive maintenance).
**Valuation:** $1.5M-$4M
**Conversion priority:** HIGH — strong novelty in parameter set
