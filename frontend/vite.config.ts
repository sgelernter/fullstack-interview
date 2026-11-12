import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // proxy the server through port 8000 so this local demo doesn't need to worry about CORS or CSRF
  server: {
    proxy: {
      '/api': 'http://localhost:8000'
    }
  }
})
