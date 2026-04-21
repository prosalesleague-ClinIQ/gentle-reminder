# GHL Email Snippets

**Purpose:** Ready-to-paste email templates formatted for GHL's snippet library, each mapped to an existing entry in `apps/pitch-site/src/content/response-templates.ts` (Phase 37) when applicable.
**Merge fields:** GHL uses `{{contact.first_name}}`, `{{contact.custom_field_name}}`, `{{user.first_name}}`, etc. See GHL docs for the full list.

---

## Snippet index

| Snippet ID | Purpose | Source template |
|-----------|---------|-----------------|
| `cold-patent-attorney-carson` | Patent attorney cold outreach (Carson) | `send-priority.ts#send-carson` |
| `cold-patent-attorney-wojcik` | Patent attorney cold outreach (Wojcik) | `send-priority.ts#send-wojcik` |
| `cold-patent-attorney-miller` | Patent attorney cold outreach (Miller) | `send-priority.ts#send-miller-ip` |
| `materials-tier-1` | Send pitch deck + exec summary | response-templates.ts#inv-request-deck |
| `followup-day-7` | No-response 7-day chase | response-templates.ts#no-response-followup |
| `nda-chase` | Chase counterparty NDA signature | (new — GHL only) |
| `tier-2-grant` | Grant Tier 2 data room access post-NDA | response-templates.ts#inv-request-data-room |
| `re-engage-quarterly` | Quarterly re-engage closed-lost with milestone | (new — GHL only) |
| `no-show-reschedule` | Meeting no-show follow-up | (new — GHL only) |
| `intro-warm-received` | Response when connector intros us | response-templates.ts#warm-intro-accepted |
| `passed-polite-thanks` | Response to polite pass | response-templates.ts#inv-passed |

---

## Snippet bodies

### materials-tier-1

**Subject:** Re: {{custom.original_subject}} — pitch deck + executive summary attached

**Body:**

```
Hi {{contact.first_name}},

Attached for your review:

1. 16-slide pitch deck (PDF) — https://gentle-reminder-pitch.vercel.app/Gentle-Reminder-Pitch-Deck.pdf
2. 1-page executive summary (PDF) — https://gentle-reminder-pitch.vercel.app/Gentle-Reminder-Exec-Summary.pdf

Highlights:
- 23 USPTO provisional patents in flight (public IP overview at /ip)
- Full FDA SaMD documentation complete (IEC 62304, ISO 14971, QMS, Part 11, STRIDE) + IRB-ready clinical validation package (CVP-001 / ICF-001 / DMP-001 / SMP-001)
- Production platform: 53K+ LOC, 5 deployed apps, 10 languages, FHIR R4
- Raising $5M seed at $25M post-money
- 12-month runway to Series A triggers (510(k) submission, 3 facility pilots, $2-3M ARR)

Financial model + cap table available under NDA.

Happy to set up a 30-minute call once you've had a chance to review — calendar: {{user.calendar_link}}

--
Note on entity status: We're finalizing our Delaware C-Corp formation this week. Any NDA or engagement letter will execute under the incorporated entity once filed — anticipated within 7 days.

Best,
Christo Mac
Founder, Gentle Reminder (Delaware C-Corp formation in final stages)
mack@matrixadvancedsolutions.com
```

**When to use:** Meeting Scheduled automation (auto-prep); also manual use when reply requests materials.

### followup-day-7

**Subject:** Re: {{custom.original_subject}} — quick follow-up

**Body:**

```
Hi {{contact.first_name}},

Following up on last week's note — know your inbox is busy.

Since then we've {{custom.new_milestone}}.

If async works better than a call, our investor FAQ covers 25 anticipated questions in short + detailed format: https://gentle-reminder-pitch.vercel.app/private/investor-faq

Either way, I'd value your critique, even 10 minutes on the phone.

--
Note on entity status: We're finalizing our Delaware C-Corp formation this week. Any NDA or engagement letter will execute once filed — anticipated within 7 days.

Best,
Christo Mac
Founder, Gentle Reminder (Delaware C-Corp formation in final stages)
mack@matrixadvancedsolutions.com
```

**Mapped to:** `response-templates.ts#no-response-followup`

### nda-chase

**Subject:** Re: {{custom.original_subject}} — NDA quick check

**Body:**

```
Hi {{contact.first_name}},

Quick check-in on the NDA we redlined — is there anything your counsel flagged that I can address? Happy to hop on a 10-min call to walk through the template if that speeds things up.

For context: the redline is a mutual NDA with 3-year term and 5-year survival on confidential information, standard Delaware governing law. If your team prefers their template, send it over and I'll turn a redline around within 24 hours.

--
Note on entity status: We're finalizing our Delaware C-Corp formation this week. NDA execution will happen under the incorporated entity — targeting execution within 7 days.

Best,
Christo Mac
Founder, Gentle Reminder (Delaware C-Corp formation in final stages)
mack@matrixadvancedsolutions.com
```

**When to use:** NDA Sent → 3-Day Chase automation.

### tier-2-grant

**Subject:** Re: {{custom.original_subject}} — data room access granted

**Body:**

```
Hi {{contact.first_name}},

NDA received with thanks — here's the Docsend link for Tier 2 diligence:

{{custom.docsend_link}}

Tier 2 contents:
- Full IP portfolio with claim language (all 23 provisionals)
- FDA SaMD documentation (IEC 62304, ISO 14971, 13485, Part 11, STRIDE, Algorithm Transparency)
- Clinical validation protocol + IRB companion docs
- 5-year financial model
- Cap table (current state)
- 510(k) predicate analysis (K201738 Linus Health)

The link is specific to your email — if others on your team need access, please send me their emails and I'll issue per-viewer links.

Happy to schedule a 30-minute diligence call once you've had a chance to orient. Top 3 diligence topics from VCs at this stage have been: IP moat depth, regulatory pathway timeline, and unit economics — I can go deep on any of them.

Best,
Christo Mac
Founder & CEO/COO, Gentle Reminder
mack@matrixadvancedsolutions.com
```

**Mapped to:** `response-templates.ts#inv-request-data-room` (adapted for post-NDA)

**NOTE:** This snippet assumes entity is formed. Pre-entity, the NDA is in redline state and Tier 2 access isn't issued yet.

### re-engage-quarterly

**Subject:** Quarterly update — Gentle Reminder (since our last conversation)

**Body:**

```
Hi {{contact.first_name}},

Quarterly update. We last connected {{custom.days_since_last_touch}} days ago — wanted to share what's moved in case the fit has changed on your side.

Since our last conversation:
- {{custom.milestone_1}}
- {{custom.milestone_2}}
- {{custom.milestone_3}}

We're currently in {{custom.current_stage}} — {{custom.stage_detail}}.

If any of this changes the picture for your fund (or your portfolio might be a fit), I'd love to reconnect. No pressure either way — just wanted to keep you in the loop as a friend of the company.

Best,
Christo Mac
Founder & CEO/COO, Gentle Reminder
mack@matrixadvancedsolutions.com
https://gentle-reminder-pitch.vercel.app
```

**When to use:** Quarterly Re-engagement automation — for Closed Lost contacts tagged `re-engage-q`.

### no-show-reschedule

**Subject:** Re: our {{custom.day_of_week}} meeting — no rush

**Body:**

```
Hi {{contact.first_name}},

I was available for our call today — no stress at all if it slipped. Happy to re-book whenever works for you:

{{user.calendar_link}}

Or reply with a few times and I'll send an invite.

Best,
Christo Mac
Founder & CEO/COO, Gentle Reminder
mack@matrixadvancedsolutions.com
```

**When to use:** Meeting No-Show automation. Low-key, no guilt, makes re-booking frictionless.

### passed-polite-thanks

**Subject:** Re: {{custom.original_subject}} — thanks for the honest note

**Body:**

```
Hi {{contact.first_name}},

Thanks for the honest note — and for the fast response, it's appreciated.

Two quick asks if you're open:

1. Would you share what would change for this to be a fit? — e.g., stage, traction milestone, commercialization evidence. Helps calibrate for the next conversation.

2. Is there a peer fund or partner in your network you'd suggest that might be a closer fit? Happy to send a warm intro referencing your pass.

No pressure on either. I'll keep you posted on our milestones — would welcome the chance to revisit post-510(k) submission or Series A.

Best,
Christo Mac
Founder & CEO/COO, Gentle Reminder
mack@matrixadvancedsolutions.com
```

**Mapped to:** `response-templates.ts#inv-passed`

### cold-patent-attorney-carson / -wojcik / -miller

For these, the body lives in `apps/pitch-site/src/content/send-priority.ts` — copy that body into the GHL snippet. All three include the PRE-ENTITY disclosure block.

---

## Snippet installation in GHL

1. GHL → Settings → Snippets (or Custom Values)
2. For each snippet: create with the `snippet-id` as the name, paste body, save
3. Merge fields use GHL's `{{contact.first_name}}` syntax — if source template uses `{{firstName}}`, find-and-replace before pasting
4. Test each snippet against a test contact before using in production

## Related documents

| Document | Location |
|----------|----------|
| GHL Playbook README | `docs/crm-ghl/README.md` |
| Pipeline configuration | `docs/crm-ghl/pipeline-config.md` |
| Tag taxonomy | `docs/crm-ghl/tags-taxonomy.md` |
| Automation recipes | `docs/crm-ghl/automations.md` |
| Source response templates | `apps/pitch-site/src/content/response-templates.ts` |
| Source send-priority outreach | `apps/pitch-site/src/content/send-priority.ts` |
