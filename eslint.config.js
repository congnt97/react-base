import { readdirSync } from 'node:fs';

import js from '@eslint/js';
import pluginQuery from '@tanstack/eslint-plugin-query';
import checkFile from 'eslint-plugin-check-file';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

// Feature được phép import từ mọi nơi (store/guards/types là app-level).
const SHARED_FEATURES = ['auth'];

const featureDirs = readdirSync('src/features', { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

// Mỗi feature chỉ được import chính nó và SHARED_FEATURES.
const crossFeatureRules = featureDirs.map((feature) => ({
  files: [`src/features/${feature}/**/*.{ts,tsx}`],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              '@/features/*',
              ...new Set(
                [feature, ...SHARED_FEATURES].map(
                  (name) => `!@/features/${name}`,
                ),
              ),
            ],
            message:
              'Feature không import feature khác. Đưa code chung xuống components/ hoặc lib/ (xem docs/skills/architecture.md).',
          },
        ],
      },
    ],
  },
}));

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'public', 'src/routeTree.gen.ts'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginQuery.configs['flat/recommended'],
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'check-file': checkFile,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // docs/skills/typescript.md
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',

      // docs/skills/hooks.md
      'react-hooks/exhaustive-deps': 'error',

      // docs/skills/quality.md, security.md
      'no-console': ['warn', { allow: ['warn', 'error'] }],
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
    // docs/skills/architecture.md: file và folder kebab-case.
    // routes/ theo convention TanStack (_app, __root, $id) nên bỏ qua.
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/routes/**'],
    rules: {
      'check-file/filename-naming-convention': [
        'error',
        { 'src/**/*.{ts,tsx}': 'KEBAB_CASE' },
        { ignoreMiddleExtensions: true },
      ],
      'check-file/folder-naming-convention': [
        'error',
        { 'src/**/': 'KEBAB_CASE' },
      ],
    },
  },
  {
    // docs/skills/architecture.md: axios chỉ được dùng trong lib/http.ts.
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/lib/http.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'axios',
              message:
                'Gọi API qua http trong lib/http.ts và features/<x>/api.ts.',
            },
          ],
        },
      ],
    },
  },
  {
    // lib là tầng thấp nhất: không biết gì về React, UI hay feature.
    files: ['src/lib/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react', message: 'lib không phụ thuộc React.' },
            { name: 'antd', message: 'lib không phụ thuộc Ant Design.' },
          ],
          patterns: [
            {
              group: [
                '@/features/*',
                '@/app/*',
                '@/components/*',
                '@/routes/*',
              ],
              message: 'lib không được import tầng trên.',
            },
          ],
        },
      ],
    },
  },
  {
    // components là UI dùng chung: không phụ thuộc feature cụ thể.
    files: ['src/components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*', '@/app/*', '@/routes/*'],
              message:
                'components dùng chung không import feature/app. Nếu cần logic feature, đặt component trong features/<x>/components.',
            },
          ],
        },
      ],
    },
  },
  ...crossFeatureRules,
);
