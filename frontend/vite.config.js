import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:4000',
      '/tickets': 'http://localhost:4000',
      '/comments': 'http://localhost:4000',
      '/logs': 'http://localhost:4000'
    }
  }
});
