import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Toast from '../../components/Toast';
import SettingsButton from '../../components/SettingsButton';
import { ASSET_TYPES } from '../../utils/financialCalculations';
import { getRoleDashboardPath } from '../../hooks/useFinanceData';
import './Onboarding.css';

const SAVINGS_PRESETS = [1000, 2500, 5000, 10000, 25000];

// Step 1 Perspective options
const STEP1_OPTIONS = [
  {
    id: 'student',
    num: '01',
    title: 'Student',
    desc: 'Learn about money, build good investment habits, and understand basic allocations.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
        <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
      </svg>
    )
  },
  {
    id: 'business',
    num: '02',
    title: 'Business',
    desc: 'Monitor corporate treasury holdings, market exposure, cashflow trends, and future valuations.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
        <path d="M9 22v-4h6v4"></path>
        <line x1="8" y1="6" x2="8.01" y2="6"></line>
        <line x1="16" y1="6" x2="16.01" y2="6"></line>
        <line x1="12" y1="10" x2="12.01" y2="10"></line>
        <line x1="12" y1="14" x2="12.01" y2="14"></line>
      </svg>
    )
  },
  {
    id: 'tech',
    num: '03',
    title: 'Large / Tech Company',
    desc: 'Analyze sector exposure, enterprise cost/loss risks, cloud CapEx, and multi-year simulations.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
        <line x1="6" y1="6" x2="6.01" y2="6"></line>
        <line x1="6" y1="18" x2="6.01" y2="18"></line>
      </svg>
    )
  }
];

// Step 2 Asset options
const STEP2_OPTIONS = [
  {
    name: 'Stocks',
    desc: 'Direct equity holdings and blue-chip shares across domestic & global markets',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
      </svg>
    )
  },
  {
    name: 'Bonds',
    desc: 'Government sovereign securities & high-yield corporate fixed income debt',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    )
  },
  {
    name: 'Crypto',
    desc: 'Digital assets, protocol tokens, layer-1 blockchains & decentralized liquidity',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9"></circle>
        <path d="M14.8 9A2 2 0 0 0 13 8h-3v8h3a2 2 0 0 0 1.8-1"></path>
        <path d="M10 12h3"></path>
      </svg>
    )
  },
  {
    name: 'Mutual Funds',
    desc: 'Professionally managed active equity & index-tracking diversified pooled funds',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
        <polyline points="2 17 12 22 22 17"></polyline>
        <polyline points="2 12 12 17 22 12"></polyline>
      </svg>
    )
  },
  {
    name: 'ETFs',
    desc: 'Exchange-traded thematic baskets, sector index trackers & commodities',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
      </svg>
    )
  },
  {
    name: 'Other',
    desc: 'Real estate assets, REITs, sovereign gold bonds, and liquid capital reserves',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 21h18"></path>
        <path d="M5 21V7l8-4v18"></path>
        <path d="M19 21V11l-6-4"></path>
        <line x1="9" y1="9" x2="9" y2="9.01"></line>
        <line x1="9" y1="13" x2="9" y2="13.01"></line>
        <line x1="9" y1="17" x2="9" y2="17.01"></line>
      </svg>
    )
  }
];

// Step 3 Focus options
const STEP3_OPTIONS = [
  {
    name: 'Portfolio growth',
    desc: 'Maximizing long-term compound asset accumulation with target allocations',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="7" y1="17" x2="17" y2="7"></line>
        <polyline points="7 7 17 7 17 17"></polyline>
      </svg>
    )
  },
  {
    name: 'Risk',
    desc: 'Limiting downside volatility, asset drift, and monitoring sector concentration',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    )
  },
  {
    name: 'Market trends',
    desc: 'Tracking macroeconomic shifts, central bank policies, and financial dispatches',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    )
  },
  {
    name: 'Future projections',
    desc: 'Simulating 1 to 5 year deterministic compound trajectories and milestone horizons',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
      </svg>
    )
  },
  {
    name: 'Learning about investing',
    desc: 'Foundational financial modules, institutional valuation metrics, and curated knowledge hubs',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
      </svg>
    )
  }
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
    if (e) e.preventDefault();
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
    if (e) e.preventDefault();
    setGoalError('');

    const trimmedTitle = goalTitle.trim();
    if (!trimmedTitle) {
      setGoalError('Please enter a goal title.');
      return;
    }

    const currentNum = parseFloat(goalCurrent);
    if (isNaN(currentNum) || currentNum < 0) {
      setGoalError('Current amount must be a positive number or 0.');
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

  // Finish setup and pass customized data
  const handleFinish = () => {
    const updated = {
      userType,
      investments,
      goals,
      isOnboarded: true
    };

    const parsedSavings = parseFloat(monthlySavings);
    const hasCustomFinancialData =
      (!isNaN(parsedSavings) && parsedSavings >= 0) ||
      financialInvestments.length > 0 ||
      financialGoals.length > 0;

    if (hasCustomFinancialData) {
      updated.customFinancialData = {
        monthlySavings: !isNaN(parsedSavings) && parsedSavings >= 0 ? parsedSavings : 0,
        investments: financialInvestments,
        goals: financialGoals
      };
    }

    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }

    triggerToast('Profile configured! Redirecting to your dashboard...');

    setTimeout(() => {
      navigate(getRoleDashboardPath(userType));
    }, 700);
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-top-bar">
        <Link to="/" className="brand">
          <div className="brand-icon">F</div>
          <span>FinSight</span>
        </Link>
        <SettingsButton user={user} size="small" />
      </div>

      <div className="onboarding-card">
        {/* 4-Segment Step Rail Progress Bar */}
        <div className="onboarding-step-rail" role="progressbar" aria-valuenow={step} aria-valuemin="1" aria-valuemax="4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`step-rail-segment ${s === step ? 'active' : s < step ? 'completed' : ''}`}
            />
          ))}
        </div>

        {/* =========================================================================
            STEP 1: HOW WILL YOU USE FINSIGHT? (INSTITUTIONAL HORIZONTAL CARDS)
            ========================================================================= */}
        {step === 1 && (
          <div>
            <div className="onboarding-step-header">
              <span className="step-badge">STEP 1 OF 4</span>
              <h1 className="onboarding-title">How will you use FinSight?</h1>
              <p className="onboarding-desc">
                Select the perspective that best matches your financial goals.
              </p>
            </div>

            <div className="horizontal-options-list" role="radiogroup" aria-label="FinSight persona selection">
              {STEP1_OPTIONS.map((opt) => {
                const isSelected = userType === opt.id;
                return (
                  <div
                    key={opt.id}
                    role="radio"
                    aria-checked={isSelected}
                    className={`horizontal-option-row horizontal-option-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setUserType(opt.id)}
                  >
                    <div className="card-main-cluster">
                      <span className="card-index-numeral option-numeral">{opt.num}</span>
                      <div className="card-text-block">
                        <div className="card-title">{opt.title}</div>
                        <div className="card-desc">{opt.desc}</div>
                      </div>
                    </div>

                    <div className="card-select-indicator radio" aria-hidden="true">
                      {isSelected && <span className="indicator-dot" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="onboarding-actions">
              <div />
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

        {/* =========================================================================
            STEP 2: WHAT HAVE YOU INVESTED IN? (INSTITUTIONAL HORIZONTAL CARDS)
            ========================================================================= */}
        {step === 2 && (
          <div>
            <div className="onboarding-step-header">
              <span className="step-badge">STEP 2 OF 4</span>
              <h1 className="onboarding-title">What have you invested in?</h1>
              <p className="onboarding-desc">
                Select all asset categories you currently hold or plan to track.
              </p>
            </div>

            <div className="horizontal-options-list" role="group" aria-label="Asset categories selection">
              {STEP2_OPTIONS.map((inv) => {
                const isSelected = investments.includes(inv.name);
                return (
                  <div
                    key={inv.name}
                    role="checkbox"
                    aria-checked={isSelected}
                    className={`horizontal-option-row horizontal-option-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleInvestment(inv.name)}
                  >
                    <div className="card-main-cluster">
                      <div className="card-text-block">
                        <div className="card-title">{inv.name}</div>
                        <div className="card-desc">{inv.desc}</div>
                      </div>
                    </div>

                    <div className={`card-select-indicator checkbox ${isSelected ? 'checked' : ''}`} aria-hidden="true">
                      {isSelected && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
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

        {/* =========================================================================
            STEP 3: WHAT DO YOU WANT TO FOCUS ON? (INSTITUTIONAL HORIZONTAL CARDS)
            ========================================================================= */}
        {step === 3 && (
          <div>
            <div className="onboarding-step-header">
              <span className="step-badge">STEP 3 OF 4</span>
              <h1 className="onboarding-title">What do you want to focus on?</h1>
              <p className="onboarding-desc">
                FinSight will customize your primary intelligence widgets based on your focus.
              </p>
            </div>

            <div className="horizontal-options-list" role="group" aria-label="Focus areas selection">
              {STEP3_OPTIONS.map((goal) => {
                const isSelected = goals.includes(goal.name);
                return (
                  <div
                    key={goal.name}
                    role="checkbox"
                    aria-checked={isSelected}
                    className={`horizontal-option-row horizontal-option-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleGoal(goal.name)}
                  >
                    <div className="card-main-cluster">
                      <div className="card-text-block">
                        <div className="card-title">{goal.name}</div>
                        <div className="card-desc">{goal.desc}</div>
                      </div>
                    </div>

                    <div className={`card-select-indicator checkbox ${isSelected ? 'checked' : ''}`} aria-hidden="true">
                      {isSelected && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
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

        {/* =========================================================================
            STEP 4: FINANCIAL DATA SETUP (HORIZONTAL FORM DECKS)
            ========================================================================= */}
        {step === 4 && (
          <div>
            <div className="onboarding-step-header">
              <span className="step-badge">STEP 4 OF 4</span>
              <h1 className="onboarding-title">Set up your financial profile</h1>
              <p className="onboarding-desc">
                Add your current investments, monthly savings, and goals using the horizontal input decks. You can also skip or add more later on your dashboard.
              </p>
            </div>

            {/* Monthly Capital Addition */}
            <div className="onboarding-section-card">
              <div className="onboarding-section-header">
                <div>
                  <h3 className="sub-title">Monthly Capital Addition</h3>
                  <p className="sub-desc">
                    How much do you systematically save or invest each month? (Optional)
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                <div className="field" style={{ margin: 0, minWidth: '240px', maxWidth: '320px', flex: 1 }}>
                  <label htmlFor="onboardingMonthlySavings">Monthly Contribution</label>
                  <div className="input-adorned-group">
                    <span className="input-affix">₹</span>
                    <input
                      id="onboardingMonthlySavings"
                      type="number"
                      min="0"
                      step="any"
                      placeholder="e.g. 5000"
                      value={monthlySavings}
                      onChange={(e) => setMonthlySavings(e.target.value)}
                    />
                  </div>
                  {monthlySavings && !isNaN(parseFloat(monthlySavings)) && (
                    <span className="field-currency-preview">
                      ₹{Number(monthlySavings).toLocaleString('en-IN')} per month
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                    Quick Presets
                  </label>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {SAVINGS_PRESETS.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        className="stepper-pill-btn"
                        onClick={() => {
                          const current = parseFloat(monthlySavings) || 0;
                          setMonthlySavings(String(current + amt));
                        }}
                      >
                        +₹{amt.toLocaleString('en-IN')}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="stepper-pill-btn clear"
                      onClick={() => setMonthlySavings('0')}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Investments Entry */}
            <div className="onboarding-section-card">
              <div className="onboarding-section-header">
                <div>
                  <h3 className="sub-title">Your Investments &amp; Holdings</h3>
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

              {/* Horizontal Long Investment Input Deck */}
              <div className="onboarding-form-box">
                <div className="onboarding-horizontal-deck">
                  <div className="field" style={{ margin: 0 }}>
                    <label htmlFor="obInvName">Investment Name</label>
                    <input
                      id="obInvName"
                      type="text"
                      placeholder="e.g. Reliance, Nifty 50"
                      value={invName}
                      onChange={(e) => setInvName(e.target.value)}
                    />
                  </div>

                  <div className="field" style={{ margin: 0 }}>
                    <label htmlFor="obInvType">Category</label>
                    <select
                      id="obInvType"
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

                  <div className="field" style={{ margin: 0 }}>
                    <label htmlFor="obInvInvested">Invested Amount</label>
                    <div className="input-adorned-group">
                      <span className="input-affix">₹</span>
                      <input
                        id="obInvInvested"
                        type="number"
                        min="0"
                        step="any"
                        placeholder="20000"
                        value={invInvested}
                        onChange={(e) => setInvInvested(e.target.value)}
                      />
                    </div>
                    {invInvested && !isNaN(parseFloat(invInvested)) && (
                      <span className="field-currency-preview">
                        ₹{Number(invInvested).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <div className="field" style={{ margin: 0 }}>
                    <label htmlFor="obInvCurrent">Current Value</label>
                    <div className="input-adorned-group">
                      <span className="input-affix">₹</span>
                      <input
                        id="obInvCurrent"
                        type="number"
                        min="0"
                        step="any"
                        placeholder="22500"
                        value={invCurrent}
                        onChange={(e) => setInvCurrent(e.target.value)}
                      />
                    </div>
                    {invCurrent && !isNaN(parseFloat(invCurrent)) && (
                      <span className="field-currency-preview">
                        ₹{Number(invCurrent).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <div className="field" style={{ margin: 0 }}>
                    <label htmlFor="obInvTarget">Target %</label>
                    <div className="input-adorned-group has-suffix">
                      <input
                        id="obInvTarget"
                        type="number"
                        min="0"
                        max="100"
                        step="any"
                        placeholder="40"
                        value={invTargetAlloc}
                        onChange={(e) => setInvTargetAlloc(e.target.value)}
                      />
                      <span className="input-affix suffix">%</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ height: '44px', whiteSpace: 'nowrap' }}
                    onClick={handleAddFinancialInvestment}
                  >
                    + Add Asset
                  </button>
                </div>

                {invError && <p className="error" style={{ marginTop: '10px' }} role="alert">{invError}</p>}
              </div>
            </div>

            {/* Financial Goals Entry */}
            <div className="onboarding-section-card">
              <div className="onboarding-section-header">
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

              {/* Horizontal Long Goals Input Deck */}
              <div className="onboarding-form-box">
                <div className="onboarding-goals-deck">
                  <div className="field" style={{ margin: 0 }}>
                    <label htmlFor="obGoalTitle">Goal Title</label>
                    <input
                      id="obGoalTitle"
                      type="text"
                      placeholder="e.g. Emergency Fund"
                      value={goalTitle}
                      onChange={(e) => setGoalTitle(e.target.value)}
                    />
                  </div>

                  <div className="field" style={{ margin: 0 }}>
                    <label htmlFor="obGoalCurrent">Current Capital</label>
                    <div className="input-adorned-group">
                      <span className="input-affix">₹</span>
                      <input
                        id="obGoalCurrent"
                        type="number"
                        min="0"
                        step="any"
                        placeholder="10000"
                        value={goalCurrent}
                        onChange={(e) => setGoalCurrent(e.target.value)}
                      />
                    </div>
                    {goalCurrent && !isNaN(parseFloat(goalCurrent)) && (
                      <span className="field-currency-preview">
                        ₹{Number(goalCurrent).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <div className="field" style={{ margin: 0 }}>
                    <label htmlFor="obGoalTarget">Target Amount</label>
                    <div className="input-adorned-group">
                      <span className="input-affix">₹</span>
                      <input
                        id="obGoalTarget"
                        type="number"
                        min="1"
                        step="any"
                        placeholder="30000"
                        value={goalTarget}
                        onChange={(e) => setGoalTarget(e.target.value)}
                      />
                    </div>
                    {goalTarget && !isNaN(parseFloat(goalTarget)) && (
                      <span className="field-currency-preview">
                        ₹{Number(goalTarget).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ height: '44px', whiteSpace: 'nowrap' }}
                    onClick={handleAddFinancialGoal}
                  >
                    + Add Goal
                  </button>
                </div>

                {goalError && <p className="error" style={{ marginTop: '10px' }} role="alert">{goalError}</p>}
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
