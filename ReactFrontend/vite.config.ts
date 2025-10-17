import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * PUBLIC_INTERFACE
 * Vite configuration for React + TypeScript app.
 * - Binds dev server and preview to 0.0.0.0 on port 3000 by default to match platform expectations.
 * - Reads VITE_PORT if provided; defaults to 3000.
 * - strictPort ensures Vite fails fast if the port is not available.
 */
const port = Number(process.env.VITE_PORT) || 3000;

// Configure a consistent HMR clientPort for environments that expose 3000 externally.
// If the server runs behind a reverse proxy, clientPort must match the public port.
const hmrClientPort = Number(process.env.VITE_HMR_CLIENT_PORT) || 3000;

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // true == 0.0.0.0
    port,
    strictPort: true,
    open: false,
    hmr: {
      clientPort: hmrClientPort
    }
  },
  preview: {
    host: true, // bind to 0.0.0.0
    port,
    strictPort: true,
    // ensure HMR client connects properly during preview in some hosting envs
    hmr: {
      clientPort: hmrClientPort
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
