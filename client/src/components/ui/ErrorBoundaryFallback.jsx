import React from 'react';
import Button from './Button';
import { ShieldAlert } from 'lucide-react';

const ErrorBoundaryFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-gray-900 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-card border border-surface-border p-8 text-center animate-scale-in">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8 text-red-500" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-gray-500 mb-6">
          An unexpected component error occurred. Don't worry, the system has logged this incident.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="text-left bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 overflow-auto max-h-48">
            <p className="font-mono text-xs text-red-600 mb-2 font-semibold">Error Message:</p>
            <p className="font-mono text-xs text-gray-700">{error.message}</p>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <Button onClick={resetErrorBoundary}>Try Again</Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundaryFallback;
