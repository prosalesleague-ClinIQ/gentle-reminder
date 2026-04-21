# IP Disclosure Log — Template

**Document ID:** DL-001
**Version:** 1.0
**Effective Date:** 2026-04-20
**Owner:** Christo Mack, Founder

---

## Purpose

Document, for every material IP disclosure to an outside party, **what was shared, when, to whom, and under what cover**. This creates an audit trail for:

- Trade-secret litigation (proof of reasonable-secrecy measures under DTSA 18 U.S.C. § 1836)
- Bayh-Dole compliance (tracking disclosure vs. invention timeline)
- NDA enforcement (proof that specific materials were covered)
- Investor diligence (which materials has each investor seen)
- Source-tracing leaks (match leaked content to a specific viewer)

## Entry template

Copy this block for each disclosure event and fill in:

```markdown
### Entry #NNN — [YYYY-MM-DD]

- **Date of disclosure:** YYYY-MM-DD
- **Counterparty:** [org name]
- **Individual(s):** [name(s), title(s)]
- **Contact info:** [email(s)]
- **Relationship:** [investor / patent-attorney / placement-agent / advisor / strategic / academic]
- **Context:** [intro call / diligence / engagement eval / pilot discussion]
- **Cover agreement:**
  - Type: [mutual-nda / unilateral-nda / short-nda / subaward / dua / none]
  - Executed date: YYYY-MM-DD
  - Effective date: YYYY-MM-DD
  - Location of countersigned copy: [file path or Docsend link]
- **Materials disclosed:**
  - [ ] Pitch deck PDF (version YYYY-MM-DD) — public-safe
  - [ ] Exec summary PDF — public-safe
  - [ ] Full IP portfolio (incl. claim language) — NDA required
  - [ ] Specific provisional spec: GR-XX-[slug] — NDA required
  - [ ] FDA SaMD documentation — NDA required
  - [ ] Clinical validation protocol (CVP-001) — NDA required
  - [ ] 5-year financial model — NDA required
  - [ ] Cap table — NDA required
  - [ ] Trade-secret parameter summary (categories only, no values) — LOI required
  - [ ] Codebase GitHub read-only access — LOI required, time-boxed [NN] hours
  - [ ] Other: __________
- **Delivery mechanism:**
  - [ ] Docsend link (per-viewer, watermark)
  - [ ] Google Drive share (viewer-only, no download)
  - [ ] GitHub repo token (read-only, expires YYYY-MM-DD)
  - [ ] Email attachment (Tier 1 public-safe only)
  - [ ] In-person / screen-share only
- **Watermark / identifier:** [viewer email visible, access date embedded]
- **Access window:** [open-ended / expires YYYY-MM-DD]
- **GHL contact ID / stage:** [contact_xxx / Diligence]
- **Purpose limitation (per NDA):** [evaluation of investment / engagement / partnership]
- **Notes / follow-up:**
  -
```

## Example entries

### Entry #001 — 2026-04-20

- **Date of disclosure:** 2026-04-20
- **Counterparty:** Carson Patents
- **Individual(s):** [TBD on reply]
- **Contact info:** info@carsonpatents.com
- **Relationship:** patent-attorney (evaluating for equity / contingency engagement)
- **Context:** Cold outreach, first email
- **Cover agreement:** none (public materials only, pre-entity week)
- **Materials disclosed:**
  - [x] Public pitch site link (https://gentle-reminder-pitch.vercel.app) — public
  - [x] Pitch deck PDF — public-safe
  - [x] Exec summary PDF — public-safe
  - [x] Portfolio summary text (5 Tier 1 / 7 Tier 2 / 11 Tier 3, no claim language) — public-safe
- **Delivery mechanism:** Email (Tier 1 public-safe only)
- **Watermark / identifier:** n/a (Tier 1)
- **Access window:** n/a
- **GHL contact ID / stage:** [to create] / Contacted
- **Purpose limitation:** Fee quote + engagement exploration
- **Notes / follow-up:** NDA + engagement letter to execute next week post-entity formation. No full IP docket shared.

### Entry #002 — YYYY-MM-DD

- **Date of disclosure:** [fill in on next disclosure]
- **Counterparty:** [...]

---

## Operating rules

1. **One entry per material disclosure.** A series of emails to the same counterparty within a conversation = one entry; a new engagement / new topic = new entry.
2. **Update entries rather than deleting.** If additional materials are shared later in the same relationship, append to the entry's materials list with an updated date.
3. **Cross-reference GHL.** Every entry has a GHL contact ID. If a counterparty is not yet in GHL, create the contact first.
4. **Review quarterly.** Audit all entries for:
   - Expired NDAs (materials should be retrieved or destroyed)
   - Access windows past due (revoke if not already)
   - Counterparties who passed (revoke access)
5. **Protect this log.** It's Confidential — kept in the private repo, not in the data room. Never disclosed to counterparties.
6. **Post-breach response.** If IP leaks, this log is the first place counsel looks. Keep it honest and current.

## Retention

- Retained for the longer of:
  - 7 years after last entry update
  - 5 years after the end of any applicable NDA survival period
  - Duration of any litigation or investigation

## Related documents

| Document | Location |
|----------|----------|
| Data room access policy | `docs/data-room/access-policy.md` |
| NDA templates | `apps/pitch-site/src/content/nda-templates.ts` |
| Pre-entity outreach safety | `docs/legal/pre-entity-outreach-safety.md` |
| Bayh-Dole obligations | `docs/legal/bayh-dole-obligations.md` |
