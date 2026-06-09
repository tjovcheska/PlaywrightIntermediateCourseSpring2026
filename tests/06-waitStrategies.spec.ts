import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';

test.describe('', () => {
    test('User cannot submit the sign-in form with uncomplete fields', async({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();

        await loginPage.assertSignInButtonState();
        await loginPage.fillEmailInput('user@example.com');
        await loginPage.assertSignInButtonState();

        await loginPage.fillPasswordInput('password123');
        await loginPage.assertSignInButtonState(false);

        await loginPage.clearPasswordInputField();
        await loginPage.assertSignInButtonState();
    });

    test('User cannot sign in with invalid credentials', async({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();

        await loginPage.assertSignInButtonState();
        await loginPage.fillEmailInput('invalid@example.com');
        await loginPage.assertSignInButtonState();

        await loginPage.fillPasswordInput('password123');
        await loginPage.assertSignInButtonState(false);

        const responsePromise = page.waitForResponse('**/api/users/login')

        await loginPage.clickSignInButton();

        const response = await responsePromise;
        await loginPage.assertResponseStatus(response, 401);
    });
});