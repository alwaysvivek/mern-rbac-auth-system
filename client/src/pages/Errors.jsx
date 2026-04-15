import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { ShieldAlert } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-accent mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mb-2">Page not found</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <Link to="/">
          <Button size="lg">Go back home</Button>
        </Link>
      </div>
    </div>
  );
};

export const Forbidden = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="text-center items-center flex flex-col">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
           <ShieldAlert className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          You do not have the required permissions to access this feature. Contact your administrator if you believe this is a mistake.
        </p>
        <Link to="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
