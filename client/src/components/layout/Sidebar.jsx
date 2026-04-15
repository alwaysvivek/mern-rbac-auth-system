import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  LogOut,
  ShieldAlert
} from 'lucide-react';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'user'] },
    { name: 'User Directory', path: '/users', icon: Users, roles: ['admin', 'manager'] },
    { name: 'My Profile', path: '/profile', icon: UserCircle, roles: ['admin', 'manager', 'user'] },
  ];

  const allowedNavItems = navItems.filter((item) => item.roles.includes(user?.role));

  return (
    <aside className="w-64 bg-sidebar text-gray-300 flex flex-col h-screen border-r border-sidebar-light shrink-0">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar-light">
        <div className="flex items-center gap-2 text-white font-bold text-lg tracking-wide">
          <ShieldAlert className="w-6 h-6 text-accent" />
          <span>Purple Merit</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="px-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Menu
        </div>
        
        {allowedNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-accent/10 text-accent font-semibold' 
                    : 'hover:bg-sidebar-hover hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile Card */}
      <div className="p-4 border-t border-sidebar-light">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-sidebar-light/50 border border-white/5">
          <Avatar name={user?.name} className="w-10 h-10 text-sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate mb-1">{user?.email}</p>
            <Badge type={user?.role}>{user?.role}</Badge>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-sidebar-hover transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
