/**
 * Email Outreach Templates
 * CONFIDENTIAL — Internal Use Only
 *
 * Variables use {{curly_braces}} and should be substituted before sending.
 * Standard variables:
 *   {{recipient_name}}, {{recipient_org}}, {{recipient_first_name}}
 *   {{founder_name}}, {{founder_email}}, {{founder_phone}}
 *   {{pitch_site_url}} (default: https://gentle-reminder-pitch.vercel.app)
 */

export interface EmailTemplate {
  id: string;
  label: string;
  audience: string;
  subject: string;
  body: string;
  attachments: string[];
  followupSequence: string[];
  notes: string;
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  // ============================================================
  // PATENT ATTORNEY — EQUITY / CONTINGENCY MODEL
  // ============================================================
  {
    id: 'patent-attorney-equity',
    label: 'Patent Attorney — Equity / Contingency Model',
    audience: 'Boutique patent firms (Carson, Wojcik, Miller IP)',
    subject: '23-patent portfolio — equity or contingency engagement inquiry',
    body: `Hi {{recipient_first_name}},

I'm {{founder_name}}, founder of Gentle Reminder — a clinical-grade dementia care platform with 23 identified patentable innovations ready for provisional filing.

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

Public pitch site: {{pitch_site_url}}

Best,
{{founder_name}}
{{founder_title}}
{{founder_email}} | {{founder_phone}}`,
    attachments: ['Mutual NDA (sign before IP docket sharing)', 'Executive summary (public-safe)'],
    followupSequence: [
      'Day 5: Polite follow-up referencing 6-week filing window',
      'Day 10: Send a sample provisional (Tier 1 #1) as a quality demo',
      'Day 15: Move on if unresponsive',
    ],
    notes: 'Send to 3 boutique firms in parallel. Compare proposals on: equity %, deferred %, scope, timeline.',
  },

  // ============================================================
  // PATENT ATTORNEY — FIXED FEE MODEL
  // ============================================================
  {
    id: 'patent-attorney-fixed-fee',
    label: 'Patent Attorney — Fixed Fee Model',
    audience: 'Firms with startup packages (Miller IP)',
    subject: 'Fixed-fee inquiry: 23 provisional patents (pre-drafted)',
    body: `Hi {{recipient_first_name}},

I'm {{founder_name}}, founder of Gentle Reminder. We have 23 pre-drafted provisional patents covering a clinical-grade dementia care platform, and we're looking for a firm to review and file them under a fixed-fee arrangement.

Portfolio snapshot:
- 5 Tier 1 patents (highest novelty, file first): gentle feedback scoring, adaptive difficulty, dementia-adapted spaced repetition, multimodal cognitive state classifier, dementia speech emotion detection
- 7 Tier 2 patents (digital biomarkers, decline detection, algorithm transparency)
- 11 Tier 3 patents (system-level: voice companion, music therapy, UX framework, multi-tenant, CFR Part 11, wearable, FHIR, etc.)

Each draft is USPTO-compliant with:
- Field of invention, background, summary
- Detailed description with enabling disclosure
- 3+ independent claims, 5+ dependent claims
- Abstract under 150 words
- Prior art references

Question: What's your firm's fixed-fee rate per provisional filing (attorney review + filing services; we pay the $300 USPTO fee directly)?

Timeline: All 23 filed within 6 weeks.

Pitch site: {{pitch_site_url}}

Best,
{{founder_name}}
{{founder_email}}`,
    attachments: ['Public executive summary', 'Filing timeline'],
    followupSequence: [
      'Day 5: Offer to share a sample draft',
      'Day 10: Request referral if not a fit',
    ],
    notes: 'Use to get price quotes. Compare against equity model firms.',
  },

  // ============================================================
  // PATENT ATTORNEY — LARGE FIRM (WSGR, COOLEY)
  // ============================================================
  {
    id: 'patent-attorney-large-firm',
    label: 'Patent Attorney — Large Firm (Deferred Billing)',
    audience: 'WSGR, Cooley, Fenwick, Goodwin',
    subject: 'Introduction: dementia care platform with 23-patent portfolio',
    body: `Hi {{recipient_first_name}},

I was referred by {{referrer_name}} who suggested we connect regarding patent strategy.

I'm {{founder_name}}, founder of Gentle Reminder. We've built a production-ready clinical-grade dementia care platform with 23 patentable innovations spanning cognitive assessment algorithms, digital biomarkers, multimodal AI, and FDA SaMD compliance.

Where we are:
- 23 provisional patents drafted internally; need formal review + filing
- FDA SaMD pathway fully documented (IEC 62304, ISO 14971, QMS, STRIDE)
- 53,000+ lines of production code; 5 deployed apps
- Seed round in planning ($5M target)

What we need from counsel:
1. Tier 1 (5 patents) filed within 30 days
2. Tier 2 + Tier 3 (18 patents) filed within 60 days
3. Non-provisional strategy for month 9-12 conversion
4. PCT filing evaluation

Emerging Companies / deferred billing would be ideal given our pre-seed stage, with standard rate billing post-seed close.

Could we schedule an intro call? Happy to provide NDA in advance of sharing the full IP docket.

Pitch site: {{pitch_site_url}}

Best,
{{founder_name}}
{{founder_title}}
{{founder_email}} | {{founder_phone}}`,
    attachments: ['Mutual NDA', 'Pitch site link'],
    followupSequence: [
      'Day 7: Follow-up with additional context',
      'Day 14: Send redacted sample provisional',
      'Day 21: Request referral to colleague if wrong fit',
    ],
    notes: 'WSGR: Target Hin Au (Partner, MedTech IP). Cooley: Use CooleyGO application. Warm intro dramatically increases response rate.',
  },

  // ============================================================
  // VC COLD OUTREACH — SEED
  // ============================================================
  {
    id: 'vc-cold-seed',
    label: 'VC Cold Outreach — Seed Stage',
    audience: 'Healthtech seed VCs (Flare, Define, 7wire, .406, a16z, General Catalyst)',
    subject: '23-patent dementia care platform, $186B market — seeking $5M seed',
    body: `Hi {{recipient_first_name}},

Gentle Reminder is a clinical-grade dementia care platform with 23 patentable innovations covering the entire stack — cognitive assessment scoring, digital biomarkers, multimodal AI, FDA SaMD compliance.

Three reasons to talk:

1. IP moat: 23 USPTO provisionals in flight. Includes the only architectural system for zero-negative-feedback cognitive assessment — structurally blocks Akili, Cogstate, Lumosity from our market.

2. FDA pathway: Full SaMD documentation complete (IEC 62304, ISO 14971, QMS, STRIDE, clinical validation protocol). 510(k) predicate identified. 12-18 months to clearance.

3. Platform readiness: 53K lines of production code. 5 apps deployed (mobile + 4 web dashboards). 10 languages with RTL. FHIR R4. Apple Watch. Multi-tenant architecture.

Market context: 55M people with dementia globally. $186B market. Biogen/Eisai Leqembi launched with $20B+ peak sales expectations — but patients lack digital companion tools.

We're raising $5M seed to fund:
- FDA 510(k) submission (30%)
- 3 facility pilots + clinical validation (30%)
- Engineering (24%)
- Non-provisional patent conversions (12%)
- Sales + operations (14%)

12-month runway to Series A.

Pitch site: {{pitch_site_url}}
IP portfolio (public-safe): {{pitch_site_url}}/ip

Is this aligned with {{recipient_org}}'s thesis? Happy to send the deck or schedule 20 minutes.

Best,
{{founder_name}}
{{founder_title}}
{{founder_email}} | {{founder_phone}}`,
    attachments: ['16-slide pitch deck', 'One-page executive summary'],
    followupSequence: [
      'Day 5: Different angle — new traction / milestone',
      'Day 12: Reference portfolio company / thesis alignment',
      'Day 21: Request referral to different partner',
      'Day 30: Pause; revisit in 60 days',
    ],
    notes: 'Warm intro dramatically increases response rate (~10% cold vs ~60% warm). Exhaust warm paths first.',
  },

  // ============================================================
  // VC STRATEGIC — PHARMA CORPORATE VC
  // ============================================================
  {
    id: 'vc-strategic-pharma',
    label: 'VC — Strategic Pharma Corporate',
    audience: 'Biogen Digital Health, Merck GHI, Lilly Ventures',
    subject: 'Digital companion platform for anti-amyloid therapy patients',
    body: `Hi {{recipient_first_name}},

Leqembi, Kisunla, and the anti-amyloid class are landmark therapies — but patients between doses need cognitive maintenance tools designed specifically for their disease trajectory.

Gentle Reminder is a clinical-grade dementia care platform with 23 patentable innovations that directly complement anti-amyloid therapy:

- Daily cognitive exercises designed to prevent frustration (Tier 1 patent: three-state positive-only feedback system)
- Digital biomarkers for decline tracking (real-world evidence data for pharma)
- Dementia-adapted spaced repetition for memory maintenance
- AI companion with family voice cloning for emotional support
- FDA SaMD pathway (510(k) predicate identified)

Partnership models we'd explore with {{recipient_org}}:
1. Strategic investment in seed round ($5M, $25M post)
2. Field-of-use license for {{leqembi_or_kisunla}} companion app
3. Co-development for real-world evidence / outcome measurement
4. Observer board seat with future optionality

Our platform is production-ready: 53K lines of code, 5 deployed apps, FHIR R4 integration, 10 languages.

Could we schedule 30 minutes to explore strategic alignment?

Pitch site: {{pitch_site_url}}

Best,
{{founder_name}}
{{founder_email}}`,
    attachments: ['Executive summary', 'Strategic partnership models one-pager'],
    followupSequence: [
      'Day 7: Include relevant RWE study as talking point',
      'Day 14: Suggest intro via their scientific / innovation team',
    ],
    notes: 'Biogen Digital Health is highest priority. Frame as complementary to therapy, not competing.',
  },

  // ============================================================
  // STRATEGIC CORPORATE VC (PAYER)
  // ============================================================
  {
    id: 'vc-strategic-corporate',
    label: 'VC — Strategic Corporate (Payer/Health Plan)',
    audience: 'Optum Ventures, Humana, Aetna Ventures',
    subject: 'Dementia platform for Medicare Advantage risk stratification',
    body: `Hi {{recipient_first_name}},

Medicare Advantage health plans face rising dementia costs: 6.7M Americans with Alzheimer's, growing 10% annually, with $360B+ in direct costs.

Gentle Reminder is a clinical-grade platform that provides:

1. Digital biomarker risk stratification — identify high-decline patients 6-12 months early
2. Non-pharmacological intervention — reduces caregiver burden, delays facility placement
3. Real-time alerts for caregivers — prevents adverse events (falls, medication non-adherence)
4. Member engagement — our 3-state positive-only feedback system drives 80%+ retention

Value to {{recipient_org}} members:
- 20-30% reduction in caregiver Zarit Burden Interview scores
- Early intervention pathway
- Facility-based deployment at $6K/bed/year; at-home subscription at $180/patient/month

We're raising $5M seed. Optum Ventures investment would unlock strategic partnership with Optum's provider network + UHC Medicare Advantage.

Could we schedule 30 minutes to explore?

Pitch site: {{pitch_site_url}}

Best,
{{founder_name}}
{{founder_email}}`,
    attachments: ['Payer value deck'],
    followupSequence: ['Day 7: Follow-up with specific MA program angles', 'Day 14: Suggest broader UHG intro'],
    notes: 'Frame around cost containment + member outcomes, not technology.',
  },

  // ============================================================
  // ACCELERATOR APPLICATION
  // ============================================================
  {
    id: 'accelerator-application',
    label: 'Accelerator — Application Cover Note',
    audience: 'Rock Health, YC, MATTER, StartUp Health',
    subject: 'Application: Gentle Reminder — 23-patent dementia care platform',
    body: `Dear {{recipient_org}} team,

Please find our application attached. Quick summary:

Company: Gentle Reminder
Stage: Pre-seed, IP portfolio complete, pilot-ready
Team: {{founder_count}} co-founders
Market: $186B global dementia care
Moat: 23 USPTO provisional patents + FDA SaMD pathway
Product: 5 apps deployed; 53K lines production code; 10 languages

Why {{recipient_org}}?
- Your portfolio alignment with digital therapeutics (reference: {{portfolio_example}})
- Your network access to health system buyers
- Your FDA / regulatory pathway expertise

What we're asking:
- Access to your accelerator / fund
- Advisory on strategic partnerships with pharma and payers
- Introductions to clinical advisors

We're raising $5M seed in parallel.

Pitch site: {{pitch_site_url}}

Thank you for considering.

{{founder_name}}
{{founder_email}}`,
    attachments: ['Application form', 'Pitch deck', 'Executive summary'],
    followupSequence: ['Day 14: Check application status'],
    notes: 'Accelerators have structured applications. Follow their specific format.',
  },

  // ============================================================
  // FRACTIONAL CFO OUTREACH
  // ============================================================
  {
    id: 'fractional-cfo-outreach',
    label: 'Fractional CFO — Initial Inquiry',
    audience: 'Burkland, Kruze, airCFO',
    subject: 'Fractional CFO inquiry: seed-stage digital health, $5M raise planned',
    body: `Hi {{recipient_first_name}},

I'm {{founder_name}}, founder of Gentle Reminder — a clinical-grade dementia care platform. We're pre-seed, preparing to raise $5M over the next 4-6 months.

What we need:
1. Seed-round fundraising support (modeling, diligence prep, data room)
2. Financial modeling for 5-year plan (SaaS + DTx hybrid)
3. Cap table management
4. Pre-seed bookkeeping → seed-round audit readiness

Context:
- 23-patent IP portfolio (USPTO provisionals in flight)
- FDA SaMD pathway fully documented
- Production-ready platform: 5 apps, 53K lines of code
- Target close: 4-6 months from now

Questions for you:
1. Your typical engagement structure for pre-seed companies
2. Retainer range for monthly engagement
3. Examples of digital health / FDA-regulated clients

Pitch site: {{pitch_site_url}}

Best,
{{founder_name}}
{{founder_email}} | {{founder_phone}}`,
    attachments: ['Public executive summary'],
    followupSequence: ['Day 5: Request a brief intro call'],
    notes: 'Interview 3 options in parallel. Compare on digital health experience, retainer range, team fit.',
  },

  // ============================================================
  // PLACEMENT AGENT OUTREACH
  // ============================================================
  {
    id: 'placement-agent-outreach',
    label: 'Placement Agent — Engagement Inquiry',
    audience: 'NHVP, Locust Walk',
    subject: 'Placement agent inquiry: healthcare seed round, 23-patent portfolio',
    body: `Hi {{recipient_first_name}},

I'm {{founder_name}}, founder of Gentle Reminder — a clinical-grade dementia care platform.

We're considering engaging a healthcare-specialist placement agent for our seed round. Two questions upfront:

1. Is {{recipient_org}} registered as a FINRA broker-dealer for success-fee engagements? (I want to confirm compliance before any deeper discussion.)
2. Do you typically work with seed-stage companies, or are you better fit for Series A+?

If we're aligned on both, here's what we bring:

- 23 USPTO provisional patents (draft complete, filing Q1)
- FDA SaMD pathway fully documented
- Production platform: 5 apps, 53K lines of code, 10 languages
- $5M seed target; $5M at $25M post-money

Pitch site: {{pitch_site_url}}

Could we schedule 30 minutes to discuss engagement terms?

Best,
{{founder_name}}
{{founder_email}}`,
    attachments: ['Public executive summary'],
    followupSequence: ['Day 5: Request broker-dealer verification in writing'],
    notes: 'CRITICAL: Do NOT engage any party for success fees without verifying FINRA broker-dealer registration (finra.org/brokercheck). Unregistered brokers can invalidate your entire round.',
  },

  // ============================================================
  // STRATEGIC PHARMA LICENSE
  // ============================================================
  {
    id: 'strategic-pharma-license',
    label: 'Strategic Partner — Pharma License',
    audience: 'Biogen, Eisai, Lilly, Novo',
    subject: '23 patents for Alzheimer\'s cognitive support — partnership inquiry',
    body: `Hi {{recipient_first_name}},

I'm reaching out because {{recipient_org}}'s Alzheimer's portfolio has a direct adjacency to what my team has built: a 23-patent platform for dementia cognitive assessment, AI companion, and digital biomarkers — specifically designed for patients on anti-amyloid therapy.

Our IP covers innovations including:

- The only zero-negative-feedback cognitive assessment system (architectural, not just UI)
- Dementia-adapted spaced repetition (memory maintenance between doses)
- Multimodal AI classification (detect confusion, agitation, sundowning)
- Response time and speech biomarkers (real-world evidence / outcome measurement)
- FDA SaMD compliance framework (IEC 62304, ISO 14971, QMS)

Three partnership models are on the table:
1. Field-of-use license for {{drug_name}} companion app — upfront + milestones + royalty
2. Co-development for real-world evidence + outcome tracking
3. Full platform acquisition

We'd share the IP portfolio under mutual NDA.

Brief overview: {{pitch_site_url}}

Could we schedule 30 minutes in the next two weeks?

Best,
{{founder_name}}
{{founder_title}}
{{founder_email}} | {{founder_phone}}`,
    attachments: ['Public executive summary', 'Partnership models one-pager'],
    followupSequence: [
      'Day 7: Follow-up with specific drug reference',
      'Day 14: Reference recent pharma RWE announcement for relevance',
      'Day 21: Request routing to Digital Health BD team',
    ],
    notes: 'Most pharma BD teams are hard to reach. Use LinkedIn + conferences. Expect 4-8 week response time.',
  },

  // ============================================================
  // STRATEGIC PAYER
  // ============================================================
  {
    id: 'strategic-payer',
    label: 'Strategic Partner — Payer / Health Plan',
    audience: 'UHG, Humana, Kaiser, Aetna',
    subject: 'Dementia platform for Medicare Advantage — pilot discussion',
    body: `Hi {{recipient_first_name}},

{{recipient_org}}'s Medicare Advantage population has rising dementia care costs. We've built a platform specifically to address this.

Gentle Reminder delivers:

1. Digital biomarker risk stratification — identify high-decline members 6-12 months early, enabling early intervention
2. Non-pharmacological cognitive maintenance — reduces caregiver burden, delays facility placement
3. Member engagement — our 3-state positive-only feedback system drives 80%+ retention
4. Clinical alerts to caregivers — prevents adverse events (falls, medication non-adherence)

Pilot proposal for {{recipient_org}}:
- 100-200 member pilot in a selected region
- 6-month study on cost, outcomes, utilization
- Quarterly ROI reporting
- Potential for value-based contract if outcomes validated

Pricing: $6K/bed/year (facility) or $180/member/month (home)

Pitch site: {{pitch_site_url}}

Could we schedule 30 minutes with your clinical innovation team?

Best,
{{founder_name}}
{{founder_email}}`,
    attachments: ['Payer value proposition deck', 'Pilot design proposal'],
    followupSequence: ['Day 10: Include specific member outcomes data as talking point', 'Day 21: Route via Chief Medical Officer office'],
    notes: 'Payer sales cycle is long (6-18 months). Run in parallel with fundraise.',
  },

  // ============================================================
  // GRANT SPECIALIST — CONTINGENCY / SUCCESS FEE
  // ============================================================
  {
    id: 'grant-specialist-contingency',
    label: 'Grant Specialist — Contingency / Pay-Upon-Award',
    audience: 'TurboSBIR, Blue Haven Grant, InteliSpark',
    subject: 'SBIR grant support inquiry — success-fee engagement for dementia SaMD platform',
    body: `Hi {{recipient_first_name}},

I'm {{founder_name}}, founder of Gentle Reminder — a clinical-grade dementia care platform with 23 patentable innovations and FDA SaMD pathway readiness.

I'm writing because your contingency / pay-upon-award engagement model is the right fit for our current stage: pre-seed, preparing SBIR applications, but not wanting to pay large upfront consulting fees before knowing we're awarded.

What we have ready to submit against:

1. Full 23-IP patent portfolio (provisional filings in motion)
2. FDA SaMD documentation: IEC 62304, ISO 14971 FMEA, QMS, STRIDE, 21 CFR Part 11
3. Production platform: 53K lines of code, 5 deployed apps, 10 languages, FHIR R4
4. Clinical validation protocol drafted
5. Academic PI collaborators being recruited (UCSF, MGH, Emory targets)

Grants we're targeting:
- NIA SBIR Phase I ($275K, next deadline: Sep 5 / Jan 5 / Apr 5)
- NIA SBIR Fast-Track ($1.8M combined Phase I+II)
- NIH R21 exploratory grants
- BrightFocus Alzheimer's Research ($300K)

Questions for you:

1. What is your exact success-fee percentage / structure? (Full written schedule please.)
2. Are there any upfront fees — platform, software, deposit, or otherwise — separate from the contingency fee?
3. What is your win rate on NIA SBIR Phase I applications over the last 3 years?
4. Can you share 2-3 sanitized past successful applications under NDA?
5. Timeline from engagement to submission?

Pitch site: {{pitch_site_url}}

Can we schedule a 30-minute call this week?

Best,
{{founder_name}}
{{founder_title}}
{{founder_email}} | {{founder_phone}}`,
    attachments: ['Mutual NDA (ready to send)', 'Executive summary (public-safe)'],
    followupSequence: [
      'Day 3: If no response, follow up with specific deadline urgency',
      'Day 7: Request referral if not a fit',
    ],
    notes: 'CRITICAL: Get full fee schedule in writing before signing. Success-fee arrangements can have hidden upfront fees, per-submission fees, or sliding scales. Verify also: GPA ethical compliance (Grant Professionals Association discourages % contingency — verify firm handles this properly). Ask for 2-3 client references.',
  },
  {
    id: 'grant-specialist-retainer',
    label: 'Grant Specialist — Retainer + Success Bonus',
    audience: 'Eva Garland Consulting, Dawnbreaker, established SBIR firms',
    subject: 'SBIR grant support — retainer engagement inquiry',
    body: `Hi {{recipient_first_name}},

I'm {{founder_name}}, founder of Gentle Reminder — a clinical-grade dementia care platform.

We have a strong foundation already in place:
- 23-patent IP portfolio (provisional filings in progress)
- FDA SaMD documentation complete (IEC 62304, ISO 14971, QMS)
- Production platform with deployed applications
- Clinical validation protocol drafted

We're preparing NIA SBIR and NIH R21/R01 applications and seeking a highly-credible partner to improve odds of award.

We are raising $5M seed in parallel, so we can cover a reasonable retainer alongside success-based incentives.

Questions:
1. Your typical engagement structure (retainer + success bonus)?
2. Your team composition — PhD-level scientific writers, biostatisticians?
3. Win rate on NIA SBIR Phase I over past 3 years?
4. Typical engagement duration — pre-submission through final?
5. Experience with dementia / neurodegenerative disease applications specifically?

Pitch site: {{pitch_site_url}}

Could we schedule 30 minutes?

Best,
{{founder_name}}
{{founder_email}}`,
    attachments: ['Executive summary', 'Specific aims draft (after NDA)'],
    followupSequence: ['Day 7: Request intro call', 'Day 14: Narrow to 1-2 firms, begin formal evaluation'],
    notes: 'Higher cost but higher win rate. Appropriate once seed is closed or near close. Premium firms like Eva Garland have strong track records but charge upfront.',
  },

  // ============================================================
  // GRANT PROGRAM — ACADEMIC PI PARTNERSHIP
  // ============================================================
  {
    id: 'grant-pi-outreach',
    label: 'Grant — Academic PI Collaboration',
    audience: 'Academic memory clinics (UCSF, MGH, Emory, etc.)',
    subject: 'SBIR collaboration: digital cognitive assessment for dementia',
    body: `Dear Dr. {{recipient_last_name}},

I'm {{founder_name}}, founder of Gentle Reminder — a clinical-grade digital platform for dementia cognitive assessment and caregiver support.

We're preparing an NIH / NIA SBIR Phase I application and believe {{recipient_org}}'s {{center_name}} would be an ideal collaborating institution given your work on {{recent_publication_or_program}}.

About the platform:
- 23 patentable innovations across cognitive assessment, digital biomarkers, multimodal AI
- FDA SaMD pathway fully documented (IEC 62304, ISO 14971, QMS)
- Production-ready: 5 apps deployed, 53K lines of code
- 10 languages with RTL

Proposed collaboration:
- Specific Aim 1: Validate our 3-state positive-only feedback system vs MMSE/MoCA in a 60-patient cohort
- Specific Aim 2: Characterize our composite digital biomarker against 6-month clinical decline
- Specific Aim 3: Demonstrate caregiver burden reduction (Zarit Burden Interview)

Budget: $275K Phase I over 6 months. Subaward to your institution would be approximately $50-75K.

I would greatly appreciate the opportunity to discuss this briefly with you or a designee. Our platform's immediate availability for clinical validation could accelerate the timeline significantly.

Pitch site: {{pitch_site_url}}
Clinical validation protocol: available upon request

Best regards,
{{founder_name}}
{{founder_title}}
{{founder_email}} | {{founder_phone}}`,
    attachments: ['Clinical validation protocol (after NDA)', 'Executive summary'],
    followupSequence: [
      'Day 7: Follow up with additional specific aims detail',
      'Day 14: Suggest brief call with their research admin',
      'Day 21: Redirect to other institutions if no response',
    ],
    notes: 'Academic PIs respond best to specific research questions + mutual benefit framing. Offer subaward; do not ask for free labor.',
  },
];

export function getTemplateById(id: string): EmailTemplate | undefined {
  return EMAIL_TEMPLATES.find((t) => t.id === id);
}
