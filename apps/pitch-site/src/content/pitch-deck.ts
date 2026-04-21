/**
 * Pitch Deck Content — 16 slides
 * Rendered at /private/deck as a print-to-PDF-ready page.
 */

export interface Slide {
  number: number;
  title: string;
  subtitle?: string;
  kicker?: string;
}

export const PITCH_DECK_SLIDES: Slide[] = [
  { number: 1, title: 'Title' },
  { number: 2, title: 'Problem' },
  { number: 3, title: 'Solution' },
  { number: 4, title: 'Product' },
  { number: 5, title: 'Market' },
  { number: 6, title: 'IP Moat' },
  { number: 7, title: 'FDA Pathway' },
  { number: 8, title: 'Business Model' },
  { number: 9, title: 'Revenue Projections' },
  { number: 10, title: 'Unit Economics' },
  { number: 11, title: 'Competitive Landscape' },
  { number: 12, title: 'Traction' },
  { number: 13, title: 'Team' },
  { number: 14, title: 'Ask' },
  { number: 15, title: 'Use of Funds' },
  { number: 16, title: 'Milestones & Contact' },
];

export const DECK_DATA = {
  company: 'Gentle Reminder',
  tagline: 'The clinical-grade dementia care platform',
  subtagline: '23 patented innovations. $186B market. FDA SaMD pathway.',
  ask: '$5M Seed',
  askTerms: '$25M post-money',
  founder: 'Christo Mac',
  founderTitle: 'Founder & CEO/COO',
  email: 'mack@matrixadvancedsolutions.com',
  phone: '[phone]',
  teamSummary: 'Christo Mac (CEO/COO) · Leo Kinsman (CTO) · Chris Hamel (CFO) · Jayla Patzer (Clinic & Provider Partnerships)',
  pitchSite: 'https://gentle-reminder-pitch.vercel.app',

  market: {
    TAM: '$186B',
    TAMDesc: 'Global dementia care market (Alzheimer\'s Disease International, 2023)',
    SAM: '$23B',
    SAMDesc: 'US digital therapeutics + digital health addressable segment',
    SOM: '$450M',
    SOMDesc: 'US memory care + DTx + MA contracts (5-year obtainable)',
  },

  projections: [
    { year: 'Y1', facilities: 8, patients: 640, arr: '$500K' },
    { year: 'Y2', facilities: 32, patients: '2.5K', arr: '$3.8M' },
    { year: 'Y3', facilities: 110, patients: '8.8K', arr: '$14M' },
    { year: 'Y4', facilities: 280, patients: '22.4K', arr: '$38M' },
    { year: 'Y5', facilities: 580, patients: '46.4K', arr: '$85M' },
  ],

  unitEconomics: [
    { metric: 'Facility ACV', value: '$60,000', note: '10 beds × $6K/year' },
    { metric: 'CAC (Facility)', value: '$3,000', note: 'Inside sales + pilot' },
    { metric: 'LTV (Facility)', value: '$180,000', note: '37.5-month lifetime' },
    { metric: 'LTV/CAC', value: '60×', note: 'Top-quartile SaaS' },
    { metric: 'Gross Margin', value: '82%', note: 'Cloud SaaS + support' },
    { metric: 'Annual Churn', value: '8%', note: 'vs 10-15% benchmark' },
  ],

  competitors: [
    { name: 'Linus Health', focus: 'Digital cognitive assessment', weakness: 'Pass/fail delivery; not dementia-safe' },
    { name: 'Cogstate', focus: 'Computerized cognitive testing', weakness: 'Trial-only; no caregiver platform' },
    { name: 'Neurotrack', focus: 'Eye-tracking assessment', weakness: 'Narrow modality' },
    { name: 'Akili / EndeavorRx', focus: 'Pediatric ADHD DTx', weakness: 'Different indication; collapsed post-IPO' },
  ],

  useOfFunds: [
    { category: 'FDA 510(k) preparation + submission', amount: '$1.27M', pct: '25%' },
    { category: 'Engineering (6 FTE)', amount: '$1.42M', pct: '28%' },
    { category: 'Pilot deployments (3 facilities)', amount: '$600K', pct: '12%' },
    { category: 'IP portfolio (non-provisional conversions)', amount: '$600K', pct: '12%' },
    { category: 'Sales & partnerships', amount: '$450K', pct: '9%' },
    { category: 'Operations + reserve', amount: '$410K', pct: '8%' },
    { category: 'Clinical validation studies', amount: '$250K', pct: '5%' },
  ],

  milestones: [
    { month: 'M3', item: 'Seed close; FDA Pre-Sub meeting' },
    { month: 'M6', item: 'Pilot deployments live; SBIR Phase I submitted' },
    { month: 'M9', item: 'Clinical validation data released' },
    { month: 'M12', item: '510(k) submission; Series A prep' },
    { month: 'M18', item: '510(k) clearance; Medicare reimbursement application' },
    { month: 'M24', item: 'Commercial launch; Series A close' },
  ],

  ipHighlights: [
    'GR-01: Three-state positive-only feedback — the only architectural dementia-safe scoring system',
    'GR-02: Asymmetric adaptive difficulty for 70-85% comfort zone',
    'GR-03: Dementia-adapted spaced repetition (modified SM-2)',
    'GR-04: Multimodal cognitive state classifier',
    'GR-05: Dementia-specific speech emotion detection',
    '+ 18 additional patents across biomarkers, UX, compliance, integration',
  ],

  fdaStatus: [
    { standard: 'IEC 62304 — Software Lifecycle', status: 'Complete' },
    { standard: 'ISO 14971 — Risk Management (FMEA)', status: 'Complete' },
    { standard: 'ISO 13485 — QMS Framework', status: 'Complete' },
    { standard: '21 CFR Part 11 — Electronic Records', status: 'Complete' },
    { standard: 'STRIDE Cybersecurity Assessment', status: 'Complete' },
    { standard: 'Algorithm Transparency Module', status: 'Complete' },
    { standard: 'Clinical Validation Protocol (CVP-001)', status: 'Complete' },
    { standard: 'Informed Consent Template (ICF-001)', status: 'Complete' },
    { standard: 'Data Management Plan (DMP-001)', status: 'Complete' },
    { standard: 'Safety Monitoring Plan (SMP-001)', status: 'Complete' },
    { standard: '510(k) Predicate Analysis', status: 'Complete (K201738 Linus Health)' },
  ],

  platformMetrics: [
    { metric: '53K+', label: 'Lines of production code' },
    { metric: '5', label: 'Deployed applications' },
    { metric: '30+', label: 'API routes' },
    { metric: '30+', label: 'Database models' },
    { metric: '10', label: 'Languages (RTL-aware)' },
    { metric: 'FHIR R4', label: 'EHR integration ready' },
  ],
};
