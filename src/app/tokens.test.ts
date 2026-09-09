import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { CSS_VARIABLE_BY_TOKEN, colors } from '@/app/tokens';

const css = readFileSync(
  path.resolve(__dirname, '../styles/styles.css'),
  'utf8',
);

const rootBlock = /:root\s*\{([^}]*)\}/.exec(css)?.[1] ?? '';

const declaredVariables = new Map(
  [...rootBlock.matchAll(/(--[a-z-]+)\s*:\s*([^;]+);/g)].map((match) => [
    match[1] ?? '',
    (match[2] ?? '').trim(),
  ]),
);

// styles.css phải khớp app/tokens.ts: sửa token một chỗ rồi quên chỗ kia là lỗi
// im lặng (UI lệch màu giữa component AntD và class Tailwind).
describe('design tokens', () => {
  it('mọi màu trong tokens.ts đều có biến CSS cùng giá trị', () => {
    const mismatched = Object.entries(colors)
      .map(([token, value]) => {
        const variable = CSS_VARIABLE_BY_TOKEN[token as keyof typeof colors];
        const declared = declaredVariables.get(variable);
        return declared === value
          ? null
          : `${variable}: styles.css có "${declared ?? 'thiếu'}", tokens.ts có "${value}"`;
      })
      .filter((message) => message !== null);

    expect(mismatched, mismatched.join('\n')).toEqual([]);
  });

  it('styles.css không khai báo màu ngoài danh sách token', () => {
    const known = new Set(Object.values(CSS_VARIABLE_BY_TOKEN));
    const extra = [...declaredVariables.keys()].filter(
      (variable) => !known.has(variable),
    );

    expect(extra, `Thêm vào tokens.ts: ${extra.join(', ')}`).toEqual([]);
  });
});
