import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Necesario para resolver las rutas

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Configuramos el alias '@' para que apunte a la carpeta 'src'
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: false, 
  }
})