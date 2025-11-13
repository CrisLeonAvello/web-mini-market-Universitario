import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: false,
    watch: {
      usePolling: true,  // Necesario para Docker en Windows
      interval: 1000     // Verificar cambios cada segundo
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})