import { defineConfig, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * PUBLIC_INTERFACE
 * Vite configuration for React + TypeScript app.
 * - Binds dev server and preview to 0.0.0.0 on a preferred port (default 3000).
 * - Reads PORT from env (or VITE_PORT), defaults to 3000.
 * - strictPort is disabled to allow automatic fallback to the next available port (e.g., 3002).
 * - Adds a small startup banner showing the chosen host/port and whether a fallback was used.
 */
const rawPort = process.env.PORT || process.env.VITE_PORT || '3000';
const PORT = Number(rawPort) || 3000;

// Configure a consistent HMR clientPort for environments that expose a specific public port.
// If the server runs behind a reverse proxy, clientPort must match the public port.
const HMR_CLIENT_PORT = Number(process.env.VITE_HMR_CLIENT_PORT || PORT);

// A tiny plugin to log helpful startup information, including fallback warnings.
/** Startup banner plugin that logs the resolved server URL and warns if fallback from 3000 occurred. */
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

        const hadFallbackFrom3000 = Number(rawPort || 3000) === 3000 && usedPort !== 3000;

        // eslint-disable-next-line no-console
        console.log(
          `[Vite] Dev server ready at: http://${usedAddress === '::' ? '0.0.0.0' : usedAddress}:${usedPort}`
        );
        if (hadFallbackFrom3000) {
          // eslint-disable-next-line no-console
          console.warn(
            `[Vite] Warning: port 3000 was not available; fell back to port ${usedPort}.`
          );
        }
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

        const hadFallbackFrom3000 = Number(rawPort || 3000) === 3000 && usedPort !== 3000;

        // eslint-disable-next-line no-console
        console.log(
          `[Vite] Preview server ready at: http://${usedAddress === '::' ? '0.0.0.0' : usedAddress}:${usedPort}`
        );
        if (hadFallbackFrom3000) {
          // eslint-disable-next-line no-console
          console.warn(
            `[Vite] Warning: port 3000 was not available; preview fell back to port ${usedPort}.`
          );
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), startupBanner()],
  server: {
    host: true, // true == 0.0.0.0
    port: PORT,
    // Allow fallback to the next available port to avoid "port 3000 not ready" failures.
    strictPort: false,
    open: false,
    hmr: {
      clientPort: HMR_CLIENT_PORT
    }
  },
  preview: {
    host: true, // bind to 0.0.0.0
    port: PORT,
    // Allow fallback in preview as well
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
