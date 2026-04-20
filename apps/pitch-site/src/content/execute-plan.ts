/**
 * Execute Plan — Step-by-step action list in order.
 * From zero to outreach-ready in defined phases.
 */

export type PhaseStatus = 'blocked' | 'ready' | 'in-progress' | 'done';

export interface Action {
  id: string;
  label: string;
  description: string;
  owner: 'you' | 'me' | 'attorney' | 'both';
  duration: string;
  cost: string;
  blockedBy?: string[];
  link?: { href: string; label: string };
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
        description: 'Use Stripe Atlas ($500) or Clerky ($299) or a local attorney. Delaware C-Corp is standard for VC fundraising. Skip LLC — VCs won\'t invest.',
        owner: 'you',
        duration: '2-3 business days',
        cost: '$299-$800',
        deliverable: 'Certificate of Incorporation, bylaws, board consent, founder stock issued',
      },
      {
        id: 'p0-ein',
        label: 'Obtain EIN from IRS',
        description: 'Free. Apply at irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online. Stripe Atlas/Clerky can also do this.',
        owner: 'you',
        duration: 'Same day if applied online by phone',
        cost: '$0',
        blockedBy: ['p0-entity'],
        deliverable: 'EIN letter',
      },
      {
        id: 'p0-bank',
        label: 'Open business bank account',
        description: 'Mercury or Brex (startup-friendly, fast). Need EIN + incorporation docs. This is where USPTO and grant fees are paid from.',
        owner: 'you',
        duration: '1-3 business days',
        cost: '$0',
        blockedBy: ['p0-ein'],
        deliverable: 'Active business checking account',
      },
      {
        id: 'p0-invention-assignment',
        label: 'Sign Invention Assignment Agreements with all founders',
        description: 'Every founder must sign an agreement transferring any IP they created (before or during the company) to the company. WITHOUT THIS, the company does not own the patents — the founders do personally, which voids VC investments and patent enforceability.',
        owner: 'you',
        duration: 'Same day with template',
        cost: '$0 (template) or $500-$1K (attorney review)',
        blockedBy: ['p0-entity'],
        deliverable: 'Signed IAA from each founder, filed in corporate records',
      },
      {
        id: 'p0-cap-table',
        label: 'Set up cap table',
        description: 'Carta or Pulley (free tier for early stage). Alternative: spreadsheet until seed close. Investors WILL ask immediately.',
        owner: 'you',
        duration: '1 hour',
        cost: '$0',
        blockedBy: ['p0-entity'],
        deliverable: 'Cap table showing all founder ownership',
      },
      {
        id: 'p0-uspto-account',
        label: 'Register USPTO and Pay.gov accounts',
        description: 'Free accounts at uspto.gov and pay.gov. Required for any patent filing.',
        owner: 'you',
        duration: '30 minutes',
        cost: '$0',
        deliverable: 'Active USPTO and Pay.gov logins',
      },
      {
        id: 'p0-founder-bios',
        label: 'Optimize LinkedIn + update contact info',
        description: 'Update LinkedIn to reflect founder role at Gentle Reminder. Set up founder@gentlereminder.health email (or similar domain) for professional outreach.',
        owner: 'you',
        duration: '1-2 hours',
        cost: '$12/year (domain) + $6/mo (Google Workspace)',
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
        id: 'p1-contact-attorneys',
        label: 'Send equity/contingency inquiries to 3 patent attorneys in parallel',
        description: 'Parallel cold emails to Carson Patents, Wojcik Law Firm, Miller IP Law using the equity-model template. Compare quotes within 7 days.',
        owner: 'both',
        duration: 'Day 1: send emails. Day 7-10: compare responses.',
        cost: '$0 to send',
        blockedBy: ['p0-entity', 'p0-invention-assignment'],
        link: { href: '/private/outreach/pat-carson', label: 'Open Carson Patents' },
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
        link: { href: '/private/nda', label: 'Open NDA templates' },
        deliverable: 'Signed NDA with patent firm',
      },
      {
        id: 'p1-share-ip-docket',
        label: 'Share IP docket with attorney (under NDA)',
        description: 'Provide attorney access to docs/ip/ directory: 23 drafted provisionals + prior art research + inventor disclosure.',
        owner: 'you',
        duration: '1 day',
        cost: '$0',
        blockedBy: ['p1-execute-nda-attorney'],
        deliverable: 'Attorney reviewing drafts',
      },
      {
        id: 'p1-file-tier-1',
        label: 'File Tier 1 (5 provisionals) — HIGHEST PRIORITY',
        description: 'Gentle feedback scoring, adaptive difficulty, dementia SM-2, multimodal state classifier, speech emotion. These are the foundation — file first.',
        owner: 'attorney',
        duration: '2 weeks from engagement',
        cost: '$1,500 USPTO fees + attorney fees (deferred or equity)',
        blockedBy: ['p1-share-ip-docket'],
        deliverable: '5 USPTO provisional application numbers with filing receipts',
      },
      {
        id: 'p1-file-tier-2',
        label: 'File Tier 2 (7 provisionals)',
        description: 'Sundowning, composite biomarker, decline detection, speech hesitation, response time, decline predictor, algorithm transparency.',
        owner: 'attorney',
        duration: 'Weeks 3-4',
        cost: '$2,100 USPTO fees',
        blockedBy: ['p1-file-tier-1'],
        deliverable: '7 additional filing receipts',
      },
      {
        id: 'p1-file-tier-3',
        label: 'File Tier 3 (11 provisionals)',
        description: 'System-level patents: voice companion, music therapy, UX, multi-tenant, CFR Part 11, response policies, wearable, FHIR, stats, circadian.',
        owner: 'attorney',
        duration: 'Weeks 5-6',
        cost: '$3,300 USPTO fees',
        blockedBy: ['p1-file-tier-2'],
        deliverable: '11 additional filing receipts; full portfolio protected',
      },
    ],
  },

  // ============================================================
  // PHASE 2 — Grant Applications (START IN PARALLEL WITH PHASE 1)
  // ============================================================
  {
    id: 'phase-2',
    number: 2,
    label: 'Non-Dilutive Grant Applications',
    goal: 'Submit SBIR Phase I and engage grant specialists on contingency basis. Start in parallel with Phase 1 — do not wait.',
    blocking: false,
    actions: [
      {
        id: 'p2-contact-grant-specialists',
        label: 'Contact 3 grant specialists on contingency basis',
        description: 'Parallel outreach to TurboSBIR, Blue Haven Grant, InteliSpark. All offer pay-upon-award or heavily-contingent fee models.',
        owner: 'you',
        duration: 'Day 1: send emails. Day 3-7: compare responses.',
        cost: '$0',
        blockedBy: ['p0-entity'],
        link: { href: '/private/outreach/grant-spec-turbosbir', label: 'Open TurboSBIR' },
        deliverable: '3 proposals with fee terms in writing',
      },
      {
        id: 'p2-verify-terms',
        label: 'Verify success-fee terms are clean',
        description: 'Required in writing from each firm: (a) exact fee % on award, (b) any upfront fees / deposits / platform fees, (c) what happens if Phase I only, not Phase II, (d) 2-3 client references, (e) win rate on NIA SBIR Phase I last 3 years.',
        owner: 'you',
        duration: '3-5 days',
        cost: '$0',
        blockedBy: ['p2-contact-grant-specialists'],
        deliverable: 'Verified terms, references checked, firm selected',
      },
      {
        id: 'p2-engage-grant-specialist',
        label: 'Engage selected grant specialist',
        description: 'Sign engagement letter. Share sanitized pitch materials (after NDA if they request). Begin Specific Aims development.',
        owner: 'both',
        duration: '1 week',
        cost: '$0 upfront with pure-contingency firms; possibly a small deposit otherwise',
        blockedBy: ['p2-verify-terms'],
        deliverable: 'Signed engagement; grant specialist working on submission',
      },
      {
        id: 'p2-recruit-academic-pi',
        label: 'Recruit academic PI for collaboration',
        description: 'Contact 3-5 memory and aging centers. Offer subaward ($50-75K of the $275K Phase I). Send grant-pi-outreach template.',
        owner: 'you',
        duration: '2-3 weeks',
        cost: '$0',
        blockedBy: ['p0-entity'],
        link: { href: '/private/templates', label: 'Open PI outreach template' },
        deliverable: 'Academic PI committed as co-investigator',
      },
      {
        id: 'p2-specific-aims',
        label: 'Draft Specific Aims page (1 page)',
        description: 'Core of the SBIR application. 3 aims in our clinical validation protocol map directly to this. Grant specialist or your team drafts.',
        owner: 'both',
        duration: '1-2 weeks',
        cost: '$0',
        blockedBy: ['p2-engage-grant-specialist'],
        deliverable: 'Specific Aims draft',
      },
      {
        id: 'p2-submit-sbir',
        label: 'Submit NIA SBIR Phase I',
        description: 'Next deadlines: Sep 5, Jan 5, Apr 5. Submit 1 week before deadline to avoid technical issues. Success rate 15-25%.',
        owner: 'both',
        duration: 'Submission day',
        cost: '$0 to submit',
        blockedBy: ['p2-specific-aims', 'p2-recruit-academic-pi', 'p1-file-tier-1'],
        deliverable: 'NIH eRA Commons submission confirmation',
      },
    ],
  },

  // ============================================================
  // PHASE 3 — Strategic Partner + Investor Outreach (AFTER PATENTS FILED)
  // ============================================================
  {
    id: 'phase-3',
    number: 3,
    label: 'Strategic Partner & Investor Outreach',
    goal: 'Open fundraising conversations once Tier 1 patents are filed.',
    blocking: false,
    actions: [
      {
        id: 'p3-prep-data-room',
        label: 'Set up data room',
        description: 'Docsend or Google Drive with tiered access. Upload: pitch deck, executive summary, IP portfolio (public-safe), FDA pathway status, cap table (Tier 2), full IP with claims (Tier 3 — post-NDA only).',
        owner: 'you',
        duration: '1 day',
        cost: '$0-$150/mo',
        blockedBy: ['p0-cap-table'],
        deliverable: 'Data room with 3 access tiers',
      },
      {
        id: 'p3-vc-outreach-round-1',
        label: 'Send cold/warm outreach to Tier A seed VCs (10 firms)',
        description: 'Flare Capital, Define Ventures, 7wire, .406, a16z Bio, General Catalyst, Oak HC/FT, Founders Fund, Lux Capital, Optum Ventures. Parallel.',
        owner: 'you',
        duration: '1 day (send), 2 weeks (meetings)',
        cost: '$0',
        blockedBy: ['p1-file-tier-1', 'p3-prep-data-room'],
        link: { href: '/private/outreach', label: 'Open outreach queue' },
        deliverable: '3-5 first meetings scheduled',
      },
      {
        id: 'p3-pharma-strategic',
        label: 'Reach out to strategic pharma partners',
        description: 'Biogen Digital Health, Eisai, Eli Lilly. Use strategic-pharma template. NDA required before IP share.',
        owner: 'you',
        duration: '1 day (send), 4-8 weeks (response)',
        cost: '$0',
        blockedBy: ['p1-file-tier-1'],
        link: { href: '/private/outreach/strat-biogen', label: 'Open Biogen outreach' },
        deliverable: 'Strategic discussion initiated with 1-2 pharma partners',
      },
      {
        id: 'p3-accelerator-apps',
        label: 'Apply to Rock Health, YC, MATTER, StartUp Health',
        description: 'Parallel applications. Rock Health is highest fit for digital health.',
        owner: 'you',
        duration: '1 week to prepare, rolling basis',
        cost: '$0',
        blockedBy: ['p0-entity'],
        deliverable: 'Applications submitted',
      },
      {
        id: 'p3-close-seed',
        label: 'Close seed round',
        description: '$5M at $25M post-money target. Lead investor + participating VCs. Use closing counsel.',
        owner: 'you',
        duration: '3-6 months end-to-end',
        cost: '$30K-$80K closing costs',
        blockedBy: ['p3-vc-outreach-round-1'],
        deliverable: 'Seed capital closed',
      },
    ],
  },

  // ============================================================
  // PHASE 4 — Scaling & FDA Path (POST-SEED)
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
        label: 'Begin non-provisional patent conversions (select 7-10 patents)',
        description: 'Within 12 months of provisional filing. Convert highest-value IPs first. Budget $80K-$150K per conversion.',
        owner: 'attorney',
        duration: 'Months 9-12',
        cost: '$500K-$1.5M across full portfolio',
        blockedBy: ['p3-close-seed', 'p1-file-tier-1'],
        deliverable: 'Non-provisional applications filed',
      },
      {
        id: 'p4-fda-consultant',
        label: 'Engage FDA 510(k) consultant',
        description: 'Greenlight Guru, Emergo by UL, RCA (Regulatory Compliance Associates), or similar. $250K-$500K for full 510(k) submission prep.',
        owner: 'you',
        duration: 'Month 4 onwards',
        cost: '$250K-$500K',
        blockedBy: ['p3-close-seed'],
        deliverable: 'FDA 510(k) consultant engaged',
      },
      {
        id: 'p4-pilots',
        label: 'Launch 3 facility pilots',
        description: 'Deploy with 3 assisted living or memory care facilities. Validate clinical + operational outcomes.',
        owner: 'you',
        duration: 'Months 3-9',
        cost: '$500K-$1.5M',
        blockedBy: ['p3-close-seed'],
        deliverable: '3 live pilots with 6-month outcome data',
      },
    ],
  },
];

export const EXECUTE_STATS = {
  totalActions: EXECUTE_PHASES.reduce((sum, p) => sum + p.actions.length, 0),
  immediate: EXECUTE_PHASES[0].actions.length + EXECUTE_PHASES[1].actions.length + EXECUTE_PHASES[2].actions.length,
};
