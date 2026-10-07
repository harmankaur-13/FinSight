import React, { useState, useMemo, useEffect } from 'react';
import {
  calculateRebalanceTrades,
  calculateAssetAllocations,
  calculateAllocationDrift,
  formatCurrency,
  ASSET_COLORS
} from '../utils/financialCalculations';

const STANDARD_ASSET_TYPES = [
  'Stocks',
  'Mutual Funds',
  'ETFs',
  'Bonds',
  'Crypto',
  'Real Estate',
  'Other'
];

export default function RebalanceEngine({
  investments = [],
  monthlySavings = null,
  onOpenManageModal = null
}) {
  const hasInvestments = Array.isArray(investments) && investments.length > 0;

  // Compute current asset allocations from investments
  const currentAllocations = useMemo(() => {
    return calculateAssetAllocations(investments);
  }, [investments]);

  // Determine active asset types present in holdings or defaults
  const activeHoldingTypes = useMemo(() => {
    if (currentAllocations.length > 0) {
      return currentAllocations.map((a) => a.name);
    }
    return ['Stocks', 'Bonds', 'Crypto'];
  }, [currentAllocations]);

  // Initialize target allocations from investments or sensible defaults
  const [targets, setTargets] = useState(() => {
    const initial = {};
    let configuredSum = 0;

    if (Array.isArray(investments) && investments.length > 0) {
      investments.forEach((inv) => {
        const type = inv.type || 'Other';
        if (inv.targetAllocation !== null && inv.targetAllocation !== undefined && inv.targetAllocation !== '') {
          const num = Number(inv.targetAllocation);
          if (!isNaN(num) && num > 0) {
            initial[type] = (initial[type] || 0) + num;
            configuredSum += num;
          }
        }
      });
    }

    if (configuredSum > 0 && Math.abs(configuredSum - 100) < 0.5) {
      return initial;
    }

    // Default student targets (60% Equities/Stocks, 25% Bonds, 15% Crypto)
    return {
      'Stocks': 60,
      'Bonds': 25,
      'Crypto': 15
    };
  });

  // State for rebalance options
  const [allowSell, setAllowSell] = useState(true);
  const [newCash, setNewCash] = useState(0);
  const [selectedAssetToAdd, setSelectedAssetToAdd] = useState('');

  // Update targets if investments change and have explicit target allocations
  useEffect(() => {
    if (!hasInvestments) return;
    const fromHoldings = {};
    let configuredSum = 0;
    investments.forEach((inv) => {
      const type = inv.type || 'Other';
      if (inv.targetAllocation !== null && inv.targetAllocation !== undefined && inv.targetAllocation !== '') {
        const num = Number(inv.targetAllocation);
        if (!isNaN(num) && num > 0) {
          fromHoldings[type] = (fromHoldings[type] || 0) + num;
          configuredSum += num;
        }
      }
    });

    if (configuredSum > 0 && Math.abs(configuredSum - 100) < 0.5) {
      setTargets(fromHoldings);
    }
  }, [investments, hasInvestments]);

  // Target Sum Calculation & Validation
  const targetSum = useMemo(() => {
    const sum = Object.values(targets).reduce((acc, val) => {
      const n = Number(val);
      return acc + (isNaN(n) ? 0 : n);
    }, 0);
    return Math.round(sum * 10) / 10;
  }, [targets]);

  const isTargetSumValid = Math.abs(targetSum - 100) < 0.05;

  // Handle target input change
  const handleTargetChange = (assetType, value) => {
    setTargets((prev) => {
      const next = { ...prev };
      if (value === '' || value === null) {
        next[assetType] = '';
      } else {
        const num = parseFloat(value);
        next[assetType] = isNaN(num) ? 0 : Math.max(0, num);
      }
      return next;
    });
  };

  // Remove asset type from target editor
  const handleRemoveTargetAsset = (assetType) => {
    setTargets((prev) => {
      const next = { ...prev };
      delete next[assetType];
      return next;
    });
  };

  // Add new asset type to target editor
  const handleAddTargetAsset = () => {
    if (!selectedAssetToAdd) return;
    setTargets((prev) => ({
      ...prev,
      [selectedAssetToAdd]: prev[selectedAssetToAdd] !== undefined ? prev[selectedAssetToAdd] : 0
    }));
    setSelectedAssetToAdd('');
  };

  // Quick Preset Handlers
  const applyPreset = (presetName) => {
    if (presetName === 'balanced') {
      setTargets({ 'Stocks': 60, 'Bonds': 25, 'Crypto': 15 });
    } else if (presetName === 'growth') {
      setTargets({ 'Stocks': 70, 'Mutual Funds': 15, 'Bonds': 15 });
    } else if (presetName === 'conservative') {
      setTargets({ 'Stocks': 40, 'Bonds': 40, 'Mutual Funds': 20 });
    } else if (presetName === 'equal') {
      const types = Object.keys(targets);
      if (types.length === 0) return;
      const equalShare = Math.floor(100 / types.length);
      const remainder = 100 - equalShare * types.length;
      const next = {};
      types.forEach((t, i) => {
        next[t] = equalShare + (i === 0 ? remainder : 0);
      });
      setTargets(next);
    }
  };

  // Execute Rebalance Calculation
  const rebalanceResult = useMemo(() => {
    // Clean targets for calculation (convert empty strings to 0)
    const cleanedTargets = {};
    Object.entries(targets).forEach(([k, v]) => {
      cleanedTargets[k] = v === '' ? 0 : Number(v);
    });

    return calculateRebalanceTrades(investments, cleanedTargets, {
      allowSell,
      newCash
    });
  }, [investments, targets, allowSell, newCash]);

  // Calculate Drift before using existing helper
  const driftBeforeHelper = useMemo(() => {
    return calculateAllocationDrift(investments, currentAllocations);
  }, [investments, currentAllocations]);

  const driftBeforeFormatted = useMemo(() => {
    if (rebalanceResult.maxDriftBefore !== undefined) {
      return `${rebalanceResult.maxDriftBefore.toFixed(1)}%`;
    }
    return driftBeforeHelper.value || '0.0%';
  }, [rebalanceResult.maxDriftBefore, driftBeforeHelper]);

  const driftAfterFormatted = useMemo(() => {
    if (rebalanceResult.isValid && rebalanceResult.maxDriftAfter !== undefined) {
      return `${rebalanceResult.maxDriftAfter.toFixed(1)}%`;
    }
    return '0.0%';
  }, [rebalanceResult]);

  // Clean parsed monthly savings for quick fill button
  const parsedMonthlySavings = useMemo(() => {
    if (!monthlySavings || monthlySavings === 'Not provided') return null;
    const num = typeof monthlySavings === 'number'
      ? monthlySavings
      : parseFloat(String(monthlySavings).replace(/[^0-9.]/g, ''));
    return !isNaN(num) && num > 0 ? num : null;
  }, [monthlySavings]);

  const allDisplayAssetTypes = useMemo(() => {
    const set = new Set([...Object.keys(targets), ...activeHoldingTypes]);
    return Array.from(set);
  }, [targets, activeHoldingTypes]);

  const availableTypesToAdd = useMemo(() => {
    const existing = Object.keys(targets);
    return STANDARD_ASSET_TYPES.filter((t) => !existing.includes(t));
  }, [targets]);

  return (
    <div className="panel-card rebalance-engine-card" id="rebalance-engine">
      <div className="panel-header">
        <div className="rebalance-header-title-wrap">
          <span className="eyebrow eyebrow-green" style={{ display: 'inline-block', marginBottom: '6px' }}>PORTFOLIO REBALANCING ENGINE</span>
          <h3 className="panel-title">Target Rebalancing & Trade Planner</h3>
          <span className="panel-subtitle">
            Calculate exact BUY / SELL trade amounts or fresh contribution plans to align with target asset allocation
          </span>
        </div>
      </div>

      {!hasInvestments ? (
        <div className="empty-state-box rebalance-empty-state">
          <div className="empty-icon-circle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h4>No Investments in Portfolio</h4>
          <p>
            Add your assets in Portfolio Management to calculate target drift, trade sizes, and cash rebalancing plans.
          </p>
          {onOpenManageModal && (
            <button
              type="button"
              className="btn btn-primary btn-small"
              onClick={() => onOpenManageModal('investments')}
            >
              + Add Your First Investment
            </button>
          )}
        </div>
      ) : (
        <div className="rebalance-body">
          {/* Top Control Grid: Target Editor + Rebalancing Settings */}
          <div className="rebalance-controls-grid">
            {/* Left: Target Allocation Editor */}
            <div className="rebalance-section-box">
              <div className="rebalance-sub-header">
                <div>
                  <h4 className="rebalance-sub-title">Target Allocation Editor</h4>
                  <span className="rebalance-sub-desc">Adjust desired portfolio percentage per asset class</span>
                </div>
                {/* Live Total Indicator */}
                <div
                  className={`target-total-badge ${isTargetSumValid ? 'valid' : 'invalid'}`}
                  title={isTargetSumValid ? 'Target allocation equals 100%' : `Target allocations sum to ${targetSum}%. Must equal 100%.`}
                >
                  <span className="target-total-dot" />
                  <span className="target-total-text">
                    Total: <strong>{targetSum}%</strong>
                  </span>
                  {isTargetSumValid ? (
                    <span className="target-total-status">✓ 100% OK</span>
                  ) : (
                    <span className="target-total-status">
                      {targetSum > 100 ? `(+${(targetSum - 100).toFixed(1)}%)` : `(-${(100 - targetSum).toFixed(1)}%)`}
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Presets */}
              <div className="rebalance-presets-row">
                <span className="presets-label">Presets:</span>
                <button
                  type="button"
                  className="preset-btn"
                  onClick={() => applyPreset('balanced')}
                >
                  60/25/15 Balanced
                </button>
                <button
                  type="button"
                  className="preset-btn"
                  onClick={() => applyPreset('growth')}
                >
                  70/15/15 Growth
                </button>
                <button
                  type="button"
                  className="preset-btn"
                  onClick={() => applyPreset('conservative')}
                >
                  40/40/20 Shield
                </button>
                <button
                  type="button"
                  className="preset-btn"
                  onClick={() => applyPreset('equal')}
                >
                  Equal Weight
                </button>
              </div>

              {/* Target Inputs List */}
              <div className="target-inputs-list">
                {allDisplayAssetTypes.map((type) => {
                  const currAlloc = currentAllocations.find((a) => a.name === type);
                  const currPct = currAlloc ? currAlloc.percentage : 0;
                  const targetVal = targets[type] !== undefined ? targets[type] : '';
                  const color = ASSET_COLORS[type] || ASSET_COLORS['Other'];

                  return (
                    <div key={type} className="target-input-row">
                      <div className="target-asset-meta">
                        <span className="asset-color-dot" style={{ backgroundColor: color }} />
                        <span className="target-asset-name">{type}</span>
                        <span className="target-asset-current">
                          Current: <strong>{currPct.toFixed(1)}%</strong>
                        </span>
                      </div>

                      <div className="target-input-wrapper">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          placeholder="0"
                          value={targetVal}
                          onChange={(e) => handleTargetChange(type, e.target.value)}
                          className="target-num-input"
                        />
                        <span className="target-input-unit">%</span>
                        {Object.keys(targets).length > 1 && (
                          <button
                            type="button"
                            className="target-remove-btn"
                            title={`Remove ${type} target`}
                            onClick={() => handleRemoveTargetAsset(type)}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Asset Class Dropdown */}
              {availableTypesToAdd.length > 0 && (
                <div className="add-target-asset-row">
                  <select
                    value={selectedAssetToAdd}
                    onChange={(e) => setSelectedAssetToAdd(e.target.value)}
                    className="fin-select select-small"
                  >
                    <option value="">+ Add Asset Category...</option>
                    {availableTypesToAdd.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {selectedAssetToAdd && (
                    <button
                      type="button"
                      className="btn btn-outline btn-small"
                      onClick={handleAddTargetAsset}
                    >
                      Add
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Right: Cash Contribution & Execution Strategy */}
            <div className="rebalance-section-box">
              <div className="rebalance-sub-header">
                <div>
                  <h4 className="rebalance-sub-title">Rebalancing Strategy & Cash</h4>
                  <span className="rebalance-sub-desc">Configure fresh cash injection and selling preferences</span>
                </div>
              </div>

              {/* Mode Toggle Switch */}
              <div className="rebalance-toggle-box">
                <div className="toggle-info">
                  <strong className="toggle-title">
                    {allowSell ? 'Full Rebalancing (Sell & Buy)' : 'Buy Only (No Selling)'}
                  </strong>
                  <p className="toggle-desc">
                    {allowSell
                      ? 'Sells overweight assets and buys underweight assets to reach exact target proportions.'
                      : 'Never sells any holdings. Directs fresh cash only to underweight assets to glide toward targets.'}
                  </p>
                </div>
                <label className="switch-toggle" aria-label="Toggle Buy Only mode">
                  <input
                    type="checkbox"
                    checked={!allowSell}
                    onChange={(e) => setAllowSell(!e.target.checked)}
                  />
                  <span className="slider round" />
                </label>
              </div>

              {/* Fresh Cash Contribution Controls */}
              <div className="cash-contribution-group">
                <div className="cash-header-row">
                  <label htmlFor="new-cash-input" className="field-label-bold">
                    Fresh Capital Contribution (₹)
                  </label>
                  <span className="cash-current-val">{formatCurrency(newCash)}</span>
                </div>

                <div className="cash-input-row">
                  <div className="currency-input-wrap">
                    <span className="currency-symbol">₹</span>
                    <input
                      id="new-cash-input"
                      type="number"
                      min="0"
                      step="500"
                      placeholder="0"
                      value={newCash || ''}
                      onChange={(e) => {
                        const v = e.target.value === '' ? 0 : parseFloat(e.target.value);
                        setNewCash(isNaN(v) ? 0 : Math.max(0, v));
                      }}
                      className="cash-num-input"
                    />
                  </div>
                  {newCash > 0 && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-small"
                      onClick={() => setNewCash(0)}
                    >
                      Reset ₹0
                    </button>
                  )}
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="500"
                  value={Math.min(50000, newCash)}
                  onChange={(e) => setNewCash(Number(e.target.value))}
                  className="fin-slider cash-slider"
                  aria-label="Fresh cash slider"
                />

                {/* Quick Cash Buttons */}
                <div className="quick-cash-chips">
                  {parsedMonthlySavings && (
                    <button
                      type="button"
                      className="cash-chip active-pace"
                      onClick={() => setNewCash(parsedMonthlySavings)}
                    >
                      + Monthly SIP ({formatCurrency(parsedMonthlySavings)})
                    </button>
                  )}
                  <button
                    type="button"
                    className="cash-chip"
                    onClick={() => setNewCash((c) => c + 2000)}
                  >
                    +₹2,000
                  </button>
                  <button
                    type="button"
                    className="cash-chip"
                    onClick={() => setNewCash((c) => c + 5000)}
                  >
                    +₹5,000
                  </button>
                  <button
                    type="button"
                    className="cash-chip"
                    onClick={() => setNewCash((c) => c + 10000)}
                  >
                    +₹10,000
                  </button>
                </div>
              </div>

              {/* Rebalance Summary Bar */}
              <div className="drift-summary-card">
                <div className="drift-summary-item">
                  <span className="summary-label">Max Drift Before</span>
                  <strong className="summary-val before">{driftBeforeFormatted}</strong>
                </div>
                <div className="drift-arrow">→</div>
                <div className="drift-summary-item">
                  <span className="summary-label">Max Drift After</span>
                  <strong className="summary-val after">{driftAfterFormatted}</strong>
                </div>
                <div className="drift-summary-item net-portfolio">
                  <span className="summary-label">Post-Rebalance Value</span>
                  <strong className="summary-val total">
                    {formatCurrency(rebalanceResult.totalPostValue || rebalanceResult.totalCurrentValue)}
                  </strong>
                </div>
              </div>

              {/* Unallocated Cash Alert in Buy-Only Mode */}
              {!allowSell && rebalanceResult.unallocatedCash > 0 && (
                <div className="unallocated-cash-callout">
                  <span className="callout-icon">ℹ</span>
                  <div>
                    <strong>{formatCurrency(rebalanceResult.unallocatedCash)} Unallocated Cash Remaining</strong>
                    <p>
                      Remaining cash could not be allocated without exceeding target weights. Target allocations cannot be fully reached without selling overweight assets.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Trade List Section */}
          <div className="rebalance-trades-section">
            <div className="trades-header-row">
              <div>
                <h4 className="rebalance-sub-title">Rebalancing Trade List</h4>
                <span className="rebalance-sub-desc">
                  Recommended order execution list sorted with sells first to free liquidity, then buys
                </span>
              </div>
              <div className="trades-count-badge">
                {rebalanceResult.trades ? rebalanceResult.trades.length : 0} Trades Planned
              </div>
            </div>

            {!isTargetSumValid ? (
              <div className="rebalance-error-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{rebalanceResult.error || `Target allocations must sum to 100% (currently ${targetSum}%).`}</span>
              </div>
            ) : rebalanceResult.trades && rebalanceResult.trades.length === 0 ? (
              <div className="balanced-state-box">
                <div className="balanced-icon">✓</div>
                <div>
                  <strong>Portfolio In Target Balance</strong>
                  <p>
                    All current holdings match your target allocations within tolerance. No rebalancing trades needed at this time.
                  </p>
                </div>
              </div>
            ) : (
              <div className="holdings-table-wrap">
                <table className="fin-table rebalance-table">
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>Asset Class</th>
                      <th>Trade Amount</th>
                      <th>Current Value</th>
                      <th>Target Value</th>
                      <th>Post-Rebalance %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rebalanceResult.trades.map((trade, idx) => {
                      const isBuy = trade.action === 'BUY';
                      const color = ASSET_COLORS[trade.assetType] || ASSET_COLORS['Other'];

                      return (
                        <tr key={`${trade.assetType}-${trade.action}-${idx}`}>
                          <td>
                            <span className={`trade-badge ${isBuy ? 'trade-buy' : 'trade-sell'}`}>
                              {isBuy ? '+ BUY' : '- SELL'}
                            </span>
                          </td>
                          <td>
                            <div className="trade-asset-cell">
                              <span className="asset-color-dot" style={{ backgroundColor: color }} />
                              <strong className="trade-asset-title">{trade.assetType}</strong>
                            </div>
                          </td>
                          <td>
                            <strong className={`trade-amount ${isBuy ? 'buy-text' : 'sell-text'}`}>
                              {formatCurrency(trade.amount)}
                            </strong>
                          </td>
                          <td style={{ color: 'var(--muted)' }}>
                            {formatCurrency(trade.currentAmount)} ({trade.currentPercentage}%)
                          </td>
                          <td style={{ color: 'var(--text)' }}>
                            {formatCurrency(trade.targetAmount)} ({trade.targetPercentage}%)
                          </td>
                          <td>
                            <div className="post-alloc-cell">
                              <strong style={{ color: 'var(--green-dark)' }}>{trade.postPercentage}%</strong>
                              <span className="post-alloc-sub">({formatCurrency(trade.postAmount)})</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
