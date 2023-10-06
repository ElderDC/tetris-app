/// <reference types="Vite/client" />

import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    assetsDir: 'static',
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
            return 'static/media/[name]-[hash][extname]';
          }

          if (/\.css$/.test(name ?? '')) {
            return 'static/css/[name]-[hash][extname]';
          }

          // default value
          // ref: https://rollupjs.org/guide/en/#outputassetfilenames
          return 'static/[name]-[hash][extname]';
        },
      },
    },
  },
  resolve: {
    alias: {
      src: resolve('src/'),
      '@': resolve('src/'),
    },
  },
});
