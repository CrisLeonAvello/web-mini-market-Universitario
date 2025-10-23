import React, { useState, useEffect } from 'react';

export default function ApiUrlDemo() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Tu URL exacta
  const API_URL = 'https://fakestoreapi.com/products';

  const fetchDirectly = async () => {
    setLoading(true);
    console.log('🔗 Haciendo fetch directamente a:', API_URL);
    
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      
      console.log('✅ Datos recibidos de', API_URL, ':', data);
      setProducts(data);
    } catch (error) {
      console.error('❌ Error al conectar con', API_URL, ':', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '3px solid #28a745', 
      margin: '20px', 
      borderRadius: '8px',
      backgroundColor: '#d4edda'
    }}>
      <h2>🎯 Demostración de URL de API</h2>
      
      <div style={{ marginBottom: '20px', fontFamily: 'monospace' }}>
        <h3>📡 URL que estamos usando:</h3>
        <div style={{ 
          backgroundColor: '#e9ecef', 
          padding: '15px', 
          borderRadius: '4px',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#0066cc'
        }}>
          {API_URL}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={fetchDirectly}
          disabled={loading}
          style={{ 
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '🔄 Conectando...' : '🚀 Probar URL directamente'}
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>📋 Lo que hace este botón:</h4>
        <pre style={{ 
          backgroundColor: '#f8f9fa',
          padding: '10px',
          borderRadius: '4px',
          border: '1px solid #dee2e6'
        }}>
{`fetch('${API_URL}')
  .then(response => response.json())
  .then(data => console.log(data));`}
        </pre>
      </div>

      {loading && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#cce7ff',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <strong>🔄 Conectando con {API_URL}...</strong>
        </div>
      )}

      {products.length > 0 && (
        <div>
          <h3>✅ ¡Conexión exitosa!</h3>
          <div style={{ 
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderRadius: '4px',
            border: '1px solid #dee2e6'
          }}>
            <p><strong>📊 Productos obtenidos:</strong> {products.length}</p>
            <p><strong>🔗 Desde URL:</strong> {API_URL}</p>
            <p><strong>📝 Primer producto:</strong> {products[0]?.title}</p>
            <p><strong>💰 Precio:</strong> ${products[0]?.price}</p>
            <p><strong>🏷️ Categoría:</strong> {products[0]?.category}</p>
          </div>

          <details style={{ marginTop: '15px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              🔍 Ver todos los productos (JSON)
            </summary>
            <pre style={{ 
              backgroundColor: '#f1f3f4',
              padding: '10px',
              borderRadius: '4px',
              fontSize: '12px',
              maxHeight: '300px',
              overflow: 'auto',
              marginTop: '10px'
            }}>
              {JSON.stringify(products, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}