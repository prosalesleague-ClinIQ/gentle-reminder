# Data Room — Setup Guide

**Purpose:** Three-tier access structure for investor, advisor, and strategic-partner diligence. Designed to open progressively as relationships deepen, not all at once.
**Owner:** Christo Mack, Founder
**Last updated:** 2026-04-20

---

## The three-tier model

| Tier | Who sees it | When | Platform |
|------|-------------|------|----------|
| **Tier 1 — Public-safe overview** | Any warm intro, any replied cold email, anyone who's seen the pitch site | Immediately on first substantive conversation | Pitch site + direct download links (no access controls) |
| **Tier 2 — Financial + clinical diligence** | Signed NDA, active diligence conversation | After NDA fully executed | **Docsend** (recommended) with per-viewer link + watermark + revocation |
| **Tier 3 — IP + code + audit** | LOI, term sheet, or late-stage strategic | After LOI or term sheet | **Docsend** with tightened watermark + 24-hour view windows, OR shared Drive with per-file audit logging |

Tier 1 is self-serve. Tier 2 and Tier 3 are individually granted — no blanket links.

## Platform recommendation

**Primary: Docsend** (by DocumentCloud / DocSend Inc., now part of Dropbox)
- Per-viewer links with email verification
- Watermarking on view (viewer's email overlay)
- Link expiration
- View analytics (pages viewed, time on page, re-opens)
- One-click revocation
- Cost: ~$15/month Personal plan; $45/month Advanced adds NDA signing inline
- Standard in venture diligence — investors expect it

**Fallback: Google Drive**
- Free / already-available
- Less tracking fidelity (no per-page analytics, no watermark-on-view, no expiration)
- Per-file share with "Viewer" + "Disable download, print, copy" controls
- Acceptable for Tier 2 early-stage; upgrade to Docsend by term-sheet stage

**NOT acceptable:**
- Public Dropbox / Box links with no expiration
- Email attachments for Tier 2+ materials (no revocation, easy to forward)
- Notion public pages (search engines can index; hard to revoke)

## Workflow

```
Warm intro / reply
     │
     ▼
┌─────────────────────────────────┐
│  TIER 1: self-serve              │
│  → pitch site + deck + exec sum  │
│  → GHL: stage = "Contacted"      │
└─────────────────────────────────┘
     │
     ▼
Interest expressed
     │
     ▼
Send mutual NDA (docs/private/nda) ────┐
                                        │
(PRE-ENTITY: redline only, execute      │
 once DE C-Corp files — see             │
 docs/legal/pre-entity-outreach-safety) │
                                        │
     │                                  │
     ▼                                  │
NDA countersigned ◄──────────────────── ┘
     │
     ▼
┌─────────────────────────────────┐
│  TIER 2: Docsend link            │
│  → Full IP portfolio (claims)    │
│  → FDA SaMD docs                 │
│  → Clinical validation protocol  │
│  → 5-year financial model        │
│  → Cap table                     │
│  → GHL: stage = "Diligence"      │
└─────────────────────────────────┘
     │
     ▼
LOI / term sheet
     │
     ▼
┌─────────────────────────────────┐
│  TIER 3: Docsend — tight         │
│  → Codebase architecture doc     │
│  → Source-code GitHub access     │
│    (read-only, time-boxed)       │
│  → Trade-secret parameter        │
│    summary (non-specific)        │
│  → Investor references           │
│  → Audit logs on every file      │
│  → GHL: stage = "Term Sheet"     │
└─────────────────────────────────┘
```

## Operating rhythm

- **Weekly review** — every Sunday evening, review Docsend analytics. Top-engaged viewers get a proactive follow-up note Monday.
- **Expire links** — any Tier 2 link with >14 days of no activity gets auto-expired. Viewer must re-request.
- **Rotate watermarks** — each new viewer gets a unique watermark (their email + access date). If a screenshot leaks, the source is traceable.
- **Revoke on pass** — when a fund passes, revoke their Docsend links within 24 hours. Reduces exposure.
- **Per-quarter audit** — check Docsend access log vs GHL contact list. Close any access from viewers no longer in active diligence.

## What NEVER goes in the data room

- Trade-secret parameters (specific weights, thresholds, dictionaries, audio feature thresholds, keyword dictionaries, calibration tables) — retained in a separately encrypted vault; referenced in IP portfolio only by category, never by value
- Source code snippets of the algorithm-critical files — can be reviewed in GitHub with read-only time-boxed access at Tier 3, but not downloadable
- Pre-filing invention disclosures — only post-provisional-filing materials go in the data room
- Customer PII / PHI — the platform processes it; the data room describes the handling policy (`docs/iso-14971`), not the data itself
- Any document with named investor references until that investor has given consent

## Related documents

| Document | Location |
|----------|----------|
| Data room checklist (every doc by tier) | `docs/data-room/checklist.md` |
| Access policy (who, when, why) | `docs/data-room/access-policy.md` |
| Pre-entity outreach safety guide | `docs/legal/pre-entity-outreach-safety.md` |
| NDA templates | `apps/pitch-site/src/content/nda-templates.ts` |
| GHL CRM pipeline stages | `docs/crm-ghl/pipeline-config.md` |
