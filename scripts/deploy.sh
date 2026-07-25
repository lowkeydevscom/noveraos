#!/usr/bin/env bash
# Added by Antigravity

set -e

echo "🚀 Deploying NoveraOS to Production via Vercel..."

if [ -z "$VERCEL_TOKEN" ]; then
  echo "⚠️ Warning: VERCEL_TOKEN is not set in environment. Vercel CLI will rely on local session authentication."
fi

npx vercel --prod --token="${VERCEL_TOKEN}"

echo "✅ NoveraOS deployment complete."
