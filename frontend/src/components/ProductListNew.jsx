import React, { useState } from 'react'
import ProductCardNew from './ProductCardNew'
import ProductModalNew from './ProductModalNew'
import { useProducts } from '../contexts/ProductsContext'

export default function ProductListNew(){
  const { filteredProducts, loading, error } = useProducts()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  console.log('🏪 ProductList renderizado:', { 
    filteredProducts: filteredProducts?.length || 0, 
    loading, 
    error 
  })

  const handleOpenModal = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }
  
  if (loading) {
    return (
      <div className="loading-message animate-fade-in" style={{ padding: '20px', textAlign: 'center' }}>
        <h3>🔄 Cargando productos...</h3>
        <p>Obteniendo datos desde la API...</p>
        <div className="loading-skeleton" style={{ height: '200px', borderRadius: '8px', marginTop: '1rem' }}></div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="error-message animate-shake" style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h3>❌ Error al cargar productos</h3>
        <p>{error}</p>
        <button className="btn-primary" onClick={() => window.location.reload()}>
          🔄 Reintentar
        </button>
      </div>
    )
  }
  
  if(!filteredProducts || filteredProducts.length === 0) {
    return (
      <div className="empty-products animate-fade-in" style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
        <h3>No se encontraron productos</h3>
        <p>Intenta ajustar los filtros o recarga la página.</p>
        <button className="btn-primary" onClick={() => window.location.reload()}>
          🔄 Recargar productos
        </button>
      </div>
    )
  }
  
  console.log('🛍️ Renderizando productos:', filteredProducts.length)
  
  return (
    <>
      <div className="products-grid space-products-grid">
        {filteredProducts.map((product, index) => {
          console.log('🏷️ Renderizando producto:', product.id, product.title)
          return (
            <div 
              key={product.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCardNew 
                product={product}
                onOpenModal={handleOpenModal}
              />
            </div>
          )
        })}
      </div>

      <ProductModalNew
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}