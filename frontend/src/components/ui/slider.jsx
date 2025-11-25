import React, { useState, useRef, useEffect } from 'react';

export function Slider({ 
  value = [0], 
  onValueChange, 
  min = 0, 
  max = 100,
  step = 1,
  disabled = false,
  className = '' 
}) {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  const currentValue = Array.isArray(value) ? value[0] : value;

  const percentage = ((currentValue - min) / (max - min)) * 100;

  const handleMouseDown = (e) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || disabled) return;
    updateValue(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateValue = (e) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newPercentage = pos / rect.width;
    const newValue = min + (max - min) * newPercentage;
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));
    
    onValueChange?.([clampedValue]);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div
      ref={sliderRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'relative',
        width: '100%',
        height: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        touchAction: 'none',
        userSelect: 'none',
        ...className
      }}
    >
      {/* Track */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '0.25rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '9999px',
          overflow: 'hidden'
        }}
      >
        {/* Range */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${percentage}%`,
            backgroundColor: '#ff6b35',
            transition: isDragging ? 'none' : 'width 0.15s'
          }}
        />
      </div>

      {/* Thumb */}
      <div
        style={{
          position: 'absolute',
          left: `${percentage}%`,
          transform: 'translateX(-50%)',
          width: '1.25rem',
          height: '1.25rem',
          backgroundColor: '#ff6b35',
          borderRadius: '50%',
          border: '3px solid #0a0e27',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          transition: isDragging ? 'none' : 'left 0.15s',
          cursor: disabled ? 'not-allowed' : 'grab',
          ...(isDragging && { cursor: 'grabbing', transform: 'translateX(-50%) scale(1.1)' })
        }}
      />
    </div>
  );
}

export function SliderWithLabel({ 
  value, 
  onValueChange, 
  label, 
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  formatValue = (val) => val,
  ...props 
}) {
  const currentValue = Array.isArray(value) ? value[0] : value;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '0.75rem'
      }}>
        <label style={{ 
          fontSize: '0.875rem', 
          fontWeight: '500', 
          color: 'white' 
        }}>
          {label}
        </label>
        {showValue && (
          <span style={{ 
            fontSize: '0.875rem', 
            fontWeight: '600', 
            color: '#ff6b35',
            minWidth: '3rem',
            textAlign: 'right'
          }}>
            {formatValue(currentValue)}
          </span>
        )}
      </div>
      <Slider
        value={value}
        onValueChange={onValueChange}
        min={min}
        max={max}
        step={step}
        {...props}
      />
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        marginTop: '0.5rem',
        fontSize: '0.75rem',
        color: '#94a3b8'
      }}>
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
