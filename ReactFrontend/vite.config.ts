import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * PUBLIC_INTERFACE
 * Vite configuration for React + TypeScript app.
 * - Sets dev server and preview to run on port 3000 to match platform expectations.
 * - host: true to allow external access when containerized.
 * - Reads VITE_PORT if provided, defaults to 3000.
 */
const port = Number(process.env.VITE_PORT || 3000);

export default defineConfig({
  plugins: [react()],
  server: {
    port,
    host: true
  },
  preview: {
    port,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
