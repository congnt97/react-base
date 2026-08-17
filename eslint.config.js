import js from '@eslint/js';
import pluginQuery from '@tanstack/eslint-plugin-query';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'src/routeTree.gen.ts'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginQuery.configs['flat/recommended'],
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // docs/skills/typescript.md: không dùng any/non-null assertion để né lỗi.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',

      // docs/skills/hooks.md: dependency thiếu phải sửa, không disable để né warning.
      'react-hooks/exhaustive-deps': 'error',

      // docs/skills/quality.md, security.md: không để sót console debug; warn/error vẫn cho phép vì
      // dùng cho log có kiểm soát.
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // docs/skills/security.md: dangerouslySetInnerHTML phải sanitize, không render thẳng.
      'no-restricted-syntax': [
        'warn',
        {
          selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
          message:
            'dangerouslySetInnerHTML cần sanitize trước khi dùng (xem docs/skills/security.md).',
        },
      ],
    },
  },
  {
    // docs/skills/architecture.md: domain là model thuần, không phụ thuộc framework.
    files: ['src/domain/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react', message: 'domain không được phụ thuộc React.' },
            { name: 'antd', message: 'domain không được phụ thuộc Ant Design.' },
            { name: 'axios', message: 'domain không được phụ thuộc Axios.' },
            { name: 'zustand', message: 'domain không được phụ thuộc Zustand.' },
          ],
          patterns: [
            {
              group: ['@tanstack/*'],
              message: 'domain không được phụ thuộc TanStack.',
            },
          ],
        },
      ],
    },
  },
  {
    // docs/skills/architecture.md: shared là utility thuần, không import React component.
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react', message: 'shared không import React component.' },
          ],
        },
      ],
    },
  },
  {
    // docs/skills/api.md, architecture.md: không gọi axios/HttpClient trực tiếp trong
    // component/container/page/hook. Phải đi qua repository (DI) như base hiện tại.
    files: ['src/presentation/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'axios',
              message:
                'Không gọi axios trực tiếp trong presentation. Dùng repository qua useRepository() (xem docs/skills/api.md).',
            },
          ],
          patterns: [
            {
              group: ['**/infrastructure/http/HttpClient'],
              message:
                'Không import HttpClient trực tiếp trong presentation. Dùng repository qua useRepository() (xem docs/skills/api.md).',
            },
          ],
        },
      ],
    },
  },
);
