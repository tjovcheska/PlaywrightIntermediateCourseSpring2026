import { test as base, Page } from "@playwright/test";
import { generateUser } from "../utils/testData";
import { RegisterPage } from "../pages/RegisterPage";
import { HomePage } from "../pages/HomePage";

 export type AuthenticatedPageFixture = {
    authenticatedPage: Page;
 }

export const test = base.extend<AuthenticatedPageFixture>({
    authenticatedPage: [
        async ({ browser }, use) => {
            const user = generateUser();
            const page = await browser.newPage();
            const registerPage = new RegisterPage(page);
            const homePage = new HomePage(page);

            await registerPage.goto();
            await registerPage.register(user.username, user.email, user.password);
            await homePage.assertOnHomePage();

            await use(page); // test body runs here

            await page.close();
        },
        { timeout: 60_000 }
    ],
})

