## Installation
`npm install iso-country-currency`

## Usage
Import package where you want and start using 

## Updates
Now has TS support!

v0.7.0
- Croatian currency changed to Euro, thanks [em-anas](https://github.com/em-anas)
- Added currency numeric code, thanks [Mrugesh Vaghela](https://github.com/mrugesh-jeeves)
- Added JSDoc comment to TS types  

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
    dateFormat: "d/MM/yyyy"
}
```

### getAllInfoByISO(iso) 
Returns an object with properties 'countryName', 'currency', 'symbol' and 'dateFormat' 

`getAllInfoByISO('BE')`
```
{
    iso: "BE"
    countryName: "Belgium",
    currency: "EUR",
    symbol: "€",
    dateFormat: "d/MM/yyyy"
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
