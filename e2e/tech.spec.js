import { test, expect } from '@playwright/test';

test.describe('Tech Enterprise End-to-End Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('completes tech enterprise onboarding, verifies 65% utilization and breakdown, updates cloud spend in settings to 75%, and verifies persistence across reload', async ({ page }) => {
    const timestamp = Date.now();
    const testEmail = `tech_${timestamp}@example.com`;

    // 1. Navigate to signup
    await page.goto('/signup');
    await page.fill('#name', 'CloudScale Technologies');
    await page.fill('#email', testEmail);
    await page.fill('#password', 'TechEnterprise123!');
    await page.fill('#confirmPassword', 'TechEnterprise123!');
    await page.check('#termsCheck');
    await page.click('button[type="submit"]');

    // 2. Onboarding Step 1: Select Tech Persona
    await page.waitForURL(/.*onboarding/, { timeout: 10000 });
    await page.locator('.horizontal-option-row:has-text("Tech Company")').click();
    await page.fill('#fullName', 'CloudScale Technologies');
    await page.click('button:has-text("Continue to Financial Profile")');

    // 3. Onboarding Step 2: Enterprise IT Parameters
    await expect(page.locator('h1')).toContainText('Enterprise Technology Profile');
    await page.fill('#techOrgName', 'CloudScale Technologies');
    await page.fill('#techBudget', '1200000');
    await page.fill('#techMonthly', '65000');
    await page.fill('#cloudSpend', '30000');
    await page.fill('#saasSpend', '20000');
    await page.fill('#hardwareSpend', '10000');
    await page.fill('#cyberSpend', '5000');
    await page.click('button:has-text("Continue to Portfolio Holdings")');

    // 4. Onboarding Step 3 & 4: Skip holdings & finish
    await page.click('button:has-text("Continue to Goals")');
    await page.click('button:has-text("Complete Setup & Launch Dashboard")');

    // 5. Lands on Tech Dashboard
    await page.waitForURL(/.*tech/, { timeout: 10000 });

    // 6. Verify Tech Dashboard metrics
    // Monthly Tech Expenditure: ₹65,000
    await expect(page.locator('.portal-card, .metric-card, .stat-card').filter({ hasText: /Monthly Tech Expenditure/i })).toContainText('₹65,000');

    // Annual Tech Budget Utilization: 65% (65,000 * 12 = 7,80,000; 780,000 / 1,200,000 = 65.0%)
    await expect(page.locator('.portal-card, .metric-card, .stat-card').filter({ hasText: /Budget Utilization/i })).toContainText('65');

    // Technology Expenditure Breakdown Table
    const breakdownTable = page.locator('.panel-card:has-text("Technology Expenditure Breakdown") table');
    await expect(breakdownTable).toContainText('Cloud Infrastructure');
    await expect(breakdownTable).toContainText('₹30,000');
    await expect(breakdownTable).toContainText('Software & Licensing');
    await expect(breakdownTable).toContainText('₹20,000');
    await expect(breakdownTable).toContainText('Hardware');
    await expect(breakdownTable).toContainText('₹10,000');
    await expect(breakdownTable).toContainText('Cybersecurity');
    await expect(breakdownTable).toContainText('₹5,000');

    // 7. Navigate to Settings to update Cloud Expenditure
    await page.goto('/settings');
    await expect(page.locator('h1')).toContainText(/Settings/i);

    // Switch to Financial Preferences tab
    await page.click('button:has-text("Financial Preferences")');

    // Verify existing Cloud spend is populated
    await expect(page.locator('#settings-cloud-spend')).toHaveValue('30000');

    // Change Cloud spend from 30,000 to 40,000
    await page.fill('#settings-cloud-spend', '40000');
    await page.click('button:has-text("Save Changes")');

    // 8. Return to Tech Dashboard
    await page.goto('/tech-dashboard');
    await expect(page).toHaveURL(/.*tech/);

    // 9. Verify updated metrics (40k + 20k + 10k + 5k = 75,000; 75,000 * 12 = 9,00,000; 900,000 / 1,200,000 = 75.0%)
    // Monthly Tech Expenditure: ₹75,000
    await expect(page.locator('.portal-card, .metric-card, .stat-card').filter({ hasText: /Monthly Tech Expenditure/i })).toContainText('₹75,000');

    // Budget Utilization: 75%
    await expect(page.locator('.portal-card, .metric-card, .stat-card').filter({ hasText: /Budget Utilization/i })).toContainText('75');

    // 10. Refresh the page and verify updated values persist
    await page.reload();
    await expect(page.locator('.portal-card, .metric-card, .stat-card').filter({ hasText: /Monthly Tech Expenditure/i })).toContainText('₹75,000');
    await expect(page.locator('.portal-card, .metric-card, .stat-card').filter({ hasText: /Budget Utilization/i })).toContainText('75');
  });
});

