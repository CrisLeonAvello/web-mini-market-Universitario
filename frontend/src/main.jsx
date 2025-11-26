import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './global.css'
import './styles.css'
import { registerSW } from 'virtual:pwa-register'
import { GoogleOAuthProvider } from '@react-oauth/google'

// Register Service Worker for PWA
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Nueva versión disponible. ¿Actualizar ahora?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('✅ App lista para funcionar offline')
  },
  onRegistered(registration) {
    console.log('✅ Service Worker registrado')
    // Check for updates every hour
    if (registration) {
      setInterval(() => {
        registration.update()
      }, 60 * 60 * 1000)
    }
  },
  onRegisterError(error) {
    console.error('❌ Error registrando Service Worker:', error)
  }
})

// Obtener Client ID de las variables de entorno
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)