import { Page } from '@playwright/test';

export async function login(page: Page) {
    await page.goto('http://localhost:3000/login');
    await page.locator('#username').fill('karolzinha');
    await page.locator('#password').fill('SenhaForte');
    await page.locator('#button-submit').click();
    await page.waitForURL('http://localhost:3000');
}