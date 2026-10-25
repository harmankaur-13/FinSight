import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { formatHumanName } from '../../hooks/useFinanceData';
import Toast from '../../components/Toast';

export const STORAGE_KEY_SETTINGS = 'finsight_settings';

export const DEFAULT_SETTINGS = {
  currency: 'INR',
  dateFormat: 'DD/MM/YYYY',
  notifications: {
    marketAlerts: true,
    allocationDrift: true,
    digestEmail: false,
    securityAlerts: true
  },
  student: {
    financialGoals: ['Emergency Fund', 'Portfolio Growth', 'Education Fund'],
    monthlyBudget: 15000,
    savingsGoal: 3500
  },
  business: {
    businessGoals: ['Corporate Treasury Liquidity', 'Working Capital Optimization'],
    reportingCurrency: 'INR'
  },
  tech: {
    investmentFocus: 'Semiconductors & AI',
    sectorInterests: ['Cloud Compute', 'Semiconductors & AI', 'Hardware Infrastructure'],
    riskPreference: 'Balanced / Moderate'
  }
};

const STUDENT_GOAL_OPTIONS = [
  'Emergency Fund',
  'Portfolio Growth',
  'First ₹50,000 Milestone',
  'Education Fund',
  'Tech & Equipment Fund',
  'Travel Fund'
];

const BUSINESS_GOAL_OPTIONS = [
  'Corporate Treasury Liquidity',
  'Working Capital Optimization',
  'CapEx Reserve',
  'FX & Currency Hedging',
  'Quarterly Tax Provision',
  'Strategic Acquisition Fund'
];

const TECH_SECTOR_OPTIONS = [
  'Cloud Compute',
  'Semiconductors & AI',
  'Cybersecurity',
  'Enterprise SaaS',
  'Autonomous Systems',
  'Clean Energy & Grid'
];

export function getStoredSettings(email) {
  try {
    if (typeof localStorage === 'undefined') return DEFAULT_SETTINGS;
    const key = email ? `${STORAGE_KEY_SETTINGS}_${email.toLowerCase().trim()}` : STORAGE_KEY_SETTINGS;
    const raw = localStorage.getItem(key) || localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      notifications: { ...DEFAULT_SETTINGS.notifications, ...(parsed.notifications || {}) },
      student: { ...DEFAULT_SETTINGS.student, ...(parsed.student || {}) },
      business: { ...DEFAULT_SETTINGS.business, ...(parsed.business || {}) },
      tech: { ...DEFAULT_SETTINGS.tech, ...(parsed.tech || {}) }
    };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(email, settings) {
  try {
    if (typeof localStorage === 'undefined') return;
    const key = email ? `${STORAGE_KEY_SETTINGS}_${email.toLowerCase().trim()}` : STORAGE_KEY_SETTINGS;
    localStorage.setItem(key, JSON.stringify(settings));
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage', e);
  }
}

export default function Settings({
  user,
  onUpdateProfile,
  onLogout,
  financialData,
  onUpdateMonthlySavings,
  initialTab = 'personal'
}) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const fileInputRef = useRef(null);

  const [searchParams] = useSearchParams();
  const urlTab = searchParams ? searchParams.get('tab') : null;
  const validTabs = ['personal', 'preferences', 'financial', 'security'];
  const initialActive = urlTab && validTabs.includes(urlTab) ? urlTab : initialTab;

  const [activeTab, setActiveTab] = useState(initialActive);

  // Sync activeTab if searchParams change
  useEffect(() => {
    if (urlTab && validTabs.includes(urlTab)) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Initialize saved settings state
  const initialSaved = useMemo(() => {
    const email = user?.email || '';
    const stored = getStoredSettings(email);

    // Prefer student monthly savings from active financialData if present
    const studentSavings = financialData?.monthlySavings !== null && financialData?.monthlySavings !== undefined
      ? Number(financialData.monthlySavings)
      : stored.student.savingsGoal;

    return {
      name: user?.name || '',
      email: user?.email || '',
      userType: user?.userType || 'student',
      avatar: user?.avatar || '',
      theme: theme || 'light',
      currency: stored.currency || 'INR',
      dateFormat: stored.dateFormat || 'DD/MM/YYYY',
      notifications: { ...stored.notifications },
      student: {
        ...stored.student,
        savingsGoal: studentSavings
      },
      business: { ...stored.business },
      tech: { ...stored.tech }
    };
  }, [user?.name, user?.email, user?.userType, user?.avatar, financialData?.monthlySavings, theme]);

  const [savedSettings, setSavedSettings] = useState(initialSaved);
  const [formData, setFormData] = useState(initialSaved);

  // Sync form when active user changes
  useEffect(() => {
    setSavedSettings(initialSaved);
    setFormData(initialSaved);
  }, [initialSaved]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2800);
  };

  // Determine if form has unsaved edits
  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(savedSettings);
  }, [formData, savedSettings]);

  // Form input changes
  const handleTextChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleNotificationToggle = (key) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handleStudentFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      student: {
        ...prev.student,
        [field]: value
      }
    }));
  };

  const toggleStudentGoal = (goal) => {
    setFormData((prev) => {
      const current = prev.student.financialGoals || [];
      const updated = current.includes(goal)
        ? current.filter((g) => g !== goal)
        : [...current, goal];
      return {
        ...prev,
        student: { ...prev.student, financialGoals: updated }
      };
    });
  };

  const handleBusinessFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      business: {
        ...prev.business,
        [field]: value
      }
    }));
  };

  const toggleBusinessGoal = (goal) => {
    setFormData((prev) => {
      const current = prev.business.businessGoals || [];
      const updated = current.includes(goal)
        ? current.filter((g) => g !== goal)
        : [...current, goal];
      return {
        ...prev,
        business: { ...prev.business, businessGoals: updated }
      };
    });
  };

  const handleTechFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      tech: {
        ...prev.tech,
        [field]: value
      }
    }));
  };

  const toggleTechSector = (sector) => {
    setFormData((prev) => {
      const current = prev.tech.sectorInterests || [];
      const updated = current.includes(sector)
        ? current.filter((s) => s !== sector)
        : [...current, sector];
      return {
        ...prev,
        tech: { ...prev.tech, sectorInterests: updated }
      };
    });
  };

  // Avatar upload handler
  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      triggerToast('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      triggerToast('Image file size must be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === 'string') {
        setFormData((prev) => ({ ...prev, avatar: dataUrl }));
        triggerToast('Profile photo updated in draft. Click Save to keep changes.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setFormData((prev) => ({ ...prev, avatar: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    const trimmedName = (formData.name || '').trim();
    if (!trimmedName) {
      newErrors.name = 'Full name is required.';
    } else if (trimmedName.length < 2) {
      newErrors.name = 'Full name must be at least 2 characters.';
    }

    const trimmedEmail = (formData.email || '').trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address (e.g. name@domain.com).';
    }

    if (formData.userType === 'student') {
      if (formData.student.monthlyBudget < 0) {
        newErrors.monthlyBudget = 'Monthly budget must be 0 or positive.';
      }
      if (formData.student.savingsGoal < 0) {
        newErrors.savingsGoal = 'Monthly savings goal must be 0 or positive.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save changes handler
  const handleSaveChanges = (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) {
      triggerToast('Please resolve validation errors before saving.');
      return;
    }

    setIsSaving(true);

    try {
      // 1. Update theme if changed
      if (formData.theme !== theme) {
        setTheme(formData.theme);
      }

      // 2. Persist settings to localStorage
      const settingsPayload = {
        currency: formData.currency,
        dateFormat: formData.dateFormat,
        notifications: formData.notifications,
        student: formData.student,
        business: formData.business,
        tech: formData.tech
      };
      saveStoredSettings(formData.email, settingsPayload);

      // 3. Update profile via callback
      if (onUpdateProfile) {
        onUpdateProfile({
          name: formData.name.trim(),
          email: formData.email.trim(),
          userType: formData.userType,
          avatar: formData.avatar,
          settings: settingsPayload
        });
      }

      // 4. Update monthly savings if Student
      if (formData.userType === 'student' && onUpdateMonthlySavings) {
        onUpdateMonthlySavings(formData.student.savingsGoal);
      }

      setSavedSettings(formData);
      setIsSaving(false);
      triggerToast('Profile & Settings saved successfully.');
    } catch (err) {
      setIsSaving(false);
      triggerToast('Failed to save settings. Please try again.');
    }
  };

  // Cancel handler
  const handleCancel = () => {
    setFormData(savedSettings);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    triggerToast('Unsaved changes discarded.');
  };

  // Reset to defaults handler
  const handleResetDefaults = () => {
    if (window.confirm('Reset all display and notification preferences to defaults? Your name and email will be preserved.')) {
      setFormData((prev) => ({
        ...prev,
        currency: DEFAULT_SETTINGS.currency,
        dateFormat: DEFAULT_SETTINGS.dateFormat,
        notifications: { ...DEFAULT_SETTINGS.notifications },
        student: { ...DEFAULT_SETTINGS.student, savingsGoal: prev.student.savingsGoal },
        business: { ...DEFAULT_SETTINGS.business },
        tech: { ...DEFAULT_SETTINGS.tech }
      }));
      triggerToast('Preferences reset to default values. Click Save Changes to confirm.');
    }
  };

  const displayName = formatHumanName(formData.name) || 'User';

  return (
    <div className="container" style={{ padding: '36px 0 90px' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <span className="eyebrow">ACCOUNT CONFIGURATION</span>
        <h1 className="page-title">Profile & Settings</h1>
        <p className="page-subtitle">
          Manage your personal identity, display preferences, financial parameters, and local session details.
        </p>
      </div>

      {/* Unsaved Changes Banner */}
      {isDirty && (
        <div className="settings-dirty-bar" role="status" aria-live="polite">
          <div className="settings-dirty-text">
            <span className="settings-dirty-dot" />
            <span>You have unsaved changes in your profile settings.</span>
          </div>
          <div className="settings-dirty-actions">
            <button
              type="button"
              className="btn btn-outline btn-small"
              onClick={handleCancel}
            >
              Discard
            </button>
            <button
              type="button"
              className="btn btn-primary btn-small"
              onClick={handleSaveChanges}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="settings-tabs-nav" role="tablist" aria-label="Settings sections">
        <button
          type="button"
          role="tab"
          id="tab-personal"
          aria-selected={activeTab === 'personal'}
          aria-controls="panel-personal"
          className={`settings-tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Personal Info
        </button>

        <button
          type="button"
          role="tab"
          id="tab-preferences"
          aria-selected={activeTab === 'preferences'}
          aria-controls="panel-preferences"
          className={`settings-tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
          </svg>
          Account Preferences
        </button>

        <button
          type="button"
          role="tab"
          id="tab-financial"
          aria-selected={activeTab === 'financial'}
          aria-controls="panel-financial"
          className={`settings-tab-btn ${activeTab === 'financial' ? 'active' : ''}`}
          onClick={() => setActiveTab('financial')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
          Financial Preferences
        </button>

        <button
          type="button"
          role="tab"
          id="tab-security"
          aria-selected={activeTab === 'security'}
          aria-controls="panel-security"
          className={`settings-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Security & Account
        </button>
      </div>

      <div className="settings-main-container">
        {/* SECTION A: Personal Information */}
        {activeTab === 'personal' && (
          <div
            id="panel-personal"
            role="tabpanel"
            aria-labelledby="tab-personal"
            className="panel-card settings-panel"
          >
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Personal Information</h2>
                <p className="panel-subtitle">Manage your profile photo, identity details, and active account type.</p>
              </div>
            </div>

            {/* Avatar Section */}
            <div className="settings-avatar-row">
              <div className="settings-avatar-preview">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt={displayName}
                    className="settings-avatar-img"
                  />
                ) : (
                  <span className="settings-avatar-fallback">
                    {(displayName || 'U').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="settings-avatar-controls">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png, image/jpeg, image/webp"
                    style={{ display: 'none' }}
                    id="settings-avatar-input"
                    onChange={handleAvatarFile}
                  />
                  <button
                    type="button"
                    className="btn btn-outline btn-small"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                    {formData.avatar ? 'Change Photo' : 'Upload Avatar'}
                  </button>

                  {formData.avatar && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-small text-danger"
                      onClick={handleRemoveAvatar}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="settings-hint">
                  Supports PNG, JPG, or WebP up to 2MB. Stored locally in your client preferences.
                </p>
              </div>
            </div>

            {/* Personal Details Form */}
            <div className="settings-form-grid">
              <div className="field">
                <label htmlFor="settings-full-name">
                  Full Name <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <input
                  id="settings-full-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleTextChange('name', e.target.value)}
                  placeholder="e.g. Aman Sharma"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'error-name' : undefined}
                />
                {errors.name && (
                  <p id="error-name" className="field-error-msg" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="field">
                <label htmlFor="settings-email">
                  Email Address <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <input
                  id="settings-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleTextChange('email', e.target.value)}
                  placeholder="name@example.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'error-email' : undefined}
                />
                {errors.email && (
                  <p id="error-email" className="field-error-msg" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Profile Type Selection */}
            <div className="settings-role-section">
              <label className="settings-section-label">
                Profile Type
              </label>
              <p className="settings-hint" style={{ marginBottom: '12px' }}>
                Select your persona to adapt dashboard analytics, educational modules, and treasury metrics.
              </p>

              <div className="settings-role-grid">
                <button
                  type="button"
                  className={`settings-role-card ${formData.userType === 'student' ? 'selected' : ''}`}
                  onClick={() => handleTextChange('userType', 'student')}
                >
                  <div className="settings-role-card-header">
                    <span className="settings-role-badge">Student</span>
                    {formData.userType === 'student' && (
                      <span className="settings-check-circle">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <h3 className="settings-role-title">Student Learner</h3>
                  <p className="settings-role-desc">
                    Personal SIP tracking, beginner educational modules, and milestone goals.
                  </p>
                </button>

                <button
                  type="button"
                  className={`settings-role-card ${formData.userType === 'business' ? 'selected' : ''}`}
                  onClick={() => handleTextChange('userType', 'business')}
                >
                  <div className="settings-role-card-header">
                    <span className="settings-role-badge">Business</span>
                    {formData.userType === 'business' && (
                      <span className="settings-check-circle">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <h3 className="settings-role-title">Business Intelligence</h3>
                  <p className="settings-role-desc">
                    Corporate treasury tracking, commercial market exposure, and liquidity metrics.
                  </p>
                </button>

                <button
                  type="button"
                  className={`settings-role-card ${formData.userType === 'tech' ? 'selected' : ''}`}
                  onClick={() => handleTextChange('userType', 'tech')}
                >
                  <div className="settings-role-card-header">
                    <span className="settings-role-badge">Tech-Enterprise</span>
                    {formData.userType === 'tech' && (
                      <span className="settings-check-circle">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <h3 className="settings-role-title">Large Enterprise</h3>
                  <p className="settings-role-desc">
                    Multi-year growth simulations, deep tech sector concentration, and cost loss modeling.
                  </p>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="settings-panel-footer">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleCancel}
                disabled={!isDirty}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveChanges}
                disabled={isSaving}
              >
                {isSaving ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* SECTION B: Account Preferences */}
        {activeTab === 'preferences' && (
          <div
            id="panel-preferences"
            role="tabpanel"
            aria-labelledby="tab-preferences"
            className="panel-card settings-panel"
          >
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Account Preferences</h2>
                <p className="panel-subtitle">Configure theme appearance, display currency, date format, and notifications.</p>
              </div>
            </div>

            {/* Theme Preference */}
            <div className="settings-control-group">
              <label className="settings-section-label">Interface Theme</label>
              <p className="settings-hint">Select between light and dark modes. Changes update instantly.</p>

              <div className="settings-theme-selector">
                <button
                  type="button"
                  className={`settings-theme-card ${formData.theme === 'light' ? 'active' : ''}`}
                  onClick={() => {
                    handleTextChange('theme', 'light');
                    setTheme('light');
                  }}
                >
                  <div className="settings-theme-icon-box">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="settings-theme-title">Light Theme</h3>
                    <p className="settings-theme-sub">Warm eggshell canvas with forest green accents</p>
                  </div>
                </button>

                <button
                  type="button"
                  className={`settings-theme-card ${formData.theme === 'dark' ? 'active' : ''}`}
                  onClick={() => {
                    handleTextChange('theme', 'dark');
                    setTheme('dark');
                  }}
                >
                  <div className="settings-theme-icon-box">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="settings-theme-title">Dark Theme</h3>
                    <p className="settings-theme-sub">Matte charcoal interface with high-contrast text</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Localization Settings */}
            <div className="settings-form-grid" style={{ marginTop: '24px' }}>
              <div className="field">
                <label htmlFor="settings-currency">
                  Preferred Currency
                </label>
                <select
                  id="settings-currency"
                  className="settings-select"
                  value={formData.currency}
                  onChange={(e) => handleTextChange('currency', e.target.value)}
                >
                  <option value="INR">INR (₹) - Indian Rupee (Default)</option>
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                </select>
                <p className="settings-hint">Primary currency symbol for portfolio calculations.</p>
              </div>

              <div className="field">
                <label htmlFor="settings-date-format">
                  Preferred Date Format
                </label>
                <select
                  id="settings-date-format"
                  className="settings-select"
                  value={formData.dateFormat}
                  onChange={(e) => handleTextChange('dateFormat', e.target.value)}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 25/10/2026)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 10/25/2026)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-10-25)</option>
                </select>
                <p className="settings-hint">Used for market close timestamps and transaction logs.</p>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="settings-control-group" style={{ marginTop: '24px' }}>
              <label className="settings-section-label">Notification Preferences</label>
              <p className="settings-hint">Manage which alerts and digest updates you receive.</p>

              <div className="settings-toggle-list">
                <div className="settings-toggle-item">
                  <div className="settings-toggle-info">
                    <span className="settings-toggle-title">Market Quotes & EOD Digest</span>
                    <span className="settings-toggle-sub">Receive closing price alerts from daily TejHQ NSE feeds.</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData.notifications.marketAlerts}
                    aria-label="Market Quotes and EOD Digest notifications"
                    className={`settings-switch ${formData.notifications.marketAlerts ? 'checked' : ''}`}
                    onClick={() => handleNotificationToggle('marketAlerts')}
                  >
                    <span className="settings-switch-thumb" />
                  </button>
                </div>

                <div className="settings-toggle-item">
                  <div className="settings-toggle-info">
                    <span className="settings-toggle-title">Allocation Drift Warning</span>
                    <span className="settings-toggle-sub">Alert when holdings deviate &gt; 5% from target allocation.</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData.notifications.allocationDrift}
                    aria-label="Allocation Drift Warning notifications"
                    className={`settings-switch ${formData.notifications.allocationDrift ? 'checked' : ''}`}
                    onClick={() => handleNotificationToggle('allocationDrift')}
                  >
                    <span className="settings-switch-thumb" />
                  </button>
                </div>

                <div className="settings-toggle-item">
                  <div className="settings-toggle-info">
                    <span className="settings-toggle-title">Weekly Research & Learning Digest</span>
                    <span className="settings-toggle-sub">Curated educational modules and illustrative stock ratings.</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData.notifications.digestEmail}
                    aria-label="Weekly Research and Learning Digest notifications"
                    className={`settings-switch ${formData.notifications.digestEmail ? 'checked' : ''}`}
                    onClick={() => handleNotificationToggle('digestEmail')}
                  >
                    <span className="settings-switch-thumb" />
                  </button>
                </div>

                <div className="settings-toggle-item">
                  <div className="settings-toggle-info">
                    <span className="settings-toggle-title">Security & Session Notices</span>
                    <span className="settings-toggle-sub">Local storage session notices and credential safety checks.</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData.notifications.securityAlerts}
                    aria-label="Security and Session Notices"
                    className={`settings-switch ${formData.notifications.securityAlerts ? 'checked' : ''}`}
                    onClick={() => handleNotificationToggle('securityAlerts')}
                  >
                    <span className="settings-switch-thumb" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="settings-panel-footer">
              <button
                type="button"
                className="btn btn-ghost btn-small"
                onClick={handleResetDefaults}
              >
                Reset to Defaults
              </button>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleCancel}
                  disabled={!isDirty}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION C: Financial Preferences */}
        {activeTab === 'financial' && (
          <div
            id="panel-financial"
            role="tabpanel"
            aria-labelledby="tab-financial"
            className="panel-card settings-panel"
          >
            <div className="panel-header">
              <div>
                <h2 className="panel-title">
                  {`Financial Preferences: ${formData.userType === 'student' ? 'Student' : formData.userType === 'business' ? 'Business Intelligence' : 'Large Enterprise'}`}
                </h2>
                <p className="panel-subtitle">
                  Tailored parameters displayed exclusively for the active profile persona.
                </p>
              </div>
              <span className="badge-tag">
                {formData.userType.toUpperCase()}
              </span>
            </div>

            {/* C1: Student Fields */}
            {formData.userType === 'student' && (
              <div className="settings-financial-subgroup">
                <div className="settings-control-group">
                  <label className="settings-section-label">Primary Financial Goals</label>
                  <p className="settings-hint">Select the milestones that guide your automated SIPs and learning track.</p>
                  <div className="settings-chips-container">
                    {STUDENT_GOAL_OPTIONS.map((goal) => {
                      const isSelected = (formData.student.financialGoals || []).includes(goal);
                      return (
                        <button
                          key={goal}
                          type="button"
                          className={`settings-chip ${isSelected ? 'active' : ''}`}
                          onClick={() => toggleStudentGoal(goal)}
                        >
                          {isSelected && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                          {goal}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="settings-form-grid" style={{ marginTop: '24px' }}>
                  <div className="field">
                    <label htmlFor="settings-monthly-budget">
                      Monthly Budget (₹)
                    </label>
                    <input
                      id="settings-monthly-budget"
                      type="number"
                      min="0"
                      step="500"
                      value={formData.student.monthlyBudget}
                      onChange={(e) => handleStudentFieldChange('monthlyBudget', Number(e.target.value) || 0)}
                      placeholder="e.g. 15000"
                    />
                    {errors.monthlyBudget && (
                      <p className="field-error-msg">{errors.monthlyBudget}</p>
                    )}
                    <p className="settings-hint">Estimated monthly allowance or spending threshold.</p>
                  </div>

                  <div className="field">
                    <label htmlFor="settings-savings-goal">
                      Monthly Savings Goal (₹)
                    </label>
                    <input
                      id="settings-savings-goal"
                      type="number"
                      min="0"
                      step="500"
                      value={formData.student.savingsGoal}
                      onChange={(e) => handleStudentFieldChange('savingsGoal', Number(e.target.value) || 0)}
                      placeholder="e.g. 3500"
                    />
                    {errors.savingsGoal && (
                      <p className="field-error-msg">{errors.savingsGoal}</p>
                    )}
                    <p className="settings-hint">Directly feeds the Student Dashboard monthly savings target.</p>
                  </div>
                </div>
              </div>
            )}

            {/* C2: Business Fields */}
            {formData.userType === 'business' && (
              <div className="settings-financial-subgroup">
                <div className="settings-control-group">
                  <label className="settings-section-label">Business Financial Goals</label>
                  <p className="settings-hint">Key corporate objectives for commercial capital deployment.</p>
                  <div className="settings-chips-container">
                    {BUSINESS_GOAL_OPTIONS.map((bGoal) => {
                      const isSelected = (formData.business.businessGoals || []).includes(bGoal);
                      return (
                        <button
                          key={bGoal}
                          type="button"
                          className={`settings-chip ${isSelected ? 'active' : ''}`}
                          onClick={() => toggleBusinessGoal(bGoal)}
                        >
                          {isSelected && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                          {bGoal}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="field" style={{ marginTop: '24px', maxWidth: '480px' }}>
                  <label htmlFor="settings-reporting-currency">
                    Preferred Reporting Currency
                  </label>
                  <select
                    id="settings-reporting-currency"
                    className="settings-select"
                    value={formData.business.reportingCurrency}
                    onChange={(e) => handleBusinessFieldChange('reportingCurrency', e.target.value)}
                  >
                    <option value="INR">INR (₹) - Domestic Indian Corporate Entity</option>
                    <option value="USD">USD ($) - International Treasury Reporting</option>
                    <option value="EUR">EUR (€) - European Subsidiary</option>
                    <option value="GBP">GBP (£) - UK Operations</option>
                  </select>
                  <p className="settings-hint">Standardized currency for corporate cash-flow statements.</p>
                </div>
              </div>
            )}

            {/* C3: Tech-Enterprise Fields */}
            {formData.userType === 'tech' && (
              <div className="settings-financial-subgroup">
                <div className="settings-form-grid">
                  <div className="field">
                    <label htmlFor="settings-tech-focus">
                      Primary Investment Focus
                    </label>
                    <select
                      id="settings-tech-focus"
                      className="settings-select"
                      value={formData.tech.investmentFocus}
                      onChange={(e) => handleTechFieldChange('investmentFocus', e.target.value)}
                    >
                      <option value="Semiconductors & AI">Semiconductors &amp; AI Platforms</option>
                      <option value="Cloud Infrastructure">Cloud Infrastructure &amp; Compute</option>
                      <option value="Enterprise SaaS">Enterprise SaaS &amp; Security</option>
                      <option value="Digital Reserves & Web3">Digital Reserves &amp; Decentralized Assets</option>
                      <option value="Clean Energy & Grid Tech">Clean Energy &amp; Grid Computing</option>
                    </select>
                    <p className="settings-hint">Determines default projection weightings and crunch scenarios.</p>
                  </div>

                  <div className="field">
                    <label htmlFor="settings-tech-risk">
                      Enterprise Risk Preference
                    </label>
                    <select
                      id="settings-tech-risk"
                      className="settings-select"
                      value={formData.tech.riskPreference}
                      onChange={(e) => handleTechFieldChange('riskPreference', e.target.value)}
                    >
                      <option value="Conservative">Conservative (Capital preservation &amp; sovereign bonds)</option>
                      <option value="Balanced / Moderate">Balanced / Moderate (Core cloud with disciplined hedge)</option>
                      <option value="High Growth / Aggressive">High Growth / Aggressive (Compute scaling &amp; digital reserves)</option>
                    </select>
                    <p className="settings-hint">Calibrates volatility tolerance in the 4-year simulation engine.</p>
                  </div>
                </div>

                <div className="settings-control-group" style={{ marginTop: '20px' }}>
                  <label className="settings-section-label">Sector Interests</label>
                  <p className="settings-hint">Select the enterprise domains monitored in your portfolio exposure.</p>
                  <div className="settings-chips-container">
                    {TECH_SECTOR_OPTIONS.map((sec) => {
                      const isSelected = (formData.tech.sectorInterests || []).includes(sec);
                      return (
                        <button
                          key={sec}
                          type="button"
                          className={`settings-chip ${isSelected ? 'active' : ''}`}
                          onClick={() => toggleTechSector(sec)}
                        >
                          {isSelected && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                          {sec}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="settings-panel-footer">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleCancel}
                disabled={!isDirty}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveChanges}
                disabled={isSaving}
              >
                {isSaving ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* SECTION D: Security and Account */}
        {activeTab === 'security' && (
          <div
            id="panel-security"
            role="tabpanel"
            aria-labelledby="tab-security"
            className="panel-card settings-panel"
          >
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Security & Account</h2>
                <p className="panel-subtitle">Review local session parameters, authentication status, and sign-out actions.</p>
              </div>
            </div>

            {/* Local-First Architecture Disclosure */}
            <div className="settings-info-box">
              <div className="settings-info-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="settings-info-content">
                <h3 className="settings-info-title">Local Session Architecture</h3>
                <p className="settings-info-desc">
                  FinSight currently operates in a client-side architecture. Your profile preferences and mock financial metrics are persisted strictly within your browser's local storage.
                </p>
                <p className="settings-info-desc" style={{ marginTop: '6px' }}>
                  <strong>Password &amp; Credential Management:</strong> Multi-factor authentication (MFA), password rotation, and server-synced cloud profiles require integration with a centralized authentication backend. No passwords, private keys, or credentials are stored in plaintext localStorage.
                </p>
              </div>
            </div>

            {/* Session Metadata Card */}
            <div className="settings-metadata-grid" style={{ marginTop: '24px' }}>
              <div className="settings-meta-item">
                <span className="settings-meta-label">Session Status</span>
                <span className="settings-meta-value" style={{ color: 'var(--green-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
                  Active Local Session
                </span>
              </div>

              <div className="settings-meta-item">
                <span className="settings-meta-label">Account Persona</span>
                <span className="settings-meta-value">
                  {formData.userType === 'student' ? 'Student' : formData.userType === 'business' ? 'Business Intelligence' : 'Large Enterprise'}
                </span>
              </div>

              <div className="settings-meta-item">
                <span className="settings-meta-label">Identifier (Email)</span>
                <span className="settings-meta-value">{formData.email || 'None'}</span>
              </div>

              <div className="settings-meta-item">
                <span className="settings-meta-label">Persistence Type</span>
                <span className="settings-meta-value">Browser LocalStorage</span>
              </div>
            </div>

            {/* Sign Out Card */}
            <div className="settings-card-sub" style={{ marginTop: '28px' }}>
              <div>
                <h3 className="settings-sub-title">Session Sign Out</h3>
                <p className="settings-hint">
                  Terminate the current session and return to the login screen. Your saved preferences remain available in local storage.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  if (onLogout) onLogout();
                  navigate('/login');
                }}
              >
                Sign Out
              </button>
            </div>

            {/* Account Deletion Safeguard Notice */}
            <div className="settings-card-sub settings-deletion-card" style={{ marginTop: '20px' }}>
              <div>
                <h3 className="settings-sub-title" style={{ color: 'var(--text)' }}>Account Deletion Safeguard</h3>
                <p className="settings-hint">
                  Permanent account purging requires an authenticated backend server with verifiable confirmation audit trails. To prevent unintentional loss of local portfolio records, destructive deletion is disabled.
                </p>
              </div>
              <span className="badge-tag" style={{ background: 'var(--surface-2)', color: 'var(--muted)', alignSelf: 'flex-start' }}>
                Server Backend Required
              </span>
            </div>
          </div>
        )}
      </div>

      <Toast message={toastMsg} show={showToast} />
    </div>
  );
}
