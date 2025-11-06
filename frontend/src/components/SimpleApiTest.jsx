import React, { useState, useEffect } from 'react';

export default function SimpleApiTest() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🧪 Iniciando test simple de API...');
    
    fetch('https://fakestoreapi.com/products?limit=5')
      .then(response => {
        console.log('📡 Respuesta:', response.status, response.ok);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('📦 Datos recibidos:', data);
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>🔄 Cargando test simple...</div>;
  if (error) return <div>❌ Error: {error}</div>;

  return (
    <div style={{ background: '#e8f5e8', padding: '10px', margin: '10px', border: '1px solid #4caf50' }}>
      <h4>✅ Test Simple API - Funcionando!</h4>
      <p>Productos obtenidos: {products.length}</p>
      {products.slice(0, 2).map(p => (
        <div key={p.id} style={{ fontSize: '12px', marginBottom: '5px' }}>
          <strong>{p.title.substring(0, 30)}...</strong> - ${p.price}
        </div>
      ))}
    </div>
  );
}