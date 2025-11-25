import React, { useState } from 'react';

export function Avatar({ children, className = '' }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        width: '2.5rem',
        height: '2.5rem',
        flexShrink: 0,
        overflow: 'hidden',
        borderRadius: '9999px',
        ...className
      }}
    >
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt = '', className = '' }) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      style={{
        aspectRatio: '1/1',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        ...className
      }}
    />
  );
}

export function AvatarFallback({ children, className = '' }) {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '9999px',
        backgroundColor: '#ff6b35',
        color: 'white',
        fontSize: '0.875rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        ...className
      }}
    >
      {children}
    </div>
  );
}
