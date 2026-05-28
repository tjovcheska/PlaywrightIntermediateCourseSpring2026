import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { HomePage } from '../pages/HomePage';
import { generateUser } from '../utils/testData';
import { LoginPage } from '../pages/LoginPage';


test.describe('Sign up', () => {
  test('registers a new user and redirects to the home feed', async ({ page }) => {
    const user = generateUser();

    const registerPage = new RegisterPage(page);
    const homePage = new HomePage(page);

    await registerPage.goto();
    await registerPage.register(user.username, user.email, user.password);

    await homePage.assertOnHomePage();
    await homePage.assertNavUsername(user.username);
    await homePage.assertSignedUp();

  });
});

test.describe('Sign in', () => {

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
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(email, password);

    await homePage.assertOnHomePage();
    await homePage.assertNavUsername(username);
    await homePage.assertLoggedIn();
  });
});
