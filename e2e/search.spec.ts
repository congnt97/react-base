import { expect, test } from '@playwright/test';

import { login } from './helpers';

test.describe('Tìm kiếm', () => {
  test('tự tìm sau khi ngừng gõ, chỉ gọi API một lần', async ({ page }) => {
    await login(page, 'admin');
    await page.goto('/projects');
    await expect(page.getByText('23 dự án')).toBeVisible();

    const requests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/projects?')) {
        requests.push(request.url());
      }
    });

    // Gõ từng ký tự: debounce phải gộp thành một lần gọi.
    await page.getByLabel('Tìm theo tên dự án').pressSequentially('Dự án 1', {
      delay: 60,
    });

    await expect(page).toHaveURL(/keyword=/);
    await expect(page.getByText('11 dự án')).toBeVisible();
    expect(requests.length).toBeLessThanOrEqual(2);
  });

  test('xoá từ khoá thì bỏ filter khỏi URL', async ({ page }) => {
    await login(page, 'admin');
    await page.goto(`/projects?keyword=${encodeURIComponent('án 1')}`);
    await expect(page.getByText('11 dự án')).toBeVisible();

    await page.getByLabel('Tìm theo tên dự án').clear();

    await expect(page.getByText('23 dự án')).toBeVisible();
    await expect(page).not.toHaveURL(/keyword=/);
  });
});
