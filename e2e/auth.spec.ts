import { expect, test } from '@playwright/test';

import { ACCOUNTS, login } from './helpers';

test.describe('Auth', () => {
  test('chưa đăng nhập thì về login kèm redirectTo', async ({ page }) => {
    await page.goto('/projects');

    await expect(page).toHaveURL(/\/auth\/login\?redirectTo=%2Fprojects/);
    await expect(page.getByRole('button', { name: 'Đăng nhập' })).toBeVisible();
  });

  test('sai mật khẩu thì hiện lỗi từ server', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByLabel('Email').fill(ACCOUNTS.admin.email);
    await page.getByLabel('Mật khẩu').fill('sai');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    await expect(
      page.getByText('Email hoặc mật khẩu không đúng'),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('đăng nhập xong quay lại đúng redirectTo, đăng xuất có confirm', async ({
    page,
  }) => {
    await page.goto('/projects');
    await page.getByLabel('Email').fill(ACCOUNTS.admin.email);
    await page.getByLabel('Mật khẩu').fill(ACCOUNTS.admin.password);
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    await expect(page).toHaveURL(/\/projects/);
    await expect(page.getByRole('heading', { name: 'Dự án' })).toBeVisible();

    await page.getByRole('button', { name: 'Tài khoản' }).click();
    await page.getByRole('menuitem', { name: 'Đăng xuất' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toContainText('Đăng xuất khỏi hệ thống?');
    await dialog.getByRole('button', { name: 'Đăng xuất' }).click();

    await expect(page).toHaveURL(/\/auth\/login$/);
    // Đã logout thì vào lại trang protected phải bị đẩy về login.
    await page.goto('/');
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('đã đăng nhập thì không vào được trang login', async ({ page }) => {
    await login(page, 'admin');

    await page.goto('/auth/login');
    await expect(page).toHaveURL(/\/$/);
  });
});
