import React from 'react';

export function Checkbox({ 
  checked = false, 
  onCheckedChange, 
  disabled = false,
  id,
  className = '' 
}) {
  return (
    <label
      htmlFor={id}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        ...className
      }}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        disabled={disabled}
        style={{ display: 'none' }}
      />
      <div
        style={{
          width: '1.25rem',
          height: '1.25rem',
          borderRadius: '0.25rem',
          border: checked ? '2px solid #ff6b35' : '2px solid rgba(255, 255, 255, 0.2)',
          backgroundColor: checked ? '#ff6b35' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          flexShrink: 0
        }}
      >
        {checked && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              animation: 'checkmark 0.2s ease-out'
            }}
          >
            <path
              d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <style>
        {`
          @keyframes checkmark {
            from {
              opacity: 0;
              transform: scale(0.5);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </label>
  );
}

export function CheckboxWithLabel({ 
  checked, 
  onCheckedChange, 
  label, 
  description,
  disabled = false,
  id = `checkbox-${Math.random().toString(36).substr(2, 9)}`
}) {
  return (
    <label
      htmlFor={id}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1
      }}
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
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
    </label>
  );
}
