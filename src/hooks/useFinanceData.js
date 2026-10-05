import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  STUDENT_DATA,
  BUSINESS_DATA,
  TECH_DATA,
  NEWS_DATA,
  RATINGS_DATA,
  FEATURES_DATA,
  ABOUT_DATA
} from '../data/mockData';
import {
  calculatePortfolioValue,
  calculateTotalInvested,
  calculatePerformance,
  calculateAssetAllocations,
  calculateAllocationDrift,
  calculateHoldings,
  calculateMarketExposure,
  formatCurrency
} from '../utils/financialCalculations';

const STORAGE_KEY_USER = 'finsight_user';
const STORAGE_KEY_ACCOUNTS = 'finsight_accounts';
const STORAGE_KEY_FINANCIAL_DATA = 'finsight_financial_data';

// Helper to format clean human name from email or raw string
export function formatHumanName(input) {
  if (!input) return 'User';
  let raw = input.split('@')[0].trim();
  
  // Remove numbers and replace punctuation with spaces
  let cleaned = raw.replace(/[0-9]+/g, '').replace(/[._-]+/g, ' ').trim();

  // Split CamelCase if any (e.g. HarmanKaur -> Harman Kaur)
  cleaned = cleaned.replace(/([a-z])([A-Z])/g, '$1 $2');

  // If already separated by spaces, capitalize each word nicely
  if (cleaned.includes(' ')) {
    return cleaned
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }

  // Split common compound surnames if squished together without spaces
  const commonSuffixes = [
    'kaur', 'singh', 'sharma', 'patel', 'kumar', 'gupta', 'verma',
    'devi', 'rao', 'reddy', 'das', 'roy', 'nair', 'khan', 'ali',
    'shah', 'jain', 'mehta', 'bose', 'sen', 'dutta', 'paul'
  ];

  for (const suffix of commonSuffixes) {
    const regex = new RegExp(`^([a-zA-Z]{3,})(${suffix})$`, 'i');
    if (regex.test(cleaned)) {
      cleaned = cleaned.replace(regex, '$1 $2');
      break;
    }
  }

  if (cleaned.length > 0) {
    return cleaned
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }
  return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
}

export function useFinanceData() {
  // Load user from localStorage or initialize with null
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed && parsed.name) {
        parsed.name = formatHumanName(parsed.name);
      }
      return parsed;
    } catch (e) {
      return null;
    }
  });

  // Load user's financial data from localStorage
  const [financialData, setFinancialData] = useState(() => {
    try {
      const savedUserStr = localStorage.getItem(STORAGE_KEY_USER);
      if (!savedUserStr) return { monthlySavings: null, investments: [], goals: [] };
      const savedUser = JSON.parse(savedUserStr);
      if (!savedUser || savedUser.isDemo || !savedUser.email) {
        return { monthlySavings: null, investments: [], goals: [] };
      }
      const allFinData = JSON.parse(localStorage.getItem(STORAGE_KEY_FINANCIAL_DATA) || '{}');
      return allFinData[savedUser.email.toLowerCase()] || { monthlySavings: null, investments: [], goals: [] };
    } catch (e) {
      return { monthlySavings: null, investments: [], goals: [] };
    }
  });

  // Sync user state with localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      console.error('Failed to sync user storage', e);
    }
  }, [user]);

  // Sync user financial data when user changes
  useEffect(() => {
    if (!user || user.isDemo || !user.email) {
      if (!user) {
        setFinancialData({ monthlySavings: null, investments: [], goals: [] });
      }
      return;
    }

    try {
      const allFinData = JSON.parse(localStorage.getItem(STORAGE_KEY_FINANCIAL_DATA) || '{}');
      const userFinData = allFinData[user.email.toLowerCase()] || { monthlySavings: null, investments: [], goals: [] };
      setFinancialData(userFinData);
    } catch (e) {
      console.error('Failed to load user financial data', e);
    }
  }, [user?.email, user?.isDemo]);

  // Save financial data for active user
  const saveFinancialData = useCallback((newDataOrFn) => {
    setFinancialData((prev) => {
      const updated = typeof newDataOrFn === 'function' ? newDataOrFn(prev) : newDataOrFn;
      if (user && !user.isDemo && user.email) {
        try {
          const allFinData = JSON.parse(localStorage.getItem(STORAGE_KEY_FINANCIAL_DATA) || '{}');
          allFinData[user.email.toLowerCase()] = updated;
          localStorage.setItem(STORAGE_KEY_FINANCIAL_DATA, JSON.stringify(allFinData));
        } catch (e) {
          console.error('Failed to persist financial data', e);
        }
      }
      return updated;
    });
  }, [user]);

  // Individual investment mutations
  const addInvestment = useCallback((investment) => {
    const newInv = {
      id: investment.id || `inv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: investment.name.trim(),
      type: investment.type || 'Stocks',
      investedAmount: Number(investment.investedAmount) || 0,
      currentValue: investment.currentValue !== undefined && investment.currentValue !== null && investment.currentValue !== ''
        ? Number(investment.currentValue)
        : Number(investment.investedAmount) || 0,
      targetAllocation: investment.targetAllocation !== undefined && investment.targetAllocation !== null && investment.targetAllocation !== ''
        ? Number(investment.targetAllocation)
        : null
    };

    saveFinancialData((prev) => ({
      ...prev,
      investments: [...(prev.investments || []), newInv]
    }));
  }, [saveFinancialData]);

  const updateInvestment = useCallback((id, updated) => {
    saveFinancialData((prev) => ({
      ...prev,
      investments: (prev.investments || []).map((inv) => (inv.id === id ? { ...inv, ...updated } : inv))
    }));
  }, [saveFinancialData]);

  const deleteInvestment = useCallback((id) => {
    saveFinancialData((prev) => ({
      ...prev,
      investments: (prev.investments || []).filter((inv) => inv.id !== id)
    }));
  }, [saveFinancialData]);

  // Individual goal mutations
  const addGoal = useCallback((goal) => {
    const newGoal = {
      id: goal.id || `goal-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: goal.title.trim(),
      current: Number(goal.current) || 0,
      target: Number(goal.target) || 1,
      unit: goal.unit || '₹'
    };

    saveFinancialData((prev) => ({
      ...prev,
      goals: [...(prev.goals || []), newGoal]
    }));
  }, [saveFinancialData]);

  const updateGoal = useCallback((id, updated) => {
    saveFinancialData((prev) => ({
      ...prev,
      goals: (prev.goals || []).map((g) => (g.id === id ? { ...g, ...updated } : g))
    }));
  }, [saveFinancialData]);

  const deleteGoal = useCallback((id) => {
    saveFinancialData((prev) => ({
      ...prev,
      goals: (prev.goals || []).filter((g) => g.id !== id)
    }));
  }, [saveFinancialData]);

  // Monthly savings mutation
  const updateMonthlySavings = useCallback((savings) => {
    saveFinancialData((prev) => ({
      ...prev,
      monthlySavings: savings !== null && savings !== undefined && savings !== '' ? Number(savings) : null
    }));
  }, [saveFinancialData]);

  // Login handler
  const login = useCallback((email, password) => {
    let savedAccounts = {};
    try {
      savedAccounts = JSON.parse(localStorage.getItem(STORAGE_KEY_ACCOUNTS) || '{}');
    } catch (e) {
      savedAccounts = {};
    }

    const emailKey = email.toLowerCase().trim();
    const registeredUser = savedAccounts[emailKey];
    const defaultRole = emailKey.includes('business') ? 'business' : emailKey.includes('tech') || emailKey.includes('enterprise') ? 'tech' : 'student';

    const loggedUser = {
      name: registeredUser?.name || formatHumanName(email),
      email: emailKey,
      userType: registeredUser?.userType || defaultRole,
      investments: registeredUser?.investments || [],
      goals: registeredUser?.goals || [],
      isLoggedIn: true,
      isDemo: false,
      needsOnboarding: registeredUser ? Boolean(registeredUser.needsOnboarding) : true
    };

    // Load financial data for this user
    let userFinData = { monthlySavings: null, investments: [], goals: [] };
    try {
      const allFinData = JSON.parse(localStorage.getItem(STORAGE_KEY_FINANCIAL_DATA) || '{}');
      userFinData = allFinData[emailKey] || { monthlySavings: null, investments: [], goals: [] };
    } catch (e) {
      userFinData = { monthlySavings: null, investments: [], goals: [] };
    }

    setFinancialData(userFinData);
    setUser(loggedUser);
    return { success: true, user: loggedUser };
  }, []);

  // Signup handler
  const signup = useCallback((name, email, password) => {
    const emailKey = email.toLowerCase().trim();
    const formattedName = name.trim() ? name.trim() : formatHumanName(email);
    const newUser = {
      name: formattedName,
      email: emailKey,
      userType: 'student',
      investments: [],
      goals: [],
      isLoggedIn: true,
      isDemo: false,
      needsOnboarding: true
    };

    try {
      const savedAccounts = JSON.parse(localStorage.getItem(STORAGE_KEY_ACCOUNTS) || '{}');
      savedAccounts[emailKey] = newUser;
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(savedAccounts));

      const allFinData = JSON.parse(localStorage.getItem(STORAGE_KEY_FINANCIAL_DATA) || '{}');
      allFinData[emailKey] = { monthlySavings: null, investments: [], goals: [] };
      localStorage.setItem(STORAGE_KEY_FINANCIAL_DATA, JSON.stringify(allFinData));
    } catch (e) {
      console.error('Failed to initialize account and financial storage', e);
    }

    setFinancialData({ monthlySavings: null, investments: [], goals: [] });
    setUser(newUser);
    return { success: true, user: newUser };
  }, []);

  // One-click demo login
  const demoLogin = useCallback((role = 'student') => {
    let mockProfile;
    if (role === 'business') {
      mockProfile = {
        name: BUSINESS_DATA.name,
        email: BUSINESS_DATA.email,
        userType: 'business',
        investments: ['Stocks', 'Bonds', 'Real Estate'],
        goals: ['Market trends', 'Future projections'],
        isLoggedIn: true,
        isDemo: true,
        needsOnboarding: false
      };
    } else if (role === 'tech') {
      mockProfile = {
        name: TECH_DATA.name,
        email: TECH_DATA.email,
        userType: 'tech',
        investments: ['Stocks', 'Bonds', 'Crypto', 'ETFs'],
        goals: ['Risk', 'Future projections'],
        isLoggedIn: true,
        isDemo: true,
        needsOnboarding: false
      };
    } else {
      mockProfile = {
        name: STUDENT_DATA.name,
        email: STUDENT_DATA.email,
        userType: 'student',
        investments: ['Stocks', 'Mutual Funds', 'Crypto'],
        goals: ['Learning about investing', 'Portfolio growth'],
        isLoggedIn: true,
        isDemo: true,
        needsOnboarding: false
      };
    }
    setUser(mockProfile);
    return mockProfile;
  }, []);

  // Update profile from onboarding
  const updateProfile = useCallback((profileData) => {
    setUser((prev) => {
      const emailKey = (profileData.email || prev?.email || '').toLowerCase().trim();
      const updatedUser = {
        ...(prev || {}),
        ...profileData,
        isLoggedIn: true,
        isDemo: false,
        needsOnboarding: false
      };

      if (emailKey) {
        try {
          const savedAccounts = JSON.parse(localStorage.getItem(STORAGE_KEY_ACCOUNTS) || '{}');
          savedAccounts[emailKey] = updatedUser;
          localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(savedAccounts));
        } catch (e) {
          console.error('Failed to sync updated profile to accounts', e);
        }
      }

      // If financial data is provided in onboarding
      if (profileData.financialData && emailKey) {
        try {
          const allFinData = JSON.parse(localStorage.getItem(STORAGE_KEY_FINANCIAL_DATA) || '{}');
          allFinData[emailKey] = profileData.financialData;
          localStorage.setItem(STORAGE_KEY_FINANCIAL_DATA, JSON.stringify(allFinData));
          setFinancialData(profileData.financialData);
        } catch (e) {
          console.error('Failed to sync financial data on onboarding completion', e);
        }
      }

      return updatedUser;
    });
  }, []);

  // Switch role for demo/testing
  const switchRole = useCallback((newRole) => {
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        userType: newRole
      };
    });
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    setUser(null);
    setFinancialData({ monthlySavings: null, investments: [], goals: [] });
  }, []);

  // Compute dynamic user-driven dashboard data
  const isDemo = Boolean(user?.isDemo);

  const calculatedStudentData = useMemo(() => {
    if (isDemo) return STUDENT_DATA;

    const investments = financialData?.investments || [];
    const goals = financialData?.goals || [];
    const monthlySavings = financialData?.monthlySavings;

    const portfolioRawValue = calculatePortfolioValue(investments);
    const totalInvested = calculateTotalInvested(investments);
    const performance = calculatePerformance(investments);
    const allocations = calculateAssetAllocations(investments);
    const drift = calculateAllocationDrift(investments, allocations);

    let insightMessage = 'Your portfolio is currently within your target allocation range.';
    if (investments.length === 0) {
      insightMessage = 'Add your first investments to start tracking your asset distribution and performance.';
    } else if (!drift.isConfigured) {
      insightMessage = 'Set target allocations across your holdings to monitor rebalancing drift automatically.';
    } else if (drift.value && parseFloat(drift.value) > 5) {
      insightMessage = `Portfolio has drifted by ${drift.value}. Consider directing new monthly savings to restore balance.`;
    }

    return {
      userType: 'student',
      name: user?.name || 'Student',
      email: user?.email || '',
      portfolioValue: formatCurrency(portfolioRawValue),
      portfolioRawValue,
      totalInvested,
      performance: performance.formatted,
      isPositive: performance.isPositive,
      monthlySavings: monthlySavings !== null && monthlySavings !== undefined && monthlySavings !== ''
        ? formatCurrency(monthlySavings)
        : 'Not provided',
      allocationDrift: drift.value || 'Not configured',
      driftConfigured: drift.isConfigured,
      insightMessage,
      allocations,
      goals,
      educationalModules: STUDENT_DATA.educationalModules,
      videoTutorials: STUDENT_DATA.videoTutorials,
      assistantSuggestions: STUDENT_DATA.assistantSuggestions
    };
  }, [isDemo, financialData, user?.name, user?.email]);

  const calculatedBusinessData = useMemo(() => {
    if (isDemo) return BUSINESS_DATA;

    const investments = financialData?.investments || [];
    const portfolioRawValue = calculatePortfolioValue(investments);
    const performance = calculatePerformance(investments);
    const allocations = calculateAssetAllocations(investments);
    const drift = calculateAllocationDrift(investments, allocations);
    const holdings = calculateHoldings(investments);
    const marketExposure = calculateMarketExposure(investments);

    let insightMessage = 'Corporate treasury allocation is structured with healthy operational liquidity.';
    if (investments.length === 0) {
      insightMessage = 'Add treasury investments to track corporate asset allocation, risk metrics, and simulation curves.';
    } else if (!drift.isConfigured) {
      insightMessage = 'Configure target asset allocations to monitor quarterly rebalancing thresholds.';
    }

    return {
      userType: 'business',
      name: user?.name || 'Business Treasury',
      email: user?.email || '',
      portfolioValue: formatCurrency(portfolioRawValue),
      portfolioRawValue,
      marketExposure,
      performance: performance.formatted,
      isPositive: performance.isPositive,
      allocationDrift: drift.value || 'Not configured',
      driftConfigured: drift.isConfigured,
      insightMessage,
      allocations,
      holdings,
      marketOutlook: BUSINESS_DATA.marketOutlook,
      riskMetrics: {
        portfolioBeta: portfolioRawValue > 0 ? '0.94' : 'N/A',
        annualizedVolatility: portfolioRawValue > 0 ? '11.2%' : 'N/A',
        sharpeRatio: portfolioRawValue > 0 ? '1.82' : 'N/A',
        stressTestLoss: portfolioRawValue > 0
          ? formatCurrency(Math.round(portfolioRawValue * 0.08)) + ' (Max Simulated)'
          : 'Add portfolio data'
      },
      assistantSuggestions: BUSINESS_DATA.assistantSuggestions
    };
  }, [isDemo, financialData, user?.name, user?.email]);

  const calculatedTechData = useMemo(() => {
    if (isDemo) return TECH_DATA;

    const investments = financialData?.investments || [];
    const portfolioRawValue = calculatePortfolioValue(investments);
    const performance = calculatePerformance(investments);
    const allocations = calculateAssetAllocations(investments);
    const drift = calculateAllocationDrift(investments, allocations);
    const holdings = calculateHoldings(investments);

    // Calculate tech exposure
    const techInvestments = investments.filter(inv =>
      ['Stocks', 'Crypto', 'ETFs'].includes(inv.type) ||
      (inv.name && (inv.name.toLowerCase().includes('tech') || inv.name.toLowerCase().includes('cloud') || inv.name.toLowerCase().includes('ai')))
    );
    const techVal = techInvestments.reduce((sum, inv) => {
      const v = inv.currentValue !== undefined && inv.currentValue !== null && inv.currentValue !== ''
        ? Number(inv.currentValue)
        : Number(inv.investedAmount);
      return sum + (isNaN(v) ? 0 : v);
    }, 0);
    const techSectorExposure = portfolioRawValue > 0 ? `${Math.round((techVal / portfolioRawValue) * 100)}%` : '0%';

    // Projections
    let projections = [];
    if (portfolioRawValue > 0) {
      projections = [
        { year: '2026', projectedValue: formatCurrency(portfolioRawValue), status: 'Current', simulatedGrowth: performance.formatted },
        { year: '2027', projectedValue: formatCurrency(Math.round(portfolioRawValue * 1.15)), status: 'Simulated', simulatedGrowth: '+15.0%' },
        { year: '2028', projectedValue: formatCurrency(Math.round(portfolioRawValue * 1.32)), status: 'Simulated', simulatedGrowth: '+32.0%' },
        { year: '2029', projectedValue: formatCurrency(Math.round(portfolioRawValue * 1.52)), status: 'Simulated', simulatedGrowth: '+52.0%' },
        { year: '2030', projectedValue: formatCurrency(Math.round(portfolioRawValue * 1.75)), status: 'Simulated', simulatedGrowth: '+75.0%' }
      ];
    } else {
      projections = [
        { year: '2026', projectedValue: '₹0', status: 'Current', simulatedGrowth: 'No data' },
        { year: '2027', projectedValue: '₹0', status: 'Simulated', simulatedGrowth: 'No data' },
        { year: '2028', projectedValue: '₹0', status: 'Simulated', simulatedGrowth: 'No data' },
        { year: '2029', projectedValue: '₹0', status: 'Simulated', simulatedGrowth: 'No data' },
        { year: '2030', projectedValue: '₹0', status: 'Simulated', simulatedGrowth: 'No data' }
      ];
    }

    let insightMessage = 'Enterprise holdings exhibit strong technological resilience across infrastructure components.';
    if (investments.length === 0) {
      insightMessage = 'Add enterprise portfolio assets to run 4-year valuation projections and sector concentration analytics.';
    }

    return {
      userType: 'tech',
      name: user?.name || 'Enterprise Treasury',
      email: user?.email || '',
      portfolioValue: formatCurrency(portfolioRawValue),
      portfolioRawValue,
      performance: performance.formatted,
      isPositive: performance.isPositive,
      costLossExposure: portfolioRawValue > 0
        ? formatCurrency(Math.round(portfolioRawValue * 0.12))
        : 'Add portfolio data',
      techSectorExposure,
      allocationDrift: drift.value || 'Not configured',
      driftConfigured: drift.isConfigured,
      insightMessage,
      allocations,
      holdings,
      riskAreas: TECH_DATA.riskAreas,
      crunchAcquisition: TECH_DATA.crunchAcquisition,
      projections,
      assistantSuggestions: TECH_DATA.assistantSuggestions
    };
  }, [isDemo, financialData, user?.name, user?.email]);

  return {
    user,
    isAuthenticated: Boolean(user?.isLoggedIn),
    financialData,
    saveFinancialData,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    addGoal,
    updateGoal,
    deleteGoal,
    updateMonthlySavings,
    login,
    signup,
    demoLogin,
    logout,
    updateProfile,
    switchRole,
    studentData: calculatedStudentData,
    businessData: calculatedBusinessData,
    techData: calculatedTechData,
    news: NEWS_DATA,
    ratings: RATINGS_DATA,
    features: FEATURES_DATA,
    about: ABOUT_DATA
  };
}
