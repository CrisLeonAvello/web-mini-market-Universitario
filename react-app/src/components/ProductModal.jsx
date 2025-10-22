import React from 'react'
import { useCart } from '../contexts/CartContext'

export default function ProductModal({product, open, onClose}){
  const { addToCart } = useCart()
  if(!open || !product) return null
  return (
    <div className="product-modal" style={{display:'flex'}}>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="modal-product-title">{product.titulo}</h2>
          <button className="product-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="modal-image"><img id="modal-product-image" src={product.imagenes?.[0]} alt={product.titulo} /></div>
          <div className="modal-info">
            <div className="modal-brand">Marca: {product.marca}</div>
            <div className="modal-price">${(product.precio/100).toFixed(2)}</div>
            <div className="modal-description">{product.descripcion}</div>
            <div className="modal-stock-info">Stock: <span className="modal-stock-number">{product.stock}</span></div>
            <div className="modal-actions">
              <button className="modal-btn primary" id="modal-add-to-cart" onClick={()=>{ addToCart(product.id); }}>
                Agregar al carrito
              </button>
              <button className="modal-btn secondary" onClick={onClose}>Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
