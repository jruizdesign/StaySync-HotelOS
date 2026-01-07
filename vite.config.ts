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
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || "AIzaSyCL9RMq3d8J__a_nlFMJxnSH5GW8S1dZUI"),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || "AIzaSyCL9RMq3d8J__a_nlFMJxnSH5GW8S1dZUI"),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || "AIzaSyCL9RMq3d8J__a_nlFMJxnSH5GW8S1dZUI")
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        '@firebasegen/default': path.resolve(__dirname, 'src/generated'),
      }
    }
  };
});
