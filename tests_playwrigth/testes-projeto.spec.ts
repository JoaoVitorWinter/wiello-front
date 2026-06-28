import { test, expect } from '@playwright/test';
import { login } from './testes-login.spec';

function generateProjectName(prefix: string) {
  return `${prefix} ${Date.now()}`;
}

test('Deve criar um novo projeto', async ({ page }) => {
  await login(page);
  await page.goto('http://localhost:3000');

  const projectName = generateProjectName('Criar Projeto');

  await page.getByPlaceholder('Name of the new project').fill(projectName);
  await page.getByRole('button', { name: /create project/i }).click();

  await expect(page.getByText(projectName)).toBeVisible();
});

test('Deve listar corretamente os projetos na página inicial', async ({ page }) => {
  await login(page);
  await page.goto('http://localhost:3000');

  const projectName = generateProjectName('Listagem Projeto');

  await page.getByPlaceholder('Name of the new project').fill(projectName);
  await page.getByRole('button', { name: /create project/i }).click();

  await expect(page.getByText(projectName)).toBeVisible();

  const projects = page.locator('text=/Projeto|Projeto|Criar|Listagem/');

  const count = await projects.count();
  expect(count).toBeGreaterThan(0);

  const allTexts = await projects.allTextContents();
  expect(allTexts).toContain(projectName);
});

test('Deve editar o nome de um projeto', async ({ page }) => {
  await login(page);
  await page.goto('http://localhost:3000');

  const originalName = generateProjectName('Editar Projeto');
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

  const projectName = generateProjectName('Entrar Projeto');

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

  const projectName = generateProjectName('Deletar Projeto');

  await page.getByPlaceholder('Name of the new project').fill(projectName);
  await page.getByRole('button', { name: /create project/i }).click();

  const project = page.getByText(projectName);
  await expect(project).toBeVisible();

  const card = project.locator('xpath=ancestor::div[contains(@class, "w-72")]');
  await expect(card).toBeVisible();

  await card.locator('svg').nth(1).click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  await dialog.getByRole('button', { name: /delete/i }).click();

  await expect(page.getByText(projectName)).not.toBeVisible();
});