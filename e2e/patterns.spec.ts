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

    // Tự tạo dự án riêng cho test này thay vì dựa vào dòng đầu bảng hay tổng số:
    // file này chạy song song với projects.spec.ts trên cùng mock server, một
    // test khác tạo/sửa dự án đúng lúc này sẽ đẩy thứ tự bảng và tổng số lệch đi.
    await page.getByRole('button', { name: 'Tạo dự án' }).click();
    const dialog = page.getByRole('dialog');
    const name = `Optimistic ${Date.now()}`;
    await dialog.getByLabel('Tên dự án').fill(name);
    await dialog.getByLabel('Người phụ trách').fill('Playwright');
    await dialog.getByRole('button', { name: 'Tạo dự án' }).click();
    await expect(page.getByText('Đã tạo dự án')).toBeVisible();

    const row = page.getByRole('row', { name: new RegExp(name) });
    await expect(row).toContainText('Đang chạy'); // trạng thái mặc định lúc tạo

    await row.getByRole('button', { name: 'Đổi trạng thái' }).click();
    await page.getByRole('menuitem', { name: 'Lưu trữ' }).click();

    await expect(row).toContainText('Lưu trữ');
    await expect(page.getByText('Đã cập nhật trạng thái')).toBeVisible();

    // Dọn lại dự án vừa tạo: để lại vĩnh viễn sẽ làm lệch tổng số "23 dự án" mà
    // projects.spec.ts đang giả định, đổi một lỗi chập chờn thành một lỗi khác.
    await row.getByRole('button', { name: `Xoá ${name}` }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Xoá' }).click();
    await expect(page.getByText('Đã xoá dự án')).toBeVisible();
  });
});
