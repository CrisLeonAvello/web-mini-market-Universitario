import React from 'react';

export function Table({ children, className = '' }) {
  return (
    <div style={{ 
      width: '100%', 
      overflow: 'auto',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '0.5rem',
      ...className 
    }}>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        fontSize: '0.875rem'
      }}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className = '' }) {
  return (
    <thead style={{ 
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      ...className 
    }}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = '' }) {
  return (
    <tbody style={{ ...className }}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = '' }) {
  return (
    <tr 
      style={{ 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'background-color 0.15s',
        ...className 
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = '' }) {
  return (
    <th style={{ 
      textAlign: 'left',
      padding: '0.75rem 1rem',
      fontWeight: '600',
      color: '#94a3b8',
      textTransform: 'uppercase',
      fontSize: '0.75rem',
      letterSpacing: '0.05em',
      ...className 
    }}>
      {children}
    </th>
  );
}

export function TableCell({ children, className = '' }) {
  return (
    <td style={{ 
      padding: '0.75rem 1rem',
      color: 'white',
      ...className 
    }}>
      {children}
    </td>
  );
}

export function TableCaption({ children, className = '' }) {
  return (
    <caption style={{ 
      padding: '0.75rem',
      fontSize: '0.875rem',
      color: '#94a3b8',
      textAlign: 'left',
      ...className 
    }}>
      {children}
    </caption>
  );
}

export function TableFooter({ children, className = '' }) {
  return (
    <tfoot style={{ 
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      fontWeight: '600',
      ...className 
    }}>
      {children}
    </tfoot>
  );
}
