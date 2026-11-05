import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ExternalLink, Globe, Info, Search } from 'lucide-react';
import { countryCodes, countryCurrency, isShopSearchResult, partCategories, type PartCategory, type ShopSearchResult } from '@workspace/shop-bot';
import { retailerSearches } from '@/data/retailer-search';

const names = new Intl.DisplayNames(['en'], { type: 'region' });
const countries = countryCodes.map((code) => ({ code, name: names.of(code) ?? code })).sort((a, b) => a.name.localeCompare(b.name));
function endpointUrl(value: unknown): string {
  if (typeof value !== 'string') return '';
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password && url.pathname === '/' && !url.search && !url.hash ? url.origin : '';
  } catch { return ''; }
}

export function ShopSearch() {
  const [endpoint, setEndpoint] = useState(() => endpointUrl(import.meta.env.VITE_SHOP_BOT_URL));
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState<PartCategory>('gpu');
  const [query, setQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('price-asc');
  const [result, setResult] = useState<ShopSearchResult | null>(null);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);
  const activeRequest = useRef<AbortController | null>(null);
  const currency = countryCurrency(country);
  const shopLinks = retailerSearches(country, category, query);
  const hasLocalShops = shopLinks.some((shop) => !shop.international);

  useEffect(() => {
    if (endpointUrl(import.meta.env.VITE_SHOP_BOT_URL)) return;
    const controller = new AbortController();
    fetch(`${import.meta.env.BASE_URL}shop-bot.json`, { signal: controller.signal, cache: 'no-cache' })
      .then(async (response) => response.ok ? response.json() : null)
      .then((config) => { if (!controller.signal.aborted) setEndpoint(endpointUrl(config?.endpoint)); })
      .catch(() => { /* An unconnected bot leaves the guides and form available. */ });
    return () => controller.abort();
  }, []);
  useEffect(() => () => { const request = activeRequest.current; activeRequest.current = null; request?.abort(); }, []);

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (!endpoint) return;
    if (!country) { setError('Choose the country you live in.'); return; }
    const budget = maxPrice.trim() ? Number(maxPrice) : null;
    if (budget !== null && (!Number.isFinite(budget) || budget < 1 || budget > 1000000 || !currency)) {
      setError('Enter a maximum price between 1 and 1,000,000, or leave it blank.'); return;
    }
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 18000);
    setSearching(true); setResult(null);
    try {
      const response = await fetch(`${endpoint}/search`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
        body: JSON.stringify({ country, category, query: query.trim(), maxPrice: budget }),
      });
      const data: unknown = await response.json();
      if (!response.ok) {
        const message = data && typeof data === 'object' && 'error' in data && typeof data.error === 'string' ? data.error.slice(0, 250) : 'Shop search is unavailable. Please try again later.';
        throw new Error(message);
      }
      if (!isShopSearchResult(data) || data.country !== country || data.currency !== countryCurrency(country)) throw new Error('The shop results could not be read. Please try again.');
      setResult({ ...data, listings: budget === null ? data.listings : data.listings.filter((listing) => listing.currency === data.currency && listing.price !== null && listing.price <= budget) });
    } catch (error) {
      if (activeRequest.current === controller) setError(controller.signal.aborted ? 'The search took too long. Please try again.' : error instanceof Error ? error.message : 'The search could not finish. Please try again.');
    } finally {
      window.clearTimeout(timeout);
      if (activeRequest.current === controller) { setSearching(false); activeRequest.current = null; }
    }
  }

  const listings = [...(result?.listings ?? [])].sort((a, b) => {
    if (!result?.currency || sort === 'name-asc') return a.title.localeCompare(b.title);
    const aPrice = a.currency === result?.currency ? a.price : null;
    const bPrice = b.currency === result?.currency ? b.price : null;
    if (aPrice === null && bPrice === null) return a.title.localeCompare(b.title);
    if (aPrice === null) return 1;
    if (bPrice === null) return -1;
    return sort === 'price-desc' ? bPrice - aPrice : aPrice - bPrice;
  });

  return (
    <section className="shop-search" aria-labelledby="shop-search-title">
      <div className="os-section-heading">
        <div><h2 id="shop-search-title">Search popular shops for your next part.</h2><p>Choose your country and part, then open a shop’s search page. Check the exact model’s specifications against your PC.</p></div>
      </div>
      {!endpoint && <div className="os-callout"><Info size={18} aria-hidden="true" /><p>Shop searches open on the retailer’s website, where you can check prices, stock, and price filters. Live price comparisons inside RigReady are not connected.</p></div>}
      <form onSubmit={search} noValidate>
        <fieldset className="shop-search-fields" disabled={searching}>
          <div className="field"><label htmlFor="shop-country"><Globe size={14} aria-hidden="true" />Country you live in</label><select id="shop-country" className="control" value={country} onChange={(event) => { setCountry(event.target.value); setMaxPrice(''); setResult(null); setError(''); }}><option value="">Choose your country</option>{countries.map((option) => <option value={option.code} key={option.code}>{option.name}</option>)}</select></div>
          <div className="field"><label htmlFor="shop-category">Part type</label><select id="shop-category" className="control" value={category} onChange={(event) => { setCategory(event.target.value as PartCategory); setResult(null); }}>{partCategories.map((part) => <option value={part.value} key={part.value}>{part.label}</option>)}</select></div>
          <div className="field"><label htmlFor="shop-query">Part or model <span className="field-hint">optional</span></label><input id="shop-query" className="control" value={query} onChange={(event) => setQuery(event.target.value)} maxLength={120} placeholder="e.g. RTX 5060 Ti 16GB" /></div>
          {endpoint && <div className="field"><label htmlFor="shop-budget">Maximum item price{currency ? ` (${currency})` : ''} <span className="field-hint">optional · live listings only</span></label><input id="shop-budget" className="control" type="number" min="1" max="1000000" step="any" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} disabled={!currency} placeholder={currency ? 'Leave blank to compare all returned prices' : 'Choose a country first'} /></div>}
        </fieldset>
        {endpoint && country && !currency && <p className="guide-intro">For this country, compare the currency and price shown by each shop. The numeric budget filter is not available.</p>}
        <p className="shop-search-help">Country is selected by you. Retailer coverage and delivery vary by country. Check shipping, taxes, condition, and the final total with the seller.</p>
        <p className="shop-search-help">Opening a shop link sends the part-search text to that retailer. Enter product names only. {endpoint && 'Comparing live listings also sends these fields to the hosted bot, and the country and part-search text to its shopping-data provider. '}<a className="os-link" href={`${import.meta.env.BASE_URL}privacy/`}>Privacy details</a></p>
        {error && <div className="form-alert" role="alert">{error}</div>}
        {endpoint && <button className="guide-primary-button" type="submit" disabled={searching}><Search size={16} aria-hidden="true" />{searching ? 'Searching shops…' : 'Compare live listings'}</button>}
      </form>
      <section className="retailer-searches" aria-labelledby="retailer-searches-title">
        <h3 id="retailer-searches-title">{country ? `Shop searches for ${names.of(country)}` : 'Choose your country to see shops'}</h3>
        {country ? <>
          <p className="shop-search-help">{hasLocalShops ? 'Country-specific shops and marketplaces are listed below. International options are labelled separately.' : 'No country-specific shops are listed here yet. The international option below uses a US marketplace; delivery and import charges vary.'} These links open search results; they do not confirm stock, delivery, compatibility, or the lowest price.</p>
          {endpoint && <p className="shop-search-help">The maximum-price filter applies to live listings inside RigReady. Set price filters separately on each retailer’s site.</p>}
          <div className="retailer-search-grid">{shopLinks.map((shop) => <a className="retailer-search-link" key={shop.name} href={shop.url} target="_blank" rel="noopener noreferrer"><span>Search {shop.name}<ExternalLink size={14} aria-hidden="true" /></span><small>{shop.international ? shop.market : `${names.of(shop.market)} storefront`}</small></a>)}</div>
        </> : <p className="shop-search-help">Select the country you live in, then choose a part type or enter a model. Each shop opens from its own link.</p>}
      </section>
      <div aria-live="polite" aria-busy={searching}>
        {searching && <p className="shop-search-help" role="status">Looking for shop listings in {names.of(country)}…</p>}
        {result && <section className="shop-results" aria-labelledby="shop-results-title">
          <div className="os-section-heading"><div><h2 id="shop-results-title">Shop listings for {names.of(result.country)}</h2><p>{listings.length} returned {listings.length === 1 ? 'listing' : 'listings'} · Results retrieved {new Date(result.retrievedAt).toLocaleString()} · {result.provider}</p></div><div className="field"><label htmlFor="shop-sort">Sort returned listings</label><select id="shop-sort" className="control" value={result.currency ? sort : 'name-asc'} onChange={(event) => setSort(event.target.value)}><option value="price-asc" disabled={!result.currency}>Price: low to high</option><option value="price-desc" disabled={!result.currency}>Price: high to low</option><option value="name-asc">Name: A–Z</option></select></div></div>
          <p className="shop-search-help">{result.currency ? `Price sorting compares ${result.currency} offers first. Other currencies and unpriced listings follow.` : 'Prices remain in each shop’s reported currency; compare currencies with the seller.'} Shop prices and stock may change.</p>
          {listings.length === 0 ? <p className="software-empty">No matching listings were returned. Try a different model or a higher maximum price. With a price limit, offers without a confirmed matching currency and numeric price are excluded.</p> : <div className="os-distro-grid">{listings.map((listing) => <article className="os-distro-card shop-listing" key={`${listing.merchant}|${listing.url}`}><span className="software-category">{listing.merchant}</span><h3>{listing.title}</h3><p className="shop-listing-price">{listing.priceText}{listing.currency && <span> {listing.currency}</span>}</p>{listing.delivery && <p className="os-copy">{listing.delivery}</p>}<a className="os-link" href={listing.url} target="_blank" rel="noopener noreferrer">View listing <ExternalLink size={13} aria-hidden="true" /></a></article>)}</div>}
        </section>}
      </div>
    </section>
  );
}
