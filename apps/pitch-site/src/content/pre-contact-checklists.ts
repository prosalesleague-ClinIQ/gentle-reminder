/**
 * Pre-Contact Checklists
 *
 * What MUST be in place before any contact is made,
 * and what can be shared at each stage of the relationship.
 *
 * CONFIDENTIAL — Internal Use Only
 */

export interface ChecklistItem {
  id: string;
  text: string;
  critical: boolean; // if true, MUST be done before proceeding
  rationale?: string;
  /**
   * When true, the item pre-populates as checked. Only set for items that are
   * verifiably complete based on the current state of this repository (a
   * PDF in public/, a live URL, an NDA template clause, etc.). User can still
   * uncheck. Items awaiting user action (entity formation, EIN, cap table
   * upload, LinkedIn updates, attorney vetting) stay unchecked by default.
   */
  defaultDone?: boolean;
  /** Evidence pointer (file path, URL fragment, clause) — shown as a tooltip / caption. */
  evidence?: string;
}

export interface Checklist {
  id: string;
  label: string;
  description: string;
  when: string; // when to run this checklist
  items: ChecklistItem[];
}

export const PRE_CONTACT_CHECKLISTS: Checklist[] = [
  // ============================================================
  // UNIVERSAL PRE-FLIGHT — Before any outreach
  // ============================================================
  {
    id: 'universal-preflight',
    label: 'Universal Pre-Flight Checklist',
    description: 'Run before your first outreach to any contact.',
    when: 'Before sending any outreach email or LinkedIn message.',
    items: [
      {
        id: 'entity-exists',
        text: 'Legal entity (Delaware C-Corp recommended) formed and active',
        critical: true,
        rationale: 'Signing NDAs as an unincorporated individual creates personal liability.',
      },
      {
        id: 'ein-ready',
        text: 'EIN obtained from IRS',
        critical: true,
      },
      {
        id: 'cap-table',
        text: 'Cap table exists and is clean (Carta, Pulley, or spreadsheet)',
        critical: true,
        rationale: 'Investors ask immediately.',
      },
      {
        id: 'ip-assignments',
        text: 'All founders have signed Invention Assignment Agreements',
        critical: true,
        rationale: 'Missing IP assignment can void the entire company value.',
      },
      {
        id: 'public-docs',
        text: 'Pitch site is live and reflects current state',
        critical: true,
        defaultDone: true,
        evidence: 'https://gentle-reminder-pitch.vercel.app (deployed)',
      },
      {
        id: 'exec-summary',
        text: 'One-page executive summary drafted (PDF, public-safe)',
        critical: true,
        defaultDone: true,
        evidence: '/Gentle-Reminder-Exec-Summary.pdf (public/, 276 KB)',
      },
      {
        id: 'pitch-deck',
        text: '16-slide pitch deck drafted (PDF + PPTX, public-safe)',
        critical: true,
        defaultDone: true,
        evidence: '/Gentle-Reminder-Pitch-Deck.pdf (1.1 MB) + .pptx (420 KB)',
      },
      {
        id: 'founder-bios',
        text: 'LinkedIn profiles optimized and consistent with pitch materials',
        critical: false,
      },
      {
        id: 'company-email',
        text: 'Professional email address on company domain (not gmail/outlook)',
        critical: false,
        rationale: 'Improves deliverability and professional appearance.',
      },
      {
        id: 'calendar-booking',
        text: 'Calendar booking link active (Calendly, Cal.com)',
        critical: false,
      },
      {
        id: 'data-room',
        text: 'Data room set up (Docsend, Google Drive, or Notion)',
        critical: false,
        rationale: 'Required before deep investor conversations.',
      },
    ],
  },

  // ============================================================
  // BEFORE SHARING IP — MUST HAVE NDA SIGNED
  // ============================================================
  {
    id: 'before-ip-share',
    label: 'Before Sharing IP Portfolio',
    description: 'Critical protections before any IP docket, claims, or code is shared.',
    when: 'After initial interest, before sending IP docket / claims / code access.',
    items: [
      {
        id: 'nda-signed',
        text: 'NDA signed by both parties (mutual or unilateral depending on context)',
        critical: true,
        rationale: 'Without NDA, shared IP becomes unprotected disclosure.',
      },
      {
        id: 'nda-scope',
        text: 'NDA scope explicitly includes patent claims, provisional applications, and trade secrets',
        critical: true,
        rationale: 'Our template already satisfies this (nda-templates.ts §1), but verify per-counterparty if THEY supply the NDA.',
      },
      {
        id: 'recipient-legitimate',
        text: 'Recipient organization verified as legitimate (website, registration, LinkedIn presence)',
        critical: true,
        rationale: 'Common scam: impostors pose as investors to extract IP.',
      },
      {
        id: 'verify-representative',
        text: 'Person signing NDA has authority to bind their organization (title, email domain match)',
        critical: true,
      },
      {
        id: 'finra-check',
        text: 'If success fee is proposed: FINRA broker-dealer registration verified at finra.org/brokercheck',
        critical: true,
        rationale: 'Paying success fees to unregistered brokers is illegal and voids your round.',
      },
      {
        id: 'material-disclosed',
        text: 'List of materials being disclosed is documented (for audit trail)',
        critical: false,
      },
      {
        id: 'watermark',
        text: 'Documents include confidentiality watermark or footer',
        critical: false,
      },
      {
        id: 'docsend-tracking',
        text: 'Using Docsend or similar to track who views what (optional but recommended)',
        critical: false,
      },
      {
        id: 'return-clause',
        text: 'NDA includes return/destruction clause',
        critical: true,
        rationale: 'Our template satisfies this (Mutual §6 / Unilateral §7); verify if counterparty supplies the NDA.',
      },
      {
        id: 'public-disclosure-risk',
        text: 'No public disclosure of unfiled inventions (conference talks, published papers, blog posts)',
        critical: true,
        rationale: 'Public disclosure before filing starts 12-month US clock and destroys foreign rights. Verify for every invention before disclosure.',
      },
    ],
  },

  // ============================================================
  // BEFORE PATENT ATTORNEY ENGAGEMENT
  // ============================================================
  {
    id: 'before-patent-attorney',
    label: 'Before Engaging a Patent Attorney',
    description: 'Verifications before signing an engagement letter.',
    when: 'Before signing with any patent attorney, especially equity/contingency models.',
    items: [
      {
        id: 'uspto-registered',
        text: 'Attorney is registered with USPTO (verify at uspto.gov/patents/apply/using-legal-services/finding-patent-practitioner)',
        critical: true,
      },
      {
        id: 'bar-active',
        text: 'State bar license is active (check state bar website)',
        critical: true,
      },
      {
        id: 'no-disciplinary',
        text: 'No disciplinary actions on record with USPTO or state bar',
        critical: true,
      },
      {
        id: 'conflict-check',
        text: 'Attorney has completed conflict check (no representation of competitors)',
        critical: true,
      },
      {
        id: 'fee-in-writing',
        text: 'Fee structure documented in writing (equity %, deferred amount, trigger events)',
        critical: true,
      },
      {
        id: 'equity-cap',
        text: 'If equity: cap on total equity awarded, regardless of billings',
        critical: true,
        rationale: 'Prevents runaway equity accumulation.',
      },
      {
        id: 'scope-clear',
        text: 'Scope of engagement clearly defined (which patents, non-provisional conversion, prosecution)',
        critical: true,
      },
      {
        id: 'termination-terms',
        text: 'Termination terms reasonable (founder can end relationship with cause)',
        critical: true,
      },
      {
        id: 'independent-counsel',
        text: 'Option for independent counsel review of engagement letter (required for equity arrangements under ABA Rule 1.8)',
        critical: true,
      },
      {
        id: 'references',
        text: 'Reference checks completed with 2-3 past startup clients',
        critical: false,
      },
    ],
  },

  // ============================================================
  // BEFORE ENGAGING PLACEMENT AGENT / CAPITAL RAISER
  // ============================================================
  {
    id: 'before-placement-agent',
    label: 'Before Engaging a Placement Agent or Capital Raiser',
    description: 'Critical regulatory and contractual verifications.',
    when: 'Before signing any engagement that includes a success fee on fundraising.',
    items: [
      {
        id: 'broker-dealer-license',
        text: 'FINRA broker-dealer registration verified at finra.org/brokercheck',
        critical: true,
        rationale: 'Unregistered brokers cannot legally collect success fees and can invalidate your round.',
      },
      {
        id: 'individual-rep',
        text: 'Individual representative is licensed (Series 79 or equivalent)',
        critical: true,
      },
      {
        id: 'sec-not-barred',
        text: 'No SEC bars or enforcement actions against firm or individual',
        critical: true,
        rationale: 'Check SEC EDGAR and sec.gov litigation releases.',
      },
      {
        id: 'fee-structure',
        text: 'Success fee structure clearly defined (% of capital raised, minimum, maximum)',
        critical: true,
      },
      {
        id: 'retainer-justified',
        text: 'If retainer: justified and capped',
        critical: true,
      },
      {
        id: 'equity-warrant',
        text: 'Equity / warrant terms specified (% of capital raised, strike price, vesting)',
        critical: true,
      },
      {
        id: 'attributed-investors',
        text: '"Attributed investor" definition is precise and narrow',
        critical: true,
        rationale: 'Loose definitions can mean you pay fees on investors you found yourself.',
      },
      {
        id: 'tail-period',
        text: 'Tail period capped (12 months max typical)',
        critical: true,
      },
      {
        id: 'exclusivity-limited',
        text: 'Exclusivity limited to 3-6 months OR non-exclusive',
        critical: true,
      },
      {
        id: 'carveouts',
        text: 'Carve-outs for pre-existing investor relationships (your warm leads)',
        critical: true,
      },
      {
        id: 'references-banker',
        text: 'References from 2-3 past healthtech clients (completed raises)',
        critical: false,
      },
    ],
  },

  // ============================================================
  // BEFORE VC PITCH MEETING
  // ============================================================
  {
    id: 'before-vc-meeting',
    label: 'Before First VC Meeting',
    description: 'Preparation checklist for any investor meeting.',
    when: '24-72 hours before any VC pitch meeting.',
    items: [
      {
        id: 'fund-research',
        text: 'Fund thesis researched; portfolio companies reviewed',
        critical: true,
      },
      {
        id: 'partner-research',
        text: 'Partner background researched (LinkedIn, past investments, talks)',
        critical: true,
      },
      {
        id: 'deck-current',
        text: 'Pitch deck reflects current traction and milestones',
        critical: true,
        defaultDone: true,
        evidence: 'Slide 12 shows 23 USPTO provisionals, 53K+ LOC, 16 FDA SaMD + IRB docs, 4 non-dilutive grants drafted',
      },
      {
        id: 'ask-specific',
        text: 'Specific ask clear ($ amount, post-money, intended runway)',
        critical: true,
        defaultDone: true,
        evidence: 'Slide 14: $5M seed · $25M post-money · 12-month runway',
      },
      {
        id: 'use-of-funds',
        text: 'Use of funds breakdown prepared',
        critical: true,
        defaultDone: true,
        evidence: 'Slide 15 — 7-line allocation summing to 100%',
      },
      {
        id: 'competitive-landscape',
        text: 'Competitive analysis up-to-date (Akili, Cogstate, Linus Health, etc.)',
        critical: true,
        defaultDone: true,
        evidence: 'Slide 11 — Linus Health, Cogstate, Neurotrack, Akili with weakness analysis',
      },
      {
        id: 'financial-model',
        text: '5-year financial model ready to share post-meeting',
        critical: false,
      },
      {
        id: 'references-prep',
        text: 'Customer / advisor references identified (if asked)',
        critical: false,
      },
      {
        id: 'competing-offers',
        text: 'Any competing investor interest noted (for FOMO)',
        critical: false,
      },
      {
        id: 'next-steps-prepared',
        text: 'Next steps proposed (follow-up call, deep dive, term sheet timeline)',
        critical: true,
        defaultDone: true,
        evidence: 'response-templates.ts — every investor reply includes a concrete next-step offer',
      },
    ],
  },

  // ============================================================
  // BEFORE SHARING WITH STRATEGIC PARTNER (PHARMA)
  // ============================================================
  {
    id: 'before-pharma-deep-dive',
    label: 'Before Pharma Strategic Partner Deep-Dive',
    description: 'Additional checks before sharing IP with pharma or medtech strategics.',
    when: 'After initial interest from Biogen, Eisai, Lilly, Medtronic, etc.',
    items: [
      {
        id: 'nda-executed',
        text: 'Unilateral NDA executed (we are Disclosing Party)',
        critical: true,
      },
      {
        id: 'nda-has-non-compete',
        text: 'NDA includes prohibition on developing competing IP for 24+ months',
        critical: true,
      },
      {
        id: 'partner-due-diligence',
        text: 'Counterparty\'s recent M&A and partnership activity reviewed',
        critical: true,
      },
      {
        id: 'partner-litigation',
        text: 'Counterparty\'s IP litigation history reviewed',
        critical: true,
      },
      {
        id: 'specific-purpose',
        text: 'Specific purpose of disclosure defined (evaluation for license, co-development, acquisition)',
        critical: true,
      },
      {
        id: 'clean-team',
        text: 'If counterparty is a competitor: clean-team provisions negotiated',
        critical: true,
        rationale: 'Ensures Confidential Information does not reach competitive decision-makers.',
      },
      {
        id: 'material-limited',
        text: 'Initial disclosure limited to portfolio overview + 3-5 most relevant IPs (not entire docket)',
        critical: true,
      },
      {
        id: 'counsel-present',
        text: 'Our counsel briefed on disclosure scope',
        critical: false,
      },
    ],
  },

  // ============================================================
  // BEFORE GRANT COLLABORATION / ACADEMIC PI
  // ============================================================
  {
    id: 'before-academic-collab',
    label: 'Before Academic Collaboration',
    description: 'Protections for IP + publication rights before grant submission.',
    when: 'Before SBIR/STTR/R01 submission with academic PI.',
    items: [
      {
        id: 'subaward-agreement',
        text: 'Subaward Agreement template reviewed',
        critical: true,
      },
      {
        id: 'publication-rights',
        text: 'Publication rights clearly defined (30-day review period for confidential content)',
        critical: true,
      },
      {
        id: 'ip-ownership',
        text: 'IP ownership: Gentle Reminder owns platform-derived IP; PI owns clinical data findings',
        critical: true,
      },
      {
        id: 'irb-approval',
        text: 'IRB approval process confirmed with collaborating institution',
        critical: true,
        rationale: 'IRB submission package is drafted (docs/clinical-validation/ — CVP-001, ICF-001, DMP-001, SMP-001) but no IRB has APPROVED it yet; academic PI recruitment still pending.',
      },
      {
        id: 'data-use-agreement',
        text: 'Data Use Agreement drafted for any PHI flowing to company',
        critical: true,
      },
      {
        id: 'funding-mechanism',
        text: 'Funding flow understood (prime vs subaward structure)',
        critical: true,
      },
      {
        id: 'reporting-obligations',
        text: 'Federal reporting obligations (Bayh-Dole Act) understood',
        critical: true,
        rationale: 'Federal funding triggers disclosure requirements for any new IP.',
      },
    ],
  },

  // ============================================================
  // BEFORE SIGNING ANYTHING
  // ============================================================
  {
    id: 'before-signing',
    label: 'Before Signing ANY Agreement',
    description: 'Universal pre-signature checklist.',
    when: 'Before signing NDA, engagement letter, term sheet, or any agreement.',
    items: [
      {
        id: 'read-in-full',
        text: 'Agreement read in full, not just summary',
        critical: true,
      },
      {
        id: 'counsel-reviewed',
        text: 'Counsel has reviewed (especially for equity, success fee, exclusivity terms)',
        critical: true,
      },
      {
        id: 'counterparty-authority',
        text: 'Counterparty signer has authority to bind their organization',
        critical: true,
      },
      {
        id: 'effective-date',
        text: 'Effective date is clear',
        critical: true,
      },
      {
        id: 'term-clear',
        text: 'Term and termination conditions clear',
        critical: true,
      },
      {
        id: 'governing-law',
        text: 'Governing law jurisdiction acceptable (prefer Delaware for DE C-Corps)',
        critical: true,
      },
      {
        id: 'dispute-resolution',
        text: 'Dispute resolution mechanism acceptable (prefer courts over mandatory arbitration for large matters)',
        critical: false,
      },
      {
        id: 'indemnification',
        text: 'Indemnification obligations reviewed',
        critical: true,
      },
      {
        id: 'assignment-limits',
        text: 'Assignment rights limited (can\'t have your NDA transferred to a competitor)',
        critical: true,
      },
      {
        id: 'counterparts-allowed',
        text: 'Electronic signatures allowed (for speed)',
        critical: false,
        rationale: 'Our templates allow this (Mutual §11(d)); verify in any counterparty agreement.',
      },
    ],
  },
];

export function getChecklistById(id: string): Checklist | undefined {
  return PRE_CONTACT_CHECKLISTS.find((c) => c.id === id);
}
