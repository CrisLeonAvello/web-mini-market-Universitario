import React from 'react';
import ProductListNew from './ProductListNew';
import FiltersNew from './FiltersNew';
import HeaderGlobal from './HeaderGlobal';

export default function PestañaProductos(props) {
  return (
    <div className="productos-page-bg">
      <HeaderGlobal {...props} isProductosPage={true} />
      <div className="productos-page-container">
        <div className="productos-page-header">
          <h1 className="productos-title">
            Todos los productos
          </h1>
          {/* Filtros superiores: categoría y búsqueda */}
          <div className="productos-filtros-superiores">
            {/* Categoría */}
            <select
              className="productos-categoria-select"
              value={props.filters?.category || ''}
              onChange={e => props.updateFilters?.({ category: e.target.value })}
            >
              <option value=''>Todas las categorías</option>
              {(props.categories || []).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {/* Búsqueda por nombre */}
            <input
              type='text'
              placeholder='Buscar productos...'
              className="productos-busqueda-input"
              value={props.filters?.search || ''}
              onChange={e => props.updateFilters?.({ search: e.target.value })}
            />
          </div>
        </div>
        <div className="productos-flex-container">
          <FiltersNew />
          <div className="productos-list-container">
            <ProductListNew />
          </div>
        </div>
      </div>
    </div>
  );
}
