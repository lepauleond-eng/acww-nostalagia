// Small original item icons, one per category. Furniture uses a leaf, like a packed item.
const W = (inner: string) => `<svg viewBox="0 0 40 40" width="100%" height="100%" aria-hidden="true">${inner}</svg>`;
const ST = 'stroke="#5a4632" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"';

const ICONS: Record<string, string> = {
  leaf: W(`<path d="M8 32 C6 16 18 6 34 6 C34 22 24 34 8 32 Z" fill="#7cc47f" ${ST}/><path d="M8 32 L26 14" ${ST} fill="none"/>`),
  shirt: W(`<path d="M13 7 L6 12 L9 18 L13 16 L13 33 L27 33 L27 16 L31 18 L34 12 L27 7 Q20 12 13 7 Z" fill="#7fb7e6" ${ST}/>`),
  hat: W(`<ellipse cx="20" cy="27" rx="15" ry="5" fill="#e88aa2" ${ST}/><path d="M11 27 C11 14 29 14 29 27 Z" fill="#f2a7b9" ${ST}/>`),
  glasses: W(`<circle cx="12" cy="21" r="6.5" fill="#cfe9ff" ${ST}/><circle cx="28" cy="21" r="6.5" fill="#cfe9ff" ${ST}/><path d="M18.5 20 Q20 18 21.5 20" fill="none" ${ST}/>`),
  umbrella: W(`<path d="M5 20 C5 10 35 10 35 20 Z" fill="#f5b041" ${ST}/><path d="M20 20 L20 31 Q20 35 16 34" fill="none" ${ST}/>`),
  fish: W(`<path d="M6 20 C12 10 26 10 31 20 C26 30 12 30 6 20 Z" fill="#8ecae6" ${ST}/><path d="M31 20 L37 14 L37 26 Z" fill="#8ecae6" ${ST}/><circle cx="12" cy="18" r="1.6" fill="#5a4632"/>`),
  bug: W(`<ellipse cx="13" cy="16" rx="7" ry="6" fill="#f6bd60" ${ST}/><ellipse cx="27" cy="16" rx="7" ry="6" fill="#f6bd60" ${ST}/><ellipse cx="14" cy="27" rx="5" ry="4.5" fill="#f28482" ${ST}/><ellipse cx="26" cy="27" rx="5" ry="4.5" fill="#f28482" ${ST}/><path d="M20 10 L20 32" ${ST}/>`),
  bells: W(`<path d="M12 12 Q20 6 28 12 L32 30 Q20 36 8 30 Z" fill="#f2d16b" ${ST}/><path d="M14 11 L26 11" ${ST}/><text x="20" y="27" font-size="11" text-anchor="middle" font-family="sans-serif" font-weight="700" fill="#8a6a1e">$</text>`),
  fruit: W(`<circle cx="20" cy="23" r="11" fill="#f26b5b" ${ST}/><path d="M20 12 Q21 7 24 6" fill="none" ${ST}/><path d="M21 10 C24 6 30 7 30 9 C27 11 24 11 21 10 Z" fill="#7cc47f" ${ST}/>`),
  flower: W(`<g fill="#f7a8c4" ${ST}><circle cx="20" cy="11" r="6"/><circle cx="29" cy="18" r="6"/><circle cx="26" cy="28" r="6"/><circle cx="14" cy="28" r="6"/><circle cx="11" cy="18" r="6"/></g><circle cx="20" cy="20" r="4.5" fill="#ffd166" ${ST}/>`),
  seeds: W(`<path d="M10 10 L30 10 L32 34 L8 34 Z" fill="#e9d5a8" ${ST}/><circle cx="20" cy="22" r="5" fill="#f7a8c4" ${ST}/>`),
  sapling: W(`<path d="M20 34 L20 18" ${ST}/><path d="M20 22 C12 22 10 14 12 12 C18 12 20 16 20 22 Z" fill="#7cc47f" ${ST}/><path d="M20 18 C26 18 30 12 28 9 C22 9 20 13 20 18 Z" fill="#7cc47f" ${ST}/><path d="M12 34 L28 34" ${ST}/>`),
  shell: W(`<path d="M20 8 L6 28 Q20 36 34 28 Z" fill="#fbc4ab" ${ST}/><path d="M20 8 L14 31 M20 8 L20 33 M20 8 L26 31" ${ST} fill="none"/>`),
  fossil: W(`<ellipse cx="20" cy="22" rx="13" ry="10" fill="#d9c7a8" ${ST}/><path d="M14 18 L26 26 M16 26 L24 18" ${ST}/>`),
  tool: W(`<path d="M10 30 L26 14" stroke="#a0703f" stroke-width="4" stroke-linecap="round"/><path d="M22 8 L32 18 L28 22 L18 12 Z" fill="#b8c4d0" ${ST}/>`),
  paper: W(`<rect x="7" y="10" width="26" height="20" rx="2" fill="#fff8e7" ${ST}/><path d="M7 11 L20 22 L33 11" fill="none" ${ST}/>`),
  song: W(`<path d="M15 28 L15 10 L31 7 L31 25" fill="none" ${ST}/><circle cx="12" cy="28" r="4" fill="#9c89b8" ${ST}/><circle cx="28" cy="25" r="4" fill="#9c89b8" ${ST}/>`),
  wall: W(`<rect x="8" y="8" width="24" height="24" rx="2" fill="#bde0fe" ${ST}/><path d="M8 16 L32 16 M8 24 L32 24 M16 8 L16 16 M24 16 L24 24 M16 24 L16 32" ${ST}/>`),
  carpet: W(`<path d="M6 26 L18 12 L34 14 L22 30 Z" fill="#cdb4db" ${ST}/><path d="M14 22 L24 16" ${ST}/>`),
  turnip: W(`<path d="M20 14 C30 14 32 26 20 34 C8 26 10 14 20 14 Z" fill="#f4f1ea" ${ST}/><path d="M20 14 C16 6 12 8 14 4 M20 14 C24 6 28 8 26 4" fill="none" stroke="#5a8f4a" stroke-width="2.2" stroke-linecap="round"/>`),
  paint: W(`<path d="M10 14 L30 14 L28 34 L12 34 Z" fill="#cfd8dc" ${ST}/><path d="M10 14 Q20 20 30 14 L30 18 Q20 26 10 18 Z" fill="#f28482" ${ST}/>`),
  gift: W(`<rect x="8" y="16" width="24" height="17" rx="2" fill="#ffd166" ${ST}/><rect x="6" y="11" width="28" height="6" rx="2" fill="#ffd166" ${ST}/><path d="M20 11 L20 33" stroke="#e85d75" stroke-width="3"/>`),
  trash: W(`<path d="M12 12 L28 12 L26 33 L14 33 Z" fill="#a3b18a" ${ST}/><path d="M10 12 L30 12" ${ST}/>`),
  tree: W(`<circle cx="20" cy="16" r="11" fill="#7cc47f" ${ST}/><rect x="17" y="24" width="6" height="10" fill="#a0703f" ${ST}/>`),
};

const CAT: Record<string, string> = {
  Furniture: 'leaf', Shirts: 'shirt', Hats: 'hat', 'Custom Hats': 'hat', 'Glasses/Masks': 'glasses', Umbrellas: 'umbrella', Fish: 'fish', Insects: 'bug',
  Bells: 'bells', Fruit: 'fruit', Flowers: 'flower', 'Flower Bags': 'seeds', Saplings: 'sapling', 'Sea Shells': 'shell', Fossil: 'fossil', Tools: 'tool',
  Stationary: 'paper', 'Note in a Bottle': 'paper', Songs: 'song', Wallpaper: 'wall', Carpets: 'carpet', Turnips: 'turnip', 'Spoiled Turnips': 'turnip',
  Paint: 'paint', Items: 'gift', 'Lost Item': 'gift', Garbage: 'trash', Trees: 'tree', 'Palm Trees': 'tree', Acorns: 'fruit',
};

export function itemIconSvg(category: string): string { return ICONS[CAT[category] ?? 'gift']; }
