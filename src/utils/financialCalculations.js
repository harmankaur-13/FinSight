// Reusable Financial Calculation & Utility Functions for FinSight

export const ASSET_COLORS = {
  'Stocks': '#236754',          // Deep Forest Pine
  'Mutual Funds': '#0284c7',    // Classic Blue
  'Crypto': '#d97706',          // Warm Amber Brass
  'Cryptocurrency': '#d97706',  // Warm Amber Brass
  'Bonds': '#6366f1',           // Indigo Slate
  'ETFs': '#2563eb',            // Royal Blue
  'Fixed Deposits': '#0d9488',  // Teal
  'Gold': '#eab308',            // Gold
  'Cash': '#10b981',            // Emerald
  'Real Estate': '#b45309',     // Warm Terracotta
  'Other': '#64748b'            // Slate Gray
};

export const ASSET_TYPES = [
  'Stocks',
  'Mutual Funds',
  'ETFs',
  'Bonds',
  'Fixed Deposits',
  'Gold',
  'Cryptocurrency',
  'Crypto',
  'Cash',
  'Real Estate',
  'Other'
];

const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  SGD: 'S$',
  AED: 'AED '
};

export function getCurrencySymbol(currency = 'INR') {
  return CURRENCY_SYMBOLS[currency] || '₹';
}

/**
 * Format currency with custom symbol and locale
 */
export function formatCurrency(amount, currency = 'INR') {
  if (amount === undefined || amount === null || isNaN(amount)) {
    const sym = getCurrencySymbol(currency);
    return `${sym}0`;
  }
  const num = Number(amount);
  const sym = getCurrencySymbol(currency);
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  return sym + Math.round(num).toLocaleString(locale);
}

/**
 * Calculate valuation and performance for an individual investment holding
 * Supports Method A (quantity * purchasePrice / currentPrice) and Method B (manual valuation)
 */
export function calculateInvestmentValuation(inv) {
  if (!inv || typeof inv !== 'object') {
    return {
      investedAmount: 0,
      currentValue: 0,
      profitLoss: 0,
      returnPercentage: 0,
      isManual: true,
      method: 'manual'
    };
  }

  const isQuantityPrice = inv.valuationMethod === 'quantity_price' || (
    inv.quantity !== undefined && inv.quantity !== null && inv.quantity !== '' &&
    inv.purchasePrice !== undefined && inv.purchasePrice !== null && inv.purchasePrice !== ''
  );

  let investedAmount = 0;
  let currentValue = 0;

  if (isQuantityPrice) {
    const qty = Math.max(0, Number(inv.quantity) || 0);
    const purchase = Math.max(0, Number(inv.purchasePrice) || 0);
    const currPrice = inv.currentPrice !== undefined && inv.currentPrice !== null && inv.currentPrice !== ''
      ? Math.max(0, Number(inv.currentPrice) || 0)
      : purchase;

    investedAmount = qty * purchase;
    currentValue = qty * currPrice;
  } else {
    investedAmount = Math.max(0, Number(inv.investedAmount) || 0);
    currentValue = inv.currentValue !== undefined && inv.currentValue !== null && inv.currentValue !== ''
      ? Math.max(0, Number(inv.currentValue) || 0)
      : investedAmount;
  }

  const profitLoss = currentValue - investedAmount;
  const returnPercentage = investedAmount > 0 ? (profitLoss / investedAmount) * 100 : 0;

  return {
    investedAmount,
    currentValue,
    profitLoss,
    returnPercentage,
    isManual: !isQuantityPrice,
    method: isQuantityPrice ? 'quantity_price' : 'manual'
  };
}

/**
 * Calculate total invested amount across all investments
 */
export function calculateTotalInvested(investments = []) {
  if (!Array.isArray(investments) || investments.length === 0) return 0;
  return investments.reduce((sum, inv) => {
    if (!inv || typeof inv !== 'object') return sum;
    const valuation = calculateInvestmentValuation(inv);
    return sum + valuation.investedAmount;
  }, 0);
}

/**
 * Calculate total current portfolio value
 */
export function calculatePortfolioValue(investments = []) {
  if (!Array.isArray(investments) || investments.length === 0) return 0;
  return investments.reduce((sum, inv) => {
    if (!inv || typeof inv !== 'object') return sum;
    const valuation = calculateInvestmentValuation(inv);
    return sum + valuation.currentValue;
  }, 0);
}

/**
 * Calculate total profit / loss amount
 */
export function calculateProfitLoss(investments = []) {
  const current = calculatePortfolioValue(investments);
  const invested = calculateTotalInvested(investments);
  return current - invested;
}

/**
 * Calculate performance percentage and formatting
 */
export function calculatePerformance(investments = []) {
  const totalInvested = calculateTotalInvested(investments);
  const totalProfitLoss = calculateProfitLoss(investments);

  if (totalInvested === 0) {
    return {
      percentage: 0,
      formatted: 'No data yet',
      isPositive: true,
      raw: 0
    };
  }

  const pct = (totalProfitLoss / totalInvested) * 100;
  const pctRounded = Math.round(pct * 10) / 10;
  const isPositive = pct >= 0;
  const sign = isPositive ? '+' : '';
  
  return {
    percentage: pctRounded,
    formatted: `${sign}${pctRounded.toFixed(1)}%`,
    isPositive,
    raw: pct
  };
}

/**
 * Resolve target allocations across categories without duplicating holding targets
 * @param {Array} investments
 * @param {Object|null} targetAllocations - Optional explicit targets object { [type]: percentage }
 * @returns {Object} { [category]: targetPercentage }
 */
export function resolveTargetAllocations(investments = [], targetAllocations = null) {
  if (targetAllocations && typeof targetAllocations === 'object' && !Array.isArray(targetAllocations)) {
    const cleaned = {};
    for (const [k, v] of Object.entries(targetAllocations)) {
      const num = Number(v);
      if (!isNaN(num) && num >= 0) {
        cleaned[k] = num;
      }
    }
    if (Object.keys(cleaned).length > 0) {
      return cleaned;
    }
  }

  if (!Array.isArray(investments) || investments.length === 0) {
    return {};
  }

  // Group targets by category to prevent duplicate summing across multiple holdings
  const categoryHoldings = {};
  investments.forEach((inv) => {
    if (!inv) return;
    const type = inv.type || 'Other';
    if (!categoryHoldings[type]) categoryHoldings[type] = [];
    if (inv.targetAllocation !== undefined && inv.targetAllocation !== null && inv.targetAllocation !== '') {
      const num = Number(inv.targetAllocation);
      if (!isNaN(num) && num > 0) {
        categoryHoldings[type].push(num);
      }
    }
  });

  const resolved = {};
  for (const [cat, targetsList] of Object.entries(categoryHoldings)) {
    if (targetsList.length === 0) continue;
    // If all holdings in category have identical target weight (e.g. user set 60% on both stocks),
    // do not sum duplicated percentages to 120% - treat as category target 60%.
    const allSame = targetsList.every((val) => val === targetsList[0]);
    if (allSame) {
      resolved[cat] = targetsList[0];
    } else {
      // If individual distinct targets are set per holding, sum them
      const sum = targetsList.reduce((s, v) => s + v, 0);
      resolved[cat] = sum;
    }
  }

  return resolved;
}

/**
 * Calculate asset allocations by asset type
 * @param {Array} investments
 * @param {Object|null} targetAllocations - Optional separately configured target allocations
 */
export function calculateAssetAllocations(investments = [], targetAllocations = null) {
  if (!Array.isArray(investments) || investments.length === 0) return [];

  const totalValue = calculatePortfolioValue(investments);
  if (totalValue === 0) return [];

  const typeTotals = {};
  investments.forEach((inv) => {
    if (!inv || typeof inv !== 'object') return;
    const type = inv.type || 'Other';
    const valuation = calculateInvestmentValuation(inv);
    const validVal = valuation.currentValue;
    typeTotals[type] = (typeTotals[type] || 0) + validVal;
  });

  const resolvedTargets = resolveTargetAllocations(investments, targetAllocations);
  const targetSum = Object.values(resolvedTargets).reduce((s, v) => s + v, 0);
  const hasValidTargets = Object.keys(resolvedTargets).length > 0 && Math.abs(targetSum - 100) < 0.5;

  // Include both categories with actual holdings and target-only categories (with 0 actual value)
  const categories = Array.from(new Set([
    ...Object.keys(typeTotals),
    ...(hasValidTargets ? Object.keys(resolvedTargets) : [])
  ]));

  return categories.map((cat) => {
    const val = typeTotals[cat] || 0;
    const pct = totalValue > 0 ? (val / totalValue) * 100 : 0;
    const roundedPct = Math.round(pct * 100) / 100;
    const target = hasValidTargets && resolvedTargets[cat] !== undefined
      ? Math.round(resolvedTargets[cat] * 100) / 100
      : null;

    return {
      name: cat,
      percentage: roundedPct,
      target: target,
      value: val,
      color: ASSET_COLORS[cat] || ASSET_COLORS['Other']
    };
  }).sort((a, b) => b.percentage - a.percentage || (b.target || 0) - (a.target || 0));
}

/**
 * Calculate allocation drift against target allocations
 * Formula: Allocation Drift = 0.5 * sum of absolute differences between actual and target allocation percentages.
 * 
 * @param {Array} investments - Array of investment objects
 * @param {Array|Object} allocationsOrTargets - Either computed allocations array or targets object
 * @param {Object|null} explicitTargets - Optional explicit target allocation mapping { [type]: percentage }
 * @returns {{ driftText: string, hasTarget: boolean, isConfigured: boolean, value: string, raw: number }}
 */
export function calculateAllocationDrift(investments = [], allocationsOrTargets = [], explicitTargets = null) {
  if (!Array.isArray(investments) || investments.length === 0) {
    return {
      driftText: 'Target allocation not configured',
      hasTarget: false,
      isConfigured: false,
      value: 'Not configured',
      raw: 0
    };
  }

  const totalValue = calculatePortfolioValue(investments);
  if (totalValue === 0) {
    return {
      driftText: 'Target allocation not configured',
      hasTarget: false,
      isConfigured: false,
      value: 'Not configured',
      raw: 0
    };
  }

  // Determine targets and allocations
  let targetsObj = explicitTargets;
  let allocs = [];

  if (allocationsOrTargets && typeof allocationsOrTargets === 'object' && !Array.isArray(allocationsOrTargets)) {
    targetsObj = allocationsOrTargets;
    allocs = calculateAssetAllocations(investments, targetsObj);
  } else if (Array.isArray(allocationsOrTargets) && allocationsOrTargets.length > 0) {
    allocs = allocationsOrTargets;
  } else {
    allocs = calculateAssetAllocations(investments, targetsObj);
  }

  const resolvedTargets = resolveTargetAllocations(investments, targetsObj);
  const targetSum = Object.values(resolvedTargets).reduce((s, v) => s + v, 0);

  // Validate that configured target allocations total 100% (with 0.5% tolerance)
  if (Object.keys(resolvedTargets).length === 0 || Math.abs(targetSum - 100) >= 0.5) {
    return {
      driftText: 'Target allocation not configured',
      hasTarget: false,
      isConfigured: false,
      value: 'Not configured',
      raw: 0
    };
  }

  // Map actual percentages by category
  const actualPcts = {};
  allocs.forEach((a) => {
    actualPcts[a.name] = a.percentage;
  });

  // Collect all unique categories from actual allocations and targets
  const allCategories = new Set([...Object.keys(actualPcts), ...Object.keys(resolvedTargets)]);

  // Formula: 0.5 * sum of |actual% - target%|
  let sumAbsDiff = 0;
  for (const cat of allCategories) {
    const actual = actualPcts[cat] || 0;
    const target = resolvedTargets[cat] || 0;
    sumAbsDiff += Math.abs(actual - target);
  }

  const driftVal = 0.5 * sumAbsDiff;
  const roundedDrift = Math.round(driftVal * 100) / 100;
  const formattedDrift = (roundedDrift % 1 === 0 || Math.round(roundedDrift * 10) === roundedDrift * 10)
    ? `${roundedDrift.toFixed(1)}%`
    : `${roundedDrift}%`;

  return {
    driftText: `${formattedDrift} Drift`,
    hasTarget: true,
    isConfigured: true,
    value: formattedDrift,
    percentagePoints: roundedDrift,
    raw: driftVal
  };
}

/**
 * Calculate formatted holdings list for Business & Tech dashboards
 */
export function calculateHoldings(investments = []) {
  if (!Array.isArray(investments) || investments.length === 0) return [];

  const totalValue = calculatePortfolioValue(investments);

  return investments.map((inv) => {
    const valuation = calculateInvestmentValuation(inv);
    const invested = valuation.investedAmount;
    const current = valuation.currentValue;
    const diff = valuation.profitLoss;
    const changePct = valuation.returnPercentage;
    const isPositive = diff >= 0;
    const allocationPct = totalValue > 0 ? ((current / totalValue) * 100).toFixed(1) + '%' : '0.0%';

    return {
      id: inv.id,
      company: inv.name || 'Unnamed Asset',
      symbol: inv.type || 'Asset',
      sector: inv.sector || (inv.type === 'Stocks' ? 'Equities' : inv.type || 'General'),
      value: formatCurrency(current),
      rawValue: current,
      investedAmount: invested,
      change: (isPositive ? '+' : '') + changePct.toFixed(1) + '%',
      isPositive,
      allocation: allocationPct,
      targetAllocation: inv.targetAllocation,
      liquidityClassification: inv.liquidityClassification || null,
      valuationMethod: valuation.method,
      quantity: inv.quantity || null,
      purchasePrice: inv.purchasePrice || null,
      currentPrice: inv.currentPrice || null
    };
  });
}

/**
 * Calculate Cash Runway in months
 * Formula: Available Cash Reserves / Monthly Operating Expenses
 */
export function calculateCashRunway(cashReserves, monthlyExpenses) {
  if (
    monthlyExpenses === null ||
    monthlyExpenses === undefined ||
    monthlyExpenses === '' ||
    isNaN(Number(monthlyExpenses))
  ) {
    return {
      runwayMonths: null,
      formatted: 'Not configured',
      status: 'unknown',
      isCalculated: false
    };
  }

  const expenses = Number(monthlyExpenses);
  if (expenses <= 0) {
    return {
      runwayMonths: null,
      formatted: 'N/A (Missing or zero expenses)',
      status: 'unknown',
      isCalculated: false
    };
  }

  if (
    cashReserves === null ||
    cashReserves === undefined ||
    cashReserves === '' ||
    isNaN(Number(cashReserves))
  ) {
    return {
      runwayMonths: null,
      formatted: 'Not configured',
      status: 'unknown',
      isCalculated: false
    };
  }

  const reserves = Number(cashReserves);
  if (reserves < 0) {
    return {
      runwayMonths: null,
      formatted: 'Not configured',
      status: 'unknown',
      isCalculated: false
    };
  }

  const runway = reserves / expenses;
  const rounded = Math.round(runway * 10) / 10;

  let status = 'healthy';
  if (rounded < 3) {
    status = 'critical';
  } else if (rounded < 6) {
    status = 'caution';
  }

  return {
    runwayMonths: rounded,
    formatted: `${rounded.toFixed(1)} months`,
    status,
    isCalculated: true
  };
}

/**
 * Calculate Technology / Enterprise Budget Utilization Rate
 * Formula: (Actual Spending / Approved Budget) * 100
 */
export function calculateBudgetUtilization(actualSpending, approvedBudget) {
  if (
    approvedBudget === null ||
    approvedBudget === undefined ||
    approvedBudget === '' ||
    isNaN(Number(approvedBudget))
  ) {
    return {
      percentage: null,
      formatted: 'Not configured',
      status: 'unknown',
      isCalculated: false
    };
  }

  const budget = Number(approvedBudget);
  if (budget <= 0) {
    return {
      percentage: null,
      formatted: 'N/A (Budget not configured)',
      status: 'unknown',
      isCalculated: false
    };
  }

  if (
    actualSpending === null ||
    actualSpending === undefined ||
    actualSpending === '' ||
    isNaN(Number(actualSpending))
  ) {
    return {
      percentage: null,
      formatted: 'Not configured',
      status: 'unknown',
      isCalculated: false
    };
  }

  const spending = Number(actualSpending);
  if (spending < 0) {
    return {
      percentage: null,
      formatted: 'Not configured',
      status: 'unknown',
      isCalculated: false
    };
  }

  const pct = (spending / budget) * 100;
  const rounded = Math.round(pct * 100) / 100;
  const formatted = (rounded % 1 === 0 || Math.round(rounded * 10) === rounded * 10)
    ? `${rounded.toFixed(1)}%`
    : `${rounded}%`;

  let status = 'on_track';
  if (rounded > 100) {
    status = 'over_budget';
  } else if (rounded >= 85) {
    status = 'warning';
  }

  return {
    percentage: rounded,
    formatted,
    status,
    isCalculated: true
  };
}

/**
 * Calculate Student / Personal Savings Rate
 * Formula: (Monthly Savings / Monthly Income) * 100
 */
export function calculateSavingsRate(monthlySavings, monthlyIncome) {
  if (
    monthlyIncome === null ||
    monthlyIncome === undefined ||
    monthlyIncome === '' ||
    isNaN(Number(monthlyIncome))
  ) {
    return {
      rate: null,
      formatted: 'Not configured',
      isCalculated: false
    };
  }

  const income = Number(monthlyIncome);
  if (income <= 0) {
    return {
      rate: null,
      formatted: 'Not calculable',
      isCalculated: false
    };
  }

  if (
    monthlySavings === null ||
    monthlySavings === undefined ||
    monthlySavings === '' ||
    isNaN(Number(monthlySavings))
  ) {
    return {
      rate: null,
      formatted: 'Not configured',
      isCalculated: false
    };
  }

  const savings = Number(monthlySavings);
  if (savings < 0) {
    return {
      rate: null,
      formatted: 'Not configured',
      isCalculated: false
    };
  }

  const rate = (savings / income) * 100;
  const rounded = Math.round(rate * 100) / 100;
  const formatted = (rounded % 1 === 0 || Math.round(rounded * 10) === rounded * 10)
    ? `${rounded.toFixed(1)}%`
    : `${rounded}%`;

  return {
    rate: rounded,
    formatted,
    isCalculated: true
  };
}

/**
 * Calculate Net Financial Position (Assets vs Liabilities)
 * Formula: (Investments + Cash Reserves) - (Short-Term Liabilities + Long-Term Liabilities)
 */
export function calculateNetFinancialPosition(
  portfolioValue = 0,
  cashReserves = 0,
  shortTermLiabilities = null,
  longTermLiabilities = null,
  currency = 'INR'
) {
  const pVal = Math.max(0, Number(portfolioValue) || 0);
  const cRes = Math.max(0, Number(cashReserves) || 0);
  const totalAssets = pVal + cRes;

  const isShortTermNull = shortTermLiabilities === null || shortTermLiabilities === undefined || shortTermLiabilities === '';
  const isLongTermNull = longTermLiabilities === null || longTermLiabilities === undefined || longTermLiabilities === '';

  const sLiab = isShortTermNull ? 0 : Math.max(0, Number(shortTermLiabilities) || 0);
  const lLiab = isLongTermNull ? 0 : Math.max(0, Number(longTermLiabilities) || 0);
  const totalLiabilities = sLiab + lLiab;
  const netPosition = totalAssets - totalLiabilities;
  const isPositive = netPosition >= 0;

  let status = 'verified';
  let badgeText = 'Verified';
  let isVerified = true;

  if (isShortTermNull && isLongTermNull) {
    status = 'unverified';
    badgeText = 'Liabilities Not Configured';
    isVerified = false;
  } else if (isShortTermNull || isLongTermNull) {
    status = 'incomplete';
    badgeText = 'Liabilities Incomplete';
    isVerified = false;
  }

  return {
    totalAssets,
    totalLiabilities,
    netPosition,
    formatted: formatCurrency(netPosition, currency),
    isPositive,
    isVerified,
    status,
    badgeText
  };
}

/**
 * Calculate Financial Goal Completion Metrics
 */
export function calculateGoalCompletion(current = 0, target = 0) {
  const cur = Math.max(0, Number(current) || 0);
  const tgt = Math.max(0, Number(target) || 0);

  if (tgt === 0) {
    return {
      percentage: 0,
      formatted: '0%',
      remaining: 0,
      isCompleted: false
    };
  }

  const pct = Math.round((cur / tgt) * 100);
  const remaining = Math.max(0, tgt - cur);

  return {
    percentage: pct,
    formatted: `${pct}%`,
    remaining,
    isCompleted: cur >= tgt
  };
}

/**
 * Calculate market / equity exposure
 */
export function calculateMarketExposure(investments = []) {
  if (!Array.isArray(investments) || investments.length === 0) return '0%';

  const totalValue = calculatePortfolioValue(investments);
  if (totalValue === 0) return '0%';

  const equityTypes = ['Stocks', 'Mutual Funds', 'ETFs', 'Crypto', 'Cryptocurrency'];
  const equityValue = investments.reduce((sum, inv) => {
    if (!inv || typeof inv !== 'object') return sum;
    if (equityTypes.includes(inv.type)) {
      const val = calculateInvestmentValuation(inv).currentValue;
      return sum + val;
    }
    return sum;
  }, 0);

  const pct = Math.round((equityValue / totalValue) * 100);
  return `${pct}%`;
}

/**
 * Calculate Technology Sector Exposure Percentage
 * Formula: (Technology Investment Market Value / Total Portfolio Market Value) * 100
 */
export function calculateTechSectorExposure(investments = []) {
  if (!Array.isArray(investments) || investments.length === 0) {
    return {
      percentage: 0,
      formatted: '0%',
      techValue: 0,
      totalValue: 0
    };
  }

  const totalValue = calculatePortfolioValue(investments);
  if (totalValue === 0) {
    return {
      percentage: 0,
      formatted: '0%',
      techValue: 0,
      totalValue: 0
    };
  }

  const techValue = investments.reduce((sum, inv) => {
    if (!inv || typeof inv !== 'object') return sum;
    const sector = (inv.sector || '').trim().toLowerCase();
    const type = (inv.type || '').trim().toLowerCase();

    const isTech = sector.includes('tech') ||
      sector.includes('software') ||
      sector.includes('saas') ||
      sector.includes('cloud') ||
      sector.includes('it') ||
      type === 'technology' ||
      inv.isTech === true;

    if (isTech) {
      const val = calculateInvestmentValuation(inv).currentValue;
      return sum + val;
    }
    return sum;
  }, 0);

  const pct = (techValue / totalValue) * 100;
  const rounded = Math.round(pct * 10) / 10;
  const formatted = rounded === 0 ? '0%' : (rounded % 1 === 0 ? `${rounded.toFixed(0)}%` : `${rounded.toFixed(1)}%`);

  return {
    percentage: rounded,
    formatted,
    techValue,
    totalValue
  };
}

/**
 * Calculate portfolio rebalancing trades to reach target asset allocations
 * 
 * @param {Array} investments - Array of investment objects with { type, currentValue, investedAmount }
 * @param {Object} targets - Object mapping asset type string to target percentage (e.g. { 'Stocks': 50, 'Bonds': 50 })
 * @param {Object} options - Configuration options:
 *   - allowSell {boolean}: if true (default), sells overweight assets to buy underweight assets.
 *                          if false, only buys underweight assets using newCash.
 *   - newCash {number}: amount of fresh cash contribution (defaults to 0).
 * 
 * @returns {Object} Result object containing:
 *   - isValid {boolean}
 *   - error {string|null}
 *   - trades {Array}: [{ assetType, action: 'BUY'|'SELL', amount, currentAmount, targetAmount, currentPercentage, targetPercentage, postPercentage, postAmount }]
 *   - totalCurrentValue {number}
 *   - totalPostValue {number}
 *   - newCash {number}
 *   - unallocatedCash {number}
 *   - maxDriftBefore {number}
 *   - maxDriftAfter {number}
 *   - allowSell {boolean}
 */
export function calculateRebalanceTrades(investments = [], targets = {}, options = {}) {
  // 1. Validate targets input
  if (!targets || typeof targets !== 'object' || Array.isArray(targets)) {
    return {
      isValid: false,
      error: 'Target allocations are required and must be provided as an object mapping asset types to percentages.',
      trades: [],
      totalCurrentValue: 0,
      totalPostValue: 0,
      newCash: 0,
      unallocatedCash: 0,
      maxDriftBefore: 0,
      maxDriftAfter: 0,
      allowSell: options.allowSell !== false
    };
  }

  const targetKeys = Object.keys(targets);
  if (targetKeys.length === 0) {
    return {
      isValid: false,
      error: 'Target allocations must not be empty and must sum to 100%.',
      trades: [],
      totalCurrentValue: 0,
      totalPostValue: 0,
      newCash: 0,
      unallocatedCash: 0,
      maxDriftBefore: 0,
      maxDriftAfter: 0,
      allowSell: options.allowSell !== false
    };
  }

  let totalTargetPct = 0;
  const normalizedTargets = {};

  for (const key of targetKeys) {
    const val = targets[key];
    const num = Number(val);
    if (isNaN(num) || num < 0) {
      return {
        isValid: false,
        error: `Target allocation for ${key} must be a non-negative number.`,
        trades: [],
        totalCurrentValue: 0,
        totalPostValue: 0,
        newCash: 0,
        unallocatedCash: 0,
        maxDriftBefore: 0,
        maxDriftAfter: 0,
        allowSell: options.allowSell !== false
      };
    }
    normalizedTargets[key] = num;
    totalTargetPct += num;
  }

  // Check if targets sum to 100% (allowing small floating point tolerance <= 0.05%)
  const roundedTargetSum = Math.round(totalTargetPct * 10) / 10;
  if (Math.abs(totalTargetPct - 100) > 0.05) {
    return {
      isValid: false,
      error: `Target allocations must sum to 100% (currently ${roundedTargetSum}%).`,
      trades: [],
      totalCurrentValue: 0,
      totalPostValue: 0,
      newCash: 0,
      unallocatedCash: 0,
      maxDriftBefore: 0,
      maxDriftAfter: 0,
      targetSum: roundedTargetSum,
      allowSell: options.allowSell !== false
    };
  }

  // 2. Options extraction
  const allowSell = options.allowSell !== false;
  const newCash = Math.max(0, Number(options.newCash) || 0);

  // 3. Compute current value per asset type from investments
  const currentByType = {};
  let totalCurrentValue = 0;

  if (Array.isArray(investments) && investments.length > 0) {
    investments.forEach((inv) => {
      if (!inv || typeof inv !== 'object') return;
      const type = inv.type || 'Other';
      const val = calculateInvestmentValuation(inv).currentValue;
      currentByType[type] = (currentByType[type] || 0) + val;
      totalCurrentValue += val;
    });
  }

  // 4. Collect union of all asset types (from targets and existing investments)
  const allAssetTypes = Array.from(new Set([
    ...Object.keys(normalizedTargets),
    ...Object.keys(currentByType)
  ]));

  // Calculate current drift before rebalancing
  let maxDriftBefore = 0;
  allAssetTypes.forEach((type) => {
    const currVal = currentByType[type] || 0;
    const currPct = totalCurrentValue > 0 ? (currVal / totalCurrentValue) * 100 : 0;
    const targetPct = normalizedTargets[type] || 0;
    const drift = Math.abs(currPct - targetPct);
    if (drift > maxDriftBefore) {
      maxDriftBefore = drift;
    }
  });

  // Edge case: empty portfolio or total value 0 and newCash is 0
  if (totalCurrentValue === 0 && newCash === 0) {
    return {
      isValid: true,
      error: null,
      trades: [],
      totalCurrentValue: 0,
      totalPostValue: 0,
      newCash: 0,
      unallocatedCash: 0,
      maxDriftBefore: 0,
      maxDriftAfter: 0,
      allowSell
    };
  }

  const rawTrades = [];
  let unallocatedCash = 0;
  let totalPostValue = totalCurrentValue + newCash;
  const postValueByType = {};

  if (allowSell) {
    // -------------------------------------------------------------
    // Full rebalance mode (allowSell = true):
    // Standard rebalance based on total portfolio value (totalCurrentValue + newCash)
    // -------------------------------------------------------------
    allAssetTypes.forEach((type) => {
      const currVal = currentByType[type] || 0;
      const targetPct = normalizedTargets[type] || 0;
      const targetVal = totalPostValue * (targetPct / 100);
      const diff = targetVal - currVal;

      postValueByType[type] = targetVal;

      if (diff > 0.5) {
        rawTrades.push({
          assetType: type,
          action: 'BUY',
          amount: Math.round(diff),
          currentAmount: Math.round(currVal),
          targetAmount: Math.round(targetVal),
          currentPercentage: totalCurrentValue > 0 ? Number(((currVal / totalCurrentValue) * 100).toFixed(1)) : 0,
          targetPercentage: Number(targetPct.toFixed(1)),
          postPercentage: Number(targetPct.toFixed(1)),
          postAmount: Math.round(targetVal)
        });
      } else if (diff < -0.5) {
        rawTrades.push({
          assetType: type,
          action: 'SELL',
          amount: Math.round(Math.abs(diff)),
          currentAmount: Math.round(currVal),
          targetAmount: Math.round(targetVal),
          currentPercentage: totalCurrentValue > 0 ? Number(((currVal / totalCurrentValue) * 100).toFixed(1)) : 0,
          targetPercentage: Number(targetPct.toFixed(1)),
          postPercentage: Number(targetPct.toFixed(1)),
          postAmount: Math.round(targetVal)
        });
      }
    });
  } else {
    // -------------------------------------------------------------
    // Buy-only mode (allowSell = false):
    // Use newCash to buy underweight assets only, never selling.
    // -------------------------------------------------------------
    if (totalCurrentValue === 0) {
      // If portfolio is empty but newCash > 0, allocate newCash by target %
      allAssetTypes.forEach((type) => {
        const targetPct = normalizedTargets[type] || 0;
        const buyAmt = Math.round(newCash * (targetPct / 100));
        postValueByType[type] = buyAmt;

        if (buyAmt > 0) {
          rawTrades.push({
            assetType: type,
            action: 'BUY',
            amount: buyAmt,
            currentAmount: 0,
            targetAmount: buyAmt,
            currentPercentage: 0,
            targetPercentage: Number(targetPct.toFixed(1)),
            postPercentage: Number(targetPct.toFixed(1)),
            postAmount: buyAmt
          });
        }
      });
      const totalBought = rawTrades.reduce((sum, t) => sum + t.amount, 0);
      unallocatedCash = Math.max(0, Math.round(newCash - totalBought));
    } else if (newCash === 0) {
      // No cash to buy anything, holdings remain unchanged
      allAssetTypes.forEach((type) => {
        postValueByType[type] = currentByType[type] || 0;
      });
      unallocatedCash = 0;
    } else {
      // Determine shortfalls against ideal target in (totalCurrentValue + newCash)
      const shortfalls = {};
      let totalShortfall = 0;

      allAssetTypes.forEach((type) => {
        const currVal = currentByType[type] || 0;
        const targetPct = normalizedTargets[type] || 0;
        const targetVal = totalPostValue * (targetPct / 100);
        const shortfall = Math.max(0, targetVal - currVal);
        shortfalls[type] = shortfall;
        totalShortfall += shortfall;
      });

      if (totalShortfall <= 0) {
        // No assets are underweight relative to target in expanded portfolio
        allAssetTypes.forEach((type) => {
          postValueByType[type] = currentByType[type] || 0;
        });
        unallocatedCash = Math.round(newCash);
      } else {
        const scale = totalShortfall > 0 ? Math.min(1, newCash / totalShortfall) : 0;
        let cashAllocated = 0;
        const plannedBuys = [];

        allAssetTypes.forEach((type) => {
          const sf = shortfalls[type] || 0;
          if (sf > 0.5) {
            const rawBuy = sf * scale;
            const roundedBuy = Math.round(rawBuy);
            if (roundedBuy > 0) {
              cashAllocated += roundedBuy;
              plannedBuys.push({
                type,
                amount: roundedBuy,
                rawAmount: rawBuy
              });
            }
          }
        });

        // Ensure rounding doesn't exceed newCash
        let diffRounding = cashAllocated - Math.round(newCash);
        if (diffRounding > 0 && plannedBuys.length > 0) {
          plannedBuys.sort((a, b) => b.amount - a.amount);
          for (let i = 0; i < plannedBuys.length && diffRounding > 0; i++) {
            const reduction = Math.min(diffRounding, plannedBuys[i].amount);
            plannedBuys[i].amount -= reduction;
            diffRounding -= reduction;
          }
        }

        const totalUsedCash = plannedBuys.reduce((sum, b) => sum + b.amount, 0);
        unallocatedCash = Math.max(0, Math.round(newCash - totalUsedCash));

        const buyMap = {};
        plannedBuys.forEach((b) => {
          if (b.amount > 0) {
            buyMap[b.type] = b.amount;
          }
        });

        // Compute actual post values
        let actualPostTotal = 0;
        allAssetTypes.forEach((type) => {
          const currVal = currentByType[type] || 0;
          const buyAmt = buyMap[type] || 0;
          const postVal = currVal + buyAmt;
          postValueByType[type] = postVal;
          actualPostTotal += postVal;
        });
        totalPostValue = actualPostTotal;

        // Build trades
        allAssetTypes.forEach((type) => {
          const currVal = currentByType[type] || 0;
          const buyAmt = buyMap[type] || 0;
          const targetPct = normalizedTargets[type] || 0;
          const postVal = postValueByType[type];
          const postPct = totalPostValue > 0 ? (postVal / totalPostValue) * 100 : 0;

          if (buyAmt > 0) {
            rawTrades.push({
              assetType: type,
              action: 'BUY',
              amount: buyAmt,
              currentAmount: Math.round(currVal),
              targetAmount: Math.round(totalPostValue * (targetPct / 100)),
              currentPercentage: totalCurrentValue > 0 ? Number(((currVal / totalCurrentValue) * 100).toFixed(1)) : 0,
              targetPercentage: Number(targetPct.toFixed(1)),
              postPercentage: Number(postPct.toFixed(1)),
              postAmount: Math.round(postVal)
            });
          }
        });
      }
    }
  }

  // Calculate drift after rebalancing
  let maxDriftAfter = 0;
  const allocationsAfter = allAssetTypes.map((type) => {
    const postVal = postValueByType[type] || 0;
    const postPct = totalPostValue > 0 ? (postVal / totalPostValue) * 100 : 0;
    const targetPct = normalizedTargets[type] || 0;
    const drift = Math.abs(postPct - targetPct);
    if (drift > maxDriftAfter) {
      maxDriftAfter = drift;
    }
    return {
      name: type,
      value: Math.round(postVal),
      percentage: Math.round(postPct * 10) / 10,
      target: Math.round(targetPct * 10) / 10,
      color: ASSET_COLORS[type] || ASSET_COLORS['Other']
    };
  });

  // Sort trades: Sells first, then Buys, largest amount first
  rawTrades.sort((a, b) => {
    if (a.action !== b.action) {
      return a.action === 'SELL' ? -1 : 1;
    }
    return b.amount - a.amount;
  });

  return {
    isValid: true,
    error: null,
    trades: rawTrades,
    totalCurrentValue: Math.round(totalCurrentValue),
    totalPostValue: Math.round(totalPostValue),
    newCash: Math.round(newCash),
    unallocatedCash: Math.round(unallocatedCash),
    maxDriftBefore: Math.round(maxDriftBefore * 10) / 10,
    maxDriftAfter: Math.round(maxDriftAfter * 10) / 10,
    allowSell,
    allocationsAfter
  };
}
