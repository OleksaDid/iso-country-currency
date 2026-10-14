# iso-country-currency

[![npm](https://img.shields.io/npm/v/iso-country-currency)](https://www.npmjs.com/package/iso-country-currency)
[![downloads](https://img.shields.io/npm/dm/iso-country-currency)](https://www.npmjs.com/package/iso-country-currency)
[![CI](https://github.com/OleksaDid/iso-country-currency/actions/workflows/ci.yml/badge.svg)](https://github.com/OleksaDid/iso-country-currency/actions/workflows/ci.yml)

All 249 countries and territories (ISO 3166-1) with their currency (ISO 4217): code, symbol, numeric code, minor units, flag, and locale-aware formatting.

- Zero dependencies, ~8 kB gzipped, works in Node.js 18+ and all modern browsers
- ESM and CommonJS, TypeScript types included
- **Always up to date**: the data is checked weekly against the [official ISO 4217 list](https://www.six-group.com/en/products-services/financial-information/data-standards.html) and ISO 3166-1, so currency changeovers (like Bulgaria adopting the Euro) are picked up quickly

## Installation
`npm install iso-country-currency`

## Usage
```js
import { getAllInfoByISO, getLocalizedSymbol, formatCurrency } from 'iso-country-currency';
// or: const { getAllInfoByISO } = require('iso-country-currency');

getAllInfoByISO('BE');
// {
//   iso: 'BE',
//   alpha3: 'BEL',
//   countryName: 'Belgium',
//   currency: 'EUR',
//   symbol: '€',
//   numericCode: 978,
//   minorUnits: 2,
//   flag: '🇧🇪',
//   dateFormat: 'd/MM/yyyy'
// }

getLocalizedSymbol('AU');            // '$'   – as Australians see it
getLocalizedSymbol('AU', 'en-US');   // 'A$'  – as Americans see it
formatCurrency(1234.5, 'BE');        // '€ 1.234,50'
formatCurrency(1234.5, 'JP', 'en');  // '¥1,235'
```

## Documentation
All functions accept ISO 3166-1 alpha-2 (`'BE'`) or alpha-3 (`'BEL'`) codes, case-insensitive.
When nothing is found they return `undefined` (or an empty array) – they only throw on an invalid param name.

### getAllISOCodes()
Returns an array with data for all countries.

### getAllInfoByISO(code)
Returns all data for the country (see example above).

### getParamByISO(code, param)
Returns a single value. `param` is one of `countryName`, `alpha3`, `currency`, `symbol`, `numericCode`, `minorUnits`, `dateFormat`.

`getParamByISO('BE', 'symbol')` → `'€'`

### getISOByParam(param, value)
Returns the alpha-2 code of the first country with the given value.
Country names are matched case- and accent-insensitively and former names are supported (`'Macedonia'`, `'Turkey'`, `'Swaziland'`…).

`getISOByParam('countryName', 'Belgium')` → `'BE'`

### getParamByParam(givenParam, givenParamValue, searchParam)
`getParamByParam('countryName', 'Belgium', 'currency')` → `'EUR'`

### getAllCountriesByCurrencyOrSymbol(param, value)
`getAllCountriesByCurrencyOrSymbol('currency', 'EUR')` → `['Andorra', 'Austria', 'Belgium', ...]`

### getAllISOByCurrencyOrSymbol(param, value)
`getAllISOByCurrencyOrSymbol('currency', 'EUR')` → `['AD', 'AT', 'BE', ...]`

### getLocalizedCountryName(code, locale?)
Country name in the given locale, defaults to the country's own main language. Uses `Intl.DisplayNames`.

`getLocalizedCountryName('DE')` → `'Deutschland'`, `getLocalizedCountryName('DE', 'fr')` → `'Allemagne'`

### getLocalizedSymbol(code, locale?)
Currency symbol as displayed in the given locale, defaults to the country's own locale. Uses `Intl.NumberFormat`.

### formatCurrency(amount, code, locale?)
Formats the amount in the country's currency with the correct number of decimals, defaults to the country's own locale.

## Migrating from 0.x to 1.0
- **Functions no longer throw when nothing is found.** They return `undefined`, or `[]` for `getAllCountriesByCurrencyOrSymbol` / `getAllISOByCurrencyOrSymbol`. Replace `try/catch` with a check for `undefined`. Invalid param names still throw a `TypeError`.
- **Some country names were updated** to their current ISO 3166 short names: Czechia, North Macedonia, Eswatini, Türkiye, Timor-Leste, Cabo Verde, Côte d'Ivoire, Palestine, Cocos (Keeling) Islands, and names now use diacritics (Åland Islands, Curaçao, Réunion, Saint Barthélemy, São Tomé and Príncipe). Lookups by the old names keep working.
- **`dateFormat` is deprecated** and will be removed in 2.0 – use `Intl.DateTimeFormat` instead.
- New fields: `alpha3`, `flag`. New functions: `getLocalizedCountryName`, `getLocalizedSymbol`, `formatCurrency`.
- Requires Node.js 18+.

## Changelog
v1.0.0
- See [Migrating from 0.x to 1.0](#migrating-from-0x-to-10). Returning `undefined` instead of throwing was suggested by [publicvirtualvoid](https://github.com/publicvirtualvoid) and [rbaraffe](https://github.com/rbaraffe)

v0.8.0
- Bulgarian currency changed to Euro, thanks [ivkoandrv](https://github.com/ivkoandrv)
- Curacao and Sint Maarten currency changed to Caribbean guilder (XCG), thanks [ivkoandrv](https://github.com/ivkoandrv)
- Updated currencies retired from ISO 4217: Sierra Leone (SLE), Sao Tome and Principe (STN), Venezuela (VES), Zimbabwe (ZWG)
- `numericCode` is now actually returned by `getAllISOCodes()` and `getAllInfoByISO()`
- Added `minorUnits` – number of decimal digits of the currency according to ISO 4217
- Removed trailing space from "Bonaire, Saint Eustatius and Saba"

v0.7.0
- Croatian currency changed to Euro, thanks [em-anas](https://github.com/em-anas)
- Added currency numeric code, thanks [Mrugesh Vaghela](https://github.com/mrugesh-jeeves)

## Support
This package is maintained in my free time. If your company relies on it, please consider supporting it via [GitHub Sponsors](https://github.com/sponsors/OleksaDid) or [thanks.dev](https://thanks.dev/u/gh/oleksadid) ❤️

## License
ISC
