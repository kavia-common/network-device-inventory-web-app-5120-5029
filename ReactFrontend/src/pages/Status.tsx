import React from 'react';
import { api, getApiBaseUrl } from '../config/api';

// PUBLIC_INTERFACE
export default function Status(): JSX.Element {
  /** Simple connectivity checker to GET /health and display the result or a clear error. */
  const apiBase = getApiBaseUrl();
  const [health, setHealth] = React.useState<'checking' | 'ok' | 'error'>('checking');
  const [detail, setDetail] = React.useState<any>(null);

  const check = React.useCallback(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    console.info('[Status] Checking backend health at:', `${apiBase}/health`);
    api
      .get('/health', { signal: controller.signal })
      .then((res) => {
        setHealth('ok');
        setDetail(res.data);
        console.info('[Status] Backend health response:', res.data);
      })
      .catch((err) => {
        setHealth('error');
        const status = err?.response?.status;
        const text = err?.message || 'Unknown error';
        setDetail({
          message: 'Failed to reach backend /health',
          status,
          error: text
        });
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
    <div style={{ fontFamily: 'system-ui, Arial, sans-serif', padding: 16 }}>
      <h2>Status</h2>
      <div style={{ marginTop: 12, padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
        <strong>Backend health:</strong> {health}
        <div style={{ marginTop: 8 }}>
          <button onClick={check} style={{ padding: '6px 10px', cursor: 'pointer' }}>
            Re-check
          </button>
        </div>
        <pre style={{ background: '#f7f7f7', padding: 12, overflowX: 'auto' }}>
          {detail ? JSON.stringify(detail, null, 2) : 'No details yet'}
        </pre>
        <div style={{ fontSize: 12, color: '#555' }}>Backend API base: {apiBase}</div>
      </div>
      <div style={{ marginTop: 16 }}>
        <a href="/">Back to Home</a>
      </div>
    </div>
  );
}
