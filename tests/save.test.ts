import { describe, expect, it } from 'vitest';
import { AcwwSave, computeChecksum, CHECKSUM_OFFSET, COPY2_OFFSET, MAIN_SIZE, SaveError, VILLAGER_START, VILLAGER_SIZE } from '../src/core/save';
import { decodeWW, encodeWW } from '../src/core/charset';
import { CHEATS } from '../src/core/cheats';

function fakeSave(): Uint8Array {
  const d = new Uint8Array(0x40000);
  for (let i = 0; i < MAIN_SIZE; i++) d[i] = (i * 7) & 0xff;
  d[0] = 0xc5;
  d.set(encodeWW('Pomme', 8), 0x04);
  // player 1 exists, named "Lou"
  d[0x0c + 0x2280] = 1;
  d.set(encodeWW('Lou', 8), 0x0c + 0x2282);
  for (let v = 0; v < 8; v++) d[VILLAGER_START + v * VILLAGER_SIZE + 0x6cb] = v < 6 ? v : 0xff;
  const dv = new DataView(d.buffer);
  dv.setUint16(CHECKSUM_OFFSET, computeChecksum(d), true);
  d.copyWithin(COPY2_OFFSET, 0, MAIN_SIZE);
  return d;
}

describe('charset', () => {
  it('round-trips French accents', () => {
    expect(decodeWW(encodeWW('Été ça', 8))).toBe('Été ça');
  });
});

describe('AcwwSave', () => {
  it('rejects wrong files', () => {
    expect(() => new AcwwSave(new Uint8Array(100))).toThrow(SaveError);
    expect(() => new AcwwSave(new Uint8Array(0x40000))).toThrow(SaveError);
  });

  it('reads town, players and villagers', () => {
    const s = new AcwwSave(fakeSave());
    expect(s.region).toBe('EUR');
    expect(s.townName).toBe('Pomme');
    expect(s.players[0].exists).toBe(true);
    expect(s.players[0].name).toBe('Lou');
    expect(s.villagers.filter(v => v.exists)).toHaveLength(6);
    expect(s.checksumValid).toBe(true);
  });

  it('fixes the checksum and mirrors the backup copy on export', () => {
    const s = new AcwwSave(fakeSave());
    s.players[0].wallet = 12345;
    s.villagers[0].species = 42;
    expect(s.checksumValid).toBe(false);
    const out = new AcwwSave(s.export());
    expect(out.checksumValid).toBe(true);
    expect(out.players[0].wallet).toBe(12345);
    expect(out.villagers[0].species).toBe(42);
    expect(Array.from(out.data.subarray(COPY2_OFFSET, COPY2_OFFSET + MAIN_SIZE))).toEqual(Array.from(out.data.subarray(0, MAIN_SIZE)));
    // the u16 sum of the whole copy must be 0
    const dv = new DataView(out.data.buffer);
    let sum = 0;
    for (let o = 0; o < MAIN_SIZE; o += 2) sum = (sum + dv.getUint16(o, true)) & 0xffff;
    expect(sum).toBe(0);
  });

  it('keeps the bytes after the two copies untouched', () => {
    const raw = fakeSave();
    raw[0x3ffff] = 0xab;
    expect(new AcwwSave(raw).export()[0x3ffff]).toBe(0xab);
  });

  it('clamps bells', () => {
    const s = new AcwwSave(fakeSave());
    s.players[0].wallet = 10_000_000;
    expect(s.players[0].wallet).toBe(99999);
  });

  it('runs every cheat', () => {
    const s = new AcwwSave(fakeSave());
    s.setTownItem(10, 0x22);
    for (const c of CHEATS) expect(typeof c.apply(s, 0)).toBe('string');
    expect(s.townItem(10)).toBe(0xfff1);
    expect(new AcwwSave(s.export()).checksumValid).toBe(true);
  });
});

import { buildFromTemplate } from '../src/template';
describe('create from template', () => {
  it('builds a valid save with the chosen town, player and villagers', () => {
    const out = new AcwwSave(buildFromTemplate(fakeSave(), {
      townName: 'Feuilly', playerName: 'Zoé', villagers: [100, 101, 102, 103, 104, 105, 106, 107], wallet: 5000, bank: 10,
      hairstyle: 10, hairColor: 3, face: 9, tan: 1, emptyPockets: true,
    }).export());
    expect(out.checksumValid).toBe(true);
    expect(out.townName).toBe('Feuilly');
    expect(out.players[0].name).toBe('Zoé');
    expect(out.players[0].hairstyle).toBe(10);
    expect(out.villagers.map(v => v.species)).toEqual([100, 101, 102, 103, 104, 105, 0xff, 0xff]);
  });
});

describe('blank saves', () => {
  it('explains that an erased save has nothing in it yet', () => {
    expect(() => new AcwwSave(new Uint8Array(0x40000).fill(0xff))).toThrow(/vide/);
  });
});

import fs from 'node:fs';
import { nativeFruit, replaceFruit, fruitCounts, shopLevel, setShopLevel, houseLevel, setHouseLevel, debt } from '../src/core/town';
describe('real FR save (Mars)', () => {
  const raw = () => new Uint8Array(fs.readFileSync(new URL('./mars.sav', import.meta.url)));
  it('reads the town as the game wrote it', () => {
    const s = new AcwwSave(raw());
    expect(s.region).toBe('EUR');
    expect(s.checksumValid).toBe(true);
    expect(s.townName).toBe('Mars');
    expect(s.players[0].name).toBe('Loulou');
    expect(nativeFruit(s)).toBe(2); // orange
    expect(shopLevel(s)).toBe(0);
    expect(houseLevel(s)).toBe(0);
    expect(debt(s)).toBe(19800);
  });
  it('changes fruit, shop and house and stays valid', () => {
    const s = new AcwwSave(raw());
    const before = fruitCounts(s)[2];
    expect(replaceFruit(s, -1, 4)).toBe(before);
    expect(setShopLevel(s, 3)).toBe(true);
    expect(setHouseLevel(s, 6)).toBe(true);
    const out = new AcwwSave(s.export());
    expect(out.checksumValid).toBe(true);
    expect(nativeFruit(out)).toBe(4);
    expect(fruitCounts(out)[4]).toBe(before);
    expect(shopLevel(out)).toBe(3);
    expect(houseLevel(out)).toBe(6);
  });
  it('round-trips untouched bytes exactly', () => {
    const r = raw();
    expect(Buffer.compare(Buffer.from(new AcwwSave(r).export()), Buffer.from(r))).toBe(0);
  });
});

describe('villager text and renames (real saves)', () => {
  const load = (f: string) => new AcwwSave(new Uint8Array(fs.readFileSync(new URL(f, import.meta.url))));
  it('reads and writes catchphrases', () => {
    const s = load('./mars.sav');
    expect(s.villagers.slice(0, 3).map(v => v.catchphrase)).toEqual(['grih grih', 'lapinou', 'h-h-h-hon']);
    s.villagers[1].catchphrase = 'carotte';
    const r = new AcwwSave(s.export());
    expect(r.villagers[1].catchphrase).toBe('carotte');
    expect(r.checksumValid).toBe(true);
  });
  it('reads and edits the nickname a villager gives a player', () => {
    const s = load('./marseill.sav');
    const m = s.villagers[2].memories;
    expect(m).toEqual([{ slot: 0, playerId: s.players[0].id, playerName: 'Loulou', nickname: 'Loulou' }]);
    s.villagers[2].setNickname(0, 'Lou');
    expect(s.villagers[2].memories[0].nickname).toBe('Lou');
  });
  it('renames the town and player in every copy', () => {
    const s = load('./marseill.sav');
    s.townName = 'Mars'; // header said Marseill, game copies too
    const pat = (id: number, n: string) => { const out: number[] = []; const b = s.data;
      for (let o = 0; o < 0x15fe0 - 10; o++) if (b[o] === (id & 0xff) && b[o + 1] === id >> 8 && decodeWW(b.subarray(o + 2, o + 10)) === n) out.push(o); return out; };
    expect(pat(s.townId, 'Marseill')).toEqual([]);
    s.players[0].name = 'Lou';
    expect(pat(s.players[0].id, 'Loulou')).toEqual([]);
    expect(pat(s.players[0].id, 'Lou').length).toBeGreaterThan(5);
    expect(s.villagers[2].memories[0].playerName).toBe('Lou');
  });
});
