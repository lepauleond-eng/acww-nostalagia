// Animal Crossing: Wild World save file (EUR/USA layout, which the French game uses).
// Format facts from ACWW Research: https://wiki.universal-team.net/acww-research/
import { decodeWW, encodeWW } from './charset';

export const MAIN_SIZE = 0x15fe0; // one copy of the main save
export const CHECKSUM_OFFSET = 0x15fdc; // u16, makes the u16 sum of the copy equal 0
export const COPY2_OFFSET = 0x15fe0;
export const REGION_EUR = 0xc5;
export const REGION_USA = 0x8a;
export const VALID_SIZES = [0x40000, 0x4007a, 0x80000, 0x8007a];

export const PLAYER_START = 0x0c;
export const PLAYER_SIZE = 0x228c;
export const VILLAGER_START = 0x8a3c;
export const VILLAGER_SIZE = 0x700;
export const TOWN_MAP_START = 0xc354;
export const TOWN_MAP_COUNT = 4096;
export const EMPTY_ITEM = 0xfff1;
export const NO_VILLAGER = 0xff;

const P = { pockets: 0x1b22, wallet: 0x1b40, bank: 0x21e4, face: 0x223c, tan: 0x223d, exists: 0x2280, name: 0x2282, gender: 0x228a };
const V = { furniture: 0x6ac, personality: 0x6ca, species: 0x6cb, shirt: 0x6ec, wallpaper: 0x6ee, carpet: 0x6ef, umbrella: 0x6f4 };

export const WALLET_MAX = 99999;
export const BANK_MAX = 999999999;

export class SaveError extends Error {}

export function computeChecksum(data: Uint8Array, base = 0): number {
  const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
  let sum = 0;
  for (let off = base; off < base + MAIN_SIZE; off += 2) {
    if (off === base + CHECKSUM_OFFSET) continue;
    sum = (sum + dv.getUint16(off, true)) & 0xffff;
  }
  return (0x10000 - sum) & 0xffff;
}

export class Player {
  constructor(private save: AcwwSave, readonly index: number) {}
  get base() { return PLAYER_START + this.index * PLAYER_SIZE; }
  get exists() { return this.save.u16(this.base + P.exists) !== 0; }
  get name() { return decodeWW(this.save.bytes(this.base + P.name, 8)); }
  set name(v: string) { this.save.data.set(encodeWW(v, 8), this.base + P.name); }
  get gender(): 'garçon' | 'fille' { return this.save.u8(this.base + P.gender) === 0 ? 'garçon' : 'fille'; }
  get wallet() { return this.save.u32(this.base + P.wallet); }
  set wallet(v: number) { this.save.setU32(this.base + P.wallet, clamp(v, 0, WALLET_MAX)); }
  get bank() { return this.save.u32(this.base + P.bank); }
  set bank(v: number) { this.save.setU32(this.base + P.bank, clamp(v, 0, BANK_MAX)); }
  get hairstyle() { return this.save.u8(this.base + P.face) & 0x0f; }
  set hairstyle(v: number) { this.setNibble(P.face, false, v); }
  get face() { return this.save.u8(this.base + P.face) >> 4; }
  set face(v: number) { this.setNibble(P.face, true, v); }
  get hairColor() { return this.save.u8(this.base + P.tan) & 0x0f; }
  set hairColor(v: number) { this.setNibble(P.tan, false, v); }
  get tan() { return this.save.u8(this.base + P.tan) >> 4; }
  set tan(v: number) { this.setNibble(P.tan, true, v); }
  pocket(i: number) { return this.save.u16(this.base + P.pockets + i * 2); }
  setPocket(i: number, item: number) { this.save.setU16(this.base + P.pockets + i * 2, item); }
  private setNibble(off: number, high: boolean, v: number) {
    const cur = this.save.u8(this.base + off);
    const n = clamp(v, 0, 15);
    this.save.setU8(this.base + off, high ? (cur & 0x0f) | (n << 4) : (cur & 0xf0) | n);
  }
}

export class Villager {
  constructor(private save: AcwwSave, readonly index: number) {}
  get base() { return VILLAGER_START + this.index * VILLAGER_SIZE; }
  get species() { return this.save.u8(this.base + V.species); }
  set species(id: number) { this.save.setU8(this.base + V.species, id); }
  get exists() { return this.species !== NO_VILLAGER; }
  get personality() { return this.save.u8(this.base + V.personality); }
  set personality(v: number) { this.save.setU8(this.base + V.personality, v); }
  get shirt() { return this.save.u16(this.base + V.shirt); }
  set shirt(v: number) { this.save.setU16(this.base + V.shirt, v); }
  get umbrella() { return this.save.u8(this.base + V.umbrella); }
  set umbrella(v: number) { this.save.setU8(this.base + V.umbrella, v); }
  furniture(i: number) { return this.save.u16(this.base + V.furniture + i * 2); }
  setFurniture(i: number, v: number) { this.save.setU16(this.base + V.furniture + i * 2, v); }
}

export class AcwwSave {
  readonly data: Uint8Array;
  readonly region: 'EUR' | 'USA';
  private dv: DataView;

  constructor(input: Uint8Array) {
    if (!VALID_SIZES.includes(input.length)) {
      throw new SaveError(`Taille de fichier inattendue (${input.length} octets). Un .sav de Wild World fait 256 Ko ou 512 Ko.`);
    }
    if (input.subarray(0, MAIN_SIZE).every(b => b === 0xff)) {
      throw new SaveError("Cette sauvegarde est vide : le jeu n'a encore rien enregistré. Joue jusqu'à ta première vraie sauvegarde (menu Start → Sauvegarder), puis réessaie.");
    }
    const code = input[0];
    if ((code !== REGION_EUR && code !== REGION_USA) || input[COPY2_OFFSET] !== code) {
      throw new SaveError("Ce fichier ne ressemble pas à une sauvegarde Animal Crossing: Wild World européenne (FR) ou américaine.");
    }
    this.data = new Uint8Array(input); // work on a copy
    this.dv = new DataView(this.data.buffer);
    this.region = code === REGION_EUR ? 'EUR' : 'USA';
  }

  u8(o: number) { return this.data[o]; }
  setU8(o: number, v: number) { this.data[o] = v & 0xff; }
  u16(o: number) { return this.dv.getUint16(o, true); }
  setU16(o: number, v: number) { this.dv.setUint16(o, v & 0xffff, true); }
  u32(o: number) { return this.dv.getUint32(o, true); }
  setU32(o: number, v: number) { this.dv.setUint32(o, v >>> 0, true); }
  bytes(o: number, n: number) { return this.data.subarray(o, o + n); }

  get townName() { return decodeWW(this.bytes(0x04, 8)); }
  set townName(v: string) { this.data.set(encodeWW(v, 8), 0x04); }
  get townId() { return this.u16(0x02); }

  get players() { return [0, 1, 2, 3].map(i => new Player(this, i)); }
  get villagers() { return [0, 1, 2, 3, 4, 5, 6, 7].map(i => new Villager(this, i)); }

  get storedChecksum() { return this.u16(CHECKSUM_OFFSET); }
  get checksumValid() { return computeChecksum(this.data) === this.storedChecksum; }

  townItem(i: number) { return this.u16(TOWN_MAP_START + i * 2); }
  setTownItem(i: number, v: number) { this.setU16(TOWN_MAP_START + i * 2, v); }

  /** Fixes the checksum, mirrors the main copy into the backup copy and returns the file bytes. */
  export(): Uint8Array {
    this.setU16(CHECKSUM_OFFSET, computeChecksum(this.data));
    this.data.copyWithin(COPY2_OFFSET, 0, MAIN_SIZE);
    return new Uint8Array(this.data);
  }
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, Math.floor(Number.isFinite(v) ? v : 0)));
}
