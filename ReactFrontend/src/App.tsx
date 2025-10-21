import React from 'react';
import { getApiBaseUrl } from './config/api';

// PUBLIC_INTERFACE
export default function App(): JSX.Element {
  const apiBase = getApiBaseUrl();
  return (
    <div style={{ fontFamily: 'system-ui, Arial, sans-serif', padding: 16 }}>
      <h1>Network Device Inventory</h1>
      <p>Welcome. Use this preview to verify connectivity to the backend.</p>
      <div style={{ marginTop: 12, padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
        <p style={{ margin: 0 }}>
          Visit the Status page to verify connection to the backend <code>/health</code> endpoint.
        </p>
        <p style={{ marginTop: 8 }}>
          API Base: <code>{apiBase}</code>
        </p>
        <a href="/status" style={{ display: 'inline-block', marginTop: 8 }}>
          Go to Status
        </a>
      </div>
    </div>
  );
}
