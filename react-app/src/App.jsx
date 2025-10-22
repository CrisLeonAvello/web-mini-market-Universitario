import React, {useEffect, useState} from 'react'
import ProductList from './components/ProductList'
import Filters from './components/Filters'
import ProductModal from './components/ProductModal'
import { CartProvider } from './contexts/CartContext'
import { WishlistProvider } from './contexts/WishlistContext'
import Notification from './components/Notification'

export default function App(){
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    search: '', category: '', minPrice: 0, maxPrice: 9999999, minRating: 0, sortBy: ''
  })
  const [currentProduct, setCurrentProduct] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(()=>{
    fetch('/products.json')
      .then(res=>{
        if(!res.ok) throw new Error('HTTP ' + res.status)
        return res.json()
      })
      .then(data=>{
        setProducts(data)
        setFiltered(data)
        // set sensible max price
        const prices = data.map(p=>p.precio)
        const max = prices.length ? Math.max(...prices) : 200000
        setFilters(f=> ({...f, maxPrice: max}))
      })
      .catch(err=> setError(err.message))
      .finally(()=> setLoading(false))
  },[])

  useEffect(()=>{
    // apply filters
    let out = [...products]
    const s = filters.search.trim().toLowerCase()
    if(filters.category) out = out.filter(p=> p.categoria === filters.category)
    if(s) out = out.filter(p=> p.titulo.toLowerCase().includes(s) || p.descripcion.toLowerCase().includes(s) || p.marca.toLowerCase().includes(s))
    out = out.filter(p=> p.precio >= (filters.minPrice||0) && p.precio <= (filters.maxPrice||9999999))
    if(filters.minRating>0) out = out.filter(p=> p.rating >= filters.minRating)
    // sort
    switch(filters.sortBy){
      case 'Menor precio': out.sort((a,b)=> a.precio - b.precio); break
      case 'Mayor precio': out.sort((a,b)=> b.precio - a.precio); break
      case 'Mejor valorados': out.sort((a,b)=> b.rating - a.rating); break
      case 'Más vendidos': out.sort((a,b)=> b.vendidos - a.vendidos); break
      case 'Destacados': out.sort((a,b)=> (b.destacado?1:0) - (a.destacado?1:0)); break
    }
    setFiltered(out)
  },[filters, products])

  function openProductModal(product){ setCurrentProduct(product); setModalOpen(true) }
  function closeProductModal(){ setCurrentProduct(null); setModalOpen(false) }

  return (
    <CartProvider>
      <WishlistProvider>
        <div className="app-container">
          <header className="header">
            <div className="logo">StudiMarket</div>
            <nav className="nav-buttons">
              <a href="#" className="nav-btn primary">🔍 Catálogo</a>
              <button className="open-cart-btn nav-btn" style={{padding: '8px 16px', fontSize: '15px', background: '#fff', color: '#4285f4', border: '1px solid #4285f4', borderRadius: '8px', cursor: 'pointer', position: 'relative'}}>
                🛒 Carrito
                <span id="cart-counter" style={{display: 'none', position: 'absolute', top: '-8px', right: '-8px', background: '#ff6b35', color: 'white', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', textAlign: 'center', lineHeight: '20px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'}}>0</span>
              </button>
              <a href="#" className="nav-btn" id="wishlist-btn">❤️ Favoritos</a>
            </nav>

            <div id="wishlist-menu" className="wishlist-menu">
                <div className="wishlist-header">
                    <span>Mis Favoritos</span>
                    <button id="close-wishlist" title="Cerrar">✕</button>
                </div>
                <div id="wishlist-list" className="wishlist-list"></div>
                <div className="wishlist-actions">
                    <button id="buy-all-wishlist" className="wishlist-action-btn buy-all" title="Comprar todos los productos">🛒 Comprar Todo</button>
                    <button id="clear-all-wishlist" className="wishlist-action-btn clear-all" title="Vaciar lista de favoritos">🗑️ Vaciar Lista</button>
                </div>
                <div className="wishlist-empty">No tienes productos en favoritos.</div>
            </div>
          </header>

          <main className="main-content">
            <div className="search-bar">
              <input type="text" className="search-input" placeholder="Buscar productos..." value={filters.search} onChange={e=> setFilters(f=>({...f,search: e.target.value}))} />
              <select className="search-select" value={filters.sortBy} onChange={e=> setFilters(f=>({...f,sortBy: e.target.value}))}>
                <option>Mejor valorados</option>
                <option>Menor precio</option>
                <option>Mayor precio</option>
                <option>Más vendidos</option>
                <option>Destacados</option>
                <option>Más recientes</option>
              </select>
            </div>

            <div className="filters-section">
              <Filters products={products} filters={filters} setFilters={setFilters} />

              <section style={{flex: 1}}>
                {loading && <div className="loading-message">Cargando productos...</div>}
                {error && <div className="error-message">Error: {error}</div>}
                {!loading && !error && <ProductList products={filtered} onOpenModal={openProductModal} />}
              </section>
            </div>
          </main>
          <ProductModal product={currentProduct} open={modalOpen} onClose={closeProductModal} />
          <Notification />
        </div>
      </WishlistProvider>
    </CartProvider>
  )
}
