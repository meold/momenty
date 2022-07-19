import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3003
  },
  build: {
    target: 'es2020',
    sourcemap: true,
    emptyOutDir: true,
    outDir: '../frontend-dist',
    chunkSizeWarningLimit: '2000k'
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  publicDir: path.resolve(__dirname, 'public'),
  define: {
    'process.env.NODE_DEBUG': 'false',
    'global': 'globalThis'
  }
});
