import React, { useState, useRef, useEffect } from 'react';

export function Select({ 
  value, 
  onValueChange, 
  children,
  placeholder = 'Seleccionar...',
  className = '' 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} style={{ position: 'relative', width: '100%', ...className }}>
      {React.Children.map(children, child => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            isOpen,
            onClick: () => setIsOpen(!isOpen),
            selectedLabel: selectedLabel || placeholder
          });
        }
        if (child.type === SelectContent) {
          return React.cloneElement(child, {
            isOpen,
            onSelect: (val, label) => {
              onValueChange(val);
              setSelectedLabel(label);
              setIsOpen(false);
            },
            value
          });
        }
        return child;
      })}
    </div>
  );
}

export function SelectTrigger({ children, isOpen, onClick, selectedLabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: '2.5rem',
        padding: '0.5rem 0.75rem',
        fontSize: '0.875rem',
        borderRadius: '0.5rem',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: 'white',
        cursor: 'pointer',
        outline: 'none',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#ff6b35';
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
      }}
    >
      <span style={{ color: selectedLabel.startsWith('Seleccionar') ? '#94a3b8' : 'white' }}>
        {selectedLabel}
      </span>
      <span style={{ 
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s'
      }}>
        ▼
      </span>
    </button>
  );
}

export function SelectContent({ children, isOpen, onSelect, value }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 0.5rem)',
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: '#1a1f3a',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
        maxHeight: '300px',
        overflowY: 'auto',
        animation: 'slideDown 0.2s ease-out'
      }}
    >
      {React.Children.map(children, child => {
        if (child.type === SelectItem) {
          return React.cloneElement(child, {
            onSelect,
            isSelected: value === child.props.value
          });
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

export function SelectItem({ value, children, onSelect, isSelected }) {
  return (
    <div
      onClick={() => onSelect(value, children)}
      style={{
        padding: '0.75rem',
        fontSize: '0.875rem',
        cursor: 'pointer',
        backgroundColor: isSelected ? 'rgba(255, 107, 53, 0.2)' : 'transparent',
        color: isSelected ? '#ff6b35' : 'white',
        transition: 'all 0.15s'
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      {children}
      {isSelected && <span style={{ marginLeft: '0.5rem' }}>✓</span>}
    </div>
  );
}

export function SelectValue({ placeholder }) {
  return <span>{placeholder}</span>;
}
