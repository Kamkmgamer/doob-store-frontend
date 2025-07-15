import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// NEW: Import ToastProvider
import { ToastProvider } from './contexts/ToastContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Wrap App with ToastProvider here */}
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>,
);