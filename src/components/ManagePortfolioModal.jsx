import React, { useState, useEffect, useMemo } from 'react';
import { ASSET_TYPES, calculateInvestmentValuation } from '../utils/financialCalculations';
import './ManagePortfolioModal.css';

// Quick suggestions for rapid user entry
const QUICK_ASSETS = [
  { name: 'Nifty 50 Index Fund', type: 'Mutual Funds' },
  { name: 'Reliance Industries', type: 'Stocks' },
  { name: 'HDFC Bank', type: 'Stocks' },
  { name: 'Govt 10Y Sovereign Bond', type: 'Bonds' },
  { name: 'Sovereign Gold Bond', type: 'Gold' },
  { name: 'Bitcoin', type: 'Crypto' }
];

const SAVINGS_PRESETS = [1000, 2500, 5000, 10000, 25000];

const QUICK_GOALS = [
  { title: 'Emergency Reserve (6 Months)', target: 150000 },
  { title: 'First ₹1 Lakh Wealth Milestone', target: 100000 },
  { title: 'Annual Travel Fund', target: 60000 },
  { title: 'House Down Payment Fund', target: 500000 }
];

function formatINRPreview(val) {
  const num = parseFloat(val);
  if (isNaN(num) || num < 0) return '';
  return '₹' + num.toLocaleString('en-IN');
}

export default function ManagePortfolioModal({
  isOpen,
  onClose,
  financialData,
  onAddInvestment,
  onUpdateInvestment,
  onDeleteInvestment,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
  onUpdateMonthlySavings,
  initialTab = 'investments'
}) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Investment form state
  const [invEditingId, setInvEditingId] = useState(null);
  const [invName, setInvName] = useState('');
  const [invType, setInvType] = useState('Stocks');
  const [invSector, setInvSector] = useState('Technology');
  const [invValuationMethod, setInvValuationMethod] = useState('manual');
  const [invQuantity, setInvQuantity] = useState('');
  const [invPurchasePrice, setInvPurchasePrice] = useState('');
  const [invCurrentPrice, setInvCurrentPrice] = useState('');
  const [invInvested, setInvInvested] = useState('');
  const [invCurrent, setInvCurrent] = useState('');
  const [invTargetAlloc, setInvTargetAlloc] = useState('');
  const [invError, setInvError] = useState('');

  // Monthly savings state
  const [savingsInput, setSavingsInput] = useState(financialData?.monthlySavings || '');
  const [savingsSavedMsg, setSavingsSavedMsg] = useState(false);

  // Goal form state
  const [goalEditingId, setGoalEditingId] = useState(null);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalError, setGoalError] = useState('');

  // Sync savingsInput with financialData when opened
  useEffect(() => {
    if (financialData?.monthlySavings !== undefined) {
      setSavingsInput(financialData.monthlySavings ?? '');
    }
  }, [financialData?.monthlySavings, isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const investments = financialData?.investments || [];
  const goals = financialData?.goals || [];

  // Computed Portfolio Metrics
  const portfolioSummary = useMemo(() => {
    let investedSum = 0;
    let currentSum = 0;
    let targetSum = 0;

    investments.forEach((inv) => {
      if (!inv || typeof inv !== 'object') return;
      const valuation = calculateInvestmentValuation(inv);
      const target = parseFloat(inv.targetAllocation) || 0;

      investedSum += valuation.investedAmount;
      currentSum += valuation.currentValue;
      targetSum += target;
    });

    const gainLoss = currentSum - investedSum;
    const gainLossPct = investedSum > 0 ? (gainLoss / investedSum) * 100 : 0;

    return {
      investedSum,
      currentSum,
      gainLoss,
      gainLossPct,
      targetSum
    };
  }, [investments]);

  // Target allocation calculation excluding the item currently being edited
  const otherHoldingsTargetAlloc = useMemo(() => {
    return investments.reduce((sum, inv) => {
      if (invEditingId && inv.id === invEditingId) return sum;
      const val = parseFloat(inv.targetAllocation);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  }, [investments, invEditingId]);

  const currentInputTargetAlloc = parseFloat(invTargetAlloc) || 0;
  const combinedTargetAlloc = otherHoldingsTargetAlloc + currentInputTargetAlloc;

  // Investment Handlers
  const handleStartEditInvestment = (inv) => {
    setInvEditingId(inv.id);
    setInvName(inv.name || '');
    setInvType(inv.type || 'Stocks');
    setInvSector(inv.sector || 'Technology');
    const isQty = inv.valuationMethod === 'quantity_price' || (inv.quantity && inv.purchasePrice);
    setInvValuationMethod(isQty ? 'quantity_price' : 'manual');
    setInvQuantity(inv.quantity !== undefined && inv.quantity !== null ? String(inv.quantity) : '');
    setInvPurchasePrice(inv.purchasePrice !== undefined && inv.purchasePrice !== null ? String(inv.purchasePrice) : '');
    setInvCurrentPrice(inv.currentPrice !== undefined && inv.currentPrice !== null ? String(inv.currentPrice) : '');
    setInvInvested(inv.investedAmount !== undefined ? String(inv.investedAmount) : '');
    setInvCurrent(inv.currentValue !== undefined ? String(inv.currentValue) : '');
    setInvTargetAlloc(inv.targetAllocation !== undefined && inv.targetAllocation !== null ? String(inv.targetAllocation) : '');
    setInvError('');
    // Scroll modal top smoothly to bring horizontal console into focus
    const modalBody = document.querySelector('.modal-tab-body');
    if (modalBody) {
      modalBody.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCancelEditInvestment = () => {
    setInvEditingId(null);
    setInvName('');
    setInvType('Stocks');
    setInvSector('Technology');
    setInvValuationMethod('manual');
    setInvQuantity('');
    setInvPurchasePrice('');
    setInvCurrentPrice('');
    setInvInvested('');
    setInvCurrent('');
    setInvTargetAlloc('');
    setInvError('');
  };

  const handleSaveInvestment = (e) => {
    e.preventDefault();
    setInvError('');

    const trimmedName = invName.trim();
    if (!trimmedName) {
      setInvError('Please enter an investment name.');
      return;
    }

    let targetAllocNum = null;
    if (invTargetAlloc.trim() !== '') {
      targetAllocNum = parseFloat(invTargetAlloc);
      if (isNaN(targetAllocNum) || targetAllocNum < 0 || targetAllocNum > 100) {
        setInvError('Target allocation must be between 0 and 100%.');
        return;
      }
    }

    let investedNum = 0;
    let currentNum = 0;
    let qNum = null;
    let pNum = null;
    let cpNum = null;

    if (invValuationMethod === 'quantity_price') {
      qNum = parseFloat(invQuantity);
      pNum = parseFloat(invPurchasePrice);
      if (isNaN(qNum) || qNum <= 0) {
        setInvError('Quantity must be greater than 0.');
        return;
      }
      if (isNaN(pNum) || pNum < 0) {
        setInvError('Purchase price per unit must be a non-negative number.');
        return;
      }
      cpNum = invCurrentPrice.trim() !== '' ? parseFloat(invCurrentPrice) : pNum;
      if (isNaN(cpNum) || cpNum < 0) {
        setInvError('Current market price per unit must be a non-negative number.');
        return;
      }
      investedNum = qNum * pNum;
      currentNum = qNum * cpNum;
    } else {
      investedNum = parseFloat(invInvested);
      if (isNaN(investedNum) || investedNum < 0) {
        setInvError('Invested amount must be a non-negative number.');
        return;
      }

      currentNum = investedNum;
      if (invCurrent.trim() !== '') {
        currentNum = parseFloat(invCurrent);
        if (isNaN(currentNum) || currentNum < 0) {
          setInvError('Current value must be a non-negative number.');
          return;
        }
      }
    }

    const holdingData = {
      name: trimmedName,
      type: invType,
      sector: invSector,
      valuationMethod: invValuationMethod,
      quantity: qNum,
      purchasePrice: pNum,
      currentPrice: cpNum,
      investedAmount: investedNum,
      currentValue: currentNum,
      targetAllocation: targetAllocNum
    };

    if (invEditingId) {
      onUpdateInvestment(invEditingId, holdingData);
    } else {
      onAddInvestment(holdingData);
    }

    handleCancelEditInvestment();
  };

  // Monthly Savings Handler
  const handleSaveMonthlySavings = (e) => {
    e.preventDefault();
    const val = savingsInput.trim() === '' ? null : parseFloat(savingsInput);
    if (val !== null && (isNaN(val) || val < 0)) {
      return;
    }
    onUpdateMonthlySavings(val);
    setSavingsSavedMsg(true);
    setTimeout(() => setSavingsSavedMsg(false), 2500);
  };

  const handleAddSavingsPreset = (amount) => {
    const current = parseFloat(savingsInput) || 0;
    setSavingsInput(String(current + amount));
  };

  const handleResetSavings = () => {
    setSavingsInput('0');
  };

  // Goal Handlers
  const handleStartEditGoal = (g) => {
    setGoalEditingId(g.id);
    setGoalTitle(g.title || '');
    setGoalCurrent(g.current !== undefined ? String(g.current) : '');
    setGoalTarget(g.target !== undefined ? String(g.target) : '');
    setGoalError('');
    const modalBody = document.querySelector('.modal-tab-body');
    if (modalBody) {
      modalBody.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCancelEditGoal = () => {
    setGoalEditingId(null);
    setGoalTitle('');
    setGoalCurrent('');
    setGoalTarget('');
    setGoalError('');
  };

  const handleSaveGoal = (e) => {
    e.preventDefault();
    setGoalError('');

    const trimmedTitle = goalTitle.trim();
    if (!trimmedTitle) {
      setGoalError('Please enter a goal title.');
      return;
    }

    const currentNum = parseFloat(goalCurrent);
    if (isNaN(currentNum) || currentNum < 0) {
      setGoalError('Current amount must be a non-negative number.');
      return;
    }

    const targetNum = parseFloat(goalTarget);
    if (isNaN(targetNum) || targetNum <= 0) {
      setGoalError('Target amount must be greater than 0.');
      return;
    }

    if (goalEditingId) {
      onUpdateGoal(goalEditingId, {
        title: trimmedTitle,
        current: currentNum,
        target: targetNum,
        unit: '₹'
      });
    } else {
      onAddGoal({
        title: trimmedTitle,
        current: currentNum,
        target: targetNum,
        unit: '₹'
      });
    }

    handleCancelEditGoal();
  };

  if (!isOpen) return null;

  // Real-time progress computation for the Goal form
  const goalCurrentNum = parseFloat(goalCurrent) || 0;
  const goalTargetNum = parseFloat(goalTarget) || 0;
  const goalSimulatedPct = goalTargetNum > 0 ? Math.min(100, Math.round((goalCurrentNum / goalTargetNum) * 100)) : 0;
  const goalRemaining = Math.max(0, goalTargetNum - goalCurrentNum);

  return (
    <div className="portfolio-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="portfolio-modal-title">
      <div className="portfolio-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="portfolio-modal-header">
          <div>
            <span className="step-badge">PORTFOLIO LEDGER MANAGEMENT</span>
            <h2 id="portfolio-modal-title" className="portfolio-modal-title">
              Manage Assets &amp; Capital Targets
            </h2>
            <p className="portfolio-modal-subtitle">
              Configure multi-asset holdings, systematic savings pace, and milestone targets using the horizontal command console.
            </p>
          </div>
          <button
            type="button"
            className="modal-close-icon-btn"
            onClick={onClose}
            aria-label="Close modal dialog"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="modal-tabs-row" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'investments'}
            className={`modal-tab ${activeTab === 'investments' ? 'active' : ''}`}
            onClick={() => setActiveTab('investments')}
          >
            <span>Holdings &amp; Ledger</span>
            <span className="modal-tab-badge">{investments.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'savings'}
            className={`modal-tab ${activeTab === 'savings' ? 'active' : ''}`}
            onClick={() => setActiveTab('savings')}
          >
            <span>Systematic Savings Pace</span>
            <span className="modal-tab-badge">
              {financialData?.monthlySavings ? `₹${Number(financialData.monthlySavings).toLocaleString('en-IN')}` : 'Unset'}
            </span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'goals'}
            className={`modal-tab ${activeTab === 'goals' ? 'active' : ''}`}
            onClick={() => setActiveTab('goals')}
          >
            <span>Milestone Targets</span>
            <span className="modal-tab-badge">{goals.length}</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: INVESTMENTS & HOLDINGS
            ========================================================================= */}
        {activeTab === 'investments' && (
          <div className="modal-tab-body">
            {/* Holdings Summary Bar */}
            {investments.length > 0 && (
              <div className="holdings-summary-bar">
                <div className="summary-metric-item">
                  <span className="summary-metric-label">Invested Capital</span>
                  <span className="summary-metric-value">₹{portfolioSummary.investedSum.toLocaleString('en-IN')}</span>
                  <span className="summary-metric-sub">{investments.length} Active Positions</span>
                </div>
                <div className="summary-metric-item">
                  <span className="summary-metric-label">Current Valuation</span>
                  <span className="summary-metric-value">₹{portfolioSummary.currentSum.toLocaleString('en-IN')}</span>
                  <span className="summary-metric-sub">Aggregated Net Value</span>
                </div>
                <div className="summary-metric-item">
                  <span className="summary-metric-label">Unrealized P&amp;L</span>
                  <span className="summary-metric-value">
                    {portfolioSummary.gainLoss >= 0 ? '+' : ''}₹{Math.abs(portfolioSummary.gainLoss).toLocaleString('en-IN')}
                  </span>
                  <span className={`summary-metric-sub ${portfolioSummary.gainLoss >= 0 ? 'gain' : 'loss'}`}>
                    {portfolioSummary.gainLoss >= 0 ? '+' : ''}{portfolioSummary.gainLossPct.toFixed(2)}% Overall
                  </span>
                </div>
                <div className="summary-metric-item">
                  <span className="summary-metric-label">Target Weight Assigned</span>
                  <span className="summary-metric-value">{portfolioSummary.targetSum.toFixed(0)}% / 100%</span>
                  <span className="summary-metric-sub">
                    {portfolioSummary.targetSum === 100
                      ? 'Fully Balanced'
                      : portfolioSummary.targetSum < 100
                        ? `${(100 - portfolioSummary.targetSum).toFixed(0)}% Unallocated`
                        : `${(portfolioSummary.targetSum - 100).toFixed(0)}% Over Target`}
                  </span>
                </div>
              </div>
            )}

            {/* Premium Horizontal Asset Entry Console */}
            <div className="horizontal-entry-console">
              <div className="console-header-strip">
                <div className="console-header-left">
                  <span className="console-indicator-dot" />
                  <span className="console-eyebrow">
                    {invEditingId ? 'EDITING ASSET POSITION' : 'RAPID ASSET ENTRY CONSOLE'}
                  </span>
                </div>
                <span className="console-helper-text">
                  {invEditingId
                    ? 'Adjust values across the row and click Update Position'
                    : 'Input position details horizontally and press + Add Position'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', padding: '10px 18px 0', borderBottom: '1px solid var(--border)' }}>
                <button
                  type="button"
                  className={`btn btn-small ${invValuationMethod === 'manual' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setInvValuationMethod('manual')}
                  style={{ fontSize: '11.5px', padding: '4px 10px' }}
                >
                  Method B: Total Valuation
                </button>
                <button
                  type="button"
                  className={`btn btn-small ${invValuationMethod === 'quantity_price' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setInvValuationMethod('quantity_price')}
                  style={{ fontSize: '11.5px', padding: '4px 10px' }}
                >
                  Method A: Shares / Units & Price
                </button>
              </div>

              <form onSubmit={handleSaveInvestment} className="horizontal-entry-form">
                <div className="horizontal-inputs-deck">
                  {/* Col 1: Asset / Security Name */}
                  <div className="console-input-col">
                    <label htmlFor="invName">Asset / Security Name *</label>
                    <input
                      id="invName"
                      type="text"
                      placeholder="e.g. Reliance, Nifty 50"
                      value={invName}
                      onChange={(e) => setInvName(e.target.value)}
                      required
                    />
                    {!invEditingId && (
                      <div className="quick-suggestions-inline">
                        {QUICK_ASSETS.map((asset) => (
                          <button
                            key={asset.name}
                            type="button"
                            className="quick-chip-micro"
                            onClick={() => {
                              setInvName(asset.name);
                              setInvType(asset.type);
                            }}
                          >
                            {asset.name.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Col 2: Category Dropdown */}
                  <div className="console-input-col">
                    <label htmlFor="invType">Category *</label>
                    <select
                      id="invType"
                      value={invType}
                      onChange={(e) => setInvType(e.target.value)}
                      className="fin-select"
                    >
                      {ASSET_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Col 2b: Sector Dropdown */}
                  <div className="console-input-col">
                    <label htmlFor="invSector">Sector</label>
                    <select
                      id="invSector"
                      value={invSector}
                      onChange={(e) => setInvSector(e.target.value)}
                      className="fin-select"
                    >
                      <option value="Technology">Technology</option>
                      <option value="Financial Services">Financial Services</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Energy">Energy</option>
                      <option value="Consumer Goods">Consumer Goods</option>
                      <option value="Fixed Income">Fixed Income</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Cryptocurrency">Cryptocurrency</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {invValuationMethod === 'quantity_price' ? (
                    <>
                      {/* Col 3: Quantity */}
                      <div className="console-input-col">
                        <label htmlFor="invQty">Units / Shares *</label>
                        <input
                          id="invQty"
                          type="number"
                          min="0.0001"
                          step="any"
                          placeholder="50"
                          value={invQuantity}
                          onChange={(e) => setInvQuantity(e.target.value)}
                          required
                        />
                      </div>

                      {/* Col 4: Purchase Price */}
                      <div className="console-input-col">
                        <label htmlFor="invBuyPrice">Purchase (₹) *</label>
                        <div className="input-adorned-group">
                          <span className="input-affix">₹</span>
                          <input
                            id="invBuyPrice"
                            type="number"
                            min="0"
                            step="any"
                            placeholder="2400"
                            value={invPurchasePrice}
                            onChange={(e) => setInvPurchasePrice(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      {/* Col 5: Current Price */}
                      <div className="console-input-col">
                        <label htmlFor="invCurrPrice">Current (₹)</label>
                        <div className="input-adorned-group">
                          <span className="input-affix">₹</span>
                          <input
                            id="invCurrPrice"
                            type="number"
                            min="0"
                            step="any"
                            placeholder="2650"
                            value={invCurrentPrice}
                            onChange={(e) => setInvCurrentPrice(e.target.value)}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Col 3: Invested Amount */}
                      <div className="console-input-col">
                        <label htmlFor="invInvested">Invested (₹) *</label>
                        <div className="input-adorned-group">
                          <span className="input-affix">₹</span>
                          <input
                            id="invInvested"
                            type="number"
                            min="0"
                            step="any"
                            placeholder="25000"
                            value={invInvested}
                            onChange={(e) => setInvInvested(e.target.value)}
                            required
                          />
                        </div>
                        {invInvested && (
                          <span className="console-preview-text">
                            {formatINRPreview(invInvested)}
                          </span>
                        )}
                      </div>

                      {/* Col 4: Current Valuation */}
                      <div className="console-input-col">
                        <label htmlFor="invCurrent">Current Value (₹)</label>
                        <div className="input-adorned-group">
                          <span className="input-affix">₹</span>
                          <input
                            id="invCurrent"
                            type="number"
                            min="0"
                            step="any"
                            placeholder="28500"
                            value={invCurrent}
                            onChange={(e) => setInvCurrent(e.target.value)}
                          />
                        </div>
                        {invCurrent && (
                          <span className="console-preview-text">
                            {formatINRPreview(invCurrent)}
                          </span>
                        )}
                      </div>
                    </>
                  )}

                  {/* Col Target Allocation */}
                  <div className="console-input-col">
                    <label htmlFor="invTargetAlloc">Target Weight %</label>
                    <div className="input-adorned-group has-suffix">
                      <input
                        id="invTargetAlloc"
                        type="number"
                        min="0"
                        max="100"
                        step="any"
                        placeholder="25"
                        value={invTargetAlloc}
                        onChange={(e) => setInvTargetAlloc(e.target.value)}
                      />
                      <span className="input-affix suffix">%</span>
                    </div>
                    <span
                      className={`console-alloc-badge ${
                        combinedTargetAlloc === 100
                          ? 'balanced'
                          : combinedTargetAlloc > 100
                            ? 'over'
                            : 'under'
                      }`}
                    >
                      {combinedTargetAlloc.toFixed(0)}% Total Portfolio
                    </span>
                  </div>

                  {/* Col 6: Action Submit Button */}
                  <div className="console-actions-col">
                    <label className="action-spacer">&nbsp;</label>
                    <div className="console-btn-group">
                      {invEditingId && (
                        <button
                          type="button"
                          className="btn btn-outline btn-small"
                          onClick={handleCancelEditInvestment}
                        >
                          Cancel
                        </button>
                      )}
                      <button type="submit" className="btn btn-primary console-submit-btn">
                        {invEditingId ? 'Update' : '+ Add Position'}
                      </button>
                    </div>
                  </div>
                </div>

                {invError && <p className="error console-error" role="alert">{invError}</p>}
              </form>
            </div>

            {/* Current Asset Positions Ledger List */}
            <div className="modal-section">
              <h3 className="modal-section-title">Current Asset Positions</h3>
              {investments.length === 0 ? (
                <div className="empty-state-box">
                  <p>No investment positions recorded yet. Use the horizontal console above to add your first asset.</p>
                </div>
              ) : (
                <div className="items-list">
                  {investments.map((inv) => {
                    const invested = Number(inv.investedAmount) || 0;
                    const current = Number(inv.currentValue !== undefined ? inv.currentValue : inv.investedAmount) || 0;
                    const diff = current - invested;
                    const diffPct = invested > 0 ? (diff / invested) * 100 : 0;

                    return (
                      <div key={inv.id} className="item-row-card">
                        <div className="item-row-top">
                          <div className="item-title-row">
                            <strong className="item-name">{inv.name}</strong>
                            <span className="badge-tag">{inv.type}</span>
                            {inv.targetAllocation !== null && inv.targetAllocation !== undefined && (
                              <span className="badge-tag" style={{ color: 'var(--green-dark)' }}>
                                {inv.targetAllocation}% Target Weight
                              </span>
                            )}
                          </div>
                          <div className="item-actions">
                            <button
                              type="button"
                              className="btn btn-outline btn-small"
                              onClick={() => handleStartEditInvestment(inv)}
                            >
                              Edit Position
                            </button>
                            <button
                              type="button"
                              className="btn btn-ghost btn-small text-danger"
                              onClick={() => onDeleteInvestment(inv.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="item-meta-metrics-grid">
                          <div className="meta-metric-col">
                            <span className="meta-metric-label">Capital Invested</span>
                            <span className="meta-metric-val">₹{invested.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="meta-metric-col">
                            <span className="meta-metric-label">Current Valuation</span>
                            <span className="meta-metric-val">₹{current.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="meta-metric-col">
                            <span className="meta-metric-label">Position Return</span>
                            <span className={`meta-metric-val ${diff >= 0 ? 'gain' : 'loss'}`}>
                              {diff >= 0 ? '+' : ''}{diffPct.toFixed(1)}% ({diff >= 0 ? '+' : ''}₹{Math.abs(diff).toLocaleString('en-IN')})
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: MONTHLY SAVINGS PACE
            ========================================================================= */}
        {activeTab === 'savings' && (
          <div className="modal-tab-body">
            <div className="horizontal-entry-console">
              <div className="console-header-strip">
                <div className="console-header-left">
                  <span className="console-indicator-dot" />
                  <span className="console-eyebrow">SYSTEMATIC MONTHLY CAPITAL PACE</span>
                </div>
                <span className="console-helper-text">
                  Powers compound trajectory forecasts and monthly drift calculations
                </span>
              </div>

              <form onSubmit={handleSaveMonthlySavings} className="horizontal-savings-form">
                <div className="horizontal-savings-deck">
                  {/* Col 1: Monthly Input */}
                  <div className="savings-input-col">
                    <label htmlFor="savingsInput">Monthly Capital Addition (₹)</label>
                    <div className="input-adorned-group">
                      <span className="input-affix">₹</span>
                      <input
                        id="savingsInput"
                        type="number"
                        min="0"
                        step="any"
                        placeholder="e.g. 5000"
                        value={savingsInput}
                        onChange={(e) => setSavingsInput(e.target.value)}
                      />
                    </div>
                    {savingsInput && (
                      <span className="console-preview-text">
                        {formatINRPreview(savingsInput)} per month
                      </span>
                    )}
                  </div>

                  {/* Col 2: Quick Steppers */}
                  <div className="savings-steppers-col">
                    <label>Quick Increment Presets</label>
                    <div className="stepper-preset-pills">
                      {SAVINGS_PRESETS.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          className="stepper-pill-btn"
                          onClick={() => handleAddSavingsPreset(amt)}
                        >
                          +₹{amt.toLocaleString('en-IN')}
                        </button>
                      ))}
                      <button
                        type="button"
                        className="stepper-pill-btn clear"
                        onClick={handleResetSavings}
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Col 3: Action Save Button */}
                  <div className="savings-action-col">
                    <label className="action-spacer">&nbsp;</label>
                    <button type="submit" className="btn btn-primary console-submit-btn">
                      Save Monthly Pace
                    </button>
                  </div>
                </div>

                {savingsSavedMsg && (
                  <div className="savings-success-banner">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Monthly contribution pace saved successfully!</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: GOALS & MILESTONES
            ========================================================================= */}
        {activeTab === 'goals' && (
          <div className="modal-tab-body">
            {/* Horizontal Milestone Entry Console */}
            <div className="horizontal-entry-console">
              <div className="console-header-strip">
                <div className="console-header-left">
                  <span className="console-indicator-dot" />
                  <span className="console-eyebrow">
                    {goalEditingId ? 'EDITING MILESTONE TARGET' : 'RECORD NEW MILESTONE TARGET'}
                  </span>
                </div>
                <span className="console-helper-text">
                  Set measurable targets like emergency reserves or investment horizons
                </span>
              </div>

              <form onSubmit={handleSaveGoal} className="horizontal-entry-form">
                <div className="horizontal-goals-deck">
                  {/* Col 1: Goal Title */}
                  <div className="console-input-col">
                    <label htmlFor="goalTitle">Milestone / Goal Title *</label>
                    <input
                      id="goalTitle"
                      type="text"
                      placeholder="e.g. Emergency Reserve, First ₹1 Lakh"
                      value={goalTitle}
                      onChange={(e) => setGoalTitle(e.target.value)}
                      required
                    />
                    {!goalEditingId && (
                      <div className="quick-suggestions-inline">
                        {QUICK_GOALS.map((q) => (
                          <button
                            key={q.title}
                            type="button"
                            className="quick-chip-micro"
                            onClick={() => {
                              setGoalTitle(q.title);
                              setGoalTarget(String(q.target));
                            }}
                          >
                            {q.title.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Col 2: Current Capital */}
                  <div className="console-input-col">
                    <label htmlFor="goalCurrent">Current Capital (₹) *</label>
                    <div className="input-adorned-group">
                      <span className="input-affix">₹</span>
                      <input
                        id="goalCurrent"
                        type="number"
                        min="0"
                        step="any"
                        placeholder="15000"
                        value={goalCurrent}
                        onChange={(e) => setGoalCurrent(e.target.value)}
                        required
                      />
                    </div>
                    {goalCurrent && (
                      <span className="console-preview-text">
                        {formatINRPreview(goalCurrent)}
                      </span>
                    )}
                  </div>

                  {/* Col 3: Target Goal */}
                  <div className="console-input-col">
                    <label htmlFor="goalTarget">Target Milestone (₹) *</label>
                    <div className="input-adorned-group">
                      <span className="input-affix">₹</span>
                      <input
                        id="goalTarget"
                        type="number"
                        min="1"
                        step="any"
                        placeholder="50000"
                        value={goalTarget}
                        onChange={(e) => setGoalTarget(e.target.value)}
                        required
                      />
                    </div>
                    {goalTarget && (
                      <span className="console-preview-text">
                        {formatINRPreview(goalTarget)}
                      </span>
                    )}
                  </div>

                  {/* Col 4: Action Button */}
                  <div className="console-actions-col">
                    <label className="action-spacer">&nbsp;</label>
                    <div className="console-btn-group">
                      {goalEditingId && (
                        <button
                          type="button"
                          className="btn btn-outline btn-small"
                          onClick={handleCancelEditGoal}
                        >
                          Cancel
                        </button>
                      )}
                      <button type="submit" className="btn btn-primary console-submit-btn">
                        {goalEditingId ? 'Update' : '+ Add Milestone'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Simulation Progress Bar */}
                {goalTargetNum > 0 && (
                  <div className="horizontal-goal-simulation-bar">
                    <div className="sim-meta-row">
                      <span>Simulation Progress:</span>
                      <strong>
                        {goalSimulatedPct}% Achieved · ₹{goalRemaining.toLocaleString('en-IN')} Remaining
                      </strong>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${goalSimulatedPct}%` }} />
                    </div>
                  </div>
                )}

                {goalError && <p className="error console-error" role="alert">{goalError}</p>}
              </form>
            </div>

            {/* Existing Goals List */}
            <div className="modal-section">
              <h3 className="modal-section-title">Your Target Milestones</h3>
              {goals.length === 0 ? (
                <div className="empty-state-box">
                  <p>No financial milestone targets added yet. Add a target milestone using the horizontal console above.</p>
                </div>
              ) : (
                <div className="items-list">
                  {goals.map((g) => {
                    const current = Number(g.current) || 0;
                    const target = Number(g.target) || 1;
                    const pct = Math.min(100, Math.round((current / target) * 100));

                    return (
                      <div key={g.id} className="item-row-card">
                        <div className="item-row-top">
                          <div className="item-title-row">
                            <strong className="item-name">{g.title}</strong>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--green-dark)' }}>
                              ₹{current.toLocaleString('en-IN')} / ₹{target.toLocaleString('en-IN')} ({pct}%)
                            </span>
                          </div>
                          <div className="item-actions">
                            <button
                              type="button"
                              className="btn btn-outline btn-small"
                              onClick={() => handleStartEditGoal(g)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-ghost btn-small text-danger"
                              onClick={() => onDeleteGoal(g.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="progress-track" style={{ marginTop: '8px' }}>
                          <div className="progress-fill" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="portfolio-modal-footer">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Done &amp; Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
