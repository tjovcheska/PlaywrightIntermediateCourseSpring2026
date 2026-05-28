import { expect, Page } from "@playwright/test";

export class BasePage {

    constructor(readonly page: Page) {
    }

    // Methods
    async assertNavUsername(username: string) {
        await expect(this.page.getByRole('link', { name: username})).toBeVisible(); 
    }
}
