import React, { useState } from 'react';

export default function ApiFetchTest() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Tu fetch original exacto
  const fetchBasic = () => {
    setLoading(true);
    setError(null);
    
    console.log('🔄 Ejecutando tu fetch original...');
    
    fetch('https://fakestoreapi.com/products')
      .then(response => response.json())
      .then(data => {
        console.log('✅ Datos recibidos:', data);
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error:', err);
        setError(err.message);
        setLoading(false);
      });
  };

  // Fetch con async/await
  const fetchModern = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Ejecutando fetch moderno...');
      
      const response = await fetch('https://fakestoreapi.com/products');
      const data = await response.json();
      
      console.log('✅ Datos recibidos (async/await):', data);
      setProducts(data);
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Limpiar resultados
  const clearResults = () => {
    setProducts([]);
    setError(null);
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #007bff', 
      margin: '20px', 
      borderRadius: '8px',
      backgroundColor: '#f8f9fa'
    }}>
      <h3>🧪 Prueba de Fetch a FakeStore API</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={fetchBasic} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '🔄 Cargando...' : '🚀 Tu Fetch Original'}
        </button>
        
        <button 
          onClick={fetchModern} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '🔄 Cargando...' : '⚡ Fetch Moderno'}
        </button>
        
        <button 
          onClick={clearResults}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🗑️ Limpiar
        </button>
      </div>

      <div style={{ marginBottom: '20px', fontFamily: 'monospace', fontSize: '14px' }}>
        <strong>📝 Código ejecutado:</strong>
        <pre style={{ 
          backgroundColor: '#e9ecef', 
          padding: '10px', 
          borderRadius: '4px',
          overflow: 'auto'
        }}>
{`fetch('https://fakestoreapi.com/products')
  .then(response => response.json())
  .then(data => console.log(data));`}
        </pre>
      </div>

      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          marginBottom: '20px',
          color: '#721c24'
        }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {loading && (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center',
          backgroundColor: '#d1ecf1',
          borderRadius: '4px'
        }}>
          <strong>🔄 Cargando productos desde la API...</strong>
        </div>
      )}

      {products.length > 0 && (
        <div>
          <h4>✅ Productos obtenidos: {products.length}</h4>
          
          <div style={{ 
            maxHeight: '400px', 
            overflowY: 'auto',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            padding: '10px'
          }}>
            {products.slice(0, 5).map(product => (
              <div key={product.id} style={{ 
                border: '1px solid #ccc', 
                padding: '10px', 
                margin: '10px 0', 
                borderRadius: '4px',
                backgroundColor: 'white'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }} 
                  />
                  <div>
                    <h5 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>
                      {product.title}
                    </h5>
                    <p style={{ margin: '0 0 5px 0', color: '#28a745', fontWeight: 'bold' }}>
                      ${product.price}
                    </p>
                    <p style={{ margin: '0', color: '#6c757d', fontSize: '14px' }}>
                      📂 {product.category} | ⭐ {product.rating.rate}/5
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {products.length > 5 && (
              <p style={{ textAlign: 'center', color: '#6c757d' }}>
                ... y {products.length - 5} productos más
              </p>
            )}
          </div>

          <div style={{ 
            marginTop: '15px', 
            padding: '10px', 
            backgroundColor: '#d4edda',
            borderRadius: '4px'
          }}>
            <strong>📊 Resumen:</strong>
            <ul style={{ margin: '5px 0' }}>
              <li>Total de productos: {products.length}</li>
              <li>Categorías: {[...new Set(products.map(p => p.category))].join(', ')}</li>
              <li>Rango de precios: ${Math.min(...products.map(p => p.price))} - ${Math.max(...products.map(p => p.price))}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}