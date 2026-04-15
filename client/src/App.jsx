import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout & Guards
import PageShell from './components/layout/PageShell';
import ProtectedRoute from './guards/ProtectedRoute';
import RoleGuard from './guards/RoleGuard';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import UserDirectory from './pages/UserDirectory';
import NotFound, { Forbidden } from './pages/Errors';

const App = () => {
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
             borderRadius: '12px',
             background: '#333',
             color: '#fff',
             fontSize: '14px',
          },
        }} 
      />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes inside App Shell */}
        <Route element={<ProtectedRoute />}>
          <Route element={<PageShell />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Admin & Manager Only */}
            <Route 
              path="/users" 
              element={
                <RoleGuard allowedRoles={['admin', 'manager']}>
                  <UserDirectory />
                </RoleGuard>
              } 
            />

            <Route path="/403" element={<Forbidden />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
