# GitHub Pages preview

This preview shows the RigReady website, editable PC form, and searchable
35-app software guide, plus an Operating systems page with official downloads,
Linux recommendations, and installation guidance. GitHub Pages serves static files: AI plans are explicitly
disabled and the preview does not send PC details to an API.

From the repository root, using Node.js 24.x:

```sh
npx --yes pnpm@10.34.9 install --frozen-lockfile
bash scripts/build-pages.sh
```

The output is `artifacts/rigready-ai/dist/public`. The default base path is
`/RigReady/`, matching this repository. Override `PAGES_BASE_PATH` if deploying
under another path.

The header's Operating systems link opens `/RigReady/operating-systems/`.
The build script creates an HTML entry point for that directory so direct
visits, shared links, and browser refreshes work on GitHub Pages.

Publish the contents of that output directory, plus an empty `.nojekyll` file,
to a `gh-pages` branch. In the repository's Settings → Pages, select deployment
from the `gh-pages` branch's root. The repository must be eligible for Pages
under the user's GitHub plan. Follow GitHub's URL and deployment status; a local
build does not mean a site has been published.

Ordinary builds without `VITE_STATIC_PREVIEW=true` retain the existing AI API
behavior for hosts that support the backend. A server and provider configuration
are required to generate AI upgrade plans.
