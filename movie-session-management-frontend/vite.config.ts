import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Otimizações de performance
    target: 'es2020',
    sourcemap: false, // Desabilitar sourcemaps em produção para reduzir tamanho
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separar vendors grandes para melhor caching
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
              return 'vendor-vue'
            }
            if (id.includes('lucide-vue-next')) {
              return 'vendor-icons'
            }
            if (id.includes('axios')) {
              return 'vendor-http'
            }
          }
        }
      }
    },
    // Cache otimizado
    chunkSizeWarningLimit: 600, // Warning apenas para chunks > 600KB
  },
  server: {
    port: 5173,
    hmr: {
      overlay: true
    }
  }
})
