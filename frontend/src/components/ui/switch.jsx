import React from 'react';

export function Switch({ 
  checked = false, 
  onCheckedChange, 
  disabled = false,
  id,
  className = '' 
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onCheckedChange?.(!checked)}
      disabled={disabled}
      style={{
        width: '2.75rem',
        height: '1.5rem',
        borderRadius: '9999px',
        backgroundColor: checked ? '#ff6b35' : 'rgba(255, 255, 255, 0.1)',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background-color 0.2s',
        position: 'relative',
        padding: 0,
        outline: 'none',
        ...className
      }}
      onMouseEnter={(e) => {
        if (!disabled && !checked) {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !checked) {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }
      }}
    >
      <div
        style={{
          width: '1.25rem',
          height: '1.25rem',
          borderRadius: '50%',
          backgroundColor: 'white',
          position: 'absolute',
          top: '0.125rem',
          left: checked ? 'calc(100% - 1.375rem)' : '0.125rem',
          transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }}
      />
    </button>
  );
}

export function SwitchWithLabel({ 
  checked, 
  onCheckedChange, 
  label, 
  description,
  disabled = false,
  id = `switch-${Math.random().toString(36).substr(2, 9)}`
}) {
  return (
    <label
      htmlFor={id}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontSize: '0.875rem', 
          fontWeight: '500', 
          color: 'white',
          marginBottom: description ? '0.25rem' : 0
        }}>
          {label}
        </div>
        {description && (
          <div style={{ 
            fontSize: '0.75rem', 
            color: '#94a3b8' 
          }}>
            {description}
          </div>
        )}
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </label>
  );
}
