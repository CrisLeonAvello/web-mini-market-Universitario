import React from 'react';
import './button.css';

const buttonStyles = {
  base: "studi-btn",
  variants: {
    default: "",
    destructive: "",
    outline: "",
    secondary: "",
    ghost: "",
    link: "",
  },
  sizes: {
    default: "",
    sm: "",
    lg: "",
    icon: "",
  }
};

export function Button({ 
  className = '', 
  variant = 'default', 
  size = 'default', 
  children,
  ...props 
}) {
  const variantClass = buttonStyles.variants[variant] || buttonStyles.variants.default;
  const sizeClass = buttonStyles.sizes[size] || buttonStyles.sizes.default;

  // Si la prop 'gradient' está presente, aplica el estilo visual moderno
  const gradientStyle = props.gradient ? {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    whiteSpace: 'nowrap',
    borderRadius: '0.5rem',
    fontSize: '0.9375rem',
    fontWeight: 500,
    transition: 'all 0.2s',
    background: 'linear-gradient(90deg, #ff6b35 0%, #a855f7 100%)',
    color: '#fff',
    height: '2.25rem',
    padding: '0 1.25rem',
    boxShadow: '0 2px 8px rgba(168,85,247,0.08)',
    border: 'none',
    cursor: 'pointer',
    opacity: 1,
  } : undefined;

  // Elimina la prop 'gradient' para no pasarla al DOM
  const { gradient, ...restProps } = props;

  return (
    <button
      className={`${buttonStyles.base} ${variantClass} ${sizeClass} ${className}`}
      style={gradientStyle}
      onMouseEnter={gradientStyle ? e => e.currentTarget.style.opacity = 0.9 : undefined}
      onMouseLeave={gradientStyle ? e => e.currentTarget.style.opacity = 1 : undefined}
      {...restProps}
    >
      {children}
    </button>
  );
}
