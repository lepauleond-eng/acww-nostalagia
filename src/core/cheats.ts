// "Action Replay"-style effects, applied directly to the save instead of RAM.
import { AcwwSave, BANK_MAX, EMPTY_ITEM, TOWN_MAP_COUNT, WALLET_MAX } from './save';

export interface Cheat {
  id: string;
  title: string;
  description: string;
  apply(save: AcwwSave, playerIndex: number): string; // returns a short French result
}

const WEEDS = new Set([0x21, 0x22, 0x23, 0x24]);
const BAG_99000 = 0x14fd; // "99,000 Bells" in the item list

export const CHEATS: Cheat[] = [
  {
    id: 'max-bells',
    title: 'Clochettes au max',
    description: `Porte-monnaie à ${WALLET_MAX.toLocaleString('fr-FR')} et compte en banque à ${BANK_MAX.toLocaleString('fr-FR')}.`,
    apply(save, p) {
      const pl = save.players[p];
      pl.wallet = WALLET_MAX; pl.bank = BANK_MAX;
      return `Clochettes au maximum pour ${pl.name || 'le joueur'}.`;
    },
  },
  {
    id: 'remove-weeds',
    title: 'Désherbage instantané',
    description: 'Retire toutes les mauvaises herbes de la ville.',
    apply(save) {
      let n = 0;
      for (let i = 0; i < TOWN_MAP_COUNT; i++) if (WEEDS.has(save.townItem(i))) { save.setTownItem(i, EMPTY_ITEM); n++; }
      return n ? `${n} mauvaises herbes arrachées.` : 'Aucune mauvaise herbe trouvée.';
    },
  },
  {
    id: 'clear-pockets',
    title: 'Vider les poches',
    description: 'Vide les 15 emplacements des poches du joueur.',
    apply(save, p) {
      for (let i = 0; i < 15; i++) save.players[p].setPocket(i, EMPTY_ITEM);
      return 'Poches vidées.';
    },
  },
  {
    id: 'bell-bags',
    title: 'Poches pleines de sacs de 99 000',
    description: 'Remplit les poches avec des sacs de clochettes (à revendre ou déposer).',
    apply(save, p) {
      for (let i = 0; i < 15; i++) save.players[p].setPocket(i, BAG_99000);
      return '15 sacs de clochettes ajoutés.';
    },
  },
];

