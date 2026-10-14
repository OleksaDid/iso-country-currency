const test = require('node:test');
const assert = require('node:assert');
const lib = require('..');

test('getAllInfoByISO returns full data by alpha-2 or alpha-3 code', () => {
  const be = {
    iso: 'BE',
    alpha3: 'BEL',
    countryName: 'Belgium',
    currency: 'EUR',
    symbol: '€',
    numericCode: 978,
    minorUnits: 2,
    flag: '🇧🇪',
    dateFormat: 'd/MM/yyyy',
  };
  assert.deepStrictEqual(lib.getAllInfoByISO('be'), be);
  assert.deepStrictEqual(lib.getAllInfoByISO(' BEL '), be);
  assert.strictEqual(lib.getAllInfoByISO('JP').minorUnits, 0);
  assert.strictEqual(lib.getAllInfoByISO('BH').minorUnits, 3);
});

test('returned objects can not mutate the data', () => {
  lib.getAllInfoByISO('BE').currency = 'XXX';
  lib.getAllISOCodes()[0].currency = 'XXX';
  assert.strictEqual(lib.getParamByISO('BE', 'currency'), 'EUR');
  assert.strictEqual(lib.getAllISOCodes()[0].currency, 'EUR');
});

test('every entry is complete', () => {
  const all = lib.getAllISOCodes();
  assert.strictEqual(all.length, 249);
  for (const c of all) {
    assert.match(c.iso, /^[A-Z]{2}$/);
    assert.match(c.alpha3, /^[A-Z]{3}$/);
    assert.match(c.currency, /^[A-Z]{3}$/);
    assert.strictEqual(typeof c.numericCode, 'number', c.iso);
    assert.strictEqual(typeof c.minorUnits, 'number', c.iso);
    assert.strictEqual(c.countryName, c.countryName.trim(), c.iso);
  }
});

test('not found returns undefined or empty array instead of throwing', () => {
  assert.strictEqual(lib.getAllInfoByISO('ZZ'), undefined);
  assert.strictEqual(lib.getAllInfoByISO(undefined), undefined);
  assert.strictEqual(lib.getParamByISO('ZZ', 'currency'), undefined);
  assert.strictEqual(lib.getISOByParam('countryName', 'Atlantis'), undefined);
  assert.strictEqual(lib.getParamByParam('countryName', 'Atlantis', 'currency'), undefined);
  assert.deepStrictEqual(lib.getAllISOByCurrencyOrSymbol('currency', 'XXX'), []);
  assert.deepStrictEqual(lib.getAllCountriesByCurrencyOrSymbol('currency', 'XXX'), []);
  assert.strictEqual(lib.getLocalizedSymbol('ZZ'), undefined);
  assert.strictEqual(lib.formatCurrency(1, 'ZZ'), undefined);
});

test('invalid params still throw', () => {
  assert.throws(() => lib.getParamByISO('BE', 'foo'), TypeError);
  assert.throws(() => lib.getAllISOByCurrencyOrSymbol('countryName', 'Belgium'), TypeError);
});

test('country name lookups are case/accent-insensitive and support former names', () => {
  assert.strictEqual(lib.getISOByParam('countryName', 'belgium'), 'BE');
  assert.strictEqual(lib.getISOByParam('countryName', 'Curacao'), 'CW');
  assert.strictEqual(lib.getISOByParam('countryName', 'Curaçao'), 'CW');
  assert.strictEqual(lib.getISOByParam('countryName', 'Macedonia'), 'MK');
  assert.strictEqual(lib.getISOByParam('countryName', 'Turkey'), 'TR');
  assert.strictEqual(lib.getISOByParam('countryName', 'Cote d’Ivoire'), 'CI');
  assert.strictEqual(lib.getParamByISO('MK', 'countryName'), 'North Macedonia');
});

test('lookups', () => {
  assert.strictEqual(lib.getParamByParam('countryName', 'Belgium', 'currency'), 'EUR');
  assert.strictEqual(lib.getParamByISO('UA', 'numericCode'), 980);
  assert.strictEqual(lib.getISOByParam('alpha3', 'ukr'), 'UA');
  assert.ok(lib.getAllISOByCurrencyOrSymbol('currency', 'eur').includes('BG'));
  assert.deepStrictEqual(lib.getAllISOByCurrencyOrSymbol('currency', 'XCG'), ['CW', 'SX']);
});

test('locale-aware helpers', () => {
  assert.strictEqual(lib.getLocalizedSymbol('AU'), '$');
  assert.strictEqual(lib.getLocalizedSymbol('AU', 'en-US'), 'A$');
  assert.strictEqual(lib.getLocalizedSymbol('UA'), '₴');
  assert.strictEqual(lib.getLocalizedCountryName('DE'), 'Deutschland');
  assert.strictEqual(lib.getLocalizedCountryName('DE', 'fr'), 'Allemagne');
  assert.strictEqual(lib.formatCurrency(1234.5, 'US'), '$1,234.50');
  assert.strictEqual(lib.formatCurrency(1234.5, 'JP', 'en-US'), '¥1,235');
  assert.match(lib.formatCurrency(1.5, 'BH', 'en-US'), /^BHD\s1\.500$/);
});
