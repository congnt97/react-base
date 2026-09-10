import { expect, test } from '@playwright/test';

import { login } from './helpers';

test.describe('Mẫu nâng cao: infinite list, optimistic update', () => {
  test('dashboard tải thêm hoạt động theo cursor', async ({ page }) => {
    await login(page, 'admin');

    const feed = page.getByRole('list', { name: 'Hoạt động gần đây' });
    await expect(feed.locator('li')).toHaveCount(10);

    await page.getByRole('button', { name: 'Tải thêm' }).click();
    await expect(feed.locator('li')).toHaveCount(20);
  });

  test('đổi trạng thái ngay trên bảng (optimistic)', async ({ page }) => {
    await login(page, 'admin');
    await page.goto('/projects');
    await expect(page.getByText('23 dự án')).toBeVisible();

    const firstRow = page.getByRole('table').getByRole('row').nth(1);
    await expect(firstRow).toContainText('Tạm dừng');

    await firstRow.getByRole('button', { name: 'Đổi trạng thái' }).click();
    await page.getByRole('menuitem', { name: 'Lưu trữ' }).click();

    await expect(firstRow).toContainText('Lưu trữ');
    await expect(page.getByText('Đã cập nhật trạng thái')).toBeVisible();
  });
});
