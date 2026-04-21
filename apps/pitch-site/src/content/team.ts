/**
 * Gentle Reminder Team + Advisory Board + Recruiting Targets
 */

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
  gradient: string;
  linkedin?: string;
  email?: string;
}

export interface RecruitingRole {
  id: string;
  role: string;
  description: string;
  timing: 'now' | 'seed-close' | 'series-a';
  compensation: string;
}

export const CURRENT_TEAM: TeamMember[] = [
  {
    id: 'christo-mac',
    name: 'Christo Mack',
    role: 'Founder, CEO & COO',
    bio: 'Leads overall direction, operations, and platform strategy for Gentle Reminder. Drives product vision from algorithm design through production deployment.',
    initials: 'CM',
    gradient: 'linear-gradient(135deg, #58a6ff, #3fb950)',
    linkedin: 'https://www.linkedin.com/in/christomac',
    email: 'mack@matrixadvancedsolutions.com',
  },
  {
    id: 'leo-kinsman',
    name: 'Leo Kinsman',
    role: 'CTO',
    bio: 'Leads engineering, platform architecture, and technical execution. Oversees the 53K+ line production codebase, FHIR integration, and FDA SaMD compliance infrastructure.',
    initials: 'LK',
    gradient: 'linear-gradient(135deg, #3fb950, #a371f7)',
    linkedin: 'https://www.linkedin.com/in/leokinsman',
  },
  {
    id: 'chris-hamel',
    name: 'Chris Hamel',
    role: 'CFO',
    bio: 'Leads finance, fundraising strategy, and investor relations. Oversees financial modeling, cap table management, and grant fiscal compliance.',
    initials: 'CH',
    gradient: 'linear-gradient(135deg, #d29922, #f85149)',
    linkedin: 'https://www.linkedin.com/in/chrishamel',
  },
  {
    id: 'jayla-patzer',
    name: 'Jayla Patzer',
    role: 'National Director of Clinic & Provider Partnerships',
    bio: 'Leads commercial strategy with memory care facilities, clinical providers, and pharma partnerships. Drives pilot deployments and post-510(k) go-to-market.',
    initials: 'JP',
    gradient: 'linear-gradient(135deg, #a371f7, #58a6ff)',
    linkedin: 'https://www.linkedin.com/in/jaylapatzer',
  },
];

export const RECRUITING_ROLES: RecruitingRole[] = [
  {
    id: 'chief-medical-officer',
    role: 'Chief Medical Officer (Clinical Lead)',
    description:
      'Board-certified physician (neurology/geriatric psychiatry). Leads clinical strategy, FDA clinical validation, medical advisory board chairmanship.',
    timing: 'seed-close',
    compensation: 'Cash + 1.5-3% equity. Can be fractional pre-Series A.',
  },
  {
    id: 'head-product',
    role: 'Head of Product',
    description:
      'Digital health product leader. Healthcare + SaaS product experience. Takes ownership of mobile + dashboard product roadmaps.',
    timing: 'seed-close',
    compensation: 'Cash + 1-2% equity.',
  },
  {
    id: 'clinical-research-director',
    role: 'Clinical Research Director',
    description:
      'PhD or MD with clinical trial operations experience. Owns Phase I / Phase II SBIR execution, IRB management, clinical site partnerships.',
    timing: 'seed-close',
    compensation: 'Cash + 0.5-1% equity.',
  },
  {
    id: 'sales-vp-post-510k',
    role: 'VP Sales (Post-510k Hire)',
    description:
      'Healthcare SaaS sales leader. Memory care facility network relationships. Track record selling clinical software.',
    timing: 'series-a',
    compensation: 'Cash + 1-2% equity + commission.',
  },
  {
    id: 'engineering-lead',
    role: 'Engineering Lead (Mobile + Backend)',
    description: 'Senior engineer reporting to CTO. Owns platform reliability, security, compliance infrastructure.',
    timing: 'seed-close',
    compensation: 'Cash + 0.5-1% equity.',
  },
];
