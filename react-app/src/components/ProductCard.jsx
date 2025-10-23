import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

export default function ProductCard({ product, onOpenModal }) {
  const { addToCart } = useCart();
  const { items, toggle } = useWishlist();
  const isFav = items.includes(product.id);
  
  // Adaptar los datos de la API a nuestro formato
  const imageUrl = product.image || '/placeholder-image.jpg';
  const title = product.title || 'Producto sin título';
  const description = product.description || 'Sin descripción';
  const price = product.price || 0;
  const category = product.category || 'Sin categoría';
  const rating = product.rating?.rate || product.rating || 0;
  const stock = Math.floor(Math.random() * 20) + 5; // Stock aleatorio
  const featured = product.featured || false;
  
  // Truncar descripción si es muy larga
  const truncatedDescription = description.length > 100 
    ? description.substring(0, 100) + '...' 
    : description;
  
  return (
    <article className="product-card">
      <div 
        className={`product-image ${stock === 0 ? 'out-of-stock' : ''}`} 
        style={{ backgroundImage: `url('${imageUrl}')` }} 
        onClick={() => onOpenModal && onOpenModal(product)}
      >
        <span className="product-tag">{category}</span>
        {featured && <span className="featured-badge"> Destacado</span>}
      </div>
      
      <div className="product-info">
        <div className="product-brand">
          <small>{category}</small>
        </div>
        
        <h3 className="product-title">{title}</h3>
        
        <p className="product-description">{truncatedDescription}</p>
        
        <div className="product-rating">
          <span className="stars">{''.repeat(Math.floor(rating))}</span>
          <span className="rating-text">({rating.toFixed(1)})</span>
        </div>
        
        <div className="product-footer">
          <span className="price">${price.toLocaleString()}</span>
          
          <div className="availability-wishlist">
            <span className={`availability ${stock === 0 ? 'out-of-stock' : ''}`}>
              {stock > 0 ? `${stock} disponibles` : 'Sin stock'}
            </span>
            
            <div className="product-actions">
              <button 
                className={`wishlist-heart-btn ${isFav ? 'active' : ''}`} 
                onClick={() => toggle(product.id)} 
                title="Agregar a favoritos" 
                data-id={product.id}
              >
                <span className="heart-icon"></span>
              </button>
            </div>
          </div>
        </div>
        
        <button 
          className={`add-to-cart ${stock === 0 ? 'disabled' : ''}`} 
          data-product-id={product.id} 
          onClick={() => addToCart(product.id)} 
          disabled={stock === 0}
        >
          {stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
        </button>
      </div>
    </article>
  );
}
