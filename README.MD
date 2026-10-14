## Installation
`npm install iso-country-currency`

## Usage
Import package where you want and start using 

## Updates
v0.8.0
- Bulgarian currency changed to Euro, thanks [ivkoandrv](https://github.com/ivkoandrv)
- Curacao and Sint Maarten currency changed to Caribbean guilder (XCG), thanks [ivkoandrv](https://github.com/ivkoandrv)
- Updated currencies retired from ISO 4217: Sierra Leone (SLE), Sao Tome and Principe (STN), Venezuela (VES), Zimbabwe (ZWG)
- `numericCode` is now actually returned by `getAllISOCodes()` and `getAllInfoByISO()`
- Added `minorUnits` – number of decimal digits of the currency according to ISO 4217 (e.g. 2 for USD, 0 for JPY, 3 for BHD)
- `getParamByISO()`, `getISOByParam()` and `getParamByParam()` support `numericCode`, `minorUnits` and `dateFormat`
- Removed trailing space from "Bonaire, Saint Eustatius and Saba"
- Data is checked weekly against the [official ISO 4217 list](https://www.six-group.com/en/products-services/financial-information/data-standards.html)

v0.7.0
- Croatian currency changed to Euro, thanks [em-anas](https://github.com/em-anas)
- Added currency numeric code, thanks [Mrugesh Vaghela](https://github.com/mrugesh-jeeves)
- Added JSDoc comment to TS types
- Changed 'AU$' to '$' for Australia
- Changed 'Rs' to '₹' for India  
- Changed 'TL' to '₺' for Turkey
- Fixed `for` loops   

v0.6.0
- Added dateFormat to some countries

## Documentation

### getAllISOCodes()
Returns an array of all ISO codes and according data

`getAllISOCodes()`
```
{
    iso: "BE" 
    countryName: "Belgium",
    currency: "EUR",
    symbol: "€",
    dateFormat: "d/MM/yyyy",
    numericCode: 978,
    minorUnits: 2
}
```

### getAllInfoByISO(iso) 
Returns an object with properties 'iso', 'countryName', 'currency', 'symbol', 'dateFormat', 'numericCode' and 'minorUnits'

`getAllInfoByISO('BE')`
```
{
    iso: "BE"
    countryName: "Belgium",
    currency: "EUR",
    symbol: "€",
    dateFormat: "d/MM/yyyy",
    numericCode: 978,
    minorUnits: 2
}
```
### getParamByISO(iso, param) 
Returns param value for given ISO2

`getParamByISO('BE', 'symbol')`

`€`

### getISOByParam(param, value)
Returns ISO2 code by given param value

`getISOByParam('countryName', 'Belgium')`

`BE`

### getParamByParam(givenParam, givenParamValue, searchParam)
Returns search param value by given param value

`getParamByParam('countryName', 'Belgium', 'currency')`

`EUR`

### getAllCountriesByCurrencyOrSymbol(param, value)
Returns array with all countries, that contain given param ('currency', 'symbol') with given value

`getAllCountriesByCurrencyOrSymbol('currency', 'EUR')`

`["Belgium", "Saint Barthelemy", "Reunion", "Greece", ...]`


### getAllISOByCurrencyOrSymbol(param, value)
Returns array with all ISO2 codes, that contain given param ('currency', 'symbol') with given value

`getAllISOByCurrencyOrSymbol('currency', 'EUR')`

`["BE", "BL", "RE", "GR", ...]`
