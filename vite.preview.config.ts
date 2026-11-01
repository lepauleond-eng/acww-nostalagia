// Single-file build with an example town, used for the online preview.
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
export default defineConfig({ base: './', plugins: [viteSingleFile()], build: { outDir: 'dist-preview' }, define: { 'import.meta.env.VITE_PREVIEW': 'true' } });
