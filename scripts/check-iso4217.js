// Compares the bundled data against the official ISO 4217 list published by SIX.
// Exits with code 1 if any currency code, numeric code or minor units are out of date.
const { getAllISOCodes } = require('..');

const LIST_URL = 'https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xml';

async function main() {
  const xml = await (await fetch(LIST_URL)).text();
  const published = (xml.match(/Pblshd="([^"]+)"/) || [])[1];
  const iso = {};

  for (const [, entry] of xml.matchAll(/<CcyNtry>([\s\S]*?)<\/CcyNtry>/g)) {
    const tag = (name) => (entry.match(new RegExp('<' + name + '( [^>]*)?>([^<]*)<')) || [])[2];
    if (tag('Ccy')) {
      iso[tag('Ccy')] = { numericCode: Number(tag('CcyNbr')), minorUnits: Number(tag('CcyMnrUnts')) };
    }
  }

  const problems = [];
  for (const c of getAllISOCodes()) {
    const official = iso[c.currency];
    if (!official) {
      problems.push(`${c.iso} (${c.countryName}): ${c.currency} is not in the current ISO 4217 list`);
      continue;
    }
    for (const field of ['numericCode', 'minorUnits']) {
      if (official[field] !== c[field]) {
        problems.push(`${c.iso} (${c.countryName}): ${c.currency} ${field} is ${c[field]}, ISO 4217 says ${official[field]}`);
      }
    }
  }

  console.log(`ISO 4217 list published ${published}`);
  if (problems.length) {
    console.log(problems.join('\n'));
    process.exit(1);
  }
  console.log('All currencies are up to date');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
