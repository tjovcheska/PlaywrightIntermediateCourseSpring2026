import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage{
    // Locators
    readonly signInButton: Locator;
    readonly signUpButton: Locator;
    readonly newArticleNavLink: Locator;
    readonly settingsNavLink: Locator;

    constructor(page: Page) {
        super(page);

        this.signInButton = page.getByRole('link', { name: 'Sign in'});
        this.signUpButton = page.getByRole('link', { name: 'Sign up'});
        this.newArticleNavLink = page.getByRole('link', { name: 'New Article'});
        this.settingsNavLink = page.getByRole('link', { name: 'Settings'});
    }

    // Methods
    async assertOnHomePage() {
        await expect(this.page).toHaveURL('/');
    }

    async assertSignedUp() {
        await expect(this.signInButton).not.toBeVisible();
        await expect(this.signUpButton).not.toBeVisible();
    }

    async assertLoggedIn() {
        await expect(this.newArticleNavLink).toBeVisible();
        await expect(this.settingsNavLink).toBeVisible();
    }

    async clickNewAricleNavLink() {
        await this.newArticleNavLink.click();
    }
}
