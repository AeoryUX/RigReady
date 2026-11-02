# RigReady deployment

The current website is hosted on GitHub Pages at
https://aeoryux.github.io/RigReady/. The shop bot is prepared for Cloudflare
Workers. See [HOSTING.md](HOSTING.md) for browser-based hosting instructions and
the product-data account needed to activate shop searches. The old AI endpoint
is retired and no OpenAI key is required.

## Optional Vercel website hosting

The existing `vercel.json` and `api/index.ts` can still host the website and
legacy health endpoint on Vercel. This is an alternative to GitHub Pages, and
is not required for the recommended Cloudflare bot setup.

1. Import this repository, selecting the `website-preview` branch.
2. Use the repository root, Node.js 24, and framework preset Other.
3. `vercel.json` supplies the build command, output directory, and routes.
4. Set `VITE_SHOP_BOT_URL` to the separately deployed Worker's HTTPS origin, or
   configure the public `shop-bot.json` file. Do not put provider secrets in
   `VITE_` variables or website files.
5. Update the Worker's `ALLOWED_ORIGIN` to the final website origin.

The legacy `/api/healthz` response keeps `aiConfigured: false` for older clients.
The old `/api/pc-advisor/upgrade-plan` route returns HTTP 410. The bot has its
own `/health` and `/search` endpoints, deployed through Cloudflare.
