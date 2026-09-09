import { expect, test } from '@playwright/test';

import { login } from './helpers';

test.describe('Dự án (CRUD, filter, permission)', () => {
  test('admin: list, filter qua URL, tạo, sửa, xoá', async ({ page }) => {
    await login(page, 'admin');
    await page.goto('/projects');

    const table = page.getByRole('table');
    await expect(page.getByText('23 dự án')).toBeVisible();
    await expect(table.getByRole('row')).toHaveCount(11); // header + 10

    // Filter trạng thái -> URL đổi, bảng chỉ còn "Tạm dừng".
    await page.getByRole('combobox', { name: 'Trạng thái' }).click();
    // Option của AntD Select render trong portal với attribute title.
    await page.getByTitle('Tạm dừng').click();
    await expect(page).toHaveURL(/status=paused/);
    await expect(page.getByText('8 dự án')).toBeVisible();

    // Tìm theo tên -> reset page về 1.
    await page.getByLabel('Tìm theo tên dự án').fill('án 2');
    await page.getByLabel('Tìm theo tên dự án').press('Enter');
    await expect(page).toHaveURL(/keyword=%C3%A1n\+2|keyword=%C3%A1n%202/);
    await expect(page).toHaveURL(/page=1/);

    // Tạo.
    await page.goto('/projects');
    await page.getByRole('button', { name: 'Tạo dự án' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByLabel('Tên dự án').fill('Dự án E2E');
    await dialog.getByLabel('Người phụ trách').fill('Playwright');
    await dialog.getByRole('button', { name: 'Tạo dự án' }).click();
    await expect(page.getByText('Đã tạo dự án')).toBeVisible();
    await expect(page.getByText('24 dự án')).toBeVisible();
    await expect(table.getByRole('row').nth(1)).toContainText('Dự án E2E');

    // Sửa.
    await page.getByRole('button', { name: 'Sửa Dự án E2E' }).click();
    await dialog.getByLabel('Tên dự án').fill('Dự án E2E đã sửa');
    await dialog.getByRole('button', { name: 'Lưu' }).click();
    await expect(page.getByText('Đã cập nhật dự án')).toBeVisible();
    await expect(table.getByRole('row').nth(1)).toContainText(
      'Dự án E2E đã sửa',
    );

    // Xoá có confirm.
    await page.getByRole('button', { name: 'Xoá Dự án E2E đã sửa' }).click();
    await expect(page.getByRole('dialog')).toContainText('không thể hoàn tác');
    await page.getByRole('dialog').getByRole('button', { name: 'Xoá' }).click();
    await expect(page.getByText('Đã xoá dự án')).toBeVisible();
    await expect(page.getByText('23 dự án')).toBeVisible();
  });

  test('user: không có nút xoá, không có menu Cài đặt, /settings ra 403', async ({
    page,
  }) => {
    await login(page, 'user');

    await expect(page.getByRole('menuitem', { name: 'Cài đặt' })).toHaveCount(
      0,
    );

    await page.goto('/projects');
    await expect(page.getByText('23 dự án')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Tạo dự án' })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Sửa / })).toHaveCount(10);
    await expect(page.getByRole('button', { name: /^Xoá / })).toHaveCount(0);

    await page.goto('/settings');
    await expect(
      page.getByText('Không có quyền truy cập', { exact: true }),
    ).toBeVisible();
  });
});
