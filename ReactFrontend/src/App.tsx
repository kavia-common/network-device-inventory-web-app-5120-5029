import React from 'react';

// PUBLIC_INTERFACE
export default function App(): JSX.Element {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  return (
    <div style={{ fontFamily: 'system-ui, Arial, sans-serif', padding: 16 }}>
      <h1>Network Device Inventory</h1>
      <p>React frontend is set up. Backend API base: {apiBase}</p>
    </div>
  );
}
