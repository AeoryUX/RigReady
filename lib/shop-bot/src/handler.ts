import {
  countryCurrency, isCountry, isShopSearchResult, partCategories, safeListingUrl,
  type ShopListing, type ShopSearchInput, type ShopSearchResult,
} from './contracts.ts';

export type ShopBotEnv = {
  ALLOWED_ORIGIN: string;
  SHOP_DATA_API_KEY?: string;
  SEARCH_RATE_LIMITER?: { limit(input: { key: string }): Promise<{ success: boolean }> };
};
type SearchCache = Pick<Cache, 'match' | 'put'>;
type Services = { fetch?: typeof fetch; now?: () => Date; cache?: SearchCache };
type CachedSearch = Omit<ShopSearchResult, 'provider'>;
const ttl = 600;

class SearchError extends Error {
  status: number;
  constructor(status: number, message: string) { super(message); this.status = status; }
}

function json(data: unknown, status: number, origin?: string): Response {
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff', Vary: 'Origin',
  });
  if (origin) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (status === 429) headers.set('Retry-After', '60');
  return new Response(JSON.stringify(data), { status, headers });
}

async function readInput(request: Request): Promise<ShopSearchInput> {
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    throw new SearchError(415, 'Send the search as JSON.');
  }
  const reader = request.body?.getReader();
  if (!reader) throw new SearchError(400, 'Choose a country and part type.');
  const decoder = new TextDecoder();
  let size = 0; let body = '';
  for (;;) {
    const chunk = await reader.read();
    if (chunk.done) break;
    size += chunk.value.byteLength;
    if (size > 4096) { await reader.cancel(); throw new SearchError(413, 'The search is too long.'); }
    body += decoder.decode(chunk.value, { stream: true });
  }
  body += decoder.decode();
  let value: Record<string, unknown>;
  try { value = JSON.parse(body); } catch { throw new SearchError(400, 'The search could not be read.'); }
  if (!value || typeof value !== 'object' || Array.isArray(value)
    || Object.keys(value).some((key) => !['country', 'category', 'query', 'maxPrice'].includes(key))
    || !isCountry(value.country) || !partCategories.some((part) => part.value === value.category)
    || typeof value.query !== 'string' || value.query.length > 120 || /[\u0000-\u001f\u007f]/.test(value.query)
    || (value.maxPrice !== null && (typeof value.maxPrice !== 'number' || !Number.isFinite(value.maxPrice) || value.maxPrice < 1 || value.maxPrice > 1000000))) {
    throw new SearchError(400, 'Choose a country and part type, and enter a valid maximum price or leave it blank.');
  }
  if (value.maxPrice !== null && !countryCurrency(value.country)) {
    throw new SearchError(400, 'The price filter is not available for this country. Leave the maximum price blank.');
  }
  return { country: value.country, category: value.category as ShopSearchInput['category'], query: value.query.trim().replace(/\s+/g, ' '), maxPrice: value.maxPrice as number | null };
}

function text(value: unknown, length: number): string | null {
  return typeof value === 'string' && value.trim() ? value.trim().slice(0, length) : null;
}

function listingCurrency(price: string, expected: string | null): string | null {
  const explicit = price.match(/(?:^|[^A-Z])(USD|CAD|AUD|NZD|SGD|HKD|MXN|EUR|GBP|SAR|AED|QAR|KWD|BHD|OMR|EGP|JOD|MAD|SEK|NOK|DKK|CHF|PLN|CZK|HUF|RON|TRY|UAH|RSD|ISK|ILS|ZAR|INR|PKR|BDT|LKR|JPY|KRW|CNY|MYR|IDR|PHP|THB|VND|TWD|BRL|ARS|CLP|COP|PEN)(?=$|[^A-Z])/i);
  if (explicit) return explicit[1].toUpperCase();
  const prefixes: [RegExp, string][] = [[/US\$/i, 'USD'], [/CA\$/i, 'CAD'], [/AU?\$/i, 'AUD'], [/NZ\$/i, 'NZD'], [/HK\$/i, 'HKD'], [/S\$/, 'SGD'], [/R\$/, 'BRL'], [/MX\$/i, 'MXN']];
  for (const [pattern, currency] of prefixes) if (pattern.test(price)) return currency;
  if (price.includes('€')) return 'EUR';
  if (price.includes('£')) return 'GBP';
  if (price.includes('₹')) return 'INR';
  if (price.includes('₩')) return 'KRW';
  if (price.includes('₺')) return 'TRY';
  if (price.includes('₫')) return 'VND';
  if (price.includes('₱')) return 'PHP';
  if (price.includes('₪')) return 'ILS';
  if (price.includes('฿')) return 'THB';
  if (price.includes('৳')) return 'BDT';
  if (price.includes('₴')) return 'UAH';
  if (/zł/i.test(price)) return 'PLN';
  if (/Kč/i.test(price)) return 'CZK';
  if (/\bFt\b/.test(price)) return 'HUF';
  if (/\bRM\s?\d/.test(price)) return 'MYR';
  if (/\bRp\s?\d/.test(price)) return 'IDR';
  if (expected === 'RON' && /\blei\b/i.test(price)) return 'RON';
  if (expected === 'ZAR' && /^R\s?\d/.test(price)) return 'ZAR';
  if (expected && ['PKR', 'INR', 'LKR'].includes(expected) && /\bRs[.\s]?\d/.test(price)) return expected;
  if (price.includes('ر.س')) return 'SAR';
  if (price.includes('د.إ')) return 'AED';
  if (expected && price.includes('$') && ['USD', 'CAD', 'AUD', 'NZD', 'SGD', 'HKD', 'MXN', 'ARS', 'CLP', 'COP', 'TWD'].includes(expected)) return expected;
  if (expected && /[¥￥]/.test(price) && ['JPY', 'CNY'].includes(expected)) return expected;
  if (expected && /\bkr\b/i.test(price) && ['SEK', 'NOK', 'DKK', 'ISK'].includes(expected)) return expected;
  return null;
}

function matchesCategory(title: string, category: ShopSearchInput['category']): boolean {
  // Title filters remove obvious mismatches; they do not verify specifications or fit.
  if (/\b(laptop|notebook|prebuilt|mini pc|gaming pc|desktop computer|phone case|iphone|ipad)\b/i.test(title)) return false;
  const patterns = {
    gpu: /\b(RTX|GTX|GeForce|Radeon|graphics card|Arc[ -]?[AB]\d|RX[ -]?\d)/i,
    cpu: /\b(Ryzen|Core[ -]?(Ultra|i[3579])|Celeron|Pentium|Xeon|Threadripper|processor|CPU)\b/i,
    memory: /\b(RAM|DDR[345]|DIMM)\b/i,
    storage: /\b(SSD|NVMe|solid.state|M\.2|hard drive|hard disk|HDD)\b/i,
    motherboard: /\b(motherboard|mainboard)\b/i,
    psu: /\b(power supply|PSU|\d{3,4}\s?W)\b/i,
    cooling: /\b(cooler|heatsink|liquid cooling|AIO|case fan)\b/i,
    case: /\b(case|chassis)\b/i,
  };
  if (!patterns[category].test(title)) return false;
  if (category === 'gpu' && /\b(bracket|replacement fan|waterblock|water block|thermal pad|support stand)\b/i.test(title)) return false;
  if (category === 'cpu' && /\b(cooler|heatsink|fan|thermal|mounting)\b/i.test(title)) return false;
  if (category === 'memory' && /\b(so[ -]?dimm|adapter|heatspreader)\b/i.test(title)) return false;
  if (category === 'storage' && /\b(enclosure|adapter|external)\b/i.test(title)) return false;
  if (category === 'psu' && /\b(replacement cable|cable kit|extension cable|tester)\b/i.test(title)) return false;
  return true;
}

function normalize(raw: unknown, input: ShopSearchInput): ShopListing[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>(); const listings: ShopListing[] = [];
  const expected = countryCurrency(input.country);
  for (const item of raw.slice(0, 100)) {
    if (!item || typeof item !== 'object') continue;
    const title = text(item.title, 220); const merchant = text(item.source, 100);
    const url = safeListingUrl(item.link) ?? safeListingUrl(item.product_link);
    if (!title || !merchant || !url || !matchesCategory(title, input.category)) continue;
    const key = `${merchant.toLowerCase()}|${url}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const priceText = text(item.price, 100) ?? 'Price not provided';
    const currency = listingCurrency(priceText, expected);
    const price = typeof item.extracted_price === 'number' && Number.isFinite(item.extracted_price) && item.extracted_price > 0 ? item.extracted_price : null;
    listings.push({ title, merchant, url, priceText, currency, price, delivery: text(item.delivery, 200) });
    if (listings.length === 30) break;
  }
  return listings;
}

async function cacheKey(request: Request, input: ShopSearchInput): Promise<Request> {
  const query = JSON.stringify([input.country, input.category, input.query.toLowerCase()]);
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(query));
  const id = Array.from(new Uint8Array(hash), (value) => value.toString(16).padStart(2, '0')).join('');
  return new Request(`${new URL(request.url).origin}/cached-search/${id}`);
}

export async function handleShopRequest(request: Request, env: ShopBotEnv, services: Services = {}): Promise<Response> {
  const origin = request.headers.get('origin');
  const allowed = origin !== null && origin === env.ALLOWED_ORIGIN;
  const path = new URL(request.url).pathname;
  if (request.method === 'GET' && path === '/health') {
    return json({ status: 'ok', shopSearchConfigured: Boolean(env.SHOP_DATA_API_KEY && env.SEARCH_RATE_LIMITER) }, 200, allowed ? origin : undefined);
  }
  if (!allowed) return json({ error: 'This search endpoint is available through RigReady.' }, 403);
  if (path !== '/search') return json({ error: 'Endpoint not found.' }, 404, origin);
  if (request.method === 'OPTIONS') {
    const headers = json({}, 200, origin).headers;
    headers.set('Access-Control-Max-Age', '86400');
    return new Response(null, { status: 204, headers });
  }
  if (request.method !== 'POST') return json({ error: 'Use POST to search.' }, 405, origin);
  try {
    const input = await readInput(request);
    if (!env.SHOP_DATA_API_KEY || !env.SEARCH_RATE_LIMITER) {
      throw new SearchError(503, 'Shop search is not connected yet. Please try again later.');
    }
    const ip = request.headers.get('CF-Connecting-IP');
    if (!ip) throw new SearchError(503, 'The search gateway is not available. Please try again later.');
    if (!(await env.SEARCH_RATE_LIMITER.limit({ key: `visitor:${ip}` })).success) {
      throw new SearchError(429, 'Too many searches. Please wait a minute and try again.');
    }
    const now = services.now?.() ?? new Date();
    const key = await cacheKey(request, input);
    let data: CachedSearch | undefined;
    try {
      const hit = await services.cache?.match(key);
      if (hit) {
        const candidate = await hit.json() as CachedSearch;
        const age = now.getTime() - Date.parse(candidate.retrievedAt);
        if (age >= 0 && age < ttl * 1000 && candidate.country === input.country
          && candidate.currency === countryCurrency(input.country)
          && isShopSearchResult({ ...candidate, provider: 'Google Shopping via SerpApi' })) data = candidate;
      }
    } catch { /* A cache miss must not turn into a failed search. */ }
    if (!data) {
      if (!(await env.SEARCH_RATE_LIMITER.limit({ key: 'shared-provider-search' })).success) {
        throw new SearchError(429, 'Shop searches are busy. Please wait a minute and try again.');
      }
      const category = partCategories.find((part) => part.value === input.category)!;
      const url = new URL('https://serpapi.com/search.json');
      url.search = new URLSearchParams({ engine: 'google_shopping', q: `${category.query} ${input.query}`.trim(), gl: input.country.toLowerCase(), hl: 'en', api_key: env.SHOP_DATA_API_KEY }).toString();
      const upstream = await (services.fetch ?? fetch)(url, { signal: AbortSignal.timeout(12000), redirect: 'error' });
      if (!upstream.ok) throw new SearchError(502, 'The shop-data service is unavailable. Please try again later.');
      const body = await upstream.json() as { error?: unknown; shopping_results?: unknown; search_information?: { shopping_results_state?: unknown } };
      if (!body || typeof body !== 'object' || body.error) throw new SearchError(502, 'The shop-data service could not complete this search. Please try again later.');
      if (!Array.isArray(body.shopping_results) && body.search_information?.shopping_results_state !== 'Fully empty') {
        throw new SearchError(502, 'The shop-data service returned an unexpected response. Please try again later.');
      }
      data = { listings: normalize(body.shopping_results, input), country: input.country, currency: countryCurrency(input.country), retrievedAt: now.toISOString() };
      try { await services.cache?.put(key, new Response(JSON.stringify(data), { headers: { 'Cache-Control': `public, max-age=${ttl}`, 'Content-Type': 'application/json' } })); } catch { /* Caching is optional. */ }
    }
    const result: ShopSearchResult = {
      ...data, provider: 'Google Shopping via SerpApi',
      listings: input.maxPrice === null ? data.listings : data.listings.filter((item) => item.currency === data.currency && item.price !== null && item.price <= input.maxPrice!),
    };
    return json(result, 200, origin);
  } catch (error) {
    // Provider errors/URLs may contain a credential; never return or log them.
    if (error instanceof SearchError) return json({ error: error.message }, error.status, origin);
    return json({ error: 'The search could not finish. Please try again in a moment.' }, 502, origin);
  }
}
