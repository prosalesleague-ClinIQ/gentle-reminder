# GHL Contact Import Manifest

**Purpose:** Precomputed contact payloads for bulk import into GHL via `mcp__gohighlevel__contacts_upsert-contact`. Each contact is mapped from [outreach-plan.ts](../../apps/pitch-site/src/content/outreach-plan.ts) with the full tag set, `gr_*` custom field values, and target pipeline stage resolved.
**Sub-account:** Gentle Reminder (`locationId: Z7s02Er3ggqTnta4X8HB`)
**Total contacts:** 34 (1 with direct email, 33 awaiting email sourcing)
**Blocked on:** [ui-setup-runbook.md](./ui-setup-runbook.md) Parts 2 + 3 — custom fields must exist first or `gr_*` values drop silently.

---

## Execution model

After the UI runbook is complete, this manifest is executed in one autonomous pass:

1. For each contact, call `contacts_upsert-contact` with the payload below
2. Tag each contact per the derived tag set
3. Do NOT create opportunities yet — that's a separate pass once the pipeline is confirmed
4. Report: created / updated / skipped counts + any error traces

Contacts without email or phone will be created by (firstName, lastName, org) — GHL will allow but won't dedupe, so re-running this manifest without first populating emails may create duplicates. **One-shot only for the no-email set.**

---

## Tag derivation rules (applied per contact below)

| Source field | → | Tag |
|--------------|---|-----|
| `category: 'grant-program'` | → | `role-grant-specialist` + `topic-sbir` |
| `category: 'advisor'` (grant-spec-*) | → | `role-grant-specialist` + `topic-sbir` |
| `category: 'vc-seed'` or `'vc-strategic'` | → | `role-investor` + investor tier from priorityScore |
| `category: 'accelerator'` | → | `role-investor` (accelerators operate as investors) |
| `category: 'patent-attorney'` | → | `role-patent-attorney` + `topic-ip-patent` |
| `category: 'fractional-cfo'` | → | `role-fractional-cfo` + `topic-cap-table` |
| `category: 'placement-agent'` | → | `role-placement-agent` + `topic-fundraise` |
| `category: 'strategic-partner'` | → | `role-strategic-partner` + `topic-pharma-partnering` |

**Always-applied:** `topic-dementia`, `topic-samd` (except grant-programs).
**Investor tier (VCs only):** priorityScore ≤ 6 → `investor-tier-a`; 7–10 → `investor-tier-b`; ≥11 → `investor-tier-c`.
**Source (default):** `source-cold-email` unless noted otherwise.

**Ceiling enforcement:** max 5 tags per contact per [tags-taxonomy.md:10](./tags-taxonomy.md:10). Below, if >5 would apply, the lowest-signal topic tag is dropped.

---

## Custom field defaults (all contacts on first import)

| Field | Value |
|-------|-------|
| `gr_role` | *(from category mapping)* |
| `gr_firm_type` | *(from category — see per-contact table)* |
| `gr_nda_status` | `not-requested` |
| `gr_materials_access_tier` | `none` |
| `gr_source` | `cold list` |
| `gr_linkedin_url` | *(empty unless in source)* |
| `gr_notes_diligence_asks` | *(empty)* |
| `gr_warm_intro_from` | *(empty)* |
| `gr_first_touch_date` | *(empty — set on first send)* |
| `gr_last_touch_date` | *(empty — set on first reply)* |

All contacts enter the pipeline at stage `Cold`.

---

## Contact table

### Tier 1 — Grants + Grant Specialists (6 contacts)

| # | ID | Org | Email | gr_role | Tags |
|---|----|----|-------|---------|------|
| 1 | `grant-nia-sbir-p1` | NIH / NIA SBIR Phase I | — | `grant-program` | `role-grant-specialist`, `topic-sbir`, `topic-dementia`, `source-cold-email` |
| 2 | `grant-brightfocus` | BrightFocus Alzheimer's | — | `grant-program` | `role-grant-specialist`, `topic-sbir`, `topic-dementia`, `source-cold-email` |
| 3 | `grant-spec-turbosbir` | TurboSBIR / NIH4Startups | — | `grant-specialist` | `role-grant-specialist`, `topic-sbir`, `topic-dementia`, `topic-samd`, `source-cold-email` |
| 4 | `grant-spec-bluehaven` | Blue Haven Grant Consultants | — | `grant-specialist` | `role-grant-specialist`, `topic-sbir`, `topic-dementia`, `topic-samd`, `source-cold-email` |
| 5 | `grant-spec-intelispark` | InteliSpark | — | `grant-specialist` | `role-grant-specialist`, `topic-sbir`, `topic-dementia`, `topic-samd`, `source-cold-email` |
| 6 | `grant-spec-eva-garland` | Eva Garland Consulting | — | `grant-specialist` | `role-grant-specialist`, `topic-sbir`, `topic-dementia`, `topic-samd`, `source-cold-email` |

### Tier 1 — VCs (Seed) (7 contacts)

| # | ID | Org | Email | Investor Tier | Tags |
|---|----|----|-------|---------------|------|
| 7 | `vc-flare-capital` | Flare Capital Partners | — | `investor-tier-a` (priority 3) | `role-investor`, `investor-tier-a`, `topic-samd`, `topic-dementia`, `source-cold-email` |
| 8 | `vc-define-ventures` | Define Ventures | — | `investor-tier-a` (priority 4) | `role-investor`, `investor-tier-a`, `topic-samd`, `topic-dementia`, `source-cold-email` |
| 9 | `vc-a16z-bio` | a16z Bio + Health | — | `investor-tier-a` (priority 6) | `role-investor`, `investor-tier-a`, `topic-samd`, `topic-dementia`, `source-cold-email` |
| 10 | `vc-general-catalyst` | General Catalyst | — | `investor-tier-b` (priority 7) | `role-investor`, `investor-tier-b`, `topic-samd`, `topic-dementia`, `source-cold-email` |
| 11 | `vc-7wire` | 7wireVentures | — | `investor-tier-a` (priority 5) | `role-investor`, `investor-tier-a`, `topic-samd`, `topic-dementia`, `source-cold-email` |
| 12 | `vc-406-ventures` | .406 Ventures | — | `investor-tier-b` (priority 8) | `role-investor`, `investor-tier-b`, `topic-samd`, `topic-dementia`, `source-cold-email` |
| 13 | `vc-oak-hcft` | Oak HC/FT | — | `investor-tier-c` (priority 12) | `role-investor`, `investor-tier-c`, `topic-samd`, `topic-dementia`, `source-cold-email` |

### Tier 1 — VCs (Strategic) (3 contacts)

| # | ID | Org | Email | Investor Tier | Tags |
|---|----|----|-------|---------------|------|
| 14 | `vc-optum-ventures` | Optum Ventures | — | `investor-tier-b` (priority 9) | `role-investor`, `investor-tier-b`, `topic-samd`, `topic-pharma-partnering`, `source-cold-email` |
| 15 | `vc-biogen-digital-health` | Biogen Digital Health Fund | — | `investor-tier-a` (priority 2) | `role-investor`, `investor-tier-a`, `topic-samd`, `topic-pharma-partnering`, `source-cold-email` |
| 16 | `vc-merck-ghi` | Merck Global Health Innovation | — | `investor-tier-c` (priority 14) | `role-investor`, `investor-tier-c`, `topic-samd`, `topic-pharma-partnering`, `source-cold-email` |

### Tier 1 — Accelerators (4 contacts)

| # | ID | Org | Email | Tags |
|---|----|----|-------|------|
| 17 | `accel-rock-health` | Rock Health | — | `role-investor`, `topic-samd`, `topic-dementia`, `source-cold-email` |
| 18 | `accel-yc` | Y Combinator | — | `role-investor`, `topic-samd`, `topic-dementia`, `source-cold-email` |
| 19 | `accel-matter` | MATTER | — | `role-investor`, `topic-samd`, `topic-dementia`, `source-cold-email` |
| 20 | `accel-startup-health` | StartUp Health | — | `role-investor`, `topic-samd`, `topic-dementia`, `source-cold-email` |

### Tier 2 — Patent Attorneys (5 contacts) — **URGENT: 6-week filing window**

| # | ID | Org | Email | Tags |
|---|----|----|-------|------|
| 21 | `pat-carson` | Carson Patents | `info@carsonpatents.com` ✓ | `role-patent-attorney`, `topic-ip-patent`, `topic-samd`, `source-cold-email` |
| 22 | `pat-wojcik` | Wojcik Law Firm | — | `role-patent-attorney`, `topic-ip-patent`, `topic-samd`, `source-cold-email` |
| 23 | `pat-miller-ip` | Miller IP Law | — | `role-patent-attorney`, `topic-ip-patent`, `topic-samd`, `source-cold-email` |
| 24 | `pat-wsgr-hin-au` | Wilson Sonsini (Hin Au) | — | `role-patent-attorney`, `topic-ip-patent`, `topic-samd`, `source-cold-email` |
| 25 | `pat-cooley` | Cooley LLP Medtech | — | `role-patent-attorney`, `topic-ip-patent`, `topic-samd`, `source-cold-email` |

### Tier 3 — Fractional CFOs (3 contacts)

| # | ID | Org | Email | Tags |
|---|----|----|-------|------|
| 26 | `cfo-burkland` | Burkland Associates | — | `role-fractional-cfo`, `topic-cap-table`, `topic-fundraise`, `source-cold-email` |
| 27 | `cfo-kruze` | Kruze Consulting | — | `role-fractional-cfo`, `topic-cap-table`, `topic-fundraise`, `source-cold-email` |
| 28 | `cfo-aircfo` | airCFO | — | `role-fractional-cfo`, `topic-cap-table`, `topic-fundraise`, `source-cold-email` |

### Tier 4 — Placement Agents (2 contacts)

| # | ID | Org | Email | Tags |
|---|----|----|-------|------|
| 29 | `agent-nhvp` | New Harbor Venture Partners | — | `role-placement-agent`, `topic-fundraise`, `topic-samd`, `source-cold-email` |
| 30 | `agent-locust-walk` | Locust Walk | — | `role-placement-agent`, `topic-fundraise`, `topic-samd`, `source-cold-email` |

### Tier 5 — Strategic Partners (4 contacts)

| # | ID | Org | Email | Tags |
|---|----|----|-------|------|
| 31 | `strat-biogen` | Biogen (Leqembi) | — | `role-strategic-partner`, `topic-pharma-partnering`, `topic-dementia`, `source-cold-email` |
| 32 | `strat-eisai` | Eisai | — | `role-strategic-partner`, `topic-pharma-partnering`, `topic-dementia`, `source-cold-email` |
| 33 | `strat-lilly` | Eli Lilly (Kisunla) | — | `role-strategic-partner`, `topic-pharma-partnering`, `topic-dementia`, `source-cold-email` |
| 34 | `strat-uhg` | UnitedHealth / Optum | — | `role-strategic-partner`, `topic-reimbursement`, `topic-dementia`, `source-cold-email` |

---

## Firm-type mapping (for `gr_firm_type` field)

| Category | gr_firm_type value |
|----------|---------------------|
| `grant-program` | Federal grant portal |
| `advisor` (grant-spec-*) | SBIR consulting |
| `vc-seed` | Seed VC |
| `vc-strategic` | Corporate/strategic VC |
| `accelerator` | Accelerator |
| `patent-attorney` (small) | Patent firm (equity/contingency) |
| `patent-attorney` (large) | Patent firm (AmLaw 100) |
| `fractional-cfo` | Fractional CFO |
| `placement-agent` | Placement agent |
| `strategic-partner` | Pharma strategic / Payer |

---

## Example upsert payload (Carson Patents — the only one with a direct email)

Once the custom fields exist, this is the exact MCP call I'll make:

```json
{
  "tool": "mcp__gohighlevel__contacts_upsert-contact",
  "payload": {
    "locationId": "Z7s02Er3ggqTnta4X8HB",
    "firstName": "Carson",
    "lastName": "Patents",
    "name": "Carson Patents",
    "companyName": "Carson Patents",
    "email": "info@carsonpatents.com",
    "website": "https://carsonpatents.com/equity-and-contingency-patent-fees/",
    "tags": [
      "role-patent-attorney",
      "topic-ip-patent",
      "topic-samd",
      "source-cold-email"
    ],
    "customFields": [
      { "key": "gr_role", "value": "patent-attorney" },
      { "key": "gr_firm_type", "value": "Patent firm (equity/contingency)" },
      { "key": "gr_nda_status", "value": "not-requested" },
      { "key": "gr_materials_access_tier", "value": "none" },
      { "key": "gr_source", "value": "cold list" }
    ]
  }
}
```

The other 33 contacts follow the same shape with empty `email` and name derived from `org`.

---

## Priorities — do these first when emails become available

Per priorityScore in [outreach-plan.ts](../../apps/pitch-site/src/content/outreach-plan.ts), once emails are sourced from websites, firm contact forms, or LinkedIn, the first 5 to actually *send* to are:

1. `pat-carson` — already has email ✓
2. `pat-wojcik` — source from website contact form
3. `grant-spec-turbosbir` — source from website
4. `grant-spec-bluehaven` — source from website
5. `pat-miller-ip` — source from website

These are the fastest × cheapest targets. Patent attorneys are time-critical (6-week filing window from [outreach-plan.ts:391](../../apps/pitch-site/src/content/outreach-plan.ts:391)).

---

## Post-import verification

After the import pass I will:

1. `get-contacts` with limit=50 → confirm count = 34
2. `get-contacts` with `query=Carson` → confirm Carson Patents has email + tags
3. Spot-check one contact per category for tag completeness

## Related documents

| Document | Location |
|----------|----------|
| UI setup runbook (blocking dependency) | [ui-setup-runbook.md](./ui-setup-runbook.md) |
| Source-of-truth contacts | [outreach-plan.ts](../../apps/pitch-site/src/content/outreach-plan.ts) |
| Tag taxonomy | [tags-taxonomy.md](./tags-taxonomy.md) |
| Pipeline stages | [pipeline-config.md](./pipeline-config.md) |
| Pre-entity outreach safety | [../legal/pre-entity-outreach-safety.md](../legal/pre-entity-outreach-safety.md) |
