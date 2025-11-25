import React from 'react';

export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-gray-500',
    popular: 'bg-orange-500',
    nuevo: 'bg-green-500',
    trending: 'bg-purple-500',
  };

  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '600',
        color: 'white',
        backgroundColor: variant === 'popular' ? '#ff6b35' : variant === 'nuevo' ? '#22c55e' : variant === 'trending' ? '#a855f7' : '#6b7280'
      }}
    >
      {children}
    </span>
  );
}
