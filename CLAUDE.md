# Gentle Reminder Health Corp — Project Instructions

@.claude/project-instructions.md

## Repo overview

- Monorepo (npm workspaces / turbo) with `apps/`, `packages/`, `services/`, `scripts/`, `docs/`.
- Primary apps: `apps/pitch-site` (Next.js, deployed to Vercel), `apps/mobile` (Expo RN + web), `apps/clinician-dashboard`.
- Primary backend service: `services/ai` (Python), `services/api` (GraphQL gateway).
- Infra: Vercel (pitch site), Neon (Postgres), Supabase (auth + storage planned), GoHighLevel (CRM via MCP).
- Entity: Gentle Reminder Health Corp, Delaware C-Corp (formation in progress 2026-04-22).

## Claude Code usage

- Use `/fortress-audit` for security, AI abuse, breach readiness, and investor diligence reviews.
- For live + repo side-by-side, use `prompts/live-url-repo-side-by-side-scan.md`.
- Treat this repository as **production-sensitive** (handles PHI via FHIR, PII via CRM, AI inference, clinical data).
- Do not claim the app is unhackable.
- Prefer evidence over assumptions.
- Mark missing proof as UNVERIFIED.
- When a live URL is provided, compare the live system against the repo and list drift.
- Start with the highest-risk paths: auth, admin routes, file upload, secrets, AI tools, external integrations, CI/CD, and cloud exposure.

## Data-sensitivity context

- **PHI:** mobile app + clinician dashboard handle HIPAA-protected health info (cognitive state, emotion detection, care plans). Scoped via `packages/fhir/` and `packages/safety/`.
- **PII:** GHL CRM holds 34+ outreach contacts with emails, phones, titles. Location ID: `Z7s02Er3ggqTnta4X8HB`.
- **Secrets:** OpenAI, Anthropic, GHL PIT, Neon DATABASE_URL, Supabase service role — all must route through env-only; never inline.
- **AI flows:** Claude + OpenAI inference for transcription, emotion detection, cognitive analysis, care summaries. MCP tool integrations with GoHighLevel, Chrome, Supabase, Figma, Vercel.

## Fundraising context

- Raising $5M seed at $25M post-money.
- 23 patented innovations (provisional patents drafting).
- Investor diligence upcoming — keep security posture defensible and evidence-ready.
