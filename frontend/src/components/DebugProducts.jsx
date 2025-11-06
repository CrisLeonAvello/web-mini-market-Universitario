import React from 'react';
import { useProducts } from '../contexts/ProductsContext';

export default function DebugProducts() {
  const { 
    allProducts, 
    filteredProducts, 
    loading, 
    error, 
    filters 
  } = useProducts();

  console.log('🐛 DEBUG - Estado completo:', {
    allProducts: allProducts?.length || 0,
    filteredProducts: filteredProducts?.length || 0,
    loading,
    error,
    filters
  });

  return (
    <div style={{ 
      background: '#f0f0f0', 
      padding: '10px', 
      margin: '10px', 
      border: '1px solid #ccc',
      fontSize: '12px'
    }}>
      <h4>🐛 Debug Products:</h4>
      <p><strong>Loading:</strong> {loading ? 'SÍ' : 'NO'}</p>
      <p><strong>Error:</strong> {error || 'Ninguno'}</p>
      <p><strong>Productos totales:</strong> {allProducts?.length || 0}</p>
      <p><strong>Productos filtrados:</strong> {filteredProducts?.length || 0}</p>
      <p><strong>Filtros activos:</strong></p>
      <ul>
        <li>Categoría: {filters.category || 'Todas'}</li>
        <li>Búsqueda: {filters.search || 'Sin búsqueda'}</li>
        <li>Precio: {filters.minPrice} - {filters.maxPrice}</li>
      </ul>
      
      {allProducts && allProducts.length > 0 && (
        <div>
          <p><strong>Primer producto:</strong></p>
          <pre style={{ fontSize: '10px', background: 'white', padding: '5px' }}>
            {JSON.stringify(allProducts[0], null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}