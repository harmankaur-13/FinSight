import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Toast from '../../components/Toast';
import SettingsButton from '../../components/SettingsButton';
import {
  ASSET_TYPES,
  formatCurrency,
  getCurrencySymbol,
  calculateInvestmentValuation
} from '../../utils/financialCalculations';
import { getRoleDashboardPath, normalizeFinancialData } from '../../hooks/useFinanceData';
import './Onboarding.css';

const SAVINGS_PRESETS = [1000, 2500, 5000, 10000, 25000];

// Step 1 Perspective options (Zero emojis, institutional typography)
const STEP1_OPTIONS = [
  {
    id: 'student',
    num: '01',
    title: 'Student',
    desc: 'Learn about money, build disciplined investment habits, track savings rate, and understand asset allocation.',
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
    desc: 'Monitor corporate treasury reserves, cash runway, net financial position, and enterprise capital safety.',
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
    desc: 'Analyze tech budget utilization, cloud infrastructure spend, multi-year valuation curves, and CapEx vs OpEx.',
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

const STUDENT_TOPICS = [
  'Budgeting',
  'Stock Market Basics',
  'Compounding',
  'Mutual Funds',
  'Cryptocurrencies',
  'Emergency Funds',
  'Debt Management'
];

export default function Onboarding({ user, onUpdateProfile }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Common Profile State
  const [fullName, setFullName] = useState(user?.name || '');
  const [userType, setUserType] = useState(user?.userType || 'student');
  const [currency, setCurrency] = useState('INR');
  const [country, setCountry] = useState('India');
  const [financialObjective, setFinancialObjective] = useState('Wealth creation');
  const [investmentExperience, setInvestmentExperience] = useState('Beginner');
  const [riskTolerance, setRiskTolerance] = useState('Moderate');
  const [investmentHorizon, setInvestmentHorizon] = useState('3-5 years');

  // Student Profile State
  const [educationLevel, setEducationLevel] = useState('Undergraduate');
  const [incomeSource, setIncomeSource] = useState('Allowance');
  const [studentMonthlyIncome, setStudentMonthlyIncome] = useState('');
  const [studentMonthlyExpenses, setStudentMonthlyExpenses] = useState('');
  const [studentMonthlySavings, setStudentMonthlySavings] = useState('');
  const [studentExistingSavings, setStudentExistingSavings] = useState('');
  const [studentKnowledgeLevel, setStudentKnowledgeLevel] = useState('Beginner');
  const [studentTopics, setStudentTopics] = useState(['Budgeting', 'Stock Market Basics']);

  // Business Profile State
  const [businessName, setBusinessName] = useState(user?.name || '');
  const [bizIndustry, setBizIndustry] = useState('Technology');
  const [bizSize, setBizSize] = useState('Medium (51-250)');
  const [bizAnnualRevenue, setBizAnnualRevenue] = useState('');
  const [bizMonthlyRevenue, setBizMonthlyRevenue] = useState('');
  const [bizOperatingExpenses, setBizOperatingExpenses] = useState('');
  const [bizCashReserves, setBizCashReserves] = useState('');
  const [bizShortLiab, setBizShortLiab] = useState('');
  const [bizLongLiab, setBizLongLiab] = useState('');
  const [bizMinReserve, setBizMinReserve] = useState('');

  // Tech Profile State
  const [orgName, setOrgName] = useState(user?.name || '');
  const [techIndustry, setTechIndustry] = useState('SaaS');
  const [orgSize, setOrgSize] = useState('51-250');
  const [annualTechBudget, setAnnualTechBudget] = useState('');
  const [monthlyTechExpenditure, setMonthlyTechExpenditure] = useState('');
  const [cloudSpend, setCloudSpend] = useState('');
  const [saasSpend, setSaaSSpend] = useState('');
  const [hardwareSpend, setHardwareSpend] = useState('');
  const [cyberSpend, setCyberSpend] = useState('');

  // Step 3 Holdings State
  const [financialInvestments, setFinancialInvestments] = useState([]);
  const [invValuationMethod, setInvValuationMethod] = useState('quantity_price');
  const [invName, setInvName] = useState('');
  const [invType, setInvType] = useState('Stocks');
  const [invQuantity, setInvQuantity] = useState('');
  const [invPurchasePrice, setInvPurchasePrice] = useState('');
  const [invCurrentPrice, setInvCurrentPrice] = useState('');
  const [invInvested, setInvInvested] = useState('');
  const [invCurrent, setInvCurrent] = useState('');
  const [invTargetAlloc, setInvTargetAlloc] = useState('');
  const [invLiquidity, setInvLiquidity] = useState('Short term');
  const [invError, setInvError] = useState('');

  // Step 4 Goals State
  const [financialGoals, setFinancialGoals] = useState([]);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalTargetDate, setGoalTargetDate] = useState('');
  const [goalMonthlyContrib, setGoalMonthlyContrib] = useState('');
  const [goalPriority, setGoalPriority] = useState('Medium');
  const [goalError, setGoalError] = useState('');

  // Step errors & Toast
  const [stepError, setStepError] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2400);
  };

  const toggleStudentTopic = (t) => {
    setStudentTopics((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  // Step 1 Validation
  const handleStep1Next = () => {
    setStepError('');
    if (!fullName.trim()) {
      setStepError('Please enter your full name or entity name.');
      return;
    }
    setStep(2);
  };

  // Step 2 Validation
  const handleStep2Next = () => {
    setStepError('');
    if (userType === 'student') {
      if (!educationLevel) {
        setStepError('Please select your education level.');
        return;
      }
      if (!incomeSource) {
        setStepError('Please specify your primary income source.');
        return;
      }
    } else if (userType === 'business') {
      if (!businessName.trim()) {
        setStepError('Please enter your legal business or entity name.');
        return;
      }
      if (!bizIndustry) {
        setStepError('Please select your commercial industry sector.');
        return;
      }
      if (!bizSize) {
        setStepError('Please select your business organization size.');
        return;
      }
    } else if (userType === 'tech') {
      if (!orgName.trim()) {
        setStepError('Please enter your technology enterprise or organization name.');
        return;
      }
      if (!techIndustry) {
        setStepError('Please specify your technology domain.');
        return;
      }
    }
    setStep(3);
  };

  // Add Investment (Step 3)
  const handleAddInvestment = (e) => {
    if (e) e.preventDefault();
    setInvError('');

    const trimmed = invName.trim();
    if (!trimmed) {
      setInvError('Please enter an asset or company name.');
      return;
    }

    let targetAllocNum = null;
    if (invTargetAlloc.trim() !== '') {
      targetAllocNum = parseFloat(invTargetAlloc);
      if (isNaN(targetAllocNum) || targetAllocNum < 0 || targetAllocNum > 100) {
        setInvError('Target allocation percentage must be between 0% and 100%.');
        return;
      }
    }

    let newHolding = null;

    if (invValuationMethod === 'quantity_price') {
      const q = parseFloat(invQuantity);
      const p = parseFloat(invPurchasePrice);
      if (isNaN(q) || q <= 0) {
        setInvError('Quantity of units/shares must be a positive number.');
        return;
      }
      if (isNaN(p) || p < 0) {
        setInvError('Purchase price per unit must be a non-negative number.');
        return;
      }

      let curr = p;
      if (invCurrentPrice.trim() !== '') {
        const cp = parseFloat(invCurrentPrice);
        if (isNaN(cp) || cp < 0) {
          setInvError('Current market price per unit must be a non-negative number.');
          return;
        }
        curr = cp;
      }

      newHolding = {
        id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: trimmed,
        type: invType,
        valuationMethod: 'quantity_price',
        quantity: q,
        purchasePrice: p,
        currentPrice: curr,
        investedAmount: q * p,
        currentValue: q * curr,
        targetAllocation: targetAllocNum,
        liquidityClassification: userType === 'business' ? invLiquidity : null
      };
    } else {
      const investedNum = parseFloat(invInvested);
      if (isNaN(investedNum) || investedNum < 0) {
        setInvError('Invested amount must be a non-negative number.');
        return;
      }

      let currentNum = investedNum;
      if (invCurrent.trim() !== '') {
        currentNum = parseFloat(invCurrent);
        if (isNaN(currentNum) || currentNum < 0) {
          setInvError('Current valuation must be a non-negative number.');
          return;
        }
      }

      newHolding = {
        id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: trimmed,
        type: invType,
        valuationMethod: 'manual',
        investedAmount: investedNum,
        currentValue: currentNum,
        targetAllocation: targetAllocNum,
        liquidityClassification: userType === 'business' ? invLiquidity : null
      };
    }

    setFinancialInvestments((prev) => [...prev, newHolding]);
    setInvName('');
    setInvQuantity('');
    setInvPurchasePrice('');
    setInvCurrentPrice('');
    setInvInvested('');
    setInvCurrent('');
    setInvTargetAlloc('');
    setInvError('');
  };

  const handleRemoveInvestment = (id) => {
    setFinancialInvestments((prev) => prev.filter((item) => item.id !== id));
  };

  // Add Goal (Step 4)
  const handleAddGoal = (e) => {
    if (e) e.preventDefault();
    setGoalError('');

    const title = goalTitle.trim();
    if (!title) {
      setGoalError('Please enter a financial goal title.');
      return;
    }

    const targetNum = parseFloat(goalTarget);
    if (isNaN(targetNum) || targetNum <= 0) {
      setGoalError('Target capital amount must be greater than 0.');
      return;
    }

    let currentNum = 0;
    if (goalCurrent.trim() !== '') {
      currentNum = parseFloat(goalCurrent);
      if (isNaN(currentNum) || currentNum < 0) {
        setGoalError('Current amount saved must be a non-negative number.');
        return;
      }
    }

    let monthlyNum = null;
    if (goalMonthlyContrib.trim() !== '') {
      monthlyNum = parseFloat(goalMonthlyContrib);
      if (isNaN(monthlyNum) || monthlyNum < 0) {
        setGoalError('Monthly contribution must be non-negative.');
        return;
      }
    }

    const newGoal = {
      id: `goal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      target: targetNum,
      current: currentNum,
      unit: getCurrencySymbol(currency),
      targetDate: goalTargetDate,
      monthlyContribution: monthlyNum,
      priority: goalPriority
    };

    setFinancialGoals((prev) => [...prev, newGoal]);
    setGoalTitle('');
    setGoalCurrent('');
    setGoalTarget('');
    setGoalTargetDate('');
    setGoalMonthlyContrib('');
    setGoalError('');
  };

  const handleRemoveGoal = (id) => {
    setFinancialGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Finish Onboarding & Persist Complete Normalized Data
  const handleFinish = () => {
    const parseNum = (v, fallback = null) => {
      if (v === '' || v === null || v === undefined) return fallback;
      const n = parseFloat(v);
      return isNaN(n) ? fallback : n;
    };

    const normalizedFin = normalizeFinancialData({
      commonProfile: {
        currency,
        country,
        financialObjective,
        riskTolerance,
        investmentExperience,
        investmentHorizon
      },
      studentProfile: userType === 'student' ? {
        educationLevel,
        incomeSource,
        monthlyIncome: parseNum(studentMonthlyIncome),
        monthlyExpenses: parseNum(studentMonthlyExpenses),
        monthlySavings: parseNum(studentMonthlySavings),
        existingSavings: parseNum(studentExistingSavings),
        learningPreferences: {
          knowledgeLevel: studentKnowledgeLevel,
          topicsOfInterest: studentTopics,
          learningGoals: 'Systematic wealth building and financial independence.'
        }
      } : {},
      businessProfile: userType === 'business' ? {
        businessName: businessName.trim(),
        industry: bizIndustry,
        businessSize: bizSize,
        annualRevenue: parseNum(bizAnnualRevenue),
        monthlyRevenue: parseNum(bizMonthlyRevenue),
        monthlyOperatingExpenses: parseNum(bizOperatingExpenses),
        cashReserves: parseNum(bizCashReserves),
        shortTermLiabilities: parseNum(bizShortLiab, null),
        longTermLiabilities: parseNum(bizLongLiab, null),
        minDesiredCashReserve: parseNum(bizMinReserve),
        expectedUpcomingObligations: null
      } : {},
      techProfile: userType === 'tech' ? {
        organizationName: orgName.trim(),
        techIndustry,
        organizationSize: orgSize,
        annualTechBudget: parseNum(annualTechBudget),
        monthlyTechExpenditure: parseNum(monthlyTechExpenditure),
        spendingBreakdown: [
          cloudSpend ? { category: 'Cloud Infrastructure', monthlyAmount: Number(cloudSpend) } : null,
          saasSpend ? { category: 'Software & SaaS Licensing', monthlyAmount: Number(saasSpend) } : null,
          hardwareSpend ? { category: 'Hardware & Devices', monthlyAmount: Number(hardwareSpend) } : null,
          cyberSpend ? { category: 'Cybersecurity & Compliance', monthlyAmount: Number(cyberSpend) } : null
        ].filter(Boolean),
        techAssets: [],
        futureTechPlans: ''
      } : {},
      monthlySavings: userType === 'student' ? parseNum(studentMonthlySavings) : null,
      investments: financialInvestments,
      goals: financialGoals,
      targetAllocations: null
    });

    const updatedUser = {
      ...(user || {}),
      name: (fullName.trim() || user?.name || 'User'),
      userType,
      isOnboarded: true,
      needsOnboarding: false,
      financialData: normalizedFin,
      customFinancialData: normalizedFin
    };

    if (onUpdateProfile) {
      onUpdateProfile(updatedUser);
    }

    triggerToast('Financial profile successfully configured! Launching dashboard...');

    setTimeout(() => {
      navigate(getRoleDashboardPath(userType));
    }, 400);
  };

  // Preview calculation for Step 3 Method A input
  const previewValuation = () => {
    if (invValuationMethod === 'quantity_price') {
      const q = parseFloat(invQuantity);
      const p = parseFloat(invPurchasePrice);
      const cp = invCurrentPrice.trim() !== '' ? parseFloat(invCurrentPrice) : p;
      if (!isNaN(q) && q > 0 && !isNaN(p) && p >= 0 && !isNaN(cp) && cp >= 0) {
        const val = calculateInvestmentValuation({
          valuationMethod: 'quantity_price',
          quantity: q,
          purchasePrice: p,
          currentPrice: cp
        });
        const sign = val.profitLoss >= 0 ? '+' : '';
        return `Invested: ${formatCurrency(val.investedAmount, currency)} | Current: ${formatCurrency(val.currentValue, currency)} | Unrealized P/L: ${sign}${formatCurrency(val.profitLoss, currency)} (${sign}${val.returnPercentage.toFixed(1)}%)`;
      }
    } else {
      const inv = parseFloat(invInvested);
      const cur = invCurrent.trim() !== '' ? parseFloat(invCurrent) : inv;
      if (!isNaN(inv) && inv >= 0 && !isNaN(cur) && cur >= 0) {
        const pl = cur - inv;
        const sign = pl >= 0 ? '+' : '';
        const pct = inv > 0 ? (pl / inv) * 100 : 0;
        return `Invested: ${formatCurrency(inv, currency)} | Current: ${formatCurrency(cur, currency)} | Unrealized P/L: ${sign}${formatCurrency(pl, currency)} (${sign}${pct.toFixed(1)}%)`;
      }
    }
    return null;
  };

  const previewText = previewValuation();

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
            STEP 1: HOW WILL YOU USE FINSIGHT? & COMMON PROFILE IDENTITY
            ========================================================================= */}
        {step === 1 && (
          <div>
            <div className="onboarding-step-header">
              <span className="step-badge">STEP 1 OF 4</span>
              <h1 className="onboarding-title">How will you use FinSight?</h1>
              <p className="onboarding-desc">
                Select your financial perspective and configure baseline global profile preferences.
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

            {/* Common Profile Inputs */}
            <div className="onboarding-section-card">
              <div className="onboarding-section-header">
                <div>
                  <h3 className="sub-title">Profile Identification & Financial Objectives</h3>
                  <p className="sub-desc">Required to personalize financial reports and analytics across your dashboard.</p>
                </div>
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label" htmlFor="fullName">Full Name / Entity Name *</label>
                  <input
                    id="fullName"
                    type="text"
                    className="form-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name or organization"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="prefCurrency">Reporting Currency *</label>
                  <select
                    id="prefCurrency"
                    className="form-select"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="INR">INR (₹) — Indian Rupee</option>
                    <option value="USD">USD ($) — US Dollar</option>
                    <option value="EUR">EUR (€) — Euro</option>
                    <option value="GBP">GBP (£) — British Pound</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="country">Country of Residence / Operations *</label>
                  <input
                    id="country"
                    type="text"
                    className="form-input"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. India, United States, United Kingdom"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="finObjective">Primary Financial Objective *</label>
                  <select
                    id="finObjective"
                    className="form-select"
                    value={financialObjective}
                    onChange={(e) => setFinancialObjective(e.target.value)}
                  >
                    <option value="Wealth creation">Wealth creation</option>
                    <option value="Capital preservation">Capital preservation</option>
                    <option value="Regular income">Regular income</option>
                    <option value="Savings">Savings & Emergency Liquidity</option>
                    <option value="Retirement planning">Retirement planning</option>
                    <option value="Business treasury management">Business treasury management</option>
                    <option value="Technology cost optimization">Technology cost optimization</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="riskTolerance">Risk Tolerance (Optional)</label>
                  <select
                    id="riskTolerance"
                    className="form-select"
                    value={riskTolerance}
                    onChange={(e) => setRiskTolerance(e.target.value)}
                  >
                    <option value="Conservative">Conservative (Low downside volatility)</option>
                    <option value="Moderate">Moderate (Balanced risk-return)</option>
                    <option value="Aggressive">Aggressive (High growth tolerance)</option>
                    <option value="Not sure yet">Not sure yet</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="investExp">Investment Experience (Optional)</label>
                  <select
                    id="investExp"
                    className="form-select"
                    value={investmentExperience}
                    onChange={(e) => setInvestmentExperience(e.target.value)}
                  >
                    <option value="Beginner">Beginner (Building foundational knowledge)</option>
                    <option value="Intermediate">Intermediate (Active portfolio participant)</option>
                    <option value="Advanced">Advanced (Institutional / Quant modeling)</option>
                  </select>
                </div>
              </div>

              {stepError && <div className="form-error-msg">{stepError}</div>}
            </div>

            <div className="onboarding-actions">
              <div />
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleStep1Next}
              >
                Continue to Financial Profile →
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 2: ROLE-SPECIFIC FINANCIAL PROFILE
            ========================================================================= */}
        {step === 2 && (
          <div>
            <div className="onboarding-step-header">
              <span className="step-badge">STEP 2 OF 4</span>
              {userType === 'student' && (
                <>
                  <h1 className="onboarding-title">Student Financial Profile</h1>
                  <p className="onboarding-desc">
                    Specify academic status, monthly cashflow, and learning interests to establish your personalized savings metrics.
                  </p>
                </>
              )}
              {userType === 'business' && (
                <>
                  <h1 className="onboarding-title">Corporate Treasury Profile</h1>
                  <p className="onboarding-desc">
                    Enter corporate operational expenses, liquidity reserves, and balance sheet liabilities for cash runway modeling.
                  </p>
                </>
              )}
              {userType === 'tech' && (
                <>
                  <h1 className="onboarding-title">Enterprise Technology Profile</h1>
                  <p className="onboarding-desc">
                    Establish technology budgets, infrastructure commitments, and scale parameters to monitor budget utilization.
                  </p>
                </>
              )}
            </div>

            {/* Student View */}
            {userType === 'student' && (
              <div className="onboarding-section-card">
                <div className="form-grid-2col">
                  <div className="form-group">
                    <label className="form-label" htmlFor="eduLevel">Education Level *</label>
                    <select
                      id="eduLevel"
                      className="form-select"
                      value={educationLevel}
                      onChange={(e) => setEducationLevel(e.target.value)}
                    >
                      <option value="High School">High School</option>
                      <option value="Undergraduate">Undergraduate (Bachelor's)</option>
                      <option value="Postgraduate">Postgraduate (Master's / Ph.D.)</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="incSource">Primary Income Source *</label>
                    <select
                      id="incSource"
                      className="form-select"
                      value={incomeSource}
                      onChange={(e) => setIncomeSource(e.target.value)}
                    >
                      <option value="Allowance">Allowance from family</option>
                      <option value="Part-time job">Part-time job</option>
                      <option value="Internship">Internship stipend</option>
                      <option value="Scholarship">Scholarship / Grant</option>
                      <option value="Freelance">Freelance / Contract work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="stuIncome">Monthly Income ({getCurrencySymbol(currency)})</label>
                    <input
                      id="stuIncome"
                      type="number"
                      min="0"
                      className="form-input"
                      value={studentMonthlyIncome}
                      onChange={(e) => setStudentMonthlyIncome(e.target.value)}
                      placeholder="e.g. 15000"
                    />
                    <span className="form-help">Essential to compute your savings rate percentage.</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="stuExpenses">Monthly Living Expenses ({getCurrencySymbol(currency)})</label>
                    <input
                      id="stuExpenses"
                      type="number"
                      min="0"
                      className="form-input"
                      value={studentMonthlyExpenses}
                      onChange={(e) => setStudentMonthlyExpenses(e.target.value)}
                      placeholder="e.g. 10000"
                    />
                    <span className="form-help">Food, rent, supplies, utilities, and subscriptions.</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="stuSavings">Monthly Savings Capacity ({getCurrencySymbol(currency)})</label>
                    <input
                      id="stuSavings"
                      type="number"
                      min="0"
                      className="form-input"
                      value={studentMonthlySavings}
                      onChange={(e) => setStudentMonthlySavings(e.target.value)}
                      placeholder="e.g. 5000"
                    />
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                      {SAVINGS_PRESETS.map((p) => (
                        <button
                          key={p}
                          type="button"
                          className="btn btn-outline btn-small"
                          style={{ padding: '2px 8px', fontSize: '11px' }}
                          onClick={() => setStudentMonthlySavings(String(p))}
                        >
                          +{getCurrencySymbol(currency)}{p.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="stuExistSavings">Current Bank Savings ({getCurrencySymbol(currency)})</label>
                    <input
                      id="stuExistSavings"
                      type="number"
                      min="0"
                      className="form-input"
                      value={studentExistingSavings}
                      onChange={(e) => setStudentExistingSavings(e.target.value)}
                      placeholder="e.g. 25000"
                    />
                    <span className="form-help">Cash or deposits currently saved in accounts.</span>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label className="form-label">Topics of Financial Interest</label>
                  <div className="tag-chips-container">
                    {STUDENT_TOPICS.map((topic) => {
                      const isSelected = studentTopics.includes(topic);
                      return (
                        <button
                          type="button"
                          key={topic}
                          className={`tag-chip ${isSelected ? 'selected' : ''}`}
                          onClick={() => toggleStudentTopic(topic)}
                        >
                          {topic}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Business View */}
            {userType === 'business' && (
              <div className="onboarding-section-card">
                <div className="form-grid-2col">
                  <div className="form-group">
                    <label className="form-label" htmlFor="bizName">Entity / Corporation Name *</label>
                    <input
                      id="bizName"
                      type="text"
                      className="form-input"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Apex Global Technologies Pvt Ltd"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="bizIndustry">Industry Sector *</label>
                    <select
                      id="bizIndustry"
                      className="form-select"
                      value={bizIndustry}
                      onChange={(e) => setBizIndustry(e.target.value)}
                    >
                      <option value="Technology">Technology & Software</option>
                      <option value="Manufacturing">Manufacturing & Industrial</option>
                      <option value="Retail">Retail & Consumer Goods</option>
                      <option value="Healthcare">Healthcare & BioTech</option>
                      <option value="Finance">Financial Services & Fintech</option>
                      <option value="Services">Professional & Business Services</option>
                      <option value="Other">Other Sector</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="bizSize">Business Scale *</label>
                    <select
                      id="bizSize"
                      className="form-select"
                      value={bizSize}
                      onChange={(e) => setBizSize(e.target.value)}
                    >
                      <option value="Small (1-50)">Small Enterprise (1-50 employees)</option>
                      <option value="Medium (51-250)">Medium Enterprise (51-250 employees)</option>
                      <option value="Large (251-1000)">Large Corporate (251-1000 employees)</option>
                      <option value="Enterprise (1000+)">Global Enterprise (1000+ employees)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="bizCashReserves">Available Cash Reserves ({getCurrencySymbol(currency)}) *</label>
                    <input
                      id="bizCashReserves"
                      type="number"
                      min="0"
                      className="form-input"
                      value={bizCashReserves}
                      onChange={(e) => setBizCashReserves(e.target.value)}
                      placeholder="e.g. 9000000"
                    />
                    <span className="form-help">Current liquid deposits across operational bank accounts.</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="bizExpenses">Monthly Operating Expenses ({getCurrencySymbol(currency)}) *</label>
                    <input
                      id="bizExpenses"
                      type="number"
                      min="0"
                      className="form-input"
                      value={bizOperatingExpenses}
                      onChange={(e) => setBizOperatingExpenses(e.target.value)}
                      placeholder="e.g. 1500000"
                    />
                    <span className="form-help">Monthly operational burn: payroll, leases, overhead, vendor OPEX.</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="bizShortLiab">Short-Term Liabilities ({getCurrencySymbol(currency)})</label>
                    <input
                      id="bizShortLiab"
                      type="number"
                      min="0"
                      className="form-input"
                      value={bizShortLiab}
                      onChange={(e) => setBizShortLiab(e.target.value)}
                      placeholder="e.g. 2000000"
                    />
                    <span className="form-help">Accounts payable and debts maturing within 12 months.</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="bizLongLiab">Long-Term Liabilities ({getCurrencySymbol(currency)})</label>
                    <input
                      id="bizLongLiab"
                      type="number"
                      min="0"
                      className="form-input"
                      value={bizLongLiab}
                      onChange={(e) => setBizLongLiab(e.target.value)}
                      placeholder="e.g. 5000000"
                    />
                    <span className="form-help">Term loans, bonds, and senior obligations maturing beyond 12 months.</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="bizAnnualRev">Annual Gross Revenue ({getCurrencySymbol(currency)})</label>
                    <input
                      id="bizAnnualRev"
                      type="number"
                      min="0"
                      className="form-input"
                      value={bizAnnualRevenue}
                      onChange={(e) => setBizAnnualRevenue(e.target.value)}
                      placeholder="e.g. 50000000"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tech View */}
            {userType === 'tech' && (
              <div className="onboarding-section-card">
                <div className="form-grid-2col">
                  <div className="form-group">
                    <label className="form-label" htmlFor="techOrgName">Enterprise / Tech Organization Name *</label>
                    <input
                      id="techOrgName"
                      type="text"
                      className="form-input"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="e.g. HyperScale Infrastructure Inc."
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="techDomain">Technology Domain *</label>
                    <select
                      id="techDomain"
                      className="form-select"
                      value={techIndustry}
                      onChange={(e) => setTechIndustry(e.target.value)}
                    >
                      <option value="SaaS">SaaS & Enterprise Cloud</option>
                      <option value="AI/ML">AI / Machine Learning Infrastructure</option>
                      <option value="Cloud Infrastructure">Cloud Infrastructure & DevOps</option>
                      <option value="FinTech">FinTech & Payments</option>
                      <option value="Cybersecurity">Cybersecurity & Compliance</option>
                      <option value="E-commerce">E-Commerce & Digital Marketplaces</option>
                      <option value="Other">Other Technology Domain</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="techBudget">Approved Annual Technology Budget ({getCurrencySymbol(currency)}) *</label>
                    <input
                      id="techBudget"
                      type="number"
                      min="0"
                      className="form-input"
                      value={annualTechBudget}
                      onChange={(e) => setAnnualTechBudget(e.target.value)}
                      placeholder="e.g. 24000000"
                    />
                    <span className="form-help">Approved annual IT, software licenses, hardware, and cloud allocation.</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="techMonthly">Monthly Tech Expenditure ({getCurrencySymbol(currency)}) *</label>
                    <input
                      id="techMonthly"
                      type="number"
                      min="0"
                      className="form-input"
                      value={monthlyTechExpenditure}
                      onChange={(e) => setMonthlyTechExpenditure(e.target.value)}
                      placeholder="e.g. 1800000"
                    />
                    <span className="form-help">Current active monthly burn on technology operations and services.</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="cloudSpend">Cloud Infrastructure Spend / Month ({getCurrencySymbol(currency)})</label>
                    <input
                      id="cloudSpend"
                      type="number"
                      min="0"
                      className="form-input"
                      value={cloudSpend}
                      onChange={(e) => setCloudSpend(e.target.value)}
                      placeholder="e.g. 800000"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="saasSpend">SaaS & Software Licensing / Month ({getCurrencySymbol(currency)})</label>
                    <input
                      id="saasSpend"
                      type="number"
                      min="0"
                      className="form-input"
                      value={saasSpend}
                      onChange={(e) => setSaaSSpend(e.target.value)}
                      placeholder="e.g. 500000"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="hardwareSpend">Hardware & Devices / Month ({getCurrencySymbol(currency)})</label>
                    <input
                      id="hardwareSpend"
                      type="number"
                      min="0"
                      className="form-input"
                      value={hardwareSpend}
                      onChange={(e) => setHardwareSpend(e.target.value)}
                      placeholder="e.g. 200000"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="cyberSpend">Cybersecurity & Compliance / Month ({getCurrencySymbol(currency)})</label>
                    <input
                      id="cyberSpend"
                      type="number"
                      min="0"
                      className="form-input"
                      value={cyberSpend}
                      onChange={(e) => setCyberSpend(e.target.value)}
                      placeholder="e.g. 150000"
                    />
                  </div>
                </div>
              </div>
            )}

            {stepError && <div className="form-error-msg" style={{ marginBottom: '14px' }}>{stepError}</div>}

            <div className="onboarding-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setStep(1)}
              >
                ← Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleStep2Next}
              >
                Continue to Portfolio Holdings →
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 3: CURRENT INVESTMENT PORTFOLIO & ASSET VALUATION (METHOD A / B)
            ========================================================================= */}
        {step === 3 && (
          <div>
            <div className="onboarding-step-header">
              <span className="step-badge">STEP 3 OF 4</span>
              <h1 className="onboarding-title">Investment Portfolio & Holdings</h1>
              <p className="onboarding-desc">
                Add your current market investments with unit prices or direct valuations. If you have no investments yet, you can skip this step safely.
              </p>
            </div>

            <div className="onboarding-section-card">
              <div className="onboarding-section-header">
                <div>
                  <h3 className="sub-title">Add Investment Holding</h3>
                  <p className="sub-desc">Choose between unit quantity & market prices (Method A) or manual total valuation (Method B).</p>
                </div>
                <div className="method-toggle" role="radiogroup" aria-label="Valuation method">
                  <button
                    type="button"
                    className={`method-toggle-btn ${invValuationMethod === 'quantity_price' ? 'active' : ''}`}
                    onClick={() => setInvValuationMethod('quantity_price')}
                  >
                    Method A: Shares / Units
                  </button>
                  <button
                    type="button"
                    className={`method-toggle-btn ${invValuationMethod === 'manual' ? 'active' : ''}`}
                    onClick={() => setInvValuationMethod('manual')}
                  >
                    Method B: Total Valuation
                  </button>
                </div>
              </div>

              {/* Form Grid */}
              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label" htmlFor="invName">Asset or Security Name *</label>
                  <input
                    id="invName"
                    type="text"
                    className="form-input"
                    value={invName}
                    onChange={(e) => setInvName(e.target.value)}
                    placeholder="e.g. Nifty 50 Index Fund, Apple Inc, Govt 10Y Bond"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="invType">Asset Category *</label>
                  <select
                    id="invType"
                    className="form-select"
                    value={invType}
                    onChange={(e) => setInvType(e.target.value)}
                  >
                    {ASSET_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {invValuationMethod === 'quantity_price' ? (
                  <>
                    <div className="form-group">
                      <label className="form-label" htmlFor="invQty">Quantity (Units / Shares) *</label>
                      <input
                        id="invQty"
                        type="number"
                        min="0.0001"
                        step="any"
                        className="form-input"
                        value={invQuantity}
                        onChange={(e) => setInvQuantity(e.target.value)}
                        placeholder="e.g. 50"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="invBuyPrice">Purchase Price per Unit ({getCurrencySymbol(currency)}) *</label>
                      <input
                        id="invBuyPrice"
                        type="number"
                        min="0"
                        step="any"
                        className="form-input"
                        value={invPurchasePrice}
                        onChange={(e) => setInvPurchasePrice(e.target.value)}
                        placeholder="e.g. 2400"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="invMarketPrice">Current Market Price ({getCurrencySymbol(currency)})</label>
                      <input
                        id="invMarketPrice"
                        type="number"
                        min="0"
                        step="any"
                        className="form-input"
                        value={invCurrentPrice}
                        onChange={(e) => setInvCurrentPrice(e.target.value)}
                        placeholder="Defaults to purchase price if blank"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label className="form-label" htmlFor="invInvestedAmt">Total Invested Amount ({getCurrencySymbol(currency)}) *</label>
                      <input
                        id="invInvestedAmt"
                        type="number"
                        min="0"
                        step="any"
                        className="form-input"
                        value={invInvested}
                        onChange={(e) => setInvInvested(e.target.value)}
                        placeholder="e.g. 100000"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="invCurrentVal">Current Market Value ({getCurrencySymbol(currency)})</label>
                      <input
                        id="invCurrentVal"
                        type="number"
                        min="0"
                        step="any"
                        className="form-input"
                        value={invCurrent}
                        onChange={(e) => setInvCurrent(e.target.value)}
                        placeholder="Defaults to invested amount if blank"
                      />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="invTarget">Target Allocation % (Optional)</label>
                  <input
                    id="invTarget"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    className="form-input"
                    value={invTargetAlloc}
                    onChange={(e) => setInvTargetAlloc(e.target.value)}
                    placeholder="e.g. 25"
                  />
                  <span className="form-help">Target weighting for automated rebalance alerts.</span>
                </div>

                {userType === 'business' && (
                  <div className="form-group">
                    <label className="form-label" htmlFor="invLiq">Liquidity Classification</label>
                    <select
                      id="invLiq"
                      className="form-select"
                      value={invLiquidity}
                      onChange={(e) => setInvLiquidity(e.target.value)}
                    >
                      <option value="Cash equivalent">Cash equivalent (T-Bills, Overnight)</option>
                      <option value="Short term">Short term (&lt;1 year maturity)</option>
                      <option value="Long term">Long term (&gt;1 year strategic)</option>
                    </select>
                  </div>
                )}
              </div>

              {previewText && (
                <div className="live-calc-box">
                  <span>Calculation Preview:</span>
                  <strong>{previewText}</strong>
                </div>
              )}

              {invError && <div className="form-error-msg">{invError}</div>}

              <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-small"
                  onClick={handleAddInvestment}
                >
                  + Add Investment to List
                </button>
              </div>
            </div>

            {/* List of Added Holdings */}
            {financialInvestments.length > 0 && (
              <div style={{ marginBottom: '22px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 10px', color: 'var(--text)' }}>
                  Configured Holdings ({financialInvestments.length})
                </h4>
                <div className="onboarding-items-list">
                  {financialInvestments.map((h) => {
                    const diff = h.currentValue - h.investedAmount;
                    const diffPct = h.investedAmount > 0 ? (diff / h.investedAmount) * 100 : 0;
                    const isGain = diff >= 0;
                    return (
                      <div key={h.id} className="onboarding-item-row">
                        <div>
                          <strong>{h.name}</strong>
                          <span className="badge-tag" style={{ marginLeft: '8px' }}>{h.type}</span>
                          {h.targetAllocation && (
                            <span className="badge-tag" style={{ marginLeft: '6px' }}>Target: {h.targetAllocation}%</span>
                          )}
                          <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '2px' }}>
                            {h.valuationMethod === 'quantity_price' ? `${h.quantity} units @ ${formatCurrency(h.purchasePrice, currency)}` : 'Manual valuation'}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{formatCurrency(h.currentValue, currency)}</div>
                            <div style={{ fontSize: '11px', color: isGain ? 'var(--green-dark)' : 'var(--error)' }}>
                              {isGain ? '+' : ''}{formatCurrency(diff, currency)} ({isGain ? '+' : ''}{diffPct.toFixed(1)}%)
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn btn-outline btn-small"
                            style={{ padding: '3px 8px', fontSize: '11px' }}
                            onClick={() => handleRemoveInvestment(h.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="onboarding-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setStep(2)}
              >
                ← Back
              </button>
              <div style={{ display: 'flex', gap: '10px' }}>
                {financialInvestments.length === 0 && (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setStep(4)}
                  >
                    Skip for now (Start with {getCurrencySymbol(currency)}0)
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setStep(4)}
                >
                  Continue to Goals →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 4: FINANCIAL GOALS & FINALIZATION
            ========================================================================= */}
        {step === 4 && (
          <div>
            <div className="onboarding-step-header">
              <span className="step-badge">STEP 4 OF 4</span>
              <h1 className="onboarding-title">Financial Goals & Objectives</h1>
              <p className="onboarding-desc">
                Establish milestone targets, contribution schedules, and timeline horizons. You can also skip this step and add goals later from Settings.
              </p>
            </div>

            <div className="onboarding-section-card">
              <div className="onboarding-section-header">
                <div>
                  <h3 className="sub-title">Add Capital Goal</h3>
                  <p className="sub-desc">Track progress toward emergency reserves, capital milestones, or corporate reserves.</p>
                </div>
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label" htmlFor="goalTitle">Goal Title *</label>
                  <input
                    id="goalTitle"
                    type="text"
                    className="form-input"
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                    placeholder="e.g. Emergency Liquidity Reserve, First ₹1 Lakh Milestone"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="goalTarget">Target Amount ({getCurrencySymbol(currency)}) *</label>
                  <input
                    id="goalTarget"
                    type="number"
                    min="1"
                    className="form-input"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    placeholder="e.g. 150000"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="goalCurrent">Current Amount Saved ({getCurrencySymbol(currency)})</label>
                  <input
                    id="goalCurrent"
                    type="number"
                    min="0"
                    className="form-input"
                    value={goalCurrent}
                    onChange={(e) => setGoalCurrent(e.target.value)}
                    placeholder="e.g. 45000"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="goalDate">Target Completion Date (Optional)</label>
                  <input
                    id="goalDate"
                    type="date"
                    className="form-input"
                    value={goalTargetDate}
                    onChange={(e) => setGoalTargetDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="goalPriority">Milestone Priority</label>
                  <select
                    id="goalPriority"
                    className="form-select"
                    value={goalPriority}
                    onChange={(e) => setGoalPriority(e.target.value)}
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="goalContrib">Monthly Contribution Pace ({getCurrencySymbol(currency)})</label>
                  <input
                    id="goalContrib"
                    type="number"
                    min="0"
                    className="form-input"
                    value={goalMonthlyContrib}
                    onChange={(e) => setGoalMonthlyContrib(e.target.value)}
                    placeholder="e.g. 5000"
                  />
                </div>
              </div>

              {goalError && <div className="form-error-msg">{goalError}</div>}

              <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-small"
                  onClick={handleAddGoal}
                >
                  + Add Goal to List
                </button>
              </div>
            </div>

            {/* List of Added Goals */}
            {financialGoals.length > 0 && (
              <div style={{ marginBottom: '22px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 10px', color: 'var(--text)' }}>
                  Configured Goals ({financialGoals.length})
                </h4>
                <div className="onboarding-items-list">
                  {financialGoals.map((g) => {
                    const pct = Math.min(100, Math.round(((g.current || 0) / (g.target || 1)) * 100));
                    return (
                      <div key={g.id} className="onboarding-item-row">
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <strong>{g.title}</strong>
                            <span style={{ fontSize: '12px' }}>
                              {formatCurrency(g.current, currency)} / {formatCurrency(g.target, currency)} ({pct}%)
                            </span>
                          </div>
                          <div className="progress-track" style={{ height: '6px' }}>
                            <div className="progress-fill" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-outline btn-small"
                          style={{ padding: '3px 8px', fontSize: '11px', marginLeft: '12px' }}
                          onClick={() => handleRemoveGoal(g.id)}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="onboarding-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setStep(3)}
              >
                ← Back
              </button>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleFinish}
                >
                  Complete Setup & Launch Dashboard →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Toast message={toastMsg} isVisible={showToast} />
    </div>
  );
}
