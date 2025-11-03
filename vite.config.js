import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure assets are served from root
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
  server: {
    port: 5173,
    host: true
  },
  css: {
    devSourcemap: false // Disable CSS source map warnings
  }
})

// import { defineConfig } from 'vite';
// import path from 'path';

// export default defineConfig({
//   resolve: {
//     alias: {
//       '@assets': path.resolve(__dirname, 'assets'),
//     },
//   },
// });
