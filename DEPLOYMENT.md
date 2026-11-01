# Deploy RigReady AI to Vercel

The repository includes the React website and its existing Express API. The
software guide, search, and category filters work without an AI key.

1. Import this GitHub repository into Vercel as a new project.
2. Select the branch containing the website. Use the repository root as the Root
   Directory and Node.js 24.x as the Node.js version.
3. Leave the framework preset as Other. `vercel.json` supplies the installation
   command, build command, output directory, API routing, and client-side routing.
4. Deploy, then open the URL Vercel provides. Check the Software guide: it should
   contain 35 apps and the Communication category, with OBS Studio in PC utilities.
   The header's Operating systems link opens a separate page with official downloads
   and a Linux installation guide.
5. Check `/api/healthz`. It should return `status: "ok"`; `aiConfigured` indicates
   whether an AI key is present.

AI upgrade plans remain disabled until `OPENAI_API_KEY` is configured in Vercel's
environment settings. Keep it server-side, without a `VITE_` prefix. Replit
Secrets do not automatically transfer to Vercel. Software-guide use does not
require this setting. No database is needed by the currently implemented routes.

## Local checks

Use Node.js 24.x. From the repository root:

```sh
npx --yes pnpm@10.34.9 install --frozen-lockfile
PORT=5173 BASE_PATH=/ npx --yes pnpm@10.34.9 --filter @workspace/rigready-ai run build
```

The deployment entry point is `api/index.ts`, which exports the existing Express
application without starting a separate listening process. API requests are
routed to that function; other application routes load the React application.

Local checks validate the build and exported handler. They do not establish that
a Vercel deployment has been published or that AI-provider requests work.
