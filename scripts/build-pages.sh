#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Set PAGES_BASE_PATH=/ for a custom domain or a user/organization Pages site.
PORT=5173 BASE_PATH="${PAGES_BASE_PATH:-/RigReady/}" VITE_STATIC_PREVIEW=true \
  npx --yes pnpm@10.34.9 --filter @workspace/rigready-ai run build
touch artifacts/rigready-ai/dist/public/.nojekyll
