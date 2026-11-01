// Wild World character table (EUR/USA). Index = byte value in the save.
// Source of the mapping: ACWW Research (Universal-Team). 0 = end of string.
const TABLE: string[] = [
  '\0','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O',
  'P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e',
  'f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u',
  'v','w','x','y','z','0','1','2','3','4','5','6','7','8','9','⨍',
  'ⓢ','Œ','Ž','š','œ','ž','Ÿ','À','Á','Â','Ã','Ä','Å','Æ','Ç','È',
  'É','Ê','Ë','Ì','Í','Î','Ï','Đ','Ñ','Ò','Ó','Ô','Õ','Ö','Ø','Ù',
  'Ú','Û','Ü','Ý','Þ','β','à','á','â','ã','ä','å','æ','ç','è','é',
  'ê','ë','ì','í','î','ï','ð','ñ','ò','ó','ô','õ','ö','ø','ù','ú',
  'û','ü','ý','þ','ÿ',' ','\n','!','"','#','$','%','&','´','(',')',
  '*','+',',','-','.','/',':',';','<','=','>','?','@','[','\\',']',
  '^','_','´','{','|','}','~','€','‚','„','…','†','‡','＾','‰','⟨',
  '‘','’','“','”','•','–','—','˜','™','⟩',' ','¡','¢','£','¤','¥',
  '╎','§','¨','©','ª','«','¬','-','®','‾','°','±','²','³','⁄','µ',
  '¶','•','¸','¹','º','»','¼','½','¾','¿','×','÷','☔','★','❤','♪',
];

export function decodeWW(bytes: Uint8Array): string {
  let s = '';
  for (const b of bytes) {
    const c = TABLE[b];
    if (!c || c === '\0') break;
    s += c;
  }
  return s;
}

export function encodeWW(text: string, length: number): Uint8Array {
  const out = new Uint8Array(length);
  let i = 0;
  for (const ch of text) {
    if (i >= length) break;
    const idx = TABLE.indexOf(ch);
    if (idx > 0) out[i++] = idx;
  }
  return out;
}

export function isEncodable(ch: string): boolean {
  return TABLE.indexOf(ch) > 0;
}
