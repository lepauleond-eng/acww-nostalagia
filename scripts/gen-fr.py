"""Builds French names for items and villagers.

1. Exact match against the official French names from Animal Crossing: New Horizons
   (Norviah/animal-crossing, MIT). Many Wild World items kept the same name.
2. Otherwise a small dictionary translates "<modifiers> <noun>" into "<noun> <modifiers>".
3. Otherwise the English name is kept (marked so the UI can show it).
Usage: python3 scripts/gen-fr.py <path to animal-crossing/json/combined>
"""
import json, re, sys

SRC = sys.argv[1]
OUT = 'src/core/data'

official = {}
for e in json.load(open(f'{SRC}/Translations.json')):
    for k in ('uSen', 'eUen'):
        n = (e.get(k) or '').lower().strip()
        if n and e.get('eUfr') and n not in official:
            official[n] = e['eUfr']

# noun: (french, gender)
NOUNS = {
 'bed': ('lit', 'm'), 'bureau': ('commode', 'f'), 'wardrobe': ('armoire', 'f'), 'armoire': ('armoire', 'f'), 'closet': ('placard', 'm'),
 'bench': ('banc', 'm'), 'chair': ('chaise', 'f'), 'table': ('table', 'f'), 'end table': ('table de chevet', 'f'), 'low table': ('table basse', 'f'),
 'lamp': ('lampe', 'f'), 'screen': ('paravent', 'm'), 'chest': ('coffre', 'm'), 'dresser': ('commode', 'f'), 'couch': ('canapé', 'm'),
 'sofa': ('sofa', 'm'), 'armchair': ('fauteuil', 'm'), 'bookcase': ('bibliothèque', 'f'), 'hutch': ('vaisselier', 'm'), 'vanity': ('coiffeuse', 'f'),
 'buffet': ('buffet', 'm'), 'desk': ('bureau', 'm'), 'clock': ('horloge', 'f'), 'cabinet': ('meuble', 'm'), 'counter': ('comptoir', 'm'),
 'pantry': ('garde-manger', 'm'), 'stereo': ('chaîne hi-fi', 'f'), 'loveseat': ('causeuse', 'f'), 'kitchen': ('cuisine', 'f'), 'fridge': ('frigo', 'm'),
 'tv': ('télé', 'f'), 'stool': ('tabouret', 'm'), 'stand': ('meuble', 'm'), 'shirt': ('haut', 'm'), 'tee': ('tee-shirt', 'm'), 'top': ('haut', 'm'),
 'wall': ('mur', 'm'), 'wallpaper': ('papier peint', 'm'), 'carpet': ('moquette', 'f'), 'rug': ('tapis', 'm'), 'flooring': ('sol', 'm'), 'floor': ('sol', 'm'),
 'tile': ('carrelage', 'm'), 'mat': ('tapis', 'm'), 'umbrella': ('parapluie', 'm'), 'parasol': ('ombrelle', 'f'), 'hat': ('chapeau', 'm'), 'cap': ('casquette', 'f'),
 'glasses': ('lunettes', 'fp'), 'frames': ('lunettes', 'fp'), 'shades': ('lunettes de soleil', 'fp'), 'mask': ('masque', 'm'), 'helmet': ('casque', 'm'),
 'paper': ('papier', 'm'), 'paint': ('peinture', 'f'), 'bag': ('sachet', 'm'), 'uniform': ('uniforme', 'm'), 'sweater': ('pull', 'm'), 'suit': ('costume', 'm'),
 'vest': ('gilet', 'm'), 'dress': ('robe', 'f'), 'coat': ('manteau', 'm'), 'jacket': ('veste', 'f'), 'veil': ('voile', 'm'), 'wig': ('perruque', 'f'),
 'beret': ('béret', 'm'), 'bandana': ('bandana', 'm'), 'tank': ('débardeur', 'm'), 'kimono': ('kimono', 'm'), 'robe': ('peignoir', 'm'), 'tunic': ('tunique', 'f'),
 'knit hat': ('bonnet', 'm'), 'knit cap': ('bonnet', 'm'), 'drum': ('bidon', 'm'), 'cone': ('cône', 'm'), 'fence': ('barrière', 'f'), 'box': ('boîte', 'f'),
 'vase': ('vase', 'm'), 'model': ('maquette', 'f'), 'painting': ('tableau', 'm'), 'pic': ('photo', 'f'), 'bonsai': ('bonsaï', 'm'), 'bathtub': ('baignoire', 'f'),
 'piano': ('piano', 'm'), 'guitar': ('guitare', 'f'), 'trophy': ('trophée', 'm'), 'stove': ('poêle', 'm'), 'pole': ('poteau', 'm'), 'tulips': ('tulipes', 'fp'),
 'tulip': ('tulipe', 'f'), 'pansies': ('pensées', 'fp'), 'cosmos': ('cosmos', 'mp'), 'roses': ('roses', 'fp'), 'rose': ('rose', 'f'), 'pawn': ('pion', 'm'),
 'bishop': ('fou', 'm'), 'king': ('roi', 'm'), 'knight': ('cavalier', 'm'), 'queen': ('reine', 'f'), 'rook': ('tour', 'f'), 'skull': ('crâne', 'm'),
 'cactus': ('cactus', 'm'), 'barrel': ('tonneau', 'm'), 'locker': ('casier', 'm'), 'flask': ('fiole', 'f'), 'machine': ('machine', 'f'),
 'torso': ('torse', 'm'), 'tail': ('queue', 'f'), 'skull': ('crâne', 'm'), 'tusk': ('défense', 'f'), 'fan': ('ventilateur', 'm'), 'light': ('lampe', 'f'),
 'sign': ('panneau', 'm'), 'tank': ('aquarium', 'm'), 'shelf': ('étagère', 'f'), 'mirror': ('miroir', 'm'), 'speaker': ('enceinte', 'f'), 'heater': ('radiateur', 'm'),
}
# adjective: masculine form (feminine derived) or (m, f)
ADJ = {
 'exotic': 'exotique', 'ranch': 'ranch', 'classic': 'classique', 'regal': 'royal', 'blue': 'bleu', 'cabana': 'cabana', 'green': 'vert', 'cabin': 'chalet',
 'modern': 'moderne', 'kiddie': 'enfant', 'lovely': 'mignon', 'robo': 'robot', 'snowman': 'bonhomme de neige', 'mush': 'champi', 'red': 'rouge',
 'white': 'blanc', 'black': 'noir', 'yellow': 'jaune', 'orange': 'orange', 'pink': 'rose', 'purple': 'violet', 'gray': 'gris', 'brown': 'marron',
 'gold': 'doré', 'golden': 'doré', 'silver': 'argenté', 'striped': 'rayé', 'tartan': 'écossais', 'plaid': 'à carreaux', 'check': 'à carreaux',
 'checkered': 'à damier', 'polka-dot': 'à pois', 'dot': 'à pois', 'floral': 'fleuri', 'flowery': 'fleuri', 'star': 'étoilé', 'rainbow': 'arc-en-ciel',
 'leopard': 'léopard', 'zebra': 'zèbre', 'tiger': 'tigre', 'giraffe': 'girafe', 'cow': 'vache', 'camo': 'camouflage', 'camouflage': 'camouflage',
 'tie-dye': 'tie-dye', 'gingham': 'vichy', 'argyle': 'losanges', 'pinstripe': 'à rayures fines', 'knit': 'en tricot', 'tall': 'haut', 'big': 'grand',
 'mini': 'mini', 'little': 'petit', "li'l": 'petit', 'old': 'vieux', 'new': 'neuf', 'cool': 'cool', 'hot': 'chaud', 'elegant': 'élégant', 'chic': 'chic',
 'chinese': 'chinois', 'egyptian': 'égyptien', 'western': 'western', 'tropical': 'tropical', 'retro': 'rétro', 'basic': 'simple', 'formal': 'chic',
 'sky': 'ciel', 'night': 'nuit', 'ocean': 'océan', 'forest': 'forêt', 'jungle': 'jungle', 'desert': 'désert', 'arctic': 'arctique', 'polar': 'polaire',
 'spring': 'printemps', 'fall': 'automne', 'winter': 'hiver', 'snowy': 'enneigé', 'icy': 'glacé', 'cloudy': 'nuageux', 'misty': 'brumeux',
 'sunset': 'couchant', 'dawn': 'aube', 'aurora': 'aurore', 'nebula': 'nébuleuse', 'butterfly': 'papillon', 'leaf': 'feuille', 'maple-leaf': 'érable',
 'four-leaf': 'trèfle', 'petal': 'pétale', 'lotus': 'lotus', 'bloom': 'fleur', 'blossom': 'fleur', 'citrus': 'agrumes', 'melon': 'melon',
 'watermelon': 'pastèque', 'grape': 'raisin', 'lemon-lime': 'citron vert', 'cherry': 'cerise', 'skull': 'tête de mort', 'flame': 'flammes',
 'lightning': 'éclair', 'heart': 'cœur', 'diamond': 'losange', 'spade': 'pique', 'club': 'trèfle', 'bubble': 'bulles', 'mosaic': 'mosaïque',
 'geometric': 'géométrique', 'optical': 'optique', 'wave': 'vagues', 'lacy': 'en dentelle', 'sparkly': 'scintillant', 'bejeweled': 'bijou',
 'airmail': 'par avion', 'lined': 'ligné', 'notebook': 'cahier', 'birthday': 'anniversaire', 'fireworks': 'feux d\'artifice', 'fairy': 'féerique',
 'industrial': 'industriel', 'southwest': 'sud-ouest', 'composer': 'compositeur', 'lab': 'labo', 'music': 'musique', 'kitchen': 'cuisine',
 'paw': 'patte', 'daisy': 'marguerite', 'ribbon': 'ruban', 'buttercup': 'bouton-d\'or', 'mint': 'menthe', 'jade': 'jade', 'beige': 'beige',
 'silk': 'soie', 'pastel': 'pastel', 'ornate': 'orné', 'brick': 'brique', 'persian': 'persan', 'round': 'rond', 'dark': 'sombre', 'light': 'clair',
 'aqua': 'turquoise', 'bright': 'vif', 'deep': 'profond', 'peachy': 'pêche', 'bold': 'audacieux', 'cafe': 'café', 'rugby': 'rugby', 'candy': 'bonbon',
 'waffle': 'gaufré', 'chevron': 'chevrons', 'comfy': 'douillet', 'earthy': 'terreux', 'dreamy': 'rêveur', 'pop': 'pop', 'loud': 'criard', 'coral': 'corail',
 'prism': 'prisme', 'future': 'futuriste', 'twinkle': 'scintillant', 'amethyst': 'améthyste', 'airy': 'aérien', 'fleece': 'polaire', 'splendid': 'splendide',
 'jagged': 'dentelé', 'subdued': 'sobre', 'sharp': 'chic', 'grass': 'herbe', 'snow': 'neige', 'go-go': 'go-go', 'danger': 'danger', 'block': 'blocs',
 'grid': 'quadrillé', 'funky': 'funky', 'stripe': 'rayé', 'feather': 'plumes', 'dutch': 'hollandais', 'vine': 'vigne', 'frog': 'grenouille',
 'bear': 'ours', 'elephant': 'éléphant', 'fox': 'renard', 'bunny': 'lapin', 'goldfish': 'poisson rouge', 'beetle': 'scarabée', 'pine': 'pin',
 'daffodil': 'jonquille', 'fern': 'fougère', 'dice': 'dés', 'picnic': 'pique-nique', 'lava': 'lave', 'lucky': 'porte-bonheur', 'stag': 'cerf',
 'opulent': 'opulent', 'boxing': 'boxe', 'office': 'bureau', 'writing': 'écriture', 'garden': 'jardin', 'wooden': 'en bois', 'iron': 'en fer',
 'steel': 'en acier', 'glass': 'en verre', 'stone': 'en pierre', 'marble': 'en marbre', 'card': 'cartes', 'cards': 'cartes', 'vegetarian': 'végétarien',
 'racer': 'pilote', 'checkerboard': 'damier', 'gumdrop': 'bonbon', 'chocomint': 'menthe chocolat', 'snowcone': 'granité', 'gelato': 'glace',
 'swell': 'chouette', 'vogue': 'tendance', 'natty': 'élégant', 'dapper': 'élégant', 'beatnik': 'beatnik', 'fresh': 'frais', 'chichi': 'chichi',
}
FEM_IRREG = {'blanc': 'blanche', 'violet': 'violette', 'royal': 'royale', 'mignon': 'mignonne', 'vieux': 'vieille', 'neuf': 'neuve', 'gris': 'grise',
             'doré': 'dorée', 'argenté': 'argentée', 'rayé': 'rayée', 'écossais': 'écossaise', 'fleuri': 'fleurie', 'étoilé': 'étoilée', 'haut': 'haute',
             'grand': 'grande', 'petit': 'petite', 'chaud': 'chaude', 'élégant': 'élégante', 'chinois': 'chinoise', 'égyptien': 'égyptienne',
             'tropical': 'tropicale', 'enneigé': 'enneigée', 'glacé': 'glacée', 'nuageux': 'nuageuse', 'brumeux': 'brumeuse', 'scintillant': 'scintillante',
             'ligné': 'lignée', 'industriel': 'industrielle', 'orné': 'ornée', 'persan': 'persane', 'rond': 'ronde', 'clair': 'claire', 'vif': 'vive',
             'profond': 'profonde', 'audacieux': 'audacieuse', 'gaufré': 'gaufrée', 'douillet': 'douillette', 'terreux': 'terreuse', 'rêveur': 'rêveuse',
             'criard': 'criarde', 'futuriste': 'futuriste', 'aérien': 'aérienne', 'dentelé': 'dentelée', 'quadrillé': 'quadrillée', 'hollandais': 'hollandaise',
             'opulent': 'opulente', 'végétarien': 'végétarienne', 'frais': 'fraîche', 'vert': 'verte', 'noir': 'noire', 'bleu': 'bleue', 'sombre': 'sombre',
             'polaire': 'polaire', 'arctique': 'arctique', 'féerique': 'féerique', 'géométrique': 'géométrique'}
# Words that are nouns used as complements ("lit vache" is odd): attach with "de"/"à" isn't worth it; we keep apposition, common in AC French names.

INFLECT = set(FEM_IRREG) | set(FEM_IRREG.values()) | {'rouge', 'jaune', 'moderne', 'classique', 'exotique', 'simple'}

def adj(word, gender):
    a = ADJ[word]
    if gender.startswith('f'):
        a = FEM_IRREG.get(a, a)
    if gender.endswith('p') and a in INFLECT and not a.endswith(('s', 'x')):
        a += 's'
    return a

def cap(s):
    return s[:1].upper() + s[1:] if s else s

def translate(name, cat):
    low = name.lower().strip()
    if low in official:
        return cap(official[low])
    # Category specific patterns
    m = re.match(r"^(.*) Paper \((\d+)\)$", name)
    if m:
        inner = translate_words(m.group(1).lower().split(), None)
        return f"Papier {inner} ({m.group(2)})" if inner else None
    m = re.match(r"^(.*?)'s Pic$", name)
    if m:
        who = VILL_FR.get(m.group(1).lower(), m.group(1))
        return f"Photo d'{who}" if who[:1].upper() in 'AEIOUYÉÈH' else f"Photo de {who}"
    m = re.match(r"^(.*) - \[(Parched|Watered)\]$", name)
    if m:
        base = official.get(m.group(1).lower())
        if base:
            return f"{cap(base)} ({'à arroser' if m.group(2) == 'Parched' else 'arrosage fait'})"
    m = re.match(r"^(.*) Bag$", name)
    if m and cat == 'Flower Bags':
        base = official.get(m.group(1).lower() + 's') or official.get(m.group(1).lower())
        return f"Graines de {base}" if base else None
    m = re.match(r"^(.*) Paint$", name)
    if m and m.group(1).lower() in ADJ:
        return f"Peinture {adj(m.group(1).lower(), 'f')}"
    m = re.match(r"^K\.K\. (.*)$", name)
    if m:
        return name  # song titles stay as in the game's credits
    words = re.sub(r'[()]', '', low).replace('robo-', 'robo ').split()
    return translate_words(words, None, full=True)

def translate_words(words, _g, full=False):
    # find the longest noun at the end
    for n in (2, 1):
        if len(words) >= n and ' '.join(words[-n:]) in NOUNS:
            fr, g = NOUNS[' '.join(words[-n:])]
            mods = words[:-n]
            if all(w in ADJ for w in mods):
                return cap(' '.join([fr] + [adj(w, g) for w in mods])) if full else ' '.join([fr] + [adj(w, g) for w in mods])
            return None
    if not full and all(w in ADJ for w in words):
        return ' '.join(ADJ[w] for w in words)
    return None

nh_vill = {v['name'].lower(): v['translations']['eUfr'] for v in json.load(open(f'{SRC}/Villagers.json'))}
villagers = json.load(open(f'{OUT}/villagers.json'))
VILL_FR = {v['name'].lower(): nh_vill.get(v['name'].lower(), v['name']) for v in villagers}
for v in villagers:
    v['fr'] = VILL_FR[v['name'].lower()]
json.dump(villagers, open(f'{OUT}/villagers.json', 'w'), ensure_ascii=False)

items = json.load(open(f'{OUT}/items.json'))
fr = {}
stats = [0, 0]
for i, name, cat in items:
    t = translate(name, cat)
    stats[0 if t else 1] += 1
    if t:
        fr[i] = t
json.dump(fr, open(f'{OUT}/items-fr.json', 'w'), ensure_ascii=False)
print('items translated', stats[0], 'kept English', stats[1])
