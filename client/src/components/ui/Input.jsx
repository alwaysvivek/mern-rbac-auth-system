import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  id, 
  error, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="floating-input-group">
        <input
          id={id}
          ref={ref}
          placeholder=" "
          className={`floating-input peer ${error ? 'border-status-suspended focus:border-status-suspended focus:ring-status-suspended/20' : ''}`}
          {...props}
        />
        <label htmlFor={id} className="floating-label">
          {label}
        </label>
      </div>
      {error && (
        <p className="mt-1 text-xs text-status-suspended animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
