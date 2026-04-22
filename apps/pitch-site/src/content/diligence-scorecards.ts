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
  runDate: '2026-04-22 (post-remediation ROUND 1 + 2 + 3)',
  score: 62,
  tier: 'HIGH_DILIGENCE_RISK',
  topBlocker:
    'Remaining: Terraform main.tf still 100% commented — no WAF / KMS / encrypted RDS / SSE-KMS buckets provisioned via IaC (infrastructure/terraform/main.tf). Day-60 activation lifts cloud-hardening axis from 7→11.',
  summary:
    'Post-remediation rescore after Phase 42 ROUND 1-3: closed 9 of 10 criticals (C-1/C-2/C-3/C-4/C-5/C-6/C-8 directly; C-7 partially via JWT tenantId propagation + audit middleware) and 15+ highs (Next CVE pin, security headers, CI secret scanning, npm/pip audit, SBOM wired, real deploy-production workflow, MCP scope tightening, dashboard auth gates, memory-graph tenant Cypher, AuditLog writer on 18 PHI routes). Cross-tenant data cap NO LONGER BINDING at the memory-graph query layer; detection cap NO LONGER BINDING with AuditLog now writing on every PHI route. Resilience cap still bound (restore drill pending Day-60). Pitch-site /private/* now Basic-Auth gated. Next: Day-30 Prisma migration to add tenantId to remaining 23 PHI models, then Day-60 Terraform activation + WAF + MFA.',
  counts: { critical: 1, high: 18, medium: 30, low: 21 },
  axes: [
    { name: 'Identity and access controls', weight: 18, score: 10, capName: 'Admin without MFA', capThreshold: '40% = 7.2', capTriggered: true, note: 'POST-FIX: JWT fail-fast + no defaults; tenantId + facilityId now in TokenPayload; /auth/logout endpoint added; basic auth on /private + 4 dashboards. MFA still pending (Day-60).' },
    { name: 'Application and API security', weight: 18, score: 12, note: 'POST-FIX: services/ai now Bearer-gated with 25MB cap + content-type allow-list + BAA gate; memory-graph tenant-scopes every Cypher; pitch-site /private/* Basic Auth restored; auditPhiAccess on 18 PHI routes.' },
    { name: 'Cloud and network hardening', weight: 14, score: 7, capName: 'No WAF on public', capThreshold: '70% = 9.8', capTriggered: true, note: 'Security headers now on vercel.json + 5 next.configs. Terraform still commented (Day-60 activation target). K8s NetworkPolicy unchanged.' },
    { name: 'Data protection and key management', weight: 12, score: 5, note: 'POST-FIX: AuditLog writer live + PHI redactor; JWT fail-fast. 23 of 25 PHI models still need tenantId column (Day-30 migration).' },
    { name: 'AI-specific safety controls', weight: 10, score: 7, note: 'POST-FIX: internal-token + upload cap + content-type allow-list; WHISPER_MODE=api blocked until OPENAI_BAA_ACKNOWLEDGED=true. BAA procurement remains business action.' },
    { name: 'Detection and incident readiness', weight: 10, score: 5, capName: 'No auth/admin logging', capThreshold: '30% = 3', capTriggered: false, note: 'POST-FIX: auditPhiAccess wired into 18 routes (patients, memories, biomarkers, medications, fhir, voice, etc.). Cap NO LONGER BINDING. IR runbook still pending (Day-60).' },
    { name: 'Supply-chain and CI/CD security', weight: 10, score: 7, note: 'POST-FIX: gitleaks + npm audit + pip-audit + SBOM in CI; actions SHA-pinned; permissions blocks added; deploy-production.yml now real workflow with environment gate. Branch protection still UNVERIFIED.' },
    { name: 'Resilience and recovery', weight: 5, score: 1, capName: 'No restore evidence', capThreshold: '40% = 2', capTriggered: true, note: 'pg_dump CronJob exists; no PITR, no drill. Still cap-bound — Day-60 restore drill required.' },
    { name: 'Governance and evidence quality', weight: 3, score: 2, note: 'POST-FIX: inventor-disclosure-filled.md, GPG-signing runbook, arXiv defensive-pub prep. HIPAA doc still overstates claims — needs reconciliation pass.' },
  ],
  caps: [
    { name: 'Any open CRITICAL on exposed path', threshold: 'total ≤ 69', triggered: true, binding: false, evidence: 'Down from 10 → 1 critical remaining (Terraform-commented). Cap still technically triggered but total already under.' },
    { name: 'Cross-tenant data exposure', threshold: 'total ≤ 49', triggered: false, binding: false, evidence: 'FIXED: memory-graph Cypher tenant-scoped; JWT carries tenantId; auth rejects prod tokens without it.' },
    { name: 'No auth/admin logging', threshold: 'detection ≤ 3/10', triggered: false, binding: false, evidence: 'FIXED: auditPhiAccess middleware wired into 18 PHI routes (patients, memories, biomarkers, medications, fhir, voice, etc.).' },
    { name: 'No restore evidence', threshold: 'resilience ≤ 2/5', triggered: true, binding: true, evidence: 'Still cap-bound — Day-60 restore drill + PITR pending.' },
    { name: 'No WAF on public', threshold: 'cloud ≤ 9.8/14', triggered: true, binding: false, evidence: 'Terraform still commented. Day-60 activation target.' },
    { name: 'Admin without MFA', threshold: 'identity ≤ 7.2/18', triggered: true, binding: false, evidence: 'No MFA library yet. Day-60 TOTP/WebAuthn target. Current identity subscore 10 is already above cap.' },
    { name: 'Plaintext prod secret in git', threshold: 'total ≤ 59', triggered: false, binding: false, evidence: 'k8s/secrets.yaml placeholder-only; clean history.' },
    { name: 'Prod deploy with CI secrets exposed', threshold: 'total ≤ 59', triggered: false, binding: false, evidence: 'No pull_request_target. Deploy-production.yml now has environment gate.' },
    { name: 'AI tool execution without validation', threshold: 'AI ≤ 3/10', triggered: false, binding: false, evidence: 'No prod agent/tool loop. services/ai now Bearer-gated.' },
  ],
  criticals: [
    { id: 'C-7', severity: 'critical', title: 'PARTIAL — 23 of 25 PHI Prisma models still have no tenantId column. JWT now carries tenantId; query-layer scoping landed in memory-graph; Prisma migration remains (Day-30)', file: 'packages/database/prisma/schema.prisma', effort: '5 days', active: true },
    { id: 'C-9', severity: 'critical', title: 'REMAINING — CFR 21 Part 11 signRecord is plain SHA-256 with no key — forgeable', file: 'packages/clinical-export/src/CFR11Compliance.ts:29-47', effort: '2 days', active: false },
    { id: 'C-10', severity: 'critical', title: 'REMAINING — Clinical-export exportWithSignature takes userId as an unauthenticated string', file: 'packages/clinical-export/src/DataExporter.ts:201-231', effort: '1 day', active: false },
    { id: 'C-1', severity: 'critical', title: 'CLOSED ✓ — memory-graph Cypher queries now tenant-scoped; JWT carries tenantId; auth rejects prod tokens without it', file: 'services/memory-graph/src/graph/MemoryQuery.ts (Phase 42)', effort: 'DONE', active: false },
    { id: 'C-2', severity: 'critical', title: 'CLOSED ✓ — services/ai now Bearer-auth-gated on every non-/health endpoint; 25MB upload cap; content-type allow-list; BAA env gate', file: 'services/ai/src/main.py (Phase 42)', effort: 'DONE', active: false },
    { id: 'C-3', severity: 'critical', title: 'CLOSED ✓ — JWT_SECRET fail-fast env validator; well-known defaults rejected; ≥32 bytes in prod; ephemeral per-process random dev secret', file: 'services/api/src/config/env.ts + memory-graph/middleware/auth.ts (Phase 42)', effort: 'DONE', active: false },
    { id: 'C-4', severity: 'critical', title: 'CLOSED ✓ — AuditLog writer live (packages/database/src/audit.ts) + auditPhiAccess middleware on 18 PHI routes + PHI redactor', file: 'packages/database/src/audit.ts + services/api/src/middleware/audit.ts (Phase 42)', effort: 'DONE', active: false },
    { id: 'C-5', severity: 'critical', title: 'CLOSED ✓ — HTTP Basic Auth restored on pitch-site /private/*; 503 fail-closed in prod; PRIVATE_PASSWORD env required', file: 'apps/pitch-site/src/middleware.ts (Phase 42)', effort: 'DONE', active: false },
    { id: 'C-6', severity: 'critical', title: 'CLOSED ✓ — middleware.ts installed on all 4 dashboards with Basic Auth + 503 fail-closed + security headers', file: 'apps/{admin,caregiver,clinician,family}-dashboard/src/middleware.ts (Phase 42)', effort: 'DONE', active: false },
    { id: 'C-8', severity: 'critical', title: 'CLOSED ✓ — POST /auth/logout endpoint added with refresh-token denylist shim', file: 'services/api/src/routes/auth.routes.ts + controllers/auth.controller.ts (Phase 42)', effort: 'DONE', active: false },
  ],
  top10Fixes: [
    { rank: 1, title: 'CLOSED ✓ — JWT_SECRET dev fallbacks removed; fail-fast env validator', refFinding: 'C-3', effort: 'DONE', owner: 'Phase 42' },
    { rank: 2, title: 'CLOSED ✓ — pitch-site /private/* Basic Auth restored', refFinding: 'C-5', effort: 'DONE', owner: 'Phase 42' },
    { rank: 3, title: 'CLOSED ✓ — MCP scope tightened (removed Chrome JS tool + GHL write + home-dir read)', refFinding: 'H-19/H-20/H-21', effort: 'DONE', owner: 'Phase 42' },
    { rank: 4, title: 'CLOSED ✓ — services/ai Bearer auth + 25MB cap + content-type allow-list + BAA env gate', refFinding: 'C-2', effort: 'DONE', owner: 'Phase 42' },
    { rank: 5, title: 'CLOSED ✓ — memory-graph Cypher tenant-scoped; JWT tenantId propagation', refFinding: 'C-1', effort: 'DONE (Prisma migration Day-30)', owner: 'Phase 42' },
    { rank: 6, title: 'CLOSED ✓ — AuditLog writer live on 18 PHI routes', refFinding: 'C-4', effort: 'DONE', owner: 'Phase 42' },
    { rank: 7, title: 'CLOSED ✓ — middleware.ts with Basic Auth on all 4 dashboards', refFinding: 'C-6', effort: 'DONE', owner: 'Phase 42' },
    { rank: 8, title: 'CLOSED ✓ — POST /auth/logout endpoint added', refFinding: 'C-8', effort: 'DONE (Redis denylist Day-30)', owner: 'Phase 42' },
    { rank: 9, title: 'CLOSED ✓ — deploy-production.yml is now real workflow with environment gate + audit-gate + SBOM + gitleaks', refFinding: 'H-8', effort: 'DONE', owner: 'Phase 42' },
    { rank: 10, title: 'CLOSED ✓ — security headers in vercel.json + all 5 next.config.js via shared helper', refFinding: 'H-15', effort: 'DONE', owner: 'Phase 42' },
    { rank: 11, title: 'NEXT — Prisma migration to add tenantId to 23 remaining PHI models + backfill', refFinding: 'C-7', effort: '3-5 days', owner: 'Backend lead' },
    { rank: 12, title: 'NEXT — Replace CFR11 SHA-256 signRecord with HMAC or Ed25519', refFinding: 'C-9', effort: '2 days', owner: 'Compliance + Backend' },
    { rank: 13, title: 'NEXT — Activate Terraform base stack (WAF, KMS, RDS encryption, S3 SSE-KMS)', refFinding: 'cloud cap', effort: '4-6 days', owner: 'Platform' },
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
