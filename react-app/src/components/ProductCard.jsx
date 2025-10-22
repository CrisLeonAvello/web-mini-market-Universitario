import React from 'react'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'

export default function ProductCard({product, onOpenModal}){
  const { addToCart } = useCart()
  const { items, toggle } = useWishlist()
  const isFav = items.includes(product.id)
  return (
    <article className="product-card">
      <div className={`product-image ${product.stock===0? 'out-of-stock':''}`} style={{backgroundImage:`url('${product.imagenes?.[0]}')`, cursor: 'pointer'}} onClick={()=> onOpenModal && onOpenModal(product)}>
        {product.destacado && <span className="featured-badge">Destacado</span>}
        <span className="product-tag">{product.categoria}</span>
      </div>
      <div className="product-info">
        <div className="product-brand"><small>{product.marca}</small></div>
        <h3 className="product-title">{product.titulo}</h3>
        <p className="product-description">{product.descripcion}</p>
        <div className="product-rating"><span className="stars">{'★'.repeat(Math.floor(product.rating))}</span><span className="rating-text">({product.rating})</span></div>
        <div className="product-footer">
          <span className="price">${product.precio.toLocaleString()}</span>
          <div className="availability-wishlist">
            <span className={`availability ${product.stock===0? 'out-of-stock':''}`}>{product.stock>0? `${product.stock} disponibles` : 'Sin stock'}</span>
            <div className="product-actions">
              <button className={`wishlist-heart-btn ${isFav? 'active':''}`} onClick={()=> toggle(product.id)} title="Agregar a favoritos" data-id={product.id}><span className="heart-icon">♡</span></button>
            </div>
          </div>
        </div>
        <button className={`add-to-cart ${product.stock===0? 'disabled':''}`} data-product-id={product.id} onClick={()=> addToCart(product.id)} disabled={product.stock===0}>{product.stock>0? 'Agregar al carrito' : 'Sin stock'}</button>
      </div>
    </article>
  )
}
