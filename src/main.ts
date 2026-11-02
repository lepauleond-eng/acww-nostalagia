import './style.css';
import { AcwwSave, SaveError, EMPTY_ITEM, NO_VILLAGER, WALLET_MAX, BANK_MAX, Villager } from './core/save';
import { CHEATS } from './core/cheats';
import { VILLAGERS, VILLAGER_BY_ID, SPECIES_FR, SPECIES_STYLE, PERSONALITIES_FR, ITEMS, ITEM_BY_ID, POCKET_CATEGORIES, CATEGORY_FR, itemName } from './core/data';
import { isEncodable } from './core/charset';
import { saveFile } from './export';
import { loadImages, imageFor, importImages, clearImages } from './images';
import { villagerSvg } from './art/villager';
import { itemIconSvg } from './art/items';
import { playerSvg, HAIRSTYLES, FACES, HAIR_COLORS, skinFor, tanLabel, TAN_LEVELS } from './art/player';

type Tab = 'ville' | 'villageois' | 'joueurs' | 'poches' | 'astuces';
const state: { save: AcwwSave | null; fileName: string; tab: Tab; player: number; dirty: boolean } =
  { save: null, fileName: 'ACWW.sav', tab: 'villageois', player: 0, dirty: false };

const app = document.getElementById('app')!;
const esc = (s: string) => s.replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
const fmt = (n: number) => n.toLocaleString('fr-FR');

const itemIcon = (id: number) => (id === EMPTY_ITEM ? '' : itemIconSvg(ITEM_BY_ID.get(id)?.category ?? ''));

function avatar(id: number, size = ''): string {
  const v = VILLAGER_BY_ID.get(id);
  if (!v) return `<span class="avatar ${size}">❔</span>`;
  const img = imageFor(id);
  const st = SPECIES_STYLE[v.species] ?? { color: '#cde' };
  return img
    ? `<span class="avatar" style="background-image:url('${img}');background-color:${st.color}"></span>`
    : `<span class="avatar art">${villagerSvg(v.species, v.id)}</span>`;
}

function toast(msg: string) {
  document.querySelector('.toast')?.remove();
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2700);
}

function changed(msg?: string) { state.dirty = true; if (msg) toast(msg); render(); }

/* ---------------- Top screen ---------------- */
function topScreen(): string {
  const s = state.save;
  const leaves = Array.from({ length: 6 }, (_, i) =>
    `<span class="falling" style="left:${8 + i * 15}%;animation-duration:${6 + (i % 3) * 2}s;animation-delay:${i * 1.3}s">${i % 2 ? '🍃' : '🍂'}</span>`).join('');
  const clouds = [[20, 70, 18, 38], [60, 50, 14, 52], [110, 90, 22, 30]].map(([top, w, h, d], i) =>
    `<span class="cloud" style="top:${top}px;width:${w}px;height:${h}px;animation-duration:${d}s;animation-delay:-${i * 9}s"></span>`).join('');
  let status = '<span class="pill">Charge un fichier .sav pour commencer</span>';
  if (s) {
    const n = s.villagers.filter(v => v.exists).length;
    status = `<span class="pill">🏡 ${esc(s.townName || 'Ville')}</span><span class="pill">🐾 ${n}/8 villageois</span>` +
      (state.dirty ? '<span class="pill warn">✏️ Modifié, pense à exporter</span>' : `<span class="pill ${s.checksumValid ? 'ok' : 'warn'}">${s.checksumValid ? '✔ Sauvegarde saine' : '⚠ Checksum à corriger'}</span>`);
  }
  return `<div class="screen"><div class="screen-inner top">${clouds}${leaves}<div class="hills"></div>
    <div class="title"><h1><span class="leaf">🍃</span> Feuille</h1><div class="sub">Éditeur de sauvegardes Wild World</div></div>
    <div class="status">${status}</div></div></div>`;
}

/* ---------------- Panels ---------------- */
function loadPanel(): string {
  return `<div class="panel"><label class="drop" id="drop"><span class="big">📂</span>
      <b>Touche ici pour ouvrir ta sauvegarde</b><div class="hint">Fichier .sav (ou .dsv DeSmuME) de la version FR / EUR.<br>Tout reste sur ton appareil, rien n'est envoyé en ligne.</div>
      <input type="file" id="file" accept=".sav,.dsv,.bin,application/octet-stream" hidden></label>
    <div class="card" style="margin-top:14px"><h2>💡 Comment récupérer le .sav ?</h2>
      <div class="hint">Avec une carte type R4 / TWiLight Menu, le fichier est à côté du jeu sur la carte SD. Sur émulateur (DeSmuME, melonDS, DraStic), exporte la sauvegarde depuis le menu. Garde toujours une copie de l'original.</div></div></div>`;
}

function villagersPanel(s: AcwwSave): string {
  const cards = s.villagers.map((v, i) => {
    const info = VILLAGER_BY_ID.get(v.species);
    return v.exists && info
      ? `<button class="vcard" data-vslot="${i}" style="animation-delay:${i * 40}ms">${avatar(v.species)}<div class="nm">${esc(info.fr)}</div><div class="sp">${SPECIES_FR[info.species] ?? info.species}</div></button>`
      : `<button class="vcard empty" data-vslot="${i}" style="animation-delay:${i * 40}ms"><span class="avatar">🏚️</span><div class="nm">Libre</div><div class="sp">emplacement ${i + 1}</div></button>`;
  }).join('');
  return `<div class="panel"><h2>🐾 Tes villageois</h2><div class="hint">Touche un villageois pour le remplacer ou changer son caractère.</div>
    <div class="grid">${cards}</div>
    <div class="card" style="margin-top:14px"><h2>🖼️ Tes images</h2>
      <div class="hint">Importe tes propres images, nommées comme le villageois (ex. <i>Robert.png</i> ou <i>Bob.png</i>). Elles restent sur ton appareil.</div>
      <div class="row"><label class="btn green" style="display:inline-block;padding:10px 16px;border-radius:14px;cursor:pointer;color:#fff;font-weight:600;background:var(--grass);box-shadow:0 4px 0 var(--grass-dark)">Importer des images<input type="file" id="imgs" accept="image/*" multiple hidden></label>
      <button class="btn ghost" id="clearimgs">Effacer</button></div></div></div>`;
}

function villagerModal(slot: number) {
  const s = state.save!; const v: Villager = s.villagers[slot];
  const bySpecies = new Map<string, typeof VILLAGERS>();
  for (const x of VILLAGERS) { if (!bySpecies.has(x.species)) bySpecies.set(x.species, []); bySpecies.get(x.species)!.push(x); }
  const persoOpts = PERSONALITIES_FR.map((p, i) => `<option value="${i}" ${v.personality === i ? 'selected' : ''}>${p}</option>`).join('');
  const m = modal(`<h2>${v.exists ? '🔁 Remplacer' : '➕ Installer'} un villageois</h2>
    ${!v.exists ? '<div class="hint">⚠️ Expérimental : installer un villageois sur un emplacement libre peut ne pas fonctionner (pas de maison). Remplacer un villageois existant est plus sûr.</div>' : ''}
    ${v.exists ? `<label class="field">Caractère<select id="perso">${persoOpts}</select></label>` : ''}
    <input id="q" placeholder="Rechercher (nom ou espèce)…" autocomplete="off">
    <div class="list" id="list"></div>
    ${v.exists ? '<button class="btn ghost" id="evict">Faire partir ce villageois</button>' : ''}`);
  const list = m.querySelector('#list')!;
  const draw = (q: string) => {
    const nq = q.trim().toLowerCase();
    let html = '';
    for (const [sp, arr] of bySpecies) {
      const spFr = SPECIES_FR[sp] ?? sp;
      const hits = arr.filter(x => !nq || x.fr.toLowerCase().includes(nq) || x.name.toLowerCase().includes(nq) || spFr.toLowerCase().includes(nq));
      if (!hits.length) continue;
      html += `<div class="group">${spFr}</div>` +
        hits.map(x => `<button class="opt" data-pick="${x.id}">${avatar(x.id)}<span><b>${esc(x.fr)}</b><small>${spFr}${x.fr !== x.name ? ` · ${esc(x.name)} en anglais` : ''}</small></span></button>`).join('');
    }
    list.innerHTML = html || '<div class="hint">Aucun résultat.</div>';
  };
  draw('');
  m.querySelector<HTMLInputElement>('#q')!.oninput = e => draw((e.target as HTMLInputElement).value);
  list.addEventListener('click', e => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-pick]'); if (!b) return;
    const id = Number(b.dataset.pick);
    if (s.villagers.some((o, i) => i !== slot && o.species === id)) { toast('Ce villageois habite déjà en ville.'); return; }
    v.species = id; closeModal(); changed(`Bienvenue à ${VILLAGER_BY_ID.get(id)?.fr} ! 🎉`);
  });
  m.querySelector<HTMLSelectElement>('#perso')?.addEventListener('change', e => { v.personality = Number((e.target as HTMLSelectElement).value); changed('Caractère modifié.'); });
  m.querySelector('#evict')?.addEventListener('click', () => {
    askConfirm('Faire partir ce villageois ? Sa maison peut rester en ville tant que le jeu ne l\'a pas retirée.', 'Faire partir', () => {
      v.species = NO_VILLAGER; changed('Le villageois a fait ses valises. 👋');
    });
  });
}

function playerSelect(s: AcwwSave): string {
  const ps = s.players.map((p, i) => p.exists ? `<option value="${i}" ${state.player === i ? 'selected' : ''}>${esc(p.name || `Joueur ${i + 1}`)}</option>` : '').join('');
  return `<label class="field">Joueur<select id="psel">${ps || '<option>Aucun joueur</option>'}</select></label>`;
}

function playersPanel(s: AcwwSave): string {
  const p = s.players[state.player];
  if (!p.exists) return `<div class="panel"><div class="hint">Aucun joueur dans cette sauvegarde.</div></div>`;
  const hc = HAIR_COLORS[p.hairColor % HAIR_COLORS.length];
  return `<div class="panel"><h2>🧑 Joueur</h2><div class="row" style="margin-bottom:10px">${playerSelect(s)}</div>
    <div class="card"><div class="row"><span class="pill">${p.gender === 'garçon' ? '👦' : '👧'} ${esc(p.name)}</span></div>
      <div class="row" style="margin-top:10px">
        <label class="field">💰 Porte-monnaie (max ${fmt(WALLET_MAX)})<input type="number" inputmode="numeric" min="0" max="${WALLET_MAX}" id="wallet" value="${p.wallet}"></label>
        <label class="field">🏦 Banque (max ${fmt(BANK_MAX)})<input type="number" inputmode="numeric" min="0" max="${BANK_MAX}" id="bank" value="${p.bank}"></label>
      </div></div>
    <div class="card look"><h2>💇 Apparence</h2>
      <div class="look-grid">
        <div class="mirror">${playerSvg({ hairstyle: p.hairstyle, hairColor: p.hairColor, face: p.face, tan: p.tan, size: 132, cls: 'bob' })}</div>
        <div class="look-btns">
          <button class="look-btn" id="pick-hair"><span class="lb-ico">${playerSvg({ hairstyle: p.hairstyle, hairColor: p.hairColor, face: p.face, tan: 0, size: 40 })}</span><span><small>Coiffure</small><b>${HAIRSTYLES[p.hairstyle] ?? `n°${p.hairstyle + 1}`}</b></span></button>
          <button class="look-btn" id="pick-color"><span class="lb-ico swatch" style="background:${hc.hex}"></span><span><small>Couleur des cheveux</small><b>${hc.name}</b></span></button>
          <button class="look-btn" id="pick-face"><span class="lb-ico">${playerSvg({ hairstyle: p.hairstyle, hairColor: p.hairColor, face: p.face, tan: 0, size: 40 })}</span><span><small>Visage</small><b>${FACES[p.face] ?? `n°${p.face + 1}`}</b></span></button>
          <div class="tan-row" role="group" aria-label="Bronzage"><small>Bronzage : <b>${tanLabel(p.tan)}</b></small>
            <div>${Array.from({ length: TAN_LEVELS }, (_, i) => `<button class="tan ${p.tan === i ? 'on' : ''}" data-tan="${i}" title="${tanLabel(i)}" style="background:${skinFor(i)}"></button>`).join('')}</div></div>
        </div>
      </div>
      <div class="hint">Les coiffures et visages 1 à 8 sont ceux des garçons, 9 à 16 ceux des filles. Dans le jeu, le salon de coiffure ne propose que ceux de ton genre.</div>
    </div>
    <div id="palette" class="palette" hidden>${HAIR_COLORS.map((c, i) => `<button class="sw ${p.hairColor === i ? 'on' : ''}" data-color="${i}" style="--c:${c.hex}"><span></span>${c.name}</button>`).join('')}</div>
  </div>`;
}

function lookModal(kind: 'hair' | 'face') {
  const p = state.save!.players[state.player];
  const list = kind === 'hair' ? HAIRSTYLES : FACES;
  const cur = kind === 'hair' ? p.hairstyle : p.face;
  const cell = (i: number) => `<button class="look-cell ${cur === i ? 'on' : ''}" data-look-pick="${i}">
      ${playerSvg({ hairstyle: kind === 'hair' ? i : p.hairstyle, hairColor: p.hairColor, face: kind === 'face' ? i : p.face, tan: p.tan, size: 76 })}
      <span><b>${i + 1}.</b> ${list[i]}</span></button>`;
  const m = modal(`<h2>${kind === 'hair' ? '💇 Choisir une coiffure' : '👀 Choisir un visage'}</h2>
    <div class="list"><div class="group">Garçon</div><div class="look-cells">${[0, 1, 2, 3, 4, 5, 6, 7].map(cell).join('')}</div>
    <div class="group">Fille</div><div class="look-cells">${[8, 9, 10, 11, 12, 13, 14, 15].map(cell).join('')}</div></div>`);
  m.addEventListener('click', e => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-look-pick]'); if (!b) return;
    const v = Number(b.dataset.lookPick);
    if (kind === 'hair') p.hairstyle = v; else p.face = v;
    closeModal(); changed(kind === 'hair' ? `Nouvelle coiffure : ${list[v]} ✂️` : `Nouveau visage : ${list[v]}`);
  });
}

function pocketsPanel(s: AcwwSave): string {
  const p = s.players[state.player];
  const slots = Array.from({ length: 15 }, (_, i) => {
    const id = p.pocket(i);
    return `<button class="slot ${id !== EMPTY_ITEM ? 'filled' : ''}" data-pocket="${i}"><span><span class="ico">${itemIcon(id) || ''}</span>${id !== EMPTY_ITEM ? esc(itemName(id)) : ''}</span></button>`;
  }).join('');
  return `<div class="panel"><h2>🎒 Poches</h2><div class="row" style="margin-bottom:10px">${playerSelect(s)}</div>
    <div class="hint">Touche une case pour y mettre n'importe quel objet du jeu.</div><div class="pockets">${slots}</div></div>`;
}

function itemModal(slot: number) {
  const p = state.save!.players[state.player];
  const pool = ITEMS.filter(i => POCKET_CATEGORIES.has(i.category));
  const m = modal(`<h2>🎁 Choisir un objet</h2><input id="q" placeholder="Rechercher un objet (français ou anglais)…" autocomplete="off">
    <div class="list" id="list"></div><button class="btn ghost" id="empty">Vider la case</button>`);
  const list = m.querySelector('#list')!;
  const draw = (q: string) => {
    const nq = q.trim().toLowerCase();
    const fold = (t: string) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const fq = fold(nq);
    const hits = pool.filter(i => !fq || fold(i.fr ?? '').includes(fq) || i.name.toLowerCase().includes(fq) || fold(CATEGORY_FR[i.category] ?? '').includes(fq))
      .map(i => { const f = fold(i.fr ?? ''); return { i, r: !fq ? 0 : f.startsWith(fq) ? 0 : new RegExp(`\\b${fq.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(f) ? 1 : i.fr ? 2 : 3 }; })
      .sort((a, b) => a.r - b.r).map(x => x.i).slice(0, 150);
    list.innerHTML = hits.map(i => `<button class="opt" data-item="${i.id}"><span class="avatar icon">${itemIconSvg(i.category)}</span><span><b>${esc(i.fr ?? i.name)}</b><small>${CATEGORY_FR[i.category] ?? i.category}${i.fr ? ` · ${esc(i.name)}` : ' · nom anglais'}</small></span></button>`).join('')
      || '<div class="hint">Aucun objet trouvé.</div>';
  };
  draw('');
  m.querySelector<HTMLInputElement>('#q')!.oninput = e => draw((e.target as HTMLInputElement).value);
  list.addEventListener('click', e => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-item]'); if (!b) return;
    p.setPocket(slot, Number(b.dataset.item)); closeModal(); changed('Objet ajouté. ✨');
  });
  m.querySelector('#empty')!.addEventListener('click', () => { p.setPocket(slot, EMPTY_ITEM); closeModal(); changed(); });
}

function cheatsPanel(s: AcwwSave): string {
  return `<div class="panel"><h2>✨ Codes magiques</h2><div class="hint">Comme des codes Action Replay, mais écrits directement dans la sauvegarde.</div>
    <div class="row" style="margin-bottom:10px">${playerSelect(s)}</div>
    ${CHEATS.map(c => `<div class="card cheat"><div><div class="t">${c.title}</div><div class="d">${c.description}</div></div><button class="btn pink" data-cheat="${c.id}">Activer</button></div>`).join('')}</div>`;
}

function townPanel(s: AcwwSave): string {
  return `<div class="panel"><h2>🏡 Ma ville</h2>
    <div class="card"><label class="field">Nom de la ville (8 caractères max)<input id="town" maxlength="8" value="${esc(s.townName)}"></label>
      <div class="hint">⚠️ Le nom est aussi copié dans les lettres et chez les villageois. Le changer ici modifie l'affichage principal ; à tester sur une copie.</div></div>
    <div class="card"><h2>📦 Fichier</h2><div class="hint">${esc(state.fileName)} · région ${s.region === 'EUR' ? 'Europe (FR)' : 'USA'} · ${(s.data.length / 1024) | 0} Ko</div>
      <div class="row"><button class="btn green" id="export">💾 Exporter le .sav</button><button class="btn ghost" id="close">Ouvrir un autre fichier</button></div></div></div>`;
}

/* ---------------- Rendering ---------------- */
function render() {
  const s = state.save;
  const tabs: [Tab, string][] = [['villageois', '🐾 Villageois'], ['joueurs', '🧑 Joueur'], ['poches', '🎒 Poches'], ['astuces', '✨ Codes'], ['ville', '🏡 Ville']];
  let body = loadPanel();
  if (s) {
    body = { ville: townPanel, villageois: villagersPanel, joueurs: playersPanel, poches: pocketsPanel, astuces: cheatsPanel }[state.tab](s);
  }
  app.innerHTML = `<div class="ds">${topScreen()}<div class="hinge"></div>
    <div class="screen"><div class="screen-inner bottom">
      ${s ? `<div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button class="tab" role="tab" data-tab="${k}" aria-selected="${state.tab === k}"><span class="ti">${l.split(' ')[0]}</span>${l.split(' ').slice(1).join(' ')}</button>`).join('')}</div>` : ''}
      ${body}
      ${s ? `<div style="padding:0 14px 14px"><button class="btn green" id="export2" style="width:100%">💾 Exporter le .sav modifié</button></div>` : ''}
    </div></div></div>
    <footer>Projet de fan non officiel · Animal Crossing est une marque de Nintendo · format documenté par ACWW Research</footer>`;
  bind();
}

function bind() {
  const $ = <T extends HTMLElement>(sel: string) => app.querySelector<T>(sel);
  const file = $<HTMLInputElement>('#file');
  if (file) {
    file.onchange = () => file.files?.[0] && openFile(file.files[0]);
    const drop = $('#drop')!;
    drop.ondragover = e => { e.preventDefault(); drop.classList.add('over'); };
    drop.ondragleave = () => drop.classList.remove('over');
    drop.ondrop = e => { e.preventDefault(); const f = e.dataTransfer?.files[0]; if (f) openFile(f); };
  }
  app.querySelectorAll<HTMLElement>('[data-tab]').forEach(b => b.onclick = () => { state.tab = b.dataset.tab as Tab; render(); });
  app.querySelectorAll<HTMLElement>('[data-vslot]').forEach(b => b.onclick = () => villagerModal(Number(b.dataset.vslot)));
  app.querySelectorAll<HTMLElement>('[data-pocket]').forEach(b => b.onclick = () => itemModal(Number(b.dataset.pocket)));
  app.querySelectorAll<HTMLElement>('[data-cheat]').forEach(b => b.onclick = () => {
    const c = CHEATS.find(x => x.id === b.dataset.cheat)!; changed(c.apply(state.save!, state.player));
  });
  const psel = $<HTMLSelectElement>('#psel'); if (psel) psel.onchange = () => { state.player = Number(psel.value); render(); };
  const s = state.save; if (!s) return;
  const p = s.players[state.player];
  const wallet = $<HTMLInputElement>('#wallet'); if (wallet) wallet.onchange = () => { p.wallet = Number(wallet.value); changed('Porte-monnaie mis à jour.'); };
  const bank = $<HTMLInputElement>('#bank'); if (bank) bank.onchange = () => { p.bank = Number(bank.value); changed('Compte en banque mis à jour.'); };
  const ph = $('#pick-hair'); if (ph) ph.onclick = () => lookModal('hair');
  const pf = $('#pick-face'); if (pf) pf.onclick = () => lookModal('face');
  const pc = $('#pick-color'), pal = $('#palette');
  if (pc && pal) {
    pc.onclick = () => { pal.hidden = !pal.hidden; if (!pal.hidden) { pc.after(pal); pal.classList.remove('open'); void pal.offsetWidth; pal.classList.add('open'); } };
    pal.querySelectorAll<HTMLElement>('[data-color]').forEach(b => b.onclick = () => { p.hairColor = Number(b.dataset.color); changed(`Cheveux : ${HAIR_COLORS[p.hairColor].name}`); });
  }
  app.querySelectorAll<HTMLElement>('[data-tan]').forEach(b => b.onclick = () => { p.tan = Number(b.dataset.tan); changed(`Bronzage : ${tanLabel(p.tan)}`); });
  const town = $<HTMLInputElement>('#town');
  if (town) town.onchange = () => {
    const bad = [...town.value].filter(c => !isEncodable(c));
    if (bad.length) { toast(`Caractères non pris en charge : ${bad.join(' ')}`); return; }
    s.townName = town.value; changed('Nom de la ville modifié.');
  };
  for (const id of ['#export', '#export2']) { const b = $(id); if (b) b.onclick = doExport; }
  const close = $('#close'); if (close) close.onclick = () => {
    const reset = () => { state.save = null; state.dirty = false; render(); };
    if (!state.dirty) reset(); else askConfirm('Fermer sans exporter les modifications ?', 'Fermer', reset);
  };
  const imgs = $<HTMLInputElement>('#imgs');
  if (imgs) imgs.onchange = async () => {
    if (!imgs.files?.length) return;
    const r = await importImages(imgs.files);
    toast(`${r.ok} image(s) ajoutée(s)${r.unknown.length ? ` · non reconnues : ${r.unknown.slice(0, 3).join(', ')}` : ''}`); render();
  };
  const clr = $('#clearimgs'); if (clr) clr.onclick = async () => { await clearImages(); toast('Images effacées.'); render(); };
}

async function openFile(f: File) {
  try {
    const save = new AcwwSave(new Uint8Array(await f.arrayBuffer()));
    state.save = save; state.fileName = f.name; state.dirty = false;
    state.player = Math.max(0, save.players.findIndex(p => p.exists));
    state.tab = 'villageois';
    render();
    toast(`Bienvenue à ${save.townName || 'ta ville'} ! 🍃`);
  } catch (e) {
    toast(e instanceof SaveError ? e.message : 'Impossible de lire ce fichier.');
  }
}

async function doExport() {
  const s = state.save!;
  if (import.meta.env.VITE_PREVIEW) { toast("Aperçu : l'export marche dans l'app installée."); return; }
  try {
    const name = state.fileName.replace(/(\.[^.]+)?$/, m => `-modifie${m || '.sav'}`);
    const msg = await saveFile(s.export(), name);
    state.dirty = false; toast(`${msg} 💾`); render();
  } catch (e) { toast('Export impossible : ' + (e as Error).message); }
}

/* ---------------- Modal helpers ---------------- */
function modal(html: string): HTMLElement {
  closeModal();
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.innerHTML = `<div class="modal" role="dialog">${html}<button class="btn ghost" data-close>Fermer</button></div>`;
  bg.addEventListener('click', e => { if (e.target === bg || (e.target as HTMLElement).closest('[data-close]')) closeModal(); });
  document.body.appendChild(bg);
  setTimeout(() => bg.querySelector<HTMLInputElement>('#q')?.focus({ preventScroll: true }), 50);
  return bg.querySelector('.modal')!;
}
function askConfirm(question: string, okLabel: string, onOk: () => void) {
  const m = modal(`<h2>🤔 ${esc(question)}</h2><button class="btn pink" id="ok">${esc(okLabel)}</button>`);
  m.querySelector('#ok')!.addEventListener('click', () => { closeModal(); onOk(); });
}
function closeModal() { document.querySelector('.modal-bg')?.remove(); }

window.addEventListener('beforeunload', e => { if (state.dirty) e.preventDefault(); });
if ('serviceWorker' in navigator && import.meta.env.PROD && location.protocol === 'https:') navigator.serviceWorker.register('sw.js');

loadImages().finally(async () => {
  if (import.meta.env.VITE_PREVIEW) {
    const { demoSave } = await import('./demo');
    state.save = new AcwwSave(demoSave()); state.fileName = 'exemple.sav';
  }
  render();
  if (import.meta.env.VITE_PREVIEW) toast('Aperçu avec une ville d\'exemple 🍃');
});
