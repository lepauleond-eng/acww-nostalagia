// "Jouer" tab: where and how to load the edited save. Links point to the emulators only, never to games.
export type Platform = 'ios' | 'android' | 'pc';

export interface Emulator {
  id: string; name: string; platform: Platform; url: string; store: string; ext: 'sav';
  steps: string[];
}

export const EMULATORS: Emulator[] = [
  { id: 'delta', name: 'Delta', platform: 'ios', url: 'https://apps.apple.com/fr/app/id1048524688', store: 'App Store', ext: 'sav',
    steps: ['Exporte le .sav ci-dessus et choisis « Enregistrer dans Fichiers ».', 'Dans Delta, appuie longuement sur la jaquette du jeu.', 'Choisis « Importer une sauvegarde » puis sélectionne le fichier.'] },
  { id: 'melonds-android', name: 'melonDS', platform: 'android', url: 'https://play.google.com/store/apps/details?id=me.magnum.melonds', store: 'Play Store', ext: 'sav',
    steps: ['Exporte le .sav avec exactement le même nom que ton fichier de jeu (.nds).', 'Place-le dans le même dossier que le jeu, en remplaçant l’ancien.', 'Relance le jeu dans melonDS.'] },
  { id: 'drastic', name: 'DraStic', platform: 'android', url: 'https://play.google.com/store/apps/details?id=com.dsemu.drastic', store: 'Play Store', ext: 'sav',
    steps: ['Exporte le .sav avec le même nom que ton jeu.', 'Renomme l’extension .sav en .dsv.', 'Copie-le dans le dossier DraStic/backup, puis relance le jeu.'] },
  { id: 'melonds', name: 'melonDS', platform: 'pc', url: 'https://melonds.kuribo64.net', store: 'Site officiel', ext: 'sav',
    steps: ['Exporte le .sav avec le même nom que ton jeu (.nds).', 'Mets-le à côté du jeu, en remplaçant l’ancien.', 'Ouvre le jeu dans melonDS.'] },
  { id: 'desmume', name: 'DeSmuME', platform: 'pc', url: 'https://desmume.org', store: 'Site officiel', ext: 'sav',
    steps: ['Ouvre ton jeu dans DeSmuME.', 'Menu Fichier → Importer la mémoire de sauvegarde (Import Backup Memory).', 'Choisis le .sav exporté, puis redémarre le jeu.'] },
];

export const CARTRIDGE_STEPS = ['Exporte le .sav avec le même nom que le fichier du jeu sur la carte SD.',
  'Avec TWiLight Menu, place-le dans le dossier « saves » à côté du jeu ; sinon, juste à côté du .nds.', 'Remets la carte SD dans la console et lance le jeu.'];

export function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'pc';
}

export const PLATFORM_LABEL: Record<Platform, string> = { ios: '📱 iPhone / iPad', android: '🤖 Android', pc: '💻 Ordinateur' };

const KEY = 'feuille-rom-name';
export function getRomName(): string { try { return localStorage.getItem(KEY) ?? ''; } catch { return ''; } }
export function setRomName(v: string) { try { localStorage.setItem(KEY, v); } catch { /* ignore */ } }
