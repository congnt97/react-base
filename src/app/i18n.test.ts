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

// t('...') or t("...") with arbitrary whitespace/newlines after the ( character.
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

// A missing translation doesn't break the UI (i18next falls back to the Vietnamese
// key) so no one notices until a user switches to English. This test catches it at code time.
describe('i18n', () => {
  it('mọi key t() tĩnh trong src đều có bản dịch tiếng Anh', () => {
    const keys = collectKeys();
    // A broken regex leaves keys empty and the test passes falsely; guard against that.
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
