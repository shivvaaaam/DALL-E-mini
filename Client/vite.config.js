import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://dall-e-mini-dl1e-fz0x36l80-shivam-guptas-projects-f99d138a.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Remove '/api' prefix
      }
    }
  }
})
