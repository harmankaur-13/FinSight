import { useState, useEffect, useCallback, useMemo } from 'react';
import { STUDENT_DATA, BUSINESS_DATA, TECH_DATA, NEWS_DATA, RATINGS_DATA, FEATURES_DATA, ABOUT_DATA } from '../data/mockData';

const STORAGE_KEY_USER = 'finsight_user';
const STORAGE_KEY_ACCOUNTS = 'finsight_accounts';

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

  // Login handler
  const login = useCallback((email, password) => {
    let savedAccounts = {};
    try {
      savedAccounts = JSON.parse(localStorage.getItem(STORAGE_KEY_ACCOUNTS) || '{}');
    } catch (e) {
      savedAccounts = {};
    }

    const registeredUser = savedAccounts[email.toLowerCase()];
    const defaultRole = email.includes('business') ? 'business' : email.includes('tech') || email.includes('enterprise') ? 'tech' : 'student';

    const loggedUser = {
      name: registeredUser?.name || formatHumanName(email),
      email: email,
      userType: registeredUser?.userType || defaultRole,
      investments: registeredUser?.investments || ['Stocks', 'Mutual Funds'],
      goals: registeredUser?.goals || ['Portfolio growth'],
      isLoggedIn: true,
      needsOnboarding: Boolean(registeredUser?.needsOnboarding)
    };

    setUser(loggedUser);
    return { success: true, user: loggedUser };
  }, []);

  // Signup handler
  const signup = useCallback((name, email, password) => {
    const formattedName = name.trim() ? name.trim() : formatHumanName(email);
    const newUser = {
      name: formattedName,
      email: email.toLowerCase(),
      userType: 'student',
      investments: [],
      goals: [],
      isLoggedIn: true,
      needsOnboarding: true
    };

    try {
      const savedAccounts = JSON.parse(localStorage.getItem(STORAGE_KEY_ACCOUNTS) || '{}');
      savedAccounts[email.toLowerCase()] = newUser;
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(savedAccounts));
    } catch (e) {
      console.error('Failed to save account', e);
    }

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
        isLoggedIn: true
      };
    } else if (role === 'tech') {
      mockProfile = {
        name: TECH_DATA.name,
        email: TECH_DATA.email,
        userType: 'tech',
        investments: ['Stocks', 'Bonds', 'Crypto', 'ETFs'],
        goals: ['Risk', 'Future projections'],
        isLoggedIn: true
      };
    } else {
      mockProfile = {
        name: STUDENT_DATA.name,
        email: STUDENT_DATA.email,
        userType: 'student',
        investments: ['Stocks', 'Mutual Funds', 'Crypto'],
        goals: ['Learning about investing', 'Portfolio growth'],
        isLoggedIn: true
      };
    }
    setUser(mockProfile);
    return mockProfile;
  }, []);

  // Update profile from onboarding
  const updateProfile = useCallback((profileData) => {
    setUser(prev => {
      const updated = {
        ...(prev || {}),
        ...profileData,
        isLoggedIn: true,
        needsOnboarding: false
      };
      if (updated.email) {
        try {
          const savedAccounts = JSON.parse(localStorage.getItem(STORAGE_KEY_ACCOUNTS) || '{}');
          savedAccounts[updated.email.toLowerCase()] = updated;
          localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(savedAccounts));
        } catch (e) {
          console.error('Failed to sync updated profile to accounts', e);
        }
      }
      return updated;
    });
  }, []);

  // Switch role for demo/testing
  const switchRole = useCallback((newRole) => {
    setUser(prev => {
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
  }, []);

  // Active dashboard data based on user type
  const activeDashboardData = useMemo(() => {
    const role = user?.userType || 'student';
    if (role === 'business') return BUSINESS_DATA;
    if (role === 'tech') return TECH_DATA;
    return STUDENT_DATA;
  }, [user?.userType]);

  return {
    user,
    isAuthenticated: Boolean(user?.isLoggedIn),
    login,
    signup,
    demoLogin,
    logout,
    updateProfile,
    switchRole,
    dashboardData: activeDashboardData,
    studentData: STUDENT_DATA,
    businessData: BUSINESS_DATA,
    techData: TECH_DATA,
    news: NEWS_DATA,
    ratings: RATINGS_DATA,
    features: FEATURES_DATA,
    about: ABOUT_DATA
  };
}
