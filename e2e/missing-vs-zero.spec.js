import { test, expect } from '@playwright/test';

test.describe('Missing Values vs Explicit Zero E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('verifies blank savings is not displayed as 0.0%, while explicit zero savings displays 0.0%', async ({ page }) => {
    const timestamp = Date.now();
    const email = `zero_savings_${timestamp}@example.com`;

    // 1. Signup
    await page.goto('/signup');
    await page.fill('#name', 'Zero Test User');
    await page.fill('#email', email);
    await page.fill('#password', 'TestPassword123!');
    await page.fill('#confirmPassword', 'TestPassword123!');
    await page.check('#termsCheck');
    await page.click('button[type="submit"]');

    // 2. Onboarding: Leave monthly savings blank
    await page.waitForURL(/.*onboarding/, { timeout: 10000 });
    await page.locator('.horizontal-option-row:has-text("Student")').click();
    await page.fill('#fullName', 'Zero Test User');
    await page.click('button:has-text("Continue to Financial Profile")');

    await page.fill('#stuIncome', '30000');
    await page.fill('#stuExpenses', '20000');
    // Blank savings
    await page.fill('#stuSavings', '');
    await page.click('button:has-text("Continue to Portfolio Holdings")');
    await page.click('button:has-text("Continue to Goals")');
    await page.click('button:has-text("Complete Setup & Launch Dashboard")');

    // 3. Verify blank savings does NOT produce false calculated 0.0%
    await page.waitForURL(/.*student/, { timeout: 10000 });
    const savingsCard = page.locator('.metric-card').filter({ hasText: /Investment Pace|Monthly/i });
    await expect(savingsCard).toContainText(/Not provided|Not Set/i);
    await expect(savingsCard).not.toContainText('0.0%');

    // 4. Update monthly savings to explicit 0 via Manage Portfolio modal
    await page.click('button:has-text("Manage Portfolio")');
    const modal = page.locator('.portfolio-modal-card');
    await expect(modal).toBeVisible();

    // Click Systematic Savings Pace tab inside modal
    await modal.locator('button:has-text("Systematic Savings Pace")').click();
    await modal.locator('#savingsInput').fill('0');
    await modal.locator('button:has-text("Save Monthly Pace")').click();
    await modal.locator('.modal-close-icon-btn').click();

    // 5. Verify explicit zero savings now displays 0.0%
    await expect(savingsCard).toContainText('0.0%');
  });

  test('verifies zero cash reserves with positive expenses produces 0.0 months runway', async ({ page }) => {
    const timestamp = Date.now();
    const email = `zero_cash_${timestamp}@example.com`;

    // 1. Signup as Business
    await page.goto('/signup');
    await page.fill('#name', 'Zero Runway Corp');
    await page.fill('#email', email);
    await page.fill('#password', 'CorpPassword123!');
    await page.fill('#confirmPassword', 'CorpPassword123!');
    await page.check('#termsCheck');
    await page.click('button[type="submit"]');

    // 2. Onboarding: Zero cash reserves, 50,000 monthly burn
    await page.waitForURL(/.*onboarding/, { timeout: 10000 });
    await page.locator('.horizontal-option-row:has-text("Business")').click();
    await page.fill('#fullName', 'Zero Runway Corp');
    await page.click('button:has-text("Continue to Financial Profile")');

    await page.fill('#bizName', 'Zero Runway Corp');
    await page.fill('#bizCashReserves', '0');
    await page.fill('#bizExpenses', '50000');
    await page.click('button:has-text("Continue to Portfolio Holdings")');
    await page.click('button:has-text("Continue to Goals")');
    await page.click('button:has-text("Complete Setup & Launch Dashboard")');

    // 3. Verify runway displays 0.0 months
    await page.waitForURL(/.*business/, { timeout: 10000 });
    const runwayCard = page.locator('.portal-card, .metric-card, .stat-card').filter({ hasText: /Cash Runway/i });
    await expect(runwayCard).toContainText(/0(\.0)? months/);
    await expect(runwayCard).toContainText(/Critical Runway/i);
  });
});

