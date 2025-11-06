import React from 'react';
import { useProducts } from '../contexts/ProductsContext';

export default function DebugInfo() {
  const { 
    allProducts, 
    filteredProducts, 
    loading, 
    error, 
    filters 
  } = useProducts();

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '15px', 
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 1000,
      maxWidth: '300px'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#00ff00' }}>🔍 Debug Info</h4>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Loading:</strong> {loading ? '🔄 SI' : '✅ NO'}
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Error:</strong> {error ? `❌ ${error}` : '✅ Ninguno'}
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>All Products:</strong> {allProducts ? allProducts.length : 0}
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Filtered Products:</strong> {filteredProducts ? filteredProducts.length : 0}
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Filtros activos:</strong> 
        <div style={{ fontSize: '10px', marginTop: '4px' }}>
          - Categoría: "{filters?.category || 'ninguna'}"<br/>
          - Búsqueda: "{filters?.search || 'ninguna'}"<br/>
          - Precio: ${filters?.minPrice || 0} - ${filters?.maxPrice || 0}<br/>
          - Rating mín: {filters?.minRating || 0}
        </div>
      </div>
      
      {allProducts && allProducts.length > 0 && (
        <div style={{ fontSize: '10px', marginTop: '10px' }}>
          <strong>Primer producto:</strong><br/>
          ID: {allProducts[0]?.id}<br/>
          Título: {allProducts[0]?.title?.substring(0, 30)}...<br/>
          Precio: ${allProducts[0]?.price}<br/>
          Categoría: {allProducts[0]?.category}
        </div>
      )}
    </div>
  );
}