import React, { useState } from 'react';

export default function ApiDirectTest() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testDirectApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🧪 Probando conexión directa a FakeStore API...');
      
      // Probar fetch directo
      const response = await fetch('https://fakestoreapi.com/products', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Respuesta:', response);
      console.log('✅ Status:', response.status);
      console.log('📊 Headers:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📦 Datos recibidos:', data);
      
      setResult({
        success: true,
        status: response.status,
        productsCount: data.length,
        firstProduct: data[0],
        allData: data
      });

    } catch (err) {
      console.error('❌ Error en test directo:', err);
      setError({
        message: err.message,
        name: err.name,
        stack: err.stack
      });
    } finally {
      setLoading(false);
    }
  };

  const testWithCorsProxy = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🔄 Probando con CORS proxy...');
      
      // Usar un proxy CORS
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/https://fakestoreapi.com/products';
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📦 Datos con proxy:', data);
      
      setResult({
        success: true,
        proxy: true,
        status: response.status,
        productsCount: data.length,
        firstProduct: data[0]
      });

    } catch (err) {
      console.error('❌ Error con proxy:', err);
      setError({
        message: err.message,
        proxy: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
      border: '3px solid #ff0000',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      zIndex: 10000,
      maxWidth: '600px',
      maxHeight: '80vh',
      overflow: 'auto'
    }}>
      <h2 style={{ color: '#ff0000', textAlign: 'center' }}>
        🧪 Test de Conexión API
      </h2>

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button 
          onClick={testDirectApi}
          disabled={loading}
          style={{ 
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '🔄' : '🚀'} Test Directo
        </button>

        <button 
          onClick={testWithCorsProxy}
          disabled={loading}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '🔄' : '🔄'} Test con Proxy
        </button>
      </div>

      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          backgroundColor: '#e7f3ff',
          borderRadius: '5px'
        }}>
          <h3>🔄 Probando conexión...</h3>
        </div>
      )}

      {error && (
        <div style={{ 
          backgroundColor: '#ffebee',
          border: '2px solid #f44336',
          padding: '15px',
          borderRadius: '5px',
          marginTop: '15px'
        }}>
          <h3 style={{ color: '#d32f2f' }}>❌ Error de Conexión</h3>
          <p><strong>Mensaje:</strong> {error.message}</p>
          <p><strong>Tipo:</strong> {error.name}</p>
          {error.proxy && <p><strong>Con proxy:</strong> Sí</p>}
        </div>
      )}

      {result && (
        <div style={{ 
          backgroundColor: '#e8f5e8',
          border: '2px solid #4caf50',
          padding: '15px',
          borderRadius: '5px',
          marginTop: '15px'
        }}>
          <h3 style={{ color: '#2e7d32' }}>✅ Conexión Exitosa</h3>
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Productos:</strong> {result.productsCount}</p>
          {result.proxy && <p><strong>Usado proxy:</strong> Sí</p>}
          
          {result.firstProduct && (
            <div style={{ marginTop: '10px' }}>
              <h4>🛍️ Primer producto:</h4>
              <pre style={{ 
                backgroundColor: '#f5f5f5',
                padding: '10px',
                borderRadius: '4px',
                fontSize: '12px',
                overflow: 'auto'
              }}>
                {JSON.stringify(result.firstProduct, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      <div style={{ 
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#fff3cd',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <strong>💡 Qué hace este test:</strong>
        <ul>
          <li>🚀 <strong>Test Directo:</strong> Prueba https://fakestoreapi.com/products directamente</li>
          <li>🔄 <strong>Test con Proxy:</strong> Usa un proxy CORS si hay problemas</li>
        </ul>
      </div>
    </div>
  );
}