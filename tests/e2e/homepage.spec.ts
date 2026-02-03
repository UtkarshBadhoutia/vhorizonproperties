import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
    test('should load homepage', async ({ page }) => {
        await page.goto('http://localhost:8080');

        // Check for main heading
        await expect(page.locator('h1')).toContainText('Architecture as Art');

        // Check navigation
        await expect(page.locator('nav')).toBeVisible();
    });

    test('should navigate to buy page', async ({ page }) => {
        await page.goto('http://localhost:8080');

        // Click Buy button
        await page.click('text=Buy');

        // Verify URL changed
        await expect(page).toHaveURL(/.*buy/);
    });
});

test.describe('Authentication', () => {
    test('should show login page', async ({ page }) => {
        await page.goto('http://localhost:8080/login');

        // Check for login form
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
    });
});
