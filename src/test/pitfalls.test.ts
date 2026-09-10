import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

/**
 * docs/skills/pitfalls.md chỉ đường tới hook/adapter/test cụ thể. Đổi tên file mà
 * không sửa doc thì AI đọc doc sẽ đi tìm thứ không còn; test này làm doc đỏ ngay.
 */
const ROOT = path.resolve(import.meta.dirname, '../..');
const doc = readFileSync(path.join(ROOT, 'docs/skills/pitfalls.md'), 'utf8');

// Đường dẫn trong backtick: bắt đầu bằng một folder đã biết, có phần mở rộng.
const PATH_PATTERN =
  /`((?:src|docs|e2e|scripts|core|components|features|lib|app|\.claude)\/[\w./-]+\.[a-z]+)`/g;
const REPO_ROOTS = ['src/', 'docs/', 'e2e/', 'scripts/', '.claude/'];

const candidatesFor = (ref: string) =>
  REPO_ROOTS.some((root) => ref.startsWith(root)) ? [ref] : [`src/${ref}`];

const refs = [
  ...new Set(
    [...doc.matchAll(PATH_PATTERN)].flatMap((match) =>
      match[1] === undefined ? [] : [match[1]],
    ),
  ),
];

describe('pitfalls.md', () => {
  it('có đường dẫn để kiểm tra', () => {
    expect(refs.length).toBeGreaterThan(20);
  });

  it.each(refs)('%s tồn tại', (ref) => {
    const found = candidatesFor(ref).some((candidate) =>
      existsSync(path.join(ROOT, candidate)),
    );
    expect(found, `${ref} không tồn tại; sửa docs/skills/pitfalls.md`).toBe(
      true,
    );
  });
});
