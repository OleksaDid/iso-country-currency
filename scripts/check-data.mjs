// Compares the bundled data against the official ISO 4217 list published by SIX
// and the ISO 3166-1 list maintained by the Debian iso-codes project.
// Exits with code 1 if anything is out of date.
import { getAllISOCodes } from '../dist/index.mjs';

const ISO_4217_URL = 'https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xml';
const ISO_3166_URL = 'https://salsa.debian.org/iso-codes-team/iso-codes/-/raw/main/data/iso_3166-1.json';
// Not assigned by ISO 3166, but widely used
const USER_ASSIGNED = { XK: 'XKX' };

const [xml, iso3166] = await Promise.all([
  fetch(ISO_4217_URL).then((r) => r.text()),
  fetch(ISO_3166_URL).then((r) => r.json()),
]);

const currencies = {};
for (const [, entry] of xml.matchAll(/<CcyNtry>([\s\S]*?)<\/CcyNtry>/g)) {
  const tag = (name) => (entry.match(new RegExp('<' + name + '( [^>]*)?>([^<]*)<')) || [])[2];
  if (tag('Ccy')) {
    currencies[tag('Ccy')] = { numericCode: Number(tag('CcyNbr')), minorUnits: Number(tag('CcyMnrUnts')) };
  }
}
const alpha3 = { ...USER_ASSIGNED };
for (const c of iso3166['3166-1']) {
  alpha3[c.alpha_2] = c.alpha_3;
}

const problems = [];
for (const c of getAllISOCodes()) {
  const official = currencies[c.currency];
  if (!official) {
    problems.push(`${c.iso} (${c.countryName}): ${c.currency} is not in the current ISO 4217 list`);
  } else {
    for (const field of ['numericCode', 'minorUnits']) {
      if (official[field] !== c[field]) {
        problems.push(`${c.iso} (${c.countryName}): ${c.currency} ${field} is ${c[field]}, ISO 4217 says ${official[field]}`);
      }
    }
  }
  if (alpha3[c.iso] !== c.alpha3) {
    problems.push(`${c.iso} (${c.countryName}): alpha3 is ${c.alpha3}, ISO 3166 says ${alpha3[c.iso] ?? 'nothing (code withdrawn?)'}`);
  }
}

console.log(`ISO 4217 list published ${(xml.match(/Pblshd="([^"]+)"/) || [])[1]}`);
if (problems.length) {
  console.log(problems.join('\n'));
  process.exit(1);
}
console.log('All countries and currencies are up to date');
