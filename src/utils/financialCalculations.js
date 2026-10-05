// Reusable Financial Calculation & Utility Functions for FinSight

export const ASSET_COLORS = {
  'Stocks': '#276653',          // Deep forest green
  'Mutual Funds': '#3a7d68',    // Muted emerald
  'Crypto': '#b88746',          // Warm gold
  'Bonds': '#68736d',           // Slate sage
  'ETFs': '#8e9a93',            // Cool muted green
  'Real Estate': '#d4a359',     // Sand gold
  'Other': '#525c56'            // Deep olive slate
};

/**
 * Format currency in Indian notation
 */
export function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const num = Number(amount);
  return '₹' + num.toLocaleString('en-IN');
}

/**
 * Calculate total invested amount across all investments
 */
export function calculateTotalInvested(investments = []) {
  if (!Array.isArray(investments) || investments.length === 0) return 0;
  return investments.reduce((sum, inv) => {
    const amt = Number(inv.investedAmount);
    return sum + (isNaN(amt) ? 0 : amt);
  }, 0);
}

/**
 * Calculate total current portfolio value
 * Fallback to investedAmount if currentValue is missing
 */
export function calculatePortfolioValue(investments = []) {
  if (!Array.isArray(investments) || investments.length === 0) return 0;
  return investments.reduce((sum, inv) => {
    const val = inv.currentValue !== undefined && inv.currentValue !== null && inv.currentValue !== ''
      ? Number(inv.currentValue)
      : Number(inv.investedAmount);
    return sum + (isNaN(val) ? 0 : val);
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
 * Calculate asset allocations by asset type
 */
export function calculateAssetAllocations(investments = []) {
  if (!Array.isArray(investments) || investments.length === 0) return [];

  const totalValue = calculatePortfolioValue(investments);
  if (totalValue === 0) return [];

  const typeTotals = {};
  const typeTargets = {};

  investments.forEach((inv) => {
    const type = inv.type || 'Other';
    const val = inv.currentValue !== undefined && inv.currentValue !== null && inv.currentValue !== ''
      ? Number(inv.currentValue)
      : Number(inv.investedAmount);
    const validVal = isNaN(val) ? 0 : val;

    typeTotals[type] = (typeTotals[type] || 0) + validVal;
    if (inv.targetAllocation !== undefined && inv.targetAllocation !== null && inv.targetAllocation !== '') {
      typeTargets[type] = (typeTargets[type] || 0) + Number(inv.targetAllocation);
    }
  });

  const categories = Object.keys(typeTotals);
  return categories.map((cat) => {
    const val = typeTotals[cat];
    const pct = totalValue > 0 ? (val / totalValue) * 100 : 0;
    const roundedPct = Math.round(pct * 10) / 10;
    const target = typeTargets[cat] !== undefined ? Math.round(typeTargets[cat] * 10) / 10 : null;

    return {
      name: cat,
      percentage: roundedPct,
      target: target,
      value: val,
      color: ASSET_COLORS[cat] || ASSET_COLORS['Other']
    };
  }).sort((a, b) => b.percentage - a.percentage);
}

/**
 * Calculate allocation drift against target allocations
 */
export function calculateAllocationDrift(investments = [], allocations = []) {
  if (!Array.isArray(investments) || investments.length === 0) {
    return {
      driftText: 'Target allocation not configured',
      hasTarget: false,
      isConfigured: false,
      value: null
    };
  }

  // Check if any investment has target allocation configured
  const hasAnyTarget = investments.some(
    (inv) => inv.targetAllocation !== undefined && inv.targetAllocation !== null && inv.targetAllocation !== '' && Number(inv.targetAllocation) > 0
  );

  if (!hasAnyTarget) {
    return {
      driftText: 'Target allocation not configured',
      hasTarget: false,
      isConfigured: false,
      value: 'Not configured'
    };
  }

  const allocs = allocations.length > 0 ? allocations : calculateAssetAllocations(investments);
  let maxDrift = 0;

  allocs.forEach((a) => {
    if (a.target !== null && a.target !== undefined) {
      const diff = Math.abs(a.percentage - a.target);
      if (diff > maxDrift) maxDrift = diff;
    }
  });

  const roundedDrift = Math.round(maxDrift * 10) / 10;
  return {
    driftText: `${roundedDrift.toFixed(1)}% Drift`,
    hasTarget: true,
    isConfigured: true,
    value: `${roundedDrift.toFixed(1)}%`
  };
}

/**
 * Calculate formatted holdings list for Business & Tech dashboards
 */
export function calculateHoldings(investments = []) {
  if (!Array.isArray(investments) || investments.length === 0) return [];

  const totalValue = calculatePortfolioValue(investments);

  return investments.map((inv) => {
    const invested = Number(inv.investedAmount) || 0;
    const current = inv.currentValue !== undefined && inv.currentValue !== null && inv.currentValue !== ''
      ? Number(inv.currentValue)
      : invested;
    const diff = current - invested;
    const changePct = invested > 0 ? (diff / invested) * 100 : 0;
    const isPositive = diff >= 0;
    const allocationPct = totalValue > 0 ? ((current / totalValue) * 100).toFixed(1) + '%' : '0.0%';

    return {
      id: inv.id,
      company: inv.name || 'Unnamed Asset',
      symbol: inv.type || 'Asset',
      sector: inv.type || 'General',
      value: '₹' + current.toLocaleString('en-IN'),
      rawValue: current,
      investedAmount: invested,
      change: (isPositive ? '+' : '') + changePct.toFixed(1) + '%',
      isPositive,
      allocation: allocationPct,
      targetAllocation: inv.targetAllocation
    };
  });
}

/**
 * Calculate market / equity exposure
 */
export function calculateMarketExposure(investments = []) {
  if (!Array.isArray(investments) || investments.length === 0) return '0%';

  const totalValue = calculatePortfolioValue(investments);
  if (totalValue === 0) return '0%';

  const equityTypes = ['Stocks', 'Mutual Funds', 'ETFs', 'Crypto'];
  const equityValue = investments.reduce((sum, inv) => {
    if (equityTypes.includes(inv.type)) {
      const val = inv.currentValue !== undefined && inv.currentValue !== null && inv.currentValue !== ''
        ? Number(inv.currentValue)
        : Number(inv.investedAmount);
      return sum + (isNaN(val) ? 0 : val);
    }
    return sum;
  }, 0);

  const pct = Math.round((equityValue / totalValue) * 100);
  return `${pct}%`;
}
