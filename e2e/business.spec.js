import { test, expect } from '@playwright/test';

test.describe('Business End-to-End Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('completes business onboarding with blank liabilities, verifies runway & unverified badge, then updates liabilities in settings to verify net position', async ({ page }) => {
    const timestamp = Date.now();
    const testEmail = `business_${timestamp}@example.com`;

    // 1. Navigate to signup
    await page.goto('/signup');
    await page.fill('#name', 'Apex Treasury Corp');
    await page.fill('#email', testEmail);
    await page.fill('#password', 'CorpSecurePass123!');
    await page.fill('#confirmPassword', 'CorpSecurePass123!');
    await page.check('#termsCheck');
    await page.click('button[type="submit"]');

    // 2. Onboarding Step 1: Select Business Persona
    await page.waitForURL(/.*onboarding/, { timeout: 10000 });
    await page.locator('.horizontal-option-row:has-text("Business")').click();
    await page.fill('#fullName', 'Apex Treasury Corp');
    await page.click('button:has-text("Continue to Financial Profile")');

    // 3. Onboarding Step 2: Corporate Parameters
    await expect(page.locator('h1')).toContainText('Corporate Treasury Profile');
    await page.fill('#bizName', 'Apex Treasury Corp');
    await page.fill('#bizCashReserves', '300000');
    await page.fill('#bizExpenses', '100000');
    // Leave liabilities blank as instructed
    await page.fill('#bizShortLiab', '');
    await page.fill('#bizLongLiab', '');
    await page.click('button:has-text("Continue to Portfolio Holdings")');

    // 4. Onboarding Step 3 & 4: Skip holdings & finish
    await page.click('button:has-text("Continue to Goals")');
    await page.click('button:has-text("Complete Setup & Launch Dashboard")');

    // 5. Lands on Business Dashboard
    await page.waitForURL(/.*business/, { timeout: 10000 });

    // 6. Verify Dashboard metrics with blank liabilities
    // Cash Reserves subtitle: ₹3,00,000
    await expect(page.locator('.portal-card, .metric-card, .stat-card').filter({ hasText: /Total Treasury Assets/i })).toContainText('₹3,00,000');

    // Monthly Burn: ₹1,00,000
    await expect(page.locator('.portal-card, .metric-card, .stat-card').filter({ hasText: /Cash Runway/i })).toContainText('₹1,00,000');

    // Cash Runway: 3.0 months (300,000 / 100,000)
    await expect(page.locator('.portal-card, .metric-card, .stat-card').filter({ hasText: /Cash Runway/i })).toContainText(/3(\.0)? months/);

    // Net Financial Position must show unverified status / badge
    const netPosCard = page.locator('.portal-card, .metric-card, .stat-card').filter({ hasText: /Net Financial Position/i });
    await expect(netPosCard).toContainText(/Liabilities Not Configured|Unverified/i);

    // 7. Navigate to Settings to configure explicit zero liabilities
    await page.goto('/settings');
    await expect(page.locator('h1')).toContainText(/Settings/i);

    // Switch to Financial Preferences tab
    await page.click('button:has-text("Financial Preferences")');

    // Enter 0 for both short-term and long-term liabilities
    await page.fill('#settings-short-term-liabilities', '0');
    await page.fill('#settings-long-term-liabilities', '0');
    await page.click('button:has-text("Save Changes")');

    // Toast confirmation
    await expect(page.locator('.toast, [role="status"], .settings-save-btn')).toBeVisible();

    // 8. Return to Business Dashboard
    await page.goto('/business-dashboard');
    await expect(page).toHaveURL(/.*business/);

    // 9. Verify Net Financial Position is now verified
    const updatedNetCard = page.locator('.portal-card, .metric-card, .stat-card').filter({ hasText: /Net Financial Position/i });
    await expect(updatedNetCard).toContainText(/Net Positive Assets|₹3,00,000/i);
    await expect(updatedNetCard).not.toContainText('Liabilities Not Configured');
  });
});

