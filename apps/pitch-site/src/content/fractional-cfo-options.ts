/**
 * Fractional CFO Options — Ranked by Fit
 *
 * Target profile: Tech + med + AI forward-thinking. Healthtech experience preferred.
 * Digital therapeutics familiarity. Pre-seed/seed stage track record.
 *
 * Rankings are based on: healthtech specialization, FDA/SaMD familiarity,
 * VC-backed startup track record, and public pricing transparency.
 */

export interface FractionalCFOOption {
  id: string;
  rank: number;
  firm: string;
  location: string;
  website: string;
  contactUrl?: string;
  generalEmail?: string;
  specialty: string[];
  pricingRange: string;
  pricingModel: string;
  whyFit: string;
  trackRecord: string;
  contactPath: string;
  priority: 'top' | 'strong' | 'backup';
}

export const FRACTIONAL_CFO_OPTIONS: FractionalCFOOption[] = [
  {
    id: 'cfo-healthcare',
    rank: 1,
    firm: 'The Healthcare CFO',
    location: 'US (remote)',
    website: 'https://www.thehealthcarecfo.com',
    contactUrl: 'https://www.thehealthcarecfo.com/startup-cfo-solutions-early-stage',
    specialty: ['Healthcare/life sciences exclusive', 'Pre-FDA/FDA pathway experience', 'Biotech + digital health'],
    pricingRange: '$3K-$15K/month',
    pricingModel: 'Monthly retainer, customized by stage + complexity',
    whyFit: 'EXCLUSIVELY healthcare/biotech/life sciences. Explicit pre-FDA and early-stage focus. Most direct match for our SaMD + DTx pathway.',
    trackRecord: 'Pre-FDA through commercial-stage healthcare companies. Focused expertise on regulatory-sensitive companies.',
    contactPath: 'Contact form on website + direct email. Book a call via website.',
    priority: 'top',
  },
  {
    id: 'cfo-burkland',
    rank: 2,
    firm: 'Burkland Associates',
    location: 'San Francisco, CA (serves nationally)',
    website: 'https://burklandassociates.com/who-we-work-with/healthcare/',
    specialty: ['VC-backed startup focus', 'Healthcare/biotech vertical team', 'Fundraising support + accounting + tax + HR'],
    pricingRange: '$3K-$10K/month',
    pricingModel: 'Monthly retainer with bundled services',
    whyFit: 'Dedicated healthcare + biotech vertical. Serves 700+ VC-backed startups. Strong relationships with Silicon Valley investors.',
    trackRecord: 'One of the largest fractional CFO firms for VC-backed startups. Standard choice for a16z / Sequoia portfolio.',
    contactPath: 'Website contact form + "Get Started" call booking.',
    priority: 'top',
  },
  {
    id: 'cfo-advisors',
    rank: 3,
    firm: 'CFO Advisors',
    location: 'US (remote)',
    website: 'https://cfoadvisors.com',
    specialty: ['AI + healthcare + cybersecurity vertical', 'Board-ready reporting', 'Fundraising models'],
    pricingRange: '$5K-$15K/month',
    pricingModel: 'Monthly retainer',
    whyFit: 'Explicitly works in AI and healthcare — directly relevant to our AI-powered SaMD product. Trusted by Sequoia and a16z-backed startups (75+ companies).',
    trackRecord: 'VC-backed startup specialist. AI/healthcare focus. Board-ready financial packages.',
    contactPath: 'Website inquiry form.',
    priority: 'top',
  },
  {
    id: 'cfo-gsquared',
    rank: 4,
    firm: 'G-Squared Partners',
    location: 'US (multi-city)',
    website: 'https://www.gsquaredcfo.com/life-sciences-biotech-outsourced-cfo',
    specialty: ['Life sciences + biotech specialist', 'High-growth company experience', 'Senior-level CFOs'],
    pricingRange: '$4K-$12K/month',
    pricingModel: 'Monthly retainer',
    whyFit: 'Life sciences specialization matches our FDA-regulated product. CFOs come from senior finance roles at high-growth companies.',
    trackRecord: 'Multi-vertical firm with dedicated life sciences practice.',
    contactPath: 'Website contact page.',
    priority: 'strong',
  },
  {
    id: 'cfo-kruze',
    rank: 5,
    firm: 'Kruze Consulting',
    location: 'San Francisco, CA (serves nationally)',
    website: 'https://kruzeconsulting.com/fractional-cfo-services/',
    specialty: ['VC-backed startups', '$15B+ raised by clients', 'Strong benchmarking data'],
    pricingRange: '$3K-$8K/month',
    pricingModel: 'Monthly retainer',
    whyFit: '800+ startups served. Strong VC-backed experience. Data-driven approach with benchmarking.',
    trackRecord: 'One of the largest startup CFO firms. Multiple successful fundraise cycles.',
    contactPath: 'Website contact form + "Schedule a call".',
    priority: 'strong',
  },
  {
    id: 'cfo-graphite',
    rank: 6,
    firm: 'Graphite Financial',
    location: 'US (remote)',
    website: 'https://graphitefinancial.com/blog/healthtech-biotech-fractional-cfo/',
    specialty: ['HealthTech + BioTech', 'Startup finance', 'Cash-efficient fractional model'],
    pricingRange: '$1,250/month starting',
    pricingModel: 'Monthly plans, starts low',
    whyFit: 'Lowest entry price. HealthTech + BioTech specialty. Good for pre-seed.',
    trackRecord: 'Growing firm. Good fit for earliest stage (pre-seed → early seed).',
    contactPath: 'Website form. Plans starting at $1,250/month.',
    priority: 'backup',
  },
  {
    id: 'cfo-aircfo',
    rank: 7,
    firm: 'airCFO',
    location: 'San Francisco, CA (remote nationally)',
    website: 'https://www.aircfo.com/services-offered/finance-fractional-cfo-services',
    specialty: ['Startup-focused', 'Tech + healthtech mix', 'Full-service finance ops'],
    pricingRange: '$3K-$10K/month',
    pricingModel: 'Monthly retainer with bundled accounting',
    whyFit: 'Startup-focused team. Alternative to Burkland / Kruze.',
    trackRecord: 'Active in VC-backed startup finance ops.',
    contactPath: 'Website contact form.',
    priority: 'backup',
  },
];
