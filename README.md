# 🍃 Feuille : éditeur de sauvegardes Animal Crossing: Wild World

Application (web + Android) pour modifier les sauvegardes **.sav** d'Animal Crossing: Wild World, version **française / européenne**.
Tout se passe sur l'appareil : aucun fichier n'est envoyé en ligne.

## Ce qu'on peut faire
- 🐾 **Villageois** : remplacer un villageois par n'importe lequel des 150, changer son caractère, le faire partir
- 🧑 **Joueur** : clochettes (porte-monnaie, banque), coiffure, couleur, visage, bronzage
- 🎒 **Poches** : mettre n'importe quel objet du jeu dans les 15 cases
- ✨ **Codes** (façon Action Replay) : clochettes au max, désherbage, poches pleines de sacs de 99 000…
- 🏡 **Ville** : renommer la ville
- 💾 **Export** : la somme de contrôle est recalculée et la copie de secours du jeu est synchronisée automatiquement
- 🖼️ **Tes images** : importe tes propres images de villageois (nommées `Bob.png`, `Rosie.jpg`…), elles restent sur ton appareil

## Installer
- **iPhone / iPad** : ouvre le site GitHub Pages du dépôt dans **Safari** → bouton Partager → **Sur l'écran d'accueil**. L'app marche ensuite hors ligne.
- **Android** : télécharge `Feuille.apk` dans la release **latest** du dépôt (compilée automatiquement par GitHub Actions), puis autorise l'installation depuis cette source.

## Toujours garder une copie
Garde une copie de ton `.sav` d'origine avant chaque modification. Les fonctions marquées « expérimental » (installer un villageois sur un emplacement vide, renommer la ville) sont à tester sur une copie.

## Développement
```bash
npm install
npm run dev      # serveur local
npm test         # tests du format de sauvegarde
npm run build    # build web dans dist/
npx cap add android && npx cap sync android   # projet Android (Capacitor)
```

## Crédits
Format de sauvegarde documenté par [ACWW Research (Universal-Team)](https://wiki.universal-team.net/acww-research/) et l'éditeur [LeafEdit](https://github.com/Universal-Team/LeafEdit) (GPLv3), dont proviennent aussi les listes d'identifiants des villageois et des objets.
Projet de fan non officiel. Animal Crossing est une marque de Nintendo ; aucune image ni donnée du jeu n'est incluse. Les avatars sont des créations originales.

Licence : GPL-3.0-or-later.
