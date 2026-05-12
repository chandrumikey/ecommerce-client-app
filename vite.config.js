import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,   // Increase limit from 500 KB to 1000 KB
    rollupOptions: {
      output: {
        manualChunks: {
          // Group vendor libraries into one chunk
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
        }
      }
    }
  }
})
