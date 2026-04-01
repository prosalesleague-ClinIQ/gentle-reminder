# Deployment Guide

## Prerequisites

- Node.js 20+
- PostgreSQL 16+ (cloud or local)
- npm 9+

## Quick Deploy (Cloud)

### 1. Database (Neon - Free)

1. Create account at [neon.tech](https://neon.tech)
2. Create a new project "gentle-reminder"
3. Copy the connection string
4. Run setup: `./scripts/setup-database.sh "your-connection-string"`

### 2. Dashboards (Vercel - Free)

Both dashboards are already deployed:
- Caregiver: https://gentle-reminder-dashboard.vercel.app
- Clinician: https://gentle-reminder-clinical.vercel.app

To redeploy after changes:
```bash
# Caregiver dashboard
vercel link --project=gentle-reminder-dashboard
vercel deploy --prod

# Clinician dashboard (swap vercel.json first)
cp vercel-clinical.json vercel.json
vercel link --project=gentle-reminder-clinical
vercel deploy --prod
```

### 3. API Server

**Option A: Vercel Serverless**
```bash
cd services/api
vercel deploy --prod
```

**Option B: Docker**
```bash
cd infrastructure/docker
docker-compose up -d
```

**Option C: Any Node.js host**
```bash
npm run build --workspace=services/api
DATABASE_URL=... JWT_SECRET=... node services/api/dist/index.js
```

### 4. Mobile App

**Web Preview:**
```bash
npm run dev --workspace=apps/mobile
# Opens at http://localhost:8081
```

**Native iPad Build:**
```bash
npx eas build --platform ios --profile production
```

## Environment Variables

### API Server (.env)
```
DATABASE_URL=postgresql://user:pass@host:5432/gentle_reminder
JWT_SECRET=your-secure-jwt-secret-min-32-chars
JWT_REFRESH_SECRET=your-secure-refresh-secret-min-32-chars
PORT=3000
NODE_ENV=production
```

### Dashboards (Vercel Environment)
```
NEXT_PUBLIC_API_URL=https://your-api-url.vercel.app/api/v1
```

## Architecture

```
[iPad App] --> [Express API] --> [PostgreSQL]
     |              |
     |         [WebSocket]
     |              |
[Voice/TTS]   [AI Services] --> [Neo4j]
                    |
              [ML Models]
```

## Monitoring

- API health: GET /health
- System dashboard: /system (caregiver portal)
- Vercel logs: vercel logs --project=gentle-reminder-dashboard

## Security Checklist

- [ ] JWT_SECRET is at least 32 characters
- [ ] DATABASE_URL uses SSL (sslmode=require)
- [ ] CORS origins configured for production domains
- [ ] Rate limiting enabled (default: 100 req/15min)
- [ ] Audit logging enabled
- [ ] All API routes require authentication
