import React from 'react';

export function Input({ 
  className = '', 
  type = 'text', 
  placeholder = '',
  error = false,
  ...props 
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      style={{
        display: 'flex',
        height: '2.5rem',
        width: '100%',
        borderRadius: '0.5rem',
        border: error 
          ? '1px solid #ef4444' 
          : '1px solid rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: '0.5rem 0.75rem',
        fontSize: '0.875rem',
        color: 'white',
        outline: 'none',
        transition: 'all 0.2s',
        ...className
      }}
      onFocus={(e) => {
        e.target.style.borderColor = error ? '#ef4444' : '#ff6b35';
        e.target.style.boxShadow = error 
          ? '0 0 0 3px rgba(239, 68, 68, 0.2)' 
          : '0 0 0 3px rgba(255, 107, 53, 0.2)';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = error 
          ? '#ef4444' 
          : 'rgba(255, 255, 255, 0.2)';
        e.target.style.boxShadow = 'none';
      }}
      {...props}
    />
  );
}
