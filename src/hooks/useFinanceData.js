/**
 * AUTHENTICATION LIMITATION & PROTOTYPE NOTICE:
 * Client-side authentication in FinSight is strictly prototype-only.
 * Credentials and accounts are managed in browser localStorage for offline prototyping,
 * local demos, and pair programming evaluation.
 * Passwords are NOT hashed, salted, or securely verified against a cryptographic backend.
 * This implementation is NOT production-ready and must be replaced with an OAuth 2.0 / OIDC
 * server-side authentication service (e.g. Firebase Auth, Supabase, Auth0, or secure JWT backend)
 * before any real production deployment or storing sensitive financial credentials.
 */

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
  formatCurrency,
  getCurrencySymbol,
  calculateCashRunway,
  calculateBudgetUtilization,
  calculateSavingsRate,
  calculateNetFinancialPosition,
  calculateGoalCompletion,
  calculateTechSectorExposure
} from '../utils/financialCalculations';
import {
  getUserValueHistoryKey,
  migrateGlobalValueHistory
} from '../utils/valueHistory';
import {
  getStudiedResourcesKey,
  migrateGlobalStudiedResources
} from '../components/EducationCard';

const STORAGE_KEY_USER = 'finsight_user';
const STORAGE_KEY_ACCOUNTS = 'finsight_accounts';
const STORAGE_KEY_FINANCIAL_DATA = 'finsight_financial_data';

// Helper to format clean human name from email or raw string
export function formatHumanName(input) {
  if (!input) return 'Guest User';
  let raw = input.split('@')[0].trim();
  if (!raw || raw.toLowerCase() === 'user') return 'Guest User';
  
  // Remove numbers and replace punctuation with spaces
  let cleaned = raw.replace(/[0-9]+/g, '').replace(/[._-]+/g, ' ').trim();
  if (!cleaned || cleaned.toLowerCase() === 'user') return 'Guest User';

  // Split CamelCase if any (e.g. HarmanKaur -> Harman Kaur)
  cleaned = cleaned.replace(/([a-z])([A-Z])/g, '$1 $2');

  // If already separated by spaces, capitalize each word nicely
  if (cleaned.includes(' ')) {
    const res = cleaned
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
    return res.toLowerCase() === 'user' ? 'Guest User' : res;
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

// Helper to map role to corresponding dashboard route
export function getRoleDashboardPath(role) {
  if (role === 'business') return '/business-dashboard';
  if (role === 'tech') return '/tech-dashboard';
  return '/student-dashboard';
}

export function normalizeSpendingBreakdown(rawBreakdown) {
  const categories = {
    cloudInfrastructure: null,
    softwareLicensing: null,
    hardware: null,
    cybersecurity: null,
    itOperations: null,
    researchAndDevelopment: null,
    other: null
  };

  if (!rawBreakdown) return categories;

  if (Array.isArray(rawBreakdown)) {
    rawBreakdown.forEach((item) => {
      if (!item) return;
      const cat = (item.category || item.name || item.id || '').toLowerCase();
      const amt = Number(item.monthlyAmount ?? item.amount ?? item.value);
      if (isNaN(amt) || amt < 0) return;

      if (cat.includes('cloud')) categories.cloudInfrastructure = (categories.cloudInfrastructure || 0) + amt;
      else if (cat.includes('software') || cat.includes('saas') || cat.includes('licens')) categories.softwareLicensing = (categories.softwareLicensing || 0) + amt;
      else if (cat.includes('hardware') || cat.includes('device')) categories.hardware = (categories.hardware || 0) + amt;
      else if (cat.includes('cyber') || cat.includes('security')) categories.cybersecurity = (categories.cybersecurity || 0) + amt;
      else if (cat.includes('operation') || cat.includes('it ops')) categories.itOperations = (categories.itOperations || 0) + amt;
      else if (cat.includes('research') || cat.includes('r&d') || cat.includes('rnd')) categories.researchAndDevelopment = (categories.researchAndDevelopment || 0) + amt;
      else categories.other = (categories.other || 0) + amt;
    });
  } else if (typeof rawBreakdown === 'object') {
    for (const [key, val] of Object.entries(rawBreakdown)) {
      const num = Number(val);
      if (isNaN(num) || num < 0) continue;
      const k = key.toLowerCase();
      if (k.includes('cloud')) categories.cloudInfrastructure = num;
      else if (k.includes('software') || k.includes('saas') || k.includes('licens')) categories.softwareLicensing = num;
      else if (k.includes('hardware') || k.includes('device')) categories.hardware = num;
      else if (k.includes('cyber') || k.includes('security')) categories.cybersecurity = num;
      else if (k.includes('operation') || k.includes('itops')) categories.itOperations = num;
      else if (k.includes('research') || k.includes('rnd') || k.includes('r&d')) categories.researchAndDevelopment = num;
      else if (k.includes('other')) categories.other = num;
    }
  }

  return categories;
}

/**
 * Normalizes user financial data into FinSight Phase 2 structure with backward compatibility
 */
export function normalizeFinancialData(raw) {
  if (!raw || typeof raw !== 'object') {
    return {
      commonProfile: {
        currency: 'INR',
        country: 'India',
        financialObjective: 'Wealth creation',
        riskTolerance: 'Moderate',
        investmentExperience: 'Beginner',
        investmentHorizon: '3-5 years'
      },
      studentProfile: {
        educationLevel: 'Undergraduate',
        incomeSource: 'Allowance',
        monthlyIncome: null,
        monthlyExpenses: null,
        monthlySavings: null,
        existingSavings: null,
        learningPreferences: {
          knowledgeLevel: 'Beginner',
          topicsOfInterest: [],
          learningGoals: ''
        }
      },
      businessProfile: {
        businessName: '',
        industry: '',
        businessSize: '',
        annualRevenue: null,
        monthlyRevenue: null,
        monthlyOperatingExpenses: null,
        cashReserves: null,
        shortTermLiabilities: 0,
        longTermLiabilities: 0,
        expectedUpcomingObligations: null,
        minDesiredCashReserve: null,
        expectedCapitalRequirements: null
      },
      techProfile: {
        organizationName: '',
        techIndustry: '',
        organizationSize: '',
        annualTechBudget: null,
        monthlyTechExpenditure: null,
        spendingBreakdown: [],
        techAssets: [],
        futureTechPlans: ''
      },
      monthlySavings: null,
      investments: [],
      goals: [],
      targetAllocations: null
    };
  }

  const common = raw.commonProfile || {};
  const student = raw.studentProfile || {};
  const business = raw.businessProfile || {};
  const tech = raw.techProfile || {};

  const parseNumOrNull = (val) => {
    if (val === null || val === undefined || val === '') return null;
    const num = Number(val);
    return isNaN(num) ? null : num;
  };

  const parseNumOrDefault = (val, def = 0) => {
    if (val === null || val === undefined || val === '') return def;
    const num = Number(val);
    return isNaN(num) ? def : num;
  };

  const studentMonthlySavings = parseNumOrNull(
    raw.monthlySavings !== undefined && raw.monthlySavings !== null
      ? raw.monthlySavings
      : (student.monthlySavings !== undefined ? student.monthlySavings : raw.monthlySavings)
  );

  return {
    commonProfile: {
      currency: common.currency || raw.currency || 'INR',
      country: common.country || raw.country || 'India',
      financialObjective: common.financialObjective || raw.financialObjective || 'Wealth creation',
      riskTolerance: common.riskTolerance || raw.riskTolerance || 'Moderate',
      investmentExperience: common.investmentExperience || raw.investmentExperience || 'Beginner',
      investmentHorizon: common.investmentHorizon || raw.investmentHorizon || '3-5 years'
    },
    studentProfile: {
      educationLevel: student.educationLevel || raw.educationLevel || 'Undergraduate',
      incomeSource: student.incomeSource || raw.incomeSource || 'Allowance',
      monthlyIncome: parseNumOrNull(student.monthlyIncome !== undefined ? student.monthlyIncome : raw.monthlyIncome),
      monthlyExpenses: parseNumOrNull(student.monthlyExpenses !== undefined ? student.monthlyExpenses : raw.monthlyExpenses),
      monthlySavings: studentMonthlySavings,
      existingSavings: parseNumOrNull(student.existingSavings !== undefined ? student.existingSavings : raw.existingSavings),
      learningPreferences: student.learningPreferences || raw.learningPreferences || {
        knowledgeLevel: 'Beginner',
        topicsOfInterest: [],
        learningGoals: ''
      }
    },
    businessProfile: {
      businessName: (business.businessName || raw.businessName || '').trim(),
      industry: (business.industry || raw.industry || '').trim(),
      businessSize: (business.businessSize || raw.businessSize || '').trim(),
      annualRevenue: parseNumOrNull(business.annualRevenue !== undefined ? business.annualRevenue : raw.annualRevenue),
      monthlyRevenue: parseNumOrNull(business.monthlyRevenue !== undefined ? business.monthlyRevenue : raw.monthlyRevenue),
      monthlyOperatingExpenses: parseNumOrNull(business.monthlyOperatingExpenses !== undefined ? business.monthlyOperatingExpenses : raw.monthlyOperatingExpenses),
      cashReserves: parseNumOrNull(business.cashReserves !== undefined ? business.cashReserves : raw.cashReserves),
      shortTermLiabilities: parseNumOrNull(business.shortTermLiabilities !== undefined ? business.shortTermLiabilities : raw.shortTermLiabilities),
      longTermLiabilities: parseNumOrNull(business.longTermLiabilities !== undefined ? business.longTermLiabilities : raw.longTermLiabilities),
      expectedUpcomingObligations: parseNumOrNull(business.expectedUpcomingObligations !== undefined ? business.expectedUpcomingObligations : raw.expectedUpcomingObligations),
      minDesiredCashReserve: parseNumOrNull(business.minDesiredCashReserve !== undefined ? business.minDesiredCashReserve : raw.minDesiredCashReserve),
      expectedCapitalRequirements: parseNumOrNull(business.expectedCapitalRequirements !== undefined ? business.expectedCapitalRequirements : raw.expectedCapitalRequirements)
    },
    techProfile: {
      organizationName: (tech.organizationName || raw.organizationName || '').trim(),
      techIndustry: (tech.techIndustry || raw.techIndustry || '').trim(),
      organizationSize: (tech.organizationSize || raw.organizationSize || '').trim(),
      annualTechBudget: parseNumOrNull(tech.annualTechBudget !== undefined ? tech.annualTechBudget : raw.annualTechBudget),
      monthlyTechExpenditure: parseNumOrNull(tech.monthlyTechExpenditure !== undefined ? tech.monthlyTechExpenditure : raw.monthlyTechExpenditure),
      spendingBreakdown: normalizeSpendingBreakdown(tech.spendingBreakdown !== undefined ? tech.spendingBreakdown : raw.spendingBreakdown),
      techAssets: Array.isArray(tech.techAssets) ? tech.techAssets : (Array.isArray(raw.techAssets) ? raw.techAssets : []),
      futureTechPlans: tech.futureTechPlans || raw.futureTechPlans || ''
    },
    monthlySavings: studentMonthlySavings,
    investments: Array.isArray(raw.investments) ? raw.investments.map(inv => {
      const valMethod = inv.valuationMethod === 'quantity_price' || (inv.quantity && inv.purchasePrice) ? 'quantity_price' : 'manual';
      return {
        id: inv.id || `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: inv.name || 'Unnamed Asset',
        type: inv.type || 'Stocks',
        sector: inv.sector || (inv.type === 'Stocks' ? 'Equities' : inv.type || 'Other'),
        valuationMethod: valMethod,
        quantity: inv.quantity !== undefined && inv.quantity !== null && inv.quantity !== '' ? Number(inv.quantity) : null,
        purchasePrice: inv.purchasePrice !== undefined && inv.purchasePrice !== null && inv.purchasePrice !== '' ? Number(inv.purchasePrice) : null,
        currentPrice: inv.currentPrice !== undefined && inv.currentPrice !== null && inv.currentPrice !== '' ? Number(inv.currentPrice) : null,
        investedAmount: Number(inv.investedAmount) || 0,
        currentValue: inv.currentValue !== undefined && inv.currentValue !== null && inv.currentValue !== '' ? Number(inv.currentValue) : (Number(inv.investedAmount) || 0),
        targetAllocation: inv.targetAllocation !== undefined && inv.targetAllocation !== null && inv.targetAllocation !== '' ? Number(inv.targetAllocation) : null,
        liquidityClassification: inv.liquidityClassification || null
      };
    }) : [],
    goals: Array.isArray(raw.goals) ? raw.goals.map(g => ({
      id: g.id || `goal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: g.title || 'Financial Goal',
      target: Number(g.target) || 1,
      current: Number(g.current) || 0,
      unit: g.unit || (common.currency ? getCurrencySymbol(common.currency) : '₹'),
      targetDate: g.targetDate || '',
      monthlyContribution: g.monthlyContribution !== undefined && g.monthlyContribution !== null ? Number(g.monthlyContribution) : null,
      priority: g.priority || 'Medium'
    })) : [],
    targetAllocations: raw.targetAllocations && typeof raw.targetAllocations === 'object' && !Array.isArray(raw.targetAllocations)
      ? raw.targetAllocations
      : null
  };
}

export function useFinanceData() {
  // Load user from localStorage or initialize with null
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed) {
        if (parsed.name) {
          parsed.name = formatHumanName(parsed.name);
        }
        if (!parsed.id) {
          parsed.id = parsed.isDemo
            ? `demo_${parsed.userType || 'student'}`
            : (parsed.email ? `usr_${btoa(parsed.email.toLowerCase().trim()).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)}` : 'usr_default');
        }
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
      if (!savedUserStr) return normalizeFinancialData(null);
      const savedUser = JSON.parse(savedUserStr);
      if (!savedUser || savedUser.isDemo) {
        return normalizeFinancialData(null);
      }
      const allFinData = JSON.parse(localStorage.getItem(STORAGE_KEY_FINANCIAL_DATA) || '{}');
      const emailKey = (savedUser.email || '').toLowerCase().trim();
      const userFin = (savedUser.id && allFinData[savedUser.id]) || (emailKey && allFinData[emailKey]) || savedUser.financialData || savedUser.customFinancialData;
      return normalizeFinancialData(userFin);
    } catch (e) {
      return normalizeFinancialData(null);
    }
  });

  // Sync user state with localStorage and migrate legacy global data if single user
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
        if (!user.isDemo) {
          migrateGlobalValueHistory(user);
          migrateGlobalStudiedResources(user);
        }
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      console.error('Failed to sync user storage', e);
    }
  }, [user]);

  // Sync user financial data when user changes
  useEffect(() => {
    if (!user || user.isDemo) {
      if (!user) {
        setFinancialData(normalizeFinancialData(null));
      }
      return;
    }

    try {
      const allFinData = JSON.parse(localStorage.getItem(STORAGE_KEY_FINANCIAL_DATA) || '{}');
      const emailKey = (user.email || '').toLowerCase().trim();
      let userFin = (user.id && allFinData[user.id]) || (emailKey && allFinData[emailKey]);

      if (!userFin) {
        const savedAccounts = JSON.parse(localStorage.getItem(STORAGE_KEY_ACCOUNTS) || '{}');
        const reg = emailKey ? savedAccounts[emailKey] : null;
        userFin = reg?.financialData || reg?.customFinancialData || user.financialData || user.customFinancialData;
      }

      const normalized = normalizeFinancialData(userFin);
      setFinancialData(normalized);
      if (user.id) allFinData[user.id] = normalized;
      if (emailKey) allFinData[emailKey] = normalized;
      localStorage.setItem(STORAGE_KEY_FINANCIAL_DATA, JSON.stringify(allFinData));
    } catch (e) {
      console.error('Failed to load user financial data', e);
    }
  }, [user?.id, user?.email, user?.isDemo]);

  // Save financial data for active user
  const saveFinancialData = useCallback((newDataOrFn) => {
    let currentUser = user;
    if (!currentUser) {
      try {
        const s = localStorage.getItem(STORAGE_KEY_USER);
        if (s) currentUser = JSON.parse(s);
      } catch (e) {}
    }

    let currentData = financialData;
    try {
      const allFin = JSON.parse(localStorage.getItem(STORAGE_KEY_FINANCIAL_DATA) || '{}');
      const email = (currentUser?.email || '').toLowerCase().trim();
      const fromStore = (currentUser?.id && allFin[currentUser.id]) || (email && allFin[email]);
      if (fromStore) currentData = fromStore;
    } catch (e) {}

    const updated = typeof newDataOrFn === 'function' ? newDataOrFn(currentData || {}) : newDataOrFn;
    const normalized = normalizeFinancialData(updated);

    if (currentUser && !currentUser.isDemo) {
      try {
        const allFinData = JSON.parse(localStorage.getItem(STORAGE_KEY_FINANCIAL_DATA) || '{}');
        const emailKey = (currentUser.email || '').toLowerCase().trim();
        if (currentUser.id) allFinData[currentUser.id] = normalized;
        if (emailKey) allFinData[emailKey] = normalized;
        localStorage.setItem(STORAGE_KEY_FINANCIAL_DATA, JSON.stringify(allFinData));

        if (emailKey) {
          const savedAccounts = JSON.parse(localStorage.getItem(STORAGE_KEY_ACCOUNTS) || '{}');
          if (savedAccounts[emailKey]) {
            savedAccounts[emailKey].financialData = normalized;
            savedAccounts[emailKey].customFinancialData = normalized;
            localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(savedAccounts));
          }
        }
      } catch (e) {
        console.error('Failed to persist financial data', e);
      }
    }
    setFinancialData(normalized);
    return normalized;
  }, [user, financialData]);

  // Individual investment mutations
  const addInvestment = useCallback((investment) => {
    const valMethod = investment.valuationMethod === 'quantity_price' || (investment.quantity && investment.purchasePrice)
      ? 'quantity_price'
      : 'manual';

    const qty = investment.quantity !== undefined && investment.quantity !== null && investment.quantity !== ''
      ? Math.max(0, Number(investment.quantity))
      : null;
    const purchase = investment.purchasePrice !== undefined && investment.purchasePrice !== null && investment.purchasePrice !== ''
      ? Math.max(0, Number(investment.purchasePrice))
      : null;
    const currPrice = investment.currentPrice !== undefined && investment.currentPrice !== null && investment.currentPrice !== ''
      ? Math.max(0, Number(investment.currentPrice))
      : purchase;

    let investedAmt = Number(investment.investedAmount) || 0;
    let currVal = investment.currentValue !== undefined && investment.currentValue !== null && investment.currentValue !== ''
      ? Number(investment.currentValue)
      : investedAmt;

    if (valMethod === 'quantity_price' && qty !== null && purchase !== null) {
      investedAmt = qty * purchase;
      currVal = qty * (currPrice !== null ? currPrice : purchase);
    }

    const newInv = {
      id: investment.id || `inv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: (investment.name || 'Unnamed Asset').trim(),
      type: investment.type || 'Stocks',
      valuationMethod: valMethod,
      quantity: qty,
      purchasePrice: purchase,
      currentPrice: currPrice,
      investedAmount: investedAmt,
      currentValue: currVal,
      targetAllocation: investment.targetAllocation !== undefined && investment.targetAllocation !== null && investment.targetAllocation !== ''
        ? Number(investment.targetAllocation)
        : null,
      liquidityClassification: investment.liquidityClassification || null
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
    const val = savings !== null && savings !== undefined && savings !== '' ? Number(savings) : null;
    saveFinancialData((prev) => ({
      ...prev,
      monthlySavings: val,
      studentProfile: {
        ...(prev.studentProfile || {}),
        monthlySavings: val
      }
    }));
  }, [saveFinancialData]);

  // Target allocations mutation
  const updateTargetAllocations = useCallback((targets) => {
    saveFinancialData((prev) => ({
      ...prev,
      targetAllocations: targets && typeof targets === 'object' && !Array.isArray(targets) ? targets : null
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

    const userId = registeredUser?.id || `usr_${btoa(emailKey).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)}`;
    if (registeredUser && !registeredUser.id) {
      registeredUser.id = userId;
      savedAccounts[emailKey] = registeredUser;
      try {
        localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(savedAccounts));
      } catch (e) {}
    }

    const loggedUser = {
      id: userId,
      name: registeredUser?.name || formatHumanName(email),
      email: emailKey,
      userType: registeredUser?.userType || defaultRole,
      investments: registeredUser?.investments || [],
      goals: registeredUser?.goals || [],
      isLoggedIn: true,
      isDemo: false,
      needsOnboarding: registeredUser ? Boolean(registeredUser.needsOnboarding) : true
    };

    // Migrate legacy global history and studied resources safely
    migrateGlobalValueHistory(loggedUser);
    migrateGlobalStudiedResources(loggedUser);

    // Load financial data for this user
    let userFinData = normalizeFinancialData(null);
    try {
      const allFinData = JSON.parse(localStorage.getItem(STORAGE_KEY_FINANCIAL_DATA) || '{}');
      const found = allFinData[userId] || allFinData[emailKey] || registeredUser?.financialData || registeredUser?.customFinancialData;
      if (found) {
        userFinData = normalizeFinancialData(found);
        allFinData[userId] = userFinData;
        allFinData[emailKey] = userFinData;
        localStorage.setItem(STORAGE_KEY_FINANCIAL_DATA, JSON.stringify(allFinData));
      }
    } catch (e) {
      userFinData = normalizeFinancialData(null);
    }

    setFinancialData(userFinData);
    setUser(loggedUser);
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(loggedUser));
    } catch (e) {}
    return { success: true, user: loggedUser };
  }, []);

  // Signup handler
  const signup = useCallback((name, email, password) => {
    const emailKey = email.toLowerCase().trim();
    const formattedName = name.trim() ? name.trim() : formatHumanName(email);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newUser = {
      id: userId,
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
      if (!savedAccounts[emailKey]) {
        savedAccounts[emailKey] = newUser;
        localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(savedAccounts));
      } else {
        newUser.id = savedAccounts[emailKey].id || userId;
      }

      const allFinData = JSON.parse(localStorage.getItem(STORAGE_KEY_FINANCIAL_DATA) || '{}');
      if (!allFinData[newUser.id] && !allFinData[emailKey]) {
        allFinData[newUser.id] = { monthlySavings: null, investments: [], goals: [], targetAllocations: null };
        allFinData[emailKey] = allFinData[newUser.id];
        localStorage.setItem(STORAGE_KEY_FINANCIAL_DATA, JSON.stringify(allFinData));
      }
    } catch (e) {
      console.error('Failed to initialize account and financial storage', e);
    }

    setFinancialData({ monthlySavings: null, investments: [], goals: [], targetAllocations: null });
    setUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    } catch (e) {}
    return { success: true, user: newUser };
  }, []);

  // One-click demo login
  const demoLogin = useCallback((role = 'student') => {
    let mockProfile;
    if (role === 'business') {
      mockProfile = {
        id: 'demo_business',
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
        id: 'demo_tech',
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
        id: 'demo_student',
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
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(mockProfile));
    } catch (e) {}
    return mockProfile;
  }, []);

  // Update profile from onboarding or settings
  const updateProfile = useCallback((profileData) => {
    let baseUser = user;
    if (!baseUser) {
      try {
        const s = localStorage.getItem(STORAGE_KEY_USER);
        if (s) baseUser = JSON.parse(s);
      } catch (e) {}
    }

    const oldEmailKey = (baseUser?.email || '').toLowerCase().trim();
    const newEmailKey = (profileData.email || baseUser?.email || '').toLowerCase().trim();
    const userId = baseUser?.id || (newEmailKey ? `usr_${btoa(newEmailKey).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)}` : 'usr_active');

    const updatedUser = {
      ...(baseUser || {}),
      ...profileData,
      id: userId,
      isLoggedIn: true,
      isDemo: profileData.isDemo !== undefined ? profileData.isDemo : Boolean(baseUser?.isDemo),
      needsOnboarding: false
    };

    const finData = profileData.financialData || profileData.customFinancialData;
    if (finData) {
      const normalizedFin = normalizeFinancialData(finData);
      updatedUser.financialData = normalizedFin;
      updatedUser.customFinancialData = normalizedFin;

      if (!updatedUser.isDemo) {
        try {
          const allFinData = JSON.parse(localStorage.getItem(STORAGE_KEY_FINANCIAL_DATA) || '{}');
          allFinData[userId] = normalizedFin;
          if (newEmailKey) allFinData[newEmailKey] = normalizedFin;
          if (oldEmailKey && oldEmailKey !== newEmailKey) {
            delete allFinData[oldEmailKey];
          }
          localStorage.setItem(STORAGE_KEY_FINANCIAL_DATA, JSON.stringify(allFinData));
        } catch (e) {
          console.error('Failed to sync financial data', e);
        }
      }
      setFinancialData(normalizedFin);
    }

    if (newEmailKey && !updatedUser.isDemo) {
      try {
        const savedAccounts = JSON.parse(localStorage.getItem(STORAGE_KEY_ACCOUNTS) || '{}');
        savedAccounts[newEmailKey] = updatedUser;
        if (oldEmailKey && oldEmailKey !== newEmailKey) {
          delete savedAccounts[oldEmailKey];
        }
        localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(savedAccounts));
      } catch (e) {
        console.error('Failed to sync updated profile to accounts', e);
      }
    }

    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
    } catch (e) {}

    setUser(updatedUser);
    return updatedUser;
  }, [user]);

  // Switch role for demo/testing
  const switchRole = useCallback((newRole) => {
    setUser((prev) => {
      if (!prev) {
        return {
          id: `demo_${newRole}`,
          name: newRole === 'tech' ? TECH_DATA.name : newRole === 'business' ? BUSINESS_DATA.name : STUDENT_DATA.name,
          email: `${newRole}@finsight.demo`,
          userType: newRole,
          investments: [],
          goals: [],
          isLoggedIn: true,
          isDemo: true,
          needsOnboarding: false
        };
      }
      return {
        ...prev,
        userType: newRole,
        isDemo: true
      };
    });
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    setUser(null);
    setFinancialData({ monthlySavings: null, investments: [], goals: [], targetAllocations: null });
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
    } catch (e) {}
  }, []);

  // Compute dynamic user-driven dashboard data
  const isDemo = Boolean(user?.isDemo);

  const calculatedStudentData = useMemo(() => {
    if (isDemo) return STUDENT_DATA;

    const investments = financialData?.investments || [];
    const goals = financialData?.goals || [];
    const studentProf = financialData?.studentProfile || {};
    const commonProf = financialData?.commonProfile || {};
    const currency = commonProf.currency || 'INR';

    const monthlySavings = studentProf.monthlySavings ?? financialData?.monthlySavings ?? null;
    const monthlyIncome = studentProf.monthlyIncome ?? null;
    const monthlyExpenses = studentProf.monthlyExpenses ?? null;
    const existingSavings = studentProf.existingSavings ?? null;
    const educationLevel = studentProf.educationLevel || 'Undergraduate';
    const incomeSource = studentProf.incomeSource || 'Allowance';
    const targetAllocations = financialData?.targetAllocations || null;

    const portfolioRawValue = calculatePortfolioValue(investments);
    const totalInvested = calculateTotalInvested(investments);
    const performance = calculatePerformance(investments);
    const allocations = calculateAssetAllocations(investments, targetAllocations);
    const drift = calculateAllocationDrift(investments, allocations, targetAllocations);
    const savingsRate = calculateSavingsRate(monthlySavings, monthlyIncome);

    const missingFields = [];
    if (monthlyIncome === null) missingFields.push({ field: 'monthlyIncome', label: 'Monthly Income', desc: 'Add monthly income in Settings to calculate your personal Savings Rate.' });
    if (monthlyExpenses === null) missingFields.push({ field: 'monthlyExpenses', label: 'Monthly Expenses', desc: 'Add monthly expenses to analyze your discretionary cashflow.' });
    if (!drift.isConfigured && investments.length > 0) missingFields.push({ field: 'targetAllocations', label: 'Target Allocations', desc: 'Set target allocations across your holdings to track drift automatically.' });

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
      currency,
      portfolioValue: formatCurrency(portfolioRawValue, currency),
      portfolioRawValue,
      totalInvested,
      performance: performance.formatted,
      isPositive: performance.isPositive,
      monthlyIncome: monthlyIncome !== null ? formatCurrency(monthlyIncome, currency) : 'Not provided',
      monthlyIncomeRaw: monthlyIncome,
      monthlyExpenses: monthlyExpenses !== null ? formatCurrency(monthlyExpenses, currency) : 'Not provided',
      monthlyExpensesRaw: monthlyExpenses,
      monthlySavings: monthlySavings !== null && monthlySavings !== undefined && monthlySavings !== ''
        ? formatCurrency(monthlySavings, currency)
        : 'Not provided',
      monthlySavingsRaw: monthlySavings,
      savingsRate,
      existingSavings: existingSavings !== null ? formatCurrency(existingSavings, currency) : 'Not provided',
      educationLevel,
      incomeSource,
      missingFields,
      allocationDrift: drift.value || 'Not configured',
      driftConfigured: drift.isConfigured,
      insightMessage,
      allocations,
      goals,
      educationalModules: STUDENT_DATA.educationalModules,
      financialKnowledgeResources: STUDENT_DATA.financialKnowledgeResources || [],
      videoTutorials: STUDENT_DATA.financialKnowledgeResources || [],
      assistantSuggestions: STUDENT_DATA.assistantSuggestions
    };
  }, [isDemo, financialData, user?.name, user?.email]);

  const calculatedBusinessData = useMemo(() => {
    if (isDemo) return BUSINESS_DATA;

    const investments = financialData?.investments || [];
    const bizProf = financialData?.businessProfile || {};
    const commonProf = financialData?.commonProfile || {};
    const currency = commonProf.currency || 'INR';
    const targetAllocations = financialData?.targetAllocations || null;

    const portfolioRawValue = calculatePortfolioValue(investments);
    const performance = calculatePerformance(investments);
    const allocations = calculateAssetAllocations(investments, targetAllocations);
    const drift = calculateAllocationDrift(investments, allocations, targetAllocations);
    const holdings = calculateHoldings(investments);
    const marketExposure = calculateMarketExposure(investments);

    const cashReserves = bizProf.cashReserves ?? null;
    const monthlyExpenses = bizProf.monthlyOperatingExpenses ?? null;
    const shortTermLiab = bizProf.shortTermLiabilities;
    const longTermLiab = bizProf.longTermLiabilities;
    const totalLiab = (shortTermLiab !== null ? shortTermLiab : 0) + (longTermLiab !== null ? longTermLiab : 0);
    const hasAnyLiabilities = shortTermLiab !== null || longTermLiab !== null;
    const annualRevenue = bizProf.annualRevenue ?? null;
    const monthlyRevenue = bizProf.monthlyRevenue ?? null;

    const cashRunway = calculateCashRunway(cashReserves, monthlyExpenses);
    const netPosition = calculateNetFinancialPosition(portfolioRawValue, cashReserves || 0, shortTermLiab, longTermLiab, currency);
    const totalTreasuryAssets = portfolioRawValue + (cashReserves || 0);

    const missingFields = [];
    if (cashReserves === null) missingFields.push({ field: 'cashReserves', label: 'Cash Reserves', desc: 'Specify available cash reserves to compute institutional runway and total treasury assets.' });
    if (monthlyExpenses === null) missingFields.push({ field: 'monthlyOperatingExpenses', label: 'Monthly Operating Expenses', desc: 'Add monthly operating burn to monitor corporate runway months.' });
    if (shortTermLiab === null && longTermLiab === null) missingFields.push({ field: 'liabilities', label: 'Corporate Liabilities', desc: 'Specify liabilities to compute verified net financial position.' });
    if (!drift.isConfigured && investments.length > 0) missingFields.push({ field: 'targetAllocations', label: 'Target Allocations', desc: 'Configure target asset allocations to monitor quarterly rebalancing thresholds.' });

    let insightMessage = 'Corporate treasury allocation is structured with healthy operational liquidity.';
    if (investments.length === 0 && (cashReserves === null || cashReserves === 0)) {
      insightMessage = 'Add corporate cash reserves and treasury investments to track institutional liquidity and net financial position.';
    } else if (cashRunway.isCalculated && cashRunway.runwayMonths < 3) {
      insightMessage = `Critical liquidity warning: Current operational runway is only ${cashRunway.formatted}. Conserve cash or arrange credit lines.`;
    } else if (!drift.isConfigured && investments.length > 0) {
      insightMessage = 'Configure target asset allocations to monitor quarterly rebalancing thresholds.';
    }

    return {
      userType: 'business',
      name: bizProf.businessName || user?.name || 'Business Treasury',
      businessName: bizProf.businessName || user?.name || 'Corporate Entity',
      industry: bizProf.industry || 'Commercial',
      businessSize: bizProf.businessSize || '',
      email: user?.email || '',
      currency,
      portfolioValue: formatCurrency(portfolioRawValue, currency),
      portfolioRawValue,
      totalTreasuryAssets: formatCurrency(totalTreasuryAssets, currency),
      totalTreasuryAssetsRaw: totalTreasuryAssets,
      cashReserves: cashReserves !== null ? formatCurrency(cashReserves, currency) : 'Not specified',
      cashReservesRaw: cashReserves,
      monthlyOperatingExpenses: monthlyExpenses !== null ? formatCurrency(monthlyExpenses, currency) : 'Not specified',
      monthlyOperatingExpensesRaw: monthlyExpenses,
      annualRevenue: annualRevenue !== null ? formatCurrency(annualRevenue, currency) : 'Not specified',
      monthlyRevenue: monthlyRevenue !== null ? formatCurrency(monthlyRevenue, currency) : 'Not specified',
      shortTermLiabilities: shortTermLiab !== null ? formatCurrency(shortTermLiab, currency) : 'Not specified',
      longTermLiabilities: longTermLiab !== null ? formatCurrency(longTermLiab, currency) : 'Not specified',
      totalLiabilities: hasAnyLiabilities ? formatCurrency(totalLiab, currency) : 'Not specified',
      totalLiabilitiesRaw: totalLiab,
      cashRunway,
      netFinancialPosition: netPosition,
      isNetPositionVerified: netPosition.isVerified,
      marketExposure,
      performance: performance.formatted,
      isPositive: performance.isPositive,
      allocationDrift: drift.value || 'Not configured',
      driftConfigured: drift.isConfigured,
      missingFields,
      insightMessage,
      allocations,
      holdings,
      marketOutlook: BUSINESS_DATA.marketOutlook,
      riskMetrics: {
        portfolioBeta: 'Historical data unavailable',
        annualizedVolatility: 'Historical data unavailable',
        sharpeRatio: 'Historical data unavailable',
        stressTestLoss: portfolioRawValue > 0
          ? `${formatCurrency(Math.round(portfolioRawValue * 0.08), currency)} (Simulated 8% Drawdown)`
          : 'No investments added yet'
      },
      assistantSuggestions: BUSINESS_DATA.assistantSuggestions
    };
  }, [isDemo, financialData, user?.name, user?.email]);

  const calculatedTechData = useMemo(() => {
    if (isDemo) return TECH_DATA;

    const investments = financialData?.investments || [];
    const techProf = financialData?.techProfile || {};
    const commonProf = financialData?.commonProfile || {};
    const currency = commonProf.currency || 'INR';
    const targetAllocations = financialData?.targetAllocations || null;

    const portfolioRawValue = calculatePortfolioValue(investments);
    const performance = calculatePerformance(investments);
    const allocations = calculateAssetAllocations(investments, targetAllocations);
    const drift = calculateAllocationDrift(investments, allocations, targetAllocations);
    const holdings = calculateHoldings(investments);

    const annualTechBudget = techProf.annualTechBudget ?? null;
    const breakdownObj = normalizeSpendingBreakdown(techProf.spendingBreakdown);
    let breakdownSum = 0;
    let hasValidBreakdown = false;
    for (const val of Object.values(breakdownObj)) {
      if (val !== null && val > 0) {
        breakdownSum += val;
        hasValidBreakdown = true;
      }
    }

    const effectiveMonthlyExpenditure = hasValidBreakdown ? breakdownSum : (techProf.monthlyTechExpenditure ?? null);
    const annualizedSpending = effectiveMonthlyExpenditure !== null ? effectiveMonthlyExpenditure * 12 : null;
    const budgetUtilization = calculateBudgetUtilization(annualizedSpending, annualTechBudget);

    const categoryLabels = {
      cloudInfrastructure: 'Cloud Infrastructure',
      softwareLicensing: 'Software & Licensing',
      hardware: 'Hardware',
      cybersecurity: 'Cybersecurity',
      itOperations: 'IT Operations',
      researchAndDevelopment: 'Research & Development',
      other: 'Other'
    };

    const spendingBreakdownItems = [];
    if (effectiveMonthlyExpenditure && effectiveMonthlyExpenditure > 0) {
      for (const [key, amt] of Object.entries(breakdownObj)) {
        if (amt !== null && amt > 0) {
          const pct = Math.round((amt / effectiveMonthlyExpenditure) * 1000) / 10;
          spendingBreakdownItems.push({
            id: key,
            category: categoryLabels[key] || key,
            monthlyAmount: formatCurrency(amt, currency),
            rawAmount: amt,
            percentage: pct,
            formattedPercentage: `${pct.toFixed(1)}%`
          });
        }
      }
    }

    const techAssets = techProf.techAssets || [];

    // Calculate tech exposure using explicit sector and type classification
    const techExposureResult = calculateTechSectorExposure(investments);
    const techSectorExposure = techExposureResult.formatted;

    // Projections
    let projections = [];
    if (portfolioRawValue > 0) {
      projections = [
        { year: '2026', projectedValue: formatCurrency(portfolioRawValue, currency), status: 'Current', simulatedGrowth: performance.formatted },
        { year: '2027', projectedValue: formatCurrency(Math.round(portfolioRawValue * 1.15), currency), status: 'Projection', simulatedGrowth: '+15.0% Projected' },
        { year: '2028', projectedValue: formatCurrency(Math.round(portfolioRawValue * 1.32), currency), status: 'Projection', simulatedGrowth: '+32.0% Projected' },
        { year: '2029', projectedValue: formatCurrency(Math.round(portfolioRawValue * 1.52), currency), status: 'Projection', simulatedGrowth: '+52.0% Projected' },
        { year: '2030', projectedValue: formatCurrency(Math.round(portfolioRawValue * 1.75), currency), status: 'Projection', simulatedGrowth: '+75.0% Projected' }
      ];
    } else {
      projections = [
        { year: '2026', projectedValue: `${getCurrencySymbol(currency)}0`, status: 'Current', simulatedGrowth: 'No data' },
        { year: '2027', projectedValue: `${getCurrencySymbol(currency)}0`, status: 'Projection', simulatedGrowth: 'No data' },
        { year: '2028', projectedValue: `${getCurrencySymbol(currency)}0`, status: 'Projection', simulatedGrowth: 'No data' },
        { year: '2029', projectedValue: `${getCurrencySymbol(currency)}0`, status: 'Projection', simulatedGrowth: 'No data' },
        { year: '2030', projectedValue: `${getCurrencySymbol(currency)}0`, status: 'Projection', simulatedGrowth: 'No data' }
      ];
    }

    const missingFields = [];
    if (annualTechBudget === null) missingFields.push({ field: 'annualTechBudget', label: 'Annual Tech Budget', desc: 'Specify annual technology budget to track organization spending utilization rate.' });
    if (effectiveMonthlyExpenditure === null) missingFields.push({ field: 'monthlyTechExpenditure', label: 'Monthly Tech Expenditure', desc: 'Add monthly IT and cloud spend to monitor OpEx variance.' });

    let insightMessage = 'Enterprise holdings exhibit strong technological resilience across infrastructure components.';
    if (annualTechBudget !== null && effectiveMonthlyExpenditure !== null && budgetUtilization.isCalculated) {
      if (budgetUtilization.percentage > 100) {
        insightMessage = `Budget alert: Annualized expenditure exceeds approved tech budget by ${(budgetUtilization.percentage - 100).toFixed(1)}%. Review cloud infrastructure commitments.`;
      } else if (budgetUtilization.percentage >= 85) {
        insightMessage = `Tech spending is currently at ${budgetUtilization.formatted} of annual budget allocation. Approaching threshold limit.`;
      } else {
        insightMessage = `Tech expenditure is operating within healthy margins at ${budgetUtilization.formatted} of budget.`;
      }
    } else if (investments.length === 0) {
      insightMessage = 'Add enterprise portfolio assets and IT budget parameters to run strategic analytics and sector concentration.';
    }

    return {
      userType: 'tech',
      name: techProf.organizationName || user?.name || 'Enterprise Treasury',
      organizationName: techProf.organizationName || user?.name || 'Enterprise Organization',
      techIndustry: techProf.techIndustry || 'Technology',
      organizationSize: techProf.organizationSize || '',
      email: user?.email || '',
      currency,
      portfolioValue: formatCurrency(portfolioRawValue, currency),
      portfolioRawValue,
      performance: performance.formatted,
      isPositive: performance.isPositive,
      annualTechBudget: annualTechBudget !== null ? formatCurrency(annualTechBudget, currency) : 'Not configured',
      annualTechBudgetRaw: annualTechBudget,
      monthlyTechExpenditure: effectiveMonthlyExpenditure !== null ? formatCurrency(effectiveMonthlyExpenditure, currency) : 'Not configured',
      monthlyTechExpenditureRaw: effectiveMonthlyExpenditure,
      annualizedSpending: annualizedSpending !== null ? formatCurrency(annualizedSpending, currency) : 'Not configured',
      annualizedSpendingRaw: annualizedSpending,
      budgetUtilization,
      spendingBreakdown: breakdownObj,
      spendingBreakdownItems,
      techAssets,
      missingFields,
      costLossExposure: portfolioRawValue > 0
        ? `${formatCurrency(Math.round(portfolioRawValue * 0.12), currency)} (Projected Max Drawdown)`
        : 'No investments added yet',
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
    updateTargetAllocations,
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
