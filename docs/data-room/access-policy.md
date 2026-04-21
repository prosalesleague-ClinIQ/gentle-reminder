# Data Room — Access Policy

**Purpose:** Decision rules for who gets which tier of access, when, and how to revoke it.
**Owner:** Christo Mack, Founder
**Last updated:** 2026-04-20

---

## Access grant rules

### Tier 1 (Public-safe) — automatic

- Anyone who opens the pitch site or receives a direct link
- No NDA required, no access log required
- Grant triggered by: replying to a cold email, accepting a warm intro, clicking the pitch site URL

### Tier 2 (Post-NDA diligence) — per-viewer grant

Grant requires ALL of the following:

1. Mutual NDA executed (both signatures, dated, electronically stored)
2. Counterparty entity verified (website, LinkedIn, at least one identifiable individual at the org)
3. Active diligence conversation in progress (not a speculative "might invest someday")
4. Contact recorded in GHL with stage = "Diligence" or later
5. Pre-entity: redlined NDA only; actual execution deferred until DE C-Corp exists (see `docs/legal/pre-entity-outreach-safety.md`)

Grant mechanism: Docsend per-viewer link with the viewer's email required to unlock.

### Tier 3 (Post-LOI / term sheet) — individual approval required

Grant requires ALL of Tier 2 plus:

1. Written LOI, term sheet, or Memorandum of Understanding in hand
2. Founder approval in writing (documented in GHL note)
3. If Tier 3 includes code access: a separate read-only GitHub repo token scoped to the individual, time-boxed to 72 hours, logged per-session
4. If Tier 3 includes trade-secret parameter summary: sign-off from Founder + any co-founder / advisor included in the decision

## Special cases

### Patent attorneys

- Tier 2 at engagement letter execution, not at NDA execution
- Unilateral NDA (we disclose) preferred, not mutual
- 5-year survival minimum (not the 3-year standard)

### Placement agents / capital raisers

- **No Tier 2 or 3 access until FINRA broker-dealer registration is verified at finra.org/brokercheck**
- Unregistered placement agents cannot legally charge success fees and can invalidate the round

### Academic collaborators (SBIR PIs, R21 co-Is)

- Tier 2 at Subaward Agreement execution (signed by both institutions), not mere interest
- Publication review rights codified (`docs/legal/subaward-agreement-template.md` if drafted)
- IP ownership split codified in the subaward

### Strategic / pharma partners (Biogen, Eisai, Lilly, Medtronic)

- Tier 2 with a tightened unilateral NDA that includes:
  - Clean-team provisions if counterparty has competing digital-health programs
  - Non-use covenant prohibiting development of competing IP for 24+ months
  - Limited-purpose clause specific to the evaluation scope
- Initial disclosure limited to portfolio overview + 3–5 most relevant IPs, not entire docket

## Revocation

Revoke any tier immediately if any of:

- Counterparty passes / declines on the opportunity
- NDA breach suspected (screenshots leaked, content repeated to a third party)
- Counterparty fails to respond to 3 consecutive follow-ups over 30+ days
- Founder discretion (e.g., discovered competitive conflict, counterparty joined a competitor)

Mechanism:

1. Docsend admin → revoke link (immediate)
2. GHL → update contact stage to `Closed — Passed` or `Revoked`
3. If Tier 3 code access was granted: rotate GitHub read-only token
4. Send a polite note to counterparty: *"We're refocusing data-room access; appreciate your time. Happy to revisit if circumstances change."*

## Audit log review cadence

- **Weekly (Sunday evening):** review Docsend analytics for all active links
  - Flag any link with zero views over 14 days → expire
  - Flag any link with abnormal view count (100+ views, unusual IPs) → investigate, consider revocation
- **Monthly:** reconcile Docsend viewer list vs GHL contacts
  - Any viewer no longer in active diligence → revoke
- **Quarterly:** review Tier 3 access grants
  - Rotate all time-boxed tokens even if unused

## Watermark policy

Every Tier 2 and Tier 3 document must be watermarked with:

- Viewer email (overlaid by Docsend on view)
- Access timestamp
- "CONFIDENTIAL — GENTLE REMINDER" footer on every page

This means screenshot leaks are source-traceable to a specific viewer at a specific time — a measurable deterrent.

## Incident response

If IP appears to have leaked (competitor launches similar feature, trade-secret parameter appears in competitor's deck, etc.):

1. **Document** — screenshots, timestamps, URLs of the evidence
2. **Trace** — Docsend access log to identify which viewers had access to the specific material
3. **Preserve** — do not delete anything; mirror access logs
4. **Escalate** — notify counsel within 24 hours
5. **Decide** — with counsel: cease & desist letter, injunction, damages claim, or notify other investors

## Related documents

| Document | Location |
|----------|----------|
| Data room README | `docs/data-room/README.md` |
| Document checklist | `docs/data-room/checklist.md` |
| NDA templates | `apps/pitch-site/src/content/nda-templates.ts` |
| Pre-entity safety | `docs/legal/pre-entity-outreach-safety.md` |
| GHL pipeline stages | `docs/crm-ghl/pipeline-config.md` |
