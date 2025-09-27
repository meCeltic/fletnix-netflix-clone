import { test, expect } from '@playwright/test';

test.describe('FletNix Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200');
    await page.waitForLoadState('networkidle');
  });

  test('should display login page correctly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('FletNix');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should navigate to register page', async ({ page }) => {
    await page.click('text=Sign up here');
    await expect(page.url()).toContain('/register');
  });

  test('should show form validation', async ({ page }) => {
    // Fill invalid email
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', '123'); // Too short
    
    // Check if button is disabled due to validation
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeDisabled();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'ankit.singh.work2024@gmail.com');
    await page.fill('input[type="password"]', 'qwerty12345');
    await page.click('button[type="submit"]');
    
    // More specific selector for welcome message in header
    await expect(
      page.locator('header span.text-gray-300').filter({ hasText: 'Welcome' })
    ).toBeVisible({ timeout: 15000 });
  });

  test('should register new user', async ({ page }) => {
    const uniqueEmail = `test${Date.now()}@example.com`;
    
    await page.click('text=Sign up here');
    await page.fill('input[type="email"]', uniqueEmail);
    await page.fill('input[type="password"]', 'password123');
    await page.fill('input[type="number"]', '25');
    await page.click('button[type="submit"]');
    
    // Should show success or redirect
    await expect(
      page.locator('text=Registration successful').or(page.locator('header span.text-gray-300'))
    ).toBeVisible({ timeout: 15000 });
  });
});
