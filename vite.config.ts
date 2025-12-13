import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        target: 'esnext',
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
        },
        rollupOptions: {
          output: {
            manualChunks: {
              'vendor-react': ['react', 'react-dom'],
              'vendor-ui': ['lucide-react', 'framer-motion'],
              'vendor-supabase': ['@supabase/supabase-js'],
              'features-games': [
                './components/games/PlayZoneHub.tsx',
              ],
              'features-social': [
                './components/SocialFeed.tsx',
                './components/Communities.tsx',
              ],
              'features-ai': [
                './components/AIToolsHub.tsx',
                './components/PanduCommandCenter.tsx',
              ],
            },
          },
        },
        chunkSizeWarningLimit: 600,
        sourcemap: false,
      },
    };
});
