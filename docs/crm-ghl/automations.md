# GHL Automation Recipes

**Purpose:** The handful of workflows that keep a 60+ contact outreach pipeline moving without anything slipping.
**Rule of thumb:** If you find yourself doing the same task twice in a week, it's an automation.

---

## Automation inventory

| # | Name | Trigger | Primary action |
|---|------|---------|----------------|
| 1 | Day-7 No-Response Follow-Up | Stage = Contacted, 7 days elapsed, no reply | Queue follow-up email for review |
| 2 | Meeting Scheduled → Materials | Stage moves to Meeting Scheduled | Email Tier 1 materials + add `tier-1-access-granted` tag |
| 3 | NDA Sent → 3-Day Chase | Tag `nda-redline-sent` set, 3 days elapsed, no countersig | Queue chase email |
| 4 | Diligence → Data Room | Stage moves to Diligence | Flag with `needs-data-room-access`, create task to send Docsend |
| 5 | Closed Lost → Reason Required | Stage moves to Closed Lost | Block save until `gr_lost_reason` populated |
| 6 | Quarterly Re-engagement | Tag `re-engage-q` + 90 days since last touch | Queue re-engagement email for review |
| 7 | Meeting No-Show | Meeting scheduled, date passed, no "meeting-held" tag within 24h | Notify founder, set stage to Responded |
| 8 | Docsend Analytics Digest | Weekly (Sunday 6pm) | Pull Docsend view counts into founder's inbox |
| 9 | Term Sheet Received → Counsel | Stage moves to Term Sheet | Notify founder + counsel, create task "review TS within 72h" |

---

## 1. Day-7 No-Response Follow-Up

**Why:** 40% of replies happen on the second or third touch. Without a forced cadence, first-touches go cold silently.

**Trigger:**
- Contact stage = `Contacted`
- 7 days elapsed since `gr_first_touch_date`
- No `gr_last_touch_date` later than `gr_first_touch_date`
- Tag `outreach-followup-day-7` NOT present

**Action:**
1. Queue follow-up email (snippet `followup-day-7` — see `snippets.md`)
2. Add tag `outreach-followup-day-7`
3. Create task for founder: "Review + send Day-7 follow-up to {{contact.first_name}}"

**Does NOT auto-send** — queues draft for founder review. Personalization > velocity.

**Escalation:** if still no reply after another 14 days → automation #6 (Ghost Risk).

## 2. Meeting Scheduled → Materials

**Why:** Every meeting prep starts with sending Tier 1 materials 24h ahead. Automate the send + tag update.

**Trigger:**
- Contact stage moves to `Meeting Scheduled`
- `gr_materials_access_tier` is NULL or `none`

**Action:**
1. Send materials email (snippet `materials-tier-1` — see `snippets.md`)
2. Set `gr_materials_access_tier` = `tier-1`
3. Add tag `tier-1-access-granted`
4. Create task for founder: "Meeting prep: review Flare (for example) portfolio + partner background before meeting on {{meeting_date}}"

## 3. NDA Sent → 3-Day Chase

**Why:** NDAs that sit in inboxes stall deals. 3-day chase keeps signatures moving.

**Trigger:**
- Tag `nda-redline-sent` set
- 3 days elapsed since tag set
- Tag `nda-executed` NOT present

**Action:**
1. Queue NDA-chase email (snippet `nda-chase` — see `snippets.md`)
2. Create task for founder: "NDA chase: {{contact.first_name}}; 3 days since redline sent"

**Escalation:** if 21 days elapse without `nda-executed` → notify founder to revisit or close.

## 4. Diligence → Data Room

**Why:** When diligence opens, Tier 2 access needs to go out within 3 business days, not sit in a queue.

**Trigger:**
- Contact stage moves to `Diligence`

**Action:**
1. Add tag `needs-data-room-access`
2. Create task for founder: "Grant Tier 2 Docsend access to {{contact.first_name}} and update `gr_materials_access_tier`"
3. Send reminder email to founder (not counterparty)

**Owner-accountable** — founder must manually issue Docsend link per `docs/data-room/access-policy.md`.

## 5. Closed Lost → Reason Required

**Why:** If we don't record why a deal died, we can't learn. Force `gr_lost_reason` capture at stage change.

**Trigger:**
- Contact stage moves to `Closed Lost`
- `gr_lost_reason` is NULL

**Action:**
1. Prevent stage change (GHL allows this via required-field rule on stage)
2. Show dropdown: `not-a-fit`, `bandwidth`, `stage-too-early`, `competitive-conflict`, `no-response`, `unknown`
3. After `gr_lost_reason` is populated, stage change commits
4. If reason = `stage-too-early` OR `bandwidth` → auto-add tag `re-engage-q` (quarterly re-engagement candidate)

## 6. Quarterly Re-engagement

**Why:** Passes today are Series A / B leads tomorrow. Touch them once a quarter with a milestone update.

**Trigger:**
- Tag `re-engage-q` present
- 90 days elapsed since `gr_last_touch_date`

**Action:**
1. Queue re-engagement email (snippet `re-engage-quarterly` — see `snippets.md`)
2. Create task for founder: "Q re-engage: {{contact.first_name}} ({{contact.org}}) — {{days_since_last_touch}} days silent"
3. Refresh `gr_last_touch_date` after founder sends

## 7. Meeting No-Show

**Why:** No-shows are a signal; catch them fast so follow-up is clean.

**Trigger:**
- Contact stage = `Meeting Scheduled`
- Meeting date + 24h elapsed
- Tag `meeting-held` NOT present

**Action:**
1. Notify founder: "Apparent no-show from {{contact.first_name}} on {{meeting_date}}"
2. Revert contact stage to `Responded`
3. Queue no-show follow-up (snippet `no-show-reschedule`)

## 8. Docsend Analytics Digest

**Why:** Docsend views signal engagement. Digest concentrates attention on who's actively reading.

**Trigger:**
- Weekly schedule: Sunday 6pm local time

**Action:**
1. Pull Docsend analytics for all active links (founder does this manually or via Docsend's Slack integration — GHL does not integrate natively)
2. Compose digest email to founder listing:
   - Top 5 viewers by re-open count this week
   - Any link with 0 views + created > 14 days ago (candidates to revoke)
   - Any link with > 100 views (investigate for leak or unusual enterprise circulation)
3. Founder reviews Monday morning and prioritizes follow-ups

## 9. Term Sheet Received → Counsel

**Why:** Term sheets decay fast. Counsel review is the bottleneck; get it started immediately.

**Trigger:**
- Contact stage moves to `Term Sheet`

**Action:**
1. Notify founder: "Term Sheet received from {{contact.org}} — counsel review needed within 72h"
2. Create task for counsel (if counsel is a GHL user) OR send task notification to counsel's email
3. Set 21-day timer: if still in Term Sheet stage, escalate to "stalled term sheet"

---

## Testing automations

Before activating any automation:

1. Create a test contact `ghl-test-contact@gentlereminder.test`
2. Walk the contact through the trigger conditions
3. Verify the action fires (check sent folder / tasks / tags)
4. Verify the action does NOT fire for edge cases (contact already has the tag, contact is Closed-Won, etc.)
5. Activate for production once verified

## Monitoring

- **Weekly:** spot-check 5 random contacts in each stage; verify tags + custom fields are consistent with automation expectations
- **Monthly:** review automation run logs (GHL exposes this in Workflows → Logs); flag any automation with > 10% failures
- **Quarterly:** sanity-check the full set — is each automation still useful, or is it adding noise?

## Related documents

| Document | Location |
|----------|----------|
| GHL Playbook README | `docs/crm-ghl/README.md` |
| Pipeline configuration | `docs/crm-ghl/pipeline-config.md` |
| Tag taxonomy | `docs/crm-ghl/tags-taxonomy.md` |
| Email snippets (referenced by automations) | `docs/crm-ghl/snippets.md` |
