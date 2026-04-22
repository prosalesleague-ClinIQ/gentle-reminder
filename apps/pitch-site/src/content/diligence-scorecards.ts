// Diligence scorecard source data — Fortress Audit + IP Moat Evaluation.
// Updated by audit runs. Rendered by /private/diligence/page.tsx.
// Source reports:
//   - docs/security/fortress-audit-2026-04-22.md
//   - docs/ip/ip-moat-eval-2026-04-22.md (populated after IP Moat Eval agent completes)

export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type SecurityTier =
  | 'EXCEPTIONAL'
  | 'STRONG'
  | 'ACCEPTABLE'
  | 'HIGH_DILIGENCE_RISK'
  | 'BELOW_50';
export type MoatTier = 'EXCEPTIONAL' | 'STRONG' | 'DEFENSIBLE' | 'THIN' | 'UNPROTECTED';

export interface FortressAxis {
  name: string;
  weight: number;
  score: number;
  capName?: string;
  capThreshold?: string;
  capTriggered?: boolean;
  note: string;
}

export interface FortressFinding {
  id: string;
  severity: Severity;
  title: string;
  file: string;
  effort: string;
  active: boolean; // vs latent (dashboards are shells so some criticals are latent)
}

export interface FortressCap {
  name: string;
  threshold: string;
  triggered: boolean;
  binding: boolean;
  evidence: string;
}

export interface FortressRemediation {
  rank: number;
  title: string;
  refFinding: string;
  effort: string;
  owner: string;
}

export interface FortressPhase {
  horizon: '30-day' | '60-day' | '90-day';
  targetScore: number;
  targetTier: SecurityTier | 'ACCEPTABLE' | 'STRONG';
  items: string[];
}

export interface FortressReport {
  runDate: string;
  score: number;
  tier: SecurityTier;
  topBlocker: string;
  summary: string;
  counts: Record<Severity, number>;
  axes: FortressAxis[];
  caps: FortressCap[];
  criticals: FortressFinding[];
  top10Fixes: FortressRemediation[];
  phases: FortressPhase[];
  sourceFile: string;
  status: 'complete' | 'running';
}

export interface MoatAxis {
  name: string;
  score: number;
  max: number;
  note: string;
}

export interface MoatStrength {
  title: string;
  evidence: string;
}

export interface MoatWeakness {
  title: string;
  evidence: string;
  fix: string;
}

export interface MoatReport {
  runDate: string;
  score: number;
  tier: MoatTier;
  topAsset: string;
  topGap: string;
  summary: string;
  patentCount: number;
  tierCounts: { tier1: number; tier2: number; tier3: number };
  axes: MoatAxis[];
  topStrengths: MoatStrength[];
  topWeaknesses: MoatWeakness[];
  filingPlan: string[];
  sourceFile: string;
  status: 'complete' | 'running' | 'pending';
}

// =============================================================================
// FORTRESS AUDIT — 2026-04-22
// =============================================================================

export const FORTRESS_REPORT: FortressReport = {
  runDate: '2026-04-22',
  score: 29,
  tier: 'BELOW_50',
  topBlocker:
    'services/memory-graph/src/graph/MemoryQuery.ts:34 + middleware/auth.ts:13 — cross-tenant PHI retrieval with JWT fail-open. Single-exploit path to full multi-tenant compromise if services are reachable from the public internet.',
  summary:
    'Dashboards are pre-wire shells (render mock data only), so the most investor-visible surface is effectively inert. Real active risk concentrates in three backend services where authentication + tenant isolation gaps are exploitable TODAY if services are reachable from the public internet. Secrets hygiene is clean (zero live credentials ever committed). This is a fixable 30-day remediation sprint, not a structural rewrite.',
  counts: { critical: 10, high: 33, medium: 33, low: 21 },
  axes: [
    { name: 'Identity and access controls', weight: 18, score: 4, capName: 'Admin without MFA', capThreshold: '40% = 7.2', capTriggered: true, note: 'JWT defaults fail-open, no MFA, no tenantId in JWT, no logout endpoint, 7-day refresh no rotation.' },
    { name: 'Application and API security', weight: 18, score: 7, note: 'Services have helmet + CORS + Zod + rate-limit; AI unauth, FHIR no role guard, pitch-site /private obscurity-only.' },
    { name: 'Cloud and network hardening', weight: 14, score: 5, capName: 'No WAF on public', capThreshold: '70% = 9.8', capTriggered: true, note: 'K8s NetworkPolicy good; Terraform base stack 100% commented; no WAF; Dockerfiles root on :latest.' },
    { name: 'Data protection and key management', weight: 12, score: 2, note: 'No encryption evidence, JWT defaults, no key rotation, backups lack --sse, 23/25 PHI models unscoped.' },
    { name: 'AI-specific safety controls', weight: 10, score: 4, note: 'Narrow surface (only Whisper live); no BAA gate; prompt templates no boundary markers (dormant).' },
    { name: 'Detection and incident readiness', weight: 10, score: 2, capName: 'No auth/admin logging', capThreshold: '30% = 3', capTriggered: true, note: 'AuditLog model exists, zero writers. No IR runbook, no alerting. Cap-bound.' },
    { name: 'Supply-chain and CI/CD security', weight: 10, score: 3, note: 'Clean history, but floating deps, no SHA pinning, no SBOM in CI, prod deploy is stub.' },
    { name: 'Resilience and recovery', weight: 5, score: 1, capName: 'No restore evidence', capThreshold: '40% = 2', capTriggered: true, note: 'pg_dump CronJob exists; no PITR, no drill, no key separation. Cap-bound.' },
    { name: 'Governance and evidence quality', weight: 3, score: 1, note: 'HIPAA doc contradicts code (MFA/AuditLog/RS256 all claimed but unimplemented).' },
  ],
  caps: [
    { name: 'Any open CRITICAL on exposed path', threshold: 'total ≤ 69', triggered: true, binding: false, evidence: '10 criticals identified' },
    { name: 'Cross-tenant data exposure', threshold: 'total ≤ 49', triggered: true, binding: false, evidence: 'memory-graph + 23/25 PHI models unscoped' },
    { name: 'No auth/admin logging', threshold: 'detection ≤ 3/10', triggered: true, binding: true, evidence: 'AuditLog unused in services/**' },
    { name: 'No restore evidence', threshold: 'resilience ≤ 2/5', triggered: true, binding: true, evidence: 'no drill, no PITR' },
    { name: 'No WAF on public', threshold: 'cloud ≤ 9.8/14', triggered: true, binding: false, evidence: 'Terraform commented, no ingress WAF' },
    { name: 'Admin without MFA', threshold: 'identity ≤ 7.2/18', triggered: true, binding: false, evidence: 'no MFA library imported anywhere' },
    { name: 'Plaintext prod secret in git', threshold: 'total ≤ 59', triggered: false, binding: false, evidence: 'k8s/secrets.yaml placeholder-only; clean history' },
    { name: 'Prod deploy with CI secrets exposed', threshold: 'total ≤ 59', triggered: false, binding: false, evidence: 'no pull_request_target anywhere' },
    { name: 'AI tool execution without validation', threshold: 'AI ≤ 3/10', triggered: false, binding: false, evidence: 'no prod agent/tool loop' },
  ],
  criticals: [
    { id: 'C-1', severity: 'critical', title: 'Cross-tenant PHI leak in memory-graph: no tenant scoping on any Cypher query', file: 'services/memory-graph/src/graph/MemoryQuery.ts:34', effort: '2-3 days', active: true },
    { id: 'C-2', severity: 'critical', title: 'services/ai: all endpoints unauthenticated; /transcribe ships PHI to OpenAI with no BAA gate', file: 'services/ai/src/main.py:204-277', effort: '1.5 days', active: true },
    { id: 'C-3', severity: 'critical', title: 'JWT_SECRET default fallbacks in three places (fail-open auth)', file: 'services/api/src/config/env.ts:5-6', effort: '30 min', active: true },
    { id: 'C-4', severity: 'critical', title: 'AuditLog model exists but is never written — HIPAA logging claim is false', file: 'packages/database/prisma/schema.prisma:690', effort: '3 days', active: true },
    { id: 'C-5', severity: 'critical', title: 'Pitch-site /private/* "security through obscurity only" protects investor materials', file: 'apps/pitch-site/src/middleware.ts:5-11', effort: '20 min', active: true },
    { id: 'C-6', severity: 'critical', title: 'Dashboards have zero auth gate at layout / middleware level (deferred — mitigated today by mock data)', file: 'apps/{admin,caregiver,clinician,family}-dashboard/src/app/layout.tsx', effort: '1 day', active: false },
    { id: 'C-7', severity: 'critical', title: '23 of 25 PHI Prisma models have no tenantId column', file: 'packages/database/prisma/schema.prisma', effort: '5 days', active: true },
    { id: 'C-8', severity: 'critical', title: 'No logout endpoint on API server; refresh tokens have no rotation/denylist', file: 'services/api/src/routes/auth.routes.ts', effort: '1 day', active: true },
    { id: 'C-9', severity: 'critical', title: 'CFR 21 Part 11 signRecord is plain SHA-256 with no key — forgeable', file: 'packages/clinical-export/src/CFR11Compliance.ts:29-47', effort: '2 days', active: true },
    { id: 'C-10', severity: 'critical', title: 'Clinical-export exportWithSignature takes userId as an unauthenticated string', file: 'packages/clinical-export/src/DataExporter.ts:201-231', effort: '1 day', active: true },
  ],
  top10Fixes: [
    { rank: 1, title: 'Remove JWT_SECRET dev fallbacks; fail-fast on missing env', refFinding: 'C-3', effort: '30 min', owner: 'Backend lead' },
    { rank: 2, title: 'Re-enable pitch-site /private/* auth (revert HTTP Basic Auth removal)', refFinding: 'C-5', effort: '20 min', owner: 'Founder' },
    { rank: 3, title: 'Tighten MCP scope in .claude/settings.local.json', refFinding: 'H-19/H-20/H-21', effort: '5 min', owner: 'Dev tooling' },
    { rank: 4, title: 'Add services/ai auth + 25MB upload cap + content-type allow-list + BAA env gate', refFinding: 'C-2', effort: '1.5 days', owner: 'AI lead + Legal' },
    { rank: 5, title: 'Add tenant scoping to memory-graph (JWT tenantId, Cypher filter, Neo4j constraint, integration test)', refFinding: 'C-1', effort: '2-3 days', owner: 'Backend lead' },
    { rank: 6, title: 'Wire AuditLog writer via middleware on every PHI route', refFinding: 'C-4', effort: '3 days', owner: 'Backend + Compliance' },
    { rank: 7, title: 'Add middleware.ts with session gate to all 4 dashboards (before any live data-fetch PR)', refFinding: 'C-6', effort: '1 day', owner: 'Frontend lead' },
    { rank: 8, title: 'Add POST /auth/logout + refresh-token rotation/denylist', refFinding: 'C-8', effort: '1 day', owner: 'Backend lead' },
    { rank: 9, title: 'Populate deploy-production.yml with environment-gated OIDC-signed deploy + SHA-pinned actions + cosign signing', refFinding: 'H-8', effort: '1 day', owner: 'Platform/DevOps' },
    { rank: 10, title: 'Add security headers to vercel.json + next.config.js (CSP/HSTS/XFO/Referrer-Policy/Permissions-Policy)', refFinding: 'H-15', effort: '2 hours', owner: 'Frontend lead' },
  ],
  phases: [
    {
      horizon: '30-day',
      targetScore: 65,
      targetTier: 'ACCEPTABLE',
      items: [
        'Top 10 fixes landed',
        'packages/auth/src/jwt.ts — add tenantId + facilityId to TokenPayload',
        'Prisma migration adding tenantId to all 23 remaining PHI models + backfill',
        'scopedDb(tenantId) Prisma extension auto-injecting tenant filter',
        'packages/clinical-export CFR11Compliance — replace SHA-256 with HMAC or Ed25519',
        'gitleaks + pnpm audit + pip-audit in CI',
        'Pin GitHub Actions to SHA; pin Next to ≥14.2.25',
        'SBOM generated in CI + attached to releases',
        'Execute OpenAI + ElevenLabs BAAs; publish docs/legal/vendor-baa-register.md',
        'Replace k8s/secrets.yaml commit with external-secrets operator + AWS Secrets Manager',
      ],
    },
    {
      horizon: '60-day',
      targetScore: 78,
      targetTier: 'ACCEPTABLE',
      items: [
        'Activate Terraform base stack (VPC, KMS, RDS encrypted, ALB + WAF, CloudWatch, S3 SSE-KMS)',
        'Apply NetworkPolicy to prod cluster',
        'WAF rules in front of all services',
        'Non-root USER in Dockerfiles; image digest pinning; cosign sign in deploy',
        'Sentry/DataDog/OpenTelemetry wired; structured logging',
        'Publish docs/runbooks/ (incident-response, breach-notification, dr-restore, on-call)',
        'Severity classification (P0-P4) + on-call rotation',
        'Backup restore drill with documented RTO/RPO',
        'MFA for clinician + admin (TOTP / WebAuthn)',
      ],
    },
    {
      horizon: '90-day',
      targetScore: 85,
      targetTier: 'STRONG',
      items: [
        'Third-party pentest (Cobalt / NCC / Bishop Fox) — ~$15-30K scope',
        'Remediate pentest findings',
        'SOC 2 Type I readiness assessment (Vanta / Drata / Secureframe)',
        'Trust center: security.gentlereminder.com with SBOM, subprocessors, uptime',
        'SIG Lite + CAIQ Lite portal for enterprise questionnaires',
        'Idle-logoff, audit-log export to SIEM',
      ],
    },
  ],
  sourceFile: 'docs/security/fortress-audit-2026-04-22.md',
  status: 'complete',
};

// =============================================================================
// IP MOAT EVALUATION — 2026-04-22
// =============================================================================
// Populated after IP Moat Eval agent run completes.
// Until then: status = 'running', placeholder data shown.

export const MOAT_REPORT: MoatReport = {
  runDate: '2026-04-22',
  score: 56,
  tier: 'DEFENSIBLE',
  topAsset:
    'IP #01 Three-State Positive-Only Feedback (docs/ip/tier-1/01-gentle-feedback-scoring.md) — 17k-word spec, 12 claims, no direct prior-art patent identified. Architectural channel separation blocks Cogstate / Akili / Lumosity / Neurotrack in dementia-adapted cognitive assessment.',
  topGap:
    'Zero filings + inventors `[TBD]` on every draft + unsigned git commits + no TM + no copyright. Moat is a document library, not an enforceable right.',
  summary:
    'Substantial but unfiled 23-patent provisional portfolio. Every draft has titled claims, numeric enabling disclosure, and reference code paths. Prior-art search file exists with candid novelty rankings. OTS timestamping executed on all 23 drafts. But: zero filings, inventors [TBD], commits unsigned, no TM, no copyright. Core tier-1 concepts have real blocking power if filed promptly. Revised filing count: 13-16 of 23 (drop 7 weakest to trade secret; defensively publish #22 on arXiv).',
  patentCount: 23,
  tierCounts: { tier1: 5, tier2: 7, tier3: 11 },
  axes: [
    { name: 'Breadth', score: 7, max: 10, note: '23 inventions spanning scoring, biomarkers, UX, regulatory, interop. USPTO-only (1 jurisdiction).' },
    { name: 'Claim depth', score: 6, max: 10, note: 'Tier-1 layered dependents; tier-3 omnibus claims with "Claims 2-5: standard" placeholder.' },
    { name: 'Prior art posture', score: 6, max: 10, note: 'PRIOR-ART-SEARCH.md populated with specific patent numbers cited. No professional search retained.' },
    { name: 'Commercial relevance', score: 8, max: 10, note: 'Every IP maps to a concrete code path. Tier-1 protects revenue-bearing features.' },
    { name: 'Enablement / RTP', score: 7, max: 10, note: 'Tier-1 4-8k words w/ pseudocode + tables. Tier-3 thinner (<2 pages on some). Cap applied.' },
    { name: 'Freedom-to-operate', score: 5, max: 10, note: 'No FTO analysis. IP #17 vs Salesforce, IP #20 vs Apple HealthKit are obvious blocking risks.' },
    { name: 'Geographic coverage', score: 4, max: 10, note: 'US provisionals only. PCT documented but unfunded. No EU/JP/CN filings planned.' },
    { name: 'Time-to-non-provisional', score: 3, max: 10, note: 'CAPPED. No attorney engaged, no funded budget.' },
    { name: 'Portfolio construction', score: 7, max: 10, note: 'Explicit tiering. Picket-fence on cognitive-engine (#01/#02/#03/#04/#12). Tier-3 dilutes.' },
    { name: 'Defensive measures', score: 3, max: 10, note: 'CAPPED. OTS done (27 .ots files). Git signing UNSIGNED despite setup doc. No TM, no copyright.' },
  ],
  topStrengths: [
    { title: 'Rare patent-plan depth for pre-seed', evidence: '23 drafts with titled claims + pseudocode + parameter tables + code-path references. Most pre-seed healthtechs have 0-2.' },
    { title: 'Clear picket-fence around cognitive engine', evidence: 'Tier-1 #01/#02/#03/#04/#05 reinforce each other; infringing one triggers 2-3 others.' },
    { title: 'OpenTimestamps executed on all 23 drafts', evidence: '27+ .ots files present. Bitcoin-anchored tamper-evident priority evidence. Rare pre-filing.' },
    { title: 'Candid self-assessment of novelty', evidence: 'PRIOR-ART-SEARCH.md ranks HIGH/MEDIUM/LOW and recommends trade-secret for 7 of 23. Investors respect honesty.' },
    { title: 'Tight commercial tie', evidence: 'Every draft cites actual file + function name in codebase (gentle-scorer.ts etc). Reduction-to-practice is real.' },
  ],
  topWeaknesses: [
    { title: 'Zero filings', evidence: 'No provisional, no TM, no copyright with USPTO/Copyright Office.', fix: 'File 5 Tier-1 provisionals within 30 days.' },
    { title: 'No patent attorney engaged', evidence: 'Three firms identified; no engagement letter executed.', fix: 'Engage Carr & Ferrell or Shay Glenn LLP ($500-$1,500/provisional fixed-fee).' },
    { title: 'Inventors `[TBD]` across every draft', evidence: 'Cannot file without named inventor(s) + signed IAA per invention.', fix: 'Complete INVENTOR-DISCLOSURE.md; extract conception dates from git history.' },
    { title: 'Git commits unsigned despite setup doc', evidence: '`git log --pretty="%G?"` returns N on all 10 recent commits.', fix: 'Configure GPG signing + sign attestation commit (30 min).' },
    { title: 'No FTO + critical competitors missing', evidence: 'Dthera, Cognito Therapeutics, Biofourmis, deeper Neurotrack read absent. IP #17 + #20 have obvious blocking risk.', fix: 'Commission FTO on Tier-1 ($15k-$30k) before non-provisional conversion.' },
  ],
  filingPlan: [
    'Day 0-30 ($3k-$5.7k): Engage patent attorney. Complete INVENTOR-DISCLOSURE.md. Configure GPG signing. File TM "GENTLE REMINDER" Class 9+44 TEAS Plus ITU ($500). File Copyright Batch 1 ($195).',
    'Day 30-60 ($6k-$10k): File 5 Tier-1 provisionals (#01-#05). File IP #06 (Sundowning). Commission FTO on Tier-1 ($5k-$15k).',
    'Day 60-90 ($4k-$8k): File 7 more provisionals (#07, #08, #14, #15, #19, #23, +1 of #09/#10/#11 strengthened). Drop/trade-secret: #12, #16, #17, #18, #20, #21, #22. Defensively publish #22 on arXiv.',
    'Day-90 cumulative: $15k-$25k. Year-1 pre-conversion: $35k-$50k (13 provisionals + FTO + PCT prep).',
  ],
  sourceFile: 'docs/ip/ip-moat-eval-2026-04-22.md',
  status: 'complete',
};

// =============================================================================
// Helpers
// =============================================================================

export function tierColor(tier: SecurityTier | MoatTier): string {
  const m: Record<string, string> = {
    EXCEPTIONAL: '#3D8158',
    STRONG: '#3D8158',
    ACCEPTABLE: '#92A53F',
    DEFENSIBLE: '#92A53F',
    HIGH_DILIGENCE_RISK: '#E5A300',
    THIN: '#E5A300',
    BELOW_50: '#C0392B',
    UNPROTECTED: '#C0392B',
  };
  return m[tier] ?? '#8b949e';
}

export function severityColor(s: Severity): string {
  return { critical: '#C0392B', high: '#E5A300', medium: '#92A53F', low: '#3D8158' }[s];
}

export function scoreBand(score: number): { label: string; color: string } {
  if (score >= 95) return { label: 'Exceptional', color: '#3D8158' };
  if (score >= 85) return { label: 'Strong', color: '#3D8158' };
  if (score >= 70) return { label: 'Acceptable', color: '#92A53F' };
  if (score >= 50) return { label: 'High diligence risk', color: '#E5A300' };
  return { label: 'Not diligence-ready', color: '#C0392B' };
}
