import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    // e2e/*.spec.ts là Playwright, không chạy bằng Vitest.
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'html'],
      // Chỉ tính coverage cho logic thuần dễ sai và đắt khi hỏng: helper dùng chung,
      // parse query param, phân quyền, hook hành vi trong core. UI/page/mock đo bằng component test.
      include: [
        'src/lib/**/*.ts',
        'src/core/**/*.{ts,tsx}',
        'src/features/*/search.ts',
        'src/features/*/guards.ts',
        'src/features/*/permissions.ts',
      ],
      exclude: ['src/lib/endpoints.ts', 'src/lib/query-client.ts'],
      // Đặt sát mức đang đạt (98/94/97/98) để thêm code không test là fail ngay.
      // Hạ ngưỡng phải có lý do trong PR, không hạ để cho qua.
      thresholds: {
        statements: 95,
        branches: 90,
        functions: 95,
        lines: 95,
      },
    },
  },
});
