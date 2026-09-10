// Gate bundle sau `pnpm build`: (1) mỗi route phải có chunk riêng, (2) không vượt
// ngân sách gzip. Đổi ngân sách ở đây khi có lý do (thêm lib lớn có chủ đích), kèm
// ghi chú trong PR.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = path.resolve('dist/assets');
const MANIFEST = path.resolve('dist/.vite/manifest.json');
const ROUTES = path.resolve('src/routes');

// Route nào cũng phải được tách chunk (autoCodeSplitting của TanStack Router):
// import page thẳng vào chunk đầu làm mọi màn hình tải cả app. __root là entry nên bỏ qua.
const walk = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

const routeFiles = walk(ROUTES)
  .filter((file) => file.endsWith('.tsx') && !file.endsWith('__root.tsx'))
  .map((file) => path.relative(process.cwd(), file));

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const notSplit = routeFiles.filter(
  (file) => !manifest[`${file}?tsr-split=component`]?.isDynamicEntry,
);

if (notSplit.length > 0) {
  console.error(
    `Route chưa được tách chunk riêng:\n${notSplit.map((f) => `  ${f}`).join('\n')}\n` +
      'Giữ autoCodeSplitting: true trong vite.config.ts và không import page ở ngoài route.',
  );
  process.exit(1);
}
console.log(`ok   routes     ${routeFiles.length} route, mỗi route một chunk`);

const BUDGETS_KB = {
  framework: 180, // react, tanstack, zustand, axios, i18next, zod, dayjs
  entry: 40, // index-*.js: bootstrap + layout, không chứa page hay bản dịch
  anyChunk: 250, // chunk lẻ lớn nhất (antd theo route)
  css: 30,
  totalJs: 750,
};

const gzipKb = (file) =>
  gzipSync(readFileSync(path.join(DIST, file))).length / 1024;

const files = readdirSync(DIST).filter(
  (file) => file.endsWith('.js') || file.endsWith('.css'),
);
const sizes = files.map((file) => ({ file, kb: gzipKb(file) }));
const js = sizes.filter(({ file }) => file.endsWith('.js'));

const maxBy = (items, predicate) =>
  items
    .filter(({ file }) => predicate(file))
    .reduce((max, item) => (item.kb > max.kb ? item : max), {
      file: '-',
      kb: 0,
    });

const checks = [
  {
    name: 'framework',
    ...maxBy(js, (f) => f.startsWith('framework-')),
    budget: BUDGETS_KB.framework,
  },
  {
    name: 'entry',
    ...maxBy(js, (f) => f.startsWith('index-')),
    budget: BUDGETS_KB.entry,
  },
  { name: 'anyChunk', ...maxBy(js, () => true), budget: BUDGETS_KB.anyChunk },
  {
    name: 'css',
    ...maxBy(sizes, (f) => f.endsWith('.css')),
    budget: BUDGETS_KB.css,
  },
  {
    name: 'totalJs',
    file: `${js.length} file`,
    kb: js.reduce((sum, { kb }) => sum + kb, 0),
    budget: BUDGETS_KB.totalJs,
  },
];

let failed = false;
for (const { name, file, kb, budget } of checks) {
  const status = kb > budget ? 'FAIL' : 'ok';
  failed ||= kb > budget;
  console.log(
    `${status.padEnd(4)} ${name.padEnd(10)} ${kb.toFixed(1).padStart(7)} KB gzip / ${String(budget).padStart(4)} KB  (${file})`,
  );
}

if (failed) {
  console.error(
    '\nBundle vượt ngân sách. Xem scripts/check-bundle-size.mjs, chạy `pnpm build:analyze` để soi dist/stats.html.',
  );
  process.exit(1);
}
