import villagersRaw from './data/villagers.json';
import itemsRaw from './data/items.json';

export interface VillagerInfo { id: number; name: string; species: string; }
export interface ItemInfo { id: number; name: string; category: string; }

export const SPECIES_FR: Record<string, string> = {
  Anteater: 'Fourmilier', Bear: 'Ours', Bird: 'Oiseau', Bull: 'Taureau', Cat: 'Chat', Cub: 'Ourson',
  Chicken: 'Poule', Cow: 'Vache', Alligator: 'Alligator', Dog: 'Chien', Duck: 'Canard', Elephant: 'Éléphant',
  Frog: 'Grenouille', Goat: 'Chèvre', Gorilla: 'Gorille', Hippo: 'Hippopotame', Horse: 'Cheval', Koala: 'Koala',
  Kangaroo: 'Kangourou', Lion: 'Lion', Mouse: 'Souris', Octopus: 'Pieuvre', Ostrich: 'Autruche', Eagle: 'Aigle',
  Penguin: 'Pingouin', Pig: 'Cochon', Rabbit: 'Lapin', Rhino: 'Rhinocéros', Tiger: 'Tigre', Wolf: 'Loup', Monkey: 'Singe',
};

// Emoji + colour per species for the original avatars.
export const SPECIES_STYLE: Record<string, { emoji: string; color: string }> = {
  Anteater: { emoji: '🐜', color: '#e8b4b8' }, Bear: { emoji: '🐻', color: '#c89f7a' }, Bird: { emoji: '🐦', color: '#8ecae6' },
  Bull: { emoji: '🐂', color: '#b5838d' }, Cat: { emoji: '🐱', color: '#ffb703' }, Cub: { emoji: '🧸', color: '#f4a261' },
  Chicken: { emoji: '🐔', color: '#ffd6a5' }, Cow: { emoji: '🐮', color: '#e9edc9' }, Alligator: { emoji: '🐊', color: '#95d5b2' },
  Dog: { emoji: '🐶', color: '#ddb892' }, Duck: { emoji: '🦆', color: '#fdf0a6' }, Elephant: { emoji: '🐘', color: '#bde0fe' },
  Frog: { emoji: '🐸', color: '#99d98c' }, Goat: { emoji: '🐐', color: '#e0e1dd' }, Gorilla: { emoji: '🦍', color: '#9a8c98' },
  Hippo: { emoji: '🦛', color: '#cdb4db' }, Horse: { emoji: '🐴', color: '#d4a373' }, Koala: { emoji: '🐨', color: '#adb5bd' },
  Kangaroo: { emoji: '🦘', color: '#e9c46a' }, Lion: { emoji: '🦁', color: '#f6bd60' }, Mouse: { emoji: '🐭', color: '#ffc8dd' },
  Octopus: { emoji: '🐙', color: '#ff8fab' }, Ostrich: { emoji: '🦤', color: '#f7cad0' }, Eagle: { emoji: '🦅', color: '#a3b18a' },
  Penguin: { emoji: '🐧', color: '#90e0ef' }, Pig: { emoji: '🐷', color: '#ffafcc' }, Rabbit: { emoji: '🐰', color: '#fbc4ab' },
  Rhino: { emoji: '🦏', color: '#c9ada7' }, Tiger: { emoji: '🐯', color: '#f8961e' }, Wolf: { emoji: '🐺', color: '#a2d2ff' },
  Monkey: { emoji: '🐵', color: '#d5bdaf' },
};

export const PERSONALITIES_FR = ['Paresseux ♂', 'Sportif ♂', 'Grincheux ♂', 'Normale ♀', 'Pimpante ♀', 'Snob ♀'];

export const VILLAGERS: VillagerInfo[] = villagersRaw as VillagerInfo[];
export const VILLAGER_BY_ID = new Map(VILLAGERS.map(v => [v.id, v]));

export const ITEMS: ItemInfo[] = (itemsRaw as [number, string, string][]).map(([id, name, category]) => ({ id, name, category }));
export const ITEM_BY_ID = new Map(ITEMS.map(i => [i.id, i]));

/** Categories that make sense in the player's pockets (not trees, rocks, buildings…). */
export const POCKET_CATEGORIES = new Set([
  'Stationary', 'Wallpaper', 'Carpets', 'Shirts', 'Insects', 'Fish', 'Songs', 'Tools', 'Umbrellas', 'Hats', 'Flowers',
  'Glasses/Masks', 'Bells', 'Flower Bags', 'Fruit', 'Saplings', 'Paint', 'Turnips', 'Fossil', 'Sea Shells', 'Items', 'Furniture', 'Garbage',
]);

export const CATEGORY_FR: Record<string, string> = {
  Stationary: 'Papier à lettres', Wallpaper: 'Papiers peints', Carpets: 'Moquettes', Shirts: 'Vêtements', Insects: 'Insectes',
  Fish: 'Poissons', Songs: 'Musiques de K.K.', Tools: 'Outils', Umbrellas: 'Parapluies', Hats: 'Chapeaux', Flowers: 'Fleurs',
  'Glasses/Masks': 'Lunettes / masques', Bells: 'Clochettes', 'Flower Bags': 'Sachets de graines', Fruit: 'Fruits',
  Saplings: 'Pousses', Paint: 'Peinture', Turnips: 'Navets', Fossil: 'Fossiles', 'Sea Shells': 'Coquillages', Items: 'Objets divers',
  Furniture: 'Meubles', Garbage: 'Déchets',
};

export function itemName(id: number): string {
  if (id === 0xfff1) return '— vide —';
  return ITEM_BY_ID.get(id)?.name ?? `Objet 0x${id.toString(16).toUpperCase().padStart(4, '0')}`;
}
