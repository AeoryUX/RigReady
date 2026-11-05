import { isCountry, partCategories, type PartCategory } from '@workspace/shop-bot';

type Shop = { name: string; searchUrl: string; parameter: string };
export type RetailerSearch = { name: string; url: string; market: string; international: boolean };

// Official search pages only. Country selection chooses a marketplace; it does
// not establish delivery, stock, seller reliability, or hardware compatibility.
const amazonMarkets: Record<string, string> = {
  AE: 'amazon.ae', AU: 'amazon.com.au', BE: 'amazon.com.be', BR: 'amazon.com.br',
  CA: 'amazon.ca', DE: 'amazon.de', EG: 'amazon.eg', ES: 'amazon.es', FR: 'amazon.fr',
  GB: 'amazon.co.uk', IE: 'amazon.ie', IN: 'amazon.in', IT: 'amazon.it', JP: 'amazon.co.jp',
  MX: 'amazon.com.mx', NL: 'amazon.nl', PL: 'amazon.pl', SA: 'amazon.sa', SE: 'amazon.se',
  SG: 'amazon.sg', TR: 'amazon.com.tr', US: 'amazon.com', ZA: 'amazon.co.za',
};
const ebayMarkets: Record<string, string> = {
  AT: 'ebay.at', AU: 'ebay.com.au', BE: 'ebay.be', CA: 'ebay.ca', CH: 'ebay.ch',
  DE: 'ebay.de', ES: 'ebay.es', FR: 'ebay.fr', GB: 'ebay.co.uk', IE: 'ebay.ie',
  IT: 'ebay.it', NL: 'ebay.nl', PL: 'ebay.pl', US: 'ebay.com',
};
const otherShops: Record<string, Shop[]> = {
  US: [
    { name: 'Best Buy', searchUrl: 'https://www.bestbuy.com/site/searchpage.jsp', parameter: 'st' },
    { name: 'B&H', searchUrl: 'https://www.bhphotovideo.com/c/search?N=0&InitialSearch=yes&sts=ma', parameter: 'Ntt' },
    { name: 'Micro Center', searchUrl: 'https://www.microcenter.com/search/search_results.aspx', parameter: 'Ntt' },
    { name: 'Newegg', searchUrl: 'https://www.newegg.com/p/pl', parameter: 'd' },
  ],
  CA: [
    { name: 'Best Buy', searchUrl: 'https://www.bestbuy.ca/en-ca/search', parameter: 'search' },
    { name: 'Newegg', searchUrl: 'https://www.newegg.ca/p/pl', parameter: 'd' },
  ],
  GB: [
    { name: 'Scan', searchUrl: 'https://www.scan.co.uk/search', parameter: 'q' },
  ],
  NZ: [{ name: 'PB Tech', searchUrl: 'https://www.pbtech.co.nz/search', parameter: 'sf' }],
  AE: [{ name: 'Noon', searchUrl: 'https://www.noon.com/uae-en/search/', parameter: 'q' }],
  EG: [{ name: 'Noon', searchUrl: 'https://www.noon.com/egypt-en/search/', parameter: 'q' }],
  SA: [{ name: 'Noon', searchUrl: 'https://www.noon.com/saudi-en/search/', parameter: 'q' }],
};

export function retailerSearches(country: string, category: PartCategory, model: string): RetailerSearch[] {
  if (!isCountry(country)) return [];
  const part = partCategories.find((part) => part.value === category);
  if (!part) return [];
  const searchText = `${part.query} ${model.trim().slice(0, 120)}`.trim();
  function link(shop: Shop, international = false): RetailerSearch {
    const url = new URL(shop.searchUrl);
    url.searchParams.set(shop.parameter, searchText);
    return { name: shop.name, url: url.href, market: international ? 'International · US marketplace' : country, international };
  }
  const shops: RetailerSearch[] = [];
  if (amazonMarkets[country]) shops.push(link({ name: 'Amazon', searchUrl: `https://www.${amazonMarkets[country]}/s`, parameter: 'k' }));
  const ebay = ebayMarkets[country];
  shops.push(link({ name: 'eBay', searchUrl: `https://www.${ebay ?? 'ebay.com'}/sch/i.html`, parameter: '_nkw' }, !ebay));
  shops.push(...(otherShops[country] ?? []).map((shop) => link(shop)));
  return shops.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
}
