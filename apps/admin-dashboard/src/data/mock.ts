// =============================================================================
// Gentle Reminder Admin Dashboard - Comprehensive Mock Data
// =============================================================================

// --- Facilities ---
export interface Facility {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  patientCount: number;
  staffCount: number;
  subscriptionTier: 'Standard' | 'Professional' | 'Enterprise';
  monthlyScore: number;
  activeAlerts: number;
  lastAudit: string;
  baaStatus: 'Active' | 'Pending' | 'Expired';
  baaExpiry: string;
  contactPerson: string;
  contactEmail: string;
  features: string[];
  monthlyCost: number;
  nextBillingDate: string;
  billingStatus: 'Active' | 'Past Due' | 'Cancelled';
}

export const facilities: Facility[] = [
  {
    id: 'fac-001',
    name: 'Sunrise Memory Care',
    location: 'Portland, OR',
    address: '1250 NW Everett St, Portland, OR 97209',
    phone: '(503) 555-0142',
    patientCount: 48,
    staffCount: 12,
    subscriptionTier: 'Enterprise',
    monthlyScore: 94,
    activeAlerts: 2,
    lastAudit: '2026-03-15',
    baaStatus: 'Active',
    baaExpiry: '2027-03-15',
    contactPerson: 'Dr. Maria Chen',
    contactEmail: 'mchen@sunrisememory.care',
    features: ['AI Voice Reminders', 'Family Portal', 'Clinician Dashboard', 'Spaced Repetition', 'Multi-Language', 'Priority Support', 'Custom Integrations', 'Dedicated Account Manager'],
    monthlyCost: 3792,
    nextBillingDate: '2026-04-15',
    billingStatus: 'Active',
  },
  {
    id: 'fac-002',
    name: 'Oakwood Senior Living',
    location: 'Seattle, WA',
    address: '890 Pine St, Seattle, WA 98101',
    phone: '(206) 555-0198',
    patientCount: 42,
    staffCount: 10,
    subscriptionTier: 'Professional',
    monthlyScore: 89,
    activeAlerts: 1,
    lastAudit: '2026-02-28',
    baaStatus: 'Active',
    baaExpiry: '2027-01-10',
    contactPerson: 'James Whitfield',
    contactEmail: 'jwhitfield@oakwoodliving.com',
    features: ['AI Voice Reminders', 'Family Portal', 'Clinician Dashboard', 'Spaced Repetition', 'Multi-Language', 'Priority Support'],
    monthlyCost: 2058,
    nextBillingDate: '2026-04-10',
    billingStatus: 'Active',
  },
  {
    id: 'fac-003',
    name: 'Harbor View Care',
    location: 'San Francisco, CA',
    address: '2100 Bay St, San Francisco, CA 94123',
    phone: '(415) 555-0267',
    patientCount: 37,
    staffCount: 8,
    subscriptionTier: 'Standard',
    monthlyScore: 82,
    activeAlerts: 4,
    lastAudit: '2026-01-20',
    baaStatus: 'Pending',
    baaExpiry: '2026-06-30',
    contactPerson: 'Lisa Nakamura',
    contactEmail: 'lnakamura@harborviewcare.org',
    features: ['AI Voice Reminders', 'Family Portal', 'Clinician Dashboard', 'Spaced Repetition'],
    monthlyCost: 1073,
    nextBillingDate: '2026-04-20',
    billingStatus: 'Active',
  },
];

// --- Users ---
export type UserRole = 'admin' | 'clinician' | 'caregiver' | 'family';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  facility: string | null;
  status: UserStatus;
  lastLogin: string;
  createdAt: string;
  twoFactorEnabled: boolean;
  avatar: string;
}

export const users: User[] = [
  {
    id: 'usr-001',
    name: 'Sarah Administrator',
    email: 'sarah.admin@gentlereminder.care',
    role: 'admin',
    facility: null,
    status: 'active',
    lastLogin: '2026-04-01T08:15:00Z',
    createdAt: '2025-06-01T00:00:00Z',
    twoFactorEnabled: true,
    avatar: 'SA',
  },
  {
    id: 'usr-002',
    name: 'Dr. Maria Chen',
    email: 'mchen@sunrisememory.care',
    role: 'clinician',
    facility: 'Sunrise Memory Care',
    status: 'active',
    lastLogin: '2026-03-31T14:22:00Z',
    createdAt: '2025-07-15T00:00:00Z',
    twoFactorEnabled: true,
    avatar: 'MC',
  },
  {
    id: 'usr-003',
    name: 'James Whitfield',
    email: 'jwhitfield@oakwoodliving.com',
    role: 'clinician',
    facility: 'Oakwood Senior Living',
    status: 'active',
    lastLogin: '2026-03-31T09:45:00Z',
    createdAt: '2025-08-01T00:00:00Z',
    twoFactorEnabled: true,
    avatar: 'JW',
  },
  {
    id: 'usr-004',
    name: 'Lisa Nakamura',
    email: 'lnakamura@harborviewcare.org',
    role: 'clinician',
    facility: 'Harbor View Care',
    status: 'active',
    lastLogin: '2026-03-30T16:10:00Z',
    createdAt: '2025-09-10T00:00:00Z',
    twoFactorEnabled: false,
    avatar: 'LN',
  },
  {
    id: 'usr-005',
    name: 'Robert Thompson',
    email: 'rthompson@sunrisememory.care',
    role: 'clinician',
    facility: 'Sunrise Memory Care',
    status: 'active',
    lastLogin: '2026-03-29T11:30:00Z',
    createdAt: '2025-10-05T00:00:00Z',
    twoFactorEnabled: true,
    avatar: 'RT',
  },
  {
    id: 'usr-006',
    name: 'Emily Santos',
    email: 'esantos@sunrisememory.care',
    role: 'caregiver',
    facility: 'Sunrise Memory Care',
    status: 'active',
    lastLogin: '2026-04-01T06:00:00Z',
    createdAt: '2025-08-20T00:00:00Z',
    twoFactorEnabled: false,
    avatar: 'ES',
  },
  {
    id: 'usr-007',
    name: 'Michael Brown',
    email: 'mbrown@oakwoodliving.com',
    role: 'caregiver',
    facility: 'Oakwood Senior Living',
    status: 'active',
    lastLogin: '2026-03-31T07:15:00Z',
    createdAt: '2025-09-01T00:00:00Z',
    twoFactorEnabled: false,
    avatar: 'MB',
  },
  {
    id: 'usr-008',
    name: 'Patricia Williams',
    email: 'pwilliams@harborviewcare.org',
    role: 'caregiver',
    facility: 'Harbor View Care',
    status: 'active',
    lastLogin: '2026-03-30T08:45:00Z',
    createdAt: '2025-09-15T00:00:00Z',
    twoFactorEnabled: false,
    avatar: 'PW',
  },
  {
    id: 'usr-009',
    name: 'David Park',
    email: 'dpark@oakwoodliving.com',
    role: 'caregiver',
    facility: 'Oakwood Senior Living',
    status: 'inactive',
    lastLogin: '2026-02-14T10:00:00Z',
    createdAt: '2025-10-01T00:00:00Z',
    twoFactorEnabled: false,
    avatar: 'DP',
  },
  {
    id: 'usr-010',
    name: 'Angela Martinez',
    email: 'amartinez@sunrisememory.care',
    role: 'caregiver',
    facility: 'Sunrise Memory Care',
    status: 'active',
    lastLogin: '2026-03-31T13:00:00Z',
    createdAt: '2025-11-01T00:00:00Z',
    twoFactorEnabled: false,
    avatar: 'AM',
  },
  {
    id: 'usr-011',
    name: 'Jennifer Chen',
    email: 'jchen.family@gmail.com',
    role: 'family',
    facility: 'Sunrise Memory Care',
    status: 'active',
    lastLogin: '2026-03-28T19:30:00Z',
    createdAt: '2025-11-15T00:00:00Z',
    twoFactorEnabled: false,
    avatar: 'JC',
  },
  {
    id: 'usr-012',
    name: 'Mark Sullivan',
    email: 'msullivan.family@outlook.com',
    role: 'family',
    facility: 'Oakwood Senior Living',
    status: 'active',
    lastLogin: '2026-03-27T20:15:00Z',
    createdAt: '2025-12-01T00:00:00Z',
    twoFactorEnabled: false,
    avatar: 'MS',
  },
  {
    id: 'usr-013',
    name: 'Rachel Kim',
    email: 'rkim.family@gmail.com',
    role: 'family',
    facility: 'Harbor View Care',
    status: 'active',
    lastLogin: '2026-03-25T18:00:00Z',
    createdAt: '2026-01-10T00:00:00Z',
    twoFactorEnabled: false,
    avatar: 'RK',
  },
  {
    id: 'usr-014',
    name: 'Thomas Anderson',
    email: 'tanderson@gentlereminder.care',
    role: 'admin',
    facility: null,
    status: 'active',
    lastLogin: '2026-03-31T17:00:00Z',
    createdAt: '2025-06-15T00:00:00Z',
    twoFactorEnabled: true,
    avatar: 'TA',
  },
  {
    id: 'usr-015',
    name: 'Karen Olsen',
    email: 'kolsen@harborviewcare.org',
    role: 'caregiver',
    facility: 'Harbor View Care',
    status: 'suspended',
    lastLogin: '2026-01-15T12:00:00Z',
    createdAt: '2025-10-20T00:00:00Z',
    twoFactorEnabled: false,
    avatar: 'KO',
  },
];

// --- Billing History ---
export interface BillingEntry {
  id: string;
  date: string;
  facility: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed';
  invoiceNumber: string;
  method: string;
}

export const billingHistory: BillingEntry[] = [
  { id: 'inv-001', date: '2026-03-15', facility: 'Sunrise Memory Care', amount: 3792, status: 'Paid', invoiceNumber: 'INV-2026-0315', method: 'ACH Transfer' },
  { id: 'inv-002', date: '2026-03-10', facility: 'Oakwood Senior Living', amount: 2058, status: 'Paid', invoiceNumber: 'INV-2026-0310', method: 'Credit Card' },
  { id: 'inv-003', date: '2026-03-20', facility: 'Harbor View Care', amount: 1073, status: 'Pending', invoiceNumber: 'INV-2026-0320', method: 'ACH Transfer' },
  { id: 'inv-004', date: '2026-02-15', facility: 'Sunrise Memory Care', amount: 3792, status: 'Paid', invoiceNumber: 'INV-2026-0215', method: 'ACH Transfer' },
  { id: 'inv-005', date: '2026-02-10', facility: 'Oakwood Senior Living', amount: 2058, status: 'Paid', invoiceNumber: 'INV-2026-0210', method: 'Credit Card' },
  { id: 'inv-006', date: '2026-02-20', facility: 'Harbor View Care', amount: 1073, status: 'Paid', invoiceNumber: 'INV-2026-0220', method: 'ACH Transfer' },
];

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  patients: number;
}

export const monthlyRevenue: MonthlyRevenue[] = [
  { month: 'Oct 2025', revenue: 5840, patients: 98 },
  { month: 'Nov 2025', revenue: 7230, patients: 108 },
  { month: 'Dec 2025', revenue: 8450, patients: 112 },
  { month: 'Jan 2026', revenue: 9820, patients: 118 },
  { month: 'Feb 2026', revenue: 10950, patients: 122 },
  { month: 'Mar 2026', revenue: 12450, patients: 127 },
];

export interface SubscriptionPlan {
  name: string;
  tier: 'Standard' | 'Professional' | 'Enterprise';
  pricePerPatient: number;
  features: string[];
  recommended: boolean;
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    name: 'Standard',
    tier: 'Standard',
    pricePerPatient: 29,
    features: [
      'AI Voice Reminders',
      'Family Portal',
      'Clinician Dashboard',
      'Spaced Repetition',
      'Email Support',
      'Basic Reporting',
    ],
    recommended: false,
  },
  {
    name: 'Professional',
    tier: 'Professional',
    pricePerPatient: 49,
    features: [
      'Everything in Standard',
      'Multi-Language Support',
      'Priority Support',
      'Advanced Analytics',
      'Custom Reminder Templates',
      'Phone Support',
    ],
    recommended: true,
  },
  {
    name: 'Enterprise',
    tier: 'Enterprise',
    pricePerPatient: 79,
    features: [
      'Everything in Professional',
      'Custom Integrations',
      'Dedicated Account Manager',
      'SLA Guarantee (99.9%)',
      'On-Premise Option',
      'Custom Training',
      'Audit Log Access',
      'White-Labeling',
    ],
    recommended: false,
  },
];

// --- Audit Log ---
export type AuditAction =
  | 'Login'
  | 'Logout'
  | 'View Patient'
  | 'Update Record'
  | 'Export Data'
  | 'Create User'
  | 'Delete User'
  | 'Update Settings'
  | 'Generate Report'
  | 'API Key Created'
  | 'API Key Revoked'
  | 'Password Reset'
  | 'Role Changed'
  | 'Facility Updated'
  | 'Billing Updated';

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  userId: string;
  action: AuditAction;
  resource: string;
  ipAddress: string;
  status: 'Success' | 'Failed';
  details: string;
}

export const auditLog: AuditEntry[] = [
  { id: 'aud-001', timestamp: '2026-04-01T08:15:00Z', user: 'Sarah Administrator', userId: 'usr-001', action: 'Login', resource: 'Admin Portal', ipAddress: '192.168.1.100', status: 'Success', details: 'Logged in via SSO' },
  { id: 'aud-002', timestamp: '2026-04-01T08:20:00Z', user: 'Sarah Administrator', userId: 'usr-001', action: 'View Patient', resource: 'Patient #P-1042', ipAddress: '192.168.1.100', status: 'Success', details: 'Viewed patient record for Margaret Wilson' },
  { id: 'aud-003', timestamp: '2026-04-01T07:45:00Z', user: 'Dr. Maria Chen', userId: 'usr-002', action: 'Update Record', resource: 'Patient #P-1015', ipAddress: '10.0.0.45', status: 'Success', details: 'Updated medication schedule for Robert Davis' },
  { id: 'aud-004', timestamp: '2026-04-01T07:30:00Z', user: 'Emily Santos', userId: 'usr-006', action: 'Login', resource: 'Caregiver App', ipAddress: '172.16.0.22', status: 'Success', details: 'Logged in via mobile app' },
  { id: 'aud-005', timestamp: '2026-03-31T17:00:00Z', user: 'Thomas Anderson', userId: 'usr-014', action: 'Export Data', resource: 'Monthly Report', ipAddress: '192.168.1.105', status: 'Success', details: 'Exported March 2026 compliance report' },
  { id: 'aud-006', timestamp: '2026-03-31T16:30:00Z', user: 'James Whitfield', userId: 'usr-003', action: 'Generate Report', resource: 'Facility Analytics', ipAddress: '10.0.1.33', status: 'Success', details: 'Generated Q1 2026 patient progress report' },
  { id: 'aud-007', timestamp: '2026-03-31T15:00:00Z', user: 'Sarah Administrator', userId: 'usr-001', action: 'Create User', resource: 'User Management', ipAddress: '192.168.1.100', status: 'Success', details: 'Created new caregiver account for Angela Martinez' },
  { id: 'aud-008', timestamp: '2026-03-31T14:22:00Z', user: 'Dr. Maria Chen', userId: 'usr-002', action: 'Login', resource: 'Clinician Dashboard', ipAddress: '10.0.0.45', status: 'Success', details: 'Logged in via password + 2FA' },
  { id: 'aud-009', timestamp: '2026-03-31T13:00:00Z', user: 'Angela Martinez', userId: 'usr-010', action: 'View Patient', resource: 'Patient #P-1028', ipAddress: '172.16.0.18', status: 'Success', details: 'Viewed daily reminder schedule for Helen Park' },
  { id: 'aud-010', timestamp: '2026-03-31T11:45:00Z', user: 'Unknown', userId: 'unknown', action: 'Login', resource: 'Admin Portal', ipAddress: '45.33.102.7', status: 'Failed', details: 'Failed login attempt - invalid credentials' },
  { id: 'aud-011', timestamp: '2026-03-31T10:30:00Z', user: 'Sarah Administrator', userId: 'usr-001', action: 'API Key Created', resource: 'API Management', ipAddress: '192.168.1.100', status: 'Success', details: 'Created new staging API key' },
  { id: 'aud-012', timestamp: '2026-03-31T09:45:00Z', user: 'James Whitfield', userId: 'usr-003', action: 'Update Record', resource: 'Patient #P-1035', ipAddress: '10.0.1.33', status: 'Success', details: 'Updated cognitive assessment scores' },
  { id: 'aud-013', timestamp: '2026-03-30T16:10:00Z', user: 'Lisa Nakamura', userId: 'usr-004', action: 'Login', resource: 'Clinician Dashboard', ipAddress: '10.0.2.15', status: 'Success', details: 'Logged in via password' },
  { id: 'aud-014', timestamp: '2026-03-30T15:00:00Z', user: 'Thomas Anderson', userId: 'usr-014', action: 'Update Settings', resource: 'System Settings', ipAddress: '192.168.1.105', status: 'Success', details: 'Updated session timeout to 30 minutes' },
  { id: 'aud-015', timestamp: '2026-03-30T14:00:00Z', user: 'Sarah Administrator', userId: 'usr-001', action: 'Billing Updated', resource: 'Billing', ipAddress: '192.168.1.100', status: 'Success', details: 'Updated payment method for Harbor View Care' },
  { id: 'aud-016', timestamp: '2026-03-30T12:00:00Z', user: 'Sarah Administrator', userId: 'usr-001', action: 'Role Changed', resource: 'User Management', ipAddress: '192.168.1.100', status: 'Success', details: 'Changed Karen Olsen status to suspended' },
  { id: 'aud-017', timestamp: '2026-03-29T11:30:00Z', user: 'Robert Thompson', userId: 'usr-005', action: 'View Patient', resource: 'Patient #P-1008', ipAddress: '10.0.0.50', status: 'Success', details: 'Viewed medication adherence history' },
  { id: 'aud-018', timestamp: '2026-03-29T10:00:00Z', user: 'Sarah Administrator', userId: 'usr-001', action: 'API Key Revoked', resource: 'API Management', ipAddress: '192.168.1.100', status: 'Success', details: 'Revoked legacy API key gr_legacy_xxx' },
  { id: 'aud-019', timestamp: '2026-03-29T09:00:00Z', user: 'Thomas Anderson', userId: 'usr-014', action: 'Facility Updated', resource: 'Facility Management', ipAddress: '192.168.1.105', status: 'Success', details: 'Updated contact info for Oakwood Senior Living' },
  { id: 'aud-020', timestamp: '2026-03-28T19:30:00Z', user: 'Jennifer Chen', userId: 'usr-011', action: 'Login', resource: 'Family Portal', ipAddress: '73.15.220.44', status: 'Success', details: 'Logged in to view family member updates' },
];

// --- API Keys ---
export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsed: string;
  status: 'Active' | 'Revoked';
  rateLimit: number;
  environment: 'Production' | 'Staging' | 'Development' | 'Legacy';
  createdBy: string;
  requestsToday: number;
  requestsMonth: number;
}

export const apiKeys: ApiKey[] = [
  {
    id: 'key-001',
    name: 'Production API Key',
    prefix: 'gr_prod_a8f2...x9k1',
    createdAt: '2025-08-01',
    lastUsed: '2026-04-01T08:14:00Z',
    status: 'Active',
    rateLimit: 10000,
    environment: 'Production',
    createdBy: 'Sarah Administrator',
    requestsToday: 8234,
    requestsMonth: 245120,
  },
  {
    id: 'key-002',
    name: 'Staging API Key',
    prefix: 'gr_stag_b3d1...m7p2',
    createdAt: '2026-03-31',
    lastUsed: '2026-04-01T07:55:00Z',
    status: 'Active',
    rateLimit: 5000,
    environment: 'Staging',
    createdBy: 'Sarah Administrator',
    requestsToday: 3102,
    requestsMonth: 18450,
  },
  {
    id: 'key-003',
    name: 'Development API Key',
    prefix: 'gr_dev_c9e4...n2q8',
    createdAt: '2025-10-15',
    lastUsed: '2026-03-31T23:10:00Z',
    status: 'Active',
    rateLimit: 2000,
    environment: 'Development',
    createdBy: 'Thomas Anderson',
    requestsToday: 1114,
    requestsMonth: 32800,
  },
  {
    id: 'key-004',
    name: 'Legacy API Key',
    prefix: 'gr_legacy_z1w3...f5h7',
    createdAt: '2025-06-01',
    lastUsed: '2026-03-01T12:00:00Z',
    status: 'Revoked',
    rateLimit: 1000,
    environment: 'Legacy',
    createdBy: 'Sarah Administrator',
    requestsToday: 0,
    requestsMonth: 0,
  },
];

export interface ApiUsageStats {
  requestsToday: number;
  rateLimitHits: number;
  avgResponseTime: number;
  totalRequestsMonth: number;
  errorRate: number;
  topEndpoints: { endpoint: string; count: number; avgMs: number }[];
}

export const apiUsageStats: ApiUsageStats = {
  requestsToday: 12450,
  rateLimitHits: 3,
  avgResponseTime: 85,
  totalRequestsMonth: 296370,
  errorRate: 0.12,
  topEndpoints: [
    { endpoint: 'GET /api/v1/reminders', count: 4520, avgMs: 45 },
    { endpoint: 'POST /api/v1/reminders/deliver', count: 3200, avgMs: 120 },
    { endpoint: 'GET /api/v1/patients/:id', count: 2100, avgMs: 62 },
    { endpoint: 'GET /api/v1/analytics/daily', count: 1450, avgMs: 195 },
    { endpoint: 'POST /api/v1/assessments', count: 890, avgMs: 210 },
    { endpoint: 'GET /api/v1/facilities/:id/staff', count: 290, avgMs: 38 },
  ],
};

// --- Compliance ---
export type ComplianceStatus = 'Compliant' | 'In Progress' | 'Needs Attention';
export type SafeguardCategory = 'Administrative' | 'Technical' | 'Physical';

export interface ComplianceItem {
  id: string;
  name: string;
  description: string;
  category: SafeguardCategory;
  status: ComplianceStatus;
  lastReviewed: string;
  nextReview: string;
  owner: string;
  notes: string;
}

export const complianceItems: ComplianceItem[] = [
  // Administrative Safeguards
  { id: 'comp-001', name: 'Security Management Process', description: 'Implement policies to prevent, detect, contain, and correct security violations', category: 'Administrative', status: 'Compliant', lastReviewed: '2026-03-15', nextReview: '2026-06-15', owner: 'Sarah Administrator', notes: 'Annual review completed. All policies up to date.' },
  { id: 'comp-002', name: 'Workforce Security', description: 'Implement policies for authorizing access to ePHI', category: 'Administrative', status: 'Compliant', lastReviewed: '2026-03-10', nextReview: '2026-06-10', owner: 'Thomas Anderson', notes: 'Background checks current for all staff.' },
  { id: 'comp-003', name: 'Information Access Management', description: 'Implement policies for authorizing access to ePHI', category: 'Administrative', status: 'In Progress', lastReviewed: '2026-02-28', nextReview: '2026-04-15', owner: 'Sarah Administrator', notes: 'Updating role-based access policies for new caregiver tier.' },
  { id: 'comp-004', name: 'Security Awareness Training', description: 'Security awareness and training program for all workforce members', category: 'Administrative', status: 'Compliant', lastReviewed: '2026-03-01', nextReview: '2026-06-01', owner: 'Thomas Anderson', notes: 'Q1 2026 training completed. 100% staff completion rate.' },

  // Technical Safeguards
  { id: 'comp-005', name: 'Access Control', description: 'Technical policies and procedures for allowing access to ePHI', category: 'Technical', status: 'Compliant', lastReviewed: '2026-03-20', nextReview: '2026-06-20', owner: 'Thomas Anderson', notes: 'RBAC fully implemented. MFA enforced for all admin/clinician roles.' },
  { id: 'comp-006', name: 'Audit Controls', description: 'Hardware, software, and procedural mechanisms to record and examine access', category: 'Technical', status: 'Compliant', lastReviewed: '2026-03-18', nextReview: '2026-06-18', owner: 'Thomas Anderson', notes: 'Comprehensive audit logging active. 90-day retention policy.' },
  { id: 'comp-007', name: 'Transmission Security', description: 'Technical security measures to guard against unauthorized access to ePHI during transmission', category: 'Technical', status: 'Compliant', lastReviewed: '2026-03-12', nextReview: '2026-06-12', owner: 'Thomas Anderson', notes: 'TLS 1.3 enforced. All API endpoints encrypted.' },
  { id: 'comp-008', name: 'Encryption at Rest', description: 'Encrypt all ePHI stored in databases and file systems', category: 'Technical', status: 'Needs Attention', lastReviewed: '2026-01-20', nextReview: '2026-04-01', owner: 'Thomas Anderson', notes: 'Database encryption current. Need to verify backup encryption for Harbor View Care instance.' },

  // Physical Safeguards
  { id: 'comp-009', name: 'Facility Access Controls', description: 'Policies to limit physical access to electronic information systems', category: 'Physical', status: 'Compliant', lastReviewed: '2026-03-05', nextReview: '2026-06-05', owner: 'Sarah Administrator', notes: 'Cloud-hosted infrastructure. AWS SOC 2 compliant.' },
  { id: 'comp-010', name: 'Workstation Security', description: 'Physical safeguards for all workstations that access ePHI', category: 'Physical', status: 'Compliant', lastReviewed: '2026-02-20', nextReview: '2026-05-20', owner: 'Sarah Administrator', notes: 'All workstations have auto-lock and encrypted drives.' },
  { id: 'comp-011', name: 'Device and Media Controls', description: 'Policies governing receipt and removal of hardware and electronic media', category: 'Physical', status: 'In Progress', lastReviewed: '2026-02-15', nextReview: '2026-04-15', owner: 'Thomas Anderson', notes: 'Updating device disposal procedures for tablet deployment.' },
  { id: 'comp-012', name: 'Disaster Recovery Plan', description: 'Establish procedures to restore any loss of data', category: 'Physical', status: 'Compliant', lastReviewed: '2026-03-25', nextReview: '2026-06-25', owner: 'Thomas Anderson', notes: 'DR test completed successfully. RTO: 4 hours, RPO: 1 hour.' },
];

// --- System Stats ---
export interface SystemStats {
  totalFacilities: number;
  activePatients: number;
  totalCaregivers: number;
  totalClinicians: number;
  monthlyRevenue: number;
  systemUptime: number;
}

export const systemStats: SystemStats = {
  totalFacilities: 3,
  activePatients: 127,
  totalCaregivers: 24,
  totalClinicians: 8,
  monthlyRevenue: 12450,
  systemUptime: 99.97,
};

// --- Recent Activity ---
export interface ActivityItem {
  id: string;
  type: 'user' | 'system' | 'billing' | 'compliance' | 'patient' | 'facility';
  message: string;
  timestamp: string;
  actor: string;
  severity: 'info' | 'warning' | 'success' | 'error';
}

export const recentActivity: ActivityItem[] = [
  { id: 'act-001', type: 'user', message: 'Sarah Administrator logged in to Admin Portal', timestamp: '2026-04-01T08:15:00Z', actor: 'Sarah Administrator', severity: 'info' },
  { id: 'act-002', type: 'patient', message: 'New patient enrolled at Sunrise Memory Care', timestamp: '2026-04-01T07:50:00Z', actor: 'Dr. Maria Chen', severity: 'success' },
  { id: 'act-003', type: 'system', message: 'Daily backup completed successfully', timestamp: '2026-04-01T03:00:00Z', actor: 'System', severity: 'success' },
  { id: 'act-004', type: 'compliance', message: 'Encryption at Rest review due in 1 day', timestamp: '2026-03-31T18:00:00Z', actor: 'System', severity: 'warning' },
  { id: 'act-005', type: 'billing', message: 'Invoice INV-2026-0320 pending for Harbor View Care', timestamp: '2026-03-31T17:30:00Z', actor: 'System', severity: 'warning' },
  { id: 'act-006', type: 'facility', message: 'Oakwood Senior Living updated staff roster', timestamp: '2026-03-31T16:30:00Z', actor: 'James Whitfield', severity: 'info' },
  { id: 'act-007', type: 'system', message: 'Failed login attempt detected from IP 45.33.102.7', timestamp: '2026-03-31T11:45:00Z', actor: 'Unknown', severity: 'error' },
  { id: 'act-008', type: 'user', message: 'New API key generated for staging environment', timestamp: '2026-03-31T10:30:00Z', actor: 'Sarah Administrator', severity: 'info' },
];

// --- System Health ---
export interface HealthIndicator {
  name: string;
  status: 'Operational' | 'Degraded' | 'Down';
  latency: number;
  uptime: number;
  lastChecked: string;
}

export const systemHealth: HealthIndicator[] = [
  { name: 'API Gateway', status: 'Operational', latency: 45, uptime: 99.99, lastChecked: '2026-04-01T08:14:00Z' },
  { name: 'Database Cluster', status: 'Operational', latency: 12, uptime: 99.98, lastChecked: '2026-04-01T08:14:00Z' },
  { name: 'Voice AI Service', status: 'Operational', latency: 180, uptime: 99.95, lastChecked: '2026-04-01T08:14:00Z' },
  { name: 'Push Notifications', status: 'Operational', latency: 85, uptime: 99.97, lastChecked: '2026-04-01T08:14:00Z' },
  { name: 'File Storage', status: 'Operational', latency: 35, uptime: 99.99, lastChecked: '2026-04-01T08:14:00Z' },
  { name: 'Email Service', status: 'Degraded', latency: 420, uptime: 99.85, lastChecked: '2026-04-01T08:14:00Z' },
];
