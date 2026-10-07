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
      const type = inv.type || 'Other';
      const val = inv.currentValue !== undefined && inv.currentValue !== null && inv.currentValue !== ''
        ? Number(inv.currentValue)
        : Number(inv.investedAmount);
      const validVal = isNaN(val) || val < 0 ? 0 : val;
      currentByType[type] = (currentByType[type] || 0) + validVal;
      totalCurrentValue += validVal;
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
