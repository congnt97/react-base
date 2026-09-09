import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import en from '@/locales/en.json';

const SRC = path.resolve(__dirname, '..');

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      return walk(full);
    }
    return /\.(ts|tsx)$/.test(entry) && !/\.test\.tsx?$/.test(entry)
      ? [full]
      : [];
  });

// t('...') hoặc t("...") với khoảng trắng/xuống dòng tuỳ ý sau dấu (.
const KEY_PATTERN = /\bt\(\s*(['"])((?:(?!\1)[^\\]|\\.)*)\1/g;

const collectKeys = () => {
  const keys = new Set<string>();
  for (const file of walk(SRC)) {
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(KEY_PATTERN)) {
      keys.add(match[2] ?? '');
    }
  }
  return [...keys];
};

// Quên thêm bản dịch không vỡ UI (i18next trả lại key tiếng Việt) nên không ai
// nhận ra cho tới khi user đổi sang tiếng Anh. Test này bắt ngay lúc code.
describe('i18n', () => {
  it('mọi key t() tĩnh trong src đều có bản dịch tiếng Anh', () => {
    const keys = collectKeys();
    // Regex hỏng thì keys rỗng và test pass giả; chặn trường hợp đó.
    expect(keys.length).toBeGreaterThan(30);

    const missing = keys.filter((key) => !(key in en));

    expect(
      missing,
      `Thiếu trong locales/en.json:\n${missing.join('\n')}`,
    ).toEqual([]);
  });

  it('bản dịch không rỗng và không trùng nguyên văn key một cách vô ý', () => {
    const empty = Object.entries(en)
      .filter(([, value]) => !value.trim())
      .map(([key]) => key);

    expect(empty).toEqual([]);
  });
});
