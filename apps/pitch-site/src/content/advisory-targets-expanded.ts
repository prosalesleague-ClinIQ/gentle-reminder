/**
 * Expanded Advisory Board Target List
 *
 * Tech + Med + AI forward-thinking advisors for dementia/Alzheimer's platform.
 * All names are public figures in their fields (faculty, authors, prominent operators).
 *
 * Social links are public LinkedIn/Twitter where identifiable.
 */

export type AdvisorCategory =
  | 'clinical-neuroscience'
  | 'digital-health-ai'
  | 'fda-regulatory'
  | 'commercial-healthcare'
  | 'pharma-strategic'
  | 'payer-strategy'
  | 'operator-founder';

export interface AdvisoryTarget {
  id: string;
  category: AdvisoryCategory;
  priority: 'critical' | 'high' | 'medium';
  name: string;
  title: string;
  institution: string;
  location: string;
  expertise: string[];
  whyThem: string;
  credentials: string;
  linkedin?: string;
  twitter?: string;
  publicProfile?: string;
  outreachChannel: 'warm-intro' | 'email' | 'linkedin-dm' | 'conference' | 'twitter-dm';
  compensationModel: string;
}

export type AdvisoryCategory = AdvisorCategory;

export const ADVISORY_TARGETS_EXPANDED: AdvisoryTarget[] = [
  // ============================================================
  // CLINICAL NEUROSCIENCE (CRITICAL — 2-3 of these needed)
  // ============================================================
  {
    id: 'ucsf-miller-exp',
    category: 'clinical-neuroscience',
    priority: 'critical',
    name: 'Bruce Miller, MD',
    title: 'Director, UCSF Memory and Aging Center',
    institution: 'UCSF',
    location: 'San Francisco, CA',
    expertise: ['Frontotemporal dementia', 'Neurodegenerative disease', 'Clinical research'],
    whyThem: 'Leading US memory center director. Access to UCSF cohort (~3K patients). His endorsement unlocks pharma + grants.',
    credentials: 'MD, author of "The Human Frontal Lobes", NIH R01 PI',
    linkedin: 'https://www.linkedin.com/in/bruce-miller-0a0157/',
    publicProfile: 'https://profiles.ucsf.edu/bruce.miller',
    outreachChannel: 'warm-intro',
    compensationModel: '0.25-0.5% advisor equity (clinical advisor tier)',
  },
  {
    id: 'sperling-harvard',
    category: 'clinical-neuroscience',
    priority: 'critical',
    name: 'Reisa Sperling, MD',
    title: 'Director, Center for Alzheimer Research and Treatment',
    institution: 'Brigham and Women\'s Hospital / Harvard',
    location: 'Boston, MA',
    expertise: ['Alzheimer\'s prevention', 'A4 / AHEAD study PI', 'Biomarker research'],
    whyThem: 'Leading prevention researcher. Direct pharma partnerships with Biogen/Eisai/Lilly. FDA/payer credibility.',
    credentials: 'MD, Professor of Neurology at Harvard Medical School',
    linkedin: 'https://www.linkedin.com/in/reisa-sperling-2b3b3b1b/',
    publicProfile: 'https://www.massgeneral.org/neurology/doctor.aspx?id=19003',
    outreachChannel: 'warm-intro',
    compensationModel: '0.25-0.5% advisor equity',
  },
  {
    id: 'petersen-mayo',
    category: 'clinical-neuroscience',
    priority: 'critical',
    name: 'Ronald Petersen, MD, PhD',
    title: 'Director, Mayo Clinic ADRC',
    institution: 'Mayo Clinic',
    location: 'Rochester, MN',
    expertise: ['Mild cognitive impairment (coined term)', 'Mayo Clinic Study of Aging', 'Early detection'],
    whyThem: 'Coined "MCI". Access to Mayo\'s longitudinal cohort (5,000+ participants). Transformative endorsement.',
    credentials: 'MD/PhD, Mayo Clinic Alzheimer\'s Disease Research Center Director',
    publicProfile: 'https://www.mayoclinic.org/biographies/petersen-ronald-c-m-d-ph-d/bio-20055445',
    outreachChannel: 'warm-intro',
    compensationModel: '0.25-0.5% advisor equity',
  },
  {
    id: 'lyketsos-jhu',
    category: 'clinical-neuroscience',
    priority: 'high',
    name: 'Constantine Lyketsos, MD, MHS',
    title: 'Director, Johns Hopkins Memory and Alzheimer\'s Treatment Center',
    institution: 'Johns Hopkins',
    location: 'Baltimore, MD',
    expertise: ['Geriatric psychiatry', 'Caregiver burden (directly our Aim 3)', 'Neuropsychiatric symptoms'],
    whyThem: 'Caregiver burden specialist — directly supports our ZBI outcome. Active in industry advisory boards.',
    credentials: 'MD MHS, Chair of Hopkins Bayview Psychiatry',
    publicProfile: 'https://www.hopkinsmedicine.org/profiles/details/constantine-lyketsos',
    outreachChannel: 'email',
    compensationModel: '0.25-0.5% advisor equity',
  },
  {
    id: 'weintraub-northwestern',
    category: 'clinical-neuroscience',
    priority: 'high',
    name: 'Sandra Weintraub, PhD',
    title: 'Professor of Psychiatry and Behavioral Sciences',
    institution: 'Northwestern Medicine',
    location: 'Chicago, IL',
    expertise: ['Cognitive neuropsychology', 'Neuropsychological assessment', 'Northwestern Battery'],
    whyThem: 'THE expert in cognitive assessment. Developed Northwestern Neuropsychological Battery. Psychometric credibility for Aim 1.',
    credentials: 'PhD, Professor at Feinberg School of Medicine',
    publicProfile: 'https://www.feinberg.northwestern.edu/faculty-profiles/az/profile.html?xid=16124',
    outreachChannel: 'email',
    compensationModel: '0.25-0.5% advisor equity',
  },

  // ============================================================
  // DIGITAL HEALTH / AI FORWARD OPERATORS (TECH-FORWARD)
  // ============================================================
  {
    id: 'eric-topol',
    category: 'digital-health-ai',
    priority: 'critical',
    name: 'Eric Topol, MD',
    title: 'Director, Scripps Research Translational Institute',
    institution: 'Scripps Research',
    location: 'La Jolla, CA',
    expertise: ['Digital medicine', 'AI in healthcare', 'Genomics + digital health'],
    whyThem: 'Leading voice in digital medicine + AI healthcare. Author "Deep Medicine". @EricTopol has 600K+ Twitter followers. His endorsement is rocket fuel for fundraising.',
    credentials: 'MD, author of 3 bestsellers on digital medicine, Ex-Cardiologist-in-Chief Cleveland Clinic',
    twitter: 'https://twitter.com/EricTopol',
    linkedin: 'https://www.linkedin.com/in/erictopol/',
    publicProfile: 'https://www.scripps.edu/faculty/topol/',
    outreachChannel: 'twitter-dm',
    compensationModel: 'Advisor equity 0.5-1% + honorarium. High-profile advisor tier.',
  },
  {
    id: 'andrew-ng-ai',
    category: 'digital-health-ai',
    priority: 'high',
    name: 'Andrew Ng, PhD',
    title: 'Founder, DeepLearning.AI + Landing AI',
    institution: 'Landing AI / Stanford (Adjunct)',
    location: 'Palo Alto, CA',
    expertise: ['AI/ML', 'Deep learning', 'AI application strategy'],
    whyThem: 'Most influential AI educator/operator. Ran Coursera, Baidu AI, Google Brain. Interested in healthcare AI applications.',
    credentials: 'PhD Berkeley, Former Chief Scientist Baidu, Founded Google Brain',
    twitter: 'https://twitter.com/AndrewYNg',
    linkedin: 'https://www.linkedin.com/in/andrewyng/',
    publicProfile: 'https://www.andrewng.org/',
    outreachChannel: 'linkedin-dm',
    compensationModel: 'Typically doesn\'t take startup advisor equity but responds to high-quality pitches. Worth approaching for thought-leadership engagement.',
  },
  {
    id: 'atul-butte',
    category: 'digital-health-ai',
    priority: 'high',
    name: 'Atul Butte, MD, PhD',
    title: 'Chief Data Scientist, UC Health; Professor UCSF',
    institution: 'UCSF / UC Health System',
    location: 'San Francisco, CA',
    expertise: ['Biomedical AI', 'Digital health platforms', 'Real-world evidence'],
    whyThem: 'Bridge between AI research and hospital systems. Deep understanding of data pipelines for clinical decision support.',
    credentials: 'MD/PhD, Priscilla Chan and Mark Zuckerberg Distinguished Professor',
    twitter: 'https://twitter.com/atulbutte',
    linkedin: 'https://www.linkedin.com/in/atulbutte/',
    publicProfile: 'https://profiles.ucsf.edu/atul.butte',
    outreachChannel: 'email',
    compensationModel: 'Advisor equity 0.25-0.5%',
  },
  {
    id: 'vic-gundotra',
    category: 'digital-health-ai',
    priority: 'high',
    name: 'Vic Gundotra',
    title: 'Former CEO AliveCor; Founder Ela',
    institution: 'Ela (healthtech startup)',
    location: 'Silicon Valley, CA',
    expertise: ['Digital health consumer devices', 'FDA SaMD experience (AliveCor Kardia)', 'Mobile healthcare'],
    whyThem: 'Led AliveCor through FDA clearance for consumer ECG. Direct SaMD experience. Now founder of another healthtech (Ela).',
    credentials: 'Former Google VP, CEO AliveCor (FDA-cleared KardiaMobile)',
    twitter: 'https://twitter.com/vicgundotra',
    linkedin: 'https://www.linkedin.com/in/vicgundotra/',
    outreachChannel: 'linkedin-dm',
    compensationModel: 'Advisor equity 0.25-0.5% + mentor relationship',
  },

  // ============================================================
  // FDA REGULATORY / SaMD EXPERTS
  // ============================================================
  {
    id: 'bakul-patel',
    category: 'fda-regulatory',
    priority: 'critical',
    name: 'Bakul Patel',
    title: 'Former Director, FDA Digital Health Center of Excellence',
    institution: 'Google Cloud (current)',
    location: 'Washington DC area / Remote',
    expertise: ['FDA SaMD policy', 'AI/ML medical device classification', 'Pre-Cert program architect'],
    whyThem: 'Architect of FDA SaMD framework. Now at Google Cloud Healthcare. Regulatory thought leader.',
    credentials: 'Former FDA CDRH Director, Architect of Digital Health Pre-Cert',
    linkedin: 'https://www.linkedin.com/in/bakulpatel/',
    outreachChannel: 'linkedin-dm',
    compensationModel: 'May not be available for startup advisor role given Google role, but a single conversation is invaluable.',
  },
  {
    id: 'kay-firth-butterfield',
    category: 'fda-regulatory',
    priority: 'high',
    name: 'Kay Firth-Butterfield',
    title: 'CEO, Good Tech Advisory; Former Head of AI World Economic Forum',
    institution: 'Independent',
    location: 'Austin, TX',
    expertise: ['AI ethics + policy', 'Governance for medical AI', 'Global regulatory strategy'],
    whyThem: 'Top global AI ethics expert. Her endorsement demonstrates our algorithm transparency commitment.',
    credentials: 'Barrister, Former Chief AI & ML Officer at WEF, AI Policy thought leader',
    twitter: 'https://twitter.com/kayfirthb',
    linkedin: 'https://www.linkedin.com/in/kayfirthbutterfield/',
    outreachChannel: 'linkedin-dm',
    compensationModel: 'Advisor equity 0.5-1% + speaking honoraria',
  },

  // ============================================================
  // COMMERCIAL HEALTHCARE / OPERATOR-FOUNDERS
  // ============================================================
  {
    id: 'glen-tullman',
    category: 'operator-founder',
    priority: 'critical',
    name: 'Glen Tullman',
    title: 'Founder & CEO, Transcarent; Founder Livongo',
    institution: 'Transcarent / 7wireVentures',
    location: 'Chicago, IL',
    expertise: ['Digital health commercialization', 'Payer-employer sales', 'Exits (Livongo → Teladoc)'],
    whyThem: 'Sold Livongo to Teladoc for $18.5B. Leading digital health operator. Direct connection to VCs and strategic acquirers.',
    credentials: 'Founder Livongo (sold $18.5B), CEO Transcarent, Managing Partner 7wireVentures',
    twitter: 'https://twitter.com/glentullman',
    linkedin: 'https://www.linkedin.com/in/glentullman/',
    outreachChannel: 'warm-intro',
    compensationModel: 'Advisor equity 0.5-1% + board observer. Very high-profile advisor.',
  },
  {
    id: 'halle-tecco',
    category: 'operator-founder',
    priority: 'high',
    name: 'Halle Tecco',
    title: 'Founder, Rock Health; Investor',
    institution: 'Various',
    location: 'New York, NY',
    expertise: ['Digital health VC', 'Startup scaling', 'Healthcare entrepreneurship network'],
    whyThem: 'Founded Rock Health, largest digital health network. Access to fundraising + strategic relationships.',
    credentials: 'Rock Health founder, Investor, Host of "Thirty Madison" podcast',
    twitter: 'https://twitter.com/halletecco',
    linkedin: 'https://www.linkedin.com/in/halletecco/',
    outreachChannel: 'twitter-dm',
    compensationModel: 'Advisor equity 0.25-0.5%',
  },

  // ============================================================
  // PAYER STRATEGY
  // ============================================================
  {
    id: 'andy-slavitt',
    category: 'payer-strategy',
    priority: 'high',
    name: 'Andy Slavitt',
    title: 'Founding Partner, Town Hall Ventures; Former CMS Acting Administrator',
    institution: 'Town Hall Ventures',
    location: 'Minneapolis, MN',
    expertise: ['Medicare/Medicaid policy', 'Payer strategy', 'Value-based care'],
    whyThem: 'Former CMS Administrator (under Obama). Now VC partner. Direct connections to Medicare Advantage leadership.',
    credentials: 'Former CMS Acting Administrator, Co-Founder Town Hall Ventures',
    twitter: 'https://twitter.com/aslavitt',
    linkedin: 'https://www.linkedin.com/in/andyslavitt/',
    outreachChannel: 'twitter-dm',
    compensationModel: 'Typically observer role vs. formal advisor; high-impact conversation.',
  },

  // ============================================================
  // PHARMA STRATEGIC (FOR POST-SEED ENGAGEMENT)
  // ============================================================
  {
    id: 'biogen-innovation',
    category: 'pharma-strategic',
    priority: 'medium',
    name: '[Biogen Digital Health Innovation — Head]',
    title: 'VP/Head of Digital Health',
    institution: 'Biogen',
    location: 'Cambridge, MA',
    expertise: ['Leqembi commercial lifecycle', 'Digital companions for AD therapy', 'Pharma BD'],
    whyThem: 'Biogen Digital Health Fund active. Leqembi is our direct pharma adjacency.',
    credentials: 'Pharma VP-level operator',
    publicProfile: 'LinkedIn search: "Biogen Digital Health" + filter current employees',
    outreachChannel: 'linkedin-dm',
    compensationModel: 'BD relationship, not advisor equity. Path to field-of-use license.',
  },
];
