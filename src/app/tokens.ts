/**
 * Nguồn duy nhất của design token.
 *
 * AntD scope CSS variable của nó vào class hash (`.css-var-xxx`) nên Tailwind và
 * CSS thường không dùng được; vì vậy `styles.css` phải khai báo lại cùng giá trị ở
 * `:root` (cần lúc parse CSS, tránh nháy màu). `tokens.test.ts` đối chiếu hai nơi
 * và fail nếu lệch, nên vẫn chỉ có một nguồn để sửa: file này.
 *
 * Màu chữ/nền chọn để đạt WCAG AA; đổi thì chạy `pnpm test:e2e` (e2e/a11y.spec.ts).
 */
export const colors = {
  appBg: '#f8fafc',
  contentBg: '#ffffff',
  sidebarBg: '#0f172a',
  borderSubtle: '#e2e8f0',
  borderStrong: '#cbd5e1',
  textMain: '#0f172a',
  textMuted: '#64748b',
  primary: '#2563eb',
  link: '#1d4ed8',
  success: '#166534',
  successBg: '#dcfce7',
  warning: '#92400e',
  warningBg: '#fef3c7',
  danger: '#dc2626',
  dangerBg: '#fee2e2',
} as const;

export const layout = {
  borderRadius: 8,
  headerHeight: 64,
  sidebarWidth: 260,
  contentMaxWidth: 1440,
} as const;

export const typography = {
  fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
} as const;

/** Tên biến CSS tương ứng trong styles.css, dùng cho test đối chiếu. */
export const CSS_VARIABLE_BY_TOKEN: Record<keyof typeof colors, string> = {
  appBg: '--app-bg',
  contentBg: '--content-bg',
  sidebarBg: '--sidebar-bg',
  borderSubtle: '--border-subtle',
  borderStrong: '--border-strong',
  textMain: '--text-main',
  textMuted: '--text-muted',
  primary: '--primary',
  link: '--link',
  success: '--success',
  successBg: '--success-bg',
  warning: '--warning',
  warningBg: '--warning-bg',
  danger: '--danger',
  dangerBg: '--danger-bg',
};
