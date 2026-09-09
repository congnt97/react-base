import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

export const ACCOUNTS = {
  admin: { email: 'admin@example.com', password: '123456' },
  user: { email: 'user@example.com', password: '123456' },
} as const;

export async function login(page: Page, account: keyof typeof ACCOUNTS) {
  await page.goto('/auth/login');
  await page.getByLabel('Email').fill(ACCOUNTS[account].email);
  await page.getByLabel('Mật khẩu').fill(ACCOUNTS[account].password);
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
}

/**
 * Quét axe theo WCAG 2.1 A/AA. Bỏ qua devtools của TanStack (không phải UI app).
 * Thêm rule vào `disableRules` chỉ khi có lý do ghi rõ trong test.
 */
export async function expectNoA11yViolations(
  page: Page,
  disableRules: string[] = [],
) {
  // Chờ animation (modal/dropdown của AntD) xong; quét giữa chừng cho kết quả ngẫu nhiên.
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .every((animation) => animation.playState === 'finished'),
  );

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .exclude('.TanStackRouterDevtools')
    .exclude('.tsqd-parent-container')
    .disableRules(disableRules)
    .analyze();

  const summary = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    help: violation.help,
    nodes: violation.nodes.map((node) => node.target.join(' ')).slice(0, 3),
  }));

  expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
}
