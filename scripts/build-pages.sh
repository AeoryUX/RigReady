#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Set PAGES_BASE_PATH=/ for a custom domain or a user/organization Pages site.
PORT=5173 BASE_PATH="${PAGES_BASE_PATH:-/RigReady/}" VITE_STATIC_PREVIEW=true \
  npx --yes pnpm@10.34.9 --filter @workspace/rigready-ai run build
preview_output=artifacts/rigready-ai/dist/public
touch "$preview_output/.nojekyll"
# Real HTML files let GitHub Pages serve this route on direct visits and refreshes.
while IFS='|' read -r preview_route preview_title; do
  mkdir -p "$preview_output/$preview_route"
  sed "s#<title>RigReady AI</title>#<title>$preview_title | RigReady AI</title>#" \
    "$preview_output/index.html" > "$preview_output/$preview_route/index.html"
done <<'PAGES'
hardware|Hardware advisor
software|Software guide
operating-systems|Operating systems
PAGES
