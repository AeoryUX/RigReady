export const partCategories = [
  { value: 'gpu', label: 'Graphics card', query: 'desktop graphics card' },
  { value: 'cpu', label: 'Processor', query: 'desktop processor CPU' },
  { value: 'memory', label: 'Memory', query: 'desktop RAM memory kit' },
  { value: 'storage', label: 'Storage', query: 'internal SSD drive' },
  { value: 'motherboard', label: 'Motherboard', query: 'desktop motherboard' },
  { value: 'psu', label: 'Power supply', query: 'desktop PC power supply' },
  { value: 'cooling', label: 'Cooling', query: 'desktop CPU cooler' },
  { value: 'case', label: 'Case', query: 'desktop PC case' },
] as const;
export type PartCategory = typeof partCategories[number]['value'];

// ISO country codes. Country selection is explicit: no GPS or IP-location lookup.
export const countryCodes = ('AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW').split(' ');
const countries = new Set(countryCodes);
export function isCountry(value: unknown): value is string {
  return typeof value === 'string' && countries.has(value);
}

// Used for the optional budget filter, never for currency conversion. Other
// countries can still search; their listings keep the provider's price text.
const marketCurrencies: Record<string, string> = {
  US: 'USD', GB: 'GBP', CA: 'CAD', AU: 'AUD', NZ: 'NZD', SA: 'SAR', AE: 'AED',
  QA: 'QAR', KW: 'KWD', BH: 'BHD', OM: 'OMR', EG: 'EGP', JO: 'JOD', MA: 'MAD',
  DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR', BE: 'EUR', AT: 'EUR',
  IE: 'EUR', PT: 'EUR', FI: 'EUR', GR: 'EUR', HR: 'EUR', SK: 'EUR', SI: 'EUR',
  EE: 'EUR', LV: 'EUR', LT: 'EUR', LU: 'EUR', MT: 'EUR', CY: 'EUR', BG: 'EUR',
  SE: 'SEK', NO: 'NOK', DK: 'DKK', CH: 'CHF', PL: 'PLN', CZ: 'CZK', HU: 'HUF',
  RO: 'RON', TR: 'TRY', UA: 'UAH', RS: 'RSD', IS: 'ISK', IL: 'ILS', ZA: 'ZAR',
  IN: 'INR', PK: 'PKR', BD: 'BDT', LK: 'LKR', JP: 'JPY', KR: 'KRW', CN: 'CNY',
  SG: 'SGD', MY: 'MYR', ID: 'IDR', PH: 'PHP', TH: 'THB', VN: 'VND', TW: 'TWD',
  HK: 'HKD', BR: 'BRL', MX: 'MXN', AR: 'ARS', CL: 'CLP', CO: 'COP', PE: 'PEN',
};
export function countryCurrency(country: string): string | null {
  return marketCurrencies[country] ?? null;
}

export type ShopSearchInput = { country: string; category: PartCategory; query: string; maxPrice: number | null };
export type ShopListing = {
  title: string;
  merchant: string;
  url: string;
  priceText: string;
  price: number | null;
  currency: string | null;
  delivery: string | null;
};
export type ShopSearchResult = {
  listings: ShopListing[];
  country: string;
  currency: string | null;
  retrievedAt: string;
  provider: 'Google Shopping via SerpApi';
};

export function safeListingUrl(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > 4096) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

export function isShopSearchResult(value: unknown): value is ShopSearchResult {
  if (!value || typeof value !== 'object') return false;
  const result = value as Partial<ShopSearchResult>;
  return result.provider === 'Google Shopping via SerpApi' && isCountry(result.country)
    && typeof result.retrievedAt === 'string' && Number.isFinite(Date.parse(result.retrievedAt))
    && (result.currency === null || (typeof result.currency === 'string' && /^[A-Z]{3}$/.test(result.currency)))
    && Array.isArray(result.listings) && result.listings.length <= 30
    && result.listings.every((item) => item && typeof item.title === 'string' && typeof item.merchant === 'string'
      && safeListingUrl(item.url) !== null && typeof item.priceText === 'string'
      && (item.price === null || (typeof item.price === 'number' && Number.isFinite(item.price) && item.price > 0))
      && (item.currency === null || (typeof item.currency === 'string' && /^[A-Z]{3}$/.test(item.currency)))
      && (item.delivery === null || typeof item.delivery === 'string'));
}
