import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { ShieldAlert, Fingerprint } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@purplemerit.com');
      setPassword('Admin@123');
    } else if (role === 'manager') {
      setEmail('manager@purplemerit.com');
      setPassword('Manager@123');
    } else {
      setEmail('john@purplemerit.com');
      setPassword('User@123');
    }
  };

  return (
    <div className="min-h-screen flex text-gray-900 bg-white">
      {/* Left side — Decoration */}
      <div className="hidden lg:flex w-1/2 bg-sidebar relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0">
          {/* Abstract background shapes */}
          <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-accent/20 blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-3xl"></div>
        </div>
        
        <div className="relative z-10 p-12 max-w-xl">
          <div className="flex items-center gap-3 text-white mb-12">
            <ShieldAlert className="w-10 h-10 text-accent" />
            <h1 className="text-4xl font-bold tracking-tight">Purple Merit</h1>
          </div>
          
          <h2 className="text-3xl font-semibold text-white mb-6 leading-tight text-balance">
            Enterprise-grade Access Management
          </h2>
          <p className="text-gray-400 text-lg mb-8 text-balance">
            Securely manage roles, permissions, and user lifecycles through our intelligent dashboard.
          </p>
          
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-sidebar bg-accent flex justify-center items-center font-bold text-white text-xs">A</div>
              <div className="w-8 h-8 rounded-full border-2 border-sidebar bg-blue-500 flex justify-center items-center font-bold text-white text-xs">M</div>
              <div className="w-8 h-8 rounded-full border-2 border-sidebar bg-gray-500 flex justify-center items-center font-bold text-white text-xs">U</div>
            </div>
            <span>Supports Admin, Manager, and User roles</span>
          </div>
        </div>
      </div>

      {/* Right side — Login Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-24">
        <div className="max-w-sm w-full mx-auto">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-accent">
               <Fingerprint className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold mb-2 tracking-tight">Sign in</h2>
            <p className="text-gray-500">Access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="email"
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            
            <Input
              id="password"
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <Button
              type="submit"
              className="w-full h-12 text-base shadow-lg shadow-accent/30"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>
          
          <div className="mt-8 text-center pt-8 border-t border-gray-100">
             <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">Demo Access</p>
             <div className="flex justify-center gap-2">
                <button type="button" onClick={() => setDemoCredentials('admin')} className="text-xs px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors">Admin</button>
                <button type="button" onClick={() => setDemoCredentials('manager')} className="text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">Manager</button>
                <button type="button" onClick={() => setDemoCredentials('user')} className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">User</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
