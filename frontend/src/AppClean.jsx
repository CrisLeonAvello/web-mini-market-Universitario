import React, { useState } from 'react';
import LandingFigma from './components/LandingFigma';
import LoginPage from './components/LoginPage';
import './global.css';

function AppClean() {
  const [currentPage, setCurrentPage] = useState('landing');
  
  const handleLogin = () => {
    setCurrentPage('login');
  };
  
  const handleRegister = () => {
    setCurrentPage('register');
  };
  
  const handleBack = () => {
    setCurrentPage('landing');
  };

  return (
    <div className="app">
      {currentPage === 'landing' && (
        <LandingFigma onLogin={handleLogin} onRegister={handleRegister} />
      )}
      
      {currentPage === 'login' && (
        <div>
          <button onClick={handleBack}>← Volver</button>
          <LoginPage />
        </div>
      )}
      
      {currentPage === 'register' && (
        <div>
          <button onClick={handleBack}>← Volver</button>
          <h1>Registro</h1>
        </div>
      )}
    </div>
  );
}

export default AppClean;
