import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://114.132.68.81:8000',
        changeOrigin: true,
        // Don't rewrite /api because our backend uses /api prefix already
      }
    }
  }
})
