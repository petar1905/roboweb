import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { config } from 'dotenv';
import { resolve } from 'path';

config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../dist'
  },
  server: {
    port: 8080
  },
  define: {
    'process.env': process.env
  }
})
