import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [
    angular({
      tsconfig: './tsconfig.json'
    })
  ],
  define: {
    // Inject the provided key if process.env.API_KEY is not set in the build environment
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '457014e25fedc034e5154ae568d60415')
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
    sourcemap: false
  },
  resolve: {
    mainFields: ['module']
  }
});