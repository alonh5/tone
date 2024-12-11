import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  define: {
    global: {},
    process: {
      env: {},
    },
  },
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@aws-sdk/client-s3',
      '@aws-sdk/s3-request-presigner'
    ]
  },
  base: '',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
