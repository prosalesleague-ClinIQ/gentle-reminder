# GHL (GoHighLevel) CRM Playbook

**Purpose:** Operational setup for tracking 60+ parallel outreach conversations across investors, patent attorneys, grant specialists, clinical advisors, tech advisors, and strategic partners — without losing the thread on any one.
**Owner:** Christo Mac, Founder
**Last updated:** 2026-04-20
**Status:** Documentation-only (this repo does not integrate with GHL API).

---

## Why GHL

GHL is already our inbound CRM for Matrix Advanced Solutions. Extending it to cover Gentle Reminder fundraise outreach is faster than standing up a new CRM, and the lead-management / pipeline / automation primitives fit this use case well.

This playbook is **import-ready documentation** — paste each config section into the corresponding GHL screen. It intentionally does not call the GHL API.

## What's in this playbook

| File | Purpose |
|------|---------|
| `README.md` | This file — orientation, setup sequence |
| `pipeline-config.md` | Opportunity pipeline stages with entry/exit criteria, owner, SLA |
| `tags-taxonomy.md` | Controlled tag vocabulary, rules, mutually-exclusive groups |
| `automations.md` | Workflow recipes (follow-up, stage-changed, no-response) |
| `snippets.md` | Email templates formatted for GHL snippet library, mapping to existing `response-templates.ts` |

## Setup sequence (do in this order)

1. **Create custom fields** on Contact and Opportunity objects (see §Custom Fields below)
2. **Create the Outreach pipeline** with stages from `pipeline-config.md`
3. **Create tags** from `tags-taxonomy.md` — build them all up front so automations can reference them
4. **Create snippets** from `snippets.md`
5. **Build automations** from `automations.md` (test each one with a test contact before activating)
6. **Import initial contacts** from `apps/pitch-site/src/content/outreach-plan.ts` (export to CSV, map fields)
7. **Training**: walk through 5 example contacts, stage by stage, before production use

Setup time: **3-5 hours** first pass.

## Custom Fields

### Contact-level custom fields

| Field name | Type | Purpose |
|-----------|------|---------|
| `gr_role` | Dropdown | investor / patent-attorney / grant-specialist / fractional-cfo / clinical-advisor / tech-advisor / strategic / warm-lead |
| `gr_firm_type` | Text | e.g. "Seed VC", "Health VC", "Patent firm", "SBIR specialist" |
| `gr_nda_status` | Dropdown | not-requested / redline-sent / signed / expired / revoked |
| `gr_materials_access_tier` | Dropdown | none / tier-1 / tier-2 / tier-3 |
| `gr_first_touch_date` | Date | first outbound contact |
| `gr_last_touch_date` | Date | last bidirectional touch |
| `gr_warm_intro_from` | Text | name of introducer, if warm |
| `gr_source` | Text | free-form source (conference / LinkedIn DM / cold list / referral) |
| `gr_linkedin_url` | URL | direct link |
| `gr_notes_diligence_asks` | Multiline | accumulated questions the counterparty wants answered |

### Opportunity-level custom fields

| Field name | Type | Purpose |
|-----------|------|---------|
| `gr_check_size` | Currency | indicated investment size |
| `gr_valuation_feedback` | Text | counterparty's view on $25M post-money |
| `gr_decision_timeline` | Text | e.g. "IC in 3 weeks", "pass decision by 2026-06-01" |
| `gr_next_step` | Text | one sentence of the next action |
| `gr_next_step_date` | Date | when the next step is due |
| `gr_lost_reason` | Dropdown | not-a-fit / bandwidth / stage-too-early / competitive-conflict / unknown — populated at Closed-Lost |

## Operating rhythm

- **Every outreach send** → create contact (if new), tag, advance stage, set `gr_next_step` + `gr_next_step_date`
- **Every inbound reply** → update `gr_last_touch_date`, advance stage, clear or reschedule next step
- **Weekly review (Sunday 7pm):**
  - All contacts with `gr_next_step_date` past due → batch process
  - All Tier-2 `gr_materials_access_tier` contacts → verify Docsend access matches intended state
  - All Closed-Lost last 7 days → note `gr_lost_reason` if missing
- **Monthly audit:**
  - Tag hygiene — any contact with > 5 tags? un-tag the cruft
  - Pipeline hygiene — any opportunity stuck in same stage > 30 days? force a conclusion
  - Revoke any Tier-2/3 Docsend access to counterparties not in active diligence

## Security

- GHL login: MFA required
- API key: not created (documentation-only playbook)
- Export capability: limited to Founder + CFO
- Annual access review: remove any team member no longer in role

## Integration points

- **Docsend** ↔ **GHL:** no direct integration. Manually record Docsend link + access tier in the opportunity custom fields
- **Gmail** ↔ **GHL:** GHL's email integration captures sends automatically; verify enabled
- **Calendly / Cal.com** ↔ **GHL:** when meeting booked, webhook updates contact's stage and tags
- **Zoom** ↔ **GHL:** post-meeting transcript link stored as a contact note

## Related documents

| Document | Location |
|----------|----------|
| Pipeline configuration | `docs/crm-ghl/pipeline-config.md` |
| Tag taxonomy | `docs/crm-ghl/tags-taxonomy.md` |
| Automation recipes | `docs/crm-ghl/automations.md` |
| Email snippets | `docs/crm-ghl/snippets.md` |
| Source-of-truth outreach contacts | `apps/pitch-site/src/content/outreach-plan.ts` |
| Source-of-truth response templates | `apps/pitch-site/src/content/response-templates.ts` |
| Data room access policy | `docs/data-room/access-policy.md` |
