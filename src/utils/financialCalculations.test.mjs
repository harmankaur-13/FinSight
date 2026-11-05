import { describe, it, expect } from 'vitest';
import {
  calculateRebalanceTrades,
  formatCurrency,
  calculateAssetAllocations,
  calculateAllocationDrift,
  resolveTargetAllocations,
  calculateInvestmentValuation,
  calculatePortfolioValue,
  calculateTotalInvested,
  calculateProfitLoss,
  calculatePerformance,
  calculateCashRunway,
  calculateBudgetUtilization,
  calculateSavingsRate,
  calculateNetFinancialPosition,
  calculateGoalCompletion,
  calculateTechSectorExposure
} from './financialCalculations.js';

describe('Target Validation', () => {
  it('rejects null targets', () => {
    const res = calculateRebalanceTrades([], null);
    expect(res.isValid).toBe(false);
    expect(res.error).toBeTruthy();
  });

  it('rejects empty targets object', () => {
    const res = calculateRebalanceTrades([], {});
    expect(res.isValid).toBe(false);
    expect(res.error).toBeTruthy();
  });

  it('rejects targets summing to 90% (< 100%)', () => {
    const res = calculateRebalanceTrades([], { 'Stocks': 50, 'Bonds': 40 });
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('90%');
  });

  it('rejects targets summing to 110% (> 100%)', () => {
    const res = calculateRebalanceTrades([], { 'Stocks': 60, 'Bonds': 50 });
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('110%');
  });

  it('rejects negative target allocation values', () => {
    const res = calculateRebalanceTrades([], { 'Stocks': 110, 'Bonds': -10 });
    expect(res.isValid).toBe(false);
    expect(res.error).toBeTruthy();
  });

  it('accepts targets summing to exactly 100%', () => {
    const res = calculateRebalanceTrades([], { 'Stocks': 60, 'Bonds': 25, 'Crypto': 15 });
    expect(res.isValid).toBe(true);
    expect(res.error).toBeNull();
  });
});

describe('Full Rebalancing', () => {
  const sampleHoldings = [
    { name: 'Reliance', type: 'Stocks', investedAmount: 10000, currentValue: 10000 },
    { name: 'Bitcoin', type: 'Crypto', investedAmount: 6000, currentValue: 6000 },
    { name: 'Govt Bonds', type: 'Bonds', investedAmount: 4000, currentValue: 4000 }
  ];
  // Total = 20,000. Current: Stocks 50%, Crypto 30%, Bonds 20%.
  // Targets: Stocks 60% (12,000), Mutual Funds 10% (2,000), Bonds 20% (4,000), Crypto 10% (2,000).
  const fullRebal = calculateRebalanceTrades(sampleHoldings, {
    'Stocks': 60,
    'Mutual Funds': 10,
    'Bonds': 20,
    'Crypto': 10
  }, { allowSell: true });

  it('succeeds for valid full rebalance calculation', () => {
    expect(fullRebal.isValid).toBe(true);
    expect(fullRebal.error).toBeNull();
  });

  it('generates exactly 3 trades', () => {
    expect(fullRebal.trades).toHaveLength(3);
  });

  it('ensures first trade is a SELL', () => {
    expect(fullRebal.trades[0].action).toBe('SELL');
  });

  it('sells ₹4,000 of Crypto', () => {
    expect(fullRebal.trades[0].assetType).toBe('Crypto');
    expect(fullRebal.trades[0].amount).toBe(4000);
  });

  it('buys ₹2,000 of Stocks', () => {
    expect(fullRebal.trades[1].action).toBe('BUY');
    expect(fullRebal.trades[1].assetType).toBe('Stocks');
    expect(fullRebal.trades[1].amount).toBe(2000);
  });

  it('buys ₹2,000 of Mutual Funds', () => {
    expect(fullRebal.trades[2].action).toBe('BUY');
    expect(fullRebal.trades[2].assetType).toBe('Mutual Funds');
    expect(fullRebal.trades[2].amount).toBe(2000);
  });

  it('reports max drift before rebalancing as 20%', () => {
    expect(fullRebal.maxDriftBefore).toBe(20);
  });

  it('reduces max drift after rebalancing to 0%', () => {
    expect(fullRebal.maxDriftAfter).toBe(0);
  });
});

describe('Trade Sorting', () => {
  const holdingsForSort = [
    { type: 'Crypto', investedAmount: 5000, currentValue: 5000 },
    { type: 'ETFs', investedAmount: 2000, currentValue: 2000 },
    { type: 'Stocks', investedAmount: 1000, currentValue: 1000 },
    { type: 'Bonds', investedAmount: 2000, currentValue: 2000 }
  ];
  // Total = 10,000. Target: Stocks 70% (7,000), Bonds 30% (3,000). Crypto 0%, ETFs 0%.
  // Diff: Crypto -5,000 (SELL), ETFs -2,000 (SELL), Bonds +1,000 (BUY), Stocks +6,000 (BUY)
  const sortedRes = calculateRebalanceTrades(holdingsForSort, { 'Stocks': 70, 'Bonds': 30 });

  it('sorts trade 0 as largest SELL (Crypto ₹5,000)', () => {
    expect(sortedRes.trades[0].action).toBe('SELL');
    expect(sortedRes.trades[0].assetType).toBe('Crypto');
    expect(sortedRes.trades[0].amount).toBe(5000);
  });

  it('sorts trade 1 as second largest SELL (ETFs ₹2,000)', () => {
    expect(sortedRes.trades[1].action).toBe('SELL');
    expect(sortedRes.trades[1].assetType).toBe('ETFs');
    expect(sortedRes.trades[1].amount).toBe(2000);
  });

  it('sorts trade 2 as largest BUY (Stocks ₹6,000)', () => {
    expect(sortedRes.trades[2].action).toBe('BUY');
    expect(sortedRes.trades[2].assetType).toBe('Stocks');
    expect(sortedRes.trades[2].amount).toBe(6000);
  });

  it('sorts trade 3 as second largest BUY (Bonds ₹1,000)', () => {
    expect(sortedRes.trades[3].action).toBe('BUY');
    expect(sortedRes.trades[3].assetType).toBe('Bonds');
    expect(sortedRes.trades[3].amount).toBe(1000);
  });
});

describe('Buy-Only Mode', () => {
  const sampleHoldings = [
    { name: 'Reliance', type: 'Stocks', investedAmount: 10000, currentValue: 10000 },
    { name: 'Bitcoin', type: 'Crypto', investedAmount: 6000, currentValue: 6000 },
    { name: 'Govt Bonds', type: 'Bonds', investedAmount: 4000, currentValue: 4000 }
  ];
  const buyOnlyRes = calculateRebalanceTrades(sampleHoldings, {
    'Stocks': 60,
    'Crypto': 10,
    'Bonds': 30
  }, { allowSell: false, newCash: 10000 });

  it('succeeds for buy-only calculation', () => {
    expect(buyOnlyRes.isValid).toBe(true);
    expect(buyOnlyRes.error).toBeNull();
  });

  it('ensures there are no SELL actions in buy-only mode', () => {
    expect(buyOnlyRes.trades.every(t => t.action === 'BUY')).toBe(true);
  });

  it('generates 2 BUY trades', () => {
    expect(buyOnlyRes.trades).toHaveLength(2);
  });

  it('ensures total buys do not exceed fresh cash contribution', () => {
    const totalBought = buyOnlyRes.trades.reduce((s, t) => s + t.amount, 0);
    expect(totalBought).toBeLessThanOrEqual(10000);
  });

  it('reduces drift from 20% to 10%', () => {
    expect(buyOnlyRes.maxDriftBefore).toBe(20);
    expect(buyOnlyRes.maxDriftAfter).toBe(10);
  });
});

describe('Edge Cases', () => {
  it('allocates 100% of cash according to targets for empty portfolio', () => {
    const emptyWithCash = calculateRebalanceTrades([], { 'Stocks': 60, 'Bonds': 40 }, { newCash: 10000 });
    expect(emptyWithCash.trades).toHaveLength(2);
  });

  it('computes exact buy split on empty portfolio with fresh cash', () => {
    const emptyWithCash = calculateRebalanceTrades([], { 'Stocks': 60, 'Bonds': 40 }, { newCash: 10000 });
    expect(emptyWithCash.trades[0].amount).toBe(6000);
    expect(emptyWithCash.trades[1].amount).toBe(4000);
  });

  it('generates 0 trades without errors for empty portfolio with 0 cash', () => {
    const emptyNoCash = calculateRebalanceTrades([], { 'Stocks': 60, 'Bonds': 40 }, { newCash: 0 });
    expect(emptyNoCash.trades).toHaveLength(0);
    expect(emptyNoCash.isValid).toBe(true);
  });

  it('produces 0 trades for already balanced portfolio', () => {
    const balancedHoldings = [
      { type: 'Stocks', investedAmount: 6000, currentValue: 6000 },
      { type: 'Bonds', investedAmount: 4000, currentValue: 4000 }
    ];
    const balancedRes = calculateRebalanceTrades(balancedHoldings, { 'Stocks': 60, 'Bonds': 40 });
    expect(balancedRes.trades).toHaveLength(0);
  });

  it('reports 0% drift for already balanced portfolio', () => {
    const balancedHoldings = [
      { type: 'Stocks', investedAmount: 6000, currentValue: 6000 },
      { type: 'Bonds', investedAmount: 4000, currentValue: 4000 }
    ];
    const balancedRes = calculateRebalanceTrades(balancedHoldings, { 'Stocks': 60, 'Bonds': 40 });
    expect(balancedRes.maxDriftBefore).toBe(0);
    expect(balancedRes.maxDriftAfter).toBe(0);
  });

  it('falls back to investedAmount when currentValue is missing or null', () => {
    const missingCurrentVal = [
      { type: 'Stocks', investedAmount: 5000 },
      { type: 'Bonds', investedAmount: 5000, currentValue: null }
    ];
    const fallbackRes = calculateRebalanceTrades(missingCurrentVal, { 'Stocks': 70, 'Bonds': 30 });
    expect(fallbackRes.totalCurrentValue).toBe(10000);
  });

  it('generates correct trades with fallback investedAmount', () => {
    const missingCurrentVal = [
      { type: 'Stocks', investedAmount: 5000 },
      { type: 'Bonds', investedAmount: 5000, currentValue: null }
    ];
    const fallbackRes = calculateRebalanceTrades(missingCurrentVal, { 'Stocks': 70, 'Bonds': 30 });
    expect(fallbackRes.trades).toHaveLength(2);
  });
});

describe('formatCurrency', () => {
  it('formats 0 as "₹0"', () => {
    expect(formatCurrency(0)).toBe('₹0');
  });

  it('formats 25400 as "₹25,400"', () => {
    expect(formatCurrency(25400)).toBe('₹25,400');
  });

  it('formats 1842000 as "₹18,42,000" in Indian notation', () => {
    expect(formatCurrency(1842000)).toBe('₹18,42,000');
  });
});

describe('resolveTargetAllocations & De-duplication', () => {
  it('does not sum duplicated target percentages across holdings in the same category', () => {
    const holdings = [
      { name: 'Apple', type: 'Stocks', investedAmount: 5000, targetAllocation: 60 },
      { name: 'Microsoft', type: 'Stocks', investedAmount: 5000, targetAllocation: 60 },
      { name: 'Govt Bonds', type: 'Bonds', investedAmount: 3000, targetAllocation: 25 },
      { name: 'Bitcoin', type: 'Crypto', investedAmount: 2000, targetAllocation: 15 }
    ];
    const resolved = resolveTargetAllocations(holdings);
    expect(resolved['Stocks']).toBe(60);
    expect(resolved['Bonds']).toBe(25);
    expect(resolved['Crypto']).toBe(15);
  });

  it('uses explicitly provided targets over holding targets', () => {
    const holdings = [
      { name: 'Apple', type: 'Stocks', investedAmount: 5000, targetAllocation: 10 }
    ];
    const resolved = resolveTargetAllocations(holdings, { 'Stocks': 70, 'Bonds': 30 });
    expect(resolved['Stocks']).toBe(70);
    expect(resolved['Bonds']).toBe(30);
  });
});

describe('calculateAssetAllocations', () => {
  it('returns empty array for empty investments or zero total value', () => {
    expect(calculateAssetAllocations([])).toEqual([]);
    expect(calculateAssetAllocations([{ type: 'Stocks', currentValue: 0, investedAmount: 0 }])).toEqual([]);
  });

  it('computes correct percentages based on market value', () => {
    const holdings = [
      { type: 'Stocks', currentValue: 15000 },
      { type: 'Bonds', currentValue: 5000 }
    ];
    const allocs = calculateAssetAllocations(holdings, { 'Stocks': 70, 'Bonds': 30 });
    expect(allocs).toHaveLength(2);
    expect(allocs[0].name).toBe('Stocks');
    expect(allocs[0].percentage).toBe(75);
    expect(allocs[0].target).toBe(70);
    expect(allocs[1].name).toBe('Bonds');
    expect(allocs[1].percentage).toBe(25);
    expect(allocs[1].target).toBe(30);
  });
});

describe('calculateAllocationDrift', () => {
  it('returns unconfigured state when investments are empty', () => {
    const drift = calculateAllocationDrift([]);
    expect(drift.isConfigured).toBe(false);
    expect(drift.value).toBe('Not configured');
  });

  it('returns unconfigured state when portfolio value is 0', () => {
    const drift = calculateAllocationDrift([{ type: 'Stocks', currentValue: 0, investedAmount: 0 }]);
    expect(drift.isConfigured).toBe(false);
    expect(drift.value).toBe('Not configured');
  });

  it('returns unconfigured state when target allocations do not total 100%', () => {
    const holdings = [
      { type: 'Stocks', currentValue: 10000, targetAllocation: 50 },
      { type: 'Bonds', currentValue: 5000, targetAllocation: 30 } // 50 + 30 = 80% != 100%
    ];
    const drift = calculateAllocationDrift(holdings);
    expect(drift.isConfigured).toBe(false);
    expect(drift.value).toBe('Not configured');
  });

  it('calculates drift using 0.5 * sum of absolute differences formula', () => {
    // Portfolio: Stocks 70% (14,000), Bonds 20% (4,000), Crypto 10% (2,000) = Total 20,000
    // Target: Stocks 60%, Bonds 25%, Crypto 15% (sum = 100%)
    // Diff: |70 - 60| = 10, |20 - 25| = 5, |10 - 15| = 5.
    // Sum = 20. Drift = 0.5 * 20 = 10.0%.
    const holdings = [
      { type: 'Stocks', currentValue: 14000, targetAllocation: 60 },
      { type: 'Bonds', currentValue: 4000, targetAllocation: 25 },
      { type: 'Crypto', currentValue: 2000, targetAllocation: 15 }
    ];
    const drift = calculateAllocationDrift(holdings);
    expect(drift.isConfigured).toBe(true);
    expect(drift.value).toBe('10.0%');
    expect(drift.driftText).toBe('10.0% Drift');
  });

  it('calculates 0% drift when portfolio perfectly matches target allocations', () => {
    const holdings = [
      { type: 'Stocks', currentValue: 12000, targetAllocation: 60 },
      { type: 'Bonds', currentValue: 5000, targetAllocation: 25 },
      { type: 'Crypto', currentValue: 3000, targetAllocation: 15 }
    ];
    const drift = calculateAllocationDrift(holdings);
    expect(drift.isConfigured).toBe(true);
    expect(drift.value).toBe('0.0%');
  });
});

describe('calculateInvestmentValuation (Method A vs Method B)', () => {
  it('correctly calculates Method A with quantity and purchase price / current price', () => {
    const invA = {
      name: 'Apple Inc',
      type: 'Stocks',
      valuationMethod: 'quantity_price',
      quantity: 50,
      purchasePrice: 150,
      currentPrice: 180
    };
    const val = calculateInvestmentValuation(invA);
    expect(val.investedAmount).toBe(7500); // 50 * 150
    expect(val.currentValue).toBe(9000);   // 50 * 180
    expect(val.profitLoss).toBe(1500);
    expect(val.returnPercentage).toBe(20); // (1500 / 7500) * 100 = 20%
    expect(val.isManual).toBe(false);
  });

  it('correctly defaults currentPrice to purchasePrice in Method A if currentPrice is omitted', () => {
    const inv = {
      quantity: 10,
      purchasePrice: 200
    };
    const val = calculateInvestmentValuation(inv);
    expect(val.investedAmount).toBe(2000);
    expect(val.currentValue).toBe(2000);
    expect(val.profitLoss).toBe(0);
    expect(val.returnPercentage).toBe(0);
  });

  it('correctly calculates Method B manual valuation', () => {
    const invB = {
      name: 'Startup Equity',
      type: 'Other',
      valuationMethod: 'manual',
      investedAmount: 50000,
      currentValue: 65000
    };
    const val = calculateInvestmentValuation(invB);
    expect(val.investedAmount).toBe(50000);
    expect(val.currentValue).toBe(65000);
    expect(val.profitLoss).toBe(15000);
    expect(val.returnPercentage).toBe(30);
    expect(val.isManual).toBe(true);
  });

  it('handles negative P/L when asset decreases in value', () => {
    const invLoss = {
      quantity: 100,
      purchasePrice: 50,
      currentPrice: 35
    };
    const val = calculateInvestmentValuation(invLoss);
    expect(val.investedAmount).toBe(5000);
    expect(val.currentValue).toBe(3500);
    expect(val.profitLoss).toBe(-1500);
    expect(val.returnPercentage).toBe(-30);
  });
});

describe('calculateCashRunway', () => {
  it('returns N/A when expenses are missing, zero, or negative', () => {
    expect(calculateCashRunway(100000, 0).isCalculated).toBe(false);
    expect(calculateCashRunway(100000, null).isCalculated).toBe(false);
    expect(calculateCashRunway(100000, -500).isCalculated).toBe(false);
  });

  it('returns N/A when cash reserves are missing or negative', () => {
    expect(calculateCashRunway(null, 50000).isCalculated).toBe(false);
    expect(calculateCashRunway(-1000, 50000).isCalculated).toBe(false);
  });

  it('calculates runway accurately and categorizes status', () => {
    // 600,000 reserves / 100,000 expenses = 6.0 months (healthy)
    const healthy = calculateCashRunway(600000, 100000);
    expect(healthy.isCalculated).toBe(true);
    expect(healthy.runwayMonths).toBe(6.0);
    expect(healthy.formatted).toBe('6.0 months');
    expect(healthy.status).toBe('healthy');

    // 450,000 reserves / 100,000 expenses = 4.5 months (caution)
    const caution = calculateCashRunway(450000, 100000);
    expect(caution.runwayMonths).toBe(4.5);
    expect(caution.status).toBe('caution');

    // 200,000 reserves / 100,000 expenses = 2.0 months (critical)
    const critical = calculateCashRunway(200000, 100000);
    expect(critical.runwayMonths).toBe(2.0);
    expect(critical.status).toBe('critical');
  });
});

describe('calculateBudgetUtilization', () => {
  it('returns N/A when approved budget is null, 0, or negative', () => {
    expect(calculateBudgetUtilization(50000, null).isCalculated).toBe(false);
    expect(calculateBudgetUtilization(50000, 0).isCalculated).toBe(false);
    expect(calculateBudgetUtilization(50000, -100).isCalculated).toBe(false);
  });

  it('calculates utilization percentage and warning thresholds', () => {
    // 700,000 actual / 1,000,000 budget = 70.0% (on_track)
    const onTrack = calculateBudgetUtilization(700000, 1000000);
    expect(onTrack.isCalculated).toBe(true);
    expect(onTrack.percentage).toBe(70.0);
    expect(onTrack.formatted).toBe('70.0%');
    expect(onTrack.status).toBe('on_track');

    // 880,000 actual / 1,000,000 budget = 88.0% (warning)
    const warning = calculateBudgetUtilization(880000, 1000000);
    expect(warning.percentage).toBe(88.0);
    expect(warning.status).toBe('warning');

    // 1,150,000 actual / 1,000,000 budget = 115.0% (over_budget)
    const over = calculateBudgetUtilization(1150000, 1000000);
    expect(over.percentage).toBe(115.0);
    expect(over.status).toBe('over_budget');
  });
});

describe('calculateSavingsRate', () => {
  it('returns N/A when monthly income is missing, 0, or negative', () => {
    expect(calculateSavingsRate(5000, null).isCalculated).toBe(false);
    expect(calculateSavingsRate(5000, 0).isCalculated).toBe(false);
    expect(calculateSavingsRate(5000, -100).isCalculated).toBe(false);
  });

  it('calculates savings rate percentage accurately', () => {
    // 5,000 savings / 20,000 income = 25.0%
    const res = calculateSavingsRate(5000, 20000);
    expect(res.isCalculated).toBe(true);
    expect(res.rate).toBe(25.0);
    expect(res.formatted).toBe('25.0%');
  });
});

describe('calculateNetFinancialPosition', () => {
  it('calculates total assets, liabilities, and net position', () => {
    // Portfolio: 500,000, Cash: 200,000, Short: 50,000, Long: 150,000
    // Assets = 700,000. Liabilities = 200,000. Net = 500,000
    const net = calculateNetFinancialPosition(500000, 200000, 50000, 150000);
    expect(net.totalAssets).toBe(700000);
    expect(net.totalLiabilities).toBe(200000);
    expect(net.netPosition).toBe(500000);
    expect(net.isPositive).toBe(true);
  });

  it('detects net liability deficit when liabilities exceed assets', () => {
    const net = calculateNetFinancialPosition(50000, 20000, 100000, 200000);
    expect(net.totalAssets).toBe(70000);
    expect(net.totalLiabilities).toBe(300000);
    expect(net.netPosition).toBe(-230000);
    expect(net.isPositive).toBe(false);
  });
});

describe('calculateGoalCompletion', () => {
  it('calculates completion percentage and remaining amount', () => {
    const goal = calculateGoalCompletion(35000, 50000);
    expect(goal.percentage).toBe(70);
    expect(goal.formatted).toBe('70%');
    expect(goal.remaining).toBe(15000);
    expect(goal.isCompleted).toBe(false);
  });

  it('identifies completed goals', () => {
    const goal = calculateGoalCompletion(60000, 50000);
    expect(goal.percentage).toBe(120);
    expect(goal.remaining).toBe(0);
    expect(goal.isCompleted).toBe(true);
  });
});

describe('formatCurrency multi-currency support', () => {
  it('formats INR with en-IN numbering by default', () => {
    expect(formatCurrency(1842000)).toBe('₹18,42,000');
  });

  it('formats USD with $ and US formatting', () => {
    expect(formatCurrency(1500000, 'USD')).toBe('$1,500,000');
  });

  it('formats EUR with €', () => {
    expect(formatCurrency(750000, 'EUR')).toBe('€750,000');
  });

  it('formats GBP with £', () => {
    expect(formatCurrency(250000, 'GBP')).toBe('£250,000');
  });
});

describe('Phase 2.1 — Test Case A & Centralized Valuation Verification', () => {
  it('strictly validates Test Case A metrics', () => {
    // Test Case A:
    // Stocks: 10 qty, purchase ₹100, current ₹200 -> Invested ₹1,000, Current ₹2,000
    // Bonds: 10 qty, purchase ₹100, current ₹100 -> Invested ₹1,000, Current ₹1,000
    // Target: 50% Stocks, 50% Bonds
    const holdings = [
      {
        name: 'Equity Index Shares',
        type: 'Stocks',
        valuationMethod: 'quantity_price',
        quantity: 10,
        purchasePrice: 100,
        currentPrice: 200,
        targetAllocation: 50
      },
      {
        name: 'Sovereign Debt Units',
        type: 'Bonds',
        valuationMethod: 'quantity_price',
        quantity: 10,
        purchasePrice: 100,
        currentPrice: 100,
        targetAllocation: 50
      }
    ];

    // 1. Valuation checks
    const valStocks = calculateInvestmentValuation(holdings[0]);
    expect(valStocks.investedAmount).toBe(1000);
    expect(valStocks.currentValue).toBe(2000);
    expect(valStocks.profitLoss).toBe(1000);

    const valBonds = calculateInvestmentValuation(holdings[1]);
    expect(valBonds.investedAmount).toBe(1000);
    expect(valBonds.currentValue).toBe(1000);
    expect(valBonds.profitLoss).toBe(0);

    // 2. Portfolio level
    const portfolioVal = calculatePortfolioValue(holdings);
    expect(portfolioVal).toBe(3000);

    const totalInvested = calculateTotalInvested(holdings);
    expect(totalInvested).toBe(2000);

    const profitLoss = calculateProfitLoss(holdings);
    expect(profitLoss).toBe(1000);

    const perf = calculatePerformance(holdings);
    expect(perf.percentage).toBe(50.0);
    expect(perf.formatted).toBe('+50.0%');

    // 3. Asset allocations
    const allocs = calculateAssetAllocations(holdings, { 'Stocks': 50, 'Bonds': 50 });
    expect(allocs).toHaveLength(2);
    const stockAlloc = allocs.find(a => a.name === 'Stocks');
    const bondAlloc = allocs.find(a => a.name === 'Bonds');

    expect(stockAlloc.percentage).toBe(66.67);
    expect(stockAlloc.value).toBe(2000);
    expect(bondAlloc.percentage).toBe(33.33);
    expect(bondAlloc.value).toBe(1000);

    // 4. Allocation drift: 0.5 * (|66.67 - 50| + |33.33 - 50|) = 16.67 percentage points
    const drift = calculateAllocationDrift(holdings, allocs, { 'Stocks': 50, 'Bonds': 50 });
    expect(drift.isConfigured).toBe(true);
    expect(drift.percentagePoints).toBe(16.67);
    expect(drift.value).toBe('16.67%');
    expect(drift.driftText).toBe('16.67% Drift');
  });

  it('preserves distinction between missing savings and explicit zero', () => {
    // Missing savings must return uncalculated state
    const missing = calculateSavingsRate(null, 30000);
    expect(missing.isCalculated).toBe(false);
    expect(missing.formatted).toBe('Not configured');

    // Explicit 0 savings must return 0.0% calculated
    const explicitZero = calculateSavingsRate(0, 30000);
    expect(explicitZero.isCalculated).toBe(true);
    expect(explicitZero.rate).toBe(0);
    expect(explicitZero.formatted).toBe('0.0%');

    // Positive savings rate calculation (5,000 / 30,000 = 16.67%)
    const positive = calculateSavingsRate(5000, 30000);
    expect(positive.isCalculated).toBe(true);
    expect(positive.rate).toBe(16.67);
    expect(positive.formatted).toBe('16.67%');

    // Zero income must be not calculable
    const zeroIncome = calculateSavingsRate(5000, 0);
    expect(zeroIncome.isCalculated).toBe(false);
    expect(zeroIncome.formatted).toBe('Not calculable');
  });

  it('preserves distinction between missing budget utilization and explicit zero', () => {
    // Missing actual spending
    const missing = calculateBudgetUtilization(null, 1000000);
    expect(missing.isCalculated).toBe(false);
    expect(missing.formatted).toBe('Not configured');

    // Explicit 0 spending
    const zeroSpend = calculateBudgetUtilization(0, 1000000);
    expect(zeroSpend.isCalculated).toBe(true);
    expect(zeroSpend.percentage).toBe(0);
    expect(zeroSpend.formatted).toBe('0.0%');

    // Missing budget
    const missingBudget = calculateBudgetUtilization(500000, null);
    expect(missingBudget.isCalculated).toBe(false);
    expect(missingBudget.formatted).toBe('Not configured');

    // Zero budget
    const zeroBudget = calculateBudgetUtilization(500000, 0);
    expect(zeroBudget.isCalculated).toBe(false);
    expect(zeroBudget.formatted).toBe('N/A (Budget not configured)');
  });

  it('computes cash runway accurately including zero cash reserves', () => {
    // Missing expenses
    expect(calculateCashRunway(500000, null).isCalculated).toBe(false);
    // Zero expenses
    expect(calculateCashRunway(500000, 0).isCalculated).toBe(false);
    expect(calculateCashRunway(500000, 0).formatted).toBe('N/A (Missing or zero expenses)');

    // Zero cash reserves with positive burn -> 0.0 months runway
    const zeroCash = calculateCashRunway(0, 100000);
    expect(zeroCash.isCalculated).toBe(true);
    expect(zeroCash.runwayMonths).toBe(0.0);
    expect(zeroCash.formatted).toBe('0.0 months');
    expect(zeroCash.status).toBe('critical');

    // Healthy runway
    const healthy = calculateCashRunway(1200000, 100000);
    expect(healthy.runwayMonths).toBe(12.0);
    expect(healthy.status).toBe('healthy');
  });

  it('handles liabilities completeness in net financial position', () => {
    // Both liabilities null -> unverified
    const unverified = calculateNetFinancialPosition(500000, 200000, null, null);
    expect(unverified.isVerified).toBe(false);
    expect(unverified.status).toBe('unverified');
    expect(unverified.badgeText).toBe('Liabilities Not Configured');

    // One liability null -> incomplete
    const incomplete = calculateNetFinancialPosition(500000, 200000, 50000, null);
    expect(incomplete.isVerified).toBe(false);
    expect(incomplete.status).toBe('incomplete');
    expect(incomplete.badgeText).toBe('Liabilities Incomplete');

    // Both specified (even if 0) -> verified
    const verified = calculateNetFinancialPosition(500000, 200000, 50000, 100000);
    expect(verified.isVerified).toBe(true);
    expect(verified.status).toBe('verified');
    expect(verified.totalAssets).toBe(700000);
    expect(verified.totalLiabilities).toBe(150000);
    expect(verified.netPosition).toBe(550000);
  });

  it('calculates technology sector exposure without misclassifying non-tech assets', () => {
    const portfolio = [
      { name: 'Datadog Cloud SaaS', type: 'Stocks', sector: 'Technology', investedAmount: 50000, currentValue: 60000 },
      { name: 'Apollo Hospitals', type: 'Stocks', sector: 'Healthcare', investedAmount: 40000, currentValue: 40000 }
    ];
    // Total value: 100,000. Tech value: 60,000 -> 60%
    const exp = calculateTechSectorExposure(portfolio);
    expect(exp.percentage).toBe(60.0);
    expect(exp.formatted).toBe('60%');
    expect(exp.techValue).toBe(60000);
    expect(exp.totalValue).toBe(100000);
  });
});
