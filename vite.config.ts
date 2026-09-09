import { tanstackRouter } from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';
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
    // React Compiler (qua oxc-transform-react, không cần Babel) tự memo component/hook:
    // không cần useMemo/useCallback tay, hết re-render thừa. Component vi phạm rule của
    // React bị bỏ qua (không memo), eslint-plugin-react-hooks báo chỗ đó.
    react({ compiler: true }),
    tailwindcss(),
    // `yarn build:analyze` -> dist/stats.html để soi chunk nào phình.
    process.env.ANALYZE
      ? visualizer({ filename: 'dist/stats.html', gzipSize: true })
      : undefined,
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
});
