import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import Onboarding from './Onboarding.jsx';
import { ThemeProvider } from '../../context/ThemeContext.jsx';

function renderOnboarding(props = {}) {
  const defaultProps = {
    user: { name: 'Aman Sharma', email: 'aman@example.com' },
    onUpdateProfile: vi.fn(),
    ...props
  };

  return renderToString(
    <MemoryRouter>
      <ThemeProvider>
        <Onboarding {...defaultProps} />
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('Onboarding Component & Horizontal Input Layout', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders Step 1 with horizontal option rows for all three user perspectives', () => {
    const html = renderOnboarding();

    expect(html).toContain('STEP 1 OF 4');
    expect(html).toContain('How will you use FinSight?');
    expect(html).toContain('Student');
    expect(html).toContain('Business');
    expect(html).toContain('Large / Tech Company');

    // Confirms Space Grotesk numerals 01, 02, 03
    expect(html).toContain('01');
    expect(html).toContain('02');
    expect(html).toContain('03');

    // Confirms horizontal options list container and horizontal cards
    expect(html).toContain('horizontal-options-list');
    expect(html).toContain('horizontal-option-row');
    expect(html).toContain('horizontal-option-card');
    expect(html).toContain('card-main-cluster');
    expect(html).toContain('card-select-indicator');
  });

  it('renders step rail progress bar segments', () => {
    const html = renderOnboarding();

    expect(html).toContain('onboarding-step-rail');
    expect(html).toContain('step-rail-segment active');
  });

  it('strictly adheres to the zero-emoji policy and contains no unicode emojis', () => {
    const html = renderOnboarding();

    // Regex matching standard emoji ranges
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/u;
    expect(emojiRegex.test(html)).toBe(false);
  });
});
