import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 Error capturado por ErrorBoundary:', error);
    console.error('📍 Información del error:', errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          background: '#ffebee',
          border: '2px solid #f44336',
          borderRadius: '8px',
          margin: '1rem',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h2 style={{ color: '#d32f2f', margin: '0 0 1rem 0' }}>
            🚨 ¡Ups! Algo salió mal
          </h2>
          <p style={{ color: '#666', margin: '0 0 1rem 0' }}>
            La aplicación encontró un error inesperado. Por favor revisa la consola para más detalles.
          </p>
          <details style={{ marginTop: '1rem' }}>
            <summary style={{ cursor: 'pointer', color: '#1976d2' }}>
              Ver detalles del error
            </summary>
            <pre style={{
              background: '#f5f5f5',
              padding: '1rem',
              marginTop: '0.5rem',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '0.9rem',
              color: '#d32f2f'
            }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
            </pre>
          </details>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: '#2196f3',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            🔄 Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;