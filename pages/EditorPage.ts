import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class EditorPage extends BasePage{
    // Locators
    readonly titleInput: Locator;
    readonly descriptionInput: Locator;
    readonly articleContentInput: Locator;
    readonly tagsInput: Locator;
    readonly publishButton: Locator;
    readonly errorMessages: Locator;

    constructor(page: Page) {
        super(page);

        this.titleInput = page.getByPlaceholder('Article Title');
        this.descriptionInput = page.getByPlaceholder("What's this article about?");
        this.articleContentInput = page.getByPlaceholder('Write your article (in markdown)');
        this.tagsInput = page.getByPlaceholder('Enter tags');
        this.publishButton = page.getByRole('button', { name: 'Publish Article' });
        this.errorMessages = page.locator('ul.error-messages');
    }

    // Methods
    async goto() {
        await this.page.goto('/editor');
    }

    async gotoEdit(slug: string) {
        await this.page.goto(`/editor/${slug}`);
    }

    async assertOnPage(options?: { timeout?: number }) {
        await expect(this.page).toHaveURL(/editor/, options)
        await expect(this.titleInput).toBeVisible(options);
    }

    async assertErrorMessages() {
        await expect(this.errorMessages).toBeVisible();
    }

    async fillTitle(title: string) {
        await this.titleInput.clear();
        await this.titleInput.fill(title);
    }

    async fillBody(body: string) {
        await this.articleContentInput.clear();
        await this.articleContentInput.fill(body);
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
        await this.tagsInput.press('Enter');
    }
}
