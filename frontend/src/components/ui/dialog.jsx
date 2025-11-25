import React, { useEffect } from 'react';

export function Dialog({ open, onOpenChange, children }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={() => onOpenChange(false)}
    >
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease-out'
        }}
      />
      
      {/* Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          zIndex: 51
        }}
      >
        {children}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
}

export function DialogContent({ children, className = '' }) {
  return (
    <div
      style={{
        backgroundColor: '#0a0e27',
        borderRadius: '1rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        padding: '2rem',
        width: '90vw',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto',
        animation: 'slideUp 0.3s ease-out',
        ...className
      }}
    >
      {children}
      <style>
        {`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </div>
  );
}

export function DialogHeader({ children, className = '' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        ...className
      }}
    >
      {children}
    </div>
  );
}

export function DialogTitle({ children, className = '' }) {
  return (
    <h2
      style={{
        fontSize: '1.5rem',
        fontWeight: '700',
        color: 'white',
        margin: 0,
        ...className
      }}
    >
      {children}
    </h2>
  );
}

export function DialogDescription({ children, className = '' }) {
  return (
    <p
      style={{
        fontSize: '0.875rem',
        color: '#94a3b8',
        margin: 0,
        ...className
      }}
    >
      {children}
    </p>
  );
}

export function DialogFooter({ children, className = '' }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '0.75rem',
        justifyContent: 'flex-end',
        marginTop: '1.5rem',
        ...className
      }}
    >
      {children}
    </div>
  );
}

export function DialogClose({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        width: '2rem',
        height: '2rem',
        borderRadius: '0.375rem',
        border: 'none',
        backgroundColor: 'transparent',
        color: '#94a3b8',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        e.target.style.color = 'white';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'transparent';
        e.target.style.color = '#94a3b8';
      }}
    >
      {children || '✕'}
    </button>
  );
}
