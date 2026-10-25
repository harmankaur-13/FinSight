import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import FloatingSettings from './FloatingSettings';
import { ThemeProvider } from '../context/ThemeContext';
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

function renderFloating(props = {}) {
  const defaultProps = {
    user: {
      name: 'Aman Sharma',
      email: 'student@finsight.demo',
      userType: 'student',
      isLoggedIn: true,
      isDemo: true
    },
    onLogout: vi.fn(),
    ...props
  };

  return renderToString(
    <MemoryRouter>
      <ThemeProvider>
        <FloatingSettings {...defaultProps} />
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('FloatingSettings Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockLocalStorage.clear();
  });

  afterEach(() => {
    mockLocalStorage.clear();
  });

  it('renders trigger button with correct accessibility attributes and gear SVG', () => {
    const html = renderFloating();
    expect(html).toContain('floating-settings-trigger');
    expect(html).toContain('aria-label="Open account settings"');
    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('floating-gear-icon');
  });

  it('renders setting option on top with user profile pill as icon-only symbol without written text', () => {
    const html = renderFloating({
      user: {
        name: 'Aman Sharma',
        userType: 'student'
      }
    });

    expect(html).toContain('nav-profile-settings-group');
    expect(html).toContain('user-profile-pill');
    expect(html).toContain('Aman Sharma');
    expect(html).toContain('nav-settings-btn');
    expect(html).toContain('nav-gear-icon');
    expect(html).not.toContain('nav-settings-text');
  });

  it('has accessible title and no emojis in trigger or panel markup', () => {
    const closedHtml = renderFloating();
    const openHtml = renderFloating({ initialOpen: true });

    expect(closedHtml).toContain('title="Account &amp; Display Settings"');

    // Verify absence of common emoji unicode ranges in both closed and open states
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    expect(emojiRegex.test(closedHtml)).toBe(false);
    expect(emojiRegex.test(openHtml)).toBe(false);
  });

  it('renders closed initially and does not mount the panel', () => {
    const closedHtml = renderFloating({ initialOpen: false });
    expect(closedHtml).not.toContain('role="dialog"');
    expect(closedHtml).not.toContain('floating-panel-header');
  });

  it('renders full floating account panel when open', () => {
    const openHtml = renderFloating({
      initialOpen: true,
      user: {
        name: 'Aman Sharma',
        email: 'aman@demo.com',
        userType: 'student'
      }
    });

    // Panel dialog attributes
    expect(openHtml).toContain('id="floating-account-panel"');
    expect(openHtml).toContain('role="dialog"');
    expect(openHtml).toContain('aria-modal="true"');
    expect(openHtml).toContain('aria-label="Account and settings menu"');

    // User profile information
    expect(openHtml).toContain('Aman Sharma');
    expect(openHtml).toContain('aman@demo.com');
    expect(openHtml).toContain('Student Learner');
    expect(openHtml).toContain('Manage profile');

    // Menu options
    expect(openHtml).toContain('Profile');
    expect(openHtml).toContain('Personal details &amp; account persona');
    expect(openHtml).toContain('Preferences');
    expect(openHtml).toContain('Currency, dates &amp; alert notifications');
    expect(openHtml).toContain('Financial Parameters');
    expect(openHtml).toContain('Budget &amp; savings goal');

    // Appearance section
    expect(openHtml).toContain('Appearance');
    expect(openHtml).toContain('role="radiogroup"');
    expect(openHtml).toContain('Light');
    expect(openHtml).toContain('Dark');

    // Sign out button
    expect(openHtml).toContain('Sign Out');
    expect(openHtml).toContain('floating-signout-btn');
  });

  it('renders business persona details when userType is business', () => {
    const openHtml = renderFloating({
      initialOpen: true,
      user: {
        name: 'Priya Patel',
        email: 'priya@corp.in',
        userType: 'business'
      }
    });

    expect(openHtml).toContain('Priya Patel');
    expect(openHtml).toContain('priya@corp.in');
    expect(openHtml).toContain('Business Intelligence');
    expect(openHtml).toContain('Treasury goals &amp; reporting');
  });

  it('renders tech enterprise persona details when userType is tech', () => {
    const openHtml = renderFloating({
      initialOpen: true,
      user: {
        name: 'Vikram Mehta',
        email: 'vikram@enterprise.in',
        userType: 'tech'
      }
    });

    expect(openHtml).toContain('Vikram Mehta');
    expect(openHtml).toContain('vikram@enterprise.in');
    expect(openHtml).toContain('Large Enterprise');
    expect(openHtml).toContain('Sector focus &amp; risk matrix');
  });

  it('renders custom avatar image when user.avatar is provided', () => {
    const openHtml = renderFloating({
      initialOpen: true,
      user: {
        name: 'Aman Sharma',
        avatar: 'https://example.com/avatar.jpg',
        userType: 'student'
      }
    });

    expect(openHtml).toContain('src="https://example.com/avatar.jpg"');
    expect(openHtml).toContain('alt="Aman Sharma"');
  });
});
