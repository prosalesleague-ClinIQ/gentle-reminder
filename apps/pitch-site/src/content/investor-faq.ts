/**
 * Investor FAQ
 * 25+ pre-written answers to predictable investor questions.
 * Internalize these before any VC meeting.
 */

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  shortAnswer: string;
  detailedAnswer?: string;
}

export const INVESTOR_FAQ: FAQItem[] = [
  // ============ MARKET ============
  {
    id: 'market-size',
    category: 'Market',
    question: 'How big is the ACTUAL addressable market, not just TAM?',
    shortAnswer:
      'SOM is $450M — US memory care facilities (30K × 80 beds × $6K) + DTx prescriptions (1% of 6.7M Alzheimer\'s patients × $180/mo). Realistic 5-year capture with product-market fit.',
    detailedAnswer:
      'TAM ($186B) is the global dementia care market for context. SAM ($23B) is US digital therapeutics addressable. SOM ($450M) is what we realistically reach in 5 years: (a) facility SaaS with 30K memory care facilities averaging 80 beds at $6K/bed/year = $14.4B theoretical, we project capturing ~4% = $576M, (b) DTx prescriptions at $180/month for ~1% of 6.7M US Alzheimer\'s patients = $144M. Combined: $720M upper bound; $450M reasonable base case.',
  },
  {
    id: 'leqembi',
    category: 'Market',
    question: "Doesn't Leqembi/Kisunla make cognitive assessment redundant?",
    shortAnswer:
      'Opposite — anti-amyloid therapy INCREASES demand. Patients need cognitive monitoring between dosing to measure efficacy; pharma needs digital endpoints for RWE; payers need early decline signals to manage cost.',
    detailedAnswer:
      'Leqembi and Kisunla slow disease progression ~27%, but do not cure or stop decline. Patients on these therapies require monitoring at 3-6 month intervals. Standard assessments (MMSE) are too blunt to detect 0.5-point annual changes. Biogen, Eisai, and Lilly are actively seeking digital biomarkers as Phase 4 and RWE endpoints. Our platform is the digital companion to pharma — we are complementary, not competing.',
  },
  {
    id: 'payers',
    category: 'Market',
    question: 'Will payers actually reimburse this?',
    shortAnswer:
      'CPT codes 98975-98977 already exist for RPM; CMS added 0488T-0490T for digital therapeutics. Precedent: Akili EndeavorRx achieved limited coverage. We target Medicare Advantage first (earliest adopters for value-based care).',
    detailedAnswer:
      'Path: (1) FDA 510(k) clearance, (2) CPT code mapping, (3) Medicare Advantage pilots with outcomes sharing, (4) Medicare national coverage decision 12-18 months post-clearance. Humana, UnitedHealth, and Kaiser all have value-based dementia programs. Our post-market surveillance (GR-13 patent) generates the outcome data payers require.',
  },

  // ============ COMPETITION ============
  {
    id: 'akili-cogstate',
    category: 'Competition',
    question: 'How do you beat Akili / Cogstate / Linus Health / Neurotrack?',
    shortAnswer:
      'They\'re general-purpose cognitive platforms. We\'re dementia-specific from the algorithm up. Our 23 patents architecturally block them from our market — specifically the three-state feedback system (Tier 1 Patent #1).',
    detailedAnswer:
      'Akili (ADHD pediatric DTx) is a different indication with a different population — their adaptive difficulty is symmetric. Cogstate is trial-services only, no patient-facing platform. Linus Health (FDA-cleared K201738) uses pass/fail feedback, triggering the same anxiety issue MMSE does. Neurotrack is narrow (eye-tracking only). Our core Tier 1 patent (Gentle Feedback Scoring) architecturally prevents negative feedback delivery — no competitor can replicate without infringement risk or a full rewrite. Additionally, our dementia-specific IP portfolio (23 patents) raises switching costs substantially.',
  },
  {
    id: 'pear-akili-collapsed',
    category: 'Competition',
    question: 'Pear and Akili both collapsed post-IPO. Why won\'t you?',
    shortAnswer:
      'Three reasons: (1) our indication has 55M patients vs Akili\'s pediatric ADHD 6M, (2) we have 3 revenue streams vs their 1, (3) we have FDA pathway + clinical evidence maturity before launch.',
    detailedAnswer:
      'Pear (Reset for substance use disorders) failed because insurance didn\'t reimburse and sales cycle was too long. Akili (EndeavorRx) failed because pediatric ADHD has alternative DTx-free options. Our indication (dementia) has: (a) no curative treatment, creating persistent demand for supportive tools, (b) older patients with Medicare (better payer structure), (c) direct pharma partnership revenue from anti-amyloid class, (d) facility SaaS model already reimbursed through existing CPT codes.',
  },
  {
    id: 'big-tech',
    category: 'Competition',
    question: 'What if Apple or Google builds this?',
    shortAnswer:
      'They won\'t — FDA SaMD + clinical validation + HIPAA + care facility GTM is too specialized for horizontal platforms. More likely: they license from us or acquire.',
    detailedAnswer:
      'Apple\'s focus is HealthKit-based consumer data; Google focuses on AI model licensing. Both have built-in headwinds for medical software (liability, regulatory, clinical integration). Apple did partner with Biogen for the AD study — they chose to work with a pharma rather than build. Our 23-patent portfolio with FDA pathway + clinical evidence is a compelling acquisition target.',
  },

  // ============ IP ============
  {
    id: 'ip-risk',
    category: 'IP',
    question: 'What\'s the risk that your patents don\'t hold up?',
    shortAnswer:
      'All 23 are provisionals; priority dates secured. Professional prior art search planned for Tier 1 conversions. Trade-secret parameters preserve defense-in-depth even if a claim is narrowed.',
    detailedAnswer:
      'Prior art risk is real for any patent portfolio. We mitigate: (1) 23 patents diversify — even if 30% fail, 16 remain, (2) architectural patents (like Gentle Feedback Scoring) have clearer novelty than incremental algorithms, (3) specific numerical parameters are trade secrets, not disclosed in filings, so competitor must reverse-engineer, (4) our FTO (freedom-to-operate) analysis is pending but preliminary review clean. Worst case: 5-7 core patents issue, which is sufficient defense.',
  },
  {
    id: 'ip-enforcement',
    category: 'IP',
    question: 'How will you enforce patents against a large competitor?',
    shortAnswer:
      'Patent litigation is expensive ($3-10M) but we\'d reach settlement early. Biggest defensive value: prevents large competitors from entering our space, not that we need to sue.',
    detailedAnswer:
      'Patent defense strategy: (a) provisional + non-provisional filings create cost and delay for any infringer, (b) FDA-cleared product with issued patents makes us a preferred acquisition target vs. a litigation one, (c) our patents would be included in acquisition premium. Offensive litigation is a last resort; the moat is blocking fresh entrants, not suing established ones.',
  },
  {
    id: 'ip-conversion',
    category: 'IP',
    question: 'Can you really afford to convert 10 provisionals to non-provisionals?',
    shortAnswer:
      'At $80K-$150K per conversion × 10 = $800K-$1.5M. Covered in Use of Funds (Year 1-2 allocation). Selective conversion only on Tier 1 + strongest Tier 2.',
    detailedAnswer:
      'Realistic conversion strategy: Year 1 convert Tier 1 (5 patents) = $400-750K; Year 2 convert selected Tier 2 (3-5 patents) = $240-750K; Year 3 evaluate remaining for PCT (international) or abandon. Total: $640K-$1.5M over 3 years, well within the seed + Series A use of funds.',
  },

  // ============ TEAM ============
  {
    id: 'team-gaps',
    category: 'Team',
    question: 'What are the gaps in your team?',
    shortAnswer:
      'Clinical advisor (recruiting 3-5), FDA regulatory lead (external consultant planned), VP Sales (Y2 hire post-510k), dedicated Chief Medical Officer (Series A hire).',
    detailedAnswer:
      'Founder + technical co-founder cover product/engineering. Gaps: (1) Clinical advisory board — 3-5 physicians from NIH-funded memory centers being recruited, (2) FDA regulatory consultant — Greenlight Guru / Emergo engagement planned, (3) VP Sales with healthcare SaaS experience — hire post-510k when the GTM motion becomes repeatable, (4) CMO — Series A (post-$15M ARR trigger).',
  },
  {
    id: 'why-you',
    category: 'Team',
    question: 'Why are YOU the team to do this?',
    shortAnswer:
      '[Customize with actual founder story]. Combination of technical capability, healthcare domain understanding, and personal motivation to solve dementia care.',
    detailedAnswer:
      '[FOUNDER TO CUSTOMIZE] Be specific: personal connection to dementia (family member, caregiver experience), technical credentials that explain why you can actually build this, prior product/clinical shipping experience. Avoid generic "passion for healthcare".',
  },
  {
    id: 'solo-founder',
    category: 'Team',
    question: 'How are you executing this solo?',
    shortAnswer:
      'Not solo — building a co-founder bench and recruiting advisors. Seed round funds first 3 technical hires + clinical advisor stipends. Solo-to-Series-A is viable for software platforms with this IP density.',
  },

  // ============ FDA / REGULATORY ============
  {
    id: 'fda-timeline',
    category: 'Regulatory',
    question: 'How long to FDA 510(k) clearance?',
    shortAnswer:
      '12-18 months from submission (P50 ~15 months). Our submission target is 12 months post-seed. Total: ~24-30 months from seed close.',
    detailedAnswer:
      'FDA 510(k) submission requires: clinical validation data, substantial equivalence analysis vs predicate (K201738 Linus Health identified), software documentation (IEC 62304 complete), risk management (ISO 14971 complete), cybersecurity (STRIDE complete). Pre-Sub meeting within 3 months of seed close reduces submission risk. De Novo pathway backup if classification rejected.',
  },
  {
    id: 'fda-rejection',
    category: 'Regulatory',
    question: 'What if FDA rejects the 510(k)?',
    shortAnswer:
      'De Novo pathway backup. Also: Non-DTx commercial path (facility SaaS, pharma licensing) does NOT require 510(k); we generate revenue independent of clearance.',
    detailedAnswer:
      'Mitigation: (1) De Novo pathway for novel Class II devices, additional 6-12 months, (2) Class I GP software pathway for general wellness claims, (3) parallel non-clinical revenue from facility SaaS and pharma partnerships — these DON\'T require FDA clearance for operation, only for making specific clinical claims. Worst case: FDA-cleared product launches 6-12 months later than target, but business continues.',
  },
  {
    id: 'samd-class',
    category: 'Regulatory',
    question: 'How do you know FDA will classify this as SaMD Class II?',
    shortAnswer:
      'Per FDA\'s 2018 SaMD framework + IMDRF Cat III.i guidance, our device \'informs clinical management of a serious condition\' — which is Class II. Pre-Sub meeting confirms.',
    detailedAnswer:
      'Classification rubric: Class I (general wellness/low-risk), Class II (informs diagnostic or treatment decisions for non-life-threatening), Class III (critical life-threatening support). Our use case — cognitive assessment and biomarker tracking — falls squarely in Class II. Linus Health (K201738) predicate already cleared as Class II. FDA Pre-Sub meeting ($0 cost) provides formal classification letter.',
  },

  // ============ BUSINESS ============
  {
    id: 'why-now',
    category: 'Business',
    question: 'Why now?',
    shortAnswer:
      'Anti-amyloid therapy approvals (Leqembi 2023, Kisunla 2024) created urgent pharma demand for cognitive monitoring tools. Medicare Advantage investing in early-dementia detection. Facility operators need staff-multiplier technology.',
    detailedAnswer:
      'Three converging tailwinds: (1) Pharma — $20B+ projected sales of anti-amyloid therapies create $2-5B in digital companion market, (2) Payers — Medicare Advantage growing at 10% with dementia as top cost driver, (3) Facilities — staff shortages post-COVID demand technology multipliers. All three require tools that didn\'t exist pre-2023.',
  },
  {
    id: 'milestones',
    category: 'Business',
    question: 'What milestones get you to Series A?',
    shortAnswer:
      '(1) 510(k) submitted, (2) 3 pilot deployments live with outcome data, (3) $2-3M ARR run rate, (4) pharma term sheet signed, (5) 5-7 issued US patents.',
    detailedAnswer:
      'Series A trigger conditions (12-18 months post-seed): FDA 510(k) submission accepted by FDA (not necessarily cleared), 3+ facility pilots live with 6-month outcome data, $2-3M ARR run rate, 1+ strategic pharma term sheet (letter of intent for $2M+ deal), clinical advisor board assembled, 5-7 issued US patents (non-provisional conversions complete), SBIR Phase I awarded ($275K non-dilutive).',
  },
  {
    id: 'cogs',
    category: 'Business',
    question: 'What drives your 82% gross margin?',
    shortAnswer:
      'Cloud infrastructure + customer support + content. Predictable SaaS cost structure. No hardware, no per-patient drug costs.',
    detailedAnswer:
      'COGS breakdown: (1) Cloud infrastructure — AWS/GCP costs scale with users, ~5% of revenue, (2) Customer success — 1 CSM per 30 facilities, ~8% of revenue, (3) Content refresh/clinical updates, ~3% of revenue, (4) Third-party API costs (FHIR, speech), ~2% of revenue. Total: 18% COGS, 82% GM. Comparable healthcare SaaS: PointClickCare 85%, Epic 80%, Teladoc 65%.',
  },

  // ============ FINANCIAL ============
  {
    id: 'how-much-why',
    category: 'Financial',
    question: 'Why $5M and not $10M?',
    shortAnswer:
      '$5M gets us to Series A triggers (510(k) submission + 3 pilots + $2-3M ARR) in 12 months. Raising more pre-traction would dilute founders unnecessarily.',
    detailedAnswer:
      'We\'ve budgeted $5M as minimum viable: FDA pathway ($1.27M), engineering ($1.42M), pilots ($600K), IP ($600K), sales ($450K), ops + reserve ($410K), clinical ($250K). Raising $10M at this stage would: (a) over-dilute founders at pre-traction valuation, (b) invite pressure for premature commercial scaling, (c) trigger higher board oversight before product-market fit confirmed. Series A ($15-25M) at $75-100M post-money is the right moment for larger capital.',
  },
  {
    id: 'burn-runway',
    category: 'Financial',
    question: 'How long does $5M last?',
    shortAnswer:
      '15-18 months. Monthly burn ramp: $45K Y1 Q1 → $150K Q4. Average $75-90K/month. Includes seed close buffer.',
    detailedAnswer:
      'Runway model: $5M opens $4.9M net after $60-100K closing costs. Y1 burn ramp: Q1 $135K (hiring starts), Q2 $250K, Q3 $400K, Q4 $550K. Q4 YearEnd balance: $3.7M remaining. Y2 Q1-Q2: additional $700K-$900K burn. Series A close month 15-18 at $3.5M-$4.2M runway cushion.',
  },
  {
    id: 'profitability',
    category: 'Financial',
    question: 'When are you profitable?',
    shortAnswer:
      'Year 4 EBITDA-positive at $38M ARR. Year 3 gross profit positive. Y5 cash flow positive.',
  },
  {
    id: 'valuation',
    category: 'Financial',
    question: 'How do you justify $25M post-money?',
    shortAnswer:
      '23-patent IP portfolio alone: $22-57M sum-of-parts. FDA SaMD documentation readiness: +$5-10M premium. Production platform (53K LOC): $2-5M replacement cost. Team + trajectory: remainder.',
    detailedAnswer:
      'Valuation support: (1) IP portfolio — 23 USPTO provisionals valued at $22-57M sum-of-parts per comparable transactions, (2) FDA pathway — 12 months of documentation work at $500K loaded cost = $500K-$1M immediate replacement value, (3) Production platform — 53K LOC at $50-80/LOC = $2.5-4.2M replacement cost, (4) Team/trajectory — seed premium. Conservative floor: $15M; aggressive ceiling: $50M. $25M post is below both our IP sum-of-parts valuation and typical seed healthtech comps.',
  },

  // ============ EXIT / STRATEGIC ============
  {
    id: 'exit',
    category: 'Exit',
    question: 'What\'s the exit scenario?',
    shortAnswer:
      'Primary: strategic acquisition by pharma (Biogen/Eisai/Lilly) or MedTech (Medtronic/Philips/GE) at $150M-$500M, Years 3-5. Secondary: IPO at $500M-$2B, Year 5-7 (if DTx market recovers).',
    detailedAnswer:
      'Comparable exits: Pear (pre-failure) $1.6B peak, Cognoa ~$150M, Biofourmis ~$1.3B, Akili peak ~$1B. Our target acquirers: (1) Pharma — Biogen Digital Health Fund already active, Eisai investing in digital health, Lilly expanding post-Kisunla, (2) MedTech — Medtronic neuromodulation portfolio, Philips population health, GE imaging+monitoring, (3) Payer — UnitedHealth Optum, Humana, (4) Care operator — Brookdale, Sunrise. IPO path requires $100M+ ARR and market recovery post-Pear/Akili collapses.',
  },
  {
    id: 'why-strategic-acquires',
    category: 'Exit',
    question: 'Why would pharma actually acquire you vs. license?',
    shortAnswer:
      'Both are likely. Licensing first (Year 1-2), acquisition if commercial traction validates integration value. Precedent: Biogen acquired Ares Trading, Eisai acquired 4-D Molecular Therapeutics.',
  },

  // ============ RISK ============
  {
    id: 'biggest-risk',
    category: 'Risk',
    question: 'What\'s your biggest risk?',
    shortAnswer:
      'Enrollment risk in clinical validation (Phase I / 510(k)). Mitigated through pre-screened partnerships with memory centers. Backup: expand to 2 sites if primary falls short.',
    detailedAnswer:
      'Biggest risks ranked: (1) Clinical validation enrollment — mitigate via NIH-funded memory center partnerships, (2) FDA timeline delay — De Novo and non-clinical pathways as backup, (3) Key talent attrition — equity program + retention via vesting, (4) Competitor patent emerging — defensive prior-art + trade secrets, (5) Pharma strategic decides to build in-house — unlikely given complexity and IP moat.',
  },

  // ============ TRACTION ============
  {
    id: 'no-revenue',
    category: 'Traction',
    question: 'You have no revenue. Is this too early?',
    shortAnswer:
      '23-patent portfolio + FDA SaMD documentation + production platform is significant traction for pre-revenue seed. Typical pre-seed has pitch deck only; we have 53K LOC of deployed code.',
    detailedAnswer:
      'Most seed healthcare deals are pre-revenue. Our pre-seed traction exceeds typical: (1) 23 USPTO provisionals filed — $500K-$1M of legal work done, (2) FDA documentation complete — 12+ months of regulatory work, (3) 53K LOC production platform — $2-4M replacement cost, (4) 5 deployed apps running in production, (5) 4 grant applications drafted. Compare to typical seed pitch: Google Docs pitch deck + TAM/SAM/SOM slide.',
  },
];

export const FAQ_CATEGORIES = [
  'Market',
  'Competition',
  'IP',
  'Team',
  'Regulatory',
  'Business',
  'Financial',
  'Exit',
  'Risk',
  'Traction',
];
