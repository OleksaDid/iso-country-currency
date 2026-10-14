import { countries, minorUnits } from './data';

export interface Currency {
  /**
   * @description ISO 3166-1 alpha-2 country code
   * @example 'UA'
   */
  iso: string;

  /**
   * @description ISO 3166-1 alpha-3 country code
   * @example 'UKR'
   */
  alpha3: string;

  /**
   * @description Country name in English
   * @example 'Ukraine'
   */
  countryName: string;

  /**
   * @description ISO 4217 currency code
   * @example 'UAH'
   */
  currency: string;

  /**
   * @description Currency symbol, if there is any. Otherwise the ISO 4217 currency code.
   * Use {@link getLocalizedSymbol} to get the symbol as it's displayed in a specific locale.
   * @example '₴'
   */
  symbol: string;

  /**
   * @description ISO 4217 currency numeric code
   * @example 980
   * @see {@link https://en.wikipedia.org/wiki/ISO_4217}
   */
  numericCode: number;

  /**
   * @description Number of digits after the decimal separator according to ISO 4217
   * @example 2 for 'USD', 0 for 'JPY', 3 for 'BHD'
   * @see {@link https://en.wikipedia.org/wiki/ISO_4217#Minor_unit_fractions}
   */
  minorUnits: number;

  /**
   * @description Country flag emoji
   * @example '🇺🇦'
   */
  flag: string;

  /**
   * @description Date format, if there is any special for this country
   * @example 'dd.MM.yyyy'
   * @deprecated Use `Intl.DateTimeFormat` with the country locale instead. Will be removed in 2.0.
   */
  dateFormat?: string;
}

export type CurrencySymbol = 'currency' | 'symbol';
export type SearchParam = CurrencySymbol | 'countryName' | 'alpha3' | 'numericCode' | 'minorUnits' | 'dateFormat';

const searchParams: SearchParam[] = ['currency', 'symbol', 'countryName', 'alpha3', 'numericCode', 'minorUnits', 'dateFormat'];
const currencyAndSymbol: CurrencySymbol[] = ['currency', 'symbol'];

const all: Currency[] = Object.keys(countries).map((iso) => {
  const { alpha3, countryName, currency, symbol, numericCode, dateFormat } = countries[iso];

  return {
    iso,
    alpha3,
    countryName,
    currency,
    symbol,
    numericCode,
    minorUnits: minorUnits[currency],
    flag: String.fromCodePoint(...[...iso].map((c) => 0x1f1a5 + c.charCodeAt(0))),
    dateFormat,
  };
});

const byAlpha2 = new Map(all.map((c) => [c.iso, c]));
const byAlpha3 = new Map(all.map((c) => [c.alpha3, c]));

function normalizeName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’`]/g, "'")
    .trim()
    .toLowerCase();
}

const namesByIso = new Map(
  all.map((c) => [c.iso, [c.countryName, ...(countries[c.iso].formerNames || [])].map(normalizeName)]),
);

function checkParam<T extends string>(param: T, allowed: readonly T[]): void {
  if (!allowed.includes(param)) {
    throw new TypeError(`Invalid search param: ${param}. Expected one of: ${allowed.join(', ')}`);
  }
}

function find(code: string): Currency | undefined {
  if (typeof code !== 'string') {
    return undefined;
  }
  const upper = code.trim().toUpperCase();

  return upper.length === 3 ? byAlpha3.get(upper) : byAlpha2.get(upper);
}

function matches(c: Currency, param: SearchParam, value: unknown): boolean {
  if (param === 'countryName') {
    return typeof value === 'string' && namesByIso.get(c.iso)!.includes(normalizeName(value));
  }
  if ((param === 'currency' || param === 'alpha3') && typeof value === 'string') {
    return c[param] === value.trim().toUpperCase();
  }

  return c[param] === value;
}

function filterBy(param: SearchParam, value: unknown): Currency[] {
  return all.filter((c) => matches(c, param, value));
}

function countryLocale(iso: string): string | undefined {
  try {
    return `${new Intl.Locale('und', { region: iso }).maximize().language}-${iso}`;
  } catch {
    return undefined;
  }
}

/**
 * Returns all countries and their currency data
 */
export function getAllISOCodes(): Currency[] {
  return all.map((c) => ({ ...c }));
}

/**
 * Returns country and currency data by ISO 3166-1 alpha-2 or alpha-3 code (case-insensitive)
 * @example getAllInfoByISO('BE') // { iso: 'BE', alpha3: 'BEL', countryName: 'Belgium', currency: 'EUR', ... }
 */
export function getAllInfoByISO(code: string): Currency | undefined {
  const c = find(code);

  return c && { ...c };
}

/**
 * Returns a single param value by ISO 3166-1 alpha-2 or alpha-3 code
 * @example getParamByISO('BE', 'symbol') // '€'
 */
export function getParamByISO<P extends SearchParam>(code: string, param: P): Currency[P] | undefined {
  checkParam(param, searchParams);

  return find(code)?.[param];
}

/**
 * Returns the first ISO 3166-1 alpha-2 code that has the given param value.
 * Country names are matched case- and accent-insensitively, former names are supported.
 * @example getISOByParam('countryName', 'Belgium') // 'BE'
 */
export function getISOByParam<P extends SearchParam>(param: P, value: Currency[P]): string | undefined {
  checkParam(param, searchParams);

  return all.find((c) => matches(c, param, value))?.iso;
}

/**
 * Returns the search param value of the first country that has the given param value
 * @example getParamByParam('countryName', 'Belgium', 'currency') // 'EUR'
 */
export function getParamByParam<G extends SearchParam, S extends SearchParam>(
  givenParam: G,
  givenParamValue: Currency[G],
  searchParam: S,
): Currency[S] | undefined {
  checkParam(givenParam, searchParams);
  checkParam(searchParam, searchParams);

  return all.find((c) => matches(c, givenParam, givenParamValue))?.[searchParam];
}

/**
 * Returns names of all countries that use the given currency or symbol
 * @example getAllCountriesByCurrencyOrSymbol('currency', 'EUR') // ['Andorra', 'Austria', ...]
 */
export function getAllCountriesByCurrencyOrSymbol(param: CurrencySymbol, value: string): string[] {
  checkParam(param, currencyAndSymbol);

  return filterBy(param, value).map((c) => c.countryName);
}

/**
 * Returns ISO 3166-1 alpha-2 codes of all countries that use the given currency or symbol
 * @example getAllISOByCurrencyOrSymbol('currency', 'EUR') // ['AD', 'AT', ...]
 */
export function getAllISOByCurrencyOrSymbol(param: CurrencySymbol, value: string): string[] {
  checkParam(param, currencyAndSymbol);

  return filterBy(param, value).map((c) => c.iso);
}

/**
 * Returns the country name in the given locale. Defaults to the country's own main language.
 * @example getLocalizedCountryName('DE') // 'Deutschland'
 * @example getLocalizedCountryName('DE', 'fr') // 'Allemagne'
 */
export function getLocalizedCountryName(code: string, locale?: string): string | undefined {
  const c = find(code);
  const lang = locale || (c && countryLocale(c.iso));

  if (!c || !lang) {
    return undefined;
  }

  return new Intl.DisplayNames([lang], { type: 'region' }).of(c.iso);
}

/**
 * Returns the currency symbol as it's displayed in the given locale. Defaults to the country's own locale.
 * @example getLocalizedSymbol('AU') // '$'
 * @example getLocalizedSymbol('AU', 'en-US') // 'A$'
 */
export function getLocalizedSymbol(code: string, locale?: string): string | undefined {
  const c = find(code);
  const lang = locale || (c && countryLocale(c.iso));

  if (!c || !lang) {
    return undefined;
  }

  return new Intl.NumberFormat(lang, { style: 'currency', currency: c.currency })
    .formatToParts(1)
    .find((part) => part.type === 'currency')!.value;
}

/**
 * Formats an amount in the country's currency. Defaults to the country's own locale.
 * @example formatCurrency(1234.5, 'BE') // '€ 1.234,50'
 * @example formatCurrency(1234.5, 'JP', 'en-US') // '¥1,235'
 */
export function formatCurrency(amount: number, code: string, locale?: string): string | undefined {
  const c = find(code);
  const lang = locale || (c && countryLocale(c.iso));

  if (!c || !lang) {
    return undefined;
  }

  return new Intl.NumberFormat(lang, {
    style: 'currency',
    currency: c.currency,
    minimumFractionDigits: c.minorUnits,
    maximumFractionDigits: c.minorUnits,
  }).format(amount);
}
