import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { cssVariableName, designTokens } from '@/app/tokens';

const ROOT = path.resolve(import.meta.dirname, '../..');
const generatedPath = path.join(ROOT, 'src/styles/tokens.generated.css');

// Editing design-tokens.json and forgetting to regenerate the CSS is a silent bug:
// AntD components pick up the new color but Tailwind classes don't. This test reruns
// the script and diffs it against the committed file.
describe('design tokens', () => {
  it('tokens.generated.css khớp design-tokens.json', () => {
    const expected = execFileSync(
      'node',
      ['scripts/generate-token-css.mjs', '--stdout'],
      { cwd: ROOT, encoding: 'utf8' },
    );

    expect(
      readFileSync(generatedPath, 'utf8'),
      'Chạy `pnpm tokens:css` rồi commit lại src/styles/tokens.generated.css',
    ).toBe(expected);
  });

  it('mọi màu trong token đều thành một biến CSS', () => {
    const css = readFileSync(generatedPath, 'utf8');
    const missing = Object.keys(designTokens.colors).filter(
      (token) => !css.includes(`${cssVariableName(token)}:`),
    );

    expect(missing).toEqual([]);
  });

  it('kích thước và bo góc là số dương', () => {
    const numbers = [
      ...Object.values(designTokens.layout),
      ...Object.values(designTokens.components).flatMap((group) =>
        Object.values(group).filter((value) => typeof value === 'number'),
      ),
    ];

    expect(numbers.every((value) => value > 0)).toBe(true);
  });
});
