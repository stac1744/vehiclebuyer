import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/vehiclebuyer/',

    define: {
      // Vite-style env injection
      'import.meta.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src') // Clean alias for imports like '@/components/VehicleCard'
      }
    },

    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false
    },

    server: {
      port: 5173,
      open: true
    }
  };
});
