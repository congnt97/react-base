// Hook PostToolUse của Claude Code: lint + format ngay file vừa sửa, để AI thấy lỗi
// guard tại chỗ thay vì đợi tới lúc chạy validate. Nhận JSON của hook qua stdin.
// Chỉ chạy với file .ts/.tsx trong src/; file khác bỏ qua. Không chặn ghi file.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const input = await new Promise((resolve) => {
  let data = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => (data += chunk));
  process.stdin.on('end', () => resolve(data));
  process.stdin.on('error', () => resolve(''));
});

let filePath = '';
try {
  filePath = JSON.parse(input)?.tool_input?.file_path ?? '';
} catch {
  process.exit(0);
}

const relative = path.relative(process.cwd(), filePath);
const isSource =
  relative.startsWith('src/') &&
  /\.(ts|tsx)$/.test(relative) &&
  existsSync(relative);
if (!isSource) {
  process.exit(0);
}

const eslint = spawnSync(
  'pnpm',
  ['exec', 'eslint', '--fix', '--max-warnings', '0', relative],
  { encoding: 'utf8' },
);
spawnSync('pnpm', ['exec', 'prettier', '--write', relative], {
  encoding: 'utf8',
});

if (eslint.status !== 0) {
  // stderr với exit 2: Claude Code đưa nội dung này lại cho model để sửa ngay.
  process.stderr.write(
    `ESLint báo lỗi ở ${relative}. Sửa nguyên nhân, không disable rule (xem AGENTS.md "Khi guard báo lỗi").\n${eslint.stdout}${eslint.stderr}`,
  );
  process.exit(2);
}
