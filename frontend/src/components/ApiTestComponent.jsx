/**
 * Componente de prueba para verificar la integración con FakeStore API
 */
import React, { useState, useEffect } from 'react';
import { getAllProducts, getTransformedProducts, getTransformedCategories } from '../services/fakeStoreApi';

export default function ApiTestComponent() {
  const [apiProducts, setApiProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    testApi();
  }, []);

  const testApi = async () => {
    try {
      setLoading(true);
      
      console.log('🧪 Iniciando prueba de API...');
      
      // Probar productos transformados
      const products = await getTransformedProducts();
      setApiProducts(products);
      
      // Probar categorías
      const cats = await getTransformedCategories();
      setCategories(cats);
      
      console.log('✅ API funcionando correctamente');
      console.log('Productos obtenidos:', products.length);
      console.log('Categorías obtenidas:', cats.length);
      
    } catch (err) {
      console.error('❌ Error en API:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', border: '2px solid #007bff', margin: '20px', borderRadius: '8px' }}>
        <h3>🔄 Probando conexión con FakeStore API...</h3>
        <p>Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', border: '2px solid #dc3545', margin: '20px', borderRadius: '8px', backgroundColor: '#f8d7da' }}>
        <h3>❌ Error en API</h3>
        <p>{error}</p>
        <button onClick={testApi} style={{ padding: '8px 16px', marginTop: '10px' }}>
          🔄 Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', border: '2px solid #28a745', margin: '20px', borderRadius: '8px', backgroundColor: '#d4edda' }}>
      <h3>✅ API de FakeStore funcionando correctamente</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4>📊 Estadísticas:</h4>
        <p><strong>Productos cargados:</strong> {apiProducts.length}</p>
        <p><strong>Categorías disponibles:</strong> {categories.length}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>🏷️ Categorías:</h4>
        <ul>
          {categories.map(cat => (
            <li key={cat.id}>{cat.name}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4>🛍️ Primeros 3 productos:</h4>
        {apiProducts.slice(0, 3).map(product => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0', borderRadius: '4px' }}>
            <h5>{product.title}</h5>
            <p><strong>Precio:</strong> ${product.price}</p>
            <p><strong>Categoría:</strong> {product.category}</p>
            <p><strong>Rating:</strong> {product.rating?.rate}/5 ({product.rating?.count} reviews)</p>
            <img src={product.image} alt={product.title} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
          </div>
        ))}
      </div>

      <button onClick={testApi} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
        🔄 Recargar datos
      </button>
    </div>
  );
}