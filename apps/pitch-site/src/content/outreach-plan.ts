/**
 * Outreach Plan — Prioritized by Speed × Cost
 *
 * CONFIDENTIAL. Do not share this content publicly.
 * Speed: days-to-value (1 = fastest)
 * Cost: dollar cost + equity dilution (1 = lowest cost)
 * Priority score: lower = higher priority
 */

export type ContactCategory =
  | 'patent-attorney'
  | 'placement-agent'
  | 'fractional-cfo'
  | 'vc-seed'
  | 'vc-strategic'
  | 'accelerator'
  | 'strategic-partner'
  | 'grant-program'
  | 'advisor';

export type ContactStage =
  | 'not-started'
  | 'researching'
  | 'first-contact'
  | 'responded'
  | 'in-discussion'
  | 'nda-sent'
  | 'nda-signed'
  | 'deep-engagement'
  | 'term-sheet'
  | 'closed-won'
  | 'closed-lost'
  | 'paused';

export interface OutreachContact {
  id: string;
  category: ContactCategory;
  org: string;
  contactName?: string;
  title?: string;
  location?: string;
  website: string;
  email?: string;
  linkedin?: string;
  speed: 1 | 2 | 3 | 4 | 5; // 1 = days, 5 = months+
  cost: 1 | 2 | 3 | 4 | 5; // 1 = free, 5 = $20K+ retainer + equity
  priorityScore: number;
  why: string;
  notes: string;
  templateId: string; // key into email templates
  ndaRequired: 'none' | 'before-contact' | 'before-ip-share' | 'after-interest';
  stage: ContactStage;
  contactedDate?: string;
  nextAction?: string;
  nextActionDate?: string;
  compensationModel: string;
}

export const OUTREACH_CONTACTS: OutreachContact[] = [
  // ============================================================
  // TIER 1 — FASTEST + FREE / LOWEST COST
  // ============================================================

  // --- Grants (completely non-dilutive, fastest path to non-dilutive cash) ---
  {
    id: 'grant-nia-sbir-p1',
    category: 'grant-program',
    org: 'NIH / NIA SBIR Phase I',
    contactName: 'Grants.gov submission',
    title: 'Federal non-dilutive',
    website: 'https://www.nia.nih.gov/research/training/sbir',
    speed: 4,
    cost: 1,
    priorityScore: 5,
    why: '$275K non-dilutive. Next deadline: Sep 5 / Jan 5 / Apr 5. No equity, no success fee.',
    notes: 'Requires 3-4 weeks to draft Specific Aims + Research Plan. Submission is free. 15-25% success rate.',
    templateId: 'grant-pi-outreach',
    ndaRequired: 'none',
    stage: 'not-started',
    compensationModel: 'Non-dilutive — no cost, no equity given up.',
  },
  {
    id: 'grant-brightfocus',
    category: 'grant-program',
    org: 'BrightFocus Alzheimer\'s Research',
    website: 'https://www.brightfocus.org/alzheimers/grants',
    speed: 4,
    cost: 1,
    priorityScore: 10,
    why: '$300K over 3 years. Non-dilutive. Next deadline: Nov annually.',
    notes: 'Apply with academic collaborator for strongest chance. 5-10% success rate.',
    templateId: 'grant-pi-outreach',
    ndaRequired: 'none',
    stage: 'not-started',
    compensationModel: 'Non-dilutive.',
  },

  // --- SBIR Grant Specialists (success-fee / pay-upon-award) ---
  {
    id: 'grant-spec-turbosbir',
    category: 'advisor',
    org: 'TurboSBIR / NIH4Startups',
    website: 'https://www.turbosbir.com/nihsbir/',
    speed: 2,
    cost: 1,
    priorityScore: 2,
    why: 'Success-fee model: PhD-level grant consulting/writing at no upfront cost. You only pay if/when the award is granted.',
    notes: 'Verify: (a) exact success fee percentage, (b) whether software/platform fee is separate from success fee, (c) what happens if award is Phase I only vs Fast-Track. Get terms in writing.',
    templateId: 'grant-specialist-contingency',
    ndaRequired: 'before-ip-share',
    stage: 'not-started',
    compensationModel: 'Success fee only on grant award. Software/interface may be separate small fee. Ask for full fee schedule in writing.',
  },
  {
    id: 'grant-spec-bluehaven',
    category: 'advisor',
    org: 'Blue Haven Grant Consultants',
    website: 'https://www.bluehavengrantconsultants.com/sbir',
    speed: 2,
    cost: 1,
    priorityScore: 3,
    why: '"Pay Upon Award" guarantee: no fee unless grant is awarded. Specializes in medical device, pharma, diagnostic, biotech NIH/NSF grants.',
    notes: 'Verify exact terms of Pay-Upon-Award. Ask for sample successful applications (under NDA). Focus area alignment (dementia SaMD) is strong fit.',
    templateId: 'grant-specialist-contingency',
    ndaRequired: 'before-ip-share',
    stage: 'not-started',
    compensationModel: '"Pay Upon Award" — fee only charged if grant is successfully funded.',
  },
  {
    id: 'grant-spec-intelispark',
    category: 'advisor',
    org: 'InteliSpark',
    website: 'http://www.intelispark.com/',
    speed: 2,
    cost: 2,
    priorityScore: 4,
    why: 'SBIR/STTR proposal development for NSF, NIH, DoD. Large portion of fee contingent on success.',
    notes: 'Partial contingency model — may require upfront deposit. Verify split between upfront and contingent.',
    templateId: 'grant-specialist-contingency',
    ndaRequired: 'before-ip-share',
    stage: 'not-started',
    compensationModel: 'Mixed: partial upfront + large success-contingent portion. Get specific breakdown.',
  },
  {
    id: 'grant-spec-eva-garland',
    category: 'advisor',
    org: 'Eva Garland Consulting',
    website: 'https://www.evagarland.com/',
    speed: 3,
    cost: 3,
    priorityScore: 7,
    why: 'Inc. 5000 SBIR specialist. Strong track record, scientific rigor, grant accounting services. Custom engagement model (not pure contingency).',
    notes: 'Engages with Strategic Non-Dilutive Funding Plan upfront. Higher cost but higher win rate. Compare vs contingency options.',
    templateId: 'grant-specialist-retainer',
    ndaRequired: 'before-ip-share',
    stage: 'not-started',
    compensationModel: 'Custom retainer + potentially success bonus. Requires upfront payment.',
  },

  // --- Direct VC outreach (zero cost, days-to-weeks) ---
  {
    id: 'vc-flare-capital',
    category: 'vc-seed',
    org: 'Flare Capital Partners',
    location: 'Boston, MA',
    website: 'https://flarecapital.com',
    speed: 2,
    cost: 1,
    priorityScore: 3,
    why: 'Digital health focus, Seed/Series A ($1-10M). Strong dementia care portfolio.',
    notes: 'Warm intro needed. Check portfolio for founder intros. Partners: Parth Desai, Dan Gebremedhin, William Geary.',
    templateId: 'vc-cold-seed',
    ndaRequired: 'none',
    stage: 'not-started',
    compensationModel: '20-25% dilution for $5M seed at $25M post.',
  },
  {
    id: 'vc-define-ventures',
    category: 'vc-seed',
    org: 'Define Ventures',
    location: 'San Francisco, CA',
    website: 'https://defineventures.com',
    speed: 2,
    cost: 1,
    priorityScore: 4,
    why: 'Digital health-only thesis. Seed/Series A. Strong pattern recognition on healthcare SaaS.',
    notes: 'Founders: Lynne Chou O\'Keefe, Jennifer Cook. Warm intro preferred.',
    templateId: 'vc-cold-seed',
    ndaRequired: 'none',
    stage: 'not-started',
    compensationModel: 'Typical seed dilution.',
  },
  {
    id: 'vc-a16z-bio',
    category: 'vc-seed',
    org: 'a16z Bio + Health',
    location: 'Menlo Park, CA',
    website: 'https://a16z.com/bio-health',
    speed: 3,
    cost: 1,
    priorityScore: 6,
    why: 'Large fund, digital health practice, brand halo.',
    notes: 'Harder to reach without warm intro. Partner: Vineeta Agarwala, Jorge Conde, Julie Yoo.',
    templateId: 'vc-cold-seed',
    ndaRequired: 'none',
    stage: 'not-started',
    compensationModel: 'Typical seed dilution.',
  },
  {
    id: 'vc-general-catalyst',
    category: 'vc-seed',
    org: 'General Catalyst',
    location: 'Cambridge, MA / NYC',
    website: 'https://generalcatalyst.com',
    speed: 3,
    cost: 1,
    priorityScore: 7,
    why: 'HealthAssurance fund, dementia-adjacent investments. Multi-stage.',
    notes: 'Partners: Hemant Taneja, Holly Maloney, Chris Bischoff.',
    templateId: 'vc-cold-seed',
    ndaRequired: 'none',
    stage: 'not-started',
    compensationModel: 'Typical seed dilution.',
  },
  {
    id: 'vc-7wire',
    category: 'vc-seed',
    org: '7wireVentures',
    location: 'Chicago, IL',
    website: 'https://7wireventures.com',
    speed: 2,
    cost: 1,
    priorityScore: 5,
    why: 'Deep healthcare SaaS experience (Livongo alumni). Digital health only.',
    notes: 'Founders: Glen Tullman, Lee Shapiro. Strong thesis match.',
    templateId: 'vc-cold-seed',
    ndaRequired: 'none',
    stage: 'not-started',
    compensationModel: 'Typical seed dilution.',
  },
  {
    id: 'vc-406-ventures',
    category: 'vc-seed',
    org: '.406 Ventures',
    location: 'Boston, MA',
    website: 'https://www.406ventures.com',
    speed: 2,
    cost: 1,
    priorityScore: 8,
    why: 'Healthcare + cybersecurity. HIPAA/FDA compliance alignment.',
    notes: 'Partners: Liam Donohue, Greg Dracon, Maria Dramalioti-Taylor.',
    templateId: 'vc-cold-seed',
    ndaRequired: 'none',
    stage: 'not-started',
    compensationModel: 'Typical seed dilution.',
  },
  {
    id: 'vc-oak-hcft',
    category: 'vc-seed',
    org: 'Oak HC/FT',
    location: 'Greenwich, CT',
    website: 'https://oakhcft.com',
    speed: 3,
    cost: 1,
    priorityScore: 12,
    why: 'Healthcare + fintech. Multi-stage from seed.',
    notes: 'Founders: Annie Lamont, Tricia Kemp, Andrew Adams. Healthtech deep bench.',
    templateId: 'vc-cold-seed',
    ndaRequired: 'none',
    stage: 'not-started',
    compensationModel: 'Typical seed dilution.',
  },

  // --- Strategic VCs (corporate venture, strategic alignment) ---
  {
    id: 'vc-optum-ventures',
    category: 'vc-strategic',
    org: 'Optum Ventures',
    location: 'Palo Alto, CA',
    website: 'https://optumventures.com',
    speed: 3,
    cost: 1,
    priorityScore: 9,
    why: 'UnitedHealth corporate VC. Medicare Advantage alignment. Strong dementia population.',
    notes: 'Strategic partner path if they invest. Partner: Heather Mitchell, Virginia Turnage.',
    templateId: 'vc-strategic-corporate',
    ndaRequired: 'none',
    stage: 'not-started',
    compensationModel: 'Capital + strategic relationship.',
  },
  {
    id: 'vc-biogen-digital-health',
    category: 'vc-strategic',
    org: 'Biogen Digital Health Fund',
    location: 'Cambridge, MA',
    website: 'https://www.biogen.com',
    speed: 3,
    cost: 1,
    priorityScore: 2,
    why: 'Alzheimer\'s-focused corporate VC. Leqembi commercial relevance is DIRECT fit.',
    notes: 'Top strategic target. Contact via Biogen Innovation team.',
    templateId: 'vc-strategic-pharma',
    ndaRequired: 'after-interest',
    stage: 'not-started',
    compensationModel: 'Capital + licensing/partnership.',
  },
  {
    id: 'vc-merck-ghi',
    category: 'vc-strategic',
    org: 'Merck Global Health Innovation Fund',
    location: 'Kenilworth, NJ',
    website: 'https://www.merckghifund.com',
    speed: 3,
    cost: 1,
    priorityScore: 14,
    why: 'Pharma strategic. Cross-portfolio reach.',
    notes: 'Larger check sizes; Series A+ typical.',
    templateId: 'vc-strategic-pharma',
    ndaRequired: 'after-interest',
    stage: 'not-started',
    compensationModel: 'Capital + strategic.',
  },

  // --- Accelerators (fast intake, equity for capital + support) ---
  {
    id: 'accel-rock-health',
    category: 'accelerator',
    org: 'Rock Health',
    location: 'San Francisco, CA',
    website: 'https://rockhealth.com',
    speed: 2,
    cost: 2,
    priorityScore: 6,
    why: 'Gold-standard digital health accelerator + fund. Network of alumni + advisory.',
    notes: 'Rock Health Capital invests; Rock Health Advisory serves F500. Both are useful.',
    templateId: 'accelerator-application',
    ndaRequired: 'none',
    stage: 'not-started',
    compensationModel: 'Equity for capital + advisory support.',
  },
  {
    id: 'accel-yc',
    category: 'accelerator',
    org: 'Y Combinator',
    location: 'San Francisco, CA',
    website: 'https://www.ycombinator.com',
    speed: 3,
    cost: 2,
    priorityScore: 11,
    why: '$500K for 7% + brand halo + demo day access. High filter but huge network effects.',
    notes: 'Winter / Summer batches. Application open always.',
    templateId: 'accelerator-application',
    ndaRequired: 'none',
    stage: 'not-started',
    compensationModel: '$125K SAFE + $375K MFN for 7% standard equity.',
  },
  {
    id: 'accel-matter',
    category: 'accelerator',
    org: 'MATTER',
    location: 'Chicago, IL',
    website: 'https://matter.health',
    speed: 2,
    cost: 2,
    priorityScore: 13,
    why: 'Healthcare-specific accelerator. Good for provider relationships.',
    notes: 'Rolling intake; membership model.',
    templateId: 'accelerator-application',
    ndaRequired: 'none',
    stage: 'not-started',
    compensationModel: 'Membership fee + network access.',
  },
  {
    id: 'accel-startup-health',
    category: 'accelerator',
    org: 'StartUp Health',
    location: 'New York, NY',
    website: 'https://startuphealth.com',
    speed: 2,
    cost: 2,
    priorityScore: 15,
    why: 'Long-term health transformer program. 500+ portfolio companies.',
    notes: 'Equity participation; focus on health moonshots.',
    templateId: 'accelerator-application',
    ndaRequired: 'none',
    stage: 'not-started',
    compensationModel: 'Equity for long-term support.',
  },

  // ============================================================
  // TIER 2 — PATENT ATTORNEYS (URGENT: 6-week filing window)
  // ============================================================

  {
    id: 'pat-carson',
    category: 'patent-attorney',
    org: 'Carson Patents',
    location: 'Remote / Iowa',
    website: 'https://carsonpatents.com/equity-and-contingency-patent-fees/',
    email: 'info@carsonpatents.com',
    speed: 1,
    cost: 1,
    priorityScore: 1,
    why: 'Openly advertises equity + contingency for patent filings. Fastest path to priority dates.',
    notes: 'Best for Tier 1 (5 patents). Small firm; verify capacity for 23-patent portfolio.',
    templateId: 'patent-attorney-equity',
    ndaRequired: 'before-contact',
    stage: 'not-started',
    compensationModel: 'Equity 0.5-1% or contingency deferred to seed close; $300 USPTO fee per filing.',
  },
  {
    id: 'pat-wojcik',
    category: 'patent-attorney',
    org: 'Wojcik Law Firm',
    website: 'https://www.wojciklawfirm.com/equity-deferred-fees',
    speed: 1,
    cost: 1,
    priorityScore: 2,
    why: 'Has "Equity & Deferred Fees" as a stated practice area.',
    notes: 'Small firm. Use as parallel quote vs Carson Patents.',
    templateId: 'patent-attorney-equity',
    ndaRequired: 'before-contact',
    stage: 'not-started',
    compensationModel: 'Equity or deferred fees to seed close.',
  },
  {
    id: 'pat-miller-ip',
    category: 'patent-attorney',
    org: 'Miller IP Law',
    website: 'https://lawwithmiller.com',
    speed: 1,
    cost: 2,
    priorityScore: 3,
    why: 'Fixed-fee startup packages. Systems for rapid filings (good for volume).',
    notes: 'Good alternative if Carson/Wojcik won\'t take 23 patents.',
    templateId: 'patent-attorney-fixed-fee',
    ndaRequired: 'before-contact',
    stage: 'not-started',
    compensationModel: 'Fixed fee ~$1,500-$3,000 per provisional. Some deferred options.',
  },
  {
    id: 'pat-wsgr-hin-au',
    category: 'patent-attorney',
    org: 'Wilson Sonsini (WSGR)',
    contactName: 'Hin Au',
    title: 'Partner — IP Strategy, MedTech + Digital Health',
    location: 'Palo Alto, CA',
    website: 'https://www.wsgr.com/en/services/practice-areas/patents-and-innovations.html',
    speed: 3,
    cost: 3,
    priorityScore: 4,
    why: 'Premier healthtech IP firm. Hin Au specializes in MedTech + digital health + diagnostic software.',
    notes: 'Warm intro essential. 180+ patent attorneys. Use for non-provisional conversions post-seed.',
    templateId: 'patent-attorney-large-firm',
    ndaRequired: 'before-ip-share',
    stage: 'not-started',
    compensationModel: 'Deferred billing to seed close at standard rates (~$800/hr partners).',
  },
  {
    id: 'pat-cooley',
    category: 'patent-attorney',
    org: 'Cooley LLP — Medtech Practice',
    website: 'https://www.cooley.com/services/industry/medtech',
    speed: 3,
    cost: 3,
    priorityScore: 5,
    why: '30+ dedicated medtech patent attorneys. Cooley GO program for startups.',
    notes: 'Apply via cooleygo.com for startup engagement terms.',
    templateId: 'patent-attorney-large-firm',
    ndaRequired: 'before-ip-share',
    stage: 'not-started',
    compensationModel: 'Cooley GO startup terms: deferred billing + reduced rates.',
  },

  // ============================================================
  // TIER 3 — FRACTIONAL CFO / ADVISORY (retainer model)
  // ============================================================

  {
    id: 'cfo-burkland',
    category: 'fractional-cfo',
    org: 'Burkland Associates',
    website: 'https://burklandassociates.com/services/fractional-cfo/',
    speed: 2,
    cost: 4,
    priorityScore: 8,
    why: 'VC-backed startup focus. Frequent fundraising support.',
    notes: '$3-10K/month retainer. Good for post-seed ongoing finance function.',
    templateId: 'fractional-cfo-outreach',
    ndaRequired: 'before-ip-share',
    stage: 'not-started',
    compensationModel: '$3K-$10K/month retainer. No equity.',
  },
  {
    id: 'cfo-kruze',
    category: 'fractional-cfo',
    org: 'Kruze Consulting',
    website: 'https://kruzeconsulting.com/fractional-cfo-services/',
    speed: 2,
    cost: 4,
    priorityScore: 9,
    why: '800+ startups, $15B+ raised. Strong VC-backed experience.',
    notes: 'Data-driven; good benchmarking.',
    templateId: 'fractional-cfo-outreach',
    ndaRequired: 'before-ip-share',
    stage: 'not-started',
    compensationModel: 'Retainer model; no equity.',
  },
  {
    id: 'cfo-aircfo',
    category: 'fractional-cfo',
    org: 'airCFO',
    website: 'https://www.aircfo.com/services-offered/finance-fractional-cfo-services',
    speed: 2,
    cost: 4,
    priorityScore: 10,
    why: 'Startup-focused; retainer model.',
    notes: 'Alternative to Burkland / Kruze.',
    templateId: 'fractional-cfo-outreach',
    ndaRequired: 'before-ip-share',
    stage: 'not-started',
    compensationModel: 'Retainer model.',
  },

  // ============================================================
  // TIER 4 — PLACEMENT AGENTS (success fee, longer cycle)
  // ============================================================

  {
    id: 'agent-nhvp',
    category: 'placement-agent',
    org: 'New Harbor Venture Partners',
    website: 'https://www.newharborvp.com/about',
    speed: 4,
    cost: 5,
    priorityScore: 11,
    why: 'Healthcare-exclusive placement agent. Global institutional reach.',
    notes: 'MUST verify FINRA broker-dealer registration before engagement. Likely too senior for seed.',
    templateId: 'placement-agent-outreach',
    ndaRequired: 'before-ip-share',
    stage: 'not-started',
    compensationModel: '3-8% cash success fee + 0.5-1.5% equity. Retainer possible.',
  },
  {
    id: 'agent-locust-walk',
    category: 'placement-agent',
    org: 'Locust Walk',
    website: 'https://www.locustwalk.com',
    speed: 4,
    cost: 5,
    priorityScore: 12,
    why: 'MedTech-specialist. Fundraising + strategic deals.',
    notes: 'Strong for Series A+ or strategic transactions. Check broker-dealer status.',
    templateId: 'placement-agent-outreach',
    ndaRequired: 'before-ip-share',
    stage: 'not-started',
    compensationModel: '3-8% success fee + retainer + equity.',
  },

  // ============================================================
  // TIER 5 — STRATEGIC PARTNERS (pharma/medtech, M&A / licensing)
  // ============================================================

  {
    id: 'strat-biogen',
    category: 'strategic-partner',
    org: 'Biogen (Leqembi)',
    contactName: 'Digital Health / BD team',
    location: 'Cambridge, MA',
    website: 'https://www.biogen.com',
    speed: 4,
    cost: 1,
    priorityScore: 7,
    why: 'Flagship Alzheimer\'s therapy. Direct fit for cognitive maintenance companion + RWE.',
    notes: 'Outreach via Biogen Innovation team or at R&D day. High-value potential license.',
    templateId: 'strategic-pharma-license',
    ndaRequired: 'before-ip-share',
    stage: 'not-started',
    compensationModel: 'License: upfront + milestones + royalty OR acquisition.',
  },
  {
    id: 'strat-eisai',
    category: 'strategic-partner',
    org: 'Eisai (Leqembi co-marketer)',
    location: 'Tokyo / Woodcliff Lake, NJ',
    website: 'https://www.eisai.com',
    speed: 4,
    cost: 1,
    priorityScore: 13,
    why: 'Biogen co-marketer on Leqembi. Digital medicine team.',
    notes: 'US HQ in NJ. Direct outreach to digital health innovation team.',
    templateId: 'strategic-pharma-license',
    ndaRequired: 'before-ip-share',
    stage: 'not-started',
    compensationModel: 'License or co-development.',
  },
  {
    id: 'strat-lilly',
    category: 'strategic-partner',
    org: 'Eli Lilly (Kisunla / donanemab)',
    location: 'Indianapolis, IN',
    website: 'https://www.lilly.com',
    speed: 4,
    cost: 1,
    priorityScore: 14,
    why: 'FDA-approved Kisunla 2024. Active Alzheimer\'s program.',
    notes: 'Contact via Lilly Research Labs or Chief Medical Office.',
    templateId: 'strategic-pharma-license',
    ndaRequired: 'before-ip-share',
    stage: 'not-started',
    compensationModel: 'License or co-development.',
  },
  {
    id: 'strat-uhg',
    category: 'strategic-partner',
    org: 'UnitedHealth Group / Optum',
    location: 'Minnetonka, MN',
    website: 'https://www.unitedhealthgroup.com',
    speed: 5,
    cost: 1,
    priorityScore: 16,
    why: 'Largest Medicare Advantage. Risk stratification + member benefit potential.',
    notes: 'Enterprise sales cycle is long. Parallel to Optum Ventures relationship.',
    templateId: 'strategic-payer',
    ndaRequired: 'before-ip-share',
    stage: 'not-started',
    compensationModel: 'Enterprise contract + pilot deployment.',
  },
];

// ============================================================
// SORTING HELPERS
// ============================================================

export function getContactsByPriority(): OutreachContact[] {
  return [...OUTREACH_CONTACTS].sort((a, b) => a.priorityScore - b.priorityScore);
}

export function getContactsByCategory(cat: ContactCategory): OutreachContact[] {
  return OUTREACH_CONTACTS.filter((c) => c.category === cat);
}

export function getContactsBySpeedAndCost(): OutreachContact[] {
  return [...OUTREACH_CONTACTS].sort((a, b) => {
    // Sort by speed first, then cost
    if (a.speed !== b.speed) return a.speed - b.speed;
    return a.cost - b.cost;
  });
}

export const CATEGORY_LABELS: Record<ContactCategory, string> = {
  'patent-attorney': 'Patent Attorney',
  'placement-agent': 'Placement Agent',
  'fractional-cfo': 'Fractional CFO',
  'vc-seed': 'VC — Seed',
  'vc-strategic': 'VC — Strategic',
  'accelerator': 'Accelerator',
  'strategic-partner': 'Strategic Partner',
  'grant-program': 'Grant Program',
  'advisor': 'Advisor',
};

export const STAGE_LABELS: Record<ContactStage, string> = {
  'not-started': 'Not Started',
  'researching': 'Researching',
  'first-contact': 'First Contact',
  'responded': 'Responded',
  'in-discussion': 'In Discussion',
  'nda-sent': 'NDA Sent',
  'nda-signed': 'NDA Signed',
  'deep-engagement': 'Deep Engagement',
  'term-sheet': 'Term Sheet',
  'closed-won': 'Closed — Won',
  'closed-lost': 'Closed — Lost',
  'paused': 'Paused',
};

export const STAGE_COLORS: Record<ContactStage, string> = {
  'not-started': '#6e7681',
  'researching': '#8b949e',
  'first-contact': '#58a6ff',
  'responded': '#3fb950',
  'in-discussion': '#3fb950',
  'nda-sent': '#d29922',
  'nda-signed': '#a371f7',
  'deep-engagement': '#a371f7',
  'term-sheet': '#f85149',
  'closed-won': '#3fb950',
  'closed-lost': '#6e7681',
  'paused': '#6e7681',
};
