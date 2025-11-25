import React from 'react';

export function RadioGroup({ 
  value, 
  onValueChange, 
  children,
  className = '' 
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', ...className }}>
      {React.Children.map(children, child => {
        if (child.type === RadioGroupItem) {
          return React.cloneElement(child, {
            checked: value === child.props.value,
            onSelect: () => onValueChange(child.props.value)
          });
        }
        return child;
      })}
    </div>
  );
}

export function RadioGroupItem({ 
  value, 
  id = `radio-${value}`,
  checked = false,
  onSelect,
  disabled = false,
  children,
  className = ''
}) {
  return (
    <label
      htmlFor={id}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        ...className
      }}
    >
      <input
        id={id}
        type="radio"
        value={value}
        checked={checked}
        onChange={onSelect}
        disabled={disabled}
        style={{ display: 'none' }}
      />
      <div
        style={{
          width: '1.25rem',
          height: '1.25rem',
          borderRadius: '50%',
          border: checked ? '2px solid #ff6b35' : '2px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          flexShrink: 0
        }}
      >
        {checked && (
          <div
            style={{
              width: '0.625rem',
              height: '0.625rem',
              borderRadius: '50%',
              backgroundColor: '#ff6b35',
              animation: 'radioCheck 0.2s ease-out'
            }}
          />
        )}
      </div>
      {children}
      <style>
        {`
          @keyframes radioCheck {
            from {
              opacity: 0;
              transform: scale(0);
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

export function RadioGroupItemWithLabel({ 
  value, 
  label, 
  description,
  ...props 
}) {
  return (
    <RadioGroupItem value={value} {...props}>
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
    </RadioGroupItem>
  );
}
