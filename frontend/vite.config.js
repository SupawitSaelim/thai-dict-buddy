import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // หรือใส่ '0.0.0.0' ก็ได้
    port: 3000,
    
    strictPort: true,
  }
})