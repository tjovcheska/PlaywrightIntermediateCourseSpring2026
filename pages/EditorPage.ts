import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class EditorPage extends BasePage{
    // Locators
    readonly titleInput: Locator;
    readonly descriptionInput: Locator;
    readonly articleContentInput: Locator;
    readonly tagsInput: Locator;
    readonly publishButton: Locator;

    constructor(page: Page) {
        super(page);

        this.titleInput = page.getByPlaceholder('Article Title');
        this.descriptionInput = page.getByPlaceholder("What's this article about?");
        this.articleContentInput = page.getByPlaceholder('Write your article (in markdown)');
        this.tagsInput = page.getByPlaceholder('Enter tags');
        this.publishButton = page.getByRole('button', { name: 'Publish Article' });

    }

    // Methods
    async goto() {
        await this.page.goto('/editor');
    }

    async assertOnPage(options?: { timeout?: number }) {
        await expect(this.page).toHaveURL(/editor/, options)
        await expect(this.titleInput).toBeVisible(options);
    }

    async publish(title: string, description: string, articleContent: string, tags: string[] = []) {
        await this.titleInput.fill(title);
        await this.descriptionInput.fill(description);
        await this.articleContentInput.fill(articleContent);
        for (const tag of tags) {
            await this.addTag(tag);
        }
        await this.publishButton.click();
    }

    private async addTag(tag: string) {
        await this.tagsInput.fill(tag);
    }
}
