import React from 'react';
import { FolderSearch } from 'lucide-react';

const EmptyState = ({ title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-gray-300 rounded-2xl bg-gray-50/50">
      <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-indigo-50 text-accent">
        <FolderSearch className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
