// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  // For local development only
  server: {
    proxy: {
      '/auth': 'http://localhost:4000',
      '/tickets': 'http://localhost:4000',
      '/comments': 'http://localhost:4000',
      '/logs': 'http://localhost:4000',
    },
  },

  // For deployment
  base: '/', // VERY important for serving from root
});
