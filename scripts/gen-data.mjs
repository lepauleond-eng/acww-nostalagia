// Generates ID->name tables from a plain "0xID, Name" list with "//Category" headers.
import fs from 'node:fs';
const [,, villIn, itemIn, outDir] = process.argv;
function parse(file) {
  const out = []; let cat = '';
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (line.startsWith('//')) { cat = line.slice(2).trim(); continue; }
    const m = line.match(/^0x([0-9A-Fa-f]+),\s*(.+)$/);
    if (m) out.push([parseInt(m[1], 16), m[2].trim(), cat]);
  }
  return out;
}
const v = parse(villIn).filter(x => x[0] !== 0xff);
fs.writeFileSync(`${outDir}/villagers.json`, JSON.stringify(v.map(([id, name, species]) => ({ id, name, species }))));
const it = parse(itemIn);
fs.writeFileSync(`${outDir}/items.json`, JSON.stringify(it.map(([id, name, cat]) => [id, name, cat])));
console.log(v.length, 'villagers', it.length, 'items');
