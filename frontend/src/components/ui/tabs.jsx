import React, { useState } from 'react';

export function Tabs({ defaultValue, value, onValueChange, children, className = '' }) {
  const [activeTab, setActiveTab] = useState(value || defaultValue);

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <div style={{ width: '100%', ...className }}>
      {React.Children.map(children, child => {
        if (child.type === TabsList || child.type === TabsContent) {
          return React.cloneElement(child, {
            activeTab,
            onTabChange: handleTabChange
          });
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ children, activeTab, onTabChange, className = '' }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.25rem',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '0.5rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        ...className
      }}
    >
      {React.Children.map(children, child => {
        if (child.type === TabsTrigger) {
          return React.cloneElement(child, {
            isActive: activeTab === child.props.value,
            onClick: () => onTabChange(child.props.value)
          });
        }
        return child;
      })}
    </div>
  );
}

export function TabsTrigger({ value, children, isActive, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
        fontWeight: '500',
        borderRadius: '0.375rem',
        border: 'none',
        backgroundColor: isActive ? '#ff6b35' : 'transparent',
        color: isActive ? 'white' : '#94a3b8',
        cursor: 'pointer',
        transition: 'all 0.2s',
        outline: 'none',
        ...className
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.color = 'white';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#94a3b8';
        }
      }}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, activeTab, className = '' }) {
  if (value !== activeTab) return null;

  return (
    <div
      style={{
        marginTop: '1rem',
        animation: 'fadeIn 0.3s ease-out',
        ...className
      }}
    >
      {children}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
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
