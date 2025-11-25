import React, { useEffect, useState } from 'react';

export function Alert({ 
  children, 
  variant = 'default',
  className = '',
  onClose,
  autoClose = false,
  duration = 5000
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  if (!isVisible) return null;

  const variants = {
    default: {
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: '#3b82f6',
      color: '#93c5fd',
      icon: 'ℹ️'
    },
    success: {
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      borderColor: '#22c55e',
      color: '#86efac',
      icon: '✓'
    },
    warning: {
      backgroundColor: 'rgba(251, 146, 60, 0.1)',
      borderColor: '#fb923c',
      color: '#fdba74',
      icon: '⚠️'
    },
    error: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: '#ef4444',
      color: '#fca5a5',
      icon: '✕'
    }
  };

  const style = variants[variant] || variants.default;

  return (
    <div
      role="alert"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '1rem',
        borderRadius: '0.5rem',
        border: `1px solid ${style.borderColor}`,
        backgroundColor: style.backgroundColor,
        color: style.color,
        animation: 'slideIn 0.3s ease-out',
        ...className
      }}
    >
      <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>
        {style.icon}
      </span>
      <div style={{ flex: 1 }}>
        {children}
      </div>
      {onClose && (
        <button
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: style.color,
            cursor: 'pointer',
            padding: '0.25rem',
            fontSize: '1.25rem',
            lineHeight: 1,
            opacity: 0.7,
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.opacity = 1}
          onMouseLeave={(e) => e.target.style.opacity = 0.7}
        >
          ✕
        </button>
      )}
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

export function AlertTitle({ children, className = '' }) {
  return (
    <h5
      style={{
        fontSize: '0.875rem',
        fontWeight: '600',
        marginBottom: '0.25rem',
        ...className
      }}
    >
      {children}
    </h5>
  );
}

export function AlertDescription({ children, className = '' }) {
  return (
    <div
      style={{
        fontSize: '0.875rem',
        opacity: 0.9,
        ...className
      }}
    >
      {children}
    </div>
  );
}
