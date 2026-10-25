import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import Settings, {
  DEFAULT_SETTINGS,
  getStoredSettings,
  saveStoredSettings,
  STORAGE_KEY_SETTINGS
} from './Settings.jsx';
import { ThemeProvider } from '../../context/ThemeContext';
import { MemoryRouter } from 'react-router-dom';

// Setup in-memory mock for localStorage in Node test environment
const storageMap = new Map();
const mockLocalStorage = {
  getItem: (key) => storageMap.get(key) || null,
  setItem: (key, val) => storageMap.set(key, String(val)),
  removeItem: (key) => storageMap.delete(key),
  clear: () => storageMap.clear()
};
globalThis.localStorage = mockLocalStorage;

// Helper to wrap component in necessary providers & router context
function renderSettings(props = {}) {
  const defaultProps = {
    user: {
      name: 'Aman Sharma',
      email: 'student@finsight.demo',
      userType: 'student',
      isLoggedIn: true,
      isDemo: true
    },
    onUpdateProfile: vi.fn(),
    onLogout: vi.fn(),
    financialData: { monthlySavings: 3500 },
    onUpdateMonthlySavings: vi.fn(),
    ...props
  };

  return renderToString(
    <MemoryRouter>
      <ThemeProvider>
        <Settings {...defaultProps} />
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('Settings & User Profile Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockLocalStorage.clear();
  });

  afterEach(() => {
    mockLocalStorage.clear();
  });

  it('renders page header, eyebrow, and all four settings tabs', () => {
    const html = renderSettings();

    expect(html).toContain('ACCOUNT CONFIGURATION');
    expect(html).toContain('Profile &amp; Settings');
    expect(html).toContain('Personal Info');
    expect(html).toContain('Account Preferences');
    expect(html).toContain('Financial Preferences');
    expect(html).toContain('Security &amp; Account');
  });

  it('renders personal information inputs with active user values', () => {
    const html = renderSettings({
      user: {
        name: 'Harman Kaur',
        email: 'harman@example.com',
        userType: 'student',
        isLoggedIn: true
      }
    });

    expect(html).toContain('Personal Information');
    expect(html).toContain('Harman Kaur');
    expect(html).toContain('harman@example.com');
    expect(html).toContain('Student Learner');
    expect(html).toContain('Business Intelligence');
    expect(html).toContain('Large Enterprise');
  });

  it('renders student-specific financial preferences exclusively for student persona', () => {
    renderSettings({
      user: {
        name: 'Aman Sharma',
        email: 'student@finsight.demo',
        userType: 'student',
        isLoggedIn: true
      }
    });

    // In default tab (personal), financial fields are in tab panels, but let's test helper
    const stored = getStoredSettings('student@finsight.demo');
    expect(stored.student.monthlyBudget).toBe(15000);
    expect(stored.student.savingsGoal).toBe(3500);
    expect(stored.student.financialGoals).toContain('Emergency Fund');
  });

  it('correctly isolates and retrieves profile-specific defaults for business and tech personas', () => {
    const businessSettings = getStoredSettings('business@finsight.demo');
    expect(businessSettings.business.reportingCurrency).toBe('INR');
    expect(businessSettings.business.businessGoals).toContain('Corporate Treasury Liquidity');

    const techSettings = getStoredSettings('tech@finsight.demo');
    expect(techSettings.tech.investmentFocus).toBe('Semiconductors & AI');
    expect(techSettings.tech.riskPreference).toBe('Balanced / Moderate');
    expect(techSettings.tech.sectorInterests).toContain('Cloud Compute');
  });

  it('persists and restores custom preferences to localStorage via storage helpers', () => {
    const custom = {
      currency: 'USD',
      dateFormat: 'YYYY-MM-DD',
      notifications: {
        marketAlerts: false,
        allocationDrift: true,
        digestEmail: true,
        securityAlerts: true
      },
      student: {
        financialGoals: ['Travel Fund', 'Portfolio Growth'],
        monthlyBudget: 22000,
        savingsGoal: 5000
      },
      business: {
        businessGoals: ['CapEx Reserve'],
        reportingCurrency: 'USD'
      },
      tech: {
        investmentFocus: 'Cloud Infrastructure',
        sectorInterests: ['Enterprise SaaS'],
        riskPreference: 'High Growth / Aggressive'
      }
    };

    saveStoredSettings('testuser@finsight.demo', custom);

    const retrieved = getStoredSettings('testuser@finsight.demo');
    expect(retrieved.currency).toBe('USD');
    expect(retrieved.dateFormat).toBe('YYYY-MM-DD');
    expect(retrieved.notifications.marketAlerts).toBe(false);
    expect(retrieved.student.savingsGoal).toBe(5000);
    expect(retrieved.student.monthlyBudget).toBe(22000);
    expect(retrieved.business.reportingCurrency).toBe('USD');
    expect(retrieved.tech.investmentFocus).toBe('Cloud Infrastructure');
  });

  it('safely handles corrupted or missing localStorage data by returning default settings', () => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, 'INVALID_JSON{{{');
    const settings = getStoredSettings('any@domain.com');
    expect(settings).toEqual(DEFAULT_SETTINGS);
  });

  it('renders custom avatar image when present in user data', () => {
    const sampleAvatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const html = renderSettings({
      user: {
        name: 'Aman Sharma',
        email: 'aman@example.com',
        userType: 'student',
        avatar: sampleAvatar,
        isLoggedIn: true
      }
    });

    expect(html).toContain('src="data:image/png;base64,');
    expect(html).toContain('Change Photo');
    expect(html).toContain('Remove');
  });

  it('renders initial letter fallback when avatar is not provided', () => {
    const html = renderSettings({
      user: {
        name: 'Priya Verma',
        email: 'priya@example.com',
        userType: 'student',
        avatar: '',
        isLoggedIn: true
      }
    });

    expect(html).toContain('P');
    expect(html).toContain('Upload Avatar');
  });

  it('renders account preferences tab with theme, currency, date format, and notifications', () => {
    const html = renderSettings({
      initialTab: 'preferences'
    });

    expect(html).toContain('Account Preferences');
    expect(html).toContain('Interface Theme');
    expect(html).toContain('Light Theme');
    expect(html).toContain('Dark Theme');
    expect(html).toContain('Preferred Currency');
    expect(html).toContain('INR (₹) - Indian Rupee (Default)');
    expect(html).toContain('Preferred Date Format');
    expect(html).toContain('DD/MM/YYYY');
    expect(html).toContain('Market Quotes &amp; EOD Digest');
    expect(html).toContain('Allocation Drift Warning');
    expect(html).toContain('Weekly Research &amp; Learning Digest');
    expect(html).toContain('Security &amp; Session Notices');
  });

  it('renders student financial preferences exclusively when user persona is student', () => {
    const html = renderSettings({
      initialTab: 'financial',
      user: {
        name: 'Aman Sharma',
        email: 'student@finsight.demo',
        userType: 'student',
        isLoggedIn: true
      }
    });

    expect(html).toContain('Financial Preferences: Student');
    expect(html).toContain('Primary Financial Goals');
    expect(html).toContain('Monthly Budget (₹)');
    expect(html).toContain('Monthly Savings Goal (₹)');
    expect(html).not.toContain('Preferred Reporting Currency');
    expect(html).not.toContain('Enterprise Risk Preference');
  });

  it('renders business financial preferences exclusively when user persona is business', () => {
    const html = renderSettings({
      initialTab: 'financial',
      user: {
        name: 'Nexus Ventures',
        email: 'business@finsight.demo',
        userType: 'business',
        isLoggedIn: true
      }
    });

    expect(html).toContain('Financial Preferences: Business Intelligence');
    expect(html).toContain('Business Financial Goals');
    expect(html).toContain('Preferred Reporting Currency');
    expect(html).toContain('Domestic Indian Corporate Entity');
    expect(html).not.toContain('Monthly Savings Goal (₹)');
    expect(html).not.toContain('Enterprise Risk Preference');
  });

  it('renders tech-enterprise financial preferences exclusively when user persona is tech', () => {
    const html = renderSettings({
      initialTab: 'financial',
      user: {
        name: 'Apex Tech Enterprise',
        email: 'enterprise@finsight.demo',
        userType: 'tech',
        isLoggedIn: true
      }
    });

    expect(html).toContain('Financial Preferences: Large Enterprise');
    expect(html).toContain('Primary Investment Focus');
    expect(html).toContain('Enterprise Risk Preference');
    expect(html).toContain('Sector Interests');
    expect(html).not.toContain('Monthly Savings Goal (₹)');
    expect(html).not.toContain('Preferred Reporting Currency');
  });

  it('renders security tab with local architecture disclosure, sign-out, and deletion safeguard', () => {
    const html = renderSettings({
      initialTab: 'security',
      user: {
        name: 'Aman Sharma',
        email: 'student@finsight.demo',
        userType: 'student',
        isLoggedIn: true
      }
    });

    expect(html).toContain('Security &amp; Account');
    expect(html).toContain('Local Session Architecture');
    expect(html).toContain('Password &amp; Credential Management');
    expect(html).toContain('Active Local Session');
    expect(html).toContain('Session Sign Out');
    expect(html).toContain('Sign Out');
    expect(html).toContain('Account Deletion Safeguard');
    expect(html).toContain('Server Backend Required');
    // Verifies no fake deletion buttons exist
    expect(html).not.toContain('Delete Account Permanently');
  });
});
