import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { APIClient } from '../utils/apiClient';
import { generateUser } from '../utils/testData';

test.describe('User Authentication', { tag: ['@auth'] }, () => {

    let username: string;
    let email: string;
    let password: string;

    test.beforeAll(async ({ request }) => {
        const user = generateUser();
        username = user.username;
        email = user.email;
        password = user.password;

        const apiClient = new APIClient(request);
        await apiClient.register(username, email, password);
    });

    test.describe('Happy path', () => {

        // TC-AUTH-001
        test('valid login redirects to home feed and shows username in navbar', async ({ page }) => {
            const loginPage = new LoginPage(page);
            const homePage = new HomePage(page);

            await loginPage.goto();
            await loginPage.login(email, password);

            await homePage.assertOnHomePage();
            await homePage.assertNavUsername(username);
            await homePage.assertLoggedIn();
        });

    });

    test.describe('Invalid credentials', () => {

        // TC-AUTH-002
        test('wrong password shows an error and stays on the login page', async ({ page }) => {
            const loginPage = new LoginPage(page);

            await loginPage.goto();
            await loginPage.login(email, 'wrongpassword');

            await loginPage.assertOnLoginPage();
            await loginPage.assertErrorMessage('credentials invalid');
        });

        // TC-AUTH-003
        test('unregistered email shows an error and stays on the login page', async ({ page }) => {
            const loginPage = new LoginPage(page);

            await loginPage.goto();
            await loginPage.login('nonexistent@example.com', 'anypassword');

            await loginPage.assertOnLoginPage();
            await loginPage.assertErrorMessage('credentials invalid');
        });

    });

    test.describe('Empty fields', () => {

        // TC-AUTH-004: Sign In button is disabled when both fields are empty
        test('both fields empty — Sign In button is disabled', async ({ page }) => {
            const loginPage = new LoginPage(page);

            await loginPage.goto();

            await loginPage.assertSignInButtonState(true);
        });

        // TC-AUTH-005: Sign In button stays disabled when only password is filled
        test('email missing — Sign In button is disabled', async ({ page }) => {
            const loginPage = new LoginPage(page);

            await loginPage.goto();
            await loginPage.fillPasswordInput('anypassword');

            await loginPage.assertSignInButtonState(true);
        });

        // TC-AUTH-006: Sign In button stays disabled when only email is filled
        test('password missing — Sign In button is disabled', async ({ page }) => {
            const loginPage = new LoginPage(page);

            await loginPage.goto();
            await loginPage.fillEmailInput(email);

            await loginPage.assertSignInButtonState(true);
        });

    });

    test.describe('Session persistence', () => {

        // TC-AUTH-007
        test('authenticated session survives a full page reload', async ({ page }) => {
            const loginPage = new LoginPage(page);
            const homePage = new HomePage(page);

            await loginPage.goto();
            await loginPage.login(email, password);
            await homePage.assertOnHomePage();

            await page.reload();
            await page.waitForLoadState('networkidle');

            await homePage.assertNavUsername(username);
            await homePage.assertLoggedIn();
        });

        // TC-AUTH-008
        test('authenticated session is shared with a new tab in the same context', async ({ page }) => {
            const loginPage = new LoginPage(page);
            const homePage = new HomePage(page);

            await loginPage.goto();
            await loginPage.login(email, password);
            await homePage.assertOnHomePage();

            const newTab = await page.context().newPage();
            const newTabHomePage = new HomePage(newTab);

            await newTabHomePage.goto();

            await newTabHomePage.assertNavUsername(username);
            await newTabHomePage.assertLoggedIn();

            await newTab.close();
        });

    });

});
