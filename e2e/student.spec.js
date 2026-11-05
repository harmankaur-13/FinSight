import { test, expect } from '@playwright/test';

test.describe('Student End-to-End Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage for isolated test execution
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('completes student signup, onboarding, verifies metrics, and adds investments with Test Case A calculations', async ({ page }) => {
    const timestamp = Date.now();
    const testEmail = `student_${timestamp}@example.com`;

    // 1. Navigate to signup
    await page.goto('/signup');
    await expect(page).toHaveURL(/.*signup/);

    // 2. Fill signup form
    await page.fill('#name', 'Aarav Patel');
    await page.fill('#email', testEmail);
    await page.fill('#password', 'SecurePass123!');
    await page.fill('#confirmPassword', 'SecurePass123!');
    await page.check('#termsCheck');
    await page.click('button[type="submit"]');

    // 3. Lands on Onboarding Step 1
    await page.waitForURL(/.*onboarding/, { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('How will you use FinSight?');

    // Select Student perspective (selected by default, verify click)
    await page.locator('.horizontal-option-row:has-text("Student")').click();
    await page.fill('#fullName', 'Aarav Patel');
    await page.click('button:has-text("Continue to Financial Profile")');

    // 4. Onboarding Step 2: Student Cashflow
    await expect(page.locator('h1')).toContainText('Student Financial Profile');
    await page.fill('#stuIncome', '30000');
    await page.fill('#stuExpenses', '20000');
    await page.fill('#stuSavings', '5000');
    await page.click('button:has-text("Continue to Portfolio Holdings")');

    // 5. Onboarding Step 3: Holdings (skip initial holdings to verify ₹0 initial portfolio)
    await expect(page.locator('.onboarding-step-header h1')).toContainText(/Holdings|Investments/i);
    await page.click('button:has-text("Continue to Goals")');

    // 6. Onboarding Step 4: Goals & Finish
    await expect(page.locator('.onboarding-step-header h1')).toContainText(/Goals/i);
    await page.click('button:has-text("Complete Setup & Launch Dashboard")');

    // 7. Verify Student Dashboard loads
    await page.waitForURL(/.*student/, { timeout: 10000 });
    await expect(page.locator('.dash-header-row .eyebrow')).toContainText(/Student|Wealth/i);

    // 8. Verify initial dashboard metrics
    // Initial portfolio: ₹0
    await expect(page.locator('.metric-card').filter({ hasText: /Portfolio Value/i })).toContainText('₹0');
    // Monthly Savings Capacity / Investment Pace: ₹5,000
    await expect(page.locator('.metric-card').filter({ hasText: /Investment Pace/i })).toContainText('₹5,000');
    // Savings Rate: 16.67%
    await expect(page.locator('.metric-card').filter({ hasText: /Investment Pace/i })).toContainText('16.67%');

    // 9. Open Manage Portfolio Modal
    await page.click('button:has-text("Manage Portfolio")');
    const modal = page.locator('.portfolio-modal-card');
    await expect(modal).toBeVisible();

    // Ensure Method A: Shares / Units & Price is active
    await page.click('button:has-text("Method A: Shares / Units & Price")');

    // Add Investment 1: Stocks (10 qty @ ₹100 buy, ₹200 current, target 50%)
    await modal.locator('#invName').fill('Equity Index Shares');
    await modal.locator('#invType').selectOption('Stocks');
    await modal.locator('#invSector').selectOption('Technology');
    await modal.locator('#invQty').fill('10');
    await modal.locator('#invBuyPrice').fill('100');
    await modal.locator('#invCurrPrice').fill('200');
    await modal.locator('#invTargetAlloc').fill('50');
    await modal.locator('button[type="submit"]:has-text("Add Position")').click();

    // Add Investment 2: Bonds (10 qty @ ₹100 buy, ₹100 current, target 50%)
    await page.click('button:has-text("Method A: Shares / Units & Price")');
    await modal.locator('#invName').fill('Sovereign Bond Units');
    await modal.locator('#invType').selectOption('Bonds');
    await modal.locator('#invSector').selectOption('Fixed Income');
    await modal.locator('#invQty').fill('10');
    await modal.locator('#invBuyPrice').fill('100');
    await modal.locator('#invCurrPrice').fill('100');
    await modal.locator('#invTargetAlloc').fill('50');
    await modal.locator('button[type="submit"]:has-text("Add Position")').click();

    // Close Modal
    await modal.locator('.modal-close-icon-btn').click();
    await expect(modal).not.toBeVisible();

    // 10. Verify Dashboard Metrics after adding holdings (Test Case A):
    // Portfolio value: ₹3,000
    await expect(page.locator('.metric-card').filter({ hasText: /Portfolio Value/i })).toContainText('₹3,000');

    // Performance return: 50% (+50.0%)
    await expect(page.locator('.metric-card').filter({ hasText: /Portfolio Value/i })).toContainText(/50/);

    // Allocation Drift: 16.67%
    await expect(page.locator('.metric-card').filter({ hasText: /Allocation Drift/i })).toContainText('16.67%');

    // Holdings: Verify both holdings appear with market values in RebalanceEngine
    const holdingsView = page.locator('table.rebalance-table');
    await expect(holdingsView).toContainText('Stocks');
    await expect(holdingsView).toContainText('₹2,000');
    await expect(holdingsView).toContainText('Bonds');
    await expect(holdingsView).toContainText('₹1,000');

    // Asset Allocations: Verify 66.67% Stocks and 33.33% Bonds
    const allocView = page.locator('.allocations-list');
    await expect(allocView).toContainText('66.67%');
    await expect(allocView).toContainText('33.33%');
  });
});

