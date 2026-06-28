import { test, expect } from '@playwright/test';
import { login } from './testes-login.spec';



test('Deve criar um novo projeto', async ({ page }) => {
    await login(page);

    await page.goto('http://localhost:3000');

    const projectName = `Projeto Teste`;

    await page.getByPlaceholder('Name of the new project').fill(projectName);

    await page.getByRole('button', { name: /create project/i }).click();

    await expect(page.getByText(projectName)).toBeVisible();
});

test('Deve editar o nome de um projeto', async ({ page }) => {
    await login(page);

    await page.goto('http://localhost:3000');

    const originalName = `Projeto ${Date.now()}`;
    const updatedName = `${originalName} EDITADO`;

    await page.getByPlaceholder('Name of the new project').fill(originalName);
    await page.getByRole('button', { name: /create project/i }).click();

    const projectCard = page.getByText(originalName);
    await expect(projectCard).toBeVisible();

    const card = projectCard.locator('xpath=ancestor::div[contains(@class, "w-72")]');

    await card.locator('svg').first().click();

    const dialog = page.getByRole('dialog');
    await dialog.getByRole('textbox').fill(updatedName);

    await dialog.getByRole('button', { name: /edit/i }).click();

    await expect(page.getByText(updatedName)).toBeVisible();
});

test('Deve entrar em um projeto ao clicar nele', async ({ page }) => {
    await login(page);

    await page.goto('http://localhost:3000');

    const projectName = `Projeto Teste`;

    await page.getByPlaceholder('Name of the new project').fill(projectName);
    await page.getByRole('button', { name: /create project/i }).click();

    const project = page.getByText(projectName);
    await expect(project).toBeVisible();

    await project.click();

    await expect(page.getByRole('heading', { name: projectName })).toBeVisible();
});

test('Deve criar e deletar um projeto', async ({ page }) => {
    await login(page);

    await page.goto('http://localhost:3000');

    const projectName = 'Projeto Teste';

    const project = page.getByText(projectName);
    await expect(project).toBeVisible();

    const card = project.locator('xpath=ancestor::div[contains(@class, "w-72")]');

    await card.locator('svg').nth(1).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await dialog.getByRole('button', { name: /delete/i }).click();

    await expect(page.getByText(projectName)).not.toBeVisible();
});