import test from 'node:test';
import assert from 'node:assert/strict';
import { handleShopRequest } from './handler.ts';
import { countryCodes, isShopSearchResult } from './contracts.ts';

const origin = 'https://aeoryux.github.io';
const baseInput = { country: 'GB', category: 'gpu', query: 'RTX 5060 Ti', maxPrice: null };
function request(input = baseInput, extra = {}) {
  return new Request('https://bot.example/search', { method: 'POST', headers: { origin, 'content-type': 'application/json', 'CF-Connecting-IP': '192.0.2.1', ...extra.headers }, body: JSON.stringify(input) });
}
function env(override = {}) {
  return { ALLOWED_ORIGIN: origin, SHOP_DATA_API_KEY: 'test-only-placeholder', SEARCH_RATE_LIMITER: { limit: async () => ({ success: true }) }, ...override };
}
function listing(title, price, amount, url = 'https://shop.example/item', source = 'Example shop') {
  return { title, price, extracted_price: amount, link: url, source };
}
function provider(items) { return async () => Response.json({ shopping_results: items }); }
const now = () => new Date('2026-11-02T12:00:00Z');

test('country options are unique and do not use a fixed owner country', () => {
  assert.equal(countryCodes.length, 249);
  assert.equal(new Set(countryCodes).size, 249);
  assert.ok(countryCodes.includes('SA') && countryCodes.includes('US') && countryCodes.includes('GB'));
});

test('uses the visitor country and returns sanitized shop listings without exposing a key', async () => {
  let called;
  const response = await handleShopRequest(request({ ...baseInput, country: 'SA' }), env(), { now, fetch: async (url, options) => {
    called = new URL(url);
    assert.equal(options.redirect, 'error');
    return Response.json({ shopping_results: [listing('Radeon RX 9060 XT 16GB graphics card', 'SAR 1,600', 1600)] });
  } });
  assert.equal(response.status, 200);
  assert.equal(called.origin, 'https://serpapi.com');
  assert.equal(called.searchParams.get('gl'), 'sa');
  assert.equal(called.searchParams.get('engine'), 'google_shopping');
  assert.match(called.searchParams.get('q'), /desktop graphics card RTX 5060 Ti/);
  const result = await response.json();
  assert.ok(isShopSearchResult(result));
  assert.equal(result.country, 'SA');
  assert.equal(result.currency, 'SAR');
  assert.equal(result.listings[0].currency, 'SAR');
  assert.equal(result.retrievedAt, now().toISOString());
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), origin);
  assert.ok(!JSON.stringify(result).includes('test-only-placeholder'));
});

test('budget excludes unknown prices and foreign currencies, retaining an exact budget match', async () => {
  const response = await handleShopRequest(request({ ...baseInput, maxPrice: 350 }), env(), { now, fetch: provider([
    listing('RTX 5060 Ti 16GB graphics card', '£350', 350, 'https://shop.example/exact'),
    listing('RTX 5060 Ti 16GB graphics card', '£351', 351, 'https://shop.example/over'),
    listing('RTX 5060 Ti graphics card', 'US$100', 100, 'https://shop.example/foreign'),
    listing('RTX 5060 Ti graphics card', 'Ask for price', undefined, 'https://shop.example/unknown'),
    listing('RTX 5060 Ti graphics card', 'Free', 0, 'https://shop.example/free'),
  ]) });
  const result = await response.json();
  assert.equal(result.listings.length, 1);
  assert.equal(result.listings[0].price, 350);
});

test('removes unsafe links, obvious accessories, duplicates, and complete PCs', async () => {
  const good = listing('RTX 5060 Ti graphics card', '£300', 300);
  const response = await handleShopRequest(request(), env(), { now, fetch: provider([
    good, good,
    listing('RTX 5060 Ti support stand bracket', '£10', 10, 'https://shop.example/bracket'),
    listing('RTX 5060 Ti gaming PC', '£900', 900, 'https://shop.example/prebuilt'),
    listing('RTX 5060 Ti graphics card', '£200', 200, 'javascript:alert(1)'),
    listing('RTX 5060 Ti graphics card', '£200', 200, 'https://user:password@shop.example/private'),
    { title: 'RTX 5060 Ti graphics card', price: '£250', extracted_price: 250, product_link: 'https://www.google.com/shopping/product/123', source: 'Another shop' },
  ]) });
  const result = await response.json();
  assert.equal(result.listings.length, 2);
  assert.ok(isShopSearchResult(result));
});

test('recognizes currency codes without a separating space in budget filters', async () => {
  const response = await handleShopRequest(request({ ...baseInput, country: 'CH', maxPrice: 500 }), env(), { now, fetch: provider([
    listing('RTX 5060 Ti graphics card', 'CHF499.00', 499),
    listing('RTX 5060 Ti graphics card', 'US$100.00', 100, 'https://shop.example/foreign'),
  ]) });
  const result = await response.json();
  assert.equal(result.listings.length, 1);
  assert.equal(result.listings[0].currency, 'CHF');
});

test('normalizes memory and internal-storage results conservatively', async () => {
  for (const [category, valid, invalid] of [
    ['memory', 'Kingston Fury 32GB DDR5 RAM kit', 'Laptop 32GB DDR5 SO-DIMM'],
    ['storage', 'Samsung internal NVMe SSD', 'USB external SSD enclosure'],
  ]) {
    const response = await handleShopRequest(request({ ...baseInput, category }), env(), { now, fetch: provider([listing(valid, '£99', 99), listing(invalid, '£10', 10, 'https://shop.example/accessory')]) });
    assert.deepEqual((await response.json()).listings.map((item) => item.title), [valid]);
  }
});

test('rejects wrong origins, oversized requests, invalid countries, and malformed inputs without spending a search', async () => {
  let calls = 0;
  const services = { fetch: async () => { calls++; throw new Error('must not fetch'); } };
  for (const input of [
    { ...baseInput, country: 'ZZ' }, { ...baseInput, category: 'arbitrary-url' },
    { ...baseInput, maxPrice: -1 }, { ...baseInput, maxPrice: '500' },
    { ...baseInput, query: 'x'.repeat(121) }, { ...baseInput, url: 'https://attacker.example' },
  ]) assert.equal((await handleShopRequest(request(input), env(), services)).status, 400);
  assert.equal((await handleShopRequest(request(baseInput, { headers: { origin: 'https://attacker.example' } }), env(), services)).status, 403);
  assert.equal((await handleShopRequest(request(baseInput, { headers: { 'content-type': 'text/plain' } }), env(), services)).status, 415);
  const huge = new Request('https://bot.example/search', { method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: 'x'.repeat(5000) });
  assert.equal((await handleShopRequest(huge, env(), services)).status, 413);
  assert.equal(calls, 0);
});

test('unconfigured services and rate limits fail closed', async () => {
  let calls = 0;
  const services = { fetch: async () => { calls++; throw new Error('must not fetch'); } };
  assert.equal((await handleShopRequest(request(), env({ SHOP_DATA_API_KEY: undefined }), services)).status, 503);
  assert.equal((await handleShopRequest(request(), env({ SEARCH_RATE_LIMITER: undefined }), services)).status, 503);
  const limited = await handleShopRequest(request(), env({ SEARCH_RATE_LIMITER: { limit: async () => ({ success: false }) } }), services);
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get('Retry-After'), '60');
  const sharedLimit = await handleShopRequest(request(), env({ SEARCH_RATE_LIMITER: { limit: async ({ key }) => ({ success: key !== 'shared-provider-search' }) } }), services);
  assert.equal(sharedLimit.status, 429);
  assert.equal(calls, 0);
});

test('reuses fresh cached searches across price filters and refreshes stale entries', async () => {
  const saved = new Map(); let calls = 0; let current = now();
  const cache = {
    match: async (key) => saved.get(key.url)?.clone(),
    put: async (key, response) => { saved.set(key.url, response.clone()); },
  };
  const services = { cache, now: () => current, fetch: async () => { calls++; return Response.json({ shopping_results: [listing('RTX 5060 Ti graphics card', '£300', 300)] }); } };
  assert.equal((await handleShopRequest(request(), env(), services)).status, 200);
  const filtered = await handleShopRequest(request({ ...baseInput, maxPrice: 100 }), env(), services);
  assert.equal((await filtered.json()).listings.length, 0);
  assert.equal(calls, 1);
  current = new Date(current.getTime() + 601000);
  assert.equal((await handleShopRequest(request(), env(), services)).status, 200);
  assert.equal(calls, 2);
});

test('upstream failures never leak provider URLs or credentials', async () => {
  for (const fetcher of [
    async () => { throw new Error('secret test-only-placeholder https://serpapi.com/search.json?api_key=secret'); },
    async () => Response.json({ error: 'secret test-only-placeholder' }),
    async () => Response.json({ unexpected: 'shape' }),
    async () => new Response('not-json', { status: 500 }),
  ]) {
    const response = await handleShopRequest(request(), env(), { fetch: fetcher });
    assert.equal(response.status, 502);
    const message = await response.text();
    assert.ok(!message.includes('test-only-placeholder') && !message.includes('api_key='));
  }
});

test('health, preflight, and empty results accurately describe readiness', async () => {
  const health = await handleShopRequest(new Request('https://bot.example/health'), env({ SHOP_DATA_API_KEY: undefined }));
  assert.equal((await health.json()).shopSearchConfigured, false);
  const preflight = await handleShopRequest(new Request('https://bot.example/search', { method: 'OPTIONS', headers: { origin } }), env());
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get('Access-Control-Allow-Origin'), origin);
  const result = await handleShopRequest(request(), env(), { now, fetch: provider([]) });
  assert.deepEqual((await result.json()).listings, []);
});
