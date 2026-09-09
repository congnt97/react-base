import { expect, test } from '@playwright/test';

import { login } from './helpers';

test.describe('Mẫu nâng cao: infinite list, optimistic update, upload', () => {
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

  test('upload tài liệu trong form: chặn file sai định dạng, nhận file hợp lệ', async ({
    page,
  }) => {
    await login(page, 'admin');
    await page.goto('/projects');
    await page.getByRole('button', { name: 'Tạo dự án' }).click();
    const dialog = page.getByRole('dialog');

    const fileInput = dialog.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'script.exe',
      mimeType: 'application/x-msdownload',
      buffer: Buffer.from('x'),
    });
    await expect(
      page.getByText('Định dạng file không được hỗ trợ'),
    ).toBeVisible();

    await fileInput.setInputFiles({
      name: 'tai-lieu.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4'),
    });
    await expect(dialog.getByText('tai-lieu.pdf')).toBeVisible();

    await dialog.getByLabel('Tên dự án').fill('Dự án có tài liệu');
    await dialog.getByLabel('Người phụ trách').fill('Playwright');
    await dialog.getByRole('button', { name: 'Tạo dự án' }).click();
    await expect(page.getByText('Đã tạo dự án')).toBeVisible();

    const firstRow = page.getByRole('table').getByRole('row').nth(1);
    await expect(firstRow.getByLabel('Tài liệu đính kèm')).toBeVisible();
  });
});
