export interface Currency {
  iso: string,
  countryName: string,
  currency: string,
  symbol: string
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
