import { readdirSync } from 'node:fs';

import js from '@eslint/js';
import pluginQuery from '@tanstack/eslint-plugin-query';
import checkFile from 'eslint-plugin-check-file';
import i18next from 'eslint-plugin-i18next';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
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
  // Typed lint: bắt quên await, promise rơi vào onClick/JSX, so sánh vô nghĩa.
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  { files: ['**/*.js', '**/*.mjs'], ...tseslint.configs.disableTypeChecked },
  ...pluginQuery.configs['flat/recommended'],
  // docs/skills/ui.md: a11y cơ bản bắt ngay lúc code (alt, label, role, key events).
  { ...jsxA11y.flatConfigs.recommended, files: ['src/**/*.tsx'] },
  {
    // Lỗi JSX cơ bản TypeScript không bắt được.
    files: ['src/**/*.tsx'],
    plugins: { react },
    settings: { react: { version: 'detect' } },
    rules: {
      'react/jsx-key': ['error', { checkFragmentShorthand: true }],
      'react/jsx-no-target-blank': 'error',
      'react/no-array-index-key': 'error',
      'react/self-closing-comp': 'error',
      'react/jsx-no-useless-fragment': 'error',
    },
  },
  {
    // docs/skills/i18n.md: text user thấy phải qua t(). Bắt chuỗi trần trong JSX
    // (text lẫn attribute như placeholder/title/aria-label).
    files: ['src/**/*.tsx'],
    ignores: ['src/**/*.test.tsx'],
    plugins: { i18next },
    rules: {
      'i18next/no-literal-string': [
        'error',
        {
          mode: 'jsx-only',
          'jsx-attributes': {
            include: ['placeholder', 'title', 'aria-label', 'alt', 'label'],
          },
          words: {
            // Tên thương hiệu và mẫu định dạng không dịch.
            exclude: ['React Base', 'you@example.com', 'DD/MM/YYYY HH:mm'],
          },
        },
      ],
    },
  },
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
        // `Route` là export bắt buộc của TanStack Router file route.
        { allowConstantExport: true, allowExportNames: ['Route'] },
      ],

      // docs/skills/typescript.md
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',

      // docs/skills/hooks.md
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/no-deriving-state-in-effects': 'error',
      // TanStack Router dùng throw redirect()/notFound() làm control flow trong beforeLoad/loader.
      '@typescript-eslint/only-throw-error': [
        'error',
        {
          allow: [
            {
              from: 'package',
              package: '@tanstack/router-core',
              name: ['Redirect', 'NotFoundError'],
            },
          ],
        },
      ],
      // Promise không await là lỗi cơ bản hay gặp nhất; muốn bỏ qua có chủ đích thì `void`.
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],

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

      // docs/skills/craft.md: tay nghề lập trình viên, phần máy bắt được.
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      'object-shorthand': 'error',
      'no-nested-ternary': 'error',
      'no-else-return': ['error', { allowElseIf: false }],
      'no-param-reassign': ['error', { props: false }],
      'no-lonely-if': 'error',
      'default-case-last': 'error',
      complexity: ['error', 12],
      'max-depth': ['error', 3],
      'max-params': ['error', 4],
      'max-lines': [
        'error',
        { max: 400, skipBlankLines: true, skipComments: true },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      // `||` với string vẫn hợp lệ khi muốn coi '' là rỗng (tên user, từ khoá tìm).
      '@typescript-eslint/prefer-nullish-coalescing': [
        'error',
        { ignorePrimitives: { string: true } },
      ],
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/array-type': ['error', { default: 'array' }],

      // docs/skills/naming.md
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'typeLike', format: ['PascalCase'] },
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: { regex: '^I[A-Z]', match: false },
        },
        { selector: 'enumMember', format: ['UPPER_CASE'] },
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'parameter',
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
      ],
    },
  },
  {
    // docs/skills/naming.md: named export giữ tên trong stack trace/DevTools.
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportDefaultDeclaration',
          message: 'Dùng named export (xem docs/skills/naming.md).',
        },
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
