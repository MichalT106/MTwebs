import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Keep in sync with scripts/siteConfig.mjs (BASE_PATH)
const base = '/MTweb/';

export default defineConfig({
  plugins: [react()],
  base,
  build: {
    outDir: 'dist/MTweb',
    emptyOutDir: false,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
});
