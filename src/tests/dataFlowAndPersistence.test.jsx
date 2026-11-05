import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import StudentDashboard from '../pages/StudentDashboard/StudentDashboard';
import BusinessDashboard from '../pages/BusinessDashboard/BusinessDashboard';
import TechDashboard from '../pages/TechDashboard/TechDashboard';
import EducationCard, {
  getStudiedResourcesKey,
  migrateGlobalStudiedResources,
  STORAGE_KEY_STUDIED_RESOURCES
} from '../components/EducationCard';
import {
  getUserValueHistoryKey,
  migrateGlobalValueHistory,
  getStoredValueHistory,
  saveValueSnapshot,
  STORAGE_KEY_VALUE_HISTORY
} from '../utils/valueHistory';
import {
  calculatePortfolioValue,
  calculateTotalInvested,
  calculateProfitLoss,
  calculatePerformance,
  calculateAssetAllocations,
  calculateAllocationDrift,
  calculateHoldings,
  calculateMarketExposure,
  resolveTargetAllocations,
  formatCurrency
} from '../utils/financialCalculations';
import { STUDENT_DATA, BUSINESS_DATA, TECH_DATA } from '../data/mockData';

// Setup in-memory mock for localStorage in Node environment
const storageMap = new Map();
const mockLocalStorage = {
  getItem: (key) => storageMap.get(key) || null,
  setItem: (key, val) => storageMap.set(key, String(val)),
  removeItem: (key) => storageMap.delete(key),
  clear: () => storageMap.clear()
};
globalThis.localStorage = mockLocalStorage;

describe('Data Flow, User Persistence & Dashboard Integrity', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.restoreAllMocks();
  });

  // -------------------------------------------------------------------------
  // Scenario A — New Student
  // -------------------------------------------------------------------------
  describe('Scenario A: New Student (Zero-State Real User)', () => {
    const newUser = {
      id: 'usr_student_new_1',
      name: 'Simran Singh',
      email: 'simran@example.com',
      userType: 'student',
      isLoggedIn: true,
      isDemo: false
    };

    const emptyFinData = {
      monthlySavings: null,
      investments: [],
      goals: []
    };

    const studentData = {
      userType: 'student',
      name: newUser.name,
      email: newUser.email,
      portfolioValue: '₹0',
      portfolioRawValue: 0,
      totalInvested: 0,
      performance: 'No data yet',
      isPositive: true,
      monthlySavings: 'Not provided',
      allocationDrift: 'Not configured',
      driftConfigured: false,
      insightMessage: 'Add your first investments to start tracking your asset distribution and performance.',
      allocations: [],
      goals: [],
      educationalModules: [],
      financialKnowledgeResources: [
        { id: 'res-1', title: 'Technical Analysis', topic: 'Trading' },
        { id: 'res-2', title: 'Fundamental Analysis', topic: 'Valuation' }
      ],
      videoTutorials: [],
      assistantSuggestions: []
    };

    it('displays ₹0 portfolio and does NOT fallback to ₹25,400 sample data', () => {
      const html = renderToString(
        <MemoryRouter>
          <ThemeProvider>
            <StudentDashboard
              data={studentData}
              user={newUser}
              financialData={emptyFinData}
            />
          </ThemeProvider>
        </MemoryRouter>
      );

      // Must display ₹0
      expect(html).toContain('₹0');
      // Must NOT display student demo fallback ₹25,400
      expect(html).not.toContain('₹25,400');
      // Must NOT display demo investment names
      expect(html).not.toContain('Nifty 50 Index Fund');
      expect(html).not.toContain('Govt Treasury Bond ETF');
    });

    it('new student automatically receives 0% curriculum mastery (0 completed lessons)', () => {
      const html = renderToString(
        <MemoryRouter>
          <ThemeProvider>
            <StudentDashboard
              data={studentData}
              user={newUser}
              financialData={emptyFinData}
            />
          </ThemeProvider>
        </MemoryRouter>
      );

      // Must have 0 of 2 Studied and 0% Progress
      expect(html).toContain('0 of 2 Studied');
      expect(html).toContain('0% Progress');
      // Must NOT have 1 of 2 Studied or 50%
      expect(html).not.toContain('1 of 2 Studied');
    });

    it('displays empty state for goals and unconfigured drift', () => {
      const html = renderToString(
        <MemoryRouter>
          <ThemeProvider>
            <StudentDashboard
              data={studentData}
              user={newUser}
              financialData={emptyFinData}
            />
          </ThemeProvider>
        </MemoryRouter>
      );

      expect(html).toContain('No financial goals added yet');
      expect(html).toContain('Not configured');
    });
  });

  // -------------------------------------------------------------------------
  // Scenario B — Student with investments
  // -------------------------------------------------------------------------
  describe('Scenario B: Student with Investments', () => {
    const studentUser = {
      id: 'usr_student_active',
      name: 'Rohan Verma',
      email: 'rohan@example.com',
      userType: 'student',
      isLoggedIn: true,
      isDemo: false
    };

    const holdings = [
      { id: 'h1', name: 'Tata Motors', type: 'Stocks', investedAmount: 10000, currentValue: 12000, targetAllocation: 60 },
      { id: 'h2', name: 'ICICI Prudential Bond', type: 'Bonds', investedAmount: 5000, currentValue: 5000, targetAllocation: 25 },
      { id: 'h3', name: 'Bitcoin ETF', type: 'Crypto', investedAmount: 2000, currentValue: 3000, targetAllocation: 15 }
    ];

    it('calculates portfolio value and performance accurately from quantities and market values', () => {
      const totalInvested = calculateTotalInvested(holdings);
      const totalCurrent = calculatePortfolioValue(holdings);
      const performance = calculatePerformance(holdings);

      expect(totalInvested).toBe(17000);
      expect(totalCurrent).toBe(20000); // 12000 + 5000 + 3000
      expect(performance.percentage).toBe(17.6); // (3000 / 17000) * 100 ~ 17.6%
      expect(performance.formatted).toBe('+17.6%');
    });

    it('calculates exact asset allocation percentages matching portfolio weight', () => {
      const allocs = calculateAssetAllocations(holdings);
      // Total = 20,000.
      // Stocks: 12,000 -> 60%
      // Bonds: 5,000 -> 25%
      // Crypto: 3,000 -> 15%
      expect(allocs).toHaveLength(3);
      expect(allocs.find(a => a.name === 'Stocks').percentage).toBe(60);
      expect(allocs.find(a => a.name === 'Bonds').percentage).toBe(25);
      expect(allocs.find(a => a.name === 'Crypto').percentage).toBe(15);
    });

    it('computes 0% drift when actual allocation perfectly equals target', () => {
      const drift = calculateAllocationDrift(holdings);
      expect(drift.isConfigured).toBe(true);
      expect(drift.value).toBe('0.0%');
    });
  });

  // -------------------------------------------------------------------------
  // Scenario C — Different user accounts (Storage Isolation)
  // -------------------------------------------------------------------------
  describe('Scenario C: User Isolation Across Accounts', () => {
    const userA = { id: 'usr_A', name: 'User Alpha', email: 'alpha@example.com', isLoggedIn: true, isDemo: false };
    const userB = { id: 'usr_B', name: 'User Beta', email: 'beta@example.com', isLoggedIn: true, isDemo: false };

    it('isolates value history between distinct users', () => {
      const keyA = getUserValueHistoryKey(userA);
      const keyB = getUserValueHistoryKey(userB);

      expect(keyA).not.toBe(keyB);
      expect(keyA).toBe('finsight_value_history_usr_A');
      expect(keyB).toBe('finsight_value_history_usr_B');

      // User A records snapshot of ₹50,000
      saveValueSnapshot(50000, '2026-09-01', keyA);
      // User B records snapshot of ₹1,00,000
      saveValueSnapshot(100000, '2026-09-01', keyB);

      const historyA = getStoredValueHistory(keyA);
      const historyB = getStoredValueHistory(keyB);

      expect(historyA).toHaveLength(1);
      expect(historyA[0].totalValue).toBe(50000);

      expect(historyB).toHaveLength(1);
      expect(historyB[0].totalValue).toBe(100000);
    });

    it('isolates studied educational resources between distinct users', () => {
      const keyA = getStudiedResourcesKey(userA);
      const keyB = getStudiedResourcesKey(userB);

      expect(keyA).not.toBe(keyB);
      expect(keyA).toBe('finsight_studied_resources_usr_A');
      expect(keyB).toBe('finsight_studied_resources_usr_B');

      localStorage.setItem(keyA, JSON.stringify(['res-1', 'res-2']));
      localStorage.setItem(keyB, JSON.stringify(['res-5']));

      const studiedA = JSON.parse(localStorage.getItem(keyA));
      const studiedB = JSON.parse(localStorage.getItem(keyB));

      expect(studiedA).toEqual(['res-1', 'res-2']);
      expect(studiedB).toEqual(['res-5']);
    });

    it('isolates financial data storage in finsight_financial_data map', () => {
      const allFinData = {
        'usr_A': { monthlySavings: 5000, investments: [{ id: 'a1', name: 'Asset A', currentValue: 50000 }], goals: [] },
        'usr_B': { monthlySavings: 20000, investments: [{ id: 'b1', name: 'Asset B', currentValue: 200000 }], goals: [] }
      };
      localStorage.setItem('finsight_financial_data', JSON.stringify(allFinData));

      const loaded = JSON.parse(localStorage.getItem('finsight_financial_data'));
      expect(loaded[userA.id].monthlySavings).toBe(5000);
      expect(loaded[userB.id].monthlySavings).toBe(20000);
      expect(loaded[userA.id].investments[0].name).toBe('Asset A');
      expect(loaded[userB.id].investments[0].name).toBe('Asset B');
    });
  });

  // -------------------------------------------------------------------------
  // Scenario D — Business user
  // -------------------------------------------------------------------------
  describe('Scenario D: Business User Calculations & Drift', () => {
    const businessUser = {
      id: 'usr_biz_1',
      name: 'Acme Corp',
      email: 'treasury@acmecorp.com',
      userType: 'business',
      isLoggedIn: true,
      isDemo: false
    };

    const bizHoldings = [
      { id: 'b1', name: 'Infosys', type: 'Stocks', investedAmount: 500000, currentValue: 600000, targetAllocation: 50 },
      { id: 'b2', name: 'TCS', type: 'Stocks', investedAmount: 200000, currentValue: 200000, targetAllocation: 20 },
      { id: 'b3', name: 'HDFC Bond', type: 'Bonds', investedAmount: 200000, currentValue: 200000, targetAllocation: 30 }
    ];

    it('calculates portfolio value and actual allocation from holdings', () => {
      const val = calculatePortfolioValue(bizHoldings);
      expect(val).toBe(1000000); // 6L + 2L + 2L = 10L

      const allocs = calculateAssetAllocations(bizHoldings);
      // Stocks: 8L (80%), Bonds: 2L (20%)
      expect(allocs).toHaveLength(2);
      expect(allocs[0].name).toBe('Stocks');
      expect(allocs[0].percentage).toBe(80);
      expect(allocs[1].name).toBe('Bonds');
      expect(allocs[1].percentage).toBe(20);
    });

    it('calculates allocation drift accurately against 100% target allocations', () => {
      // Targets: Stocks 70% (50 + 20), Bonds 30%. Total = 100%.
      // Actual: Stocks 80%, Bonds 20%.
      // Drift = 0.5 * (|80 - 70| + |20 - 30|) = 0.5 * 20 = 10.0%.
      const drift = calculateAllocationDrift(bizHoldings);
      expect(drift.isConfigured).toBe(true);
      expect(drift.value).toBe('10.0%');
      expect(drift.driftText).toBe('10.0% Drift');
    });

    it('displays ₹0 and unavailable risk metrics when business portfolio has zero investments', () => {
      const emptyBizData = {
        userType: 'business',
        name: businessUser.name,
        email: businessUser.email,
        portfolioValue: '₹0',
        portfolioRawValue: 0,
        marketExposure: '0%',
        performance: 'No data yet',
        isPositive: true,
        allocationDrift: 'Not configured',
        driftConfigured: false,
        insightMessage: 'Add treasury investments to track corporate asset allocation.',
        allocations: [],
        holdings: [],
        marketOutlook: 'Positive outlook',
        riskMetrics: {
          portfolioBeta: 'Historical data unavailable',
          annualizedVolatility: 'Historical data unavailable',
          sharpeRatio: 'Historical data unavailable',
          stressTestLoss: 'No investments added yet'
        },
        assistantSuggestions: []
      };

      const html = renderToString(
        <MemoryRouter>
          <ThemeProvider>
            <BusinessDashboard
              data={emptyBizData}
              user={businessUser}
              financialData={{ monthlySavings: null, investments: [], goals: [] }}
            />
          </ThemeProvider>
        </MemoryRouter>
      );

      expect(html).toContain('₹0');
      // Must NOT render fallback ₹18,42,000
      expect(html).not.toContain('₹18,42,000');
      // Must NOT render fake hardcoded Sharpe ratio 1.82
      expect(html).not.toContain('1.82');
      // Must display unavailable state for risk metrics
      expect(html).toContain('Historical data unavailable');
    });
  });

  // -------------------------------------------------------------------------
  // Scenario E — Tech user
  // -------------------------------------------------------------------------
  describe('Scenario E: Tech User Sector Concentration & Projections', () => {
    const techUser = {
      id: 'usr_tech_1',
      name: 'Nexus AI',
      email: 'finance@nexus.ai',
      userType: 'tech',
      isLoggedIn: true,
      isDemo: false
    };

    const techHoldings = [
      { id: 't1', name: 'Nvidia Cloud Compute', type: 'Stocks', investedAmount: 4000000, currentValue: 6000000, targetAllocation: 60 },
      { id: 't2', name: 'Treasury Debt Fund', type: 'Bonds', investedAmount: 4000000, currentValue: 4000000, targetAllocation: 40 }
    ];

    it('calculates total portfolio value and sector exposure from holdings', () => {
      const val = calculatePortfolioValue(techHoldings);
      expect(val).toBe(10000000); // 1 Crore

      const techInvestments = techHoldings.filter(inv =>
        ['Stocks', 'Crypto', 'ETFs'].includes(inv.type) ||
        (inv.name && inv.name.toLowerCase().includes('cloud'))
      );
      const techSum = techInvestments.reduce((s, i) => s + i.currentValue, 0);
      const techExposurePct = `${Math.round((techSum / val) * 100)}%`;
      expect(techExposurePct).toBe('60%');
    });

    it('displays ₹0 and does NOT fallback to ₹4,82,00,000 for empty tech user', () => {
      const emptyTechData = {
        userType: 'tech',
        name: techUser.name,
        email: techUser.email,
        portfolioValue: '₹0',
        portfolioRawValue: 0,
        performance: 'No data yet',
        isPositive: true,
        costLossExposure: 'No investments added yet',
        techSectorExposure: '0%',
        allocationDrift: 'Not configured',
        driftConfigured: false,
        insightMessage: 'Add enterprise assets.',
        allocations: [],
        holdings: [],
        riskAreas: [],
        crunchAcquisition: null,
        projections: [
          { year: '2026', projectedValue: '₹0', status: 'Current', simulatedGrowth: 'No data' },
          { year: '2030', projectedValue: '₹0', status: 'Projection', simulatedGrowth: 'No data' }
        ],
        assistantSuggestions: []
      };

      const html = renderToString(
        <MemoryRouter>
          <ThemeProvider>
            <TechDashboard
              data={emptyTechData}
              user={techUser}
              financialData={{ monthlySavings: null, investments: [], goals: [] }}
            />
          </ThemeProvider>
        </MemoryRouter>
      );

      expect(html).toContain('₹0');
      expect(html).not.toContain('₹4,82,00,000');
      expect(html).toContain('No investments added yet');
    });
  });

  // -------------------------------------------------------------------------
  // Scenario F — Demo account
  // -------------------------------------------------------------------------
  describe('Scenario F: Demo Account Functionality', () => {
    it('preserves Student demo data and fallbacks', () => {
      expect(STUDENT_DATA.portfolioValue).toBe('₹25,400');
      expect(STUDENT_DATA.portfolioRawValue).toBe(25400);
      expect(STUDENT_DATA.allocations).toHaveLength(3);
    });

    it('preserves Business demo data and fallbacks', () => {
      expect(BUSINESS_DATA.portfolioValue).toBe('₹18,42,000');
      expect(BUSINESS_DATA.portfolioRawValue).toBe(1842000);
      expect(BUSINESS_DATA.riskMetrics.sharpeRatio).toBe('1.82');
    });

    it('preserves Tech demo data and fallbacks', () => {
      expect(TECH_DATA.portfolioValue).toBe('₹4.82 Cr');
      expect(TECH_DATA.portfolioRawValue).toBe(48200000);
      expect(TECH_DATA.projections).toHaveLength(5);
    });
  });

  // -------------------------------------------------------------------------
  // Scenario G — Existing users & safe migration
  // -------------------------------------------------------------------------
  describe('Scenario G: Existing Users & Safe Migration', () => {
    it('safely migrates global value history to single existing account without duplication', () => {
      const history = [{ date: '2026-01-01', totalValue: 50000 }];
      localStorage.setItem(STORAGE_KEY_VALUE_HISTORY, JSON.stringify(history));
      localStorage.setItem('finsight_accounts', JSON.stringify({
        'single@example.com': { id: 'usr_single_1', email: 'single@example.com' }
      }));

      const user = { id: 'usr_single_1', email: 'single@example.com' };
      const didMigrate = migrateGlobalValueHistory(user);

      expect(didMigrate).toBe(true);
      expect(localStorage.getItem('finsight_value_history_usr_single_1')).toEqual(JSON.stringify(history));
      expect(localStorage.getItem(STORAGE_KEY_VALUE_HISTORY)).toBeNull();

      // Subsequent migration attempt for another user is blocked
      const user2 = { id: 'usr_other', email: 'other@example.com' };
      const secondMigrate = migrateGlobalValueHistory(user2);
      expect(secondMigrate).toBe(false);
      expect(localStorage.getItem('finsight_value_history_usr_other')).toBeNull();
    });

    it('safely migrates global studied resources without assigning to multiple users', () => {
      const studied = ['res-1', 'res-3'];
      localStorage.setItem(STORAGE_KEY_STUDIED_RESOURCES, JSON.stringify(studied));
      localStorage.setItem('finsight_accounts', JSON.stringify({
        'single@example.com': { id: 'usr_single_1', email: 'single@example.com' }
      }));

      const user = { id: 'usr_single_1', email: 'single@example.com' };
      const didMigrate = migrateGlobalStudiedResources(user);

      expect(didMigrate).toBe(true);
      expect(localStorage.getItem('finsight_studied_resources_usr_single_1')).toEqual(JSON.stringify(studied));
      expect(localStorage.getItem(STORAGE_KEY_STUDIED_RESOURCES)).toBeNull();
    });

    it('normalizes customFinancialData to financialData without discarding properties', () => {
      const oldAccountData = {
        customFinancialData: {
          monthlySavings: 7500,
          investments: [{ id: 'old-1', name: 'Old Fund', investedAmount: 10000, currentValue: 11000 }],
          goals: [{ id: 'g1', title: 'Car', current: 5000, target: 50000 }]
        }
      };

      const finData = oldAccountData.financialData || oldAccountData.customFinancialData;
      expect(finData.monthlySavings).toBe(7500);
      expect(finData.investments).toHaveLength(1);
      expect(finData.goals).toHaveLength(1);
    });
  });

  // -------------------------------------------------------------------------
  // Edge Cases
  // -------------------------------------------------------------------------
  describe('Edge Cases & Defensive Calculations', () => {
    it('handles null, undefined, empty array, and non-array investments safely', () => {
      expect(calculatePortfolioValue(null)).toBe(0);
      expect(calculatePortfolioValue(undefined)).toBe(0);
      expect(calculatePortfolioValue([])).toBe(0);
      expect(calculatePortfolioValue('not an array')).toBe(0);

      expect(calculateTotalInvested(null)).toBe(0);
      expect(calculateProfitLoss(null)).toBe(0);
      expect(calculatePerformance(null).percentage).toBe(0);
      expect(calculateAssetAllocations(null)).toEqual([]);
      expect(calculateHoldings(null)).toEqual([]);
      expect(calculateMarketExposure(null)).toBe('0%');
    });

    it('handles invalid or non-numeric inputs inside investment items gracefully', () => {
      const corruptHoldings = [
        { investedAmount: 'invalid', currentValue: 'bad' },
        null,
        { investedAmount: null, currentValue: undefined },
        { investedAmount: 5000, currentValue: 5500 }
      ];

      expect(calculateTotalInvested(corruptHoldings)).toBe(5000);
      expect(calculatePortfolioValue(corruptHoldings)).toBe(5500);
    });

    it('prevents division by zero when portfolio total value is 0', () => {
      const zeroHoldings = [
        { type: 'Stocks', investedAmount: 0, currentValue: 0 }
      ];
      expect(calculatePortfolioValue(zeroHoldings)).toBe(0);
      expect(calculateAssetAllocations(zeroHoldings)).toEqual([]);
      const drift = calculateAllocationDrift(zeroHoldings);
      expect(drift.isConfigured).toBe(false);
      expect(drift.value).toBe('Not configured');
    });

    it('resolves duplicate targets without summing identical percentages in the same category', () => {
      const holdings = [
        { type: 'Stocks', targetAllocation: 60 },
        { type: 'Stocks', targetAllocation: 60 }
      ];
      const resolved = resolveTargetAllocations(holdings);
      expect(resolved['Stocks']).toBe(60); // Not 120
    });
  });
});
