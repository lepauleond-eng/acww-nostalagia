// Synthetic example town for the online preview (not a real game save).
import { computeChecksum, CHECKSUM_OFFSET, COPY2_OFFSET, MAIN_SIZE } from './core/save';
import { encodeWW } from './core/charset';
export function demoSave(): Uint8Array {
  const d = new Uint8Array(0x40000); const dv = new DataView(d.buffer); d[0] = 0xc5;
  d.set(encodeWW('Pomme', 8), 4);
  const pl = 0x0c; d[pl + 0x2280] = 1; d.set(encodeWW('Lou', 8), pl + 0x2282);
  dv.setUint32(pl + 0x1b40, 12345, true); dv.setUint32(pl + 0x21e4, 500000, true);
  for (let i = 0; i < 15; i++) dv.setUint16(pl + 0x1b22 + i * 2, [0x14fd, 0x14fd, 0x14fd][i] ?? 0xfff1, true);
  [15, 17, 4, 60, 100, 130, 0xff, 0xff].forEach((id, i) => { d[0x8a3c + i * 0x700 + 0x6cb] = id; d[0x8a3c + i * 0x700 + 0x6ca] = i % 6; });
  for (let i = 0; i < 4096; i++) dv.setUint16(0xc354 + i * 2, i % 50 === 0 ? 0x22 : 0xfff1, true);
  dv.setUint16(CHECKSUM_OFFSET, computeChecksum(d), true); d.copyWithin(COPY2_OFFSET, 0, MAIN_SIZE);
  return d;
}
