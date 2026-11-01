// Saves the edited file: native share sheet on Android (Capacitor), download or share sheet on the web.
import { Capacitor } from '@capacitor/core';

export async function saveFile(bytes: Uint8Array, name: string): Promise<string> {
  if (Capacitor.isNativePlatform()) {
    const { Filesystem, Directory } = await import('@capacitor/filesystem');
    const { Share } = await import('@capacitor/share');
    let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    const res = await Filesystem.writeFile({ path: name, data: btoa(bin), directory: Directory.Cache });
    await Share.share({ title: name, files: [res.uri] });
    return 'Fichier prêt à être partagé ou enregistré.';
  }
  const blob = new Blob([bytes as Uint8Array<ArrayBuffer>], { type: 'application/octet-stream' });
  const file = new File([blob], name, { type: 'application/octet-stream' });
  // iOS Safari: the share sheet lets you "Enregistrer dans Fichiers".
  if (/iPad|iPhone|iPod/.test(navigator.userAgent) && navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: name }); return 'Fichier exporté.'; } catch { /* cancelled: fall back */ }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  return 'Fichier téléchargé.';
}
