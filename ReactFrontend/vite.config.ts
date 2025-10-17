import { defineConfig, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * PUBLIC_INTERFACE
 * Vite configuration for React + TypeScript app.
 * - Binds dev server and preview to 0.0.0.0 on a preferred port (default 3000).
 * - Reads PORT from env (or VITE_PORT), defaults to 3000.
 * - strictPort is disabled to allow automatic fallback to the next available port.
 * - Adds a startup banner showing the chosen host/port and whether a fallback was used.
 */
const preferredPort = process.env.PORT || process.env.VITE_PORT || '3000';
const PORT = Number(preferredPort) || 3000;

// Configure a consistent HMR clientPort for environments that expose a specific public port.
// If the server runs behind a reverse proxy, clientPort must match the public port.
const HMR_CLIENT_PORT = Number(process.env.VITE_HMR_CLIENT_PORT || PORT);

// A tiny plugin to log helpful startup information, including fallback warnings.
function startupBanner(): PluginOption {
  return {
    name: 'startup-banner',
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        const addr = server.httpServer?.address();
        const info =
          typeof addr === 'object' && addr
            ? { port: (addr as any).port, address: (addr as any).address }
            : { port: PORT, address: '0.0.0.0' };

        const usedPort = info.port;
        const usedAddress = info.address || '0.0.0.0';

        const hadFallbackFrom3000 = Number(preferredPort || 3000) === 3000 && usedPort !== 3000;

        // eslint-disable-next-line no-console
        console.log(
          `[Startup] Dev server ready: http://${usedAddress === '::' ? '0.0.0.0' : usedAddress}:${usedPort}`
        );
        if (hadFallbackFrom3000) {
          // eslint-disable-next-line no-console
          console.warn(`[Startup] Port 3000 unavailable; fell back to ${usedPort}.`);
        }
        // eslint-disable-next-line no-console
        console.log('[Startup] Static health: /health.html should return 200 with body "OK"');
      });
    },
    configurePreviewServer(server) {
      server.httpServer?.once('listening', () => {
        const addr = server.httpServer?.address();
        const info =
          typeof addr === 'object' && addr
            ? { port: (addr as any).port, address: (addr as any).address }
            : { port: PORT, address: '0.0.0.0' };

        const usedPort = info.port;
        const usedAddress = info.address || '0.0.0.0';

        const hadFallbackFrom3000 = Number(preferredPort || 3000) === 3000 && usedPort !== 3000;

        // eslint-disable-next-line no-console
        console.log(
          `[Startup] Preview server ready: http://${usedAddress === '::' ? '0.0.0.0' : usedAddress}:${usedPort}`
        );
        if (hadFallbackFrom3000) {
          // eslint-disable-next-line no-console
          console.warn(`[Startup] Port 3000 unavailable for preview; fell back to ${usedPort}.`);
        }
        // eslint-disable-next-line no-console
        console.log('[Startup] Static health: /health.html should return 200 with body "OK"');
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), startupBanner()],
  server: {
    host: true,
    port: PORT,
    strictPort: false,
    open: false,
    hmr: {
      clientPort: HMR_CLIENT_PORT
    }
  },
  preview: {
    host: true,
    port: PORT,
    strictPort: false,
    hmr: {
      clientPort: HMR_CLIENT_PORT
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
