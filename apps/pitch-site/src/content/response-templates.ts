/**
 * Response Templates — pre-drafted replies for common outreach scenarios
 *
 * When advisors/investors/partners reply to outreach, use these to accelerate
 * response time. Keep replies under 24 hours during active fundraise.
 *
 * All signed as Christo Mac · mack@matrixadvancedsolutions.com
 */

export type ResponseScenario =
  | 'interested-schedule-call'
  | 'interested-need-info'
  | 'request-nda'
  | 'request-deck'
  | 'request-data-room'
  | 'request-deep-dive'
  | 'passed-polite'
  | 'no-response-followup'
  | 'warm-intro-accepted'
  | 'grant-specialist-terms-reply'
  | 'patent-attorney-fee-quote'
  | 'advisor-equity-interest';

export type ResponseCategory = 'investor' | 'advisor' | 'vendor' | 'warm-lead';

export interface ResponseTemplate {
  id: string;
  scenario: ResponseScenario;
  category: ResponseCategory;
  label: string;
  triggerSignal: string;
  subject: string;
  body: string;
  ghlTag: string;
  ghlStage: string;
  notes: string;
}

const SIGNATURE = `

Best,
Christo Mac
Founder & CEO/COO, Gentle Reminder
mack@matrixadvancedsolutions.com
https://gentle-reminder-pitch.vercel.app`;

export const RESPONSE_TEMPLATES: ResponseTemplate[] = [
  // ============================================================
  // INVESTOR RESPONSES
  // ============================================================
  {
    id: 'inv-schedule-call',
    scenario: 'interested-schedule-call',
    category: 'investor',
    label: 'Investor — Interested, wants call',
    triggerSignal: 'VC replies "Interested — can we set up a call?" or "Happy to chat"',
    subject: 'Re: {{original_subject}} — scheduling',
    body: `Hi {{firstName}},

Great — thank you for the quick response.

I've kept my calendar flexible for investor conversations this week and next. Here are three 30-minute windows that work on my end:

- {{day_1}}, {{time_1}} (Pacific)
- {{day_2}}, {{time_2}} (Pacific)
- {{day_3}}, {{time_3}} (Pacific)

If none of those work, here's my Calendly for a self-service booking: {{calendly_url}}

Ahead of the call, a public overview: https://gentle-reminder-pitch.vercel.app
IP portfolio (public-safe): https://gentle-reminder-pitch.vercel.app/ip
Investor track: https://gentle-reminder-pitch.vercel.app/investors

Let me know what works — looking forward to it.${SIGNATURE}`,
    ghlTag: 'investor-meeting-scheduled',
    ghlStage: 'Discovery Call',
    notes: 'Offer 3 specific times + fallback Calendly. Add pitch site links. Update GHL stage to "Discovery Call".',
  },

  {
    id: 'inv-request-deck',
    scenario: 'request-deck',
    category: 'investor',
    label: 'Investor — Asks for deck / one-pager',
    triggerSignal: 'Reply says "Can you send the deck?" or "Send a one-pager first"',
    subject: 'Re: {{original_subject}} — materials attached',
    body: `Hi {{firstName}},

Attached:
1. Pitch deck (16 slides, PDF export)
2. Executive summary (1 page)

Highlights:
- 23 USPTO provisional patents (IP portfolio at /ip on the pitch site)
- Full FDA SaMD documentation complete (IEC 62304, ISO 14971, QMS, 21 CFR Part 11)
- Production platform: 53K+ LOC, 5 deployed applications, 10 languages, FHIR R4
- Raising $5M seed at $25M post-money
- 12-month runway to Series A triggers (510(k) submission, 3 facility pilots, $2-3M ARR)

Financial model + cap table available under NDA.

Happy to schedule a 30-minute call when you've had a chance to review. My schedule: {{calendly_url}}${SIGNATURE}`,
    ghlTag: 'investor-materials-sent',
    ghlStage: 'Materials Shared',
    notes: 'Attach actual PPTX (download from /Gentle-Reminder-Pitch-Deck.pptx) and exec summary PDF. Update GHL stage.',
  },

  {
    id: 'inv-request-data-room',
    scenario: 'request-data-room',
    category: 'investor',
    label: 'Investor — Ready for data room / NDA',
    triggerSignal: 'Reply says "We\'d like to go deeper" or "Do you have a data room?"',
    subject: 'Re: {{original_subject}} — data room access + NDA',
    body: `Hi {{firstName}},

Ready to open the data room. To keep things clean:

**Step 1:** Sign our mutual NDA (attached).

**Step 2:** Once signed, I'll send a Docsend link with tiered access:
- Tier 1 (now): Pitch deck, executive summary, public IP portfolio, team bios
- Tier 2 (post-NDA): Full IP portfolio with claims, FDA SaMD documentation, clinical validation protocol, financial model, cap table
- Tier 3 (post-term sheet): Codebase architecture, trade-secret parameters, full investor references

The NDA is standard (3-year term, 5-year survival on confidential info, mutual obligations). Happy to address any revision requests via your counsel.

Is there a particular area of diligence I should prioritize — regulatory, IP, financials, or clinical? Happy to jump on a call with your analyst in parallel.${SIGNATURE}`,
    ghlTag: 'investor-nda-sent',
    ghlStage: 'NDA Pending',
    notes: 'Attach mutual NDA (docs/private/nda). Prepare Docsend tiered link. Update GHL to "NDA Pending".',
  },

  {
    id: 'inv-need-info',
    scenario: 'interested-need-info',
    category: 'investor',
    label: 'Investor — Interested, specific questions',
    triggerSignal: 'Reply asks specific questions about FDA, IP, team, market, etc.',
    subject: 'Re: {{original_subject}} — addressing your questions',
    body: `Hi {{firstName}},

Good questions — answering inline:

**{{question_1}}**
{{answer_1}}

**{{question_2}}**
{{answer_2}}

For comprehensive Q&A reference: https://gentle-reminder-pitch.vercel.app/private/investor-faq (25 anticipated questions with short + detailed answers)

If any answer raises further questions, happy to schedule a 30-minute call to go deeper: {{calendly_url}}${SIGNATURE}`,
    ghlTag: 'investor-diligence-active',
    ghlStage: 'Diligence',
    notes: 'Use the Investor FAQ at /private/investor-faq as reference. Copy the 30-second answer; expand if they go detailed.',
  },

  {
    id: 'inv-passed',
    scenario: 'passed-polite',
    category: 'investor',
    label: 'Investor — Passed politely',
    triggerSignal: 'Reply says "Not a fit right now" / "Team bandwidth" / "Outside thesis"',
    subject: 'Re: {{original_subject}}',
    body: `Hi {{firstName}},

Thanks for the honest note — and for the fast response, it's appreciated.

Two asks, if you're open:

1. **Would you be willing to share what would change for this to be a fit?** — e.g., stage, traction milestone, commercialization evidence. Helps me calibrate for the next conversation with you (or your partner network).

2. **Is there a peer fund or partner** in your network you'd suggest that might be a closer fit? Happy to send them a warm intro referencing your pass.

No pressure on either. I'll keep you posted on our milestones — would welcome the chance to revisit post-510(k) submission or Series A.${SIGNATURE}`,
    ghlTag: 'investor-passed',
    ghlStage: 'Closed — Passed',
    notes: 'Always ask for (a) feedback on what would change, (b) referral. Don\'t burn the relationship — many passes become Series A / B leads later.',
  },

  // ============================================================
  // ADVISOR RESPONSES
  // ============================================================
  {
    id: 'adv-interested',
    scenario: 'advisor-equity-interest',
    category: 'advisor',
    label: 'Advisor — Interested, wants to discuss',
    triggerSignal: 'Clinical/tech advisor replies "Happy to chat" or "Interested in helping"',
    subject: 'Re: {{original_subject}} — thank you, scheduling',
    body: `Dear Dr. {{lastName}},

Thank you — genuinely honored you're open to discussing.

To make the most of your time, let me send a few materials in advance:
1. Public overview: https://gentle-reminder-pitch.vercel.app
2. IP portfolio (public-safe): https://gentle-reminder-pitch.vercel.app/ip
3. Clinical validation protocol (draft, under NDA if you'd like the full version)

For the call itself, three 30-minute windows that work:
- {{day_1}}, {{time_1}} (your timezone)
- {{day_2}}, {{time_2}} (your timezone)
- {{day_3}}, {{time_3}} (your timezone)

Self-book alternative: {{calendly_url}}

Questions I'd particularly value your perspective on:
1. Our Specific Aim 1 design (concurrent validation of the three-state feedback system vs. MMSE/MoCA/ADAS-Cog) — is the 60-patient cohort adequately powered for your confidence threshold?
2. Is our three-state feedback architecture something you'd be comfortable endorsing as clinically meaningful, or are there qualifiers you'd want built into the validation study?
3. Would you consider serving on our Clinical Advisory Board? Standard advisor equity (0.25-0.5%) + quarterly honorarium.

Looking forward,${SIGNATURE}`,
    ghlTag: 'advisor-call-scheduled',
    ghlStage: 'Advisor — Discovery',
    notes: 'Advisor outreach is different — more deferential, more substantive. Ask specific technical questions to show you respect their expertise.',
  },

  {
    id: 'adv-request-deep-dive',
    scenario: 'request-deep-dive',
    category: 'advisor',
    label: 'Advisor — Wants technical deep-dive',
    triggerSignal: 'Advisor reply says "Can you explain the {{specific concept}} in more detail?"',
    subject: 'Re: {{original_subject}} — {{topic}} technical detail',
    body: `Dr. {{lastName}},

Great question. On {{topic}}:

{{technical_explanation}}

The full provisional patent specification for {{patent_id}} covers this in depth, and I can share it under NDA if helpful.

For additional context:
- Related academic literature: {{citation_1}}
- Our prior art analysis: https://github.com/prosalesleague-ClinIQ/gentle-reminder/blob/main/docs/ip/PRIOR-ART-SEARCH.md

I'd be grateful for your critique — particularly on {{specific_question_for_them}}.${SIGNATURE}`,
    ghlTag: 'advisor-technical-discussion',
    ghlStage: 'Advisor — Diligence',
    notes: 'Tech deep-dives are an opening to establish credibility. Reference specific patents and prior art analysis.',
  },

  // ============================================================
  // VENDOR (PATENT ATTORNEY / GRANT SPECIALIST / CFO) RESPONSES
  // ============================================================
  {
    id: 'vendor-patent-fee-quote',
    scenario: 'patent-attorney-fee-quote',
    category: 'vendor',
    label: 'Patent Attorney — Replied with fee quote',
    triggerSignal: 'Carson / Wojcik / Miller IP sends their fee structure',
    subject: 'Re: {{original_subject}} — next steps',
    body: `Hi {{firstName}},

Thank you — terms look reasonable. Confirming my understanding:

- Fee per provisional filing: {{amount}}
- Structure: {{equity_deferred_cash}}
- Estimated timeline: {{timeline_per_filing}}
- Scope: {{scope_included}}

Next steps from my side:
1. I'll send the mutual NDA and signed engagement letter this week
2. After NDA execution, I'll provide full IP docket access (23 drafts + prior art + inventor disclosure)
3. Tier 1 filings start within 2 weeks of engagement

A few clarifying questions:
1. Do you typically handle USPTO fees directly or do we pay those separately via Pay.gov?
2. For non-provisional conversion (~9-12 months out), is there a separate rate quote?
3. Can you provide 2 references from past startup clients in medical device/software?

I'll have our co-founder (Leo Kinsman, CTO) CC'd on subsequent correspondence.${SIGNATURE}`,
    ghlTag: 'patent-fee-negotiation',
    ghlStage: 'Patent Attorney — Negotiating Terms',
    notes: 'Get fee schedule in writing. Confirm USPTO fees separately. Ask for references. Prepare NDA + engagement letter in parallel.',
  },

  {
    id: 'vendor-grant-terms',
    scenario: 'grant-specialist-terms-reply',
    category: 'vendor',
    label: 'Grant Specialist — Sent contingency terms',
    triggerSignal: 'TurboSBIR / Blue Haven / InteliSpark provides their fee structure',
    subject: 'Re: {{original_subject}} — terms clarification',
    body: `Hi {{firstName}},

Terms received. Before we proceed, I want to confirm a few details:

1. **Success fee percentage:** {{confirmed_percentage}}% of awarded grant, paid upon NIH Notice of Award. Correct?
2. **Any upfront fees:** {{platform_fee_amount_if_any}} for platform/software/deposit — separate from the success fee?
3. **Scope:** Writing + review + submission? Or review-only?
4. **Timeline:** Engagement to submission = {{timeline}} weeks? We're targeting the {{deadline}} cycle.
5. **Win rate:** What's your Phase I success rate for medical device / SaMD applications in the last 3 cycles?
6. **References:** Can you share 2 past clients (ideally medical device or digital health) who've won Phase I through your firm?

For our application specifically:
- NIA SBIR Phase I draft is complete (Specific Aims, Research Strategy, Commercialization Plan, Budget — all sections). Available for your review under NDA.
- Academic PI recruitment is in flight (UCSF Memory and Aging Center, MGH Memory Disorders, or Emory ADRC are our top candidates).

Happy to schedule a 30-min call to finalize: {{calendly_url}}${SIGNATURE}`,
    ghlTag: 'grant-specialist-evaluating',
    ghlStage: 'Grant Specialist — Diligence',
    notes: 'Never sign without: win rate, references, fee schedule in writing, hidden-fee disclosure, scope clarity.',
  },

  {
    id: 'vendor-cfo-intake',
    scenario: 'interested-schedule-call',
    category: 'vendor',
    label: 'Fractional CFO — Ready for intake call',
    triggerSignal: 'Healthcare CFO / Burkland / CFO Advisors replies with availability',
    subject: 'Re: {{original_subject}} — intake call confirmed',
    body: `Hi {{firstName}},

Looking forward to it. For the intake call, I'll come prepared with:

1. Current company state (pre-seed, 23 USPTO provisional patents filed, FDA SaMD documentation complete)
2. Target seed raise: $5M at $25M post-money, 4-6 month close target
3. Key current financial lifts:
   - Pre-seed bookkeeping → audit readiness
   - Financial model for investor data room (5-year projections complete)
   - Cap table management (currently in {{Carta/Pulley/spreadsheet}})
   - Grant fiscal compliance (NIH SBIR, BrightFocus, Alzheimer's Association in flight)

Questions I'd like to cover:
1. Your healthcare/SaMD client base — 2-3 reference clients in similar stage
2. Proposed engagement structure (hours/month, retainer range, scope)
3. Onboarding timeline
4. How you integrate with CEO/COO (me) and CTO (Leo Kinsman) on financial modeling and cap table

See you {{date_time}}.${SIGNATURE}`,
    ghlTag: 'cfo-intake-scheduled',
    ghlStage: 'CFO — Intake Call',
    notes: 'For CFO intake, show financial discipline. Reference existing cap table tool and financial model.',
  },

  // ============================================================
  // META / OPERATIONAL
  // ============================================================
  {
    id: 'warm-intro-accepted',
    scenario: 'warm-intro-accepted',
    category: 'warm-lead',
    label: 'Warm intro — Connector responded, introducing us',
    triggerSignal: 'Mutual connection replies "I\'ll introduce you to X" or "Here\'s Y\'s contact"',
    subject: 'Re: introduction to {{target_name}}',
    body: `Hi {{connector_name}},

Thank you so much — appreciate the intro.

{{target_name}} / Dr. {{target_name}}: Great to meet you via {{connector_name}}.

I'm Christo Mac, founder of Gentle Reminder — clinical-grade dementia care platform with 23 patents and FDA SaMD pathway. {{connector_name}} suggested we'd have an aligned conversation.

To save you time — here's the 60-second TL;DR:
- We've built the first architecturally dementia-safe cognitive assessment platform (23 patents, full FDA docs complete)
- Raising $5M seed; actively meeting with {{investor_type}} funds
- Would love your perspective on {{specific_ask}}

Public overview: https://gentle-reminder-pitch.vercel.app

Would a 30-minute call work in the next 2 weeks? Here are three windows: {{times}}. Or self-book: {{calendly_url}}.

Thanks again, {{connector_name}}. I'll keep you posted.${SIGNATURE}`,
    ghlTag: 'warm-intro-accepted',
    ghlStage: 'Warm Lead — Contacted',
    notes: 'Warm intros convert 3-5x better than cold. Write the intro reply as a 3-way email: thank the connector, introduce yourself to the target, set up the call.',
  },

  {
    id: 'no-response-followup',
    scenario: 'no-response-followup',
    category: 'investor',
    label: 'No response — 7-day follow-up',
    triggerSignal: 'Your outreach has been silent for 7+ days',
    subject: 'Re: {{original_subject}} — quick follow-up',
    body: `Hi {{firstName}},

Following up on my note from last week — know your inbox is busy.

Since then, we've {{new_milestone — e.g., filed our Tier 1 provisional patents, confirmed academic PI collaboration with UCSF MAC, received positive feedback from Dr. X at Harvard}}.

I know a 20-minute call may not fit your schedule — happy to do 10 minutes, or send our IP portfolio deep-dive and investor FAQ if asynchronous is better.

IP portfolio: https://gentle-reminder-pitch.vercel.app/ip
Investor FAQ: https://gentle-reminder-pitch.vercel.app/private/investor-faq

Either way — would value your critique.${SIGNATURE}`,
    ghlTag: 'followup-day7',
    ghlStage: 'Following Up',
    notes: 'Reference a new milestone. Offer shorter time commitment (10 min vs 20). Provide async option (FAQ / portfolio link).',
  },
];

export const CATEGORY_COLORS: Record<ResponseCategory, string> = {
  investor: '#58a6ff',
  advisor: '#3fb950',
  vendor: '#d29922',
  'warm-lead': '#a371f7',
};

export const CATEGORY_LABELS: Record<ResponseCategory, string> = {
  investor: '💼 Investor',
  advisor: '🏥 Advisor',
  vendor: '📋 Vendor (Patent/Grant/CFO)',
  'warm-lead': '🔗 Warm Lead',
};
