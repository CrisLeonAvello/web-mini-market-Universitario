import React from 'react'
import ProductCard from './ProductCard'

export default function ProductList({products, onOpenModal}){
  if(!products) return null
  if(products.length===0) return <div className="loading-message">No se encontraron productos.</div>
  return (
    <div id="products-grid" className="products-grid">
      {products.map(p=> <ProductCard key={p.id} product={p} onOpenModal={onOpenModal} />)}
    </div>
  )
}
