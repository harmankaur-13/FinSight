import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { useFinanceData } from '../hooks/useFinanceData';
import StudentDashboard from '../pages/StudentDashboard/StudentDashboard';
import BusinessDashboard from '../pages/BusinessDashboard/BusinessDashboard';
import TechDashboard from '../pages/TechDashboard/TechDashboard';
import PortfolioChart from '../components/PortfolioChart';
import EducationCard, { getStudiedResourcesKey } from '../components/EducationCard';
import { STUDENT_DATA } from '../data/mockData';
import { getUserValueHistoryKey, saveValueSnapshot, getStoredValueHistory } from '../utils/valueHistory';
import {
  calculatePortfolioValue,
  calculateAssetAllocations,
  calculateAllocationDrift,
  resolveTargetAllocations
} from '../utils/financialCalculations';

// Setup in-memory mock for localStorage in Node test environment
const storageMap = new Map();
const mockLocalStorage = {
  getItem: (key) => storageMap.get(key) || null,
  setItem: (key, val) => storageMap.set(key, String(val)),
  removeItem: (key) => storageMap.delete(key),
  clear: () => storageMap.clear()
};
globalThis.localStorage = mockLocalStorage;

/**
 * End-to-end integration test harness:
 * Mounts the real useFinanceData hook and renders actual Dashboards to HTML
 */
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

describe('Real-User Data Flow, Target Allocation & Isolation Integration Tests', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.restoreAllMocks();
  });

  // ---------------------------------------------------------------------------
  // 1. New student with no investments
  // ---------------------------------------------------------------------------
  it('1. New student data flow: displays ₹0 portfolio, 0% mastery, no demo fallback', () => {
    // Initialize signup via hook
    const { hookApi } = renderWithFinanceHook();
    hookApi.signup('Kavita Sharma', 'kavita@student.org', 'password123');

    // Re-render dashboard after signup
    const { html, hookApi: activeHook } = renderWithFinanceHook();

    expect(activeHook.user.email).toBe('kavita@student.org');
    expect(activeHook.user.userType).toBe('student');

    // Must show ₹0, NOT ₹25,400 demo data
    expect(html).toContain('₹0');
    expect(html).not.toContain('₹25,400');
    expect(html).not.toContain('Nifty 50 Index Fund');

    // Must show 0 completed lessons (0%)
    expect(html).toContain('0 of 12 Studied');
    expect(html).toContain('0% Progress');

    // Must show empty goals and unconfigured drift
    expect(html).toContain('No financial goals added yet');
    expect(html).toContain('Not configured');
  });

  // ---------------------------------------------------------------------------
  // 2. Student with multiple investments & mutations
  // ---------------------------------------------------------------------------
  it('2. Student mutations: adding, updating, and deleting investments updates dashboard metrics', () => {
    const { hookApi } = renderWithFinanceHook();
    hookApi.signup('Amit Patel', 'amit@student.org', 'secret123');

    // Re-render to establish active user session
    let r0 = renderWithFinanceHook();

    // Step A: Add first investment
    r0.hookApi.addInvestment({
      id: 'inv-1',
      name: 'Reliance Industries',
      type: 'Stocks',
      investedAmount: 10000,
      currentValue: 12000
    });

    let render1 = renderWithFinanceHook();
    expect(render1.hookApi.financialData.investments[0].name).toBe('Reliance Industries');
    expect(render1.html).toContain('₹12,000');
    expect(render1.hookApi.studentData.portfolioRawValue).toBe(12000);

    // Step B: Add second investment
    render1.hookApi.addInvestment({
      id: 'inv-2',
      name: 'Government 10Y Bond',
      type: 'Bonds',
      investedAmount: 8000,
      currentValue: 8000
    });

    let render2 = renderWithFinanceHook();
    expect(render2.hookApi.financialData.investments[1].name).toBe('Government 10Y Bond');
    expect(render2.html).toContain('₹20,000'); // 12000 + 8000
    expect(render2.hookApi.studentData.portfolioRawValue).toBe(20000);

    // Step C: Update investment value
    render2.hookApi.updateInvestment('inv-1', { currentValue: 15000 });
    let render3 = renderWithFinanceHook();
    expect(render3.html).toContain('₹23,000'); // 15000 + 8000
    expect(render3.hookApi.studentData.portfolioRawValue).toBe(23000);

    // Step D: Delete an investment
    render3.hookApi.deleteInvestment('inv-2');
    let render4 = renderWithFinanceHook();
    expect(render4.hookApi.financialData.investments.find(i => i.id === 'inv-2')).toBeUndefined();
    expect(render4.html).toContain('₹15,000');
    expect(render4.hookApi.studentData.portfolioRawValue).toBe(15000);
  });

  // ---------------------------------------------------------------------------
  // 3. Updating monthly savings
  // ---------------------------------------------------------------------------
  it('3. Monthly savings mutation: updates saved contribution and propagates to student dashboard', () => {
    const { hookApi } = renderWithFinanceHook();
    hookApi.signup('Priya Nair', 'priya@student.org', 'secret123');

    // Initially unconfigured
    let r1 = renderWithFinanceHook();
    expect(r1.html).toContain('Not provided');

    // Mutate monthly savings
    r1.hookApi.updateMonthlySavings(7500);

    let r2 = renderWithFinanceHook();
    expect(r2.html).toContain('₹7,500');
    expect(r2.hookApi.financialData.monthlySavings).toBe(7500);
  });

  // ---------------------------------------------------------------------------
  // 4. Business user with actual holdings & missing data handling
  // ---------------------------------------------------------------------------
  it('4. Business user data flow: calculates actual holdings and shows unavailable for missing historical metrics', () => {
    const { hookApi } = renderWithFinanceHook();
    hookApi.signup('Apex Corp', 'treasury@apexcorp-business.com', 'bizpass123');
    hookApi.updateProfile({ userType: 'business' });

    let r1 = renderWithFinanceHook();
    expect(r1.hookApi.user.userType).toBe('business');
    expect(r1.html).toContain('₹0');
    expect(r1.html).not.toContain('₹18,42,000'); // No demo fallback
    expect(r1.html).toContain('Historical data unavailable');

    // Add corporate holdings
    r1.hookApi.addInvestment({
      id: 'biz-inv-1',
      name: 'Infosys Corp Holding',
      type: 'Stocks',
      investedAmount: 500000,
      currentValue: 600000
    });
    r1.hookApi.addInvestment({
      id: 'biz-inv-2',
      name: 'HDFC Corporate Bond',
      type: 'Bonds',
      investedAmount: 400000,
      currentValue: 400000
    });

    let r2 = renderWithFinanceHook();
    expect(r2.html).toContain('Infosys Corp Holding');
    expect(r2.html).toContain('HDFC Corporate Bond');
    expect(r2.html).toContain('₹10,00,000'); // 6L + 4L
    expect(r2.hookApi.businessData.portfolioRawValue).toBe(1000000);

    // Risk metrics must display unavailable state when historical data is absent
    expect(r2.hookApi.businessData.riskMetrics.portfolioBeta).toBe('Historical data unavailable');
    expect(r2.hookApi.businessData.riskMetrics.sharpeRatio).toBe('Historical data unavailable');
    expect(r2.hookApi.businessData.riskMetrics.annualizedVolatility).toBe('Historical data unavailable');
    // Stress test is clearly identified as a simulation
    expect(r2.hookApi.businessData.riskMetrics.stressTestLoss).toContain('Simulated 8% Drawdown');
  });

  // ---------------------------------------------------------------------------
  // 5. Tech user with actual holdings & sector exposure
  // ---------------------------------------------------------------------------
  it('5. Tech user data flow: derives sector exposure from holdings and marks projections as simulated', () => {
    const { hookApi } = renderWithFinanceHook();
    hookApi.signup('DeepCloud Systems', 'ops@deepcloud-tech.com', 'techpass123');
    hookApi.updateProfile({ userType: 'tech' });

    let r1 = renderWithFinanceHook();
    expect(r1.hookApi.user.userType).toBe('tech');
    expect(r1.html).toContain('₹0');
    expect(r1.html).not.toContain('₹4.82 Cr'); // No demo fallback

    // Add tech and non-tech assets
    r1.hookApi.addInvestment({
      id: 'tech-inv-1',
      name: 'Nvidia AI Server Compute',
      type: 'Stocks',
      sector: 'Technology',
      investedAmount: 6000000,
      currentValue: 8000000
    });
    r1.hookApi.addInvestment({
      id: 'tech-inv-2',
      name: 'Government Treasury Debt',
      type: 'Bonds',
      sector: 'Fixed Income',
      investedAmount: 2000000,
      currentValue: 2000000
    });

    let r2 = renderWithFinanceHook();
    expect(r2.html).toContain('₹1,00,00,000'); // 80L + 20L = 1 Cr
    expect(r2.hookApi.techData.portfolioRawValue).toBe(10000000);

    // Tech sector exposure should be 80L / 100L = 80%
    expect(r2.hookApi.techData.techSectorExposure).toBe('80%');

    // Projections must be explicitly identified as simulated projections
    const projections = r2.hookApi.techData.projections;
    expect(projections[1].status).toBe('Projection');
    expect(projections[1].simulatedGrowth).toContain('Projected');
    expect(r2.hookApi.techData.costLossExposure).toContain('Projected Max Drawdown');
  });

  // ---------------------------------------------------------------------------
  // 6. User account switching & data isolation
  // ---------------------------------------------------------------------------
  it('6. Account switching: user A and user B have strictly isolated portfolios and learning progress', () => {
    const { hookApi } = renderWithFinanceHook();

    // User A signs up and adds holdings
    hookApi.signup('User Alpha', 'alpha@student.org', 'pass1');
    let rA0 = renderWithFinanceHook();
    rA0.hookApi.addInvestment({
      id: 'alpha-inv',
      name: 'Alpha Energy ETF',
      type: 'ETFs',
      investedAmount: 50000,
      currentValue: 50000
    });

    // Mark 3 lessons studied for User A
    const userAKey = getStudiedResourcesKey({ id: rA0.hookApi.user.id });
    mockLocalStorage.setItem(userAKey, JSON.stringify(['res-1', 'res-2', 'res-3']));

    let rA = renderWithFinanceHook();
    expect(rA.hookApi.financialData.investments[0].name).toBe('Alpha Energy ETF');
    expect(rA.html).toContain('₹50,000');
    expect(rA.html).toContain('3 of 12 Studied');

    // Logout User A
    rA.hookApi.logout();
    let rOut = renderWithFinanceHook();
    expect(rOut.html).toContain('Logged Out');

    // User B signs up
    rOut.hookApi.signup('User Beta', 'beta@student.org', 'pass2');
    let rB = renderWithFinanceHook();

    // User B MUST NOT see User A's data or progress
    expect(rB.hookApi.financialData.investments).toHaveLength(0);
    expect(rB.html).not.toContain('₹50,000');
    expect(rB.html).toContain('₹0');
    expect(rB.html).toContain('0 of 12 Studied');

    // User B adds their own unique holding
    rB.hookApi.addInvestment({
      id: 'beta-inv',
      name: 'Beta Healthcare Fund',
      type: 'Mutual Funds',
      investedAmount: 15000,
      currentValue: 18000
    });

    let rB2 = renderWithFinanceHook();
    expect(rB2.hookApi.financialData.investments[0].name).toBe('Beta Healthcare Fund');
    expect(rB2.html).toContain('₹18,000');

    // Switch back: Login as User A
    rB2.hookApi.login('alpha@student.org', 'pass1');
    let rA2 = renderWithFinanceHook();

    // User A's data must be fully preserved and isolated
    expect(rA2.hookApi.financialData.investments[0].name).toBe('Alpha Energy ETF');
    expect(rA2.hookApi.financialData.investments.find(i => i.name === 'Beta Healthcare Fund')).toBeUndefined();
    expect(rA2.html).toContain('₹50,000');
    expect(rA2.html).not.toContain('₹18,000');
    expect(rA2.html).toContain('3 of 12 Studied');
  });

  // ---------------------------------------------------------------------------
  // 7. Target Allocation Architecture
  // ---------------------------------------------------------------------------
  describe('7. Target Allocation Architecture', () => {
    it('uses dedicated targetAllocations object and validates targets total 100%', () => {
      const investments = [
        { id: '1', name: 'Stock 1', type: 'Stocks', currentValue: 10000 }
      ];

      // Targets sum to 100% -> Valid
      const validTargets = { Stocks: 60, Bonds: 25, Crypto: 15 };
      const resolved = resolveTargetAllocations(investments, validTargets);
      expect(resolved).toEqual({ Stocks: 60, Bonds: 25, Crypto: 15 });

      // Calculate allocations: target-only categories (Bonds, Crypto) must be included
      const allocs = calculateAssetAllocations(investments, validTargets);
      expect(allocs).toHaveLength(3);
      expect(allocs.find(a => a.name === 'Stocks').percentage).toBe(100);
      expect(allocs.find(a => a.name === 'Stocks').target).toBe(60);
      expect(allocs.find(a => a.name === 'Bonds').percentage).toBe(0);
      expect(allocs.find(a => a.name === 'Bonds').target).toBe(25);
      expect(allocs.find(a => a.name === 'Crypto').percentage).toBe(0);
      expect(allocs.find(a => a.name === 'Crypto').target).toBe(15);

      // Drift calculation includes target-only categories:
      // 0.5 * (|100 - 60| + |0 - 25| + |0 - 15|) = 0.5 * 80 = 40.0%
      const drift = calculateAllocationDrift(investments, allocs, validTargets);
      expect(drift.isConfigured).toBe(true);
      expect(drift.value).toBe('40.0%');
    });

    it('returns "Not configured" when configured target allocations do not total 100%', () => {
      const investments = [
        { id: '1', name: 'Stock 1', type: 'Stocks', currentValue: 10000 }
      ];
      // Sum = 80% != 100%
      const invalidTargets = { Stocks: 50, Bonds: 30 };
      const drift = calculateAllocationDrift(investments, invalidTargets);
      expect(drift.isConfigured).toBe(false);
      expect(drift.value).toBe('Not configured');
    });

    it('handles zero portfolio value cleanly without division by zero', () => {
      const emptyHoldings = [];
      const targets = { Stocks: 60, Bonds: 40 };
      const drift = calculateAllocationDrift(emptyHoldings, targets);
      expect(drift.isConfigured).toBe(false);
      expect(drift.value).toBe('Not configured');
      expect(drift.raw).toBe(0);
    });

    it('preserves backward compatibility with holdings having inv.targetAllocation', () => {
      const legacyHoldings = [
        { id: '1', name: 'Stock A', type: 'Stocks', currentValue: 6000, targetAllocation: 60 },
        { id: '2', name: 'Stock B', type: 'Stocks', currentValue: 6000, targetAllocation: 60 }, // duplicated target
        { id: '3', name: 'Bond A', type: 'Bonds', currentValue: 4000, targetAllocation: 40 }
      ];
      // Should de-duplicate Stocks target to 60, not 120
      const resolved = resolveTargetAllocations(legacyHoldings, null);
      expect(resolved).toEqual({ Stocks: 60, Bonds: 40 });

      const drift = calculateAllocationDrift(legacyHoldings);
      expect(drift.isConfigured).toBe(true);
      // Total value = 16,000. Stocks = 12,000 (75%). Bonds = 4,000 (25%).
      // Drift: 0.5 * (|75 - 60| + |25 - 40|) = 0.5 * 30 = 15.0%
      expect(drift.value).toBe('15.0%');
    });
  });

  // ---------------------------------------------------------------------------
  // 8. Portfolio Chart Semantics & History Isolation
  // ---------------------------------------------------------------------------
  describe('8. Portfolio Chart Semantics & History Isolation', () => {
    it('shows empty state ("Historical data unavailable") when portfolioValue is 0', () => {
      const user = { id: 'usr_chart_1', email: 'chart1@example.com' };
      const html = renderToString(
        <PortfolioChart portfolioValue={0} user={user} />
      );

      expect(html).toContain('Historical data unavailable');
      expect(html).toContain('Add investments to begin recording dated portfolio snapshots');
    });

    it('identifies chart as simulated projection when fewer than 2 snapshots exist', () => {
      const user = { id: 'usr_chart_2', email: 'chart2@example.com' };
      const html = renderToString(
        <PortfolioChart portfolioValue={50000} user={user} />
      );

      // Fewer than 2 historical points -> must be labeled as projection
      expect(html).toContain('Projection — not actual performance');
      expect(html).toContain('Simulated Growth Horizon');
    });

    it('does not display previous user value when a user portfolio becomes zero', () => {
      const userA = { id: 'usr_a_history', email: 'a@history.com' };
      const userB = { id: 'usr_b_history', email: 'b@history.com' };

      // User A saves snapshots
      const keyA = getUserValueHistoryKey(userA);
      saveValueSnapshot(100000, '2026-01-01', keyA);
      saveValueSnapshot(120000, '2026-02-01', keyA);

      // User B with 0 portfolio renders
      const htmlB = renderToString(
        <PortfolioChart portfolioValue={0} user={userB} />
      );

      expect(htmlB).toContain('Historical data unavailable');
      expect(htmlB).not.toContain('₹1,20,000');
      expect(htmlB).not.toContain('Real Performance History');
    });

    it('reloads correct history when changing users', () => {
      const userA = { id: 'usr_a_hist', email: 'a@hist.com' };
      const userB = { id: 'usr_b_hist', email: 'b@hist.com' };

      const keyA = getUserValueHistoryKey(userA);
      const keyB = getUserValueHistoryKey(userB);

      saveValueSnapshot(50000, '2026-01-01', keyA);
      saveValueSnapshot(60000, '2026-02-01', keyA);

      saveValueSnapshot(200000, '2026-01-01', keyB);
      saveValueSnapshot(250000, '2026-02-01', keyB);

      const histA = getStoredValueHistory(keyA);
      const histB = getStoredValueHistory(keyB);

      expect(histA[1].totalValue).toBe(60000);
      expect(histB[1].totalValue).toBe(250000);
    });
  });

  // ---------------------------------------------------------------------------
  // 9. Learning Progress Isolation
  // ---------------------------------------------------------------------------
  describe('9. Learning Progress Isolation', () => {
    it('demo users retain their demo progress, real users start at 0', () => {
      const demoUser = { isDemo: true, userType: 'student' };
      const realUser = { id: 'usr_real_learn', isDemo: false, userType: 'student' };

      const demoHtml = renderToString(<EducationCard resources={STUDENT_DATA.financialKnowledgeResources} user={demoUser} />);
      const realHtml = renderToString(<EducationCard resources={STUDENT_DATA.financialKnowledgeResources} user={realUser} />);

      // Strip React SSR comments
      const cleanDemo = demoHtml.replace(/<!--.*?-->/g, '');
      const cleanReal = realHtml.replace(/<!--.*?-->/g, '');

      // Demo retains progress
      expect(cleanDemo).toContain('1 of 12 Studied');
      // Real user starts at 0
      expect(cleanReal).toContain('0 of 12 Studied');
    });

    it('progress updates are saved under user-specific storage keys', () => {
      const user1 = { id: 'usr_learn_1', email: 'u1@test.org' };
      const user2 = { id: 'usr_learn_2', email: 'u2@test.org' };

      const key1 = getStudiedResourcesKey(user1);
      const key2 = getStudiedResourcesKey(user2);

      expect(key1).toBe('finsight_studied_resources_usr_learn_1');
      expect(key2).toBe('finsight_studied_resources_usr_learn_2');

      mockLocalStorage.setItem(key1, JSON.stringify(['res-1']));
      mockLocalStorage.setItem(key2, JSON.stringify(['res-2', 'res-3', 'res-4']));

      expect(JSON.parse(mockLocalStorage.getItem(key1))).toEqual(['res-1']);
      expect(JSON.parse(mockLocalStorage.getItem(key2))).toEqual(['res-2', 'res-3', 'res-4']);
    });
  });
});
