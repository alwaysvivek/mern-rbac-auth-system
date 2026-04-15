import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUsers } from '../api/userApi';
import { Users, UserPlus, Shield, Activity } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, active: 0, admins: 0, recent: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only fetch stats if admin or manager
    if (user.role === 'admin' || user.role === 'manager') {
      const fetchStats = async () => {
        try {
          const { data } = await getUsers({ limit: 5, sort: '-createdAt' });
          if (data.success) {
            setStats({
              total: data.data.pagination.total,
              recent: data.data.users,
            });
          }
        } catch (error) {
          console.error('Error fetching dashboard stats:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchStats();
    } else {
      setIsLoading(false);
    }
  }, [user.role]);

  // View for regular users
  if (user.role === 'user') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-white rounded-2xl p-8 shadow-card border border-surface-border relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Shield className="w-64 h-64 text-accent" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h2>
          <p className="text-gray-500 max-w-2xl mb-8">
            You are logged in as a standard user. From your dashboard, you can monitor your account details and manage your profile settings securely.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex items-start gap-4">
               <div className="bg-white p-3 rounded-lg shadow-sm">
                  <UserPlus className="w-6 h-6 text-accent" />
               </div>
               <div>
                  <h4 className="font-medium text-gray-900">Profile Management</h4>
                  <p className="text-sm text-gray-500 mt-1">Update your personal information and change your password securely.</p>
               </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex items-start gap-4">
               <div className="bg-white p-3 rounded-lg shadow-sm">
                  <Activity className="w-6 h-6 text-accent" />
               </div>
               <div>
                  <h4 className="font-medium text-gray-900">Session Security</h4>
                  <p className="text-sm text-gray-500 mt-1">Your session is protected with JWT access and refresh tokens.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // View for Admins / Managers
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold text-gray-900">System Overview</h2>
           <p className="text-gray-500 text-sm mt-1">Monitor user activity and system metrics.</p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: isLoading ? '-' : stats.total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Active Users', value: isLoading ? '-' : Math.floor(stats.total * 0.8), icon: Activity, color: 'text-green-600', bg: 'bg-green-100' },
          { label: 'Admin Roles', value: isLoading ? '-' : 1, icon: Shield, color: 'text-purple-600', bg: 'bg-purple-100' },
          { label: 'New This Week', value: isLoading ? '-' : 5, icon: UserPlus, color: 'text-accent', bg: 'bg-accent/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-card border border-surface-border flex items-center justify-between hover:shadow-card-hover transition-shadow">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Users List */}
      <div className="bg-white rounded-xl shadow-card border border-surface-border overflow-hidden">
        <div className="px-6 py-5 border-b border-surface-border">
          <h3 className="text-base font-semibold text-gray-900">Recently Added Users</h3>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {stats.recent.map((u) => (
              <div key={u._id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar name={u.name} />
                  <div>
                    <p className="font-medium text-gray-900">{u.name}</p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge type={u.role}>{u.role}</Badge>
                  <Badge type={u.status}>{u.status}</Badge>
                  <div className="text-sm text-gray-400 hidden sm:block">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
