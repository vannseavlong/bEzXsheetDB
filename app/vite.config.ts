import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: true
  },
  // Strip console.* and debugger in production only
  ...(mode === 'production' && {
    esbuild: {
      drop: ['console', 'debugger']
    }
  }),
  build: {
    minify: 'esbuild'
  }
}));
