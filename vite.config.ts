import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['framer-motion'],
  },
  server: {
    watch: {
      ignored: ['**/.vs/**', '**/out/**', '**/dist/**'],
    },
  },
  build: {
    outDir: 'dist',
  },
})
