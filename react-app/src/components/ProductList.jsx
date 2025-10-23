import React from 'react'
import ProductCardNew from './ProductCardNew'
import { useProducts } from '../contexts/ProductsContext'

export default function ProductList({ onProductClick }){
  const { filteredProducts, loading, error } = useProducts()
  
  console.log('🏪 ProductList renderizado:', { 
    filteredProducts: filteredProducts?.length || 0, 
    loading, 
    error 
  })
  
  if (loading) {
    return (
      <div className="loading-message" style={{ padding: '20px', textAlign: 'center' }}>
        <h3>🔄 Cargando productos...</h3>
        <p>Obteniendo datos desde la API...</p>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="error-message" style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h3>❌ Error al cargar productos</h3>
        <p>{error}</p>
      </div>
    )
  }
  
  if(!filteredProducts || filteredProducts.length === 0) {
    return (
      <div className="loading-message" style={{ padding: '20px', textAlign: 'center' }}>
        <h3>📦 No se encontraron productos</h3>
        <p>Total de productos disponibles: {filteredProducts?.length || 0}</p>
        <p>Intenta ajustar los filtros o recarga la página.</p>
      </div>
    )
  }
  
  console.log('🛍️ Renderizando productos:', filteredProducts.length)
  
  return (
    <div className="products-grid">
      {filteredProducts.map(product => {
        console.log('🏷️ Renderizando producto:', product.id, product.title)
        return (
          <ProductCardNew 
            key={product.id}
            product={product} 
            onOpenModal={onProductClick} 
          />
        )
      })}
    </div>
  )
}
