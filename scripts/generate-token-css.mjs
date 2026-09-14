// Sinh src/styles/tokens.generated.css từ src/app/design-tokens.json.
// Chạy tay: pnpm tokens:css. Tự chạy khi `pnpm dev`.
// `--stdout` in ra thay vì ghi file, để tokens.test.ts đối chiếu file có bị lệch không.
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SOURCE = path.join(ROOT, 'src/app/design-tokens.json');
const TARGET = path.join(ROOT, 'src/styles/tokens.generated.css');

const cssVariableName = (token) =>
  `--${token.replace(/[A-Z]/g, (chunk) => `-${chunk.toLowerCase()}`)}`;

export const tokenCss = (tokens) => {
  const lines = Object.entries(tokens.colors).map(
    ([token, value]) => `  ${cssVariableName(token)}: ${value};`,
  );

  return `/* File sinh tự động từ src/app/design-tokens.json. Không sửa tay:
   sửa token trong JSON rồi chạy \`pnpm tokens:css\`. */
:root {
${lines.join('\n')}
}
`;
};

export const readTokens = () => JSON.parse(readFileSync(SOURCE, 'utf8'));

export const writeTokenCss = () => {
  const css = tokenCss(readTokens());
  writeFileSync(TARGET, css);
  return css;
};

if (process.argv[1] === import.meta.filename) {
  const css = tokenCss(readTokens());
  if (process.argv.includes('--stdout')) {
    process.stdout.write(css);
  } else {
    writeFileSync(TARGET, css);
    console.log(`Đã sinh ${path.relative(ROOT, TARGET)}`);
  }
}
