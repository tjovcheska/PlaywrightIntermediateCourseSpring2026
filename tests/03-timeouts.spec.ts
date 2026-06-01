import { test } from "../fixtures/authenticatedPage";
import { ArticlePage } from "../pages/ArticlePage";
import { EditorPage } from "../pages/EditorPage";
import { HomePage } from "../pages/HomePage";

test.describe('Fixture timeout', () => {
    test('authenticated users can open the editor', async ({ authenticatedPage }) => {
        const editorPage = new EditorPage(authenticatedPage);
        const homePage = new HomePage(authenticatedPage);

        await homePage.clickNewAricleNavLink();
        await editorPage.assertOnPage();
    });
});

test.describe('Test timeout', () => {
    test('publishing an atricle', async({ authenticatedPage }) => {
        test.setTimeout(60_000);

        const editorPage = new EditorPage(authenticatedPage);
        const articlePage = new ArticlePage(authenticatedPage);

        await editorPage.goto();
        await editorPage.publish(
            'My Playwright Article',
            'A practical guide to timeoutas',
            'Timeout guard each layed of your test',
            ['playwright', 'timeouts']
        );

        await authenticatedPage.waitForURL(/\/article\//, { timeout: 15_000 });
        await articlePage.assertOnPage();
        await articlePage.assertArticleTitle('My Playwright Article');

    });
});