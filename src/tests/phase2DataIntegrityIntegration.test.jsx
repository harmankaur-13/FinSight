import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { useFinanceData, normalizeFinancialData } from '../hooks/useFinanceData';
import StudentDashboard from '../pages/StudentDashboard/StudentDashboard';
import BusinessDashboard from '../pages/BusinessDashboard/BusinessDashboard';
import TechDashboard from '../pages/TechDashboard/TechDashboard';
import {
  formatCurrency,
  getCurrencySymbol,
  calculateInvestmentValuation,
  calculateTotalInvested,
  calculatePortfolioValue,
  calculateHoldings,
  calculateCashRunway,
  calculateBudgetUtilization,
  calculateSavingsRate,
  calculateNetFinancialPosition
} from '../utils/financialCalculations';

// In-memory localStorage mock for Node test environment
const storageMap = new Map();
const mockLocalStorage = {
  getItem: (key) => storageMap.get(key) || null,
  setItem: (key, val) => storageMap.set(key, String(val)),
  removeItem: (key) => storageMap.delete(key),
  clear: () => storageMap.clear()
};
globalThis.localStorage = mockLocalStorage;

function renderWithFinanceHook(onCapture = null) {
  let hookApi = null;

  function Harness() {
    const finance = useFinanceData();
    hookApi = finance;
    if (onCapture) onCapture(finance);

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
          onUpdateTargetAllocations={finance.updateTargetAllocations}
        />
      );
    }

    return <div>Unknown Persona</div>;
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

describe('Phase 2 — Complete Financial Onboarding & Dynamic Dashboard Integration', () => {
  beforeEach(() => {
    storageMap.clear();
  });

  it('calculates student savings rate dynamically from monthly savings and monthly income', () => {
    const studentUser = {
      id: 'usr_student_phase2',
      name: 'Aarav Sharma',
      email: 'aarav@university.edu',
      userType: 'student',
      isDemo: false,
      isLoggedIn: true
    };
    const studentFin = normalizeFinancialData({
      monthlySavings: 3500,
      investments: [],
      goals: [],
      studentProfile: {
        educationLevel: 'Undergraduate',
        incomeSource: 'Allowance',
        monthlyIncome: 20000,
        monthlyExpenses: 12000,
        monthlySavings: 3500,
        existingSavings: 15000
      }
    });

    storageMap.set('finsight_user', JSON.stringify(studentUser));
    storageMap.set('finsight_financial_data', JSON.stringify({
      [studentUser.id]: studentFin,
      [studentUser.email]: studentFin
    }));

    let captured = null;
    const { html } = renderWithFinanceHook((api) => { captured = api; });

    // Verify calculated student data
    expect(captured.studentData.savingsRate.rate).toBe(17.5);
    expect(captured.studentData.monthlyIncomeRaw).toBe(20000);
    expect(captured.studentData.monthlyExpensesRaw).toBe(12000);
    expect(captured.studentData.missingFields).toEqual([]);

    // Verify UI reflects actual calculated values
    expect(html).toContain('17.5%');
    expect(html).toContain('Savings Rate');
    expect(html).toContain('₹3,500');
    // Verify no missing fields banner is rendered
    expect(html).not.toContain('Profile Information Missing');
  });

  it('renders actionable missing fields banner when essential student parameters are missing', () => {
    const studentUser = {
      id: 'usr_student_unconfigured',
      name: 'Priya Patel',
      email: 'priya@college.edu',
      userType: 'student',
      isDemo: false,
      isLoggedIn: true
    };
    const studentFin = normalizeFinancialData({
      monthlySavings: null,
      investments: [],
      goals: [],
      studentProfile: {
        monthlyIncome: null,
        monthlyExpenses: null
      }
    });

    storageMap.set('finsight_user', JSON.stringify(studentUser));
    storageMap.set('finsight_financial_data', JSON.stringify({
      [studentUser.id]: studentFin,
      [studentUser.email]: studentFin
    }));

    let captured = null;
    const { html } = renderWithFinanceHook((api) => { captured = api; });

    const missingLabels = captured.studentData.missingFields.map((m) => m.label);
    expect(missingLabels).toContain('Monthly Income');
    expect(missingLabels).toContain('Monthly Expenses');
    expect(captured.studentData.savingsRate.rate).toBeNull();

    // Verify UI displays actionable banner with deep link to settings
    expect(html).toContain('Profile Information Missing');
    expect(html).toContain('Monthly Income');
    expect(html).toContain('/settings?tab=financial');
  });

  it('calculates business cash runway and net financial position dynamically', () => {
    const businessUser = {
      id: 'usr_biz_phase2',
      name: 'Rohan Mehra',
      email: 'rohan@enterprise.co',
      userType: 'business',
      isDemo: false,
      isLoggedIn: true
    };
    const businessFin = normalizeFinancialData({
      investments: [
        {
          id: 'inv_1',
          name: 'HDFC Overnight Liquid Treasury',
          type: 'Liquid Cash & Equivalents',
          valuationMethod: 'manual',
          investedAmount: 2000000,
          currentValue: 2050000,
          liquidityClassification: 'liquid_operating'
        }
      ],
      businessProfile: {
        businessName: 'Nexus Global Logistics Pvt Ltd',
        industry: 'Supply Chain & Logistics',
        businessSize: 'Growth (11-50)',
        cashReserves: 5000000,
        monthlyOperatingExpenses: 1000000,
        shortTermLiabilities: 400000,
        longTermLiabilities: 1200000,
        annualRevenue: 30000000
      }
    });

    storageMap.set('finsight_user', JSON.stringify(businessUser));
    storageMap.set('finsight_financial_data', JSON.stringify({
      [businessUser.id]: businessFin,
      [businessUser.email]: businessFin
    }));

    let captured = null;
    const { html } = renderWithFinanceHook((api) => { captured = api; });

    // Cash Runway = 5,000,000 / 1,000,000 = 5.0 months (caution status: 3-6 months)
    expect(captured.businessData.cashRunway.runwayMonths).toBe(5);
    expect(captured.businessData.cashRunway.status).toBe('caution');

    // Total Treasury Assets = 2,050,000 (investments) + 5,000,000 (cash reserves) = 7,050,000
    expect(captured.businessData.totalTreasuryAssetsRaw).toBe(7050000);

    // Net Financial Position = Total Assets (7,050,000) - Liabilities (400,000 + 1,200,000) = 5,450,000
    expect(captured.businessData.netFinancialPosition.netPosition).toBe(5450000);

    // Verify UI reflects these metrics
    expect(html).toContain('5.0 months');
    expect(html).toContain('Caution Runway');
    expect(html).toContain('Nexus Global Logistics Pvt Ltd');
    expect(html).not.toContain('Complete Your Financial Profile');
  });

  it('calculates tech enterprise budget utilization rate and monitors spending burn', () => {
    const techUser = {
      id: 'usr_tech_phase2',
      name: 'Ananya Deshmukh',
      email: 'ananya@hyperscale.io',
      userType: 'tech',
      isDemo: false,
      isLoggedIn: true
    };
    const techFin = normalizeFinancialData({
      investments: [],
      techProfile: {
        organizationName: 'HyperScale Systems',
        techIndustry: 'Enterprise Software / SaaS',
        annualTechBudget: 24000000,
        monthlyTechExpenditure: 1800000,
        spendingBreakdown: {
          cloudCompute: 1100000,
          saasTools: 450000,
          hardware: 150000,
          rnd: 100000
        }
      }
    });

    storageMap.set('finsight_user', JSON.stringify(techUser));
    storageMap.set('finsight_financial_data', JSON.stringify({
      [techUser.id]: techFin,
      [techUser.email]: techFin
    }));

    let captured = null;
    const { html } = renderWithFinanceHook((api) => { captured = api; });

    // Annualized Spend = 1,800,000 * 12 = 21,600,000
    // Utilization Rate = (21,600,000 / 24,000,000) * 100 = 90.0%
    expect(captured.techData.budgetUtilization.percentage).toBe(90);
    expect(captured.techData.budgetUtilization.status).toBe('warning');

    // Verify UI displays formatted budget metrics and status badges
    expect(html).toContain('90.0%');
    expect(html).toContain('Approaching Limit');
    expect(html).toContain('HyperScale Systems');
    expect(html).not.toContain('Complete Your Financial Profile');
  });

  it('precisely computes investment valuations across Method A (shares x price) and Method B (manual)', () => {
    // Method A: Units * Price
    const invMethodA = {
      id: 'inv_a',
      name: 'NVIDIA Corp',
      type: 'Stocks',
      valuationMethod: 'quantity_price',
      quantity: 50,
      purchasePrice: 1000,
      currentPrice: 1500
    };
    const valA = calculateInvestmentValuation(invMethodA);
    expect(valA.investedAmount).toBe(50000);
    expect(valA.currentValue).toBe(75000);
    expect(valA.profitLoss).toBe(25000);
    expect(valA.returnPercentage).toBe(50);

    // Method B: Manual valuation
    const invMethodB = {
      id: 'inv_b',
      name: 'Vanguard Total Bond Market',
      type: 'Bonds',
      valuationMethod: 'manual',
      investedAmount: 100000,
      currentValue: 120000
    };
    const valB = calculateInvestmentValuation(invMethodB);
    expect(valB.investedAmount).toBe(100000);
    expect(valB.currentValue).toBe(120000);
    expect(valB.profitLoss).toBe(20000);
    expect(valB.returnPercentage).toBe(20);

    // Combined portfolio metrics
    const portfolio = [invMethodA, invMethodB];
    const totalInvested = calculateTotalInvested(portfolio);
    const totalCurrent = calculatePortfolioValue(portfolio);
    const holdings = calculateHoldings(portfolio);

    expect(totalInvested).toBe(150000);
    expect(totalCurrent).toBe(195000);
    expect(holdings).toHaveLength(2);

    expect(holdings[0].change).toBe('+50.0%');
    expect(holdings[0].allocation).toBe('38.5%');

    expect(holdings[1].change).toBe('+20.0%');
    expect(holdings[1].allocation).toBe('61.5%');
  });

  it('updates profile via Settings and immediately recalculates dashboard metrics without reload', () => {
    const user = {
      id: 'usr_settings_sync',
      name: 'Vikram Joshi',
      email: 'vikram@corp.in',
      userType: 'business',
      isDemo: false,
      isLoggedIn: true
    };
    const initialFin = normalizeFinancialData({
      investments: [],
      businessProfile: {
        businessName: '',
        cashReserves: null,
        monthlyOperatingExpenses: null
      }
    });

    storageMap.set('finsight_user', JSON.stringify(user));
    storageMap.set('finsight_financial_data', JSON.stringify({
      [user.id]: initialFin,
      [user.email]: initialFin
    }));

    const initial = renderWithFinanceHook();

    // Initial state: Missing fields
    const missingLabels = initial.hookApi.businessData.missingFields.map((m) => m.label);
    expect(missingLabels).toContain('Cash Reserves');
    expect(missingLabels).toContain('Monthly Operating Expenses');
    expect(initial.hookApi.businessData.cashRunway.isCalculated).toBe(false);

    // Now execute updateProfile as Settings would dispatch
    const updatedFin = normalizeFinancialData({
      ...initialFin,
      businessProfile: {
        businessName: 'Joshi Enterprises Ltd',
        industry: 'Manufacturing',
        businessSize: 'Medium (51-200)',
        cashReserves: 9000000,
        monthlyOperatingExpenses: 1500000,
        shortTermLiabilities: 600000,
        longTermLiabilities: 2400000,
        annualRevenue: 50000000
      }
    });

    initial.hookApi.updateProfile({
      name: 'Vikram Joshi',
      email: 'vikram@corp.in',
      userType: 'business',
      financialData: updatedFin
    });

    // Re-render and check that updated financial profile is loaded
    const updated = renderWithFinanceHook();

    expect(updated.hookApi.businessData.cashReservesRaw).toBe(9000000);
    expect(updated.hookApi.businessData.monthlyOperatingExpensesRaw).toBe(1500000);
    expect(updated.hookApi.businessData.cashRunway.runwayMonths).toBe(6);
    expect(updated.hookApi.businessData.cashRunway.status).toBe('healthy');
    expect(updated.hookApi.businessData.netFinancialPosition.netPosition).toBe(6000000); // 9M - (0.6M + 2.4M) = 6M
    expect(updated.hookApi.businessData.missingFields).toEqual([]);
    expect(updated.html).toContain('Joshi Enterprises Ltd');
    expect(updated.html).not.toContain('Complete Your Financial Profile');
  });

  it('supports multi-currency formatting accurately for INR, USD, EUR, and GBP', () => {
    expect(formatCurrency(1234567, 'INR')).toBe('₹12,34,567');
    expect(formatCurrency(1234567, 'USD')).toBe('$1,234,567');
    expect(formatCurrency(1234567, 'EUR')).toBe('€1,234,567');
    expect(formatCurrency(1234567, 'GBP')).toBe('£1,234,567');

    expect(getCurrencySymbol('INR')).toBe('₹');
    expect(getCurrencySymbol('USD')).toBe('$');
    expect(getCurrencySymbol('EUR')).toBe('€');
    expect(getCurrencySymbol('GBP')).toBe('£');
  });

  it('validates safe edge conditions for cash runway and budget utilization', () => {
    // Zero or negative expenses
    expect(calculateCashRunway(5000000, 0)).toEqual({
      runwayMonths: null,
      formatted: 'N/A (Missing or zero expenses)',
      status: 'unknown',
      isCalculated: false
    });
    expect(calculateCashRunway(5000000, -5000)).toEqual({
      runwayMonths: null,
      formatted: 'N/A (Missing or zero expenses)',
      status: 'unknown',
      isCalculated: false
    });
    // Zero or negative budget
    expect(calculateBudgetUtilization(150000, 0)).toEqual({
      percentage: null,
      formatted: 'N/A (Budget not configured)',
      status: 'unknown',
      isCalculated: false
    });
    // Critical runway (< 3 months)
    expect(calculateCashRunway(200000, 100000)).toEqual({
      runwayMonths: 2.0,
      formatted: '2.0 months',
      status: 'critical',
      isCalculated: true
    });
    // Healthy runway (>= 6 months)
    expect(calculateCashRunway(8000000, 1000000)).toEqual({
      runwayMonths: 8.0,
      formatted: '8.0 months',
      status: 'healthy',
      isCalculated: true
    });
  });
});
