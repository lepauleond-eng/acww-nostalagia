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
