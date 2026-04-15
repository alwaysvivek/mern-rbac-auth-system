import React from 'react';

const Badge = ({ children, type = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    admin: 'bg-role-admin-bg text-role-admin-text',
    manager: 'bg-role-manager-bg text-role-manager-text',
    user: 'bg-role-user-bg text-role-user-text',
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-amber-100 text-amber-700',
    suspended: 'bg-red-100 text-red-700'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${variants[type]} ${className}`}>
      {type === 'active' || type === 'inactive' || type === 'suspended' ? (
         <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
            type === 'active' ? 'bg-status-active' :
            type === 'inactive' ? 'bg-status-inactive' : 'bg-status-suspended'
         }`} />
      ) : null}
      {children}
    </span>
  );
};

export default Badge;
