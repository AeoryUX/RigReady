# GitHub Pages preview

The homepage welcomes visitors and links to the Hardware advisor, Software guide,
and Operating systems pages. They include the editable PC form, searchable
45-app software guide, and nine Linux recommendations with download and
installation guidance. GitHub Pages serves static files: AI plans are explicitly
disabled and the preview does not send PC details to an API.

The Software guide's checklist opens selected official app websites and provides
individual links if the browser blocks multiple tabs. Selections stay in page
memory only; there is no installation-status tracking. Hardware advisor includes
a manual Windows/Linux/macOS specs guide. The OS page includes a Linux gaming
guide and an external ProtonDB button; compatibility reports are not fetched or
scored by this site.

From the repository root, using Node.js 24.x:

```sh
npx --yes pnpm@10.34.9 install --frozen-lockfile
bash scripts/build-pages.sh
```

The output is `artifacts/rigready-ai/dist/public`. The default base path is
`/RigReady/`, matching this repository. Override `PAGES_BASE_PATH` if deploying
under another path.

The header links open `/RigReady/hardware/`, `/RigReady/software/`, and
`/RigReady/operating-systems/`. The build script creates an HTML entry point for
each directory so direct visits, shared links, and browser refreshes work on
GitHub Pages. Older homepage links to `#guides` or `#software-library` redirect
to the Software guide.

Publish the contents of that output directory, plus an empty `.nojekyll` file,
to a `gh-pages` branch. In the repository's Settings → Pages, select deployment
from the `gh-pages` branch's root. The repository must be eligible for Pages
under the user's GitHub plan. Follow GitHub's URL and deployment status; a local
build does not mean a site has been published.

Ordinary builds without `VITE_STATIC_PREVIEW=true` retain the existing AI API
behavior for hosts that support the backend. A server and provider configuration
are required to generate AI upgrade plans.
