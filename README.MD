## Installation
`npm install iso-country-currency`

## Usage
Import package where you want and start using 

### getAllInfoByISO(iso) 
Returns an object with properties 'countryName', 'currency' and 'symbol' 

`getAllInfoByISO('BE')`
```
{
    countryName: "Belgium",
    currency: "EUR",
    symbol: "€"
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