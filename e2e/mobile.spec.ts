import { expect, test } from '@playwright/test';

import { expectNoA11yViolations, login } from './helpers';

test.use({ viewport: { width: 375, height: 812 } });

test.describe('Mobile', () => {
  test('điều hướng qua Drawer: mở, chuyển trang, tự đóng', async ({ page }) => {
    await login(page, 'admin');

    // Sider ẩn dưới breakpoint lg nên hamburger là lối vào duy nhất.
    await expect(page.getByRole('link', { name: 'Dự án' })).toBeHidden();

    await page.getByRole('button', { name: 'Mở menu' }).click();
    const drawer = page.getByRole('dialog');
    await expect(drawer.getByRole('link', { name: 'Dự án' })).toBeVisible();

    await drawer.getByRole('link', { name: 'Dự án' }).click();
    await expect(page).toHaveURL(/\/projects/);
    // Chọn xong Drawer phải tự đóng, không che nội dung.
    await expect(drawer).toBeHidden();
    await expect(page.getByRole('heading', { name: 'Dự án' })).toBeVisible();
  });

  test('bảng cuộn ngang có gợi ý và trang không tràn ngang', async ({
    page,
  }) => {
    await login(page, 'admin');
    await page.goto('/projects');
    await expect(page.getByText('23 dự án')).toBeVisible();

    await expect(page.getByText('Vuốt ngang để xem thêm cột')).toBeVisible();

    const overflows = await page.evaluate(
      () => document.body.scrollWidth > document.body.clientWidth,
    );
    expect(overflows).toBe(false);
  });

  test('không có lỗi a11y trên mobile', async ({ page }) => {
    await login(page, 'admin');
    await page.goto('/projects');
    await expect(page.getByText('23 dự án')).toBeVisible();
    await expectNoA11yViolations(page);
  });
});

test.describe('Bàn phím', () => {
  test('skip link đưa thẳng tới nội dung chính', async ({ page }) => {
    await login(page, 'admin');

    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: 'Tới nội dung chính' });
    await expect(skipLink).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
  });
});
