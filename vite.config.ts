import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('node_modules/@types/three')) {
            return 'three'
          }
          if (
            id.includes('node_modules/@react-three') ||
            id.includes('node_modules/postprocessing') ||
            id.includes('node_modules/maath') ||
            id.includes('node_modules/troika') ||
            id.includes('node_modules/three-stdlib') ||
            id.includes('node_modules/camera-controls') ||
            id.includes('node_modules/meshline')
          ) {
            return 'r3f'
          }
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
})
