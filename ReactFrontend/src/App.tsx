import React from 'react';
import axios from 'axios';

// PUBLIC_INTERFACE
export function Status(): JSX.Element {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
  const [health, setHealth] = React.useState<string>('checking...');
  const [detail, setDetail] = React.useState<any>(null);

  const check = React.useCallback(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    // Helpful runtime diagnostics
    // eslint-disable-next-line no-console
    console.info('[Status] Checking backend health at:', `${apiBase}/health`);

    axios
      .get(`${apiBase}/health`, { signal: controller.signal })
      .then((res) => {
        setHealth('ok');
        setDetail(res.data);
        // eslint-disable-next-line no-console
        console.info('[Status] Backend health response:', res.data);
      })
      .catch((err) => {
        setHealth('error');
        setDetail({ message: String(err) });
        // eslint-disable-next-line no-console
        console.warn('[Status] Backend health error:', err);
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [apiBase]);

  React.useEffect(() => {
    const cleanup = check();
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, [check]);

  return (
    <div style={{ marginTop: 12, padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
      <strong>Backend health:</strong> {health}
      <div style={{ marginTop: 8 }}>
        <button onClick={check} style={{ padding: '6px 10px', cursor: 'pointer' }}>
          Re-check
        </button>
      </div>
      <pre style={{ background: '#f7f7f7', padding: 12, overflowX: 'auto' }}>
        {detail ? JSON.stringify(detail, null, 2) : 'No details'}
      </pre>
      <div style={{ fontSize: 12, color: '#555' }}>Backend API base: {apiBase}</div>
    </div>
  );
}

// PUBLIC_INTERFACE
export default function App(): JSX.Element {
  return (
    <div style={{ fontFamily: 'system-ui, Arial, sans-serif', padding: 16 }}>
      <h1>Network Device Inventory</h1>
      <p>Welcome. Use this preview to verify connectivity to the backend.</p>
      <Status />
    </div>
  );
}
