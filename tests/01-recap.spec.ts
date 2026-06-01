import { test, expect } from '@playwright/test';


test.describe('Sign up', { tag: '@signup'}, () => {
  test('registers a new user and redirects to the home feed', async ({ page }) => {
    const timestamp = Date.now();
    const username = `tester${timestamp}`;
    const email = `${username}@example.com`;
    const password = 'password123';

    await page.goto('/register');

    await page.getByPlaceholder('Username').fill(username);
    await page.getByPlaceholder('Email').fill(email);
    await page.getByPlaceholder('Password').fill(password);

    await page.getByRole('button', { name: 'Sign up'}).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('link', { name: username})).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign in'})).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign up'})).not.toBeVisible();
  });
});

test.describe('Sign in', { tag: '@signin'}, () => {

  let username: string;
  let email: string;
  let password: string;

  test.beforeAll(async ({ browser }) => {
    const timestamp = Date.now();
    username = `tester${timestamp}`;
    email = `${username}@example.com`;
    password = 'password123';

    const setupPage = await browser.newPage();
    await setupPage.goto('/register');

    await setupPage.getByPlaceholder('Username').fill(username);
    await setupPage.getByPlaceholder('Email').fill(email);
    await setupPage.getByPlaceholder('Password').fill(password);
    await setupPage.getByRole('button', { name: 'Sign up'}).click();

    await expect(setupPage).toHaveURL('/');

    await setupPage.close();

  });

  test('sings in with valid credentials and shows username in the navbar', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder('Email').fill(email);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Sign in'}).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('link', { name: username })).toBeVisible();

    await expect(page.getByRole('link', { name: 'New Article'})).toBeVisible();
    await expect(page.getByRole('link', { name: 'Settings'})).toBeVisible();
  });
});
