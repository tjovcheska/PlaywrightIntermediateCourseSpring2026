import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ArticlePage extends BasePage{
    // Locators
    readonly heading: Locator;
    readonly favoriteButton: Locator;
    readonly banner: Locator;
    readonly editButton: Locator;
    readonly deleteButton: Locator;
    readonly tagList: Locator;

    constructor(page: Page) {
        super(page);

        this.heading = page.getByRole('heading', { level: 1 });
        this.banner = page.locator('.banner');
        this.favoriteButton = this.banner.getByRole('button', { name: /Favorite Article/i })
        .or(page.getByRole('button', { name: /Unfavorite Article/i}));
        // The article page renders action buttons in two places (banner + bottom); use first() to avoid strict mode
        this.editButton = page.getByRole('link', { name: /Edit Article/i }).first();
        this.deleteButton = page.getByRole('button', { name: /Delete Article/i }).first();
        this.tagList = page.locator('.tag-list');
    }

    // Methods
    async assertOnPage() {
        await expect(this.heading).toBeVisible();
    }

    async assertArticleTitle(articleTitle: string) {
        await expect(this.heading).toHaveText(articleTitle);
    }

    async assertFavoriteButtonVisible() {
        await expect(this.favoriteButton).toBeVisible()
    }

    async assertEditButtonNotVisible() {
        await expect(this.editButton).not.toBeVisible();
    }

    async assertDeleteButtonNotVisible() {
        await expect(this.deleteButton).not.toBeVisible();
    }

    async assertTagVisible(tag: string) {
        await expect(this.tagList).toContainText(tag);
    }

    async clickFavoriteButton() {
        await this.favoriteButton.click();
    }

    async clickEditButton() {
        await this.editButton.click();
    }

    async clickDeleteButton() {
        await this.deleteButton.click();
    }
}
