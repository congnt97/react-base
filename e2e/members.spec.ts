import { expect, test } from '@playwright/test';

import { login } from './helpers';

// Mock in-memory dùng chung giữa các test chạy song song nên assertion không
// dựa vào tổng số dòng hay thứ tự tuyệt đối, chỉ dựa vào dòng test này tạo ra.
test.describe('Thành viên (chọn nhiều, drawer form, bảng con)', () => {
  test('admin: chọn nhiều dòng và vô hiệu hoá hàng loạt', async ({ page }) => {
    await login(page, 'admin');
    await page.goto('/members?status=active');
    await expect(page.getByText(/\d+ thành viên/)).toBeVisible();

    const rows = page.getByRole('table').getByRole('row');
    const first = await rows.nth(1).getByRole('link').innerText();
    const second = await rows.nth(2).getByRole('link').innerText();
    await rows.nth(1).getByRole('checkbox').check();
    await rows.nth(2).getByRole('checkbox').check();
    await expect(page.getByText('Đã chọn 2 thành viên')).toBeVisible();

    await page.getByRole('button', { name: 'Vô hiệu hoá' }).click();
    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'Vô hiệu hoá' })
      .click();

    await expect(page.getByText('Đã cập nhật 2 thành viên')).toBeVisible();
    await expect(page.getByText('Đã chọn 2 thành viên')).toBeHidden();
    // Đang lọc active nên hai dòng vừa vô hiệu hoá biến mất khỏi bảng.
    await expect(
      page.getByRole('link', { name: first, exact: true }),
    ).toBeHidden();
    await expect(
      page.getByRole('link', { name: second, exact: true }),
    ).toBeHidden();
  });

  test('thêm thành viên qua drawer: chọn quản lý từ select tìm server, lỗi email trùng hiện ở field', async ({
    page,
  }) => {
    await login(page, 'admin');
    await page.goto('/members');
    await page.getByRole('button', { name: 'Thêm thành viên' }).click();
    const drawer = page.getByRole('dialog');
    const name = `Người mới ${Date.now()}`;

    await drawer.getByLabel('Họ tên').fill(name);
    await drawer.getByLabel('Email').fill('member1@example.com');
    await drawer.getByLabel('Người quản lý').fill('Lan');
    // Option hiển thị của AntD Select là .ant-select-item-option; role=option là bản ẩn cho screen reader.
    const manager = page
      .locator('.ant-select-item-option', { hasText: 'Lan Phạm' })
      .first();
    const managerName = await manager.innerText();
    await manager.click();
    await drawer.getByRole('button', { name: 'Thêm thành viên' }).click();

    await expect(drawer.getByText('Email đã tồn tại')).toBeVisible();

    await drawer.getByLabel('Email').fill(`${Date.now()}@example.com`);
    await drawer.getByRole('button', { name: 'Thêm thành viên' }).click();
    await expect(page.getByText('Đã thêm thành viên')).toBeVisible();
    await expect(drawer).toBeHidden();

    const row = page.getByRole('row', { name: new RegExp(name) });
    await expect(row).toContainText(managerName);
  });

  test('trang chi tiết: bảng con phân trang trên URL', async ({ page }) => {
    await login(page, 'admin');
    await page.goto('/members/m1');
    await expect(
      page.getByRole('heading', { name: 'Lan Phạm 1' }),
    ).toBeVisible();
    await expect(page.getByText('12 phiên')).toBeVisible();

    await page.locator('.ant-pagination-next').click();
    await expect(page).toHaveURL(/page=2/);

    await page.reload();
    await expect(page.locator('.ant-pagination-item-active')).toHaveText('2');
  });

  test('user: thấy danh sách nhưng không có nút thêm, chọn dòng hay sửa', async ({
    page,
  }) => {
    await login(page, 'user');
    await page.goto('/members');
    await expect(page.getByText(/\d+ thành viên/)).toBeVisible();

    await expect(
      page.getByRole('button', { name: 'Thêm thành viên' }),
    ).toBeHidden();
    await expect(page.getByRole('table').getByRole('checkbox')).toHaveCount(0);
    await expect(page.getByRole('button', { name: /^Sửa / })).toHaveCount(0);
  });
});
