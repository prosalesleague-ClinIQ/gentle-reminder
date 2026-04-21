# GHL Tags — Controlled Vocabulary

**Purpose:** A small, strict tag vocabulary so we can segment, automate, and report reliably. Loose tagging kills CRM hygiene within 60 days.
**Rule of thumb:** If you can't write an automation that uses the tag, don't create the tag.

---

## Golden rules

1. **Maximum 5 tags per contact.** Beyond 5, segments stop being useful.
2. **Tier tags are mutually exclusive** (a contact is exactly one of `investor-tier-a`, `investor-tier-b`, or `investor-tier-c`). GHL doesn't enforce this — discipline does.
3. **Naming convention:** lowercase, hyphenated, topic-first. Examples: `investor-tier-a`, `topic-samd`, `source-conference-himss`.
4. **Never re-use tag names across different meanings.** Once assigned semantic weight, it sticks forever.
5. **Deprecation:** deprecated tags get a `z-deprecated-` prefix and a sunset date rather than deletion (preserves history).

---

## Tag groups

### Role tags (mutually exclusive within group — pick one)

| Tag | Meaning |
|-----|---------|
| `role-investor` | VC, angel, strategic LP, family office |
| `role-patent-attorney` | IP counsel at firm level or specific attorney |
| `role-placement-agent` | Capital raiser / broker-dealer |
| `role-fractional-cfo` | Fractional CFO or accounting advisory |
| `role-grant-specialist` | SBIR / STTR / R01 / foundation grant writer |
| `role-clinical-advisor` | MD / PhD with dementia research or care expertise |
| `role-tech-advisor` | Technical advisor (digital health, AI/ML, SaMD) |
| `role-regulatory-advisor` | FDA SaMD expert, CDRH former reviewer |
| `role-strategic-partner` | Pharma, medtech, payer, provider organization |
| `role-warm-introducer` | Person who can provide warm intros (but is not themselves an investor/advisor) |

### Investor tier tags (mutually exclusive)

Use only when `role-investor` is set.

| Tag | Meaning |
|-----|---------|
| `investor-tier-a` | Core target — dementia / SaMD / digital health thesis match, check size aligns, can lead |
| `investor-tier-b` | Possible fit — adjacent thesis, might co-invest |
| `investor-tier-c` | Long shot — broad thesis, low probability |

### Stage-event tags (event-based, do not mutually exclude)

| Tag | Meaning | Auto-set by |
|-----|---------|-------------|
| `outreach-sent-day-0` | First outreach sent | Manual or send automation |
| `outreach-followup-day-7` | Day-7 follow-up sent | Automation (see `automations.md`) |
| `meeting-held` | At least one meeting completed | Manual after meeting |
| `nda-redline-sent` | NDA sent for redline (pre-entity state) | Manual |
| `nda-executed` | NDA countersigned | Manual |
| `tier-2-access-granted` | Docsend Tier 2 link issued | Manual |
| `tier-3-access-granted` | Docsend Tier 3 link issued | Manual |
| `term-sheet-received` | Written TS in hand | Manual |
| `needs-data-room-access` | Flag set by Diligence-stage automation | Automation |

### Topic tags (non-exclusive — tag multiple if relevant)

| Tag | Meaning |
|-----|---------|
| `topic-dementia` | Primary condition focus |
| `topic-samd` | Software as a Medical Device regulatory |
| `topic-510k` | 510(k) pathway focus |
| `topic-sbir` | SBIR grant strategy |
| `topic-clinical-validation` | Clinical trial design / validation |
| `topic-digital-biomarkers` | Digital biomarker expertise |
| `topic-ip-patent` | IP strategy / patent portfolio |
| `topic-cap-table` | Cap table / financial modeling |
| `topic-fundraise` | Fundraise process |
| `topic-reimbursement` | Medicare / MA / CPT coding |
| `topic-pharma-partnering` | Digital endpoint / anti-amyloid trial partnering |

### Source tags (non-exclusive)

| Tag | Meaning |
|-----|---------|
| `source-cold-email` | Reached via cold email |
| `source-cold-contact-form` | Via firm contact form |
| `source-warm-intro-[introducer-lastname]` | Warm intro, e.g. `source-warm-intro-chen` |
| `source-conference-[name]` | Met at event, e.g. `source-conference-himss`, `source-conference-jpm` |
| `source-linkedin-dm` | LinkedIn DM |
| `source-twitter-dm` | X/Twitter DM |
| `source-referral-outbound` | We introduced ourselves at their request |
| `source-referral-inbound` | They heard about us from someone |

### Behavior tags (set by automations, indicate signal)

| Tag | Meaning |
|-----|---------|
| `engagement-high` | Multiple meetings, active diligence, Docsend 50%+ views |
| `engagement-low` | < 25% Docsend views, slow replies, declining interest |
| `ghost-risk` | No reply in > 30 days |
| `re-engage-q` | Quarterly re-engagement candidate (typically Closed-Lost with positive feedback) |

---

## Examples

**Flare Capital partner (warm intro from Chen, health VC focus):**
- `role-investor`
- `investor-tier-a`
- `topic-samd`
- `source-warm-intro-chen`

Total: 4 tags. Clean.

**Cold contact form to Wojcik IP:**
- `role-patent-attorney`
- `topic-ip-patent`
- `source-cold-contact-form`

Total: 3 tags. Clean.

**Dr. Bruce Miller (clinical advisor target, cold email):**
- `role-clinical-advisor`
- `topic-dementia`
- `topic-clinical-validation`
- `source-cold-email`

Total: 4 tags. Clean.

**Closed-Lost VC with helpful pass reason:**
- `role-investor`
- `investor-tier-b`
- `topic-samd`
- `re-engage-q`
- `source-warm-intro-singh`

Total: 5 tags. At the ceiling — don't add more.

---

## Tag hygiene cadence

- **Weekly:** on new contacts, verify tags selected from controlled vocabulary (no free-form tags)
- **Monthly:** audit contacts with > 5 tags; trim
- **Quarterly:** review all "topic-" tags; deprecate any with < 3 contacts (too narrow to be useful)
- **Annually:** full tag registry review; sunset deprecated tags older than 1 year

## Related documents

| Document | Location |
|----------|----------|
| GHL Playbook README | `docs/crm-ghl/README.md` |
| Pipeline configuration | `docs/crm-ghl/pipeline-config.md` |
| Automation recipes | `docs/crm-ghl/automations.md` |
