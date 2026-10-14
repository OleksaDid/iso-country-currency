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
  numericCode: number;

  /**
   * @description Number of digits after the decimal separator according to ISO 4217
   * @example 2 for 'USD', 0 for 'JPY', 3 for 'BHD'
   * @see {@link https://en.wikipedia.org/wiki/ISO_4217#Minor_unit_fractions}
   */
  minorUnits: number;
}

type CurrencySymbol = 'symbol' | 'currency';
type SearchParam = CurrencySymbol | 'countryName' | 'dateFormat' | 'numericCode' | 'minorUnits';

export function getAllISOCodes(): Currency[];
export function getAllInfoByISO(iso: string): Currency;
export function getParamByISO<P extends SearchParam>(iso: string, param: P): Currency[P];
export function getISOByParam<P extends SearchParam>(param: P, value: Currency[P]): string;
export function getParamByParam<G extends SearchParam, S extends SearchParam>(givenParam: G, givenParamValue: Currency[G], searchParam: S): Currency[S];
export function getAllCountriesByCurrencyOrSymbol(param: CurrencySymbol, value: string): string[];
export function getAllISOByCurrencyOrSymbol(param: CurrencySymbol, value: string): string[];
