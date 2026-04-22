Use `/fortress-audit` and run a side-by-side review of this repository and the live application.

Inputs:
- Live URL: <PASTE_LIVE_URL>
- Primary repo paths: <PASTE_PATHS_OR_LEAVE_BLANK>
- Environment focus: production
- Threat focus: authentication, admin exposure, file upload, secrets, AI abuse, tenant isolation, CI/CD, cloud misconfiguration, breach containment

Your tasks:
1. Map the repo architecture.
2. Inspect the live URL and identify public routes, headers, cookies, CSP, HSTS, robots, source maps, exposed JS, auth flows, upload paths, admin hints, and obvious third-party integrations.
3. Compare live behavior to repo code and config.
4. Identify config drift between live app and repo.
5. Flag critical exploit paths first.
6. Score the system using the fortress-audit weighted model.
7. Produce an investor diligence summary.

Live scan checklist:
- response headers
- cookie flags
- CSP and browser protections
- route discovery
- admin route exposure
- login and password reset behavior
- registration behavior
- rate limiting behavior
- error leakage
- source map exposure
- JavaScript bundle secrets
- CORS behavior
- file upload handling
- webhook endpoints or callback hints
- third-party scripts
- open storage buckets or asset exposure

Repo scan checklist:
- auth and RBAC
- route protection
- IDOR and tenant isolation
- API validation
- webhook signature checks
- file upload controls
- secret handling
- AI prompts, tool permissions, and output validation
- dependency risk and lockfiles
- CI/CD secrets and deploy protections
- infra exposure and WAF assumptions
- logging and incident runbooks

Output in this exact order:
# Executive Summary
# Security Scorecard
# Live vs Repo Drift
# Critical Findings
# High Findings
# Medium Findings
# Low Findings
# AI Security Review
# Data Breach Readiness
# Investor Diligence Packet
# Top 10 Fixes
# 30 / 60 / 90 Day Plan
# Missing Evidence

End with:
FINAL_WEIGHTED_SCORE: X/100
SECURITY_TIER: [tier]
TOP_BLOCKER: [single worst issue]
