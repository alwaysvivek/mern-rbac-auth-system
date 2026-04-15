import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const SlideOver = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 overflow-hidden">
      <div 
        className="absolute inset-0 bg-sidebar/20 backdrop-blur-xs transition-opacity animate-fade-in" 
        onClick={onClose}
      />
      
      <div className="fixed inset-y-0 right-0 flex max-w-full w-full sm:w-[400px]">
        <div className="w-full h-full bg-white shadow-modal animate-slide-in-right flex flex-col font-sans">
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-gray-50/80 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button
               onClick={onClose}
               className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideOver;
