export interface Currency {
  /**
   * @description Two-symbol country ISO code
   * @example 'UA'
   */
  iso: string;

  /**
   * @description Full country name
   * @example 'Ukraine'
   */
  countryName: string;

  /**
   * @description Three-symbol currency ISO code
   * @example 'UAH'
   */
  currency: string;

  /**
   * @description Currency symbol, if there is any. Otherwise stores currency ISO code
   * @example '₴'
   */
  symbol: string;

  /**
   * @description Date format, if there is any special for this country
   * @example 'dd.MM.yyyy'
   */
  dateFormat?: string;

  /**
   * @description Currency numeric code according to ISO 4217
   * @example 980
   * @see {@link https://en.wikipedia.org/wiki/ISO_4217}
   */
  numericCode?: number;
}

type CurrencySymbol = 'symbol' | 'currency';
type SearchParam = CurrencySymbol | 'countryName';

export function getAllISOCodes(): Currency[];
export function getAllInfoByISO(iso: string): Currency;
export function getParamByISO(iso: string, param: SearchParam): string;
export function getISOByParam(param: SearchParam, value: string): string;
export function getParamByParam(givenParam: SearchParam, givenParamValue: string, searchParam: string): string;
export function getAllCountriesByCurrencyOrSymbol(param: CurrencySymbol, value: string): string[];
export function getAllISOByCurrencyOrSymbol(param: CurrencySymbol, value: string): string[];
