import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Toast from '../../components/Toast';
import ThemeToggle from '../../components/ThemeToggle';

const ASSET_TYPES = [
  'Stocks',
  'Mutual Funds',
  'ETFs',
  'Bonds',
  'Crypto',
  'Real Estate',
  'Other'
];

export default function Onboarding({ user, onUpdateProfile }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('student');
  const [investments, setInvestments] = useState(['Stocks', 'Mutual Funds']);
  const [goals, setGoals] = useState(['Portfolio growth', 'Learning about investing']);

  // Step 4 Financial data state
  const [monthlySavings, setMonthlySavings] = useState('');
  const [financialInvestments, setFinancialInvestments] = useState([]);
  const [financialGoals, setFinancialGoals] = useState([]);

  // Investment quick entry state
  const [invName, setInvName] = useState('');
  const [invType, setInvType] = useState('Stocks');
  const [invInvested, setInvInvested] = useState('');
  const [invCurrent, setInvCurrent] = useState('');
  const [invTargetAlloc, setInvTargetAlloc] = useState('');
  const [invError, setInvError] = useState('');

  // Goal quick entry state
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalError, setGoalError] = useState('');

  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2400);
  };

  const toggleInvestment = (item) => {
    setInvestments((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleGoal = (item) => {
    setGoals((prev) =>
      prev.includes(item) ? prev.filter((g) => g !== item) : [...prev, item]
    );
  };

  // Add investment to onboarding financial list
  const handleAddFinancialInvestment = (e) => {
    e.preventDefault();
    setInvError('');

    const trimmedName = invName.trim();
    if (!trimmedName) {
      setInvError('Please enter an investment name.');
      return;
    }

    const investedNum = parseFloat(invInvested);
    if (isNaN(investedNum) || investedNum < 0) {
      setInvError('Invested amount must be a positive number or 0.');
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

    const newInv = {
      id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: trimmedName,
      type: invType,
      investedAmount: investedNum,
      currentValue: currentNum,
      targetAllocation: targetAllocNum
    };

    setFinancialInvestments((prev) => [...prev, newInv]);
    setInvName('');
    setInvInvested('');
    setInvCurrent('');
    setInvTargetAlloc('');
    setInvError('');
  };

  const handleRemoveFinancialInvestment = (id) => {
    setFinancialInvestments((prev) => prev.filter((i) => i.id !== id));
  };

  // Add goal to onboarding financial list
  const handleAddFinancialGoal = (e) => {
    e.preventDefault();
    setGoalError('');

    const trimmedTitle = goalTitle.trim();
    if (!trimmedTitle) {
      setGoalError('Please enter a goal title.');
      return;
    }

    const currentNum = parseFloat(goalCurrent);
    if (isNaN(currentNum) || currentNum < 0) {
      setGoalError('Current amount cannot be negative.');
      return;
    }

    const targetNum = parseFloat(goalTarget);
    if (isNaN(targetNum) || targetNum <= 0) {
      setGoalError('Target amount must be greater than 0.');
      return;
    }

    const newGoal = {
      id: `goal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: trimmedTitle,
      current: currentNum,
      target: targetNum,
      unit: '₹'
    };

    setFinancialGoals((prev) => [...prev, newGoal]);
    setGoalTitle('');
    setGoalCurrent('');
    setGoalTarget('');
    setGoalError('');
  };

  const handleRemoveFinancialGoal = (id) => {
    setFinancialGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const handleFinish = () => {
    const parsedSavings = monthlySavings.trim() === '' ? null : parseFloat(monthlySavings);

    const financialData = {
      monthlySavings: parsedSavings !== null && !isNaN(parsedSavings) && parsedSavings >= 0 ? parsedSavings : null,
      investments: financialInvestments,
      goals: financialGoals
    };

    onUpdateProfile({
      userType,
      investments,
      goals,
      financialData
    });

    triggerToast('Configuring your personalized dashboard...');

    setTimeout(() => {
      if (userType === 'business') {
        navigate('/business-dashboard');
      } else if (userType === 'tech') {
        navigate('/tech-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    }, 700);
  };

  const progressPercent = (step / 4) * 100;

  return (
    <div className="onboarding-container">
      <div className="onboarding-top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Link to="/" className="brand">
          <div className="brand-icon">F</div>
          <span>FinSight</span>
        </Link>
        <ThemeToggle size="small" />
      </div>

      <div className="onboarding-card">
        <div className="progress-bar-wrap">
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="step-badge">Step {step} of 4</div>

        {/* Step 1 */}
        {step === 1 && (
          <div>
            <h1 className="onboarding-title">How will you use FinSight?</h1>
            <p className="onboarding-desc">
              Select the perspective that best matches your financial goals.
            </p>

            <div className="options-grid">
              <div
                className={`option-card ${userType === 'student' ? 'selected' : ''}`}
                onClick={() => setUserType('student')}
              >
                <div className="option-title">Student</div>
                <div className="option-desc">
                  Learn about money, build good investment habits, and understand basic allocations.
                </div>
              </div>

              <div
                className={`option-card ${userType === 'business' ? 'selected' : ''}`}
                onClick={() => setUserType('business')}
              >
                <div className="option-title">Business</div>
                <div className="option-desc">
                  Monitor corporate treasury holdings, market exposure, cashflow trends, and future valuations.
                </div>
              </div>

              <div
                className={`option-card ${userType === 'tech' ? 'selected' : ''}`}
                onClick={() => setUserType('tech')}
              >
                <div className="option-title">Large / Tech Company</div>
                <div className="option-desc">
                  Analyze sector exposure, enterprise cost/loss risks, cloud CapEx, and multi-year simulations.
                </div>
              </div>
            </div>

            <div className="onboarding-actions">
              <div></div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep(2)}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <h1 className="onboarding-title">What have you invested in?</h1>
            <p className="onboarding-desc">
              Select all asset categories you currently hold or plan to track.
            </p>

            <div className="options-grid">
              {[
                { name: 'Stocks', desc: 'Direct equity holdings and blue-chips' },
                { name: 'Bonds', desc: 'Government & corporate fixed income' },
                { name: 'Crypto', desc: 'Digital assets and protocol tokens' },
                { name: 'Mutual Funds', desc: 'Active & index diversified funds' },
                { name: 'ETFs', desc: 'Exchange-traded thematic baskets' },
                { name: 'Other', desc: 'Real estate, REITs, or cash reserves' }
              ].map((inv) => (
                <div
                  key={inv.name}
                  className={`option-card ${
                    investments.includes(inv.name) ? 'selected' : ''
                  }`}
                  onClick={() => toggleInvestment(inv.name)}
                >
                  <div className="option-title">{inv.name}</div>
                  <div className="option-desc">{inv.desc}</div>
                </div>
              ))}
            </div>

            <div className="onboarding-actions">
              <button
                type="button"
                className="btn btn-outline btn-small"
                onClick={() => setStep(1)}
              >
                ← Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep(3)}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div>
            <h1 className="onboarding-title">What do you want to focus on?</h1>
            <p className="onboarding-desc">
              FinSight will customize your primary intelligence widgets based on your focus.
            </p>

            <div className="options-grid">
              {[
                { name: 'Portfolio growth', desc: 'Maximizing long-term compound asset accumulation' },
                { name: 'Risk', desc: 'Limiting downside volatility and monitoring sector concentration' },
                { name: 'Market trends', desc: 'Tracking macroeconomic shifts and industry news' },
                { name: 'Future projections', desc: 'Simulating 1 to 5 year compound wealth trajectory' },
                { name: 'Learning about investing', desc: 'Foundational financial modules and video lessons' }
              ].map((goal) => (
                <div
                  key={goal.name}
                  className={`option-card ${
                    goals.includes(goal.name) ? 'selected' : ''
                  }`}
                  onClick={() => toggleGoal(goal.name)}
                >
                  <div className="option-title">{goal.name}</div>
                  <div className="option-desc">{goal.desc}</div>
                </div>
              ))}
            </div>

            <div className="onboarding-actions">
              <button
                type="button"
                className="btn btn-outline btn-small"
                onClick={() => setStep(2)}
              >
                ← Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep(4)}
              >
                Continue to Portfolio Setup →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Financial Data Setup */}
        {step === 4 && (
          <div>
            <h1 className="onboarding-title">Set up your financial profile</h1>
            <p className="onboarding-desc">
              Add your current investments, monthly savings, and goals. You can also skip or add more later on your dashboard.
            </p>

            {/* Monthly Savings */}
            <div className="onboarding-section-card">
              <h3 className="sub-title">Monthly Capital Addition</h3>
              <p className="sub-desc">
                How much do you systematically save or invest each month? (Optional)
              </p>
              <div className="field" style={{ maxWidth: '320px' }}>
                <label>Monthly Contribution (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="e.g. 5000"
                  value={monthlySavings}
                  onChange={(e) => setMonthlySavings(e.target.value)}
                />
              </div>
            </div>

            {/* Investments Entry */}
            <div className="onboarding-section-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <h3 className="sub-title">Your Investments & Holdings</h3>
                  <p className="sub-desc">Add individual stocks, mutual funds, crypto, or other assets.</p>
                </div>
                {financialInvestments.length > 0 && (
                  <span className="badge-tag">{financialInvestments.length} Added</span>
                )}
              </div>

              {/* Added investments list */}
              {financialInvestments.length > 0 && (
                <div className="onboarding-items-list">
                  {financialInvestments.map((inv) => (
                    <div key={inv.id} className="onboarding-item-row">
                      <div>
                        <strong>{inv.name}</strong>
                        <span className="badge-tag" style={{ marginLeft: '8px' }}>{inv.type}</span>
                        <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                          Invested: ₹{Number(inv.investedAmount).toLocaleString('en-IN')} • Current: ₹{Number(inv.currentValue).toLocaleString('en-IN')}
                          {inv.targetAllocation !== null && ` • Target: ${inv.targetAllocation}%`}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-ghost btn-small text-danger"
                        onClick={() => handleRemoveFinancialInvestment(inv.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Investment Form */}
              <div className="onboarding-form-box">
                <div className="form-grid-2">
                  <div className="field">
                    <label>Investment Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Reliance Industries, Bitcoin"
                      value={invName}
                      onChange={(e) => setInvName(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Asset Category</label>
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
                    <label>Invested Amount (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="e.g. 20000"
                      value={invInvested}
                      onChange={(e) => setInvInvested(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Current Value (₹)</label>
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
                    <label>Target % (Optional)</label>
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

                <div style={{ textAlign: 'right', marginTop: '10px' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-small"
                    onClick={handleAddFinancialInvestment}
                  >
                    + Add This Investment
                  </button>
                </div>
              </div>
            </div>

            {/* Financial Goals Entry */}
            <div className="onboarding-section-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <h3 className="sub-title">Financial Goals (Optional)</h3>
                  <p className="sub-desc">Track progress toward specific milestones.</p>
                </div>
                {financialGoals.length > 0 && (
                  <span className="badge-tag">{financialGoals.length} Added</span>
                )}
              </div>

              {financialGoals.length > 0 && (
                <div className="onboarding-items-list">
                  {financialGoals.map((g) => (
                    <div key={g.id} className="onboarding-item-row">
                      <div>
                        <strong>{g.title}</strong>
                        <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                          Current: ₹{Number(g.current).toLocaleString('en-IN')} / Target: ₹{Number(g.target).toLocaleString('en-IN')}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-ghost btn-small text-danger"
                        onClick={() => handleRemoveFinancialGoal(g.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="onboarding-form-box">
                <div className="form-grid-3">
                  <div className="field">
                    <label>Goal Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Emergency Fund"
                      value={goalTitle}
                      onChange={(e) => setGoalTitle(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Current Amount (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="e.g. 10000"
                      value={goalCurrent}
                      onChange={(e) => setGoalCurrent(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Target Amount (₹)</label>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      placeholder="e.g. 30000"
                      value={goalTarget}
                      onChange={(e) => setGoalTarget(e.target.value)}
                    />
                  </div>
                </div>

                {goalError && <p className="error">{goalError}</p>}

                <div style={{ textAlign: 'right', marginTop: '10px' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-small"
                    onClick={handleAddFinancialGoal}
                  >
                    + Add This Goal
                  </button>
                </div>
              </div>
            </div>

            <div className="onboarding-actions">
              <button
                type="button"
                className="btn btn-outline btn-small"
                onClick={() => setStep(3)}
              >
                ← Back
              </button>
              <button
                type="button"
                className="btn btn-primary btn-large"
                onClick={handleFinish}
              >
                Build My Dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      <Toast message={toastMsg} show={showToast} />
    </div>
  );
}
