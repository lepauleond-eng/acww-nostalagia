// User-provided villager pictures, kept on the device only (IndexedDB).
// Files are matched to villagers by file name, e.g. "Bob.png" or "15.png".
import { VILLAGERS } from './core/data';

const DB = 'feuille-images', STORE = 'villagers';
const cache = new Map<number, string>();

function open(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

export async function loadImages(): Promise<void> {
  try {
    const db = await open();
    await new Promise<void>((res) => {
      const req = db.transaction(STORE).objectStore(STORE).openCursor();
      req.onsuccess = () => {
        const c = req.result;
        if (!c) return res();
        cache.set(Number(c.key), URL.createObjectURL(c.value as Blob));
        c.continue();
      };
      req.onerror = () => res();
    });
  } catch { /* private mode: no stored images */ }
}

export function imageFor(id: number): string | undefined { return cache.get(id); }

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');

export async function importImages(files: FileList): Promise<{ ok: number; unknown: string[] }> {
  const byName = new Map(VILLAGERS.map(v => [norm(v.name), v.id]));
  let ok = 0; const unknown: string[] = [];
  let db: IDBDatabase | null = null;
  try { db = await open(); } catch { /* keep in memory only */ }
  for (const f of Array.from(files)) {
    const base = f.name.replace(/\.[^.]+$/, '');
    const id = /^\d+$/.test(base) ? Number(base) : byName.get(norm(base));
    if (id === undefined || !VILLAGERS.some(v => v.id === id)) { unknown.push(f.name); continue; }
    cache.set(id, URL.createObjectURL(f));
    if (db) db.transaction(STORE, 'readwrite').objectStore(STORE).put(f, id);
    ok++;
  }
  return { ok, unknown };
}

export async function clearImages(): Promise<void> {
  cache.clear();
  try { const db = await open(); db.transaction(STORE, 'readwrite').objectStore(STORE).clear(); } catch { /* ignore */ }
}
