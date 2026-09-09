import { expect, test } from '@playwright/test';

import { login } from './helpers';

test.describe('i18n', () => {
  test('đổi ngôn ngữ ở header, giữ sau reload', async ({ page }) => {
    await login(page, 'admin');
    await page.goto('/projects');
    await expect(page.getByRole('heading', { name: 'Dự án' })).toBeVisible();

    await page.getByRole('combobox', { name: 'Ngôn ngữ' }).click();
    await page.getByTitle('Tiếng Anh').click();

    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Create project' }),
    ).toBeVisible();
    await expect(page.getByText('23 projects')).toBeVisible();

    await page.reload();
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();

    await page.getByRole('combobox', { name: 'Language' }).click();
    await page.getByTitle('Vietnamese').click();
    await expect(page.getByRole('heading', { name: 'Dự án' })).toBeVisible();
  });
});
