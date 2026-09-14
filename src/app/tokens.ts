import tokens from '@/app/design-tokens.json';

/**
 * Nguồn duy nhất của design token là `app/design-tokens.json`. File này đọc ra và
 * đặt tên cho từng nhóm để code dùng.
 *
 * Để ở dạng JSON vì Design Lab (`design-lab.html`, chỉ chạy ở dev) ghi thẳng vào đó
 * khi bấm Lưu; dữ liệu do máy ghi thì nên nằm ở file dữ liệu, không nằm trong code.
 * `styles/tokens.generated.css` sinh từ chính file đó qua
 * `scripts/generate-token-css.mjs`, nên Tailwind và CSS thường luôn cùng giá trị với
 * AntD; `tokens.test.ts` fail nếu lệch.
 *
 * Màu chữ và nền chọn để đạt WCAG AA; đổi thì chạy `pnpm test:e2e`.
 */
export const designTokens = tokens;

export type DesignTokens = typeof tokens;

/** `appBg` -> `--app-bg`. Dùng chung giữa app, script sinh CSS và Design Lab. */
export const cssVariableName = (token: string) =>
  `--${token.replace(/[A-Z]/g, (chunk) => `-${chunk.toLowerCase()}`)}`;
