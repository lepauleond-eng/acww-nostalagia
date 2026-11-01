// Builds a synthetic EUR save for UI testing (not a real game save).
import fs from 'node:fs';
const d = new Uint8Array(0x40000); d[0] = 0xc5;
const enc = s => [...s].map(c => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(c) >= 0 ? 1 + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(c) : 27 + 'abcdefghijklmnopqrstuvwxyz'.indexOf(c));
d.set(enc('Pomme'), 4);
const pl = 0x0c; d[pl + 0x2280] = 1; d.set(enc('Lou'), pl + 0x2282);
const dv = new DataView(d.buffer);
dv.setUint32(pl + 0x1b40, 12345, true); dv.setUint32(pl + 0x21e4, 500000, true);
for (let i = 0; i < 15; i++) dv.setUint16(pl + 0x1b22 + i * 2, i < 3 ? 0x14fd : 0xfff1, true);
[15, 17, 4, 60, 100, 130, 0xff, 0xff].forEach((id, i) => { d[0x8a3c + i * 0x700 + 0x6cb] = id; d[0x8a3c + i * 0x700 + 0x6ca] = i % 6; });
for (let i = 0; i < 4096; i++) dv.setUint16(0xc354 + i * 2, i % 50 === 0 ? 0x22 : 0xfff1, true);
let sum = 0; for (let o = 0; o < 0x15fe0; o += 2) if (o !== 0x15fdc) sum = (sum + dv.getUint16(o, true)) & 0xffff;
dv.setUint16(0x15fdc, (0x10000 - sum) & 0xffff, true); d.copyWithin(0x15fe0, 0, 0x15fe0);
fs.writeFileSync(process.argv[2], d);
