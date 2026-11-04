// Original SVG drawings of the player's head (hairstyles, faces, hair colours, tan),
// in a soft, round handheld-era style. No game assets are used.

export const HAIR_COLORS = [
  { name: 'Brun foncé', hex: '#5b3a24', shade: '#3e2617' },
  { name: 'Châtain clair', hex: '#a8703f', shade: '#7c4f29' },
  { name: 'Roux', hex: '#e2742b', shade: '#b4531a' },
  { name: 'Bleu', hex: '#4c7fd6', shade: '#3459a3' },
  { name: 'Blond', hex: '#f2cf4a', shade: '#c9a52c' },
  { name: 'Vert', hex: '#4fb062', shade: '#357f44' },
  { name: 'Rose', hex: '#f08bb4', shade: '#c9648d' },
  { name: 'Blanc', hex: '#f4f1ea', shade: '#c9c3b6' },
];

export const HAIRSTYLES = [
  'Coupe en brosse', 'Épi sur le devant', 'Longue mèche à gauche', 'Cheveux en pétard',
  'Raie au milieu', 'Pointes rentrées', 'Coupe au bol', 'Arrondie à mèches pointues',
  'Frange de côté et boucles', 'Coupe champignon', 'Couettes', 'Trois tresses',
  'Queue de cheval', 'Chignon', 'Coupe courte', 'Bouclée',
];

export const FACES = [
  'Yeux marron à cils', 'Yeux noirs et sourcils', 'Yeux bleus mi-clos', 'Yeux verts perçants',
  'Yeux marron tout ronds', 'Yeux noirs en arc', 'Yeux bleus et joues roses', 'Petits yeux bleus',
  'Yeux plissés à cils', 'Yeux ovales à cils', 'Yeux bleus et joues roses', 'Yeux bleus mi-clos',
  'Yeux verts ovales à cils', 'Yeux marron en arc', 'Yeux bleus', 'Grands yeux verts à cils',
];

export const TAN_LEVELS = 4; // WW uses levels 0-3
const SKIN = ['#ffe0c4', '#f0c08f', '#c98d5c', '#8d5a36'];
export const skinFor = (tan: number) => SKIN[Math.min(SKIN.length - 1, Math.max(0, tan))];
export const tanLabel = (t: number) => ['Aucun', 'Léger', 'Bronzé', 'Très bronzé'][Math.min(3, t)] ?? `Niveau ${t}`;

const EYE = { brown: '#6b3f22', black: '#2b2222', blue: '#2f67c9', green: '#2f9a4d' };
type EyeKind = 'dot' | 'lash' | 'lid' | 'small' | 'arc' | 'oval' | 'squint' | 'circle';
const FACE_DEF: { kind: EyeKind; color: keyof typeof EYE; brows?: boolean; cheeks?: boolean }[] = [
  { kind: 'lash', color: 'brown' }, { kind: 'dot', color: 'black', brows: true }, { kind: 'lid', color: 'blue' }, { kind: 'small', color: 'green', brows: true },
  { kind: 'dot', color: 'brown' }, { kind: 'arc', color: 'black' }, { kind: 'dot', color: 'blue', cheeks: true }, { kind: 'small', color: 'blue' },
  { kind: 'squint', color: 'black' }, { kind: 'oval', color: 'black' }, { kind: 'dot', color: 'blue', cheeks: true }, { kind: 'lid', color: 'blue' },
  { kind: 'oval', color: 'green' }, { kind: 'arc', color: 'brown' }, { kind: 'dot', color: 'blue' }, { kind: 'circle', color: 'green' },
];

function eyes(face: number): string {
  const f = FACE_DEF[face % 16];
  const c = EYE[f.color];
  const lashes = face >= 8 && f.kind !== 'squint';
  const one = (x: number, dir: 1 | -1) => {
    let s = '';
    switch (f.kind) {
      case 'dot': s = `<ellipse cx="${x}" cy="56" rx="4.2" ry="5.6" fill="${c}"/><circle cx="${x + 1.4}" cy="54" r="1.5" fill="#fff"/>`; break;
      case 'lash': s = `<ellipse cx="${x}" cy="56" rx="4.4" ry="5.4" fill="${c}"/><circle cx="${x + 1.4}" cy="54" r="1.5" fill="#fff"/><path d="M${x + 4.2 * dir} 54.5 l${2.6 * dir} -1" stroke="#2b2222" stroke-width="1.6" stroke-linecap="round"/>`; break;
      case 'lid': s = `<ellipse cx="${x}" cy="57" rx="4.6" ry="5" fill="${c}"/><path d="M${x - 5.5} 54.5 Q${x} 50 ${x + 5.5} 54.5 Z" fill="${'#000'}" opacity=".0"/><path d="M${x - 5.5} 55 Q${x} 50.5 ${x + 5.5} 55" stroke="#2b2222" stroke-width="2.2" fill="none" stroke-linecap="round"/>`; break;
      case 'small': s = `<circle cx="${x}" cy="56" r="5" fill="#fff" stroke="#2b2222" stroke-width="1.4"/><circle cx="${x}" cy="56.5" r="2.2" fill="${c}"/>`; break;
      case 'arc': s = `<path d="M${x - 5} 57 Q${x} 50 ${x + 5} 57" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/>`; break;
      case 'oval': s = `<ellipse cx="${x}" cy="56" rx="3.4" ry="6.2" fill="${c}"/><ellipse cx="${x + 1}" cy="53.6" rx="1.1" ry="1.6" fill="#fff"/>`; break;
      case 'squint': s = `<path d="M${x - 5} 56 Q${x} 52 ${x + 5} 56" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M${x + 5 * dir} 55 l${3 * dir} -2" stroke="#2b2222" stroke-width="1.6" stroke-linecap="round"/>`; break;
      case 'circle': s = `<circle cx="${x}" cy="56" r="5.6" fill="#fff" stroke="#2b2222" stroke-width="1.2"/><circle cx="${x}" cy="56.6" r="3.6" fill="${c}"/><circle cx="${x + 1.3}" cy="55" r="1.2" fill="#fff"/>`; break;
    }
    if (lashes && f.kind !== 'lash') s += `<path d="M${x + 4.2 * dir} 54.5 l${2.6 * dir} -1" stroke="#2b2222" stroke-width="1.5" stroke-linecap="round"/>`;
    if (f.brows) s += `<path d="M${x - 5} 46 Q${x} 43.5 ${x + 5} 46" stroke="#4a3426" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    return s;
  };
  let s = one(40, -1) + one(60, 1);
  if (f.cheeks) s += '<ellipse cx="33" cy="65" rx="5" ry="3" fill="#ff8fa3" opacity=".6"/><ellipse cx="67" cy="65" rx="5" ry="3" fill="#ff8fa3" opacity=".6"/>';
  return s + '<path d="M46 69 Q50 72 54 69" stroke="#9a5a3c" stroke-width="1.8" fill="none" stroke-linecap="round"/>';
}

/** Hair drawn in two layers: behind the head and in front of it. */
function hair(style: number, fill: string, shade: string): [string, string] {
  const p = (d: string, f = fill) => `<path d="${d}" fill="${f}" stroke="${shade}" stroke-width="1.5" stroke-linejoin="round"/>`;
  const cap = 'M20 52 C18 26 34 14 50 14 C66 14 82 26 80 52 C74 40 64 36 50 36 C36 36 26 40 20 52 Z';
  switch (style % 16) {
    case 0: return ['', p('M23 46 C22 26 36 18 50 18 C64 18 78 26 77 46 C70 38 62 35 50 35 C38 35 30 38 23 46 Z')];
    case 1: return ['', p(cap) + p('M46 16 C44 6 54 4 58 10 C54 10 52 13 52 17 Z')];
    case 2: return ['', p('M20 54 C17 26 34 13 52 14 C70 15 84 28 80 52 C74 44 66 42 60 40 C50 50 36 52 20 54 Z')];
    case 3: return ['', p('M20 50 L14 34 L28 36 L26 18 L40 28 L46 8 L54 26 L66 10 L68 30 L84 24 L78 40 L86 48 C76 40 64 36 50 36 C36 36 26 40 20 50 Z')];
    case 4: return ['', p('M19 56 C16 26 34 14 50 14 C66 14 84 26 81 56 C78 44 68 38 52 36 L50 30 L48 36 C32 38 22 44 19 56 Z')];
    case 5: return ['', p('M20 52 C18 24 34 14 50 14 C66 14 82 24 80 52 L72 40 L66 46 L60 38 L50 44 L40 38 L34 46 L28 40 Z')];
    case 6: return ['', p('M17 56 C14 24 34 12 50 12 C66 12 86 24 83 56 L83 46 C70 44 60 43 50 43 C40 43 30 44 17 46 Z')];
    case 7: return ['', p('M19 52 C16 26 34 13 50 13 C66 13 84 26 81 52 L76 42 L70 48 L64 39 L57 47 L50 38 L43 47 L36 39 L30 48 L24 42 Z')];
    case 8: return [p('M18 50 C10 64 12 80 22 84 C20 72 24 62 28 56 Z') + p('M82 50 C90 64 88 80 78 84 C80 72 76 62 72 56 Z'),
      p('M20 54 C16 26 34 13 52 14 C70 15 84 28 80 52 C70 44 58 40 46 42 C36 44 28 48 20 54 Z')];
    case 9: return [p('M16 54 C12 30 30 12 50 12 C70 12 88 30 84 54 C86 66 82 74 78 76 L22 76 C18 74 14 66 16 54 Z'),
      p('M19 50 C17 26 34 14 50 14 C66 14 83 26 81 50 C76 42 66 40 60 44 C56 38 44 38 40 44 C34 40 24 42 19 50 Z')];
    case 10: return [p('M16 40 C4 40 2 58 8 70 C12 62 16 56 22 52 Z') + p('M84 40 C96 40 98 58 92 70 C88 62 84 56 78 52 Z') +
      `<circle cx="16" cy="42" r="4" fill="#ff6b8b"/><circle cx="84" cy="42" r="4" fill="#ff6b8b"/>`, p(cap)];
    case 11: return [p('M22 58 C16 66 18 80 22 90 C26 80 28 68 26 58 Z') + p('M78 58 C84 66 82 80 78 90 C74 80 72 68 74 58 Z') + p('M46 8 C44 0 56 0 54 8 C58 14 42 14 46 8 Z'), p(cap)];
    case 12: return [p('M70 20 C92 18 96 44 88 64 C86 50 82 40 74 34 Z') + `<circle cx="74" cy="24" r="4" fill="#ff6b8b"/>`, p(cap)];
    case 13: return [p('M38 12 C36 0 64 0 62 12 C58 18 42 18 38 12 Z'), p(cap)];
    case 14: return ['', p('M19 56 C16 26 34 13 50 13 C66 13 84 26 81 56 C76 46 66 42 56 42 C58 36 54 34 50 34 C42 36 30 42 19 56 Z')];
    case 15: return [[[18, 52], [14, 66], [20, 78], [82, 52], [86, 66], [80, 78]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${fill}" stroke="${shade}" stroke-width="1.5"/>`).join(''),
      p('M19 52 C14 30 30 12 50 12 C70 12 86 30 81 52 C78 44 70 40 62 42 C60 36 54 36 50 40 C46 36 40 36 38 42 C30 40 22 44 19 52 Z')];
  }
  return ['', ''];
}

export function playerSvg(o: { hairstyle: number; hairColor: number; face: number; tan: number; size?: number; cls?: string }): string {
  const c = HAIR_COLORS[o.hairColor % HAIR_COLORS.length];
  const [back, front] = hair(o.hairstyle, c.hex, c.shade);
  const skin = skinFor(o.tan);
  const s = o.size ?? 96;
  return `<svg class="${o.cls ?? ''}" viewBox="0 0 100 100" width="${s}" height="${s}" aria-hidden="true">
    ${back}
    <ellipse cx="50" cy="56" rx="31" ry="29" fill="${skin}" stroke="#d29c74" stroke-width="1.5"/>
    <ellipse cx="19.5" cy="58" rx="5" ry="6.5" fill="${skin}" stroke="#d29c74" stroke-width="1.5"/>
    <ellipse cx="80.5" cy="58" rx="5" ry="6.5" fill="${skin}" stroke="#d29c74" stroke-width="1.5"/>
    ${eyes(o.face)}
    ${front}
  </svg>`;
}

export const EYE_COLORS = [
  { id: 'brown', name: 'Marron', hex: EYE.brown }, { id: 'black', name: 'Noirs', hex: EYE.black },
  { id: 'blue', name: 'Bleus', hex: EYE.blue }, { id: 'green', name: 'Verts', hex: EYE.green },
] as const;
export const faceEyeColor = (face: number) => FACE_DEF[face % 16].color;
