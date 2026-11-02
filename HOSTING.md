# Hosting RigReady and its shop bot

Visitors open https://aeoryux.github.io/RigReady/ in their browser. GitHub Pages
already hosts the website. The homepage opens the welcome screen, and the
Hardware advisor opens the shop search. Visitors choose their own country;
the site does not request GPS access or use IP geolocation.

The bot runs on Cloudflare Workers. Its code is in `artifacts/shop-bot`; its
search and filtering code is in `lib/shop-bot`. Nothing needs to run on the
owner's PC. The Worker queries Google Shopping through SerpApi, filters obvious
category mismatches, and returns shop listings. No AI provider is used.

The implementation is prepared, but live searches require a deployed Worker
and a shop-data account. `public/shop-bot.json` deliberately has no endpoint
until those are connected; the public site displays an honest unavailable state.

## Set up the bot through the browser

1. Create or sign in to a [Cloudflare account](https://dash.cloudflare.com/).
   In Workers & Pages, create a Worker by importing the GitHub repository
   `AeoryUX/RigReady`. Select the **website-preview** branch, which contains the
   website and bot source. The `main` branch currently contains only the license.
2. Use the Worker name **rigready-shop-bot**, matching `wrangler.jsonc`. Set the
   root directory to **artifacts/shop-bot**. Use Node.js 24 (`NODE_VERSION=24` if
   the build settings require an environment variable).
3. The build command is
   `npx --yes pnpm@10.34.9 --dir ../.. install --frozen-lockfile`.
   The deploy command is `npx --yes wrangler@4.156.0 deploy`.
   Cloudflare runs these commands on its servers.
4. Create a [SerpApi account](https://serpapi.com/) for its Google Shopping API.
   Review the provider's current search allowance and pricing, and configure
   usage limits before enabling searches. Shop-data charges are separate from
   Cloudflare hosting. This does not use an OpenAI key or ChatGPT subscription.
5. In the Worker's Settings → Variables and Secrets, add **SHOP_DATA_API_KEY**
   as a **secret**, using the SerpApi key. Keep the key out of GitHub, website
   files, browser configuration, and chat. Redeploy if Cloudflare requests it.
6. Open the Worker's `/health` URL. It returns `shopSearchConfigured: true`
   when the secret and rate-limit binding are present. This indicates
   configuration; perform a real search to verify provider access and coverage.
7. Put the public Worker origin into
   `artifacts/rigready-ai/public/shop-bot.json`, for example:

   ```json
   { "endpoint": "https://rigready-shop-bot.YOUR-SUBDOMAIN.workers.dev" }
   ```

   This address is public and contains no secret. Rebuild and publish GitHub
   Pages using the existing `scripts/build-pages.sh` workflow. An alternative
   is setting `VITE_SHOP_BOT_URL` to the same origin when building the website.
8. Test from the Hardware advisor: choose a country, part type, optional model,
   and optional maximum item price, then open a returned listing. Repeat for a
   second country to verify that the market changes.

## What the first version does

- Queries one country selected by the visitor. Country coverage and shipping
  depend on the data provider and retailers; selecting a country does not
  establish that every returned seller delivers there.
- Shows retailer names, listing prices, delivery text when supplied, source
  attribution, and the time results were retrieved. Some listing links lead to
  a Google Shopping product page rather than directly to the retailer.
- Filters by maximum item price only when a matching currency and numeric price
  are available. It does not convert currencies or calculate shipping and taxes.
  The budget filter is disabled for countries without a maintained currency map.
- Sorts matching-currency offers by price, with foreign-currency and unpriced
  offers after them. Name A–Z sorting is also available.
- Uses category/title filters to remove obvious accessories and complete PCs.
  Compatibility and performance ranking still need a reviewed product-spec and
  benchmark dataset. Check the exact model, condition, fit, and checkout total.
- Keeps the old AI upgrade endpoint retired with HTTP 410. The legacy health
  response retains `aiConfigured: false` for older clients.

## Operating limits

The Worker accepts browser requests from `https://aeoryux.github.io`, uses a
Cloudflare rate-limit binding, and caches normalized public search results for
up to ten minutes. It fails closed when the key or rate limiter is absent. It
does not fetch arbitrary URLs submitted by visitors or expose provider errors
and credentials in responses.

Cloudflare's rate counters are per location and approximate, not a billing cap.
CORS controls browsers, not all automated clients. Use the data provider's
account-level usage controls to manage search spending. Change `ALLOWED_ORIGIN`
if moving the website to a custom domain. Keep rate-limit namespace `77301`
unique within the Cloudflare account.

## Verification in a development/cloud workspace

```sh
npx --yes pnpm@10.34.9 install --frozen-lockfile
npx --yes pnpm@10.34.9 --filter @workspace/shop-bot run test
npx --yes pnpm@10.34.9 --filter @workspace/shop-bot run typecheck
npx --yes pnpm@10.34.9 run typecheck
bash scripts/build-pages.sh
npx --yes wrangler@4.156.0 deploy --dry-run --config artifacts/shop-bot/wrangler.jsonc
```

Tests use synthetic provider responses. Build/type checks and a Worker dry run
do not establish that a live bot has been deployed or a shop-data account is
active. Verify both after adding the account and secret.
