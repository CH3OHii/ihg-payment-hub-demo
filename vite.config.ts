import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves from /<repo>/, so assets must be requested with that prefix.
export default defineConfig({
  plugins: [react()],
  base: '/ihg-payment-hub-demo/',
})
