import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000
  },
  build: {
    target: 'es2020'
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
