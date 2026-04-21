/**
 * Advisor / Fractional CFO Outreach Templates
 * Email + LinkedIn DM + Text message variants
 *
 * Signed: Christo Mack, Founder & CEO
 * Customize {{placeholders}} before sending.
 */

export interface OutreachTemplate {
  id: string;
  label: string;
  channel: 'email' | 'linkedin-dm' | 'linkedin-inmail' | 'text-sms' | 'twitter-dm';
  audience: string;
  subject?: string;
  body: string;
  characterCount: number;
  followup?: string;
  notes: string;
}

export const ADVISOR_OUTREACH_TEMPLATES: OutreachTemplate[] = [
  // ============================================================
  // EMAIL — CLINICAL NEUROSCIENCE ADVISOR
  // ============================================================
  {
    id: 'email-clinical-advisor',
    label: 'Email — Clinical Neuroscience Advisor',
    channel: 'email',
    audience: 'UCSF, Harvard, Mayo, Hopkins, Emory — faculty-level clinical advisors',
    subject: 'Advisor inquiry — dementia platform with 23-patent IP + FDA pathway',
    body: `Dear Dr. {{lastName}},

I'm Christo Mack, founder and CEO of Gentle Reminder, a clinical-grade dementia care platform. I'm reaching out because your work on {{their_specific_research}} directly informs what we're trying to build — and your guidance would be transformative.

**What we've built:**
- 23 USPTO provisional patents including a three-state positive-only cognitive assessment system that architecturally prevents anxiety-inducing pass/fail feedback (addressing a documented clinical problem with MMSE/MoCA)
- Full FDA SaMD documentation complete (IEC 62304, ISO 14971 FMEA, ISO 13485 QMS, 21 CFR Part 11)
- Production platform: 53,000+ lines of code, 5 deployed applications, FHIR R4 integration, 10 languages
- 510(k) predicate identified (K201738 Linus Health)

**Why I'm reaching out specifically to you:**
{{personalized_reason}} — e.g., "Your 2022 paper on cognitive biomarkers predicted exactly the decline patterns our composite biomarker engine tracks" OR "Your leadership of the {{ADRC/program name}} would make validation at your center scientifically definitive."

**The ask:**
I'd love a 30-minute introductory call to discuss our approach. If there's alignment, I'd invite you to join our Clinical Advisory Board — a small group of 3-5 leading dementia researchers guiding our clinical validation strategy, FDA submission, and Phase II planning. Standard advisor equity (0.25-0.5%) and meaningful participation in shaping a platform that could reach millions of patients on anti-amyloid therapy.

A public overview of the platform and IP portfolio is at https://gentle-reminder-pitch.vercel.app/ip.

Would any 30-minute window in the next 2 weeks work? I can share a brief technical deck in advance.

With admiration and respect,
Christo Mack
Founder & CEO, Gentle Reminder
mack@matrixadvancedsolutions.com | [phone]
https://www.linkedin.com/in/christomac`,
    characterCount: 1700,
    followup: 'Day 7: "Wanted to follow up on my note from last week — happy to work around your schedule." Day 14: Add new talking point (e.g., "just filed Tier 1 provisionals").',
    notes: 'Personalize the {{their_specific_research}} field with a SPECIFIC paper/project/study — generic emails to top clinicians get deleted. Warm intros via department admin or a mutual connection dramatically improve response rate.',
  },

  // ============================================================
  // EMAIL — TECH/AI ADVISOR
  // ============================================================
  {
    id: 'email-tech-ai-advisor',
    label: 'Email — Digital Health / AI Tech Advisor',
    channel: 'email',
    audience: 'Eric Topol, Atul Butte, Andrew Ng, operator-founders',
    subject: 'Dementia platform with patented AI — advisor inquiry',
    body: `Hi {{firstName}},

I'm Christo Mack, founder of Gentle Reminder — a clinical-grade dementia care platform designed from the algorithm up for neurodegenerative populations.

**Why this will interest you:** We've built something that, to our knowledge, doesn't exist — a cognitive assessment system that architecturally guarantees no negative feedback reaches the patient (a documented clinical problem in MMSE/MoCA). It's backed by 23 USPTO provisional patents and a production-ready platform (53K+ LOC, 5 apps, FHIR R4, 10 languages).

**Three technical innovations I'd love your perspective on:**
1. Three-state positive-only feedback system (CELEBRATED/GUIDED/SUPPORTED) — dual-channel data architecture separating patient UX from clinician analytics
2. Multimodal cognitive state classifier — speech + behavior + biometric with automatic weight redistribution when signals fail
3. Composite digital biomarker engine — 5 analyzers with medication-inversion logic

Full IP portfolio: https://gentle-reminder-pitch.vercel.app/ip

**The ask:** 20 minutes of your time for early feedback on the approach, and openness to an advisory relationship if there's alignment. We're raising $5M seed and filing 510(k) within 12 months. This could become the standard dementia assessment tool — or a cautionary tale. Your critique either way is valuable.

Would any 20-minute window work in the next 3 weeks?

Thanks,
Christo Mack
Founder & CEO, Gentle Reminder
mack@matrixadvancedsolutions.com`,
    characterCount: 1400,
    followup: 'Day 5 follow-up with a specific technical hook tied to their recent work.',
    notes: 'Tech advisors respond to specific technical detail and honest framing. Lead with what makes THIS specifically interesting to them.',
  },

  // ============================================================
  // LINKEDIN DM — SHORT VERSION
  // ============================================================
  {
    id: 'linkedin-dm-cold',
    label: 'LinkedIn DM — Cold Connection Request',
    channel: 'linkedin-dm',
    audience: 'Any advisory target',
    body: `Hi {{firstName}} — Christo Mack, founder of Gentle Reminder (clinical-grade dementia platform, 23 patents, FDA SaMD pathway). Your work on {{specific_topic}} directly informs what we're building. Would love 20 mins to share approach & get your feedback — advisor role available if aligned. Overview: gentle-reminder-pitch.vercel.app. Happy to work around your calendar. Thanks!`,
    characterCount: 395,
    followup: 'LinkedIn connection requests are capped at 300 chars; InMail allows longer. Keep this under 400 for universal use.',
    notes: 'LinkedIn DMs under 400 chars outperform longer messages. Lead with credential/mutual connection if possible. Include link to pitch site.',
  },

  // ============================================================
  // LINKEDIN INMAIL — LONGER VERSION
  // ============================================================
  {
    id: 'linkedin-inmail',
    label: 'LinkedIn InMail — Premium / Longer Message',
    channel: 'linkedin-inmail',
    audience: 'Senior targets where LinkedIn InMail (Premium) is used',
    subject: 'Advisor inquiry — dementia platform you\'ll find interesting',
    body: `Hi {{firstName}},

Christo Mack here, founder of Gentle Reminder — a clinical-grade dementia care platform with 23 USPTO provisional patents, full FDA SaMD documentation, and a production platform (53K+ LOC, 5 deployed apps).

Reaching out because your work on {{specific_topic}} makes you uniquely qualified to evaluate what we're building. Our core innovation: a three-state positive-only cognitive assessment system (CELEBRATED/GUIDED/SUPPORTED) that architecturally prevents the anxiety-inducing pass/fail feedback of MMSE/MoCA — a documented clinical problem that harms dementia patients.

**The ask:** 30-minute intro call. If there's alignment, I'd invite you to our advisory board (standard 0.25-0.5% equity, small high-impact group).

Overview: https://gentle-reminder-pitch.vercel.app/ip

Happy to work around your schedule. Would any 30-min window in the next 3 weeks fit?

With thanks,
Christo Mack
Founder & CEO, Gentle Reminder
mack@matrixadvancedsolutions.com`,
    characterCount: 1000,
    followup: 'Day 7: Soft follow-up with new milestone. Day 14: Try alternate channel (email or warm intro).',
    notes: 'InMail conversion rates 3-4× higher than free LinkedIn messages. Worth the LinkedIn Premium subscription during active outreach (~$80/mo).',
  },

  // ============================================================
  // TWITTER / X DM
  // ============================================================
  {
    id: 'twitter-dm',
    label: 'Twitter / X DM — Public Figures',
    channel: 'twitter-dm',
    audience: 'Eric Topol, Andy Slavitt, Halle Tecco, other active Twitter voices',
    body: `Hi @{{handle}} — Christo Mack, founder of Gentle Reminder (dementia platform, 23 patents, FDA SaMD pathway). Your take on {{recent_tweet_topic}} is exactly the lens we need. Would love 20 mins to share what we're building & hear your critique — and explore an advisor role if aligned. Pitch site: gentle-reminder-pitch.vercel.app

DM or email mack@matrixadvancedsolutions.com if open to a call.`,
    characterCount: 395,
    followup: 'Twitter DMs have no consistent follow-up pattern; one shot, then move to email if no response.',
    notes: 'Reference a SPECIFIC recent tweet or thread from them. Generic Twitter DMs are ignored.',
  },

  // ============================================================
  // TEXT / SMS — WARM CONTACT
  // ============================================================
  {
    id: 'text-warm',
    label: 'Text / SMS — Warm Contact (Phone Number Available)',
    channel: 'text-sms',
    audience: 'Anyone where you\'ve been given their phone by a mutual connection',
    body: `Hi {{firstName}} — Christo Mack. [Mutual connection name] suggested I reach out. I'm founder of Gentle Reminder, a dementia care platform with 23 patents + FDA pathway. Would love to share 10 minutes over coffee/call to get your feedback & explore advisor fit. Quick overview: gentle-reminder-pitch.vercel.app. What's your availability this week?`,
    characterCount: 350,
    followup: 'If no response in 48h, try a different channel (email).',
    notes: 'Never text a senior advisor without having been given the phone explicitly by them or a close mutual. Cold texts to purchased numbers = dead outreach + reputation damage.',
  },

  // ============================================================
  // FRACTIONAL CFO OUTREACH
  // ============================================================
  {
    id: 'email-fractional-cfo',
    label: 'Email — Fractional CFO Firm Inquiry',
    channel: 'email',
    audience: 'The Healthcare CFO, Burkland, Kruze, CFO Advisors, G-Squared',
    subject: 'Fractional CFO inquiry — pre-seed dementia SaMD platform, $5M raise planned',
    body: `Hi {{firstName}},

I'm Christo Mack, founder and CEO of Gentle Reminder — a clinical-grade dementia care platform in the FDA SaMD pathway. We're preparing a $5M seed round over the next 4-6 months and evaluating fractional CFO firms to support the process.

**Current state:**
- Delaware C-Corp in formation (Stripe Atlas / Clerky)
- 23 USPTO provisional patents drafted/filed
- Full FDA SaMD documentation (IEC 62304, ISO 14971, QMS, CFR Part 11)
- Production platform: 53K+ LOC, 5 deployed applications
- Core team: CEO/COO (me), CTO (Leo Kinsman), CFO (Chris Hamel), Commercial Director (Jayla Patzer)

**What we need from a fractional CFO:**
1. Seed-round fundraising support: financial model refinement, investor data room, diligence response
2. Pre-seed bookkeeping → seed-round audit readiness
3. Grant fiscal compliance (NIH SBIR, BrightFocus, Alzheimer's Association)
4. Cap table management
5. Ongoing CFO function through to post-seed hire

**Questions:**
1. Your typical engagement structure + monthly retainer range for pre-seed healthtech
2. Your experience with FDA-regulated software companies (SaMD specifically)
3. Your experience with digital therapeutics (DTx) reimbursement modeling
4. Examples of past seed rounds you've supported ($3M-$10M range)
5. Availability to start within 2-4 weeks

Pitch site: https://gentle-reminder-pitch.vercel.app

Could we schedule a 30-minute intro call this week or next?

Thank you,
Christo Mack
Founder & CEO, Gentle Reminder
mack@matrixadvancedsolutions.com | [phone]`,
    characterCount: 1800,
    followup: 'Day 5: "Wanted to check if you had a chance to review — happy to send more detail."',
    notes: 'Send to 3-5 firms in parallel. Compare proposals on: (a) monthly retainer range, (b) healthcare/SaMD specialization, (c) team bench depth, (d) client references in similar stage/sector.',
  },

  // ============================================================
  // FOLLOW-UP EMAIL (Day 7 after initial)
  // ============================================================
  {
    id: 'email-followup-day-7',
    label: 'Email — Day 7 Follow-Up',
    channel: 'email',
    audience: 'Any advisor target who hasn\'t responded',
    subject: 'Re: {{original_subject}}',
    body: `Hi {{firstName}},

Following up on my note from last week re: Gentle Reminder.

Since I wrote, we've {{specific_milestone — e.g., filed Tier 1 provisional patents, confirmed academic PI collaboration with [institution], received preliminary FDA Pre-Sub classification}}.

I know you're busy, and a 20-minute call may not be feasible — happy to do 10 minutes, or send you our IP portfolio deep-dive if asynchronous works better. Either way, I'd value your critique of the approach.

Pitch site: https://gentle-reminder-pitch.vercel.app/ip

Best,
Christo Mack`,
    characterCount: 580,
    followup: 'Day 14: One more attempt with different angle, then pause for 60 days.',
    notes: 'Short, low-effort follow-ups outperform re-sending the full pitch. Reference new progress.',
  },
];

export const OUTREACH_CHANNEL_ICON: Record<string, string> = {
  email: '📧',
  'linkedin-dm': '💼',
  'linkedin-inmail': '💼✨',
  'text-sms': '📱',
  'twitter-dm': '🐦',
};
