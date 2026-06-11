import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage{
    // Locators
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;
    readonly errorMessages: Locator;

    constructor(page: Page) {
        super(page);

        this.emailInput = page.getByPlaceholder('Email');
        this.passwordInput = page.getByPlaceholder('Password');
        this.signInButton = page.getByRole('button', { name: 'Sign in'});
        this.errorMessages = page.locator('ul.error-messages');
    }

    async goto() {
        await this.page.goto('/login');
    }

    async login(email: string, password: string) {
        await this.fillEmailInput(email);
        await this.fillPasswordInput(password);
        await this.clickSignInButton();
    }

    async fillEmailInput(email: string) {
        await this.emailInput.fill(email);
    }

    async fillPasswordInput(password: string) {
        await this.passwordInput.fill(password);
    }

    async clickSignInButton() {
        await this.signInButton.click();
    }

    async assertSignInButtonState(isDisabled: boolean = true) {
        if (isDisabled) {
            await expect(this.signInButton).toBeDisabled();
        } else {
            await expect(this.signInButton).toBeEnabled();
        }
    }

    async assertOnLoginPage() {
        await expect(this.page).toHaveURL('/login');
    }

    async assertErrorMessage(text: string) {
        await expect(this.errorMessages).toContainText(text);
    }

    async clearPasswordInputField() {
        await this.passwordInput.clear()
    }

    async assertResponseStatus(response: { status(): number }, expectedStatus: number) {
        expect(response.status()).toBe(expectedStatus)
    }
}
