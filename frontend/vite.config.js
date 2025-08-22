import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5015,
    proxy: {
      '/api': 'http://localhost:5014',
      '/images': 'http://localhost:5014',
      // This is the crucial line for Socket.IO
      '/socket.io': {
        target: 'http://localhost:5014',
        ws: true, // Enable WebSocket proxying
      },
    },
  },
})