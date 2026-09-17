import tokens from '@/app/design-tokens.json';

/**
 * The single source of design tokens is `app/design-tokens.json`. This file just reads
 * it and names each group for code to use.
 *
 * Tokens live in JSON so there's only one place to edit: `theme.ts` maps them to AntD,
 * and `styles/tokens.generated.css` is generated from the same file via
 * `scripts/generate-token-css.mjs` for Tailwind and plain CSS. `pnpm dev` regenerates it
 * automatically; editing the JSON and forgetting to run `pnpm tokens:css` fails `tokens.test.ts`.
 *
 * Text and background colors are chosen to meet WCAG AA; changing them means running `pnpm test:e2e`.
 */
export const designTokens = tokens;

export type DesignTokens = typeof tokens;

/** `appBg` -> `--app-bg`. Shared between the app and the CSS-generation script. */
export const cssVariableName = (token: string) =>
  `--${token.replace(/[A-Z]/g, (chunk) => `-${chunk.toLowerCase()}`)}`;
