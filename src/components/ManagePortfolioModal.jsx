import React, { useState } from 'react';

const ASSET_TYPES = [
  'Stocks',
  'Mutual Funds',
  'ETFs',
  'Bonds',
  'Crypto',
  'Real Estate',
  'Other'
];

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

  if (!isOpen) return null;

  // Investment Handlers
  const handleStartEditInvestment = (inv) => {
    setInvEditingId(inv.id);
    setInvName(inv.name || '');
    setInvType(inv.type || 'Stocks');
    setInvInvested(inv.investedAmount !== undefined ? String(inv.investedAmount) : '');
    setInvCurrent(inv.currentValue !== undefined ? String(inv.currentValue) : '');
    setInvTargetAlloc(inv.targetAllocation !== undefined && inv.targetAllocation !== null ? String(inv.targetAllocation) : '');
    setInvError('');
  };

  const handleCancelEditInvestment = () => {
    setInvEditingId(null);
    setInvName('');
    setInvType('Stocks');
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

    const investedNum = parseFloat(invInvested);
    if (isNaN(investedNum) || investedNum < 0) {
      setInvError('Invested amount must be a non-negative number.');
      return;
    }

    let currentNum = investedNum;
    if (invCurrent.trim() !== '') {
      currentNum = parseFloat(invCurrent);
      if (isNaN(currentNum) || currentNum < 0) {
        setInvError('Current value must be a non-negative number.');
        return;
      }
    }

    let targetAllocNum = null;
    if (invTargetAlloc.trim() !== '') {
      targetAllocNum = parseFloat(invTargetAlloc);
      if (isNaN(targetAllocNum) || targetAllocNum < 0 || targetAllocNum > 100) {
        setInvError('Target allocation must be between 0 and 100%.');
        return;
      }
    }

    if (invEditingId) {
      onUpdateInvestment(invEditingId, {
        name: trimmedName,
        type: invType,
        investedAmount: investedNum,
        currentValue: currentNum,
        targetAllocation: targetAllocNum
      });
    } else {
      onAddInvestment({
        name: trimmedName,
        type: invType,
        investedAmount: investedNum,
        currentValue: currentNum,
        targetAllocation: targetAllocNum
      });
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
    setTimeout(() => setSavingsSavedMsg(false), 2000);
  };

  // Goal Handlers
  const handleStartEditGoal = (g) => {
    setGoalEditingId(g.id);
    setGoalTitle(g.title || '');
    setGoalCurrent(g.current !== undefined ? String(g.current) : '');
    setGoalTarget(g.target !== undefined ? String(g.target) : '');
    setGoalError('');
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

  const investments = financialData?.investments || [];
  const goals = financialData?.goals || [];

  return (
    <div className="portfolio-modal-backdrop" onClick={onClose}>
      <div className="portfolio-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="portfolio-modal-header">
          <div>
            <span className="step-badge">PORTFOLIO MANAGEMENT</span>
            <h2 className="portfolio-modal-title">Manage Your Portfolio & Goals</h2>
            <p className="portfolio-modal-subtitle">
              Add or update your real assets, monthly savings, and financial milestones.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-small modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="modal-tabs-row">
          <button
            type="button"
            className={`modal-tab ${activeTab === 'investments' ? 'active' : ''}`}
            onClick={() => setActiveTab('investments')}
          >
            Investments & Assets ({investments.length})
          </button>
          <button
            type="button"
            className={`modal-tab ${activeTab === 'savings' ? 'active' : ''}`}
            onClick={() => setActiveTab('savings')}
          >
            Monthly Savings
          </button>
          <button
            type="button"
            className={`modal-tab ${activeTab === 'goals' ? 'active' : ''}`}
            onClick={() => setActiveTab('goals')}
          >
            Financial Goals ({goals.length})
          </button>
        </div>

        {/* Tab 1: Investments */}
        {activeTab === 'investments' && (
          <div className="modal-tab-body">
            {/* Existing Investments List */}
            <div className="modal-section">
              <h3 className="modal-section-title">Current Holdings</h3>
              {investments.length === 0 ? (
                <div className="empty-state-box">
                  <p>No investments added yet. Use the form below to add your first asset.</p>
                </div>
              ) : (
                <div className="items-list">
                  {investments.map((inv) => (
                    <div key={inv.id} className="item-row-card">
                      <div className="item-main-info">
                        <div className="item-title-row">
                          <strong className="item-name">{inv.name}</strong>
                          <span className="badge-tag">{inv.type}</span>
                        </div>
                        <div className="item-meta-row">
                          <span>Invested: <strong>₹{Number(inv.investedAmount).toLocaleString('en-IN')}</strong></span>
                          <span>Current: <strong>₹{Number(inv.currentValue).toLocaleString('en-IN')}</strong></span>
                          {inv.targetAllocation !== null && inv.targetAllocation !== undefined && (
                            <span>Target: <strong>{inv.targetAllocation}%</strong></span>
                          )}
                        </div>
                      </div>
                      <div className="item-actions">
                        <button
                          type="button"
                          className="btn btn-outline btn-small"
                          onClick={() => handleStartEditInvestment(inv)}
                        >
                          Edit
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
                  ))}
                </div>
              )}
            </div>

            {/* Add/Edit Investment Form */}
            <div className="modal-section form-section">
              <h3 className="modal-section-title">
                {invEditingId ? 'Edit Investment' : 'Add New Investment'}
              </h3>
              <form onSubmit={handleSaveInvestment}>
                <div className="form-grid-2">
                  <div className="field">
                    <label>Investment / Asset Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Reliance Industries, Nifty 50 Index"
                      value={invName}
                      onChange={(e) => setInvName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Asset Category *</label>
                    <select
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
                </div>

                <div className="form-grid-3">
                  <div className="field">
                    <label>Amount Invested (₹) *</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="e.g. 20000"
                      value={invInvested}
                      onChange={(e) => setInvInvested(e.target.value)}
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Current Value (₹) (Optional)</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="e.g. 22500"
                      value={invCurrent}
                      onChange={(e) => setInvCurrent(e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label>Target Allocation % (Optional)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      placeholder="e.g. 40"
                      value={invTargetAlloc}
                      onChange={(e) => setInvTargetAlloc(e.target.value)}
                    />
                  </div>
                </div>

                {invError && <p className="error">{invError}</p>}

                <div className="form-actions-row">
                  {invEditingId && (
                    <button
                      type="button"
                      className="btn btn-outline btn-small"
                      onClick={handleCancelEditInvestment}
                    >
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="btn btn-primary btn-small">
                    {invEditingId ? 'Update Investment' : '+ Add Investment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab 2: Monthly Savings */}
        {activeTab === 'savings' && (
          <div className="modal-tab-body">
            <div className="modal-section">
              <h3 className="modal-section-title">Monthly Capital Contribution</h3>
              <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '20px' }}>
                Set your systematic monthly investment or savings allocation. This is displayed on your dashboard and powers future growth calculations.
              </p>

              <form onSubmit={handleSaveMonthlySavings} style={{ maxWidth: '420px' }}>
                <div className="field">
                  <label>Monthly Contribution (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="e.g. 5000 (or leave empty)"
                    value={savingsInput}
                    onChange={(e) => setSavingsInput(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '14px' }}>
                  <button type="submit" className="btn btn-primary btn-small">
                    Save Monthly Pace
                  </button>
                  {savingsSavedMsg && (
                    <span className="gain" style={{ fontSize: '12px' }}>
                      ✓ Saved successfully
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab 3: Goals */}
        {activeTab === 'goals' && (
          <div className="modal-tab-body">
            {/* Existing Goals List */}
            <div className="modal-section">
              <h3 className="modal-section-title">Your Financial Goals</h3>
              {goals.length === 0 ? (
                <div className="empty-state-box">
                  <p>No financial goals added yet. Add a target milestone below.</p>
                </div>
              ) : (
                <div className="items-list">
                  {goals.map((g) => {
                    const current = Number(g.current) || 0;
                    const target = Number(g.target) || 1;
                    const pct = Math.min(100, Math.round((current / target) * 100));

                    return (
                      <div key={g.id} className="item-row-card">
                        <div className="item-main-info">
                          <div className="item-title-row">
                            <strong className="item-name">{g.title}</strong>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--green-dark)' }}>
                              ₹{current.toLocaleString('en-IN')} / ₹{target.toLocaleString('en-IN')} ({pct}%)
                            </span>
                          </div>
                          <div className="progress-track" style={{ marginTop: '8px' }}>
                            <div className="progress-fill" style={{ width: `${pct}%` }} />
                          </div>
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
                    );
                  })}
                </div>
              )}
            </div>

            {/* Add/Edit Goal Form */}
            <div className="modal-section form-section">
              <h3 className="modal-section-title">
                {goalEditingId ? 'Edit Goal' : 'Add New Goal'}
              </h3>
              <form onSubmit={handleSaveGoal}>
                <div className="field">
                  <label>Goal Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Emergency Fund, First ₹50,000 Milestone"
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-grid-2">
                  <div className="field">
                    <label>Current Saved Amount (₹) *</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="e.g. 10000"
                      value={goalCurrent}
                      onChange={(e) => setGoalCurrent(e.target.value)}
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Target Goal Amount (₹) *</label>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      placeholder="e.g. 30000"
                      value={goalTarget}
                      onChange={(e) => setGoalTarget(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {goalError && <p className="error">{goalError}</p>}

                <div className="form-actions-row">
                  {goalEditingId && (
                    <button
                      type="button"
                      className="btn btn-outline btn-small"
                      onClick={handleCancelEditGoal}
                    >
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="btn btn-primary btn-small">
                    {goalEditingId ? 'Update Goal' : '+ Add Goal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="portfolio-modal-footer">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Done & Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
