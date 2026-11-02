// Original SVG animal heads, one design per species with a colour variation per villager.
// These are generic species portraits, not copies of the game's characters.

type Ears = 'round' | 'bigRound' | 'tri' | 'tall' | 'floppy' | 'long' | 'side' | 'tiny' | 'none' | 'fluffy' | 'mane' | 'horns' | 'goatHorns' | 'elephant' | 'frog' | 'crest' | 'tuft';
type Snout = 'none' | 'oval' | 'pig' | 'beak' | 'longBeak' | 'trunk' | 'long' | 'wide' | 'horn' | 'mouse' | 'cat' | 'flatBeak';

interface SpeciesArt { ears: Ears; snout: Snout; palette: string[]; accent?: string; }

const S: Record<string, SpeciesArt> = {
  Anteater: { ears: 'tiny', snout: 'long', palette: ['#e7a9b6', '#b9a6d6', '#c9b28f', '#e8c48a'] },
  Bear: { ears: 'round', snout: 'oval', palette: ['#b9845a', '#8c6a52', '#e3c9a0', '#f2a8b5', '#9fb6d9'] },
  Bird: { ears: 'crest', snout: 'beak', palette: ['#8fc7ef', '#f5cf5d', '#f19aa7', '#9ed89a', '#c4b2ea'] },
  Bull: { ears: 'horns', snout: 'wide', palette: ['#9c6f57', '#5d4a44', '#d0a27a'] },
  Cat: { ears: 'tri', snout: 'cat', palette: ['#f4b440', '#9ad0f0', '#f6a6c1', '#b7b7c4', '#ffffff', '#7e6b5d', '#c8e08c'] },
  Cub: { ears: 'round', snout: 'oval', palette: ['#f0b77d', '#f6c9d2', '#b8d8a8', '#a7c8ec', '#ffe08a'] },
  Chicken: { ears: 'crest', snout: 'beak', palette: ['#ffffff', '#f6e3b0', '#d1d1d1', '#f0b98f'], accent: '#ee4b4b' },
  Cow: { ears: 'horns', snout: 'wide', palette: ['#f2efe6', '#e7d5bf', '#f5d7e0'] },
  Alligator: { ears: 'none', snout: 'long', palette: ['#76c08a', '#a4d07a', '#7fb4c9', '#e59a8f'] },
  Dog: { ears: 'floppy', snout: 'oval', palette: ['#d8a978', '#f3e3c8', '#8a7466', '#c8c8cf', '#e8b5c2'] },
  Duck: { ears: 'tuft', snout: 'flatBeak', palette: ['#fff1a8', '#ffffff', '#b7dcf2', '#f6c6d5', '#b8e3b0'] },
  Elephant: { ears: 'elephant', snout: 'trunk', palette: ['#b3c4dc', '#d2b9e2', '#f2c1cf', '#c3c3c3', '#b5dcd0'] },
  Frog: { ears: 'frog', snout: 'none', palette: ['#8fd16f', '#e6e66d', '#77c2c9', '#f0a6b3', '#b0b0d8'] },
  Goat: { ears: 'goatHorns', snout: 'oval', palette: ['#f2efe6', '#e9d9a6', '#c9d6e8', '#e8c3cf'] },
  Gorilla: { ears: 'side', snout: 'wide', palette: ['#6f6a78', '#8b7e6d', '#5e6f86'] },
  Hippo: { ears: 'tiny', snout: 'wide', palette: ['#c6b0d6', '#f2b8c6', '#a9c3d9', '#d9c2a5'] },
  Horse: { ears: 'tall', snout: 'wide', palette: ['#c99569', '#f0e6d8', '#8d7b8f', '#e9c1d0', '#9fbad8'] },
  Koala: { ears: 'fluffy', snout: 'oval', palette: ['#a8adb8', '#c7b9a7', '#b8c7d9', '#e6c2cd'] },
  Kangaroo: { ears: 'tall', snout: 'oval', palette: ['#d9a07a', '#e9c79b', '#c7b3d9', '#f2b8c6'] },
  Lion: { ears: 'mane', snout: 'cat', palette: ['#f0c45a', '#e7a35f', '#f3e3b0'] },
  Mouse: { ears: 'bigRound', snout: 'mouse', palette: ['#c9c9d1', '#f2c2d0', '#e9d4a8', '#b8d8ec', '#f0f0f0'] },
  Octopus: { ears: 'none', snout: 'none', palette: ['#f28b8b', '#f6b26b', '#a7c7e7'] },
  Ostrich: { ears: 'crest', snout: 'longBeak', palette: ['#f2b6c6', '#d9c7a8', '#c5b3e6', '#b9dcb2'] },
  Eagle: { ears: 'crest', snout: 'beak', palette: ['#8a6a50', '#d9d9d9', '#6c7c9a', '#c99a6b'] },
  Penguin: { ears: 'none', snout: 'beak', palette: ['#4f6f9a', '#5b5b6b', '#7aa6c2', '#b48ac9'] },
  Pig: { ears: 'tri', snout: 'pig', palette: ['#f6b6c4', '#e9c8a0', '#c7d6e8', '#d8e8b8', '#a88a7a'] },
  Rabbit: { ears: 'long', snout: 'mouse', palette: ['#ffffff', '#f6c9d4', '#e8d6a8', '#bcd6ef', '#c9c9cf'] },
  Rhino: { ears: 'tiny', snout: 'horn', palette: ['#b6b2b8', '#c9b8a6', '#b9c9b1'] },
  Tiger: { ears: 'round', snout: 'cat', palette: ['#f2a23a', '#e8e3d8', '#a8b8d8'] },
  Wolf: { ears: 'tall', snout: 'oval', palette: ['#8e9aad', '#c5c9d1', '#6f6f7a', '#d9b8a0'] },
  Monkey: { ears: 'side', snout: 'oval', palette: ['#b88a64', '#f0b8c8', '#c9c9a0', '#9a8cc0'] },
};

function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v + amt * 255)));
  const r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function earsSvg(e: Ears, c: string, d: string, inner: string, accent: string): [string, string] {
  const st = `stroke="${d}" stroke-width="2"`;
  switch (e) {
    case 'round': return [`<circle cx="24" cy="26" r="11" fill="${c}" ${st}/><circle cx="76" cy="26" r="11" fill="${c}" ${st}/><circle cx="24" cy="26" r="5.5" fill="${inner}"/><circle cx="76" cy="26" r="5.5" fill="${inner}"/>`, ''];
    case 'bigRound': return [`<circle cx="20" cy="24" r="17" fill="${c}" ${st}/><circle cx="80" cy="24" r="17" fill="${c}" ${st}/><circle cx="20" cy="24" r="10" fill="${inner}"/><circle cx="80" cy="24" r="10" fill="${inner}"/>`, ''];
    case 'tri': return [`<path d="M18 40 L22 10 L42 28 Z" fill="${c}" ${st} stroke-linejoin="round"/><path d="M82 40 L78 10 L58 28 Z" fill="${c}" ${st} stroke-linejoin="round"/><path d="M24 30 L25 18 L34 27 Z" fill="${inner}"/><path d="M76 30 L75 18 L66 27 Z" fill="${inner}"/>`, ''];
    case 'tall': return [`<path d="M26 34 C18 20 22 4 30 4 C36 8 38 22 38 30 Z" fill="${c}" ${st}/><path d="M74 34 C82 20 78 4 70 4 C64 8 62 22 62 30 Z" fill="${c}" ${st}/>`, ''];
    case 'floppy': return ['', `<path d="M22 30 C8 34 6 60 16 66 C24 62 26 46 30 36 Z" fill="${d}" stroke="${shade(d, -.15)}" stroke-width="2"/><path d="M78 30 C92 34 94 60 84 66 C76 62 74 46 70 36 Z" fill="${d}" stroke="${shade(d, -.15)}" stroke-width="2"/>`];
    case 'long': return [`<path d="M32 30 C24 10 26 -6 34 -6 C42 -4 44 14 42 30 Z" fill="${c}" ${st}/><path d="M68 30 C76 10 74 -6 66 -6 C58 -4 56 14 58 30 Z" fill="${c}" ${st}/><path d="M34 26 C30 12 31 2 34 2 C38 4 38 16 38 26 Z" fill="${inner}"/><path d="M66 26 C70 12 69 2 66 2 C62 4 62 16 62 26 Z" fill="${inner}"/>`, ''];
    case 'side': return [`<circle cx="12" cy="52" r="10" fill="${c}" ${st}/><circle cx="88" cy="52" r="10" fill="${c}" ${st}/><circle cx="12" cy="52" r="5" fill="${inner}"/><circle cx="88" cy="52" r="5" fill="${inner}"/>`, ''];
    case 'tiny': return [`<ellipse cx="28" cy="24" rx="6" ry="7" fill="${c}" ${st}/><ellipse cx="72" cy="24" rx="6" ry="7" fill="${c}" ${st}/>`, ''];
    case 'fluffy': return [`<circle cx="16" cy="32" r="16" fill="${c}" ${st}/><circle cx="84" cy="32" r="16" fill="${c}" ${st}/><circle cx="16" cy="32" r="9" fill="#ffffff" opacity=".8"/><circle cx="84" cy="32" r="9" fill="#ffffff" opacity=".8"/>`, ''];
    case 'mane': return [Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; return `<circle cx="${50 + Math.cos(a) * 40}" cy="${54 + Math.sin(a) * 38}" r="14" fill="${accent}" stroke="${shade(accent, -.2)}" stroke-width="2"/>`; }).join(''), ''];
    case 'horns': return [`<path d="M22 30 C10 26 6 14 10 8 C14 16 22 20 30 22 Z" fill="#f4ecd8" stroke="#c9b893" stroke-width="2"/><path d="M78 30 C90 26 94 14 90 8 C86 16 78 20 70 22 Z" fill="#f4ecd8" stroke="#c9b893" stroke-width="2"/><ellipse cx="14" cy="42" rx="10" ry="6" fill="${c}" ${st}/><ellipse cx="86" cy="42" rx="10" ry="6" fill="${c}" ${st}/>`, ''];
    case 'goatHorns': return [`<path d="M34 24 C30 10 36 2 44 4 C40 10 40 16 42 22 Z" fill="#e9dcc0" stroke="#bfae8a" stroke-width="2"/><path d="M66 24 C70 10 64 2 56 4 C60 10 60 16 58 22 Z" fill="#e9dcc0" stroke="#bfae8a" stroke-width="2"/><ellipse cx="16" cy="44" rx="11" ry="5" fill="${c}" ${st}/><ellipse cx="84" cy="44" rx="11" ry="5" fill="${c}" ${st}/>`, ''];
    case 'elephant': return [`<ellipse cx="12" cy="50" rx="14" ry="22" fill="${c}" ${st}/><ellipse cx="88" cy="50" rx="14" ry="22" fill="${c}" ${st}/><ellipse cx="14" cy="50" rx="8" ry="14" fill="${inner}"/><ellipse cx="86" cy="50" rx="8" ry="14" fill="${inner}"/>`, ''];
    case 'frog': return ['', `<circle cx="32" cy="26" r="13" fill="${c}" ${st}/><circle cx="68" cy="26" r="13" fill="${c}" ${st}/><circle cx="32" cy="26" r="8" fill="#fff"/><circle cx="68" cy="26" r="8" fill="#fff"/><circle cx="33" cy="27" r="4.5" fill="#2b2222"/><circle cx="67" cy="27" r="4.5" fill="#2b2222"/><circle cx="34.5" cy="25" r="1.5" fill="#fff"/><circle cx="68.5" cy="25" r="1.5" fill="#fff"/>`];
    case 'crest': return [`<path d="M44 22 C40 6 48 2 50 8 C52 2 60 6 56 22 Z" fill="${accent}" stroke="${shade(accent, -.2)}" stroke-width="2"/>`, ''];
    case 'tuft': return [`<path d="M48 20 C44 10 50 6 52 12 C56 8 58 14 54 20 Z" fill="${d}"/>`, ''];
    default: return ['', ''];
  }
}

function snoutSvg(s: Snout, c: string, d: string): string {
  const muzzle = shade(c, .12);
  switch (s) {
    case 'oval': return `<ellipse cx="50" cy="68" rx="15" ry="11" fill="${muzzle}" stroke="${d}" stroke-width="1.6"/><ellipse cx="50" cy="63" rx="5.5" ry="4" fill="#3a2a2a"/><path d="M50 67 L50 71 M45 73 Q50 76 55 73" stroke="#3a2a2a" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
    case 'cat': return `<ellipse cx="50" cy="66" rx="4" ry="3" fill="#f07f98"/><path d="M50 69 L50 71 M44 73 Q47 75 50 71 Q53 75 56 73" stroke="#3a2a2a" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M30 66 L18 64 M30 70 L18 72 M70 66 L82 64 M70 70 L82 72" stroke="${d}" stroke-width="1.4" stroke-linecap="round"/>`;
    case 'mouse': return `<ellipse cx="50" cy="66" rx="4.5" ry="3.5" fill="#f07f98"/><path d="M50 69 L50 72 M46 74 Q50 76 54 74" stroke="#3a2a2a" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M31 67 L20 65 M31 70 L20 72 M69 67 L80 65 M69 70 L80 72" stroke="${d}" stroke-width="1.2" stroke-linecap="round"/>`;
    case 'pig': return `<ellipse cx="50" cy="68" rx="12" ry="9" fill="${shade(c, -.05)}" stroke="${d}" stroke-width="1.8"/><ellipse cx="45" cy="68" rx="2.6" ry="3.6" fill="${shade(d, -.2)}"/><ellipse cx="55" cy="68" rx="2.6" ry="3.6" fill="${shade(d, -.2)}"/>`;
    case 'beak': return `<path d="M40 64 Q50 58 60 64 L50 78 Z" fill="#f5b041" stroke="#c8861e" stroke-width="1.6" stroke-linejoin="round"/>`;
    case 'longBeak': return `<path d="M40 64 Q50 58 60 64 L52 84 L48 84 Z" fill="#f5b041" stroke="#c8861e" stroke-width="1.6" stroke-linejoin="round"/>`;
    case 'flatBeak': return `<ellipse cx="50" cy="70" rx="15" ry="7" fill="#f5b041" stroke="#c8861e" stroke-width="1.6"/><path d="M38 70 Q50 73 62 70" stroke="#c8861e" stroke-width="1.4" fill="none"/>`;
    case 'trunk': return `<path d="M44 62 C44 76 42 86 34 90 C32 86 36 84 38 80 C40 74 40 68 40 62 Z" transform="translate(6 0)" fill="${c}" stroke="${d}" stroke-width="2" stroke-linejoin="round"/>`;
    case 'long': return `<path d="M34 62 C34 70 40 92 50 94 C60 92 66 70 66 62 Z" fill="${muzzle}" stroke="${d}" stroke-width="2"/><ellipse cx="46" cy="88" rx="1.8" ry="1.4" fill="#3a2a2a"/><ellipse cx="54" cy="88" rx="1.8" ry="1.4" fill="#3a2a2a"/>`;
    case 'wide': return `<ellipse cx="50" cy="70" rx="20" ry="12" fill="${muzzle}" stroke="${d}" stroke-width="1.8"/><ellipse cx="43" cy="68" rx="2.6" ry="3.2" fill="#3a2a2a"/><ellipse cx="57" cy="68" rx="2.6" ry="3.2" fill="#3a2a2a"/><path d="M42 76 Q50 80 58 76" stroke="#3a2a2a" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    case 'horn': return `<ellipse cx="50" cy="70" rx="18" ry="11" fill="${muzzle}" stroke="${d}" stroke-width="1.8"/><path d="M44 62 L50 44 L56 62 Z" fill="#f4ecd8" stroke="#c9b893" stroke-width="1.8" stroke-linejoin="round"/><ellipse cx="44" cy="70" rx="2" ry="2.6" fill="#3a2a2a"/><ellipse cx="56" cy="70" rx="2" ry="2.6" fill="#3a2a2a"/>`;
    default: return `<path d="M43 70 Q50 75 57 70" stroke="#3a2a2a" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  }
}

/** A villager portrait. `seed` picks the colour variation (use the villager id). */
export function villagerSvg(species: string, seed: number, size = 58): string {
  const a = S[species] ?? { ears: 'round', snout: 'oval', palette: ['#cfd8c8'] };
  const c = a.palette[seed % a.palette.length];
  const d = shade(c, -.22);
  const inner = '#f6b8c6';
  const accent = a.accent ?? (species === 'Lion' ? shade('#c9772f', (seed % 3) * .08) : shade(c, -.1));
  const [back, front] = earsSvg(a.ears, c, d, inner, accent);
  const frogEyes = a.ears === 'frog';
  const eyeY = a.snout === 'long' ? 52 : 52;
  const eyes = frogEyes ? '' : `<ellipse cx="37" cy="${eyeY}" rx="4.2" ry="5.4" fill="#2b2222"/><ellipse cx="63" cy="${eyeY}" rx="4.2" ry="5.4" fill="#2b2222"/><circle cx="38.6" cy="${eyeY - 2}" r="1.5" fill="#fff"/><circle cx="64.6" cy="${eyeY - 2}" r="1.5" fill="#fff"/>`;
  const cheeks = `<ellipse cx="27" cy="64" rx="5" ry="3" fill="#ff8fa3" opacity=".45"/><ellipse cx="73" cy="64" rx="5" ry="3" fill="#ff8fa3" opacity=".45"/>`;
  const stripes = species === 'Tiger' ? `<path d="M44 22 L46 32 M50 20 L50 30 M56 22 L54 32 M20 50 L28 52 M80 50 L72 52" stroke="${shade(c, -.4)}" stroke-width="3" stroke-linecap="round"/>` : '';
  const cowSpots = species === 'Cow' ? `<ellipse cx="34" cy="36" rx="9" ry="6" fill="#5a4a44" opacity=".75"/><ellipse cx="70" cy="42" rx="6" ry="4" fill="#5a4a44" opacity=".75"/>` : '';
  const penguinFace = species === 'Penguin' ? `<path d="M26 48 C26 36 40 34 50 42 C60 34 74 36 74 48 C76 66 66 80 50 80 C34 80 24 66 26 48 Z" fill="#fff"/>` : '';
  const octo = species === 'Octopus' ? `<path d="M22 74 q4 14 10 6 q4 10 10 2 q4 10 8 2 q4 10 10 -2 q6 8 10 -6 q4 8 8 -4" stroke="${d}" stroke-width="2" fill="${c}"/>` : '';
  const comb = species === 'Chicken' ? `<circle cx="52" cy="82" r="4" fill="#ee4b4b"/>` : '';
  return `<svg viewBox="-6 -10 112 112" width="${size}" height="${size}" aria-hidden="true">
    ${back}${octo}
    <ellipse cx="50" cy="54" rx="36" ry="33" fill="${c}" stroke="${d}" stroke-width="2"/>
    ${penguinFace}${cowSpots}${stripes}${cheeks}${eyes}${snoutSvg(a.snout, c, d)}${comb}${front}
  </svg>`;
}

export const SPECIES_ART = S;
