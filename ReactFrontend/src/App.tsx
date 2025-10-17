import React from 'react';
import axios from 'axios';

// PUBLIC_INTERFACE
export default function App(): JSX.Element {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const [health, setHealth] = React.useState<string>('checking...');
  const [detail, setDetail] = React.useState<any>(null);

  React.useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    axios
      .get(`${apiBase}/health`, { signal: controller.signal })
      .then((res) => {
        setHealth('ok');
        setDetail(res.data);
      })
      .catch((err) => {
        setHealth('error');
        setDetail({ message: String(err) });
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [apiBase]);

  return (
    <div style={{ fontFamily: 'system-ui, Arial, sans-serif', padding: 16 }}>
      <h1>Network Device Inventory</h1>
      <p>Backend API base: {apiBase}</p>
      <div style={{ marginTop: 12, padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
        <strong>Backend health:</strong> {health}
        <pre style={{ background: '#f7f7f7', padding: 12, overflowX: 'auto' }}>
          {detail ? JSON.stringify(detail, null, 2) : 'No details'}
        </pre>
      </div>
    </div>
  );
}
