import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Tailwind v4 via plugin oficial
  ],
  resolve: {
    alias: {
      // Alias "@" → "src" (precisa casar com tsconfig.app.json paths)
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    // Proxy opcional em dev: se preferir, pode chamar "/api/v1/..." direto.
    // Como o backend .NET já tem CORS configurado, deixamos desativado por padrão.
    // proxy: {
    //   '/api': { target: 'http://localhost:5100', changeOrigin: true },
    // },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Alvo moderno — sem suporte a IE (não é escopo do FinBrain)
    target: 'es2022',
  },
})