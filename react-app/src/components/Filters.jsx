import React from 'react'

export default function Filters({products, filters, setFilters}){
  const categories = [...new Set(products.map(p=>p.categoria))]
  return (
    <aside className="filters">
      <div className="filters-header">
        <h3>Filtros</h3>
        <button className="reset-filters-btn" onClick={()=>{
          setFilters({search:'',category:'',minPrice:0,maxPrice:filters.maxPrice,minRating:0,sortBy:''})
        }}>Limpiar</button>
      </div>
      <div className="filter-group">
        <h4>Categoría</h4>
        <select className="filter-select" value={filters.category} onChange={e=> setFilters(f=>({...f,category:e.target.value}))}>
          <option value="">Seleccionar categoría</option>
          {categories.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="filter-group">
        <h4>Buscar</h4>
        <input className="search-input" placeholder="Buscar productos..." value={filters.search} onChange={e=> setFilters(f=>({...f,search:e.target.value}))} />
      </div>
      <div className="filter-group">
        <h4>Precio</h4>
        <h4 id="price-range-label">Rango de precio: $0 - $200.000</h4>
        <div className="price-range">
          <div className="price-inputs">
            <div className="price-input-group">
              <label htmlFor="min-price">Precio mínimo:</label>
              <input type="number" id="min-price" min="0" value={filters.minPrice} onChange={e=> setFilters(f=>({...f,minPrice: parseInt(e.target.value||0)}))} />
            </div>
            <div className="price-input-group">
              <label htmlFor="max-price">Precio máximo:</label>
              <input type="number" id="max-price" min="0" value={filters.maxPrice} onChange={e=> setFilters(f=>({...f,maxPrice: parseInt(e.target.value||0)}))} />
            </div>
          </div>
        <div className="price-actions">
          <button id="apply-price-filter" className="apply-filter-btn" onClick={()=>{/* handled externally by filters state */}}>Aplicar filtro</button>
          <button id="clear-price-filter" className="clear-filter-btn" onClick={()=>{setFilters(f=>({...f,minPrice:0,maxPrice:filters.maxPrice}))}}>Limpiar</button>
        </div>
      </div>
      </div>
      <div className="filter-group">
        <h4 id="rating-label">Rating mínimo: 0 estrellas</h4>
        <div className="rating-stars" id="rating-filter">
          <div className="star" data-rating="1">★</div>
          <div className="star" data-rating="2">★</div>
          <div className="star" data-rating="3">★</div>
          <div className="star" data-rating="4">★</div>
          <div className="star" data-rating="5">★</div>
        </div>
        <div className="rating-clear">
          <button id="clear-rating" className="clear-btn">Limpiar filtro</button>
        </div>
      </div>
      <div className="filter-group">
        <h4>Orden</h4>
        <select className="search-select" value={filters.sortBy} onChange={e=> setFilters(f=>({...f,sortBy:e.target.value}))}>
          <option value="">Más recientes</option>
          <option>Menor precio</option>
          <option>Mayor precio</option>
          <option>Mejor valorados</option>
          <option>Más vendidos</option>
          <option>Destacados</option>
        </select>
      </div>
    </aside>
  )
}
