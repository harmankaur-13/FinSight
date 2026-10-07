import { describe, it, expect } from 'vitest';
import {
  calculateRebalanceTrades,
  formatCurrency
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
