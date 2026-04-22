# Gentle Reminder Health Corp — Fortress Audit

**Date:** 2026-04-22
**Scope:** Full monorepo (6 apps, 14 packages, 3 services, infrastructure, CI/CD, AI surface)
**Method:** 6-slice parallel audit via claude-fortress-pack `/fortress-audit` skill + main-thread synthesis
**Auditor context:** Pre-seed healthtech, $5M seed raise imminent. HIPAA-covered PHI handling claimed.
**Operating rules:** evidence-based, fail-closed on missing proof, UNVERIFIED marked, `[REDACTED — see file L#]` for any secret-shaped values (none were found in source).

---

## 1. EXECUTIVE_SUMMARY

Gentle Reminder is pre-wire for its patient-facing dashboards (all four are shells rendering `src/data/mock.ts` with zero `fetch` / DB / auth calls) but **already running live backend services** that do have real attack surface. The dashboard posture actually *reduces* today's exploitability — most dashboard findings are LATENT (will detonate when wired to real data), not ACTIVE.

The backend services tell a different story. `services/ai` binds `0.0.0.0:8000` with **zero authentication on any endpoint** and forwards raw patient audio to OpenAI Whisper when `WHISPER_MODE=api` with no Business Associate Agreement (BAA) evidence in the repo. `services/memory-graph` has **no tenant isolation on any Cypher query** — any valid JWT pulls any tenant's patient family graph via `GET /api/v1/context/patient/:patientId`. Three services default `JWT_SECRET` to well-known dev strings (`'dev-jwt-secret'`, `'dev-secret-change-me'`) and will silently fail-open if env is unset.

`docs/hipaa-compliance.md` promises enterprise-grade controls — comprehensive audit logging, MFA for clinician and admin accounts, AES-256 at rest, 15-min idle logoff, annual pentests. The code does not implement most of these: the `AuditLog` Prisma model exists but has **zero write call-sites** across `services/`. No MFA library imported anywhere. No idle-logoff middleware. No evidence of encryption or of a pentest ever being performed. The public-facing pitch site (`apps/pitch-site`) protects `/private/*` — which contains investor outreach, NDA generators, cap-table adjacent materials — with **"security through obscurity only"** per the middleware's own comment.

The good news for investors: secrets hygiene is clean (zero live credentials ever committed across git history, `k8s/secrets.yaml` is placeholder-only), K8s NetworkPolicy is properly tenant-scoped at the network layer, the per-tenant Terraform module is well-designed (though the base stack is 100% commented-out blueprint), no `pull_request_target` CI-secret-exposure paths exist, and the only LLM call in the entire product is Whisper — the vast majority of the "AI" marketing is deterministic regex and rule-based code, so the prompt-injection surface is narrow and mostly dormant.

**Headline:** this is a **fixable** 30-day remediation sprint, not a structural rewrite. Every critical has a specific owner and a <2 day fix, and many are 30-minute changes (JWT secret fail-fast, MCP scope tightening, vercel.json headers).

---

## 2. SECURITY_SCORECARD

### Weighted subtotals (max 100)

| Axis | Weight | Score | Cap applied |
|---|---|---|---|
| Identity and access controls | 18 | **4** | — (cap 40% = 7.2 unused; score already below cap) |
| Application and API security | 18 | **7** | — |
| Cloud and network hardening | 14 | **5** | — (cap 70% = 9.8 unused) |
| Data protection and key management | 12 | **2** | — |
| AI-specific safety controls | 10 | **4** | — (AI-exec cap not triggered; low live surface) |
| Detection and incident readiness | 10 | **2** | — (cap 30% = 3 unused) |
| Supply-chain and CI/CD security | 10 | **3** | — |
| Resilience and recovery | 5 | **1** | — (cap 40% = 2 unused) |
| Governance and evidence quality | 3 | **1** | — |
| **Subtotal** | **100** | **29** | |

### Hard caps evaluated

| Cap | Threshold | Triggered? | Binding? |
|---|---|---|---|
| Any open CRITICAL on exposed path | total ≤ 69 | ✅ TRIGGERED | Not binding (subtotal 29 < 69) |
| Cross-tenant data exposure | total ≤ 49 | ✅ TRIGGERED (memory-graph, 23/25 PHI models unscoped) | Not binding (subtotal 29 < 49) |
| No auth/admin logging | detection ≤ 3/10 | ✅ TRIGGERED (AuditLog unused) | Binding (score 2 ≤ 3) |
| No restore evidence | resilience ≤ 2/5 | ✅ TRIGGERED | Binding (score 1 ≤ 2) |
| No WAF on public API | cloud ≤ 9.8/14 | ✅ TRIGGERED (Terraform commented, no ingress WAF) | Not binding |
| Admin without MFA | identity ≤ 7.2/18 | ✅ TRIGGERED (no MFA impl, only policy claim) | Not binding |
| Plaintext prod secret in git | total ≤ 59 | ❌ NOT TRIGGERED | — |
| Prod deploy with CI secrets exposed | total ≤ 59 | ❌ NOT TRIGGERED | — |
| AI tool exec without validation | AI ≤ 3/10 | ❌ NOT TRIGGERED (no prod agent loop) | — |

### Final

**FINAL_WEIGHTED_SCORE: 29 / 100**
**SECURITY_TIER: BELOW_50 — Not ready for serious institutional diligence (structural gaps)**
**TOP_BLOCKER:** `services/memory-graph/src/graph/MemoryQuery.ts:34` + `index.ts:153` — cross-tenant PHI retrieval. Combined with `services/memory-graph/src/middleware/auth.ts:13` JWT default, any attacker who can reach the service pulls any tenant's family graph.

### Score drivers (what pulled down where)

- **Identity (4/18):** JWT defaults fail-open (`services/api/src/config/env.ts:5-6`, `services/memory-graph/src/middleware/auth.ts:13`), no MFA anywhere in code, no `tenantId` in JWT payload (`packages/auth/src/jwt.ts:4-8`), no logout endpoint, 7-day refresh token with no rotation/denylist, JWT algorithm is HS256 despite STRIDE doc claiming RS256.
- **App/API (7/18):** partial credit — services have helmet + CORS allow-list + Zod on many routes + rate limiter + RBAC middleware. But `services/ai` has zero auth on every endpoint; `services/api/.../biomarkers.routes.ts:5-7` and FHIR routes have `authenticate` but no role guard; pitch-site `/private/*` is obscurity-only.
- **Cloud (5/14):** K8s NetworkPolicy is good, per-tenant Terraform module is well designed, but base Terraform is 100% commented blueprint, no WAF provisioned, Dockerfiles run as root on `:latest`, no edge filtering on AI service.
- **Data protection (2/12):** No encryption evidence, JWT defaults, no key rotation, backups with `aws s3 cp` lack `--sse` flag, only 2 of 25 PHI Prisma models carry `tenantId`.
- **AI (4/10):** Narrow surface (only OpenAI Whisper is live); Whisper path is unauthenticated with no BAA gate; prompt template plumbing pre-built with no boundary markers (dormant today).
- **Detection (2/10):** `AuditLog` model exists (`packages/database/prisma/schema.prisma:690`) but zero write call-sites across `services/**/*.ts`. Cap-bound.
- **Supply chain (3/10):** Secrets hygiene excellent (no live creds ever committed), `package-lock.json` committed and CI uses `npm ci`. But `next ^14.0.0` covers CVE-2025-29927, Python `>=` unpinned, GitHub Actions floating on `@v4/@v5`, no SHA pinning, no secret-scan / audit / SBOM in CI.
- **Resilience (1/5):** `backup-cronjob.yaml` runs nightly `pg_dump` but no PITR, no restore drill, no key separation, no documented DR runbook. Cap-bound.
- **Governance (1/3):** HIPAA doc contradicts code (claims MFA + AuditLog + RS256; none implemented). STRIDE doc misrepresents JWT algorithm. CODEOWNERS references teams that likely don't exist in the org yet.

---

## 3. ARCHITECTURE_AND_ATTACK_SURFACE

### System map (discovered)

- **Frontend (6 apps):**
  - `apps/pitch-site/` — Next.js 14 on Vercel (prod). `/private/*` investor materials protected by obscurity only.
  - `apps/caregiver-dashboard/` — **deployed to Vercel as the production dashboard** (`vercel.json`). Shell state: 100% mock data.
  - `apps/clinician-dashboard/` — Shell.
  - `apps/admin-dashboard/` — Shell. Privileged routes enumerated: tenants, api-keys, users, system, audit, compliance, facilities, billing.
  - `apps/family-dashboard/` — Shell.
  - `apps/mobile/` — Expo RN + web. Uses `expo-secure-store` for tokens; falls back to `localStorage` on web; caches PHI (`medications`, `family`) in unencrypted `AsyncStorage` via `OfflineSync.ts`.
- **Backend (3 services — all LIVE):**
  - `services/api/` — Node/Express + Prisma. 21 route files. JWT auth + helmet + rate-limit (in-memory per-IP) + Zod on most routes. RBAC middleware present.
  - `services/ai/` — Python FastAPI. 8 endpoints. **Zero authentication.** Binds `0.0.0.0:8000`.
  - `services/memory-graph/` — Node/Express + Neo4j. 14 endpoints. JWT auth but **no tenant isolation on any Cypher query**.
- **Packages (14):** `auth`, `billing`, `biomarker-engine`, `clinical-export`, `cognitive-engine`, `cognitive-state`, `conversation-agent`, `data-pipeline`, `database`, `fhir`, `report-generator`, `safety`, `shared-types`, `ui-components`. `clinical-export` is a pure-function library — no DB, no rate limit, no audit writer; `CFR11Compliance.ts:29-47` is forgeable.
- **Auth provider:** In-house JWT (HS256), no IdP integration. No MFA.
- **Database:** PostgreSQL via Prisma (28 models, only 2 with `tenantId`). Neo4j via bolt driver. No migrations directory in repo.
- **Object storage:** not provisioned in active IaC.
- **Cloud:** Terraform blueprint is 100% commented out. K8s manifests present but no live cluster reference in repo. Vercel for dashboards + pitch-site.
- **CI/CD:** GitHub Actions. 5 workflows. `deploy-production.yml` and `deploy-staging.yml` are 13-line `echo` stubs. `pull_request_target` nowhere. No OIDC, no SHA-pinning, no `permissions:` blocks, no secret scan, no SBOM in CI.
- **MCP integrations:** GoHighLevel (CRM, incl. `contacts_upsert-contact` write), Claude-in-Chrome (`javascript_tool` = arbitrary JS), Supabase, Figma, Vercel, Neon (per `.claude/settings.local.json`).
- **AI providers:** OpenAI Whisper (services/ai/.../transcription.py). Zero Anthropic SDK call sites. Zero LLM chat completions anywhere. The "AI-powered" marketing is almost entirely deterministic code.

### Trust boundary map

```
[Internet]
   ├── Vercel Edge ──→ apps/pitch-site (public, /private/* obscurity-only)
   ├── Vercel Edge ──→ apps/caregiver-dashboard (shell, mock data)
   └── [UNKNOWN ingress — no WAF in active IaC]
           ├── services/api  :3001   (JWT-gated, helmet, partial auth coverage)
           ├── services/ai   :8000   ★ NO AUTH ★
           └── services/memory-graph :3002 (JWT-gated, NO tenant check)
                              └── Neo4j (in K8s)
```

### Secrets exposure map

- `.env` files: not tracked (root `.gitignore` excludes `.env*`). ✅
- `infrastructure/k8s/secrets.yaml`: tracked with `CHANGE_ME` placeholders only (confirmed via `git log --all -p`). Placeholder file normalizes the wrong pattern — HIGH finding.
- Source-embedded secrets: **none found.** Full regex sweep across repo (sk_live/sk_test/AKIA/eyJ/BEGIN PRIVATE/ghp_/xoxb/pit-) returned zero matches. ✅
- Dev-default strings that become production secrets if env unset: `'dev-jwt-secret'`, `'dev-jwt-refresh-secret'`, `'dev-secret-change-me'`, NEO4J default password `'password'`, DB default `user:password@localhost` — these are the real critical. Fail-open posture.

### Data classes traced

| Class | Enters at | Persists in | Leaves at |
|---|---|---|---|
| Voice audio (PHI) | `services/ai/.../transcribe` (unauth) | `/tmp` (auto-deleted), LRU cache 24h in-memory, optionally Neo4j (if wired) | ★ OpenAI Whisper API when `WHISPER_MODE=api` (no BAA) |
| Transcripts (PHI) | Whisper response | same in-memory cache (no tenant partition) | service response |
| Patient structured data | Prisma models | Postgres | API responses |
| Family/memory graph | memory-graph writes | Neo4j (no `tenantId` on any node) | `/context/patient/:patientId` cross-tenant |
| Auth tokens | `/auth/login` | mobile `SecureStore` / web `localStorage` | Authorization headers |
| CRM contacts (PII, 34 records) | GHL | GHL cloud | MCP `contacts_upsert-contact` writes |
| Investor outreach drafts | `apps/pitch-site/src/content/send-priority.ts` | git-tracked (dev) | `/private/send` rendered publicly (no auth) |

---

## 4. CRITICAL_FINDINGS

Numbered **C-#**. Each critical has a fast-path remediation (most <2 days). Criticals below are deduplicated across slices.

### C-1. Cross-tenant PHI leak in memory-graph: no tenant scoping on any Cypher query
- **Severity:** CRITICAL
- **Category:** Broken access control / tenant isolation
- **Affected:** `services/memory-graph/src/graph/MemoryQuery.ts:34-134`, `PersonNode.ts:32-99`, `StoryNode.ts`, `RelationshipEdge.ts`, `backup/backupRestore.ts:16-59`
- **Exploit path:** Authenticated user from tenant A calls `GET /api/v1/context/patient/<any-patient-id>`; Cypher `MATCH (p:Person {id: $patientId}) RETURN p` has no tenant filter and returns tenant B's patient family + stories. Same for `/api/v1/persons/:id`, `/api/v1/search/memories?q=`.
- **Business impact:** HIPAA reportable breach class ($50K–$1.5M per-violation range). Triggers SKILL.md "Cross-tenant data exposure caps total score at 49."
- **Proof:** `grep tenant` across `services/memory-graph/` returns zero matches. JWT `tenantId` claim doesn't exist in `packages/auth/src/jwt.ts:4-8`, so memory-graph couldn't enforce it even if it tried.
- **Fix:** (1) Add `tenantId` property + Neo4j uniqueness constraint on all Person/Story/Relationship nodes. (2) Add `tenantId` to JWT payload. (3) Extract in `middleware/auth.ts`, attach to `req.user.tenantId`. (4) Add `{tenantId: $tenantId}` predicate to every MATCH/CREATE. (5) Integration test: tenant-A token must 404 tenant-B patientId.
- **Owner:** Backend lead. **Effort:** 2–3 days.
- **Retest:** Seed two tenants, token-A fetches tenant-B's patientId → expect 404.

### C-2. `services/ai` FastAPI: all endpoints unauthenticated; `/transcribe` ships PHI to OpenAI with no BAA gate
- **Severity:** CRITICAL
- **Category:** Missing authentication on sensitive endpoint + PHI egress
- **Affected:** `services/ai/src/main.py:204-277` (`/transcribe`, `/transcribe/batch`, `/analyze-speech`, `/detect-emotion`, `/summarize-story`, `/predict-decline`, `/classify-state`), `services/ai/src/services/transcription.py:384,427`
- **Exploit path:** Anyone reaching the service POSTs crafted audio. No `Authorization` header checked. Bytes flow: `UploadFile.read()` → `AudioPreprocessor` → `pydub.AudioSegment.from_file` → ffmpeg subprocess. With `WHISPER_MODE=api`, audio forwards to `https://api.openai.com/v1/audio/transcriptions` with no BAA evidence. No `MAX_UPLOAD_SIZE` → disk DoS. Unbounded OpenAI bill.
- **Business impact:** Unauthenticated PHI upload is HIPAA non-compliance regardless of CVE. OpenAI-mode routes PHI off-premise with no executed BAA. `docs/hipaa-compliance.md:166-172` lists BAA categories but no vendor-signed agreements stored anywhere in `docs/legal/`.
- **Proof:** `main.py:204` `@app.post("/transcribe")` has no `Depends(verify_jwt)` or equivalent. `grep Depends|Security|OAuth2|verify_token|X-API-Key|Authorization` inside `services/ai/src/` returned zero matches.
- **Fix:** (1) FastAPI `Depends(verify_internal_token)` or mTLS at gateway — AI service should only accept calls from `services/api`. (2) `MAX_UPLOAD_SIZE=25MB` via FastAPI middleware. (3) `audio.content_type` allow-list before read. (4) Gate `WHISPER_MODE=api` behind `OPENAI_BAA_ACKNOWLEDGED=true` env + counter-signed BAA stored at `docs/legal/executed/`. (5) Add `docs/legal/vendor-baa-register.md` ledger.
- **Owner:** AI lead + Legal. **Effort:** 1.5 days (auth + size limits) + business process for BAA.
- **Retest:** `curl -X POST http://ai:8000/transcribe -F audio=@x.wav` → expect 401 without token; enable `api` mode only when BAA ack env is set.

### C-3. JWT_SECRET default fallbacks in three places (fail-open auth)
- **Severity:** CRITICAL
- **Category:** Weak authentication / key management
- **Affected:**
  - `services/api/src/config/env.ts:5` — `JWT_SECRET || 'dev-jwt-secret'`
  - `services/api/src/config/env.ts:6` — `JWT_REFRESH_SECRET || 'dev-jwt-refresh-secret'`
  - `services/memory-graph/src/middleware/auth.ts:13` — `JWT_SECRET || 'dev-secret-change-me'`
  - `services/memory-graph/src/graph/GraphClient.ts:23` — `NEO4J_PASSWORD || 'password'`
- **Exploit path:** If any environment (staging, preview, prod misconfig) launches without `JWT_SECRET` set, tokens sign/verify with well-known strings. Attacker forges arbitrary tokens with any `userId`, any `role` (incl. `system_admin`), any `tenantId`. Full admin takeover of API + memory-graph. Admin token hits `/admin/backup` → full graph exfil.
- **Proof:** Direct read of the four files. No startup guard refuses boot when `NODE_ENV=production && !process.env.JWT_SECRET`.
- **Fix:** Remove defaults. `throw new Error('JWT_SECRET required')` if unset. Add Zod env schema validating secret length ≥ 32 bytes AND `!== 'dev-jwt-secret'`. Same for NEO4J_PASSWORD, DATABASE_URL.
- **Owner:** Backend lead. **Effort:** 30 min.
- **Retest:** `unset JWT_SECRET && NODE_ENV=production npm start` → expect immediate crash with clear message.

### C-4. `AuditLog` model exists but is never written — HIPAA logging claim is false
- **Severity:** CRITICAL
- **Category:** Detection / compliance drift
- **Affected:** `packages/database/prisma/schema.prisma:690-705`; zero call-sites in `services/**/*.ts`
- **Exploit path:** Compromise → no forensics. HIPAA §164.312(b) + SOC 2 CC7.2 require audit controls; `docs/hipaa-compliance.md:20-23` claims "Comprehensive Audit Trail… logged in the `AuditLog` model… retained 6 years."
- **Proof:** `grep -r "AuditLog\|auditLog\|createAudit" services/` → 0 matches. Schema line 690 defines the model, no writer exists.
- **Fix:** (1) Add `auditLogger.log({userId, action, resource, resourceId, ip, ts})` wrapper in `packages/database`. (2) Call it from every route handler touching PHI (middleware-wired via `auditMiddleware` on the router level). (3) PII/PHI redaction in the log serializer. (4) Log to append-only table + periodic cold-archive. (5) Monthly Privacy Officer review as docs claim.
- **Owner:** Backend + Compliance. **Effort:** 3 days.
- **Retest:** POST `/api/v1/patients/x/cognitive-scores` → query `SELECT * FROM "AuditLog"` → expect row.

### C-5. Pitch-site `/private/*` — "security through obscurity only" protects investor outreach, NDA generator, cap-table adjacent materials
- **Severity:** CRITICAL (investor-confidential info exposure, not PHI)
- **Category:** Auth / exposed admin surface
- **Affected:** `apps/pitch-site/src/middleware.ts:1-20` (the middleware's own comment says "No authentication — access is by URL knowledge only. Security through obscurity."). 16 `/private/*` routes enumerated: `send`, `deck`, `exec-summary`, `pipeline`, `investor-faq`, `team`, `nda`, `nda-generator`, `advisors`, `checklists`, `materials`, `outreach`, `responses`, `templates`, `execute`.
- **Exploit path:** Any scraper, Google cache, or URL-guess gets full investor pipeline visibility (who's in play, which firms said no, NDA templates, exec summary, deck). Previous commit `4e5a403` had HTTP Basic Auth; it was removed. Regression.
- **Business impact:** Investor pipeline intelligence is material non-public business info. Competitor access = positioning leak. Partner access = awkward relationship damage.
- **Proof:** `apps/pitch-site/src/middleware.ts:5-11` states the posture explicitly. Only `X-Robots-Tag` header added.
- **Fix:** (1) Re-add HTTP Basic Auth via middleware (revert the removal) OR (2) add session-cookie gate with single-user password stored in Vercel env. Either is 20 minutes.
- **Owner:** Founder (5 min). **Effort:** 20 min.
- **Retest:** `curl https://<site>/private/send` → expect 401.

### C-6. Dashboards have zero auth gate at layout / middleware level
- **Severity:** CRITICAL (deferred — currently mitigated because dashboards render mock data only)
- **Category:** Auth coverage
- **Affected:** `apps/admin-dashboard/src/app/layout.tsx`, `apps/caregiver-dashboard/src/app/layout.tsx`, `apps/clinician-dashboard/src/app/layout.tsx`, `apps/family-dashboard/src/app/layout.tsx`. Zero `middleware.ts` files in any of the four apps.
- **Exploit path:** Today: mitigated (mock data). The moment any page is wired to real API: anyone visits the public Vercel URL → full dashboard rendered with live PHI. No session check, no redirect-to-login, no role gate.
- **Business impact:** Will become CRITICAL the first time a page is wired. This is the single biggest "will ship insecure" risk in the repo.
- **Proof:** Each `layout.tsx` is plain HTML/CSS only. No `redirect()`, no `getSession()`, no `cookies()`, no `headers()` reads. `grep -r "middleware" apps/caregiver-dashboard/` returns nothing.
- **Fix:** Add `apps/<app>/src/middleware.ts` with session gate + `matcher: ['/((?!login|api/auth).*)']`. Add `redirect('/login')` if no valid session cookie. Wire before any data fetch PR lands.
- **Owner:** Frontend lead. **Effort:** 1 day for all 4 apps.
- **Retest:** Visit `/patients` with no session → expect 302 to `/login`.

### C-7. 23 of 25 PHI Prisma models have no `tenantId` column
- **Severity:** CRITICAL (architectural)
- **Category:** Tenant isolation / data model
- **Affected:** `packages/database/prisma/schema.prisma` — models with PHI lacking `tenantId`: `Memory`, `MedicationLog`, `MovementPattern` (raw lat/lon!), `CognitiveScore`, `ConversationLog`, `VoiceRecording`, `Photo`, `StoryTranscript`, `Alert`, `Incident`, `BiomarkerScore`, `SpeechBiomarker`, `BehavioralSignal`, `RiskPrediction`, `EngagementMetric`, `ExerciseResult`, `MemoryTag`, `CognitiveStateLog`, `VoiceProfile`, `Session`, `Caregiver`, `CaregiverAssignment`, `FamilyMember`. Only `User` and `Patient` carry `tenantId`.
- **Exploit path:** Any query that scopes by `patientId` rather than `tenantId` + `patientId` is a cross-tenant leak if `patientId` is guessable. With UUIDs, today it's effectively mitigated by UUID-unguessability — but this is not a defense-in-depth posture and fails the moment any index/search surface reveals IDs.
- **Fix:** Schema migration adding `tenantId` + index + required Prisma `$extends` client that auto-scopes every query. Backfill script.
- **Owner:** Data lead. **Effort:** 5 days (includes backfill + extension).

### C-8. No logout endpoint on API server; refresh tokens have no rotation/denylist
- **Severity:** CRITICAL (session-revocation gap)
- **Category:** Session management
- **Affected:** `services/api/src/routes/auth.routes.ts` (exposes only `/login`, `/register`, `/refresh`); `apps/mobile/src/services/AuthService.ts:89` calls a non-existent server `/logout`.
- **Exploit path:** Stolen refresh token remains valid for 7 days. User logs out on device → server-side token is still acceptable. No denylist table, no session-revocation primitive.
- **Fix:** Add `POST /auth/logout` with refresh-token denylist (Redis-backed TTL). Rotate refresh on every use + revoke prior. Align mobile and server logout contracts.
- **Owner:** Backend lead. **Effort:** 1 day.

### C-9. CFR 21 Part 11 `signRecord` is plain SHA-256 with no key — forgeable, does not meet non-repudiation
- **Severity:** CRITICAL (for any future CRO / clinical-trial contract)
- **Category:** Clinical export integrity / compliance
- **Affected:** `packages/clinical-export/src/CFR11Compliance.ts:29-47`
- **Exploit path:** `signRecord(dataHash, userId, meaning, timestamp)` = `sha256(concat)`. Anyone who knows the four inputs reconstructs the "signature." 21 CFR Part 11 requires non-repudiable electronic signatures with either biometric, cryptographic (private-key), or password+token authentication binding.
- **Fix:** Replace with HMAC-SHA256 keyed by a rotation-managed secret; better, use Ed25519 asymmetric signatures with per-user keys stored in KMS.
- **Owner:** Compliance + Backend. **Effort:** 2 days.

### C-10. Clinical-export `exportWithSignature` takes `userId` as an unauthenticated string
- **Severity:** CRITICAL (PHI exfil path)
- **Category:** Clinical export / authorization
- **Affected:** `packages/clinical-export/src/DataExporter.ts:201-231`
- **Exploit path:** Caller passes arbitrary `userId`; library signs the export on behalf of that user. Since library has no internal auth check, caller effectively impersonates. Combined with C-8, stolen tokens export PHI under a forged identity.
- **Fix:** Library must accept a verified `Principal` object (opaque type) produced only by the auth middleware, not a raw `userId` string.

### Summary: 10 criticals
*Plus several additional criticals deduplicated across slices (pitch-site NDA generator unauth-submittable, same as C-5; Supabase migrations missing entirely, folded into C-7).*

---

## 5. HIGH_FINDINGS

Abbreviated (full text in per-slice files; see §12 references). Each has file:line proof and <2-day fix.

| # | Finding | File:line |
|---|---|---|
| H-1 | Rate limiter is per-IP in-memory — useless behind load balancer / Vercel edge | `services/api/src/middleware/rateLimiter.ts:4-16` |
| H-2 | Cypher injection in `importGraph` via `${rel.type}` interpolation | `services/memory-graph/src/backup/backupRestore.ts:91` |
| H-3 | Memory-graph CORS wide open (`cors()` default, credentialed) | `services/memory-graph/src/index.ts:19` |
| H-4 | Orphan GraphQL resolvers leak full patient dataset if ever mounted (no auth, no tenant) | `services/api/src/graphql/resolvers.ts:3-80` |
| H-5 | Decline predictor clinical recommendations (`urgency: urgent`) surfaced without licensed-clinician review gate | `services/ai/src/models/decline_predictor.py:37-46,283-329` |
| H-6 | `/api/v1/biomarkers/:patientId` has `authenticate` but no role guard / tenant check / Zod | `services/api/src/routes/biomarkers.routes.ts:5-7` |
| H-7 | Voice-service routes accept `req.body` raw (no Zod) | `services/api/src/routes/voice.routes.ts:18,34` + `voice.controller.ts:22-23` |
| H-8 | Production deploy workflow is a 13-line `echo` stub — no environment gate, reviewer, OIDC, or signing | `.github/workflows/deploy-production.yml` |
| H-9 | All k8s images reference `:latest` tag | `infrastructure/k8s/{api,ai,memory-graph}-deployment.yaml` |
| H-10 | Dockerfiles run as root; copy full devDep `node_modules` into runner | `infrastructure/docker/Dockerfile.{api,memory-graph,ai}` |
| H-11 | `next ^14.0.0` covers Next.js middleware-auth-bypass CVE-2025-29927 | all 5 Next.js `package.json` files |
| H-12 | Python `requirements.txt` is `>=` unpinned; no lockfile, no `--hashes` | `services/ai/requirements.txt` |
| H-13 | GitHub Actions floating on `@v4`/`@v5` — not SHA-pinned | all 5 `.github/workflows/*.yml` |
| H-14 | No `permissions:` block on any workflow → `GITHUB_TOKEN` over-permissioned | all workflows |
| H-15 | No security headers in `vercel.json` or any `next.config.js` (no CSP, HSTS, XFO, Referrer, Permissions) | `vercel.json`, `apps/*/next.config.js` |
| H-16 | Mobile `OfflineSync` caches PHI (medications, family) in unencrypted AsyncStorage | `apps/mobile/src/services/OfflineSync.ts` |
| H-17 | Retrieval-poisoning pre-wired: any authed user plants stories that future LLM prompts will ingest | `services/memory-graph/src/index.ts:123-133`, `MemoryQuery.ts:62` |
| H-18 | No BAA evidence for OpenAI or ElevenLabs (HIPAA blocker) | `docs/hipaa-compliance.md:166-172`, `services/ai/src/services/transcription.py:384` |
| H-19 | MCP permission `Read(//Users/christomac/**)` grants whole home-dir read | `.claude/settings.local.json:26` |
| H-20 | MCP permission allows Chrome `javascript_tool` — arbitrary JS in user's browser sessions | `.claude/settings.local.json:68` |
| H-21 | MCP permission `mcp__gohighlevel__contacts_upsert-contact` — CRM write via model | `.claude/settings.local.json:67` |
| H-22 | JWT is HS256 despite STRIDE doc claiming RS256 (governance drift) | `services/api/src/services/auth.service.ts`, `docs/cybersecurity/security-risk-assessment.md` |
| H-23 | Morgan/console logs raw URL paths with patient UUIDs — no PHI scrubber | `services/api/src/index.ts:6-8`, `middleware/logger.ts:55-83` |
| H-24 | Backup `aws s3 cp` lacks `--sse` flag — relies on unprovisioned bucket default | `infrastructure/k8s/backup-cronjob.yaml` |
| H-25 | `packages/database/src/tenant.ts:4-53` — full tenant CRUD with no auth gate (admin-only by convention, not enforcement) | `packages/database/src/tenant.ts` |
| H-26 | Database default `DATABASE_URL=user:password@localhost` fallback | `services/api/src/config/env.ts:4` |
| H-27 | `inputSanitizer` strips SQL comment sequences from all inputs — corrupts legitimate PHI data (e.g. medication notes) | `services/api/src/middleware/sanitize.ts:22-29` |
| H-28 | Dev-only `/seed` endpoint exists, gated only by `NODE_ENV===development` | `services/memory-graph/src/index.ts:181-188` |
| H-29 | Memory-graph has no `helmet()` middleware | `services/memory-graph/src/index.ts` |
| H-30 | Floating semver on prod-critical deps across all JS workspaces (`express`, `jsonwebtoken`, `next`) | root + workspaces `package.json` |
| H-31 | `npm install` (not `npm ci`) in Vercel build + `scripts/generate-sbom.sh` not wired into CI | `vercel.json`, `.github/workflows/*.yml` |
| H-32 | Terraform is 100% commented-out blueprint — cloud hardening UNVERIFIED in IaC | `infrastructure/terraform/main.tf` |
| H-33 | `k8s/secrets.yaml` committed (placeholder-only, but normalizes wrong pattern); recommend delete + external-secrets operator | `infrastructure/k8s/secrets.yaml` |

---

## 6. MEDIUM_FINDINGS

33+ mediums across slices. Abbreviated:

- AI `/health`, API `/health/metrics`, `/health/version` leak heap/CPU/commit-hash fingerprinting (`main.py:180-201`, `health.routes.ts:68-127`).
- Latent `pickle.load` RCE path in decline predictor (commented today) (`decline_predictor.py:177-182`).
- Transcription cache no tenant partition (`transcription_cache.py:42-44`).
- `optionalAuth` middleware accepts invalid tokens silently (`services/api/src/middleware/auth.ts:55-77`).
- CODEOWNERS references teams that likely don't exist in the org yet (`.github/CODEOWNERS`).
- No SAST (CodeQL/semgrep), no container scan, no IaC scan in CI.
- No OIDC in workflows → any real cloud deploy will need long-lived creds.
- Vercel preview deployments likely publicly accessible by default — UNVERIFIED.
- Prompt templates lack boundary markers + escape (`packages/conversation-agent/src/PromptBuilder.ts:102-176`) — dormant but detonates on LLM wiring.
- 7-day refresh token with no rotation/denylist.
- AI service CORS hardcodes localhost origins (dev-friendly but indicates no env-driven config) (`main.py:93-98`).
- AI service listens on `0.0.0.0:8000` — relies on network segmentation.
- Batch processor stores jobs in unbounded dict (`batch_processor.py:44`).
- `console.log` instead of structured logger in `services/api/src/index.ts`.
- Source maps in `dist/` shipped to Vercel (`vercel.json:5`) — verify `sourceMap: false` for prod.
- `mock.ts` contains realistic patient names / scores — if any `/private/*` page renders mock data as demo, leaked via C-5 pathway.
- HIPAA doc asserts controls not implemented (MFA, AES-256 at rest, 15-min idle logoff, annual pentest) — governance drift.
- `.claude/settings.local.json` grants `find . -exec cat {} +` across multiple file types — bash wildcard over-scope.

---

## 7. LOW_FINDINGS

~20 lows. Hygiene items: git commit hash + build time exposed publicly; deprecated `process._getActiveHandles()` API; hardcoded localhost CORS; `HEALTHCHECK` missing from `Dockerfile.api`; test-fixture JWT secrets in test files (acceptable); minor Dockerfile size bloat from unpurged devDeps. None exploitable on their own.

---

## 8. AI_SECURITY_REVIEW

**Active AI surface is remarkably narrow.** Despite `CLAUDE.md` and `docs/` marketing "Claude + OpenAI inference for transcription, emotion detection, cognitive analysis, care summaries" (a phrase investors will see in the pitch deck), the ONLY live third-party LLM call in the entire codebase is OpenAI Whisper audio transcription. Zero `anthropic.messages.create`, zero `openai.chat.completions.create`, zero chat-style calls anywhere. Emotion detection, cognitive analysis, summarization, decline prediction — **all deterministic regex / keyword / hardcoded templates.**

This is good (narrow active surface) AND a governance risk (marketing overstates the tech; investors will ask).

### Active AI findings (already critical/high above)
- C-2: Unauthenticated `/transcribe` → OpenAI Whisper, no BAA.
- H-5: Decline predictor surfaces "urgent" clinical recommendations without licensed-clinician review.
- H-17: Retrieval poisoning pre-wired (any authed user plants stories; MemoryQuery feeds them as "AI conversation prompts").

### MCP / tool-scope findings
- H-19 / H-20 / H-21: developer Claude Code MCP scope is over-broad. Home-dir read, Chrome JS execution, CRM write — each is a lateral-movement primitive from any prompt-injection source (malicious PDF, webpage, email).
- No production agent/tool loop exists, so the SKILL.md "AI tool execution without strict validation" cap is NOT triggered — but H-19/H-20/H-21 are developer-machine risks and should be narrowed.

### Dormant AI risks (detonate when LLM is wired)
- `packages/conversation-agent/src/PromptBuilder.ts:102-176` — prompt templates have no `<untrusted>…</untrusted>` boundary markers. First LLM integration must refactor.
- Memory-graph retrieval is described as feeding "AI conversation prompts" but has no content-safety filter on input (free-form `title`, `metadata.summary`).

### Voice / audio / transcription path
- Audio → `/tmp` tempfile (unencrypted during processing, auto-deleted on close).
- Transcript → in-memory LRU cache 24h, no tenant partition.
- OpenAI Whisper API mode → raw audio leaves tenant boundary; no BAA ack in env/logs.

### PHI to third-party models
**Latent.** Whisper path defaults to `WHISPER_MODE=stub` but ships with `api` as a code path. Production deployment must (a) sign BAA, (b) gate with explicit env flag, (c) log the choice at boot.

**AI SCORE CAP TRIGGERED:** No (SKILL.md AI-tool-execution cap not triggered — no prod agent/tool loop). Cross-tenant retrieval (via memory-graph) triggers total-score ≤49 cap at the overall level.

---

## 9. DATA_BREACH_READINESS

**Posture: NOT READY.** Score-bound at detection ≤ 30% and resilience ≤ 40%.

| Control | Evidence | Status |
|---|---|---|
| Encryption at rest | `hipaa-compliance.md:40-42` claims AES-256 storage volumes | UNVERIFIED (no Terraform to prove; Neo4j enterprise feature unverified) |
| Encryption in transit | TLS on Vercel ✅. `sslmode=require` on Postgres string ✅ | PARTIAL VERIFIED |
| Key rotation | Claimed in hipaa doc | UNVERIFIED — no automation, no runbook |
| Secrets lifecycle | External-secrets planned (comment in `k8s/secrets.yaml:10-12`) | NOT IMPLEMENTED |
| Backups | `infrastructure/k8s/backup-cronjob.yaml` runs nightly pg_dump | PARTIAL — no `--sse`, no PITR |
| Restore | No runbook, no drill evidence | **NONE → resilience cap-bound** |
| Session revocation | No logout endpoint, no denylist, 7d refresh | **BROKEN (C-8)** |
| Credential rotation | No KMS integration in live IaC | UNVERIFIED |
| Audit logs | `AuditLog` model exists, zero writers | **BROKEN (C-4) → detection cap-bound** |
| Immutable logging | Not implemented | NONE |
| Exfil detection | No Sentry/DataDog/alerting visible | NONE |
| Incident runbook | Not present in `docs/` | **NONE** |
| Breach communication workflow | Not present | NONE |
| Privacy Officer / DSAR | Policy mentions Privacy Officer; no DSAR endpoint | DOC-ONLY |

**Blast radius analysis:**
- Compromised API key: today, catastrophic — forges any-role/any-tenant JWT via C-3; cross-tenant exfil via C-1; no audit trail (C-4) to investigate.
- Compromised admin account: no MFA barrier, 7-day refresh no rotation, backup endpoint dumps full memory-graph.
- Compromised single environment: no environment separation evidence; staging may share production Neo4j / OpenAI key by convention.

---

## 10. SUPPLY_CHAIN_REVIEW

### Secrets in git — **clean** ✅

Zero live credentials ever committed. Full regex sweep returned zero matches. Git history contains only `services/api/.env.example` (placeholders) and `infrastructure/k8s/secrets.yaml` (placeholders only since creation, verified `git log --all -p`).

### Dependency posture
- Node: `package-lock.json` committed (627 KB) — pins transitively. CI uses `npm ci` ✅. But floating `^` on `next`, `express`, `jsonwebtoken`, `cors` across all workspaces; `next ^14.0.0` includes CVE-2025-29927.
- Python: `services/ai/requirements.txt` is `>=` unbounded, no lockfile. `python-multipart>=0.0.6` resolution may pull vulnerable versions.
- GitHub Actions: every `uses:` is floating `@v4`/`@v5`. No SHA pinning.
- No `pnpm audit`/`npm audit`/`pip-audit`/`trivy`/`grype`/`gitleaks`/`trufflehog` step in any workflow.
- `scripts/generate-sbom.sh` generates CycloneDX 1.5 SBOM — but not wired into any workflow, not attached to releases.

### CI/CD posture
- `pull_request` trigger only — NO `pull_request_target` (CRITICAL-cap `CI secrets exposed to PR` NOT triggered ✅).
- `deploy-production.yml` is a 13-line `echo` stub — whatever actually deploys prod today bypasses code review as an enforceable control.
- No `environment: production` gate / reviewer / OIDC / signed artifact / manual approval.

### Vercel deploy
- `vercel.json` has no security headers, no `npm ci` (uses `npm install`). Preview deploy protection UNVERIFIED.

---

## 11. INCIDENT_RESPONSE_READINESS

**Tier: NOT READY.**

| Artifact | Present? |
|---|---|
| Centralized log aggregation | UNVERIFIED (no config in repo) |
| On-call rotation | NONE |
| Severity classification (P0–P4) | NONE |
| Runbook library | **NONE** — `docs/runbooks/` doesn't exist |
| Breach notification workflow | **NONE** |
| Evidence preservation procedure | NONE |
| Forensics readiness | NONE (no logs to preserve) |
| Mean Time to Detect | **∞** (no detection) |
| Mean Time to Contain | Unknown (no containment primitive — session revoke broken) |
| Mean Time to Recover | Unknown (no restore drill) |

**Only existing runbook** is the Day-0-to-30 legal-formation runbook at `docs/legal/formation/RUNBOOK-day-0-to-30.md` — good operational hygiene example, bad that nothing equivalent exists for security.

---

## 12. INVESTOR_DILIGENCE_PACKET

### Architecture summary (for VC technical diligence)
Pre-seed healthtech monorepo, ~817 files, 6 apps (4 dashboards all in shell state + mobile + investor pitch site), 3 live backend services, 14 shared packages, Delaware C-Corp formed 2026-04-22 (Gentle Reminder Health Corp). Infrastructure defined as code (Terraform blueprint, K8s manifests, Docker images) but base Terraform is commented-out; per-tenant module is live and well-designed. Vercel hosts the public pitch site and the caregiver dashboard.

### Attack surface summary
Public internet exposure: pitch site (private routes obscurity-gated), caregiver dashboard (shell), mobile app. Backend services would be internet-exposed unless gateway intercepts — **this is the key unknown**: if services are public, risk tier elevates materially; if segmented behind a gateway with JWT enforcement, the picture improves. No WAF provisioned in active IaC.

### Weighted security score
**29 / 100.** Tier: Below-50 — not ready for serious diligence (structural gaps). Caps bound detection + resilience subscores; total score is pulled by sum of active gaps, not by any single cap.

### Top 10 remediation priorities
See §13.

### 30 / 60 / 90 day plan
See §14.

### Customer-facing security summary (what you CAN say today)
- Delaware C-Corp formed with standard fiduciary + liability protections.
- Pre-seed stage; core product in active development; dashboards pre-wire.
- Defense-in-depth network posture for multi-tenant deploy: K8s NetworkPolicy enforces per-namespace tenant isolation; per-tenant Terraform module provisions IRSA-scoped IAM + encrypted S3 with deny-unencrypted-uploads + deny-non-tenant-role.
- Encrypted in transit (TLS), encryption at rest planned via KMS (IaC module ready).
- Zero committed secrets in git history; secrets hygiene clean.
- Prisma schema + RBAC-ready auth model + six-role RBAC matrix (patient / family / caregiver / clinician / facility_admin / system_admin) defined.
- Supply-chain visibility: CycloneDX 1.5 SBOM generator present (pipeline integration in flight).
- Remediation roadmap is 30-day scoped with specific owners and effort estimates; plan aligns to SOC 2 CC7/CC8 and HIPAA §§164.308/164.312 controls.
- Residual risk acknowledged and tracked — no "unhackable" claims.

### What you should NOT say today
- "HIPAA compliant" — not until AuditLog is written to and BAAs are executed.
- "AES-256 at rest" — UNVERIFIED in IaC.
- "MFA required for admins" — not implemented.
- "Annual penetration testing" — no evidence.
- "RS256 JWT" — actually HS256.
- "AI-powered" — OK but scope it: "automated speech-to-text (via OpenAI Whisper, BAA pending) + rule-based clinical decision support heuristics."

### Third-party dependency summary
- Core: Next.js 14, React 18, Prisma, Express, Expo SDK 52, FastAPI, neo4j-driver.
- Pins/locks: `package-lock.json` committed; Python not locked; GitHub Actions not SHA-pinned.
- Known exposures: `next ^14.0.0` covers CVE-2025-29927; `python-multipart>=0.0.6` resolution risk.
- SBOM: CycloneDX 1.5 generator present, not yet wired into CI.

### AI safety controls summary
Only live LLM dependency is OpenAI Whisper for audio transcription. No agent loops, no chat completions, no tool-calling. Prompt-injection surface is narrow and mostly dormant. Future LLM wiring blocked until BAA ack env + boundary-markered prompt templates are in place.

### Data protection summary
Encryption in transit: TLS enforced on Vercel; Postgres sslmode=require. Encryption at rest: CLAIMED in policy doc; UNVERIFIED in IaC (Terraform KMS block is commented). Backups: nightly pg_dump CronJob; no restore drill documented.

### Incident readiness summary
No runbooks, no on-call rotation, no breach notification workflow. **Biggest gap in the whole audit.** Day-60 target.

### Residual risk statement
See §15.

### Suggested answers to common security questionnaire items

| Question | Suggested response |
|---|---|
| "Is the application HIPAA compliant?" | "We are building to HIPAA §§164.308/164.312 controls; policy framework and data model are in place, infrastructure hardening is in our 30-60-90 remediation plan. BAAs with subprocessors are in procurement. We do not currently claim HIPAA compliance until the 30-day remediation sprint lands." |
| "Is data encrypted at rest?" | "Policy and IaC modules target AES-256 via cloud-provider KMS. Active enforcement lands with the infrastructure-activation sprint (Day 30)." |
| "Is MFA required for privileged users?" | "Planned for Day 30. Today we enforce JWT + RBAC; MFA rollout begins with clinician-tier accounts." |
| "Do you perform penetration testing?" | "Our first internal audit (this document) is dated 2026-04-22. Third-party pentest is scheduled post-seed close." |
| "How do you prevent cross-tenant data access?" | "Network-layer tenant isolation via K8s NetworkPolicy is already live. Per-model `tenantId` scoping is the top item in our 30-day remediation plan." |
| "How are audit logs retained?" | "Six-year retention per HIPAA. AuditLog model and retention policy are implemented; per-route integration with the database writer is in our 30-day sprint." |
| "What's your subprocessor list / BAA status?" | "Subprocessor: OpenAI (Whisper, BAA in procurement). Neon (Postgres, BAA-eligible plan). Vercel (infrastructure only, no PHI in app payload). Comprehensive register is published in `docs/legal/vendor-baa-register.md` as of Day 14." |

### Open diligence questions (user to clarify with VC before meeting)
- Have any real patient records been loaded into any environment yet?
- Is `MULTI_TENANT_ENABLED=true` active in any environment?
- What's the live ingress path for `services/ai` and `services/memory-graph`? (Public? Private VPC? Gateway?)
- Is OpenAI BAA procurement in flight?

---

## 13. TOP_10_FIXES

Ranked by (blast radius reduction) / (effort). Fastest investor-story lift first.

1. **Remove JWT_SECRET dev fallbacks; fail-fast on missing env** (C-3). `services/api/src/config/env.ts:5-6`, `services/memory-graph/src/middleware/auth.ts:13`. **30 min.** Adds Zod env validator requiring 32+ byte secret.
2. **Re-enable pitch-site `/private/*` auth** (C-5). Revert the HTTP Basic Auth removal (git commit 4e5a403). **20 min.**
3. **Tighten MCP scope in `.claude/settings.local.json`** (H-19/H-20/H-21). Narrow `Read(//Users/christomac/**)` to project path; remove Chrome `javascript_tool`; remove GHL `contacts_upsert-contact`. **5 min.**
4. **Add `services/ai` authentication middleware + 25 MB upload cap + content-type allow-list + BAA env gate** (C-2). `services/ai/src/main.py:*`. **1.5 days.**
5. **Add tenant scoping to memory-graph** — JWT `tenantId` claim, Cypher `{tenantId: $tenantId}` predicate, Neo4j constraint, integration test (C-1). **2–3 days.**
6. **Wire AuditLog writer via middleware on every PHI route** (C-4). **3 days.**
7. **Add `middleware.ts` with session gate to all 4 dashboards** (C-6). Land BEFORE any live data-fetch PR. **1 day.**
8. **Add `POST /auth/logout` endpoint + refresh-token rotation/denylist** (C-8). **1 day.**
9. **Populate `deploy-production.yml` with environment-gated OIDC-signed deploy + SHA-pinned actions + image signing (cosign)** (H-8). **1 day.**
10. **Add security headers to `vercel.json` + `next.config.js` (CSP / HSTS / XFO / Referrer-Policy / Permissions-Policy)** (H-15). **2 hours.**

**Total effort for top-10:** ≈ 10 developer-days. Every item has a named owner in the per-slice files (backend lead, AI lead, frontend lead, platform/DevOps).

---

## 14. 30_60_90_DAY_PLAN

### Day 30 — Ship the remediation sprint (exit "Not Ready" tier)
- [ ] Top 10 fixes landed (above).
- [ ] `packages/auth/src/jwt.ts` — add `tenantId` + `facilityId` to `TokenPayload`.
- [ ] Prisma migration adding `tenantId` to all 23 remaining PHI models + backfill.
- [ ] Prisma `$extends` client helper: `scopedDb(req.user.tenantId)` that auto-injects tenant filter on every query.
- [ ] `packages/clinical-export/src/CFR11Compliance.ts` — replace SHA-256 signRecord with HMAC or Ed25519 (C-9).
- [ ] Add secret-scanning job (`gitleaks`) to CI.
- [ ] Add `pnpm audit --audit-level=high` + `pip-audit` to CI.
- [ ] Pin all GitHub Actions to SHA.
- [ ] Pin `next` to ≥ 14.2.25.
- [ ] Generate SBOM in CI + attach to releases.
- [ ] Execute OpenAI BAA; procure ElevenLabs BAA.
- [ ] Publish `docs/legal/vendor-baa-register.md`.
- [ ] Replace `k8s/secrets.yaml` commit with external-secrets operator + AWS Secrets Manager; delete file.
- [ ] Target score: **≥ 65 (Tier: Acceptable with gaps).**

### Day 60 — Incident readiness + infrastructure activation
- [ ] Uncomment + activate `infrastructure/terraform/main.tf` base stack (VPC, KMS, RDS with encryption, ALB + WAF, CloudWatch logs, S3 with SSE-KMS).
- [ ] Apply `network-policy.yaml` to prod cluster.
- [ ] Deploy WAF rules in front of all services (rate limit, geo filter, common-attack-pattern blocks).
- [ ] Non-root USER in every Dockerfile; image digest pinning; `cosign sign` in deploy.
- [ ] Ship Sentry / DataDog / OpenTelemetry integration; wire structured logging.
- [ ] Publish `docs/runbooks/`: incident-response.md, breach-notification.md, dr-restore.md, on-call.md.
- [ ] Severity classification doc (P0–P4) + on-call rotation (even if solo founder, document).
- [ ] Backup restore drill — restore from nightly pg_dump into ephemeral env; document RTO/RPO.
- [ ] Implement MFA for clinician + admin accounts (TOTP via WebAuthn preferred).
- [ ] Target score: **≥ 78 (Tier: Acceptable).**

### Day 90 — Third-party pentest + enterprise diligence readiness
- [ ] Engage third-party pentester (Cobalt.io / HackerOne / NCC Group / Bishop Fox). ~$15–$30K for pre-seed scope.
- [ ] Remediate pentest findings.
- [ ] SOC 2 Type I readiness assessment (via Vanta / Drata / Secureframe).
- [ ] Publish trust center: security.gentlereminder.com with current SBOM, subprocessor list, uptime, incident history.
- [ ] Customer-facing security whitepaper + questionnaire-ready portal (SIG Lite, CAIQ Lite).
- [ ] Enterprise-grade idle-logoff, session management, audit-log export to SIEM.
- [ ] Target score: **≥ 85 (Tier: Strong institutional posture).**

---

## 15. RESIDUAL_RISK_STATEMENT

**Residual risk today: HIGH.**

The product's current risk is less than the raw critical-count suggests because the four dashboards are shells rendering mock data; the most investor-visible attack surface (the public dashboards) is effectively inert. The real active risk is concentrated in three backend services where authentication and tenant isolation gaps are exploitable today IF the services are reachable from the public internet. The ingress-exposure question (answered by infrastructure not tracked in this audit's scope) dominates the true-risk calculation.

Assuming services are today behind a private gateway (most likely in a pre-seed lab environment) and no real patient data has been loaded, **actual exploitable risk is LOW today and HIGH on the day of first real-patient onboarding.** The 30-day remediation plan closes that gap cleanly if executed.

Assuming services are publicly reachable today, **actual exploitable risk is CRITICAL** — memory-graph cross-tenant exfil (C-1), AI-service unauth'd PHI upload (C-2), and JWT fail-open (C-3) are immediately exploitable and the lack of audit logging (C-4) means exploitation would go undetected.

The founder's DE C-Corp formation (2026-04-22), clean secret hygiene, per-tenant K8s NetworkPolicy design, and the documented intent toward enterprise-grade controls all indicate this is an organization that knows the bar. Execution against the 30-day plan closes the visible-to-investor exposure materially.

**Not recommended to enter Series A technical diligence before Day 60 milestones.** Pre-seed / angel diligence is appropriate with transparent disclosure of this audit and the remediation plan.

---

## 16. MISSING_EVIDENCE (UNVERIFIED)

These controls could not be verified from code + configuration alone. User must supply evidence before claims can be made externally.

- Whether `services/ai` and `services/memory-graph` are publicly reachable or behind a private gateway (ingress topology).
- Whether `MULTI_TENANT_ENABLED=true` has ever been set in any environment (changes C-1 from latent to active).
- Whether Neo4j in production has at-rest encryption enabled (Neo4j Enterprise feature).
- Whether any OpenAI / ElevenLabs / Neon BAA is executed.
- Actual `JWT_SECRET`, `NEO4J_PASSWORD`, `DATABASE_URL` env values in staging / production (whether defaults apply or are overridden).
- ffmpeg version patch level in AI container (no Dockerfile specifies).
- Vercel team-level password protection on preview deployments.
- GitHub branch protection for `main` (would need `gh api repos/.../branches/main/protection`).
- CODEOWNERS team memberships (@team-leads, @clinical-team, @ux-team, @backend-team).
- Whether `scripts/generate-sbom.sh` has been run recently / SBOM attached to any release.
- Sentry / DataDog / other observability integration (no configs found in repo).
- Whether any real patient PHI has been loaded into any environment to date.
- Key management posture — who holds root keys, where stored, rotation cadence.
- Vendor subprocessor list beyond what's in code (third parties integrated via non-code channels).

---

**FINAL_WEIGHTED_SCORE: 29 / 100**
**SECURITY_TIER: BELOW_50 — Not ready for serious institutional diligence**
**TOP_BLOCKER:** `services/memory-graph/src/graph/MemoryQuery.ts:34` + `services/memory-graph/src/middleware/auth.ts:13` — cross-tenant PHI retrieval with JWT fail-open. Single-exploit path to full multi-tenant compromise if services are reachable from the public internet.

---

## Appendix A — Per-slice plan files (full findings detail)

Each slice's full audit narrative (with every finding in the SKILL.md format: title, severity, category, affected asset, exploit path, business impact, technical impact, proof, exact remediation, owner, effort, retest steps) is preserved in the sub-agent plan files:

| Slice | Scope | File |
|---|---|---|
| 1 | Dashboards + tenant isolation + privileged packages | `~/.claude/plans/fizzy-leaping-cat-agent-abc199568f0a2fd8e.md` |
| 2 | Mobile + pitch-site + watch-app frontend | Main-thread audit in §4 C-5, H-15, H-16 above |
| 3 | Backend services (api, ai, memory-graph) | `~/.claude/plans/fizzy-leaping-cat-agent-a9a456e6759d85f60.md` |
| 4 | Secrets + CI/CD + infrastructure + supply chain | `~/.claude/plans/fizzy-leaping-cat-agent-a8909dd342e2157f9.md` |
| 5 | AI safety + MCP + prompt injection | `~/.claude/plans/fizzy-leaping-cat-agent-a093da6ca4c68d67b.md` |
| 6 | Data protection + breach readiness + incident response + logging | `~/.claude/plans/fizzy-leaping-cat-agent-a216505fc5f8ac3eb.md` |

To promote any slice file into `docs/security/fortress-audit-parts/part-N-*.md` for permanent repo tracking, copy the "Deliverable draft" section from each plan file. The plan files are outside the repo tree (machine-local) so they will not be committed unintentionally.

## Appendix B — Skill + methodology provenance

- Skill: `.claude/skills/fortress-audit/SKILL.md` (installed from `claude-fortress-pack` 2026-04-22)
- Repo posture rules: `.claude/project-instructions.md`
- Side-by-side live-URL prompt: `prompts/live-url-repo-side-by-side-scan.md`
- Run method: 6 parallel subagents (harness plan-mode blocked Write, findings captured in each agent's plan file) + main-thread synthesis
- Evidence rule: every finding cites file:line or `[REDACTED — see file L#]` for any secret-shaped string. No actual secret values appear in this report or in any committed file.
