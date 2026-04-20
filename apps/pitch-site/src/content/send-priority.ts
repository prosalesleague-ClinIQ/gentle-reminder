/**
 * Send Priority Queue — curated outreach items ready to launch
 *
 * Each item binds a recipient to a pre-rendered subject + body.
 * `email` = can mailto: directly
 * `contactFormUrl` = must use their web form instead
 *
 * Variables are PRE-SUBSTITUTED with Christo Mac / Matrix Advanced Solutions
 * defaults so the mailto: links are ready to launch immediately.
 */

export type LaunchChannel = 'mailto' | 'contact-form' | 'linkedin-dm' | 'twitter-dm';
export type LaunchTier = 'patent-attorney' | 'grant-specialist' | 'fractional-cfo' | 'clinical-advisor' | 'tech-advisor';

export interface SendItem {
  id: string;
  order: number;
  tier: LaunchTier;
  tierLabel: string;
  tierColor: string;
  priority: 'critical' | 'high' | 'medium';
  recipient: string;
  org: string;
  channel: LaunchChannel;
  email?: string;
  contactFormUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  subject: string;
  body: string;
  notes?: string;
}

const SIGNATURE = `
Best,
Christo Mac
Founder & CEO/COO, Gentle Reminder
mack@matrixadvancedsolutions.com
https://www.linkedin.com/in/christomac
Pitch site: https://gentle-reminder-pitch.vercel.app`;

export const SEND_PRIORITY_QUEUE: SendItem[] = [
  // ============================================================
  // TIER 1: PATENT ATTORNEYS (Equity / Contingency Model)
  // ============================================================
  {
    id: 'send-carson',
    order: 1,
    tier: 'patent-attorney',
    tierLabel: 'Patent Attorney',
    tierColor: '#f85149',
    priority: 'critical',
    recipient: 'Carson Patents team',
    org: 'Carson Patents',
    channel: 'mailto',
    email: 'info@carsonpatents.com',
    subject: '23-patent portfolio — equity or contingency engagement inquiry',
    body: `Hi Carson Patents team,

I'm Christo Mac, founder and CEO of Gentle Reminder — a clinical-grade dementia care platform with 23 identified patentable innovations ready for provisional filing.

Your firm's equity / contingency model is exactly what we need. Three reasons this fits:

1. Scale: 23 USPTO provisionals to file over the next 6 weeks. Tier 1 (5 patents) first.
2. Quality: Each draft is already written in USPTO-compliant format with 3+ independent claims and enabling disclosure. Your work is review + file, not draft from scratch.
3. Upside: We're raising a $5M seed in parallel; equity or deferred-to-close fees can be triggered at close.

Materials available for your review under NDA:
- Full 23-IP docket with tier rankings
- Pre-drafted provisional patent specifications
- Prior art analysis per IP
- Inventor disclosure with assignment chain

Could we schedule a 30-minute call this week to discuss fee structure?

Public pitch site: https://gentle-reminder-pitch.vercel.app
${SIGNATURE}`,
    notes: 'Has direct email. Mailto will open immediately.',
  },
  {
    id: 'send-wojcik',
    order: 2,
    tier: 'patent-attorney',
    tierLabel: 'Patent Attorney',
    tierColor: '#f85149',
    priority: 'critical',
    recipient: 'Wojcik Law Firm',
    org: 'Wojcik Law Firm',
    channel: 'contact-form',
    contactFormUrl: 'https://www.wojciklawfirm.com/contact',
    subject: '23-patent portfolio — equity / deferred fee inquiry',
    body: `Hi Wojcik Law Firm,

I'm Christo Mac, founder and CEO of Gentle Reminder — a clinical-grade dementia care platform with 23 identified patentable innovations ready for provisional filing.

Your "Equity & Deferred Fees" practice is an ideal fit. We have 23 USPTO provisional drafts in USPTO-compliant format with claims, prior art, and enabling disclosure complete. Your firm's work would be review + file.

We're raising a $5M seed in parallel; equity or deferred-to-close fees can be triggered at close.

Can we schedule a 30-minute intro call this week?

Pitch site: https://gentle-reminder-pitch.vercel.app
${SIGNATURE}`,
    notes: 'Contact form only. Paste subject + body into their form.',
  },
  {
    id: 'send-miller-ip',
    order: 3,
    tier: 'patent-attorney',
    tierLabel: 'Patent Attorney',
    tierColor: '#f85149',
    priority: 'high',
    recipient: 'Miller IP Law',
    org: 'Miller IP Law',
    channel: 'contact-form',
    contactFormUrl: 'https://lawwithmiller.com',
    subject: 'Fixed-fee inquiry: 23 provisional patents (pre-drafted)',
    body: `Hi Miller IP Law team,

I'm Christo Mac, founder of Gentle Reminder. We have 23 pre-drafted provisional patents covering a clinical-grade dementia care platform, looking for a firm to review and file them under a fixed-fee arrangement.

Portfolio snapshot:
- 5 Tier 1 (highest novelty): gentle feedback scoring, adaptive difficulty, dementia-adapted SM-2, multimodal cognitive state classifier, dementia speech emotion detection
- 7 Tier 2 patents
- 11 Tier 3 patents

Each draft is USPTO-compliant with 3+ independent claims, prior art references, abstract, etc.

Question: What's your firm's fixed-fee rate per provisional filing (attorney review + filing services; we pay the $300 USPTO fee directly)?

Timeline: All 23 filed within 6 weeks.

Pitch site: https://gentle-reminder-pitch.vercel.app
${SIGNATURE}`,
    notes: 'Contact form. Has book-a-call link as well.',
  },

  // ============================================================
  // TIER 2: GRANT SPECIALISTS (Contingency / Pay-Upon-Award)
  // ============================================================
  {
    id: 'send-turbosbir',
    order: 4,
    tier: 'grant-specialist',
    tierLabel: 'Grant Specialist',
    tierColor: '#d29922',
    priority: 'critical',
    recipient: 'TurboSBIR / NIH4Startups',
    org: 'TurboSBIR',
    channel: 'contact-form',
    contactFormUrl: 'https://landing.turbosbir.com/sbir-consulting-sessions/',
    subject: 'SBIR grant support inquiry — success-fee engagement for dementia SaMD platform',
    body: `Hi TurboSBIR team,

I'm Christo Mac, founder of Gentle Reminder — a clinical-grade dementia care platform with 23 patentable innovations and FDA SaMD pathway readiness.

Your contingency / pay-upon-award engagement model is the right fit for our stage. What we have ready to submit against:

1. Full 23-IP patent portfolio (provisional filings in motion)
2. FDA SaMD documentation: IEC 62304, ISO 14971 FMEA, QMS, STRIDE, 21 CFR Part 11
3. Production platform: 53K lines of code, 5 deployed apps, 10 languages, FHIR R4
4. Clinical validation protocol drafted
5. Academic PI collaborators being recruited

Target grants: NIA SBIR Phase I ($275K), Fast-Track ($1.8M), NIH R21, BrightFocus, Alz Association.

Key questions:
1. Exact success-fee percentage + structure?
2. Any upfront fees — platform, software, deposit — separate from contingency?
3. Win rate on NIA SBIR Phase I applications over last 3 years?
4. Can you share 2-3 sanitized past successful applications under NDA?
5. Timeline from engagement to submission?

Pitch site: https://gentle-reminder-pitch.vercel.app

Can we schedule 30 minutes this week?
${SIGNATURE}`,
    notes: 'Contact form + book-a-call. Verify success-fee terms carefully.',
  },
  {
    id: 'send-bluehaven',
    order: 5,
    tier: 'grant-specialist',
    tierLabel: 'Grant Specialist',
    tierColor: '#d29922',
    priority: 'critical',
    recipient: 'Blue Haven Grant Consultants',
    org: 'Blue Haven Grant',
    channel: 'contact-form',
    contactFormUrl: 'https://www.bluehavengrantconsultants.com/sbir',
    subject: 'Pay-Upon-Award inquiry — NIH SBIR support for dementia medical device',
    body: `Hi Blue Haven Grant Consultants,

I'm Christo Mac, founder of Gentle Reminder — a clinical-grade dementia care platform with 23 patents and full FDA SaMD documentation.

Your "Pay Upon Award" guarantee model is exactly what pre-seed startups like us need. We're targeting NIA SBIR Phase I ($275K) and additional federal grants in 2026.

Ready to share under NDA:
- 23-IP docket
- NIA SBIR Phase I application draft (all sections complete: Specific Aims, Research Strategy, Commercialization Plan, Budget)
- FDA SaMD documentation
- Production platform (53K LOC)

Questions:
1. Exact terms of your "Pay Upon Award" — full contingency or partial?
2. Win rate on medical device / SaMD SBIR applications?
3. Scope of work (writing, review, submission support)?
4. Can you share 2-3 sanitized past successful applications under NDA?

Can we schedule 30 min this week?

Pitch site: https://gentle-reminder-pitch.vercel.app
${SIGNATURE}`,
    notes: 'Contact form. Medical device/pharma specialty.',
  },
  {
    id: 'send-intelispark',
    order: 6,
    tier: 'grant-specialist',
    tierLabel: 'Grant Specialist',
    tierColor: '#d29922',
    priority: 'high',
    recipient: 'InteliSpark',
    org: 'InteliSpark',
    channel: 'contact-form',
    contactFormUrl: 'http://www.intelispark.com/',
    subject: 'SBIR proposal development inquiry — dementia SaMD platform',
    body: `Hi InteliSpark team,

I'm Christo Mac, founder of Gentle Reminder — a clinical-grade dementia care platform.

Understand your model is partial contingency + upfront. Please share:
1. Split between upfront and contingent portion
2. Win rate on NIA SBIR / NIH R21 applications
3. Scope of services (writing / review / submission)
4. Typical engagement duration

We have NIA SBIR Phase I draft complete (Specific Aims, Research Strategy, Commercialization Plan, Budget Justification all drafted). Looking for expert review + submission support.

Pitch site: https://gentle-reminder-pitch.vercel.app

Can we schedule 30 min?
${SIGNATURE}`,
    notes: 'Contact form. Verify upfront vs contingent split.',
  },

  // ============================================================
  // TIER 3: FRACTIONAL CFOs
  // ============================================================
  {
    id: 'send-healthcarecfo',
    order: 7,
    tier: 'fractional-cfo',
    tierLabel: 'Fractional CFO',
    tierColor: '#a371f7',
    priority: 'critical',
    recipient: 'The Healthcare CFO',
    org: 'The Healthcare CFO',
    channel: 'contact-form',
    contactFormUrl: 'https://www.thehealthcarecfo.com/startup-cfo-solutions-early-stage',
    subject: 'Fractional CFO inquiry — pre-seed dementia SaMD platform, $5M raise',
    body: `Hi Healthcare CFO team,

I'm Christo Mac, founder of Gentle Reminder — a clinical-grade dementia care platform in the FDA SaMD pathway. We're preparing a $5M seed round over the next 4-6 months and evaluating fractional CFO firms.

Your healthcare/biotech/life sciences exclusive focus makes you our top pick.

Current state:
- Delaware C-Corp forming
- 23 USPTO provisional patents drafted/filed
- Full FDA SaMD documentation (IEC 62304, ISO 14971, QMS, CFR Part 11)
- Production platform: 53K LOC, 5 deployed apps
- Core team: Christo Mac (CEO/COO), Leo Kinsman (CTO), Chris Hamel (CFO in-house), Jayla Patzer (Clinical Partnerships)

What we need:
1. Seed-round fundraising support: financial model, data room, diligence response
2. SBIR fiscal compliance (Phase I drafted)
3. Cap table management
4. Pre-seed bookkeeping → seed-round audit readiness

Questions:
1. Monthly retainer range for pre-seed healthtech with FDA pathway?
2. Experience with SaMD regulatory-sensitive companies?
3. Experience with DTx reimbursement modeling?
4. 2-3 past seed rounds you've supported in $3-10M range?
5. Availability to start within 2-4 weeks?

Pitch site: https://gentle-reminder-pitch.vercel.app

Schedule a call: would love to find 30 min this week.
${SIGNATURE}`,
    notes: 'TOP PICK — healthcare/biotech exclusive. Book via their website call form.',
  },
  {
    id: 'send-burkland',
    order: 8,
    tier: 'fractional-cfo',
    tierLabel: 'Fractional CFO',
    tierColor: '#a371f7',
    priority: 'high',
    recipient: 'Burkland Associates',
    org: 'Burkland',
    channel: 'contact-form',
    contactFormUrl: 'https://burklandassociates.com/who-we-work-with/healthcare/',
    subject: 'Fractional CFO inquiry — VC-backed digital health startup, $5M seed',
    body: `Hi Burkland team,

I'm Christo Mac, founder of Gentle Reminder — a clinical-grade dementia care platform with 23 patents and FDA SaMD pathway. Preparing $5M seed round; evaluating fractional CFO firms with VC-backed startup experience.

Interested in your healthcare + biotech vertical team.

Context:
- 23 USPTO provisional patents
- Full FDA SaMD documentation
- Production platform (53K LOC, 5 deployed apps)
- Seeking CFO support for fundraising, SBIR compliance, cap table, financial model

Questions:
1. Monthly retainer for pre-seed healthtech?
2. Your healthcare vertical team — bench depth?
3. Client references in similar stage/sector (digital therapeutics, FDA-regulated)?
4. Availability to start in 2-4 weeks?

Pitch site: https://gentle-reminder-pitch.vercel.app

Can we schedule 30 min?
${SIGNATURE}`,
  },
  {
    id: 'send-cfo-advisors',
    order: 9,
    tier: 'fractional-cfo',
    tierLabel: 'Fractional CFO',
    tierColor: '#a371f7',
    priority: 'high',
    recipient: 'CFO Advisors',
    org: 'CFO Advisors',
    channel: 'contact-form',
    contactFormUrl: 'https://cfoadvisors.com',
    subject: 'Fractional CFO inquiry — AI healthcare SaMD startup',
    body: `Hi CFO Advisors team,

I'm Christo Mac, founder of Gentle Reminder — a clinical-grade AI-powered dementia care platform (23 patents, FDA SaMD pathway).

Your AI + healthcare specialty directly matches our profile. Preparing $5M seed.

Questions:
1. Monthly retainer for pre-seed AI healthcare SaMD?
2. Your experience with FDA-regulated AI/ML medical devices?
3. 2-3 client references in AI + healthcare seed/Series A?
4. Availability to start in 2-4 weeks?

Pitch site: https://gentle-reminder-pitch.vercel.app

Can we schedule 30 min?
${SIGNATURE}`,
    notes: 'AI + healthcare specialty. Sequoia/a16z portfolio experience.',
  },

  // ============================================================
  // TIER 4: CLINICAL ADVISORS (Top 3 critical)
  // ============================================================
  {
    id: 'send-bruce-miller',
    order: 10,
    tier: 'clinical-advisor',
    tierLabel: 'Clinical Advisor',
    tierColor: '#3fb950',
    priority: 'critical',
    recipient: 'Dr. Bruce Miller',
    org: 'UCSF Memory and Aging Center',
    channel: 'linkedin-dm',
    linkedinUrl: 'https://www.linkedin.com/in/bruce-miller-0a0157/',
    subject: 'Advisor inquiry — dementia platform with 23 patents + FDA SaMD pathway',
    body: `Dear Dr. Miller,

I'm Christo Mac, founder and CEO of Gentle Reminder, a clinical-grade dementia care platform. I'm reaching out because your work leading the UCSF Memory and Aging Center and your frontotemporal dementia research directly informs what we're trying to build — and your guidance would be transformative.

What we've built:
- 23 USPTO provisional patents including a three-state positive-only cognitive assessment system that architecturally prevents anxiety-inducing pass/fail feedback (addressing a documented clinical problem with MMSE/MoCA)
- Full FDA SaMD documentation complete (IEC 62304, ISO 14971 FMEA, ISO 13485 QMS, 21 CFR Part 11)
- Production platform: 53,000+ lines of code, 5 deployed applications, FHIR R4 integration, 10 languages
- 510(k) predicate identified (K201738 Linus Health)

The ask: I'd love a 30-minute introductory call to discuss our approach. If there's alignment, I'd invite you to join our Clinical Advisory Board — a small group of 3-5 leading dementia researchers guiding our clinical validation strategy, FDA submission, and Phase II planning. Standard advisor equity (0.25-0.5%) and meaningful participation in shaping a platform that could reach millions of patients on anti-amyloid therapy.

A public overview of the platform and IP portfolio is at https://gentle-reminder-pitch.vercel.app/ip.

Would any 30-minute window in the next 2 weeks work?

With admiration and respect,
${SIGNATURE.trim()}`,
    notes: 'LinkedIn DM preferred. Too long for LinkedIn free message (400 char limit); use Premium InMail OR shorten to teaser + link + ask.',
  },
  {
    id: 'send-sperling',
    order: 11,
    tier: 'clinical-advisor',
    tierLabel: 'Clinical Advisor',
    tierColor: '#3fb950',
    priority: 'critical',
    recipient: 'Dr. Reisa Sperling',
    org: 'Harvard / Brigham and Women\'s',
    channel: 'linkedin-dm',
    linkedinUrl: 'https://www.linkedin.com/in/reisa-sperling-2b3b3b1b/',
    subject: 'Advisor inquiry — dementia platform (complementary to Leqembi / anti-amyloid)',
    body: `Dear Dr. Sperling,

I'm Christo Mac, founder of Gentle Reminder — a clinical-grade dementia care platform (23 patents, FDA SaMD pathway). Your leadership of the A4 and AHEAD prevention studies makes you uniquely qualified to evaluate where we can add value.

We've built the first dementia-safe cognitive assessment system — 23 USPTO provisional patents including a three-state positive-only feedback architecture that structurally prevents the anxiety / agitation documented in standard assessments (MMSE/MoCA). Applications include digital companion tools for anti-amyloid therapy patients between dosing.

Ask: 30-minute intro call. If aligned, invite to our Clinical Advisory Board (0.25-0.5% equity, small group of 3-5 leading researchers).

Overview: https://gentle-reminder-pitch.vercel.app/ip

With thanks,
${SIGNATURE.trim()}`,
    notes: 'LinkedIn DM. Frame around Leqembi / anti-amyloid adjacency for max relevance.',
  },
  {
    id: 'send-petersen',
    order: 12,
    tier: 'clinical-advisor',
    tierLabel: 'Clinical Advisor',
    tierColor: '#3fb950',
    priority: 'critical',
    recipient: 'Dr. Ronald Petersen',
    org: 'Mayo Clinic ADRC',
    channel: 'contact-form',
    contactFormUrl: 'https://www.mayoclinic.org/biographies/petersen-ronald-c-m-d-ph-d/bio-20055445',
    subject: 'Advisor inquiry — dementia cognitive assessment platform',
    body: `Dear Dr. Petersen,

I'm Christo Mac, founder of Gentle Reminder. Your work defining mild cognitive impairment and leading the Mayo Clinic Study of Aging makes you the ideal external reviewer of what we're building.

We have 23 patent-pending innovations for dementia cognitive assessment, including a three-state positive-only feedback architecture designed to eliminate anxiety cascades in MCI / early-AD populations during testing.

Would you consider a 30-minute intro call? Standard advisor equity available if alignment.

Overview: https://gentle-reminder-pitch.vercel.app/ip
${SIGNATURE}`,
    notes: 'Mayo contact page has institutional email path. Warm intro ideal.',
  },

  // ============================================================
  // TIER 5: TECH / AI ADVISORS (Top 3 high-leverage)
  // ============================================================
  {
    id: 'send-topol',
    order: 13,
    tier: 'tech-advisor',
    tierLabel: 'Tech / AI Advisor',
    tierColor: '#58a6ff',
    priority: 'critical',
    recipient: 'Dr. Eric Topol',
    org: 'Scripps Research',
    channel: 'twitter-dm',
    twitterUrl: 'https://twitter.com/EricTopol',
    linkedinUrl: 'https://www.linkedin.com/in/erictopol/',
    subject: 'Dementia platform with patented AI — 20 min for your critique?',
    body: `Hi Eric — Christo Mac, founder of Gentle Reminder (dementia platform, 23 patents, FDA SaMD pathway). Would love your critique. Core innovation: three-state positive-only cognitive assessment that architecturally prevents MMSE-style anxiety cascades. Full IP portfolio + platform: https://gentle-reminder-pitch.vercel.app/ip. 20 min if you're game — your take matters. mack@matrixadvancedsolutions.com`,
    notes: 'Twitter DM — 400 char max. Keep short. Follow with email if connects.',
  },
  {
    id: 'send-tullman',
    order: 14,
    tier: 'tech-advisor',
    tierLabel: 'Tech / AI Advisor',
    tierColor: '#58a6ff',
    priority: 'high',
    recipient: 'Glen Tullman',
    org: 'Transcarent / 7wireVentures',
    channel: 'linkedin-dm',
    linkedinUrl: 'https://www.linkedin.com/in/glentullman/',
    subject: 'Dementia care platform — advisor inquiry',
    body: `Hi Glen — Christo Mac, founder of Gentle Reminder. 23-patent dementia care platform with FDA SaMD pathway and 3 revenue streams (facility SaaS, DTx, pharma). Livongo pattern-matching is exactly what we need as we scale commercialization. Would love 20 min to share the approach & discuss advisor/board fit. Overview: gentle-reminder-pitch.vercel.app. Happy to work around your calendar. Thanks!`,
    notes: 'LinkedIn. Lead with Livongo pattern-match reference.',
  },
  {
    id: 'send-butte',
    order: 15,
    tier: 'tech-advisor',
    tierLabel: 'Tech / AI Advisor',
    tierColor: '#58a6ff',
    priority: 'high',
    recipient: 'Dr. Atul Butte',
    org: 'UCSF / UC Health',
    channel: 'linkedin-dm',
    linkedinUrl: 'https://www.linkedin.com/in/atulbutte/',
    subject: 'Biomedical AI for dementia — 20 min for your critique?',
    body: `Dr. Butte — Christo Mac, founder of Gentle Reminder. Clinical-grade dementia platform with 23 patents (incl. multimodal cognitive state classifier, composite digital biomarker engine). Your UCSF data pipelines + biomedical AI work directly informs our architecture. Would love 20 min for your critique. gentle-reminder-pitch.vercel.app/ip. mack@matrixadvancedsolutions.com`,
    notes: 'LinkedIn. Reference UCSF institutional work.',
  },
];
