import { test, expect } from '@playwright/test';

test.describe('Persistence & Account Isolation E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('isolates user financial data between accounts, preserves data across reload, and prevents cross-contamination on logout/login', async ({ page }) => {
    const timestamp = Date.now();
    const emailA = `user_a_${timestamp}@example.com`;
    const emailB = `user_b_${timestamp}@example.com`;
    const password = 'TestPassword123!';

    // --- STEP 1: Create Account A (Student, ₹5,000 Savings) ---
    await page.goto('/signup');
    await page.fill('#name', 'User Alpha');
    await page.fill('#email', emailA);
    await page.fill('#password', password);
    await page.fill('#confirmPassword', password);
    await page.check('#termsCheck');
    await page.click('button[type="submit"]');

    // Onboarding Step 1
    await page.waitForURL(/.*onboarding/, { timeout: 10000 });
    await page.locator('.horizontal-option-row:has-text("Student")').click();
    await page.fill('#fullName', 'User Alpha');
    await page.click('button:has-text("Continue to Financial Profile")');

    // Onboarding Step 2: Set ₹5,000 savings
    await page.fill('#stuIncome', '30000');
    await page.fill('#stuExpenses', '20000');
    await page.fill('#stuSavings', '5000');
    await page.click('button:has-text("Continue to Portfolio Holdings")');

    // Step 3 & 4: Finish
    await page.click('button:has-text("Continue to Goals")');
    await page.click('button:has-text("Complete Setup & Launch Dashboard")');

    // Verify Account A displays ₹5,000
    await page.waitForURL(/.*student/, { timeout: 10000 });
    await expect(page.locator('.metric-card').filter({ hasText: /Investment Pace|Monthly/i })).toContainText('₹5,000');

    // --- STEP 2: Sign out of Account A ---
    await page.goto('/settings');
    await page.click('button:has-text("Security & Account")');
    await page.click('button:has-text("Sign Out")');
    await page.waitForURL(/.*login/, { timeout: 10000 });

    // --- STEP 3: Create Account B (Student, ₹12,000 Savings) ---
    await page.goto('/signup');
    await page.fill('#name', 'User Beta');
    await page.fill('#email', emailB);
    await page.fill('#password', password);
    await page.fill('#confirmPassword', password);
    await page.check('#termsCheck');
    await page.click('button[type="submit"]');

    // Onboarding Step 1
    await page.waitForURL(/.*onboarding/, { timeout: 10000 });
    await page.locator('.horizontal-option-row:has-text("Student")').click();
    await page.fill('#fullName', 'User Beta');
    await page.click('button:has-text("Continue to Financial Profile")');

    // Onboarding Step 2: Set ₹12,000 savings
    await page.fill('#stuIncome', '50000');
    await page.fill('#stuExpenses', '30000');
    await page.fill('#stuSavings', '12000');
    await page.click('button:has-text("Continue to Portfolio Holdings")');

    // Step 3 & 4: Finish
    await page.click('button:has-text("Continue to Goals")');
    await page.click('button:has-text("Complete Setup & Launch Dashboard")');

    // Verify Account B displays ₹12,000
    await page.waitForURL(/.*student/, { timeout: 10000 });
    await expect(page.locator('.metric-card').filter({ hasText: /Investment Pace|Monthly/i })).toContainText('₹12,000');

    // --- STEP 4: Refresh Account B and verify persistence ---
    await page.reload();
    await expect(page.locator('.metric-card').filter({ hasText: /Investment Pace|Monthly/i })).toContainText('₹12,000');

    // --- STEP 5: Sign out of Account B and log back into Account A ---
    await page.goto('/settings');
    await page.click('button:has-text("Security & Account")');
    await page.click('button:has-text("Sign Out")');
    await page.waitForURL(/.*login/, { timeout: 10000 });

    // Log in as Account A
    await page.fill('#email', emailA);
    await page.fill('#password', password);
    await page.click('button[type="submit"]');

    // Verify Account A lands on Dashboard and displays its own ₹5,000 savings (NOT ₹12,000)
    await page.waitForURL(/.*student/, { timeout: 10000 });
    await expect(page.locator('.metric-card').filter({ hasText: /Investment Pace|Monthly/i })).toContainText('₹5,000');
    await expect(page.locator('.metric-card').filter({ hasText: /Investment Pace|Monthly/i })).not.toContainText('₹12,000');
  });
});

