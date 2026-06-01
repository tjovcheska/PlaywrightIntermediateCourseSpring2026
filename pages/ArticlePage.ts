import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ArticlePage extends BasePage{
    // Locators
    readonly titleInput: Locator;
    readonly heading: Locator;

    constructor(page: Page) {
        super(page);

        this.heading = page.getByRole('heading', { level: 1 });
    }

    // Methods
    async assertOnPage() {
        await expect(this.heading).toBeVisible();
    }

    async assertArticleTitle(articleTitle: string) {
        await expect(this.heading).toHaveText(articleTitle);
    }
}
