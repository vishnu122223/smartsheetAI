import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            background: '#0F172A',
            color: '#E5E7EB',
            border: '1px solid rgba(59,130,246,0.25)',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 10px 40px rgba(59,130,246,0.25)',
            backdropFilter: 'blur(10px)',
          },
          success: {
            iconTheme: {
              primary: '#14B8A6',
              secondary: '#020617',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#020617',
            },
          },
        }}
      />
      <App />
    </AuthProvider>
  </StrictMode>
);