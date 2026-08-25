import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import svgr from 'vite-plugin-svgr';

const rootPath = resolve(__dirname, 'playground');
const srcPath = resolve(__dirname, 'src');
const entryPath = resolve(srcPath, 'index.ts');

const svgReactFullReload = (): Plugin => ({
  // Самописный плагин нужен только playground: Vite не всегда корректно обновляет SVG,
  // импортированные как React-компоненты через `?react`, поэтому для них принудительно
  // отправляем full reload вместо обычного HMR.
  name: 'playground-svg-react-full-reload',
  // Запускаем плагин до остальных, чтобы успеть подписаться на исходный SVG до обработки svgr.
  enforce: 'pre',
  // Включаем плагин только в dev-server playground; на production build он не влияет.
  apply: 'serve',
  load(id) {
    // Vite передаёт id модуля вместе с query, например `icon.svg?react`.
    const [filePath, query] = id.split('?');

    // Если это SVG, импортированный как React-компонент, добавляем исходный файл в watch list.
    if (query === 'react' && filePath.endsWith('.svg')) {
      this.addWatchFile(filePath);
    }
  },
  hotUpdate(options) {
    // Изменения любых файлов, кроме SVG, этот плагин не обрабатывает.
    if (!options.file.endsWith('.svg')) {
      return;
    }

    // При изменении SVG просим браузер полностью перезагрузить playground.
    this.environment.hot.send({
      type: 'full-reload',
      path: '*',
      triggeredBy: options.file,
    });
    // Возвращаем пустой список модулей, чтобы Vite не запускал обычный HMR для этого SVG.
    return [];
  },
});

export default defineConfig({
  root: rootPath,
  plugins: [react(), svgReactFullReload(), svgr()],
  publicDir: false,
  resolve: {
    alias: {
      '#src': srcPath,
      '@admiral-ds/admiral3-components': entryPath,
    },
  },
  build: {
    outDir: resolve(__dirname, 'dist-playground'),
    emptyOutDir: true,
  },
});
