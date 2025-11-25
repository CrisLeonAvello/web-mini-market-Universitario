import React, { useEffect, useState } from 'react';
import { useProducts } from '../contexts/ProductsContext';

export default function Filters() {
  const { filters, categories, updateFilters, resetFilters, getCategories, getPriceRange } = useProducts();
  const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice);

  const localCategories = getCategories();
  const apiCategories = categories || []; // Categorías de la API
  const allCategories = [...localCategories, ...apiCategories]; // Combinar ambas fuentes
  const priceRange = getPriceRange();

  // Sincronizar precios locales con filtros globales
  useEffect(() => {
    setLocalMinPrice(filters.minPrice);
    setLocalMaxPrice(filters.maxPrice);
  }, [filters.minPrice, filters.maxPrice]);

  const handleCategoryChange = (e) => {
    updateFilters({ category: e.target.value });
  };

  const handleSearchChange = (e) => {
    updateFilters({ search: e.target.value });
  };

  const handleMinPriceChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setLocalMinPrice(value);
  };

  const handleMaxPriceChange = (e) => {
    const value = parseInt(e.target.value) || priceRange.max;
    setLocalMaxPrice(value);
  };

  const applyPriceFilter = () => {
    const minPrice = Math.max(0, localMinPrice);
    const maxPrice = Math.max(minPrice, localMaxPrice);
    
    updateFilters({ 
      minPrice, 
      maxPrice 
    });
    
    console.log(`🧪 Filtro de precio aplicado: $${minPrice.toLocaleString()} - $${maxPrice.toLocaleString()}`);
  };

  const clearPriceFilter = () => {
    const defaultMax = priceRange.max || 200000;
    setLocalMinPrice(0);
    setLocalMaxPrice(defaultMax);
    updateFilters({ 
      minPrice: 0, 
      maxPrice: defaultMax 
    });
  };


  const handleResetFilters = () => {
    resetFilters();
    console.log('🔄 Filtros reseteados');
  };

  // Detectar Enter en inputs de precio
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      applyPriceFilter();
    }
  };

  return (
    <aside className="filters space-filters">
      <div className="filters-header">
        <h3>Filtros</h3>
      </div>

      {/* Filtro de precio */}
      <div className="filter-group">
        <h4>Precio</h4>
        <div 
          id="price-range-label" 
          className="price-range-label"
        >
          Rango actual: ${filters.minPrice.toLocaleString()} - ${filters.maxPrice.toLocaleString()}
        </div>
        <div className="price-range">
          <div className="price-inputs">
            <div className="price-input-group">
              <label htmlFor="min-price">Precio mínimo:</label>
              <input 
                type="number" 
                id="min-price" 
                min="0" 
                max={priceRange.max}
                value={localMinPrice} 
                onChange={handleMinPriceChange}
                onKeyPress={handleKeyPress}
                placeholder="0"
              />
            </div>
            <div className="price-input-group">
              <label htmlFor="max-price">Precio máximo:</label>
              <input 
                type="number" 
                id="max-price" 
                min="0" 
                value={localMaxPrice} 
                onChange={handleMaxPriceChange}
                onKeyPress={handleKeyPress}
                placeholder={priceRange.max?.toString() || "200000"}
              />
            </div>
          </div>
          <div className="price-actions">
            <button 
              id="apply-price-filter" 
              className="apply-filter-btn"
              onClick={applyPriceFilter}
              title="Aplicar filtro de precio"
            >
              ✓ Aplicar
            </button>
            <button 
              id="clear-price-filter" 
              className="clear-filter-btn"
              onClick={clearPriceFilter}
              title="Limpiar filtro de precio"
            >
              ✕ Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* Filtro de rating eliminado */}

      {/* Resumen de filtros activos */}
      <div className="filter-summary">
        <h4>Filtros activos:</h4>
        <div className="active-filters">
          {filters.category && (
            <span className="filter-tag">
              Categoría: {filters.category}
              <button onClick={() => updateFilters({ category: '' })}>×</button>
            </span>
          )}
          {filters.search && (
            <span className="filter-tag">
              Búsqueda: "{filters.search}"
              <button onClick={() => updateFilters({ search: '' })}>×</button>
            </span>
          )}
          {(filters.minPrice > 0 || filters.maxPrice < priceRange.max) && (
            <span className="filter-tag">
              Precio: ${filters.minPrice.toLocaleString()} - ${filters.maxPrice.toLocaleString()}
              <button onClick={clearPriceFilter}>×</button>
            </span>
          )}
          {filters.minRating > 0 && (
            <span className="filter-tag">
              Rating: {filters.minRating}+ ⭐
              <button onClick={() => updateFilters({ minRating: 0 })}>×</button>
            </span>
          )}
        </div>
      </div>

      {/* Botón Limpiar al final */}
      <div className="filter-group">
        <button 
          className="reset-filters-btn reset-filters-btn-wide" 
          onClick={handleResetFilters}
          title="Resetear todos los filtros"
        >
          Limpiar
        </button>
      </div>
    </aside>
  );
}