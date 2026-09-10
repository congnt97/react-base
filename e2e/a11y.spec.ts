import { expect, test } from '@playwright/test';

import { expectNoA11yViolations, login } from './helpers';

test.describe('Accessibility (axe, WCAG 2.1 AA)', () => {
  test('trang login', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.getByRole('button', { name: 'Đăng nhập' })).toBeVisible();
    await expectNoA11yViolations(page);
  });

  test('dashboard', async ({ page }) => {
    await login(page, 'admin');
    await expect(
      page.getByRole('list', { name: 'Hoạt động gần đây' }),
    ).toBeVisible();
    await expectNoA11yViolations(page);
  });

  test('danh sách dự án và modal tạo', async ({ page }) => {
    await login(page, 'admin');
    await page.goto('/projects');
    await expect(page.getByText('23 dự án')).toBeVisible();
    await expectNoA11yViolations(page);

    await page.getByRole('button', { name: 'Tạo dự án' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expectNoA11yViolations(page);
  });

  test('danh sách thành viên và drawer thêm', async ({ page }) => {
    await login(page, 'admin');
    await page.goto('/members');
    await expect(page.getByText('37 thành viên')).toBeVisible();
    await expectNoA11yViolations(page);

    await page.getByRole('button', { name: 'Thêm thành viên' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expectNoA11yViolations(page);
  });

  test('chi tiết dự án', async ({ page }) => {
    await login(page, 'admin');
    await page.goto('/projects/p1');
    await expect(page.getByRole('heading', { name: 'Dự án 1' })).toBeVisible();
    await expectNoA11yViolations(page);
  });

  test('cài đặt', async ({ page }) => {
    await login(page, 'admin');
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: 'Cài đặt' })).toBeVisible();
    await expectNoA11yViolations(page);
  });
});
