/**
 * Execute Plan — Step-by-step action list in order.
 * From zero to outreach-ready in defined phases.
 *
 * Each action has a viewLinks array: external URLs (for registrations),
 * internal GitHub links (for drafts to review), or both.
 * Checkboxes only become enabled once user clicks at least one view link
 * (enforced in the UI).
 */

export type PhaseStatus = 'blocked' | 'ready' | 'in-progress' | 'done';

export interface ViewLink {
  href: string;
  label: string;
  kind: 'review' | 'external' | 'template' | 'run';
}

export interface Action {
  id: string;
  label: string;
  description: string;
  owner: 'you' | 'me' | 'attorney' | 'both';
  duration: string;
  cost: string;
  blockedBy?: string[];
  viewLinks: ViewLink[];
  deliverable?: string;
}

export interface Phase {
  id: string;
  number: number;
  label: string;
  goal: string;
  blocking: boolean;
  actions: Action[];
}

const GITHUB = 'https://github.com/prosalesleague-ClinIQ/gentle-reminder/blob/main/';

export const EXECUTE_PHASES: Phase[] = [
  // ============================================================
  // PHASE 0 — Corporate & Legal Foundation (CANNOT SKIP)
  // ============================================================
  {
    id: 'phase-0',
    number: 0,
    label: 'Corporate & Legal Foundation',
    goal: 'Get the minimum legal structure in place so NDAs, patent filings, and fundraising are valid.',
    blocking: true,
    actions: [
      {
        id: 'p0-entity',
        label: 'Form Delaware C-Corp',
        description:
          'Use Stripe Atlas ($500) or Clerky ($299) or a local attorney. Delaware C-Corp is standard for VC fundraising. Skip LLC — VCs won\'t invest.',
        owner: 'you',
        duration: '2-3 business days',
        cost: '$299-$800',
        viewLinks: [
          { href: 'https://stripe.com/atlas', label: 'Stripe Atlas ($500)', kind: 'external' },
          { href: 'https://www.clerky.com', label: 'Clerky ($299-$799)', kind: 'external' },
          {
            href: GITHUB + 'docs/registrations/README.md#1-delaware-c-corp-formation',
            label: 'Registrations guide',
            kind: 'review',
          },
        ],
        deliverable: 'Certificate of Incorporation, bylaws, board consent, founder stock issued',
      },
      {
        id: 'p0-ein',
        label: 'Obtain EIN from IRS',
        description: 'Free. Apply online at IRS.gov. Stripe Atlas and Clerky can also do this.',
        owner: 'you',
        duration: 'Same day (weekdays 7am-10pm ET)',
        cost: '$0',
        blockedBy: ['p0-entity'],
        viewLinks: [
          {
            href: 'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online',
            label: 'IRS EIN online',
            kind: 'external',
          },
        ],
        deliverable: 'EIN letter (SS-4 form)',
      },
      {
        id: 'p0-bank',
        label: 'Open business bank account',
        description:
          'Mercury or Brex (startup-friendly, fast). Need EIN + incorporation docs. This is where USPTO and grant fees are paid from.',
        owner: 'you',
        duration: '1-3 business days',
        cost: '$0',
        blockedBy: ['p0-ein'],
        viewLinks: [
          { href: 'https://mercury.com', label: 'Mercury Bank', kind: 'external' },
          { href: 'https://www.brex.com', label: 'Brex', kind: 'external' },
        ],
        deliverable: 'Active business checking account',
      },
      {
        id: 'p0-invention-assignment',
        label: 'Sign Invention Assignment Agreements with all founders',
        description:
          'Every founder must sign an agreement transferring any IP they created to the company. WITHOUT THIS, the company does not own the patents — the founders do personally, which voids VC investments.',
        owner: 'you',
        duration: 'Same day with template',
        cost: '$0 (template) or $500-$1K (attorney review)',
        blockedBy: ['p0-entity'],
        viewLinks: [
          {
            href: GITHUB + 'docs/ip/INVENTOR-DISCLOSURE.md',
            label: 'Review IAA template',
            kind: 'review',
          },
        ],
        deliverable: 'Signed IAA from each founder, filed in corporate records',
      },
      {
        id: 'p0-cap-table',
        label: 'Set up cap table',
        description: 'Carta or Pulley (free tier for early stage). Alternative: spreadsheet.',
        owner: 'you',
        duration: '1 hour',
        cost: '$0',
        blockedBy: ['p0-entity'],
        viewLinks: [
          { href: 'https://carta.com/launch/', label: 'Carta Launch (free)', kind: 'external' },
          { href: 'https://pulley.com/pricing', label: 'Pulley (free for early stage)', kind: 'external' },
        ],
        deliverable: 'Cap table showing all founder ownership',
      },
      {
        id: 'p0-uspto-account',
        label: 'Register USPTO and Pay.gov accounts',
        description: 'Free accounts at uspto.gov and pay.gov. Required for any patent filing.',
        owner: 'you',
        duration: '30 minutes',
        cost: '$0',
        viewLinks: [
          { href: 'https://account.uspto.gov', label: 'USPTO.gov account', kind: 'external' },
          { href: 'https://patentcenter.uspto.gov', label: 'Patent Center', kind: 'external' },
          { href: 'https://pay.gov', label: 'Pay.gov', kind: 'external' },
        ],
        deliverable: 'Active USPTO and Pay.gov logins',
      },
      {
        id: 'p0-founder-bios',
        label: 'Optimize LinkedIn + company email',
        description:
          'Update LinkedIn. Using mack@matrixadvancedsolutions.com for outreach now; set up founder@gentlereminder.health post-seed once domain is Workspace-configured.',
        owner: 'you',
        duration: '1-2 hours',
        cost: '$12/year (domain) + $6/mo (Google Workspace)',
        viewLinks: [
          { href: 'https://workspace.google.com', label: 'Google Workspace', kind: 'external' },
          { href: 'https://namecheap.com', label: 'Domain registrar', kind: 'external' },
        ],
        deliverable: 'Updated LinkedIn + company email',
      },
    ],
  },

  // ============================================================
  // PHASE 1 — IP Protection (URGENT: 6-week filing window)
  // ============================================================
  {
    id: 'phase-1',
    number: 1,
    label: 'IP Protection (Patent Filings)',
    goal: 'File all 23 provisional patents to secure priority dates before any outreach that shares IP details.',
    blocking: true,
    actions: [
      {
        id: 'p1-timestamp-ip',
        label: 'Run IP timestamp script (cryptographic proof of creation)',
        description:
          'FREE. Cryptographically timestamps all 23 IP drafts via OpenTimestamps (Bitcoin blockchain anchoring). Provides tamper-evident proof of file existence at today\'s date.',
        owner: 'you',
        duration: '10 minutes',
        cost: '$0',
        viewLinks: [
          {
            href: GITHUB + 'scripts/ip-protection/timestamp-ip-portfolio.sh',
            label: 'View script',
            kind: 'run',
          },
          {
            href: GITHUB + 'docs/ip-protection/01-cryptographic-timestamping.md',
            label: 'How it works',
            kind: 'review',
          },
        ],
        deliverable: '.ots proof files alongside each .md, Bitcoin-anchored timestamps',
      },
      {
        id: 'p1-contact-attorneys',
        label: 'Send equity/contingency inquiries to 3 patent attorneys in parallel',
        description:
          'Parallel cold emails to Carson Patents, Wojcik Law Firm, Miller IP Law using the equity-model template.',
        owner: 'both',
        duration: 'Day 1: send emails. Day 7-10: compare responses.',
        cost: '$0 to send',
        blockedBy: ['p0-entity', 'p0-invention-assignment'],
        viewLinks: [
          {
            href: '/private/outreach/pat-carson',
            label: 'Open Carson Patents template',
            kind: 'template',
          },
          {
            href: '/private/outreach/pat-wojcik',
            label: 'Open Wojcik template',
            kind: 'template',
          },
          {
            href: '/private/outreach/pat-miller-ip',
            label: 'Open Miller IP template',
            kind: 'template',
          },
        ],
        deliverable: '3 proposals in hand; selected firm signed',
      },
      {
        id: 'p1-execute-nda-attorney',
        label: 'Execute NDA with selected patent firm',
        description: 'Use the Unilateral NDA (We Disclose) template. Get signed before sharing the full 23-IP docket.',
        owner: 'both',
        duration: '1 day',
        cost: '$0',
        blockedBy: ['p1-contact-attorneys'],
        viewLinks: [{ href: '/private/nda', label: 'Open NDA templates', kind: 'template' }],
        deliverable: 'Signed NDA with patent firm',
      },
      {
        id: 'p1-share-ip-docket',
        label: 'Share IP docket with attorney (under NDA)',
        description: 'Provide attorney access to docs/ip/ directory: 23 drafted provisionals + prior art research.',
        owner: 'you',
        duration: '1 day',
        cost: '$0',
        blockedBy: ['p1-execute-nda-attorney'],
        viewLinks: [
          { href: GITHUB + 'docs/ip/README.md', label: 'View IP portfolio', kind: 'review' },
          {
            href: GITHUB + 'docs/ip/PRIOR-ART-SEARCH.md',
            label: 'Prior art search',
            kind: 'review',
          },
        ],
        deliverable: 'Attorney reviewing drafts',
      },
      {
        id: 'p1-file-tier-1',
        label: 'File Tier 1 (5 provisionals) — HIGHEST PRIORITY',
        description:
          'Gentle feedback scoring, adaptive difficulty, dementia SM-2, multimodal state classifier, speech emotion.',
        owner: 'attorney',
        duration: '2 weeks from engagement',
        cost: '$1,500 USPTO fees + attorney fees (deferred or equity)',
        blockedBy: ['p1-share-ip-docket'],
        viewLinks: [
          {
            href: GITHUB + 'docs/ip/tier-1/01-gentle-feedback-scoring.md',
            label: 'IP #1 draft',
            kind: 'review',
          },
          {
            href: GITHUB + 'docs/ip/tier-1/02-adaptive-difficulty-engine.md',
            label: 'IP #2 draft',
            kind: 'review',
          },
          {
            href: GITHUB + 'docs/ip/tier-1/03-dementia-spaced-repetition.md',
            label: 'IP #3 draft',
            kind: 'review',
          },
          {
            href: GITHUB + 'docs/ip/tier-1/04-multimodal-cognitive-state.md',
            label: 'IP #4 draft',
            kind: 'review',
          },
          {
            href: GITHUB + 'docs/ip/tier-1/05-dementia-speech-emotion.md',
            label: 'IP #5 draft',
            kind: 'review',
          },
          {
            href: GITHUB + 'docs/ip/FILING-CHECKLIST.md',
            label: 'Filing checklist',
            kind: 'review',
          },
        ],
        deliverable: '5 USPTO provisional application numbers with filing receipts',
      },
      {
        id: 'p1-file-tier-2',
        label: 'File Tier 2 (7 provisionals)',
        description: 'Sundowning, biomarker engine, decline detection, speech, response time, decline predictor, transparency.',
        owner: 'attorney',
        duration: 'Weeks 3-4',
        cost: '$2,100 USPTO fees',
        blockedBy: ['p1-file-tier-1'],
        viewLinks: [
          { href: GITHUB + 'docs/ip/tier-2/', label: '7 Tier 2 drafts', kind: 'review' },
        ],
        deliverable: '7 additional filing receipts',
      },
      {
        id: 'p1-file-tier-3',
        label: 'File Tier 3 (11 provisionals)',
        description:
          'System-level patents: voice, music, UX, multi-tenant, CFR Part 11, wearable, FHIR, stats, circadian.',
        owner: 'attorney',
        duration: 'Weeks 5-6',
        cost: '$3,300 USPTO fees',
        blockedBy: ['p1-file-tier-2'],
        viewLinks: [
          { href: GITHUB + 'docs/ip/tier-3/', label: '11 Tier 3 drafts', kind: 'review' },
        ],
        deliverable: '11 additional filing receipts; full portfolio protected',
      },
      {
        id: 'p1-trademark-search',
        label: 'USPTO TESS trademark search for "Gentle Reminder"',
        description:
          'Free search at USPTO TESS to verify mark availability before filing trademark application.',
        owner: 'you',
        duration: '20 minutes',
        cost: '$0',
        viewLinks: [
          { href: 'https://tmsearch.uspto.gov/', label: 'USPTO TESS search', kind: 'external' },
          {
            href: GITHUB + 'docs/ip-protection/04-trademark-registration.md',
            label: 'Trademark guide',
            kind: 'review',
          },
        ],
        deliverable: 'Screenshot of TESS search results; list of conflicting marks (if any)',
      },
      {
        id: 'p1-trademark-file',
        label: 'File USPTO trademark for "Gentle Reminder" (Class 9 + 44)',
        description: 'TEAS Plus filing ($250/class × 2 = $500). Self-filable using provided guide.',
        owner: 'you',
        duration: '2 hours (first filing)',
        cost: '$500',
        blockedBy: ['p1-trademark-search', 'p0-entity'],
        viewLinks: [
          { href: 'https://teas.uspto.gov/initial/', label: 'TEAS filing portal', kind: 'external' },
          {
            href: GITHUB + 'docs/ip-protection/04-trademark-registration.md',
            label: 'Filing guide',
            kind: 'review',
          },
        ],
        deliverable: '2 USPTO serial numbers; ™ usage authorized',
      },
    ],
  },

  // ============================================================
  // PHASE 2 — Grant Applications (PARALLEL WITH PHASE 1)
  // ============================================================
  {
    id: 'phase-2',
    number: 2,
    label: 'Non-Dilutive Grant Applications',
    goal: 'Submit SBIR Phase I + other grants. Engage grant specialists on contingency. Start in parallel with Phase 1.',
    blocking: false,
    actions: [
      {
        id: 'p2-start-sam',
        label: 'Start SAM.gov UEI registration (3-5 week long pole)',
        description:
          'Required for ALL federal grants. Takes 3-5 weeks. Start TODAY. Bottleneck for everything downstream.',
        owner: 'you',
        duration: '30 min form + 3-5 weeks waiting',
        cost: '$0',
        blockedBy: ['p0-entity', 'p0-ein'],
        viewLinks: [
          { href: 'https://sam.gov/', label: 'SAM.gov', kind: 'external' },
          {
            href: GITHUB + 'docs/registrations/README.md#6-samgov--unique-entity-id-uei--critical-path',
            label: 'Registration guide',
            kind: 'review',
          },
        ],
        deliverable: 'Unique Entity ID (UEI) issued',
      },
      {
        id: 'p2-era-commons',
        label: 'Register eRA Commons (NIH grants portal)',
        description: 'Can register before SAM.gov completes. SO + PI accounts needed.',
        owner: 'you',
        duration: '1-2 business days for SO approval',
        cost: '$0',
        viewLinks: [
          { href: 'https://public.era.nih.gov/commons/', label: 'eRA Commons', kind: 'external' },
        ],
        deliverable: 'Active eRA Commons SO + PI accounts',
      },
      {
        id: 'p2-sbc-registration',
        label: 'Register Small Business Concern at SBIR.gov',
        description: 'Self-certification, immediate. Required for SBIR eligibility.',
        owner: 'you',
        duration: '15 minutes',
        cost: '$0',
        blockedBy: ['p0-entity'],
        viewLinks: [
          { href: 'https://www.sbir.gov/registration', label: 'SBC registration', kind: 'external' },
        ],
        deliverable: 'SBC Registry Number',
      },
      {
        id: 'p2-contact-grant-specialists',
        label: 'Contact 3 grant specialists on contingency basis',
        description: 'Parallel outreach to TurboSBIR, Blue Haven Grant, InteliSpark.',
        owner: 'you',
        duration: 'Day 1: send emails. Day 3-7: compare responses.',
        cost: '$0',
        blockedBy: ['p0-entity'],
        viewLinks: [
          {
            href: '/private/outreach/grant-spec-turbosbir',
            label: 'TurboSBIR template',
            kind: 'template',
          },
          {
            href: '/private/outreach/grant-spec-bluehaven',
            label: 'Blue Haven template',
            kind: 'template',
          },
          {
            href: '/private/outreach/grant-spec-intelispark',
            label: 'InteliSpark template',
            kind: 'template',
          },
        ],
        deliverable: '3 proposals with fee terms in writing',
      },
      {
        id: 'p2-review-sbir-draft',
        label: 'Review drafted NIA SBIR Phase I application',
        description:
          'Full application package drafted — review and customize with your personal info before engaging grant specialist or submitting.',
        owner: 'you',
        duration: '2 hours',
        cost: '$0',
        viewLinks: [
          {
            href: GITHUB + 'docs/grants/nia-sbir-phase-1/README.md',
            label: 'SBIR application guide',
            kind: 'review',
          },
          {
            href: GITHUB + 'docs/grants/nia-sbir-phase-1/specific-aims.md',
            label: 'Specific Aims',
            kind: 'review',
          },
          {
            href: GITHUB + 'docs/grants/nia-sbir-phase-1/research-strategy.md',
            label: 'Research Strategy',
            kind: 'review',
          },
          {
            href: GITHUB + 'docs/grants/nia-sbir-phase-1/commercialization-plan.md',
            label: 'Commercialization Plan',
            kind: 'review',
          },
          {
            href: GITHUB + 'docs/grants/nia-sbir-phase-1/budget-justification.md',
            label: 'Budget',
            kind: 'review',
          },
        ],
        deliverable: 'Application customized and ready for academic PI outreach',
      },
      {
        id: 'p2-recruit-academic-pi',
        label: 'Recruit academic PI for collaboration',
        description: 'Contact 3-5 memory and aging centers. Offer subaward ($55K of $275K Phase I).',
        owner: 'you',
        duration: '2-3 weeks',
        cost: '$0',
        blockedBy: ['p0-entity'],
        viewLinks: [
          {
            href: GITHUB + 'docs/grants/nia-sbir-phase-1/letters-of-support-template.md',
            label: 'PI outreach email template',
            kind: 'template',
          },
        ],
        deliverable: 'Academic PI committed as co-investigator',
      },
      {
        id: 'p2-submit-sbir',
        label: 'Submit NIA SBIR Phase I',
        description: 'Deadlines: Sep 5, Jan 5, Apr 5. Submit 1 week early. 15-25% success rate.',
        owner: 'both',
        duration: 'Submission day',
        cost: '$0 to submit',
        blockedBy: ['p2-start-sam', 'p2-era-commons', 'p2-sbc-registration', 'p2-review-sbir-draft', 'p2-recruit-academic-pi', 'p1-file-tier-1'],
        viewLinks: [
          { href: 'https://public.era.nih.gov/assist/', label: 'NIH ASSIST', kind: 'external' },
        ],
        deliverable: 'NIH eRA Commons submission confirmation',
      },
      {
        id: 'p2-file-brightfocus',
        label: 'File BrightFocus Alzheimer\'s Research Grant',
        description:
          '$300K over 3 years. Deadline: Nov annually. Parallel track to SBIR.',
        owner: 'both',
        duration: '3-4 weeks to prepare',
        cost: '$0',
        blockedBy: ['p2-recruit-academic-pi'],
        viewLinks: [
          { href: 'https://www.brightfocus.org/alzheimers/grants', label: 'BrightFocus portal', kind: 'external' },
          {
            href: GITHUB + 'docs/grants/brightfocus/README.md',
            label: 'BrightFocus application draft',
            kind: 'review',
          },
        ],
        deliverable: 'BrightFocus submission confirmation',
      },
      {
        id: 'p2-file-alz-rgp',
        label: 'File Alzheimer\'s Association RGP',
        description: '$150-500K over 1-3 years. Multiple cycles annually.',
        owner: 'both',
        duration: '3-4 weeks to prepare',
        cost: '$0',
        blockedBy: ['p2-recruit-academic-pi'],
        viewLinks: [
          { href: 'https://www.alz.org/research/for_researchers/grants', label: 'Alz Association grants', kind: 'external' },
          {
            href: GITHUB + 'docs/grants/alzheimers-association-rgp/README.md',
            label: 'Alz Assoc draft',
            kind: 'review',
          },
        ],
        deliverable: 'Alz Association submission confirmation',
      },
    ],
  },

  // ============================================================
  // PHASE 3 — Strategic Partner + Investor Outreach (AFTER TIER 1 FILED)
  // ============================================================
  {
    id: 'phase-3',
    number: 3,
    label: 'Strategic Partner & Investor Outreach',
    goal: 'Open fundraising conversations once Tier 1 patents are filed.',
    blocking: false,
    actions: [
      {
        id: 'p3-review-pitch-deck',
        label: 'Review + customize pitch deck',
        description: '16-slide deck drafted; review and update with your specific details before sending.',
        owner: 'you',
        duration: '1-2 hours',
        cost: '$0',
        viewLinks: [
          { href: '/private/deck', label: 'Open pitch deck', kind: 'review' },
        ],
        deliverable: 'Customized pitch deck PDF',
      },
      {
        id: 'p3-review-exec-summary',
        label: 'Review + customize executive summary',
        description: '1-page executive summary for first-touch outreach.',
        owner: 'you',
        duration: '30 min',
        cost: '$0',
        viewLinks: [
          { href: '/private/exec-summary', label: 'Open exec summary', kind: 'review' },
        ],
        deliverable: 'Customized 1-page PDF',
      },
      {
        id: 'p3-review-financial-model',
        label: 'Review + update financial model',
        description: '5-year projections, unit economics, use of funds. Update with your actual numbers.',
        owner: 'you',
        duration: '2-3 hours',
        cost: '$0',
        viewLinks: [
          {
            href: GITHUB + 'docs/financial-model/README.md',
            label: 'Financial model docs',
            kind: 'review',
          },
          {
            href: GITHUB + 'docs/financial-model/5-year-projection.csv',
            label: '5-year projection CSV',
            kind: 'review',
          },
        ],
        deliverable: 'Customized financial model ready for data room',
      },
      {
        id: 'p3-review-investor-faq',
        label: 'Review investor FAQ',
        description: 'Pre-answered common investor questions. Memorize top 10 before first pitch.',
        owner: 'you',
        duration: '1 hour',
        cost: '$0',
        viewLinks: [
          { href: '/private/investor-faq', label: 'Open investor FAQ', kind: 'review' },
        ],
        deliverable: 'Founder internalizes top 10 Q&A responses',
      },
      {
        id: 'p3-prep-data-room',
        label: 'Set up data room',
        description: 'Docsend or Google Drive with tiered access. Upload all customized materials.',
        owner: 'you',
        duration: '2-3 hours',
        cost: '$0-$150/mo',
        blockedBy: ['p0-cap-table', 'p3-review-pitch-deck', 'p3-review-exec-summary', 'p3-review-financial-model'],
        viewLinks: [
          { href: 'https://docsend.com', label: 'Docsend', kind: 'external' },
          { href: 'https://drive.google.com', label: 'Google Drive', kind: 'external' },
        ],
        deliverable: 'Data room with 3 access tiers',
      },
      {
        id: 'p3-vc-outreach-round-1',
        label: 'Send outreach to Tier A seed VCs (10 firms in parallel)',
        description: 'Flare Capital, Define, 7wire, .406, a16z Bio, General Catalyst, Oak HC/FT, Optum, Biogen DH.',
        owner: 'you',
        duration: '1 day (send), 2 weeks (meetings)',
        cost: '$0',
        blockedBy: ['p1-file-tier-1', 'p3-prep-data-room'],
        viewLinks: [
          { href: '/private/outreach', label: 'Open outreach queue', kind: 'template' },
          { href: '/private/templates', label: 'Email templates', kind: 'template' },
        ],
        deliverable: '3-5 first meetings scheduled',
      },
      {
        id: 'p3-advisor-outreach',
        label: 'Recruit clinical advisory board (3-5 members)',
        description: '12-15 named targets at UCSF MAC, MGH, Emory, Johns Hopkins, Cleveland Clinic, Mayo.',
        owner: 'you',
        duration: '4-8 weeks',
        cost: '$0 + equity (0.25-0.5% per advisor)',
        viewLinks: [
          { href: '/private/advisors', label: 'Target advisor list', kind: 'template' },
        ],
        deliverable: '3-5 clinical advisors signed',
      },
      {
        id: 'p3-pharma-strategic',
        label: 'Reach out to strategic pharma partners',
        description: 'Biogen, Eisai, Lilly. Strategic-pharma template. NDA before IP share.',
        owner: 'you',
        duration: '1 day (send), 4-8 weeks (response)',
        cost: '$0',
        blockedBy: ['p1-file-tier-1'],
        viewLinks: [
          { href: '/private/outreach/strat-biogen', label: 'Biogen outreach', kind: 'template' },
          { href: '/private/outreach/strat-eisai', label: 'Eisai outreach', kind: 'template' },
          { href: '/private/outreach/strat-lilly', label: 'Lilly outreach', kind: 'template' },
        ],
        deliverable: 'Strategic discussion with 1-2 pharma',
      },
      {
        id: 'p3-accelerator-apps',
        label: 'Apply to Rock Health, YC, MATTER, StartUp Health',
        description: 'Parallel applications. Rock Health is highest fit for digital health.',
        owner: 'you',
        duration: '1 week',
        cost: '$0',
        blockedBy: ['p0-entity'],
        viewLinks: [
          { href: '/private/outreach/accel-rock-health', label: 'Rock Health', kind: 'template' },
          { href: '/private/outreach/accel-yc', label: 'Y Combinator', kind: 'template' },
        ],
        deliverable: 'Applications submitted',
      },
      {
        id: 'p3-close-seed',
        label: 'Close seed round',
        description: '$5M at $25M post-money. Lead + participating VCs. Use closing counsel.',
        owner: 'you',
        duration: '3-6 months end-to-end',
        cost: '$30K-$80K closing costs',
        blockedBy: ['p3-vc-outreach-round-1'],
        viewLinks: [
          {
            href: GITHUB + 'docs/monetization/INVESTOR-OUTREACH.md',
            label: 'Investor playbook',
            kind: 'review',
          },
        ],
        deliverable: 'Seed capital closed',
      },
    ],
  },

  // ============================================================
  // PHASE 4 — Post-Seed Scale
  // ============================================================
  {
    id: 'phase-4',
    number: 4,
    label: 'Scale Up (Post-Seed)',
    goal: 'Execute on funded roadmap: FDA 510(k), pilots, non-provisional patents.',
    blocking: false,
    actions: [
      {
        id: 'p4-nonprovisional',
        label: 'Begin non-provisional patent conversions (7-10 IPs)',
        description: 'Within 12 months of provisional filing. $80K-$150K per conversion.',
        owner: 'attorney',
        duration: 'Months 9-12',
        cost: '$500K-$1.5M total',
        blockedBy: ['p3-close-seed', 'p1-file-tier-1'],
        viewLinks: [
          {
            href: GITHUB + 'docs/monetization/PATENT-FILING-ACTION-PLAN.md',
            label: 'Conversion strategy',
            kind: 'review',
          },
        ],
        deliverable: 'Non-provisional applications filed',
      },
      {
        id: 'p4-fda-consultant',
        label: 'Engage FDA 510(k) consultant',
        description: 'Greenlight Guru, Emergo by UL, RCA. $250K-$500K for full 510(k) submission prep.',
        owner: 'you',
        duration: 'Month 4 onwards',
        cost: '$250K-$500K',
        blockedBy: ['p3-close-seed'],
        viewLinks: [
          { href: 'https://www.greenlight.guru', label: 'Greenlight Guru', kind: 'external' },
          { href: 'https://www.emergobyul.com', label: 'Emergo by UL', kind: 'external' },
        ],
        deliverable: 'FDA 510(k) consultant engaged',
      },
      {
        id: 'p4-pilots',
        label: 'Launch 3 facility pilots',
        description: 'Deploy with 3 assisted living / memory care facilities.',
        owner: 'you',
        duration: 'Months 3-9',
        cost: '$500K-$1.5M',
        blockedBy: ['p3-close-seed'],
        viewLinks: [
          {
            href: GITHUB + 'docs/clinical-validation/study-protocol.md',
            label: 'Study protocol',
            kind: 'review',
          },
        ],
        deliverable: '3 live pilots with 6-month outcome data',
      },
    ],
  },
];

export const EXECUTE_STATS = {
  totalActions: EXECUTE_PHASES.reduce((sum, p) => sum + p.actions.length, 0),
};
