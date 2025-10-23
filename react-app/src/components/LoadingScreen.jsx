import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState('Inicializando...');

  const minimumLoadTime = 2500; // Tiempo mínimo en milisegundos
  const fadeOutDuration = 800; // Duración del fade-out en milisegundos

  useEffect(() => {
    const startTime = Date.now();
    let resourcesLoaded = false;

    // Simular carga de recursos
    const simulateLoading = () => {
      const steps = [
        { text: 'Cargando productos...', progress: 25 },
        { text: 'Inicializando carrito...', progress: 50 },
        { text: 'Configurando filtros...', progress: 75 },
        { text: 'Finalizando...', progress: 100 }
      ];

      steps.forEach((step, index) => {
        setTimeout(() => {
          setCurrentText(step.text);
          setProgress(step.progress);
          
          if (index === steps.length - 1) {
            resourcesLoaded = true;
            checkAndHide();
          }
        }, (index + 1) * 400);
      });
    };

    // Escuchar eventos de recursos cargados
    const handleResourceLoaded = (event) => {
      console.log('📦 Recurso cargado:', event.detail);
      if (event.detail === 'Products loaded successfully') {
        resourcesLoaded = true;
        checkAndHide();
      }
    };

    const checkAndHide = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minimumLoadTime - elapsedTime);
      
      if (resourcesLoaded && elapsedTime >= minimumLoadTime) {
        hideLoadingScreen();
      } else {
        setTimeout(() => {
          if (resourcesLoaded) {
            hideLoadingScreen();
          }
        }, remainingTime);
      }
    };

    const hideLoadingScreen = () => {
      setCurrentText('¡Listo para comprar!');
      setProgress(100);
      
      setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = 'auto';
        
        if (onLoadingComplete) {
          onLoadingComplete();
        }
      }, fadeOutDuration);
    };

    // Prevenir scroll mientras carga
    document.body.style.overflow = 'hidden';
    
    // Iniciar simulación
    simulateLoading();
    
    // Escuchar eventos de carga
    document.addEventListener('resourceLoaded', handleResourceLoaded);
    
    // Cleanup
    return () => {
      document.removeEventListener('resourceLoaded', handleResourceLoaded);
      document.body.style.overflow = 'auto';
    };
  }, [onLoadingComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo">
          <h1>📚 StudiMarket</h1>
          <p>Tu tienda universitaria online</p>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <div className="loading-text">
          <p>{currentText}</p>
          <div className="loading-progress">
            <div 
              className="progress-bar" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          opacity: ${isVisible ? 1 : 0};
          transition: opacity ${fadeOutDuration}ms ease-out;
        }
        
        .loading-content {
          text-align: center;
          color: white;
          animation: fadeInUp 1s ease-out;
        }
        
        .loading-logo h1 {
          font-size: 3rem;
          margin: 0;
          font-weight: bold;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          animation: pulse 2s infinite;
        }
        
        .loading-logo p {
          font-size: 1.2rem;
          margin: 0.5rem 0 2rem 0;
          opacity: 0.9;
        }
        
        .loading-spinner {
          margin: 2rem 0;
        }
        
        .spinner {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(255,255,255,0.3);
          border-top: 4px solid white;
          border-radius: 50%;
          margin: 0 auto;
          animation: spin 1s linear infinite;
        }
        
        .loading-text p {
          font-size: 1.1rem;
          margin: 2rem 0 1rem 0;
          min-height: 1.5em;
        }
        
        .loading-progress {
          width: 250px;
          height: 6px;
          background: rgba(255,255,255,0.3);
          border-radius: 3px;
          margin: 0 auto;
          overflow: hidden;
        }
        
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #ff6b6b, #ffd93d);
          border-radius: 3px;
          transition: width 0.3s ease;
          animation: progressLoad 0.5s ease;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes progressLoad {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        
        @media (max-width: 768px) {
          .loading-logo h1 {
            font-size: 2rem;
          }
          
          .loading-progress {
            width: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;