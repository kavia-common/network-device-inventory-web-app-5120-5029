import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App, { Status } from './App';

// PUBLIC_INTERFACE
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/status',
    element: <Status />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
