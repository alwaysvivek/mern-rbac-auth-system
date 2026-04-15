import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api/userApi';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUserState } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updates = {};
    if (formData.name !== user.name) {
      if (!formData.name.trim()) return toast.error('Name cannot be empty');
      updates.name = formData.name;
    }
    
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        return toast.error('New passwords do not match');
      }
      if (formData.newPassword.length < 6) {
        return toast.error('Password must be at least 6 characters');
      }
      if (!formData.currentPassword) {
        return toast.error('Current password is required to set new password');
      }
      updates.password = formData.newPassword;
      updates.currentPassword = formData.currentPassword;
    }
    
    if (Object.keys(updates).length === 0) {
      return toast.info('No changes to save');
    }

    setIsLoading(true);
    try {
      const { data } = await updateProfile(updates);
      if (data.success) {
        updateUserState(data.data.user);
        toast.success('Profile updated successfully');
        setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-card border border-surface-border overflow-hidden pb-8">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-sidebar to-accent w-full" />
        
        {/* Avatar & Info */}
        <div className="px-8 flex flex-col sm:flex-row items-center sm:items-end sm:justify-between -mt-12 mb-8 gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
            <Avatar name={user.name} className="w-24 h-24 text-3xl border-4 border-white shadow-md relative" />
            <div className="pb-2">
               <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
               <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="pb-2 flex gap-2">
            <Badge type={user.role} className="px-3 py-1 text-sm">{user.role}</Badge>
            <Badge type={user.status} className="px-3 py-1 text-sm">{user.status}</Badge>
          </div>
        </div>

        {/* Form */}
        <div className="px-8">
          <form onSubmit={handleSubmit} className="space-y-8 max-w-xl">
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Personal Information</h3>
              <Input
                id="name"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
              <div className="floating-input-group">
                <input id="email-fixed" className="floating-input bg-gray-50 text-gray-500 cursor-not-allowed" value={user.email} disabled />
                <label className="floating-label">Email Address (Cannot be changed)</label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Change Password</h3>
              <p className="text-xs text-gray-500 mb-4">Leave blank if you do not want to change your password.</p>
              
              <Input
                id="currentPassword"
                type="password"
                className="w-full"
                label="Current Password"
                value={formData.currentPassword}
                onChange={handleChange}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="newPassword"
                  type="password"
                  label="New Password"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
                <Input
                  id="confirmPassword"
                  type="password"
                  label="Confirm New Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button type="submit" isLoading={isLoading} size="lg">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Read-only Audit Info */}
      <div className="bg-white rounded-2xl shadow-card border border-surface-border p-6 flex flex-wrap gap-x-12 gap-y-4 text-sm text-gray-500">
         <div>
            <span className="font-semibold block text-gray-700 mb-1">Account Created</span>
            {new Date(user.createdAt).toLocaleString()}
         </div>
         <div>
            <span className="font-semibold block text-gray-700 mb-1">Last Login</span>
            {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'N/A'}
         </div>
         <div>
            <span className="font-semibold block text-gray-700 mb-1">Account ID</span>
            <code className="bg-gray-100 px-2 py-1 rounded text-xs">{user._id}</code>
         </div>
      </div>
    </div>
  );
};

export default Profile;
