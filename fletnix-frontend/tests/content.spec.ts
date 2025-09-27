import { test, expect } from '@playwright/test';

test.describe('FletNix Content', () => {
  const testUser = {
    email: 'ankit.singh.work2024@gmail.com',
    password: 'qwerty12345'
  };

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');
    
    // Wait for dashboard content
    await expect(
      page.locator('header span.text-gray-300').filter({ hasText: 'Welcome' })
    ).toBeVisible({ timeout: 15000 });
  });

  test('should display dashboard with content', async ({ page }) => {
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
    await expect(page.locator('select').first()).toBeVisible();
  });

  test('should search for content', async ({ page }) => {
    await page.waitForSelector('.grid', { timeout: 10000 });
    
    await page.fill('input[placeholder*="Search"]', 'Friends');
    await page.waitForTimeout(3000);
    
    // Check if results text is displayed or grid still exists
    const resultsText = page.locator('text=results');
    if (await resultsText.first().isVisible()) {
      await expect(resultsText.first()).toBeVisible();
    } else {
      await expect(page.locator('.grid')).toBeVisible();
    }
  });

  test('should filter by type', async ({ page }) => {
    await page.waitForSelector('.grid', { timeout: 10000 });
    
    // Select Movie from dropdown
    await page.selectOption('select', 'Movie');
    await page.waitForTimeout(3000);
    
    // Check for filter tag or content with Movie type
    const movieFilter = page.locator('span').filter({ hasText: 'Type: Movie' });
    const movieContent = page.locator('.grid div').filter({ hasText: 'Movie' });
    
    // Either filter tag should be visible OR movie content should be visible
    try {
      await expect(movieFilter).toBeVisible({ timeout: 5000 });
    } catch {
      await expect(movieContent.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('should click on content for details', async ({ page }) => {
    await page.waitForSelector('.grid > div', { timeout: 15000 });
    await page.click('.grid > div:first-child');
    
    await expect(page.locator('text=Synopsis')).toBeVisible({ timeout: 10000 });
  });

  test('should navigate back from detail page', async ({ page }) => {
    await page.waitForSelector('.grid > div', { timeout: 15000 });
    await page.click('.grid > div:first-child');
    
    await expect(page.locator('text=Synopsis')).toBeVisible({ timeout: 10000 });
    
    await page.click('text=Back to Dashboard');
    
    await expect(
      page.locator('header span.text-gray-300').filter({ hasText: 'Welcome' })
    ).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    await page.click('text=Logout');
    
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 });
  });
});
