import { defineConfig } from 'vite';

export default defineConfig({
  // Base path for GitHub Pages - uses repository name
  base: '/improved-pancake/',
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
