import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { useFinanceData } from '../hooks/useFinanceData';
import StudentDashboard from '../pages/StudentDashboard/StudentDashboard';
import BusinessDashboard from '../pages/BusinessDashboard/BusinessDashboard';
import TechDashboard from '../pages/TechDashboard/TechDashboard';
import Features from '../pages/Features/Features';

// In-memory mock for localStorage in test environment
const storageMap = new Map();
const mockLocalStorage = {
  getItem: (key) => storageMap.get(key) || null,
  setItem: (key, val) => storageMap.set(key, String(val)),
  removeItem: (key) => storageMap.delete(key),
  clear: () => storageMap.clear()
};
globalThis.localStorage = mockLocalStorage;

function renderWithFinanceHook() {
  let hookApi = null;

  function Harness() {
    const finance = useFinanceData();
    hookApi = finance;

    if (!finance.user) {
      return <div data-testid="logged-out">Logged Out</div>;
    }

    if (finance.user.userType === 'student') {
      return (
        <StudentDashboard
          data={finance.studentData}
          user={finance.user}
          financialData={finance.financialData}
          onAddInvestment={finance.addInvestment}
          onUpdateInvestment={finance.updateInvestment}
          onDeleteInvestment={finance.deleteInvestment}
          onAddGoal={finance.addGoal}
          onUpdateGoal={finance.updateGoal}
          onDeleteGoal={finance.deleteGoal}
          onUpdateMonthlySavings={finance.updateMonthlySavings}
          onUpdateTargetAllocations={finance.updateTargetAllocations}
        />
      );
    }

    if (finance.user.userType === 'business') {
      return (
        <BusinessDashboard
          data={finance.businessData}
          user={finance.user}
          financialData={finance.financialData}
          onAddInvestment={finance.addInvestment}
          onUpdateInvestment={finance.updateInvestment}
          onDeleteInvestment={finance.deleteInvestment}
          onAddGoal={finance.addGoal}
          onUpdateGoal={finance.updateGoal}
          onDeleteGoal={finance.deleteGoal}
          onUpdateMonthlySavings={finance.updateMonthlySavings}
          onUpdateTargetAllocations={finance.updateTargetAllocations}
        />
      );
    }

    if (finance.user.userType === 'tech') {
      return (
        <TechDashboard
          data={finance.techData}
          user={finance.user}
          financialData={finance.financialData}
          onAddInvestment={finance.addInvestment}
          onUpdateInvestment={finance.updateInvestment}
          onDeleteInvestment={finance.deleteInvestment}
          onAddGoal={finance.addGoal}
          onUpdateGoal={finance.updateGoal}
          onDeleteGoal={finance.deleteGoal}
          onUpdateMonthlySavings={finance.updateMonthlySavings}
          onUpdateTargetAllocations={finance.updateTargetAllocations}
        />
      );
    }

    return null;
  }

  const html = renderToString(
    <MemoryRouter>
      <ThemeProvider>
        <Harness />
      </ThemeProvider>
    </MemoryRouter>
  );

  return { html, hookApi };
}

describe('Phase 2.1 — End-to-End Financial Calculation & Dashboard Journey Tests', () => {
  beforeEach(() => {
    storageMap.clear();
  });

  it('Test Case A: Validates exact valuation, allocations, and 16.67% drift through useFinanceData', () => {
    // 10 Stocks @ ₹100 purchase, ₹200 current -> Invested: ₹1,000, Current: ₹2,000
    // 10 Bonds @ ₹100 purchase, ₹100 current -> Invested: ₹1,000, Current: ₹1,000
    // Target: 50% Stocks, 50% Bonds
    const testUser = {
      id: 'usr-test-case-a',
      name: 'Rohan Sharma',
      email: 'rohan.sharma@example.com',
      userType: 'student',
      isDemo: false
    };

    const financialData = {
      commonProfile: { currency: 'INR' },
      studentProfile: {
        monthlyIncome: 50000,
        monthlySavings: 10000
      },
      investments: [
        {
          id: 'inv-case-a-stocks',
          name: 'Nifty 50 Index Fund',
          type: 'Stocks',
          valuationMethod: 'quantity_price',
          quantity: 10,
          purchasePrice: 100,
          currentPrice: 200,
          targetAllocation: 50
        },
        {
          id: 'inv-case-a-bonds',
          name: 'Government Sovereign Bond',
          type: 'Bonds',
          valuationMethod: 'quantity_price',
          quantity: 10,
          purchasePrice: 100,
          currentPrice: 100,
          targetAllocation: 50
        }
      ],
      targetAllocations: { 'Stocks': 50, 'Bonds': 50 }
    };

    localStorage.setItem('finsight_user', JSON.stringify(testUser));
    localStorage.setItem('finsight_financial_data', JSON.stringify({
      [testUser.id]: financialData,
      [testUser.email]: financialData
    }));

    const { html, hookApi } = renderWithFinanceHook();

    // 1. Portfolio value: ₹3,000
    expect(hookApi.studentData.portfolioRawValue).toBe(3000);
    expect(hookApi.studentData.portfolioValue).toBe('₹3,000');
    expect(html).toContain('₹3,000');

    // 2. Performance: Invested ₹2,000, Current ₹3,000 -> +50.0%
    expect(hookApi.studentData.performance).toBe('+50.0%');
    expect(html).toContain('+50.0%');

    // 3. Allocations: Stocks 66.67%, Bonds 33.33%
    const allocs = hookApi.studentData.allocations;
    expect(allocs).toHaveLength(2);
    const stockAlloc = allocs.find(a => a.name === 'Stocks');
    const bondAlloc = allocs.find(a => a.name === 'Bonds');
    expect(stockAlloc.percentage).toBe(66.67);
    expect(bondAlloc.percentage).toBe(33.33);

    // 4. Allocation Drift: 0.5 * (|66.67 - 50| + |33.33 - 50|) = 16.67 percentage points
    expect(hookApi.studentData.allocationDrift).toBe('16.67%');
    expect(hookApi.studentData.driftConfigured).toBe(true);
    expect(html).toContain('16.67%');
  });

  it('Student Journey: Distinguishes missing savings vs explicit 0 savings rate', () => {
    const studentUser = {
      id: 'usr-student-savings',
      name: 'Aditi Rao',
      email: 'aditi.rao@example.com',
      userType: 'student',
      isDemo: false
    };

    // Case 1: Missing monthly savings
    const dataMissingSavings = {
      commonProfile: { currency: 'INR' },
      studentProfile: {
        monthlyIncome: 30000,
        monthlySavings: null
      },
      investments: []
    };

    localStorage.setItem('finsight_user', JSON.stringify(studentUser));
    localStorage.setItem('finsight_financial_data', JSON.stringify({
      [studentUser.id]: dataMissingSavings,
      [studentUser.email]: dataMissingSavings
    }));

    const r1 = renderWithFinanceHook();
    expect(r1.hookApi.studentData.savingsRate.isCalculated).toBe(false);
    expect(r1.hookApi.studentData.savingsRate.formatted).toBe('Not configured');
    expect(r1.html).toContain('Not configured');
    expect(r1.html).not.toContain('0.0% Savings');

    // Case 2: Explicit 0 monthly savings
    r1.hookApi.updateMonthlySavings(0);
    const r2 = renderWithFinanceHook();
    expect(r2.hookApi.studentData.savingsRate.isCalculated).toBe(true);
    expect(r2.hookApi.studentData.savingsRate.rate).toBe(0);
    expect(r2.hookApi.studentData.savingsRate.formatted).toBe('0.0%');
    expect(r2.html).toContain('0.0%');

    // Case 3: Positive savings (₹5,000 / ₹30,000 = 16.67%)
    r1.hookApi.updateMonthlySavings(5000);
    const r3 = renderWithFinanceHook();
    expect(r3.hookApi.studentData.savingsRate.isCalculated).toBe(true);
    expect(r3.hookApi.studentData.savingsRate.rate).toBe(16.67);
    expect(r3.hookApi.studentData.savingsRate.formatted).toBe('16.67%');
    expect(r3.html).toContain('16.67%');
  });

  it('Business Journey: Preserves unverified status for missing liabilities and verifies upon configuration', () => {
    const bizUser = {
      id: 'usr-business-liab',
      name: 'Apex Corp',
      email: 'treasury@apexcorp.in',
      userType: 'business',
      isDemo: false
    };

    // Case 1: Unconfigured liabilities (null)
    const bizDataUnconfigured = {
      commonProfile: { currency: 'INR' },
      businessProfile: {
        businessName: 'Apex Corp',
        cashReserves: 2500000,
        monthlyOperatingExpenses: 500000,
        shortTermLiabilities: null,
        longTermLiabilities: null
      },
      investments: [
        {
          id: 'inv-biz-1',
          name: 'Treasury Bills',
          type: 'Bonds',
          investedAmount: 5000000,
          currentValue: 5000000
        }
      ]
    };

    localStorage.setItem('finsight_user', JSON.stringify(bizUser));
    localStorage.setItem('finsight_financial_data', JSON.stringify({
      [bizUser.id]: bizDataUnconfigured,
      [bizUser.email]: bizDataUnconfigured
    }));

    const r1 = renderWithFinanceHook();
    expect(r1.hookApi.businessData.isNetPositionVerified).toBe(false);
    expect(r1.hookApi.businessData.netFinancialPosition.badgeText).toBe('Liabilities Not Configured');
    expect(r1.html).toContain('Liabilities Not Configured');

    // Runway = 2,500,000 / 500,000 = 5.0 months
    expect(r1.hookApi.businessData.cashRunway.runwayMonths).toBe(5.0);
    expect(r1.hookApi.businessData.cashRunway.formatted).toBe('5.0 months');

    // Case 2: Configured liabilities (₹5,00,000 short term, ₹10,00,000 long term)
    const bizDataVerified = {
      ...bizDataUnconfigured,
      businessProfile: {
        ...bizDataUnconfigured.businessProfile,
        shortTermLiabilities: 500000,
        longTermLiabilities: 1000000
      }
    };
    localStorage.setItem('finsight_financial_data', JSON.stringify({
      [bizUser.id]: bizDataVerified,
      [bizUser.email]: bizDataVerified
    }));

    const r2 = renderWithFinanceHook();
    expect(r2.hookApi.businessData.isNetPositionVerified).toBe(true);
    expect(r2.hookApi.businessData.netFinancialPosition.status).toBe('verified');
    // Total assets: 50L + 25L = 75L. Liabilities: 5L + 10L = 15L. Net position: 60L.
    expect(r2.hookApi.businessData.netFinancialPosition.netPosition).toBe(6000000);
    expect(r2.hookApi.businessData.netFinancialPosition.formatted).toBe('₹60,00,000');
    expect(r2.html).toContain('Net Positive Assets');
  });

  it('Tech Enterprise Journey: Renders Technology Expenditure Breakdown table and calculates accurate sector exposure', () => {
    const techUser = {
      id: 'usr-tech-enterprise',
      name: 'CloudScale Technologies',
      email: 'finance@cloudscale.io',
      userType: 'tech',
      isDemo: false
    };

    const techData = {
      commonProfile: { currency: 'INR' },
      techProfile: {
        organizationName: 'CloudScale Technologies',
        annualTechBudget: 12000000, // 1.2 Cr annual budget
        spendingBreakdown: {
          cloudInfrastructure: 500000,
          softwareLicensing: 200000,
          cybersecurity: 100000
        }
      },
      investments: [
        {
          id: 'inv-tech-1',
          name: 'NVIDIA AI Units',
          type: 'Stocks',
          sector: 'Technology',
          investedAmount: 4000000,
          currentValue: 6000000
        },
        {
          id: 'inv-tech-2',
          name: 'Commercial Realty Trust',
          type: 'Real Estate',
          sector: 'Real Estate',
          investedAmount: 4000000,
          currentValue: 4000000
        }
      ]
    };

    localStorage.setItem('finsight_user', JSON.stringify(techUser));
    localStorage.setItem('finsight_financial_data', JSON.stringify({
      [techUser.id]: techData,
      [techUser.email]: techData
    }));

    const { html, hookApi } = renderWithFinanceHook();

    // 1. Monthly Tech Expenditure is sum of breakdown items: 5L + 2L + 1L = 8L
    expect(hookApi.techData.monthlyTechExpenditureRaw).toBe(800000);
    expect(hookApi.techData.monthlyTechExpenditure).toBe('₹8,00,000');

    // 2. Annualized Run-Rate: 8L * 12 = 96L. Budget: 120L -> Utilization = 80.0%
    expect(hookApi.techData.annualizedSpendingRaw).toBe(9600000);
    expect(hookApi.techData.budgetUtilization.percentage).toBe(80.0);
    expect(hookApi.techData.budgetUtilization.status).toBe('on_track');
    expect(html).toContain('80.0%');
    expect(html).toContain('Annualized Run-Rate');

    // 3. Spending breakdown items rendered in HTML table
    expect(hookApi.techData.spendingBreakdownItems).toHaveLength(3);
    expect(html).toContain('Technology Expenditure Breakdown');
    expect(html).toContain('Cloud Infrastructure');
    expect(html).toContain('Software &amp; Licensing');
    expect(html).toContain('Cybersecurity');
    // Percentage split: 5L / 8L = 62.5%, 2L / 8L = 25.0%, 1L / 8L = 12.5%
    expect(html).toContain('62.5%');
    expect(html).toContain('25.0%');
    expect(html).toContain('12.5%');

    // 4. Technology Sector Exposure: 60L tech / 100L total = 60% (Realty is NOT counted as tech)
    expect(hookApi.techData.techSectorExposure).toBe('60%');
    expect(html).toContain('60%');
  });

  it('Features Page: Confirms View Market Ratings button is absent and Explore FinSight is the primary CTA', () => {
    const html = renderToString(
      <MemoryRouter>
        <ThemeProvider>
          <Features />
        </ThemeProvider>
      </MemoryRouter>
    );

    // Primary CTA is present
    expect(html).toContain('Explore FinSight');
    // Deprecated View Market Ratings button is completely absent
    expect(html).not.toContain('View Market Ratings');
    expect(html).not.toContain('/ratings');
  });
});
