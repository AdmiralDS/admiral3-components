import react from '@vitejs/plugin-react';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

const packageJson = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf8'));
const peerDependencies = Object.keys(packageJson.peerDependencies ?? {});
const srcPath = resolve(__dirname, 'src');
const entryPath = resolve(srcPath, 'index.ts');
const componentsPath = resolve(srcPath, 'components');
const componentNames = readdirSync(componentsPath, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && /^[A-Z][A-Za-z0-9]*$/.test(entry.name))
  .map((entry) => entry.name)
  .sort((first, second) => first.localeCompare(second));
const libraryEntries = Object.fromEntries([
  ['index', entryPath],
  ...componentNames.map((componentName) => [
    `components/${componentName}/index`,
    resolve(componentsPath, componentName, 'index.ts'),
  ]),
]);

export default defineConfig({
  plugins: [react(), svgr()],
  publicDir: false,
  resolve: {
    alias: {
      '#src': srcPath,
      '@admiral-ds/admiral3-components': entryPath,
    },
  },
  build: {
    lib: {
      entry: libraryEntries,
      formats: ['es'],
    },
    rollupOptions: {
      external: (id) => peerDependencies.some((dependency) => id === dependency || id.startsWith(`${dependency}/`)),
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
      },
    },
  },
});
