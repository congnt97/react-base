import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC = path.resolve(__dirname, '..');
const LOCALES_DIR = path.join(SRC, 'locales');

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

const readLocale = (file: string) =>
  JSON.parse(readFileSync(path.join(LOCALES_DIR, file), 'utf8')) as Record<
    string,
    string
  >;

// Every file here is checked automatically, so dropping in a new locale (e.g.
// `ja.json`) gets the same missing-key and empty-value guard with no test to edit.
const localeFiles = readdirSync(LOCALES_DIR).filter((file) =>
  file.endsWith('.json'),
);

// A missing translation doesn't break the UI (i18next falls back to the Vietnamese
// key) so no one notices until a user switches language. This test catches it at code time.
describe('i18n', () => {
  const keys = collectKeys();

  it('quét được key t() tĩnh trong src', () => {
    // A broken regex leaves keys empty and the test passes falsely; guard against that.
    expect(keys.length).toBeGreaterThan(30);
  });

  it.each(localeFiles)(
    'mọi key t() tĩnh trong src đều có bản dịch trong locales/%s',
    (file) => {
      const translations = readLocale(file);
      const missing = keys.filter((key) => !(key in translations));

      expect(
        missing,
        `Thiếu trong locales/${file}:\n${missing.join('\n')}`,
      ).toEqual([]);
    },
  );

  it.each(localeFiles)('bản dịch trong locales/%s không rỗng', (file) => {
    const translations = readLocale(file);
    const empty = Object.entries(translations)
      .filter(([, value]) => !value.trim())
      .map(([key]) => key);

    expect(empty).toEqual([]);
  });
});
