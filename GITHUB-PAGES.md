# RigReady on GitHub Pages

The homepage welcomes visitors and links to the Hardware advisor, Software guide,
and Operating systems pages. They include the PC specs guide, country-based shop
search, searchable 50-app software guide, and 20 Linux recommendations with
download and installation guidance. GitHub Pages serves the website's static
files; optional live price comparisons run on a separate Cloudflare Worker.

The Hardware advisor's country-based retailer links work without an API key.
They open official search pages for Amazon, eBay, Newegg, Best Buy, B&H,
Micro Center, Scan, PB Tech, and Noon in the markets listed in the catalog.
International alternatives are labelled separately. Each link opens one shop
with the selected part and model text; prices, stock, and filters are handled on
that shop's website. No affiliate identifiers or automatic multi-tab opener
are used for these links.

Optional live price comparison through the bot is not connected until `artifacts/rigready-ai/public/shop-bot.json`
contains its deployed HTTPS origin (or `VITE_SHOP_BOT_URL` is set at build time).
The default configuration offers retailer links and sends no search to a
live-data provider. See [HOSTING.md](HOSTING.md) for setup entirely through cloud services.

The Software guide's checklist preserves selection order and provides a native
Open next link, an optional bulk opener, and individual links. Browsers can block
multiple tabs from one bulk click; the next-link flow uses one explicit click per site. Selections stay in page
memory only; there is no installation-status tracking. Hardware advisor includes
a manual Windows/Linux/macOS specs guide. The OS page includes a Linux gaming
guide and an external ProtonDB button; compatibility reports are not fetched or
scored by this site.

The OS page has three main tabs: Windows 11, Linux, and macOS. Windows 11 and
macOS show their official download guidance. Inside Linux, four tabs organize
Distributions, Desktop environments, Window managers, and Shells. Linux
recommendations offer A–Z and Z–A sorting.
Direct Linux section links select the matching main tab and Linux category before
scrolling, including after a browser refresh.
Linux distributions are grouped under New to Linux, Gaming, Older PCs, and
Advanced, with dividers and alphabetical sorting within each group. A distribution
can appear in more than one use-case group. The other tabs have separate catalogs
and alphabetical sorting; all project links lead
to official project pages or documentation.

The desktop catalog includes 11 desktop environments, 29 compositors/window
managers, and 21 shells or related interface projects. Cards distinguish Wayland,
X11, integrated desktop components, shells, toolkits, panels, and desktop setups.
Compatibility notes identify compositor requirements and limited Linux support.
Source-review notes and project moves are recorded in
[DESKTOP-CATALOG-SOURCES.md](DESKTOP-CATALOG-SOURCES.md). Upstream identity checks
are not a security audit or a guarantee about third-party installers.

Software cards show Windows, Linux, and macOS support badges. Linux desktop,
window-manager, and shell cards show only Fully supported on Linux or
Semi-supported on Linux. Semi-supported entries need a particular distribution,
compositor, desktop session, or package setup explained on the card. These badges
do not describe game compatibility.

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

The old AI upgrade-plan endpoint is retired. The website's shop bot uses a
product-data provider, category and currency filters, and hosted request limits;
it does not use an AI provider. Country selection is explicit and coverage
depends on the product-data service and retailers. Software and OS guides work
independently of the bot connection.

Each software card has an Installation section with Windows, Linux, and macOS
choices. Linux methods cover DEB, RPM, and pacman/AUR where listed. Developer
guides, distro repositories, and community packages are labelled separately.
Unlisted package methods and unsupported native platforms are marked explicitly.
Installation resources are links and instructions; the website runs no installer.

The footer links to Privacy & storage and Terms pages. The privacy notice describes
local theme storage, in-memory checklists, fonts, hosting, and conditional shop
search data. There is no fabricated contact address, consent banner for optional
tracking that is not configured, checkout/refund process, mailing list, age gate,
or account-deletion form. These notices describe current behavior and are not a
legal-compliance certification. Icon licence notices are in THIRD_PARTY_NOTICES.md.
