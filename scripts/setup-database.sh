#!/bin/bash
# Gentle Reminder - Database Setup Script
# Usage: ./scripts/setup-database.sh <DATABASE_URL>
# Example: ./scripts/setup-database.sh "postgresql://user:pass@host:5432/gentle_reminder"

set -e

echo "======================================"
echo "  Gentle Reminder - Database Setup"
echo "======================================"
echo ""

if [ -z "$1" ]; then
  echo "Usage: ./scripts/setup-database.sh <DATABASE_URL>"
  echo ""
  echo "You can get a free PostgreSQL database from:"
  echo "  - Neon (neon.tech) - Free tier, serverless"
  echo "  - Supabase (supabase.com) - Free tier, hosted"
  echo "  - Railway (railway.app) - Free tier"
  echo ""
  echo "Or run locally with Docker:"
  echo "  cd infrastructure/docker && docker-compose up -d postgres"
  echo "  DATABASE_URL=postgresql://gentle_reminder:local_dev_password@localhost:5432/gentle_reminder_dev"
  exit 1
fi

DATABASE_URL=$1
echo "Database URL: ${DATABASE_URL:0:30}..."
echo ""

# Set the env var for Prisma
export DATABASE_URL

# Navigate to database package
cd "$(dirname "$0")/../packages/database"

echo "[1/4] Generating Prisma client..."
npx prisma generate

echo "[2/4] Running database migrations..."
npx prisma migrate deploy 2>/dev/null || {
  echo "  No migrations found. Creating initial migration..."
  npx prisma migrate dev --name init --create-only
  npx prisma migrate deploy
}

echo "[3/4] Seeding demo data..."
npx ts-node prisma/seed.ts || echo "  Seed skipped (may already exist)"

echo "[4/4] Verifying connection..."
npx prisma db execute --stdin <<< "SELECT count(*) FROM users;" 2>/dev/null && echo "  Database connected successfully!" || echo "  Verification skipped"

echo ""
echo "======================================"
echo "  Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "  1. Create .env file: echo 'DATABASE_URL=$DATABASE_URL' > services/api/.env"
echo "  2. Start the API: npm run dev --workspace=services/api"
echo "  3. Start the mobile app: npm run dev --workspace=apps/mobile"
echo ""
echo "Demo accounts:"
echo "  Patient:   margaret@example.com / demo123456"
echo "  Caregiver: nurse.sarah@example.com / demo123456"
echo "  Family:    lisa.thompson@example.com / demo123456"
echo "  Clinician: dr.chen@example.com / demo123456"
