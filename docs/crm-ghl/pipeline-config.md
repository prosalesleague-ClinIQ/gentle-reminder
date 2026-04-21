# GHL Pipeline Configuration

**Pipeline name:** Gentle Reminder Seed Fundraise (2026)
**Object:** Opportunity (one per contact × engagement)
**Stages:** 11

---

## Stage flow

```
Cold → Contacted → Responded → Meeting Scheduled → Materials Sent
   → NDA Sent → NDA Signed → Diligence → Term Sheet
   → Closed Won / Closed Lost
```

Each stage has: **entry criteria**, **exit criteria**, **owner**, **SLA** (maximum time in stage before escalation), **required custom field values**.

---

## 01 — Cold

- **Entry:** contact imported from outreach-plan.ts or added manually, not yet contacted
- **Exit:** first outbound email / DM sent → move to Contacted
- **Owner:** Founder
- **SLA:** 14 days (contact goes stale if not touched within 2 weeks)
- **Required fields on exit:** `gr_first_touch_date` = today

## 02 — Contacted

- **Entry:** first outbound send completed
- **Exit:** reply received → Responded  OR  no reply for 30 days → Closed Lost with reason "no-response"
- **Owner:** Founder
- **SLA:** 30 days max
- **Required fields on exit:** `gr_last_touch_date` updated to reply date if Responded

## 03 — Responded

- **Entry:** counterparty replied (any content)
- **Exit:** meeting scheduled → Meeting Scheduled  OR  "not a fit" → Closed Lost  OR  request for materials → Materials Sent
- **Owner:** Founder
- **SLA:** 5 business days (reply fatigue kicks in after a week)
- **Required fields on exit:** `gr_next_step` must be populated

## 04 — Meeting Scheduled

- **Entry:** calendar event booked (Calendly, Zoom, in-person)
- **Exit:** meeting held → Materials Sent OR Diligence OR Closed Lost  OR  no-show → back to Responded (one reschedule) then Closed Lost
- **Owner:** Founder
- **SLA:** meeting date - 2 days (must confirm 48h out)
- **Required fields on exit:** meeting notes attached to contact

## 05 — Materials Sent

- **Entry:** Tier 1 materials delivered (pitch deck + exec summary), or answers to specific diligence questions
- **Exit:** counterparty requests NDA → NDA Sent  OR  counterparty requests deeper materials under NDA → NDA Sent  OR  counterparty passes → Closed Lost  OR  30 days no action → follow-up automation
- **Owner:** Founder
- **SLA:** 14 days (chase at day 7 and day 14 automatically)
- **Required fields on exit:** `gr_materials_access_tier` = "tier-1"

## 06 — NDA Sent

- **Entry:** mutual or unilateral NDA sent for signature (redline state is fine)
- **Exit:** NDA countersigned → NDA Signed  OR  counterparty refuses → Closed Lost (rare)  OR  NDA stuck in redlines > 21 days → escalate
- **Owner:** Founder
- **SLA:** 21 days
- **Required fields on exit:** `gr_nda_status` = "signed"; signed PDF uploaded
- **Pre-entity note:** during Week 0, this stage represents redline-sent-not-signed; actual execution waits for DE C-Corp formation (see `docs/legal/pre-entity-outreach-safety.md`)

## 07 — NDA Signed

- **Entry:** NDA fully countersigned, dated, stored
- **Exit:** Tier 2 materials delivered → Diligence  OR  counterparty goes quiet > 30 days → revoke + Closed Lost
- **Owner:** Founder
- **SLA:** 3 business days (deliver Tier 2 quickly)
- **Required fields on exit:** `gr_materials_access_tier` = "tier-2"; Docsend link created + logged in disclosure-log-template.md

## 08 — Diligence

- **Entry:** Tier 2 data room open, counterparty actively reviewing
- **Exit:** LOI / term sheet issued → Term Sheet  OR  counterparty passes → Closed Lost  OR  60 days of diligence with no decision → escalate
- **Owner:** Founder + CFO (if applicable)
- **SLA:** 60 days (VC diligence typically 30-60 days)
- **Required fields on exit:** all diligence asks logged in `gr_notes_diligence_asks`

## 09 — Term Sheet

- **Entry:** written LOI or term sheet in hand
- **Exit:** signed → Closed Won  OR  withdrawn → back to Diligence OR Closed Lost
- **Owner:** Founder + counsel
- **SLA:** 21 days (term sheets go stale if not actively negotiated)
- **Required fields on exit:** term sheet PDF uploaded to opportunity; `gr_check_size` = final

## 10 — Closed Won

- **Entry:** term sheet signed + wire received OR formal close completed
- **Exit:** none — this is terminal
- **Owner:** Founder + CFO
- **SLA:** none

## 11 — Closed Lost

- **Entry:** counterparty passes, goes silent > 60 days, or relationship ends
- **Exit:** quarterly re-engagement automation may re-open as Cold if warranted
- **Owner:** Founder
- **SLA:** none
- **Required fields on exit:** `gr_lost_reason` must be populated (required by automation)

---

## Summary table

| # | Stage | Typical duration | Owner | Required on exit |
|---|-------|------------------|-------|------------------|
| 01 | Cold | ≤ 14 days | Founder | `gr_first_touch_date` |
| 02 | Contacted | ≤ 30 days | Founder | `gr_last_touch_date` |
| 03 | Responded | ≤ 5 days | Founder | `gr_next_step` |
| 04 | Meeting Scheduled | meeting - 2d | Founder | meeting notes |
| 05 | Materials Sent | ≤ 14 days | Founder | `gr_materials_access_tier` = tier-1 |
| 06 | NDA Sent | ≤ 21 days | Founder | `gr_nda_status` = signed |
| 07 | NDA Signed | ≤ 3 days | Founder | `gr_materials_access_tier` = tier-2 |
| 08 | Diligence | ≤ 60 days | Founder + CFO | diligence asks logged |
| 09 | Term Sheet | ≤ 21 days | Founder + counsel | signed term sheet PDF |
| 10 | Closed Won | — | Founder + CFO | — |
| 11 | Closed Lost | — | Founder | `gr_lost_reason` |

## GHL setup steps

1. Settings → Opportunities → create Pipeline "Gentle Reminder Seed Fundraise (2026)"
2. Add the 11 stages in the order above
3. For each stage, configure:
   - Probability (% assigned to the stage for forecasting): 5, 10, 15, 25, 35, 45, 55, 70, 85, 100, 0
   - Color (optional but helps kanban view): cold-gray, contacted-blue, responded-cyan, meeting-green, materials-teal, nda-sent-yellow, nda-signed-orange, diligence-amber, term-sheet-red, won-emerald, lost-slate
4. Set default stage = "Cold"
5. Toggle "Require `gr_next_step` to advance past Stage 03" (GHL custom validation, if available)
6. Toggle "Require `gr_lost_reason` to enter Closed Lost"

## Related documents

| Document | Location |
|----------|----------|
| GHL Playbook README | `docs/crm-ghl/README.md` |
| Tag taxonomy | `docs/crm-ghl/tags-taxonomy.md` |
| Automation recipes | `docs/crm-ghl/automations.md` |
| Email snippets | `docs/crm-ghl/snippets.md` |
