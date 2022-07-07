import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'es2020',
    minify: false
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
