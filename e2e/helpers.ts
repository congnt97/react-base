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
