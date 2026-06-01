import { test, expect } from '@playwright/test';

test.describe('How to use testInfo properties', () => {
    test('test identity', async({ page }, testInfo) => {
        // Test identity
        console.log('title:', testInfo.title);
        expect(testInfo.titlePath).toEqual(["04-configuration.spec.ts", "How to use testInfo properties", "test identity"]);
        console.log('titlePath.at(-1):', testInfo.titlePath.at(-1));
        expect(testInfo.titlePath.at(-1)).toBe(testInfo.title);
        console.log('file:', testInfo.file);
        expect(testInfo.file).toMatch(/\.spec\.ts$/);
    });

    test('palellism and retires', async({ page }, testInfo) => {
        // Paralleism and retries
        console.log('retry:', testInfo.retry);
        expect(testInfo.retry).toBeGreaterThanOrEqual(0);

        console.log('parallelIndex:', testInfo.parallelIndex);
        expect(testInfo.parallelIndex).toBeGreaterThanOrEqual(0);

        console.log('workerIndex:', testInfo.workerIndex);
        expect(testInfo.workerIndex).toBeGreaterThanOrEqual(0);
    });

    test('Timing and config', async({ page }, testInfo) => {
        console.log('timeout:', testInfo.timeout);
        expect(testInfo.timeout).toBeGreaterThan(29000);

        console.log('config.workers:', testInfo.config.workers);
        expect(testInfo.config.workers).toBeDefined();

        console.log('project.name:', testInfo.project.name);
        expect(['chromium', 'firefox', 'Mobile Chrome']).toContain(testInfo.project.name);
    });

    test('Artifacts', async({ page }, testInfo) => {
        console.log('outputDir:', testInfo.outputDir);
        expect(testInfo.outputDir).toContain('test-results');

        const screenshotPath = testInfo.outputPath('checkpoint.png');
        console.log('screenshotPath:', screenshotPath);
        expect(screenshotPath).toContain('checkpoint.png');
    
        await page.goto('/');
        const screenshot = await page.screenshot();
        await testInfo.attach('homepage-snapshot', {
          body: screenshot,
          contentType: 'image/png',   // visible in the HTML report
        });
    });
});