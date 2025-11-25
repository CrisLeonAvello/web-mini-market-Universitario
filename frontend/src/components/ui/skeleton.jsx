import React from 'react';

export function Skeleton({ className = '', width, height, circle = false }) {
  return (
    <div
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: circle ? '9999px' : '0.5rem',
        width: width || '100%',
        height: height || '1rem',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        ...className
      }}
    >
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}
      </style>
    </div>
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', ...className }}>
      {[...Array(lines)].map((_, i) => (
        <Skeleton 
          key={i} 
          height="0.75rem"
          width={i === lines - 1 ? '70%' : '100%'}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '1rem',
        padding: '1rem',
        ...className
      }}
    >
      <Skeleton height="200px" style={{ marginBottom: '1rem' }} />
      <Skeleton height="1.5rem" style={{ marginBottom: '0.5rem' }} />
      <Skeleton height="1rem" width="70%" style={{ marginBottom: '1rem' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton height="2rem" width="5rem" />
        <Skeleton height="2rem" width="2rem" circle />
      </div>
    </div>
  );
}
