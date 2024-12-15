import { defineConfig } from 'vite';

export default defineConfig({
  base: '/', // Adjust this if your app is deployed on a subpath, e.g., '/myapp/'
  build: {
    outDir: 'dist',
  },
});
