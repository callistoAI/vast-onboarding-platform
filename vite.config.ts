import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    // Ensure environment variables are available at build time
    'import.meta.env.VITE_NEXT_PUBLIC_GOOGLE_CLIENT_ID': JSON.stringify(process.env.VITE_NEXT_PUBLIC_GOOGLE_CLIENT_ID),
    'import.meta.env.VITE_NEXT_PUBLIC_META_APP_ID': JSON.stringify(process.env.VITE_NEXT_PUBLIC_META_APP_ID),
  },
});
