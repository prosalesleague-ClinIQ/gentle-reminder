# GHL UI Setup Runbook

**Purpose:** Click-level checklist for the ~45 min of setup in the GHL web UI that **cannot be done via MCP**. Do this once; everything else ([import manifest](./import-manifest.md), templates, sends) automates afterward.
**Sub-account:** Gentle Reminder (`locationId: Z7s02Er3ggqTnta4X8HB`)
**Owner:** Christo Mack
**Estimated time:** 40–55 minutes

---

## Why this file exists

The GoHighLevel API (and therefore the MCP integration) exposes *write* endpoints for contacts, tags, email templates, and conversation messages — but has **no create endpoint** for:

- Custom fields
- Pipelines / pipeline stages
- Workflows / automations
- Email service / SMTP / OAuth configuration
- Business profile updates

So every item below has to be clicked in the GHL web UI. Once done, the remainder of the playbook can be run from this MCP agent.

---

## Pre-flight

- [ ] Log into GHL as the sub-account owner for **Gentle Reminder**
- [ ] Confirm URL contains `Z7s02Er3ggqTnta4X8HB` (sanity check you're in the right sub-account)
- [ ] Have these two tabs open alongside GHL:
  - [docs/crm-ghl/README.md](./README.md) (field list reference)
  - [docs/crm-ghl/pipeline-config.md](./pipeline-config.md) (stage list reference)

---

## Part 1 — Fix the business profile (2 min)

Settings → **Business Profile** (or **Company Info**).

| Field | Current placeholder | Change to |
|-------|---------------------|-----------|
| First name | `Chrito` | `Christo` |
| Last name | `Pher` | `Mack` |
| Address | `123 main st` | *your real address, or leave blank until DE C-Corp forms* |
| Business name | `Gentle Reminder` | *(no change)* |
| Time zone | `America/Los_Angeles` | *(confirm, or change to your actual TZ)* |

Save.

---

## Part 2 — Create custom fields (~15 min, 16 fields)

Settings → **Custom Fields** → **+ Add Custom Field** for each row below. Create in the order shown so the contact fields come up first in forms.

### Contact-level custom fields (10)

| # | Field name | Field key | Type | Picklist options / notes |
|---|-----------|-----------|------|--------------------------|
| 1 | GR Role | `gr_role` | Dropdown | `investor`, `patent-attorney`, `grant-specialist`, `grant-program`, `fractional-cfo`, `clinical-advisor`, `tech-advisor`, `regulatory-advisor`, `strategic-partner`, `placement-agent`, `accelerator`, `warm-lead` |
| 2 | GR Firm Type | `gr_firm_type` | Text | e.g. "Seed VC", "Patent firm" |
| 3 | GR NDA Status | `gr_nda_status` | Dropdown | `not-requested`, `redline-sent`, `signed`, `expired`, `revoked` |
| 4 | GR Materials Access Tier | `gr_materials_access_tier` | Dropdown | `none`, `tier-1`, `tier-2`, `tier-3` |
| 5 | GR First Touch Date | `gr_first_touch_date` | Date | |
| 6 | GR Last Touch Date | `gr_last_touch_date` | Date | |
| 7 | GR Warm Intro From | `gr_warm_intro_from` | Text | Name of introducer if warm |
| 8 | GR Source | `gr_source` | Text | Free-form: conference / LinkedIn DM / cold list / referral |
| 9 | GR LinkedIn URL | `gr_linkedin_url` | URL | |
| 10 | GR Diligence Asks | `gr_notes_diligence_asks` | Multiline text | Accumulated counterparty questions |

### Opportunity-level custom fields (6)

First switch the dropdown at the top of the Custom Fields screen from **Contact** to **Opportunity**, then create:

| # | Field name | Field key | Type | Picklist options / notes |
|---|-----------|-----------|------|--------------------------|
| 11 | GR Check Size | `gr_check_size` | Currency | Indicated investment size |
| 12 | GR Valuation Feedback | `gr_valuation_feedback` | Text | Counterparty's view on $25M post |
| 13 | GR Decision Timeline | `gr_decision_timeline` | Text | e.g. "IC in 3 weeks" |
| 14 | GR Next Step | `gr_next_step` | Text | One-sentence next action |
| 15 | GR Next Step Date | `gr_next_step_date` | Date | |
| 16 | GR Lost Reason | `gr_lost_reason` | Dropdown | `not-a-fit`, `bandwidth`, `stage-too-early`, `competitive-conflict`, `no-response`, `unknown` |

**Verification:** back on the agent side I can run `mcp__gohighlevel__locations_get-custom-fields` and confirm 16 entries appear. Tell me "custom fields done" and I'll verify.

---

## Part 3 — Create the pipeline (~10 min)

Settings → **Opportunities** → **Pipelines** → **+ Create Pipeline**.

- **Pipeline name:** `Gentle Reminder Seed Fundraise (2026)`
- **Default stage:** `Cold` (set after stages are added)

Add 11 stages in this exact order, with these probabilities + colors (from [pipeline-config.md:132](./pipeline-config.md:132)):

| # | Stage | Probability | Color |
|---|-------|-------------|-------|
| 01 | Cold | 5 | gray |
| 02 | Contacted | 10 | blue |
| 03 | Responded | 15 | cyan |
| 04 | Meeting Scheduled | 25 | green |
| 05 | Materials Sent | 35 | teal |
| 06 | NDA Sent | 45 | yellow |
| 07 | NDA Signed | 55 | orange |
| 08 | Diligence | 70 | amber |
| 09 | Term Sheet | 85 | red |
| 10 | Closed Won | 100 | emerald |
| 11 | Closed Lost | 0 | slate |

Save. Set `Cold` as the default stage.

**Verification:** `mcp__gohighlevel__opportunities_get-pipelines` should return the pipeline with 11 stages. Tell me "pipeline done."

---

## Part 4 — Connect Gmail (5 min)

Follow [gmail-connection.md](./gmail-connection.md) end to end. TL;DR:

1. Settings → **Email Services** → look for **Connect Gmail** / **Sign in with Google**
2. If you see it → click, sign in as `gentlereminderapp@gmail.com`, grant scopes, confirm "Connected" status
3. If OAuth button isn't available → follow Path B (SMTP + App Password) in that doc
4. Set `gentlereminderapp@gmail.com` as **default sending email**
5. Set **From Name** = `Christo Mack · Gentle Reminder`

**Verification:** I'll re-run `get-location` and confirm `defaultEmailService` is no longer empty.

---

## Part 5 — (Optional, defer) Automations

Don't build the 9 workflows from [automations.md](./automations.md) yet. Do the import and templates first so you can test automations against real contacts. Ping me when you're ready for that pass.

---

## Exit criteria — tell me when done

Reply with any one of these when Parts 1–4 are complete:

- `"GHL setup done"` — I'll run the three verification MCP calls (`get-location`, `get-custom-fields`, `get-pipelines`), then proceed to execute the import manifest + template creation autonomously.
- `"GHL setup done except [X]"` — I'll verify the parts that are done and wait on X.
- `"Stuck at [step]"` — I'll help debug.

## Related documents

| Document | Location |
|----------|----------|
| Playbook README | [README.md](./README.md) |
| Pipeline config source-of-truth | [pipeline-config.md](./pipeline-config.md) |
| Tag taxonomy | [tags-taxonomy.md](./tags-taxonomy.md) |
| Email snippets | [snippets.md](./snippets.md) |
| Automation recipes | [automations.md](./automations.md) |
| Gmail connection guide | [gmail-connection.md](./gmail-connection.md) |
| Contact import manifest | [import-manifest.md](./import-manifest.md) |
