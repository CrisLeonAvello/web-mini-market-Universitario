import React, { useState, useRef, useEffect } from 'react';

export function Tooltip({ children, content, side = 'top', delay = 200 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        let top = 0;
        let left = 0;

        switch (side) {
          case 'top':
            top = rect.top - 10;
            left = rect.left + rect.width / 2;
            break;
          case 'bottom':
            top = rect.bottom + 10;
            left = rect.left + rect.width / 2;
            break;
          case 'left':
            top = rect.top + rect.height / 2;
            left = rect.left - 10;
            break;
          case 'right':
            top = rect.top + rect.height / 2;
            left = rect.right + 10;
            break;
        }

        setPosition({ top, left });
        setIsVisible(true);
      }
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        style={{ display: 'inline-block' }}
      >
        {children}
      </div>

      {isVisible && (
        <div
          style={{
            position: 'fixed',
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: side === 'top' ? 'translate(-50%, -100%)' :
                       side === 'bottom' ? 'translate(-50%, 0)' :
                       side === 'left' ? 'translate(-100%, -50%)' :
                       'translate(0, -50%)',
            zIndex: 9999,
            pointerEvents: 'none',
            animation: 'tooltipFadeIn 0.15s ease-out'
          }}
        >
          <div
            style={{
              backgroundColor: '#1a1f3a',
              color: 'white',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
              maxWidth: '300px',
              wordWrap: 'break-word'
            }}
          >
            {content}
            
            {/* Arrow */}
            <div
              style={{
                position: 'absolute',
                width: '8px',
                height: '8px',
                backgroundColor: '#1a1f3a',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transform: 'rotate(45deg)',
                ...(side === 'top' && {
                  bottom: '-5px',
                  left: '50%',
                  marginLeft: '-4px',
                  borderTop: 'none',
                  borderLeft: 'none'
                }),
                ...(side === 'bottom' && {
                  top: '-5px',
                  left: '50%',
                  marginLeft: '-4px',
                  borderBottom: 'none',
                  borderRight: 'none'
                }),
                ...(side === 'left' && {
                  right: '-5px',
                  top: '50%',
                  marginTop: '-4px',
                  borderTop: 'none',
                  borderRight: 'none'
                }),
                ...(side === 'right' && {
                  left: '-5px',
                  top: '50%',
                  marginTop: '-4px',
                  borderBottom: 'none',
                  borderLeft: 'none'
                })
              }}
            />
          </div>

          <style>
            {`
              @keyframes tooltipFadeIn {
                from {
                  opacity: 0;
                  transform: ${
                    side === 'top' ? 'translate(-50%, calc(-100% + 5px))' :
                    side === 'bottom' ? 'translate(-50%, -5px)' :
                    side === 'left' ? 'translate(calc(-100% + 5px), -50%)' :
                    'translate(-5px, -50%)'
                  };
                }
                to {
                  opacity: 1;
                  transform: ${
                    side === 'top' ? 'translate(-50%, -100%)' :
                    side === 'bottom' ? 'translate(-50%, 0)' :
                    side === 'left' ? 'translate(-100%, -50%)' :
                    'translate(0, -50%)'
                  };
                }
              }
            `}
          </style>
        </div>
      )}
    </>
  );
}

export function TooltipProvider({ children }) {
  return <>{children}</>;
}
