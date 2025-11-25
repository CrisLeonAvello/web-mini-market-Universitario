import React from 'react';

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  showFirstLast = true,
  maxVisible = 7,
  className = ''
}) {
  const pages = [];
  
  // Calcular qué páginas mostrar
  if (totalPages <= maxVisible) {
    // Mostrar todas las páginas
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Mostrar páginas con elipsis
    const leftSiblingIndex = Math.max(currentPage - 1, 1);
    const rightSiblingIndex = Math.min(currentPage + 1, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftRange = Array.from({ length: 3 }, (_, i) => i + 1);
      pages.push(...leftRange, '...', totalPages);
    } else if (showLeftDots && !showRightDots) {
      pages.push(1, '...', ...Array.from({ length: 3 }, (_, i) => totalPages - 2 + i));
    } else {
      pages.push(1, '...', leftSiblingIndex, currentPage, rightSiblingIndex, '...', totalPages);
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        ...className
      }}
    >
      {/* Previous Button */}
      <PaginationButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ←
      </PaginationButton>

      {/* Page Numbers */}
      {pages.map((page, index) => (
        page === '...' ? (
          <span
            key={`ellipsis-${index}`}
            style={{
              padding: '0.5rem 0.75rem',
              color: '#94a3b8'
            }}
          >
            ...
          </span>
        ) : (
          <PaginationButton
            key={page}
            onClick={() => onPageChange(page)}
            active={currentPage === page}
          >
            {page}
          </PaginationButton>
        )
      ))}

      {/* Next Button */}
      <PaginationButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        →
      </PaginationButton>
    </div>
  );
}

export function PaginationButton({ children, onClick, active, disabled, className = '' }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '0.5rem 0.75rem',
        minWidth: '2.5rem',
        fontSize: '0.875rem',
        fontWeight: '500',
        borderRadius: '0.375rem',
        border: 'none',
        backgroundColor: active 
          ? '#ff6b35' 
          : disabled 
            ? 'rgba(255, 255, 255, 0.02)' 
            : 'rgba(255, 255, 255, 0.05)',
        color: active 
          ? 'white' 
          : disabled 
            ? '#64748b' 
            : '#94a3b8',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        opacity: disabled ? 0.5 : 1,
        outline: 'none',
        ...className
      }}
      onMouseEnter={(e) => {
        if (!active && !disabled) {
          e.currentTarget.style.backgroundColor = 'rgba(255, 107, 53, 0.2)';
          e.currentTarget.style.color = 'white';
        }
      }}
      onMouseLeave={(e) => {
        if (!active && !disabled) {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
          e.currentTarget.style.color = '#94a3b8';
        }
      }}
    >
      {children}
    </button>
  );
}

export function PaginationInfo({ currentPage, totalPages, totalItems, itemsPerPage }) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      style={{
        fontSize: '0.875rem',
        color: '#94a3b8',
        padding: '0.5rem 0'
      }}
    >
      Mostrando <strong style={{ color: 'white' }}>{startItem}-{endItem}</strong> de{' '}
      <strong style={{ color: 'white' }}>{totalItems}</strong> resultados
    </div>
  );
}
