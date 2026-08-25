import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vitest/config';

const srcPath = resolve(__dirname, 'src');
const entryPath = resolve(srcPath, 'index.ts');

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '#src': srcPath,
      '@admiral-ds/admiral3-components': entryPath,
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['tests/**', 'node_modules/**', 'dist/**'],
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});
