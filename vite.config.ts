import { tanstackRouter } from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rolldownOptions: {
      output: {
        // Gom framework ổn định vào một chunk để cache lâu giữa các lần deploy.
        // Không gom antd: để rolldown tách theo route, tránh một chunk khổng lồ.
        codeSplitting: {
          groups: [
            {
              name: 'framework',
              test: /node_modules[\\/](react|react-dom|scheduler|@tanstack|zustand|axios|i18next|react-i18next|zod|dayjs)[\\/]/,
            },
          ],
        },
      },
    },
  },
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
});
