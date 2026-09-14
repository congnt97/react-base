import tokens from '@/app/design-tokens.json';

/**
 * Nguồn duy nhất của design token là `app/design-tokens.json`. File này đọc ra và
 * đặt tên cho từng nhóm để code dùng.
 *
 * Token để ở JSON để chỉ có một nơi phải sửa: `theme.ts` map sang AntD, còn
 * `styles/tokens.generated.css` sinh từ chính file đó qua
 * `scripts/generate-token-css.mjs` cho Tailwind và CSS thường. `pnpm dev` tự sinh
 * lại; sửa JSON rồi quên chạy `pnpm tokens:css` thì `tokens.test.ts` fail.
 *
 * Màu chữ và nền chọn để đạt WCAG AA; đổi thì chạy `pnpm test:e2e`.
 */
export const designTokens = tokens;

export type DesignTokens = typeof tokens;

/** `appBg` -> `--app-bg`. Dùng chung giữa app và script sinh CSS. */
export const cssVariableName = (token: string) =>
  `--${token.replace(/[A-Z]/g, (chunk) => `-${chunk.toLowerCase()}`)}`;
