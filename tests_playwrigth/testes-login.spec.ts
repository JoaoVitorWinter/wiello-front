import { test, expect } from '@playwright/test';

test('deve fazer login com sucesso', async ({ page }) => {
  await page.goto('http://localhost:3000/login');

  await page.locator('#username').fill('usuario_teste');
  await page.locator('#password').fill('123456');

  await page.getByRole('button', { name: /login/i }).click();

  await expect(page).toHaveURL('http://localhost:3000/login');
});