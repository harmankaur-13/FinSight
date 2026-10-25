import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { formatHumanName } from '../hooks/useFinanceData';

export default function FloatingSettings({ user, onLogout, initialOpen = false }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const triggerRef = useRef(null);
  const profileBtnRef = useRef(null);
  const panelRef = useRef(null);

  const displayName = formatHumanName(user?.name) || 'User';
  const email = user?.email || '';
  const role = user?.userType || 'student';
  const roleTitle = role === 'tech' ? 'Large Enterprise' : role === 'business' ? 'Business Intelligence' : 'Student Learner';

  // Toggle panel
  const togglePanel = () => {
    setIsOpen((prev) => !prev);
  };

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        profileBtnRef.current &&
        !profileBtnRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleSignOut = () => {
    setIsOpen(false);
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <div className="nav-profile-settings-group">
      {/* User Profile Pill Trigger */}
      <button
        ref={profileBtnRef}
        type="button"
        className={`user-profile-pill ${isOpen ? 'active' : ''}`}
        onClick={togglePanel}
        aria-label={`Account menu for ${displayName}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="floating-account-panel"
        title="Profile & Settings"
      >
        <div className="user-avatar" style={{ overflow: 'hidden' }}>
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={displayName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            (displayName || 'U').charAt(0).toUpperCase()
          )}
        </div>
        <span className="user-profile-name">{displayName}</span>
      </button>

      {/* Setting Option on Top with Profile */}
      <button
        ref={triggerRef}
        type="button"
        className={`nav-settings-btn floating-settings-trigger ${isOpen ? 'active' : ''}`}
        onClick={togglePanel}
        aria-label="Open account settings"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="floating-account-panel"
        title="Account & Display Settings"
      >
        <svg
          className="nav-gear-icon floating-gear-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      {/* Floating Account Panel Overlay */}
      {isOpen && (
        <div
          ref={panelRef}
          id="floating-account-panel"
          className="floating-account-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Account and settings menu"
        >
          {/* User Profile Card Header */}
          <div className="floating-panel-header">
            <div className="floating-panel-user">
              <div className="floating-user-avatar">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={displayName}
                    className="floating-avatar-img"
                  />
                ) : (
                  <span>{(displayName || 'U').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="floating-user-info">
                <span className="floating-user-name">{displayName}</span>
                {email && <span className="floating-user-email">{email}</span>}
                <span className="floating-role-tag">{roleTitle}</span>
              </div>
            </div>

            <button
              type="button"
              className="floating-manage-btn"
              onClick={() => handleNavigate('/settings?tab=personal')}
            >
              Manage profile
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <div className="floating-panel-divider" />

          {/* Navigation & Preferences List */}
          <div className="floating-menu-list">
            <button
              type="button"
              className="floating-menu-item"
              onClick={() => handleNavigate('/settings?tab=personal')}
            >
              <div className="floating-menu-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="floating-menu-text">
                <span className="floating-menu-title">Profile</span>
                <span className="floating-menu-desc">Personal details &amp; account persona</span>
              </div>
              <svg className="floating-item-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <button
              type="button"
              className="floating-menu-item"
              onClick={() => handleNavigate('/settings?tab=preferences')}
            >
              <div className="floating-menu-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="21" x2="4" y2="14" />
                  <line x1="4" y1="10" x2="4" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12" y2="3" />
                  <line x1="20" y1="21" x2="20" y2="16" />
                  <line x1="20" y1="12" x2="20" y2="3" />
                </svg>
              </div>
              <div className="floating-menu-text">
                <span className="floating-menu-title">Preferences</span>
                <span className="floating-menu-desc">Currency, dates &amp; alert notifications</span>
              </div>
              <svg className="floating-item-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <button
              type="button"
              className="floating-menu-item"
              onClick={() => handleNavigate('/settings?tab=financial')}
            >
              <div className="floating-menu-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
              <div className="floating-menu-text">
                <span className="floating-menu-title">Financial Parameters</span>
                <span className="floating-menu-desc">
                  {role === 'student' ? 'Budget & savings goal' : role === 'business' ? 'Treasury goals & reporting' : 'Sector focus & risk matrix'}
                </span>
              </div>
              <svg className="floating-item-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <div className="floating-panel-divider" />

          {/* Appearance Section */}
          <div className="floating-appearance-section">
            <div className="floating-appearance-header">
              <div className="floating-menu-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              <div className="floating-menu-text">
                <span className="floating-menu-title">Appearance</span>
                <span className="floating-menu-desc">
                  {theme === 'dark' ? 'Dark theme active' : 'Light theme active'}
                </span>
              </div>
            </div>

            {/* Segmented Light/Dark Switcher */}
            <div className="floating-theme-switch" role="radiogroup" aria-label="Theme selection">
              <button
                type="button"
                role="radio"
                aria-checked={theme === 'light'}
                className={`floating-theme-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                </svg>
                Light
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={theme === 'dark'}
                className={`floating-theme-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                Dark
              </button>
            </div>
          </div>

          <div className="floating-panel-divider" />

          {/* Sign Out Action */}
          <div className="floating-panel-footer">
            <button
              type="button"
              className="floating-signout-btn"
              onClick={handleSignOut}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
