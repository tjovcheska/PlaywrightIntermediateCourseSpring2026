import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class EditorPage extends BasePage{
    // Locators
    readonly titleInput: Locator;

    constructor(page: Page) {
        super(page);

        this.titleInput = page.getByPlaceholder('Article Title');
    }

    // Methods
    async goto() {
        await expect(this.page).toHaveURL('/editor');
    }

    async assertOnPage(options?: { timeout?: number }) {
        await expect(this.page).toHaveURL(/editor/, options)
        await expect(this.titleInput).toBeVisible(options);
    }
}
