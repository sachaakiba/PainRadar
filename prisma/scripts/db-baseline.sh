#!/usr/bin/env bash
# One-time baseline for a database created with `prisma db push` (no _prisma_migrations table).
# Marks the migrations that are already reflected in the schema as applied, so that
# `prisma migrate deploy` only runs the migrations added afterwards.
# Usage: DATABASE_URL=... DIRECT_URL=... bash scripts/db-baseline.sh
set -euo pipefail

: "${DATABASE_URL:?DATABASE_URL must be set}"
: "${DIRECT_URL:?DIRECT_URL must be set}"

BASELINED=(
  20250315000000_add_plan_managed_manually
  20250315010000_add_user_role_enum
  20250604120000_add_generation_started_at
)

for migration in "${BASELINED[@]}"; do
  npx prisma migrate resolve --applied "$migration"
done

npx prisma migrate deploy
