const test = require('node:test');
const assert = require('node:assert');
const lib = require('..');

test('getAllInfoByISO returns numericCode and minorUnits', () => {
  assert.deepStrictEqual(lib.getAllInfoByISO('be'), {
    iso: 'BE',
    currency: 'EUR',
    symbol: '€',
    countryName: 'Belgium',
    dateFormat: 'd/MM/yyyy',
    numericCode: 978,
    minorUnits: 2,
  });
  assert.strictEqual(lib.getAllInfoByISO('JP').minorUnits, 0);
  assert.strictEqual(lib.getAllInfoByISO('BH').minorUnits, 3);
});

test('getAllISOCodes includes numericCode and minorUnits for every entry', () => {
  for (const c of lib.getAllISOCodes()) {
    assert.strictEqual(typeof c.numericCode, 'number', c.iso);
    assert.strictEqual(typeof c.minorUnits, 'number', c.iso);
    assert.strictEqual(c.countryName, c.countryName.trim(), c.iso);
  }
});

test('currency changeovers', () => {
  assert.strictEqual(lib.getParamByISO('BG', 'currency'), 'EUR');
  assert.strictEqual(lib.getParamByISO('CW', 'currency'), 'XCG');
  assert.strictEqual(lib.getParamByISO('SX', 'currency'), 'XCG');
  assert.strictEqual(lib.getParamByISO('SL', 'currency'), 'SLE');
  assert.strictEqual(lib.getParamByISO('ST', 'currency'), 'STN');
  assert.strictEqual(lib.getParamByISO('VE', 'currency'), 'VES');
  assert.strictEqual(lib.getParamByISO('ZW', 'currency'), 'ZWG');
});

test('lookups', () => {
  assert.strictEqual(lib.getISOByParam('countryName', 'Belgium'), 'BE');
  assert.strictEqual(lib.getParamByParam('countryName', 'Belgium', 'currency'), 'EUR');
  assert.strictEqual(lib.getParamByISO('UA', 'numericCode'), 980);
  assert.ok(lib.getAllISOByCurrencyOrSymbol('currency', 'EUR').includes('BG'));
  assert.ok(lib.getAllCountriesByCurrencyOrSymbol('currency', 'EUR').includes('Bulgaria'));
});

test('errors', () => {
  assert.throws(() => lib.getAllInfoByISO('ZZ'), /ISO2 code wasn't found/);
  assert.throws(() => lib.getParamByISO('BE', 'foo'), /Invalid search param/);
  assert.throws(() => lib.getAllISOByCurrencyOrSymbol('currency', 'XXX'), /XXX wasn't found in currency/);
});
