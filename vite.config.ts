import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Toujours le port 5173 : si un autre projet l'occupe, Vite s'arrête
  // avec un message au lieu de passer en silence sur 5174.
  server: { port: 5173, strictPort: true },
})
