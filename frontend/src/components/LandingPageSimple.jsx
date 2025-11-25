import React from 'react';

export default function LandingPageSimple() {
  console.log('✅✅✅ LANDINGPAGE SIMPLE CARGADO ✅✅✅');
  
  return (
    <div style={{
      background: '#00ff00',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '50px',
      color: 'black',
      fontWeight: 'bold'
    }}>
      <div>
        <h1>🟢 LANDING PAGE SIMPLE FUNCIONANDO 🟢</h1>
        <p style={{ fontSize: '30px', textAlign: 'center' }}>
          Si ves esto, el problema está en LandingPage.jsx original
        </p>
      </div>
    </div>
  );
}
