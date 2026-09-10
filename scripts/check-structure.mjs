// Kiểm tra cấu trúc src/ theo docs/skills/architecture.md. Chạy trong `pnpm validate`.
// Mục đích: chặn folder lạ (utils/, services/, helpers/) và file đặt sai chỗ trong feature,
// lỗi AI/dev mới hay mắc mà ESLint không nhìn thấy.
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const SRC = path.resolve('src');

const ALLOWED_TOP_LEVEL = new Set([
  'app',
  'components',
  'core',
  'features',
  'lib',
  'locales',
  'mocks',
  'routes',
  'styles',
  'test',
  'main.tsx',
  'routeTree.gen.ts',
  'vite-env.d.ts',
]);

const ALLOWED_FEATURE_FILES = new Set([
  'types.ts',
  'api.ts',
  'search.ts',
  'store.ts',
  'guards.ts',
  'permissions.ts',
]);
const ALLOWED_FEATURE_DIRS = new Set(['hooks', 'components', 'pages']);

const isTest = (name) => /\.test\.tsx?$/.test(name);
const stripTest = (name) => name.replace(/\.test\.(tsx?)$/, '.$1');

const errors = [];
const list = (dir) => readdirSync(dir).filter((name) => !name.startsWith('.'));

for (const entry of list(SRC)) {
  if (!ALLOWED_TOP_LEVEL.has(entry)) {
    errors.push(
      `src/${entry}: không thuộc cấu trúc. Code chung đặt trong lib/ hoặc components/, code feature đặt trong features/<x>/.`,
    );
  }
}

const featuresDir = path.join(SRC, 'features');
for (const feature of list(featuresDir)) {
  const featurePath = path.join(featuresDir, feature);
  if (!statSync(featurePath).isDirectory()) {
    errors.push(`src/features/${feature}: features/ chỉ chứa folder feature.`);
    continue;
  }

  for (const entry of list(featurePath)) {
    const full = path.join(featurePath, entry);
    const isDir = statSync(full).isDirectory();
    const ok = isDir
      ? ALLOWED_FEATURE_DIRS.has(entry)
      : ALLOWED_FEATURE_FILES.has(isTest(entry) ? stripTest(entry) : entry);

    if (!ok) {
      errors.push(
        `src/features/${feature}/${entry}: chỉ được ${[...ALLOWED_FEATURE_FILES].join(', ')} và folder ${[...ALLOWED_FEATURE_DIRS].join('/')}.`,
      );
    }
  }
}

const libDir = path.join(SRC, 'lib');
for (const entry of list(libDir)) {
  if (statSync(path.join(libDir, entry)).isDirectory()) {
    errors.push(`src/lib/${entry}: lib/ là file phẳng, không tạo folder con.`);
  }
}

if (errors.length > 0) {
  console.error('Cấu trúc src/ sai (xem docs/skills/architecture.md):\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Cấu trúc src/ hợp lệ.');
