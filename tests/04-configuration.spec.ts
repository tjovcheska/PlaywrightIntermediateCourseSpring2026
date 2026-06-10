import { test, expect } from '@playwright/test';

test.describe('How to use testInfo properties', () => {
    test('test identity', async({ page }, testInfo) => {
        // Test identity
        expect(testInfo.titlePath).toEqual(["04-configuration.spec.ts", "How to use testInfo properties", "test identity"]);
        expect(testInfo.titlePath.at(-1)).toBe(testInfo.title);
        expect(testInfo.file).toMatch(/\.spec\.ts$/);
    });

    test('palellism and retires', async({ page }, testInfo) => {
        // Paralleism and retries
        expect(testInfo.retry).toBeGreaterThanOrEqual(0);
        expect(testInfo.parallelIndex).toBeGreaterThanOrEqual(0);
        expect(testInfo.workerIndex).toBeGreaterThanOrEqual(0);
    });

    test('Timing and config', async({ page }, testInfo) => {
        expect(testInfo.timeout).toBeGreaterThan(29000);
        expect(testInfo.config.workers).toBeDefined();
        expect(['chromium', 'firefox', 'Mobile Chrome']).toContain(testInfo.project.name);
    });

    test('Artifacts', async({ page }, testInfo) => {
        expect(testInfo.outputDir).toContain('test-results');

        const screenshotPath = testInfo.outputPath('checkpoint.png');
        expect(screenshotPath).toContain('checkpoint.png');
    
        await page.goto('/');
        const screenshot = await page.screenshot();
        await testInfo.attach('homepage-snapshot', {
          body: screenshot,
          contentType: 'image/png',   // visible in the HTML report
        });
    });
});