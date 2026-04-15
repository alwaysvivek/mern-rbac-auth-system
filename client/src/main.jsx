import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import * as Sentry from "@sentry/react";
import { AuthProvider } from './context/AuthContext';
import ErrorBoundaryFallback from './components/ui/ErrorBoundaryFallback';
import App from './App.jsx';
import './index.css';

// Initialize Sentry Drop-in
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || '',
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0, 
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={({ error, resetError }) => (
      <ErrorBoundaryFallback error={error} resetErrorBoundary={resetError} />
    )}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </Sentry.ErrorBoundary>
  </StrictMode>,
);
