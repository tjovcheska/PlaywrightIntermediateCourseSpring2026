import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { EditorPage } from '../pages/EditorPage';
import { ArticlePage } from '../pages/ArticlePage';
import { APIClient } from '../utils/apiClient';
import { generateUser } from '../utils/testData';

test.describe('Article Management', { tag: ['@articles'] }, () => {

    // ART-001
    test('create: publishes article and redirects to article page with tags', async ({ page, request }) => {
        const user = generateUser();
        const api = new APIClient(request);
        await api.register(user.username, user.email, user.password);

        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(user.email, user.password);
        await page.waitForURL('/');

        const editorPage = new EditorPage(page);
        await editorPage.goto();
        await editorPage.assertOnPage();
        await editorPage.publish(
            'My Playwright Article',
            'About Playwright testing',
            'This article covers Playwright best practices.',
            ['playwright', 'testing']
        );

        const articlePage = new ArticlePage(page);
        await articlePage.assertOnPage();
        await articlePage.assertArticleTitle('My Playwright Article');
        await articlePage.assertTagVisible('playwright');
    });

    // ART-002
    test('create: shows validation errors when all required fields are empty', async ({ page, request }) => {
        const user = generateUser();
        const api = new APIClient(request);
        await api.register(user.username, user.email, user.password);

        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(user.email, user.password);
        await page.waitForURL('/');

        const editorPage = new EditorPage(page);
        await editorPage.goto();
        await editorPage.assertOnPage();
        await editorPage.publishButton.click();

        await editorPage.assertErrorMessages();
        await editorPage.assertOnPage();
    });

    // ART-003
    test('edit: author updates title and content of their own article', async ({ page, request }) => {
        const user = generateUser();
        const api = new APIClient(request);
        await api.register(user.username, user.email, user.password);
        const article = await api.createArticle({
            title: `Original Title ${Date.now()}`,
            description: 'Original description',
            body: 'Original body content',
            tagList: []
        });

        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(user.email, user.password);
        await page.waitForURL('/');

        const editorPage = new EditorPage(page);
        await editorPage.gotoEdit(article.slug);
        await editorPage.assertOnPage();
        // Wait for the editor to pre-fill with the existing article data before overwriting
        await expect(editorPage.titleInput).toHaveValue(article.title, { timeout: 10000 });
        await editorPage.fillTitle('Updated Title');
        await editorPage.fillBody('Updated body content');
        await editorPage.publishButton.click();

        const articlePage = new ArticlePage(page);
        await articlePage.assertArticleTitle('Updated Title');
    });

    // ART-004
    test('edit: non-author does not see edit or delete controls', async ({ page, request }) => {
        // Use a demo article from "johndoe" — always visible regardless of session isolation.
        // Any newly registered user cannot be the author of johndoe's articles.
        const visitor = generateUser();
        const visitorApi = new APIClient(request);
        await visitorApi.register(visitor.username, visitor.email, visitor.password);

        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(visitor.email, visitor.password);
        await page.waitForURL('/');

        const homePage = new HomePage(page);
        await homePage.clickGlobalFeedTab();
        await expect(homePage.articlePreviews.first()).toBeVisible({ timeout: 15000 });
        await homePage.clickFirstArticle();

        const articlePage = new ArticlePage(page);
        await articlePage.assertOnPage();
        await articlePage.assertEditButtonNotVisible();
        await articlePage.assertDeleteButtonNotVisible();
    });

    // ART-005
    test('delete: author removes article and it disappears from the global feed', async ({ page, request }) => {
        const user = generateUser();
        const api = new APIClient(request);
        await api.register(user.username, user.email, user.password);
        const articleTitle = `Delete Me ${Date.now()}`;
        const article = await api.createArticle({
            title: articleTitle,
            description: 'To be deleted',
            body: 'This article will be deleted',
            tagList: []
        });

        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(user.email, user.password);
        await page.waitForURL('/');

        // Switch to global feed and navigate to the article via internal React Router link
        const homePage = new HomePage(page);
        await homePage.clickGlobalFeedTab();
        await expect(homePage.articlePreviews.filter({ hasText: articleTitle })).toBeVisible({ timeout: 15000 });
        await homePage.clickArticleByTitle(articleTitle);

        const articlePage = new ArticlePage(page);
        await articlePage.assertArticleTitle(articleTitle);
        await articlePage.clickDeleteButton();

        await homePage.assertOnHomePage();
        await homePage.clickGlobalFeedTab();
        await expect(homePage.articlePreviews.first()).toBeVisible();
        await homePage.assertArticleNotInFeed(articleTitle);
    });

    // ART-006
    test('global feed: shows article list and pagination navigates to page 2', async ({ page, request }) => {
        // Create 10 articles via API, then log in as that same user so the browser session sees
        // user's 10 articles + 4 demo articles = 14 total → page 2 exists (10 per page).
        const user = generateUser();
        const api = new APIClient(request);
        await api.register(user.username, user.email, user.password);
        for (let i = 0; i < 10; i++) {
            await api.createArticle({
                title: `Pagination Article ${Date.now()}-${i}`,
                description: 'For pagination testing',
                body: 'Content',
                tagList: []
            });
        }

        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(user.email, user.password);
        await page.waitForURL('/');

        const homePage = new HomePage(page);
        await homePage.clickGlobalFeedTab();
        await expect(homePage.articlePreviews.first()).toBeVisible({ timeout: 15000 });
        await expect(homePage.pagination).toBeVisible();

        const firstPageTitle = await homePage.articlePreviews.first().locator('h1').textContent();

        await homePage.clickPage(2);
        await expect(homePage.articlePreviews.first()).toBeVisible({ timeout: 10000 });

        const secondPageTitle = await homePage.articlePreviews.first().locator('h1').textContent();
        expect(firstPageTitle).not.toBe(secondPageTitle);
    });

    // ART-007
    test('personal feed: shows articles from followed users in Your Feed', async ({ page, request }) => {
        // Use johndoe's demo articles (always visible) to follow. A new user registers, logs in,
        // clicks a demo article, follows johndoe, then verifies johndoe's articles appear in Your Feed.
        const user = generateUser();
        const api = new APIClient(request);
        await api.register(user.username, user.email, user.password);

        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(user.email, user.password);
        await page.waitForURL('/');

        const homePage = new HomePage(page);
        await homePage.clickGlobalFeedTab();
        await expect(homePage.articlePreviews.first()).toBeVisible({ timeout: 15000 });

        // Record the first demo article's title, then open it
        const firstArticleTitle = await homePage.articlePreviews.first().locator('h1').textContent();
        await homePage.clickFirstArticle();

        // Follow the article's author (johndoe); button appears twice — use first()
        await page.getByRole('button', { name: /Follow/i }).first().click();

        // Return home and check Your Feed shows johndoe's article
        await homePage.goto();
        await homePage.clickYourFeedTab();
        await expect(homePage.articlePreviews.first()).toBeVisible({ timeout: 10000 });
        await expect(homePage.articlePreviews.filter({ hasText: firstArticleTitle! })).toBeVisible();
    });

});
