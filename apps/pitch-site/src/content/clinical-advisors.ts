/**
 * Clinical Advisor Target List
 *
 * 15 named targets at NIH-funded memory centers + industry experts.
 * All information is publicly available (faculty listings, publications).
 *
 * CONFIDENTIAL — Internal outreach tool.
 */

export interface AdvisorTarget {
  id: string;
  name: string;
  title: string;
  institution: string;
  city: string;
  expertise: string[];
  whyThem: string;
  publicProfile: string;
  preferredOutreach: 'warm-intro' | 'email' | 'conference' | 'linkedin';
  priority: 'critical' | 'high' | 'medium';
  outreachStatus: 'not-started' | 'researching' | 'contacted' | 'responded' | 'engaged' | 'declined';
}

export const ADVISOR_TARGETS: AdvisorTarget[] = [
  // ============================================================
  // UCSF MEMORY AND AGING CENTER (TOP PRIORITY)
  // ============================================================
  {
    id: 'ucsf-miller',
    name: 'Bruce Miller, MD',
    title: 'Director, UCSF Memory and Aging Center',
    institution: 'University of California, San Francisco',
    city: 'San Francisco, CA',
    expertise: ['Frontotemporal dementia', 'Behavioral variant FTD', 'Neurodegenerative disease clinical research'],
    whyThem:
      'Founder/Director of UCSF MAC, leading US memory center. NIH R01 PI. Author of "The Human Frontal Lobes". Connection unlocks UCSF cohort of ~3,000 dementia patients.',
    publicProfile: 'https://profiles.ucsf.edu/bruce.miller',
    preferredOutreach: 'warm-intro',
    priority: 'critical',
    outreachStatus: 'not-started',
  },
  {
    id: 'ucsf-rabinovici',
    name: 'Gil Rabinovici, MD',
    title: 'Distinguished Professor of Neurology, UCSF',
    institution: 'University of California, San Francisco',
    city: 'San Francisco, CA',
    expertise: ['Alzheimer\'s disease imaging', 'Amyloid PET', 'Biomarker research'],
    whyThem:
      'Leading Alzheimer\'s biomarker researcher. IDEAS study PI (Imaging Dementia—Evidence for Amyloid Scanning). Perfect fit for our digital biomarker validation.',
    publicProfile: 'https://profiles.ucsf.edu/gil.rabinovici',
    preferredOutreach: 'warm-intro',
    priority: 'critical',
    outreachStatus: 'not-started',
  },

  // ============================================================
  // MASS GENERAL / HARVARD (TOP PRIORITY)
  // ============================================================
  {
    id: 'mgh-sperling',
    name: 'Reisa Sperling, MD',
    title: 'Director, Center for Alzheimer Research and Treatment',
    institution: 'Brigham and Women\'s Hospital / Harvard Medical School',
    city: 'Boston, MA',
    expertise: ['Alzheimer\'s prevention', 'A4 study PI', 'Preclinical AD detection'],
    whyThem:
      'Leading prevention trials (A4, AHEAD). Direct connection to Biogen/Eisai/Lilly pharma partnerships. Her endorsement carries enormous FDA/payer credibility.',
    publicProfile: 'https://www.massgeneral.org/neurology/doctor.aspx?id=19003',
    preferredOutreach: 'warm-intro',
    priority: 'critical',
    outreachStatus: 'not-started',
  },
  {
    id: 'mgh-hyman',
    name: 'Bradley T. Hyman, MD, PhD',
    title: 'Director, Massachusetts Alzheimer\'s Disease Research Center',
    institution: 'Massachusetts General Hospital / Harvard Medical School',
    city: 'Boston, MA',
    expertise: ['Alzheimer\'s neuropathology', 'Tau and amyloid biology', 'Mass AD Research Center'],
    whyThem:
      'Directs the MADRC, one of 32 NIH-funded ADRCs. Access to patient cohort + research infrastructure. Prolific publication record in leading journals.',
    publicProfile: 'https://www.massgeneral.org/neurology/doctor.aspx?id=19001',
    preferredOutreach: 'warm-intro',
    priority: 'critical',
    outreachStatus: 'not-started',
  },

  // ============================================================
  // JOHNS HOPKINS
  // ============================================================
  {
    id: 'jhu-lyketsos',
    name: 'Constantine Lyketsos, MD, MHS',
    title: 'Director, Johns Hopkins Memory and Alzheimer\'s Treatment Center',
    institution: 'Johns Hopkins Medicine',
    city: 'Baltimore, MD',
    expertise: ['Geriatric psychiatry', 'Caregiver burden', 'Neuropsychiatric symptoms of dementia'],
    whyThem:
      'Caregiver burden expertise directly supports our Aim 3 (ZBI reduction). Author of ADAMS study. Strong connections to industry digital health advisory boards.',
    publicProfile: 'https://www.hopkinsmedicine.org/profiles/details/constantine-lyketsos',
    preferredOutreach: 'warm-intro',
    priority: 'high',
    outreachStatus: 'not-started',
  },

  // ============================================================
  // EMORY ADRC
  // ============================================================
  {
    id: 'emory-levey',
    name: 'Allan Levey, MD, PhD',
    title: 'Director, Emory Goizueta Alzheimer\'s Disease Research Center',
    institution: 'Emory University School of Medicine',
    city: 'Atlanta, GA',
    expertise: ['Alzheimer\'s clinical research', 'Biomarker discovery', 'Clinical trials'],
    whyThem:
      'NIH-funded ADRC director with strong clinical trial infrastructure. Already active in digital biomarker consortiums. Likely receptive to our SBIR collaboration.',
    publicProfile: 'https://neurology.emory.edu/faculty/behavioral/levey_allan.html',
    preferredOutreach: 'email',
    priority: 'high',
    outreachStatus: 'not-started',
  },

  // ============================================================
  // CLEVELAND CLINIC LOU RUVO
  // ============================================================
  {
    id: 'ccf-leverenz',
    name: 'James Leverenz, MD',
    title: 'Director, Cleveland Clinic Lou Ruvo Center for Brain Health',
    institution: 'Cleveland Clinic',
    city: 'Las Vegas, NV / Cleveland, OH',
    expertise: ['Lewy body dementia', 'Movement disorders', 'Cognitive impairment'],
    whyThem:
      'Lou Ruvo Center serves patients across 4 states with unique geographic reach. Active clinical trial site for pharma partners.',
    publicProfile: 'https://my.clevelandclinic.org/staff/17632-james-leverenz',
    preferredOutreach: 'warm-intro',
    priority: 'high',
    outreachStatus: 'not-started',
  },

  // ============================================================
  // MAYO CLINIC
  // ============================================================
  {
    id: 'mayo-petersen',
    name: 'Ronald Petersen, MD, PhD',
    title: 'Director, Mayo Clinic Alzheimer\'s Disease Research Center',
    institution: 'Mayo Clinic',
    city: 'Rochester, MN',
    expertise: ['Mild cognitive impairment (MCI)', 'Early Alzheimer\'s detection', 'Mayo Clinic Study of Aging PI'],
    whyThem:
      'Coined the term "mild cognitive impairment" (MCI). Mayo Clinic Study of Aging cohort: 5,000+ participants with longitudinal data. His validation would be transformative.',
    publicProfile: 'https://www.mayoclinic.org/biographies/petersen-ronald-c-m-d-ph-d/bio-20055445',
    preferredOutreach: 'warm-intro',
    priority: 'critical',
    outreachStatus: 'not-started',
  },

  // ============================================================
  // NYU SILVERSTEIN
  // ============================================================
  {
    id: 'nyu-wisniewski',
    name: 'Thomas Wisniewski, MD',
    title: 'Director, NYU Alzheimer\'s Disease Research Center',
    institution: 'NYU Langone Health',
    city: 'New York, NY',
    expertise: ['Alzheimer\'s prevention', 'Vaccine research', 'Early diagnosis'],
    whyThem:
      'NYU ADRC director; strong NYC-area patient cohort access. Prevention research fits our biomarker tracking angle.',
    publicProfile: 'https://nyulangone.org/doctors/1861447395/thomas-wisniewski',
    preferredOutreach: 'email',
    priority: 'medium',
    outreachStatus: 'not-started',
  },

  // ============================================================
  // USC ADRC
  // ============================================================
  {
    id: 'usc-aisen',
    name: 'Paul Aisen, MD',
    title: 'Director, Alzheimer\'s Therapeutic Research Institute',
    institution: 'USC Keck School of Medicine',
    city: 'San Diego, CA',
    expertise: ['Alzheimer\'s clinical trials', 'Pharmaceutical research', 'ADCS network'],
    whyThem:
      'Leads ATRI which runs the largest AD clinical trials network. Key gateway to pharma industry partnerships. Former NIH ADCS leadership.',
    publicProfile: 'https://atri.usc.edu/people/paul-aisen-md/',
    preferredOutreach: 'warm-intro',
    priority: 'critical',
    outreachStatus: 'not-started',
  },

  // ============================================================
  // NORTHWESTERN
  // ============================================================
  {
    id: 'nu-weintraub',
    name: 'Sandra Weintraub, PhD',
    title: 'Professor of Psychiatry and Behavioral Sciences',
    institution: 'Northwestern Medicine',
    city: 'Chicago, IL',
    expertise: ['Cognitive neuropsychology', 'Neuropsychological assessment', 'Primary progressive aphasia'],
    whyThem:
      'Expert in cognitive assessment — directly relevant to our Aim 1. Developed the Northwestern Neuropsychological Battery. Would lend enormous psychometric credibility.',
    publicProfile: 'https://www.feinberg.northwestern.edu/faculty-profiles/az/profile.html?xid=16124',
    preferredOutreach: 'email',
    priority: 'high',
    outreachStatus: 'not-started',
  },

  // ============================================================
  // COLUMBIA TAUB
  // ============================================================
  {
    id: 'columbia-small',
    name: 'Scott A. Small, MD',
    title: 'Director, Columbia Taub Institute',
    institution: 'Columbia University',
    city: 'New York, NY',
    expertise: ['Alzheimer\'s mechanisms', 'Hippocampal research', 'Memory disorders'],
    whyThem:
      'Taub Institute one of the top 5 AD research centers. Author of "Forgetting: The Benefits of Not Remembering." Strong media visibility.',
    publicProfile: 'https://www.cuimc.columbia.edu/profile/scott-a-small-md',
    preferredOutreach: 'warm-intro',
    priority: 'high',
    outreachStatus: 'not-started',
  },

  // ============================================================
  // INDUSTRY / REGULATORY
  // ============================================================
  {
    id: 'fda-expert',
    name: '[Former FDA Reviewer — Digital Health SaMD]',
    title: 'Independent Regulatory Consultant',
    institution: 'Former FDA CDRH',
    city: 'Washington DC area',
    expertise: ['FDA SaMD classification', '510(k) submissions', 'AI/ML medical device policy'],
    whyThem:
      'Former FDA CDRH reviewer can pre-screen our 510(k) package and flag red flags before submission. Critical for avoiding submission rejection. Typical engagement: $500/hour consulting, 20-40 hours across Phase I.',
    publicProfile: 'Use FDA alumni directory / LinkedIn search "Former CDRH 510(k) reviewer"',
    preferredOutreach: 'email',
    priority: 'critical',
    outreachStatus: 'not-started',
  },
  {
    id: 'digital-health-vc',
    name: '[Digital Health VC Advisor]',
    title: 'Managing Partner or Principal',
    institution: 'Healthcare-specialist VC (post-portfolio-company exit)',
    city: 'SF, Boston, or NYC',
    expertise: ['Digital health commercialization', 'FDA clearance strategy', 'Payer reimbursement'],
    whyThem:
      'Post-exit VC partner (e.g., former Rock Health GP) can advise on GTM strategy and pattern-match the fundraise. Typically takes 0.25-0.5% advisor equity.',
    publicProfile: 'LinkedIn search "Digital health VC portfolio former operator"',
    preferredOutreach: 'warm-intro',
    priority: 'high',
    outreachStatus: 'not-started',
  },
  {
    id: 'alz-association-advisor',
    name: '[Alzheimer\'s Association Research Leadership]',
    title: 'Chief Science Officer or SVP Research',
    institution: 'Alzheimer\'s Association',
    city: 'Chicago, IL',
    expertise: ['Alzheimer\'s research funding', 'Patient advocacy', 'Policy influence'],
    whyThem:
      'Alzheimer\'s Association connection provides patient advocacy, grant opportunities, and credibility with payers. Non-paid advisory relationship typically.',
    publicProfile: 'https://www.alz.org/research/leadership',
    preferredOutreach: 'email',
    priority: 'medium',
    outreachStatus: 'not-started',
  },
];

export const OUTREACH_STATUS_COLOR: Record<string, string> = {
  'not-started': '#6e7681',
  researching: '#8b949e',
  contacted: '#58a6ff',
  responded: '#3fb950',
  engaged: '#a371f7',
  declined: '#f85149',
};

export const PRIORITY_COLOR: Record<string, string> = {
  critical: '#f85149',
  high: '#d29922',
  medium: '#58a6ff',
};
