import React, { useState, useRef, useEffect } from 'react';

export function DropdownMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      {React.Children.map(children, child => {
        if (child.type === DropdownMenuTrigger) {
          return React.cloneElement(child, {
            onClick: typeof child.props.onClick === 'function'
              ? (e) => { child.props.onClick(e); setIsOpen(!isOpen); }
              : () => setIsOpen(!isOpen)
          });
        }
        if (child.type === DropdownMenuContent) {
          return React.cloneElement(child, {
            isOpen,
            onClose: () => setIsOpen(false)
          });
        }
        return child;
      })}
    </div>
  );
}

export function DropdownMenuTrigger({ children, onClick, asChild }) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e) => {
        onClick(e);
        if (children.props.onClick) {
          children.props.onClick(e);
        }
      }
    });
  }

  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0
      }}
    >
      {children}
    </button>
  );
}

export function DropdownMenuContent({ children, isOpen, onClose, align = 'end', className = '', style = {} }) {
  if (!isOpen) return null;

  return (
    <div
      className={`dropdown-menu-content ${align === 'end' ? 'dropdown-menu-end' : ''} ${align === 'start' ? 'dropdown-menu-start' : ''} ${className || ''}`}
    >
      {React.Children.map(children, child => {
        if (child.type === DropdownMenuItem || 
            child.type === DropdownMenuLabel || 
            child.type === DropdownMenuSeparator) {
          return React.cloneElement(child, { onClose });
        }
        return child;
      })}
      <style>
        {`
          @keyframes slideDown {
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

export function DropdownMenuItem({ children, onClose, onClick, className = '', style = {} }) {
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={className}
      style={{
        padding: '0.625rem 0.875rem',
        fontSize: '0.875rem',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        color: '#e2e8f0',
        transition: 'all 0.15s',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        ...style
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.color = 'white';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = '#e2e8f0';
      }}
    >
      {children}
    </div>
  );
}

export function DropdownMenuLabel({ children, className = '', style = {} }) {
  return (
    <div
      className={className}
      style={{
        padding: '0.625rem 0.875rem',
        fontSize: '0.75rem',
        fontWeight: '600',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        ...style
      }}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator({ className = '', style = {} }) {
  return (
    <div
      className={className}
      style={{
        height: '1px',
        backgroundColor: 'rgba(148, 163, 184, 0.2)',
        margin: '0.5rem 0',
        ...style
      }}
    />
  );
}
