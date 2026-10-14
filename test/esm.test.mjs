import test from 'node:test';
import assert from 'node:assert';
import { getAllInfoByISO, getLocalizedSymbol } from 'iso-country-currency';

test('ESM entry works', () => {
  assert.strictEqual(getAllInfoByISO('UA').currency, 'UAH');
  assert.strictEqual(getLocalizedSymbol('AU', 'en-US'), 'A$');
});
