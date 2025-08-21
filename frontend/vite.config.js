import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5015,
    proxy: {
      '/api': 'http://localhost:5014',
      '/images': 'http://localhost:5014',
    },
  },
})
