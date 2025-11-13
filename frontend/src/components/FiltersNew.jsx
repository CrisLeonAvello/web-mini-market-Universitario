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

  const handleRatingClick = (rating) => {
    // Si haces clic en la misma estrella, desactiva el filtro
    // Si haces clic en una estrella diferente, actualiza el rating
    const newRating = filters.minRating === rating ? 0 : rating;
    updateFilters({ minRating: newRating });
    console.log(`⭐ Filtro de rating: ${newRating} estrellas`);
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map(rating => (
      <span 
        key={rating}
        className={`star ${rating <= filters.minRating ? 'active' : ''}`}
        data-rating={rating}
        onClick={() => handleRatingClick(rating)}
        title={`${rating} estrella${rating > 1 ? 's' : ''}`}
        style={{
          color: rating <= filters.minRating ? '#ffd700' : 'rgba(255, 215, 0, 0.3)',
          cursor: 'pointer',
          fontSize: '1.5rem',
          transition: 'all 0.3s ease'
        }}
      >
        ★
      </span>
    ));
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
    <aside className="filters">
      <div className="filters-header">
        <h3>Filtros</h3>
        <p>Encuentra lo que buscas</p>
      </div>
      
      <div className="filter-group">
        <button 
          className="reset-filters-btn reset-filters-btn-wide" 
          onClick={handleResetFilters}
          title="Resetear todos los filtros"
        >
          Limpiar
        </button>
      </div>

      {/* Filtro por categoría */}
      <div className="filter-group">
        <h4>Categoría</h4>
        <select 
          className="filter-select" 
          value={filters.category} 
          onChange={handleCategoryChange}
        >
          <option value="">Todas las categorías</option>
          {/* Categorías de la API */}
          {apiCategories.map(category => (
            <option key={category.id || category.value} value={category.value || category.id}>
              {category.name}
            </option>
          ))}
          {/* Categorías locales como fallback */}
          {localCategories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Filtro de búsqueda */}
      <div className="filter-group">
        <h4>Buscar</h4>
        <input 
          className="search-input" 
          placeholder="Buscar productos..." 
          value={filters.search} 
          onChange={handleSearchChange}
        />
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

      {/* Filtro de rating */}
      <div className="filter-group">
        <h4 id="rating-label">
          Rating mínimo: {filters.minRating > 0 ? `${filters.minRating} estrellas` : 'Sin filtro'}
        </h4>
        <div className="rating-stars" id="rating-filter">
          {renderStars()}
        </div>
        {filters.minRating > 0 && (
          <button 
            className="clear-rating-btn"
            onClick={() => updateFilters({ minRating: 0 })}
            title="Limpiar filtro de rating"
          >
            Limpiar rating
          </button>
        )}
      </div>

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
    </aside>
  );
}