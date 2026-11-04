// Town-level edits that work through the town map: fruit trees, Nook's shop and the player house.
import { AcwwSave, TOWN_MAP_COUNT } from './save';

export const FRUITS = [
  { id: 'peach', name: 'Pêche', base: 0x2f },
  { id: 'apple', name: 'Pomme', base: 0x37 },
  { id: 'orange', name: 'Orange', base: 0x3f },
  { id: 'pear', name: 'Poire', base: 0x47 },
  { id: 'cherry', name: 'Cerise', base: 0x4f },
] as const;
const FRUIT_FAMILY = 8; // sapling, small, medium, large, with fruit, without fruit x3

export function fruitOf(item: number): number {
  return FRUITS.findIndex(f => item >= f.base && item < f.base + FRUIT_FAMILY);
}

/** Counts fruit trees per fruit; the most common one is the town's native fruit. */
export function fruitCounts(s: AcwwSave): number[] {
  const n = FRUITS.map(() => 0);
  for (let i = 0; i < TOWN_MAP_COUNT; i++) { const f = fruitOf(s.townItem(i)); if (f >= 0) n[f]++; }
  return n;
}
export function nativeFruit(s: AcwwSave): number {
  const n = fruitCounts(s); const max = Math.max(...n);
  return max === 0 ? -1 : n.indexOf(max);
}

/** Turns every tree of fruit `from` (or of every fruit when from = -1) into the same growth stage of fruit `to`. */
export function replaceFruit(s: AcwwSave, from: number, to: number): number {
  let changed = 0;
  for (let i = 0; i < TOWN_MAP_COUNT; i++) {
    const it = s.townItem(i); const f = fruitOf(it);
    if (f < 0 || f === to || (from >= 0 && f !== from)) continue;
    s.setTownItem(i, FRUITS[to].base + (it - FRUITS[f].base));
    changed++;
  }
  return changed;
}

export const SHOPS = [
  { name: 'Petite boutique', tile: 0x500d },
  { name: 'Supérette', tile: 0x500e },
  { name: 'Supermarché', tile: 0x500f },
  { name: 'Grand magasin à étage', tile: 0x5010 },
];

export const HOUSES = [
  { name: 'Petite maison', tile: 0x5014 },
  { name: 'Agrandie (1)', tile: 0x5015 },
  { name: 'Agrandie (2)', tile: 0x5016 },
  { name: 'Avec étage', tile: 0x5017 },
  { name: 'Aile gauche', tile: 0x5018 },
  { name: 'Aile droite', tile: 0x5019 },
  { name: 'Villa (complète)', tile: 0x501a },
];
const HOUSE_SIZE_BYTE = 0xfaf8; // low 3 bits, per ACSE research ("not sure")
export const DEBT_OFFSET = 0xfae8;

function findTile(s: AcwwSave, tiles: number[]): { index: number; level: number } | null {
  for (let i = 0; i < TOWN_MAP_COUNT; i++) { const l = tiles.indexOf(s.townItem(i)); if (l >= 0) return { index: i, level: l }; }
  return null;
}

export function shopLevel(s: AcwwSave): number { return findTile(s, SHOPS.map(x => x.tile))?.level ?? -1; }
export function setShopLevel(s: AcwwSave, level: number): boolean {
  const t = findTile(s, SHOPS.map(x => x.tile)); if (!t) return false;
  s.setTownItem(t.index, SHOPS[level].tile); return true;
}

export function houseLevel(s: AcwwSave): number { return findTile(s, HOUSES.map(x => x.tile))?.level ?? -1; }
export function setHouseLevel(s: AcwwSave, level: number): boolean {
  const t = findTile(s, HOUSES.map(x => x.tile)); if (!t) return false;
  s.setTownItem(t.index, HOUSES[level].tile);
  s.setU8(HOUSE_SIZE_BYTE, (s.u8(HOUSE_SIZE_BYTE) & ~7) | (level & 7));
  return true;
}

export function debt(s: AcwwSave): number { return s.u32(DEBT_OFFSET); }
export function setDebt(s: AcwwSave, v: number) { s.setU32(DEBT_OFFSET, Math.max(0, Math.min(9_999_999, Math.floor(v) || 0))); }
