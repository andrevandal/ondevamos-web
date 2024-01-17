import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    target: 'esnext',
  },
  resolve: {
    alias: { '@': __dirname },
  },
})
