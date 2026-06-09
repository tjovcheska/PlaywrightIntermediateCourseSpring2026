import { test, expect } from '@playwright/test';
import { APIClient } from '../utils/apiClient';
import { generateUser } from '../utils/testData';

let authToken = '';
let username = '';
let articleSlug = '';
test.describe('Article lifecycle', () => {
    test.describe.configure({ mode: 'serial' });
    
    test.beforeAll(async ({ request }) => {
        const api = new APIClient(request);
        const user = generateUser();

        const createdUser = await api.register(user.username, user.email, user.password)
        authToken = createdUser.token;
        username = createdUser.username;

        const data = {
            title: `Demo ${Date.now()}`,
            description: `Desc ${Date.now()}`,
            body: `Body ${Date.now()}`,
            tagList: ['playwright']

        };
        const createdArticle = await api.createArticle(data);
        articleSlug = createdArticle.slug;
    });

    test.skip('Register a user', async ({ request }) => {
        const api = new APIClient(request);
        const user = generateUser();
        const createdUser = await api.register(user.username, user.email, user.password)
        console.log(createdUser)
    });

    test.skip('Create an article', async ({ request }) => {
        const api = new APIClient(request);
        const user = generateUser();
        const createdUser = await api.register(user.username, user.email, user.password)
        console.log(createdUser)
        const data = {
            title: `Demo ${Date.now()}`,
            description: `Desc ${Date.now()}`,
            body: `Body ${Date.now()}`,
            tagList: ['playwright']

        };
        const createdArticle = await api.createArticle(data);
        console.log(createdArticle)
    });

    test('Read an article', async ({ request }) => {
        const api = new APIClient(request);
        api.setToken(authToken);
        const article = await api.getArticle(articleSlug);
        console.log(article)

        expect(article.slug).toBe(articleSlug);
        expect(article.author.username).toBe(username)
        expect(article.tagList).toContain('playwright')
    });

    test('Update an article', () => {
        // TODO
    });

    test('Delete an article', async ({ request }) => {
        const api = new APIClient(request);
        api.setToken(authToken);

        await api.deleteArticle(articleSlug);
    });
});