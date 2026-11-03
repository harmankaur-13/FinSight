import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import Landing from './Landing.jsx';
import { ThemeProvider } from '../../context/ThemeContext';

function renderLanding(props = {}) {
  const defaultProps = {
    onDemoLogin: vi.fn(),
    ...props
  };

  return renderToString(
    <MemoryRouter>
      <ThemeProvider>
        <Landing {...defaultProps} />
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('Landing Page Redesign Component', () => {
  it('renders hero title and value proposition without cluttered status pill', () => {
    const html = renderLanding();
    expect(html).toContain('Everything your money needs,');
    expect(html).toContain('crafted for clearer decisions.');
    expect(html).not.toContain('hero-status-pill');
  });

  it('renders primary Get Started Free and secondary Explore Live Demo CTA buttons with correct IDs', () => {
    const html = renderLanding();
    expect(html).toContain('id="heroStart"');
    expect(html).toContain('id="demoBtn"');
    expect(html).toContain('Get Started Free');
    expect(html).toContain('Explore Live Demo');
  });

  it('renders the architectural background container and image without artificial glowing orbs', () => {
    const html = renderLanding();
    expect(html).toContain('hero-backdrop-container');
    expect(html).toContain('hero-backdrop-image');
    expect(html).toContain('hero-backdrop-mask');
    expect(html).not.toContain('hero-backdrop-glow-green');
    expect(html).not.toContain('hero-backdrop-glow-gold');
  });

  it('renders hero telemetry card with portfolio metrics and asset distribution', () => {
    const html = renderLanding();
    expect(html).toContain('Total Net Portfolio');
    expect(html).toContain('₹12,84,650');
    expect(html).toContain('+12.48%');
    expect(html).toContain('Equities');
    expect(html).toContain('60%');
    expect(html).toContain('Bonds');
    expect(html).toContain('25%');
    expect(html).toContain('Crypto');
    expect(html).toContain('15%');
  });

  it('renders the 3 spacious capability pillars in One place. Clearer decisions.', () => {
    const html = renderLanding();
    expect(html).toContain('ONE PLACE. CLEARER DECISIONS.');
    expect(html).toContain('Everything your money needs.');
    expect(html).toContain('01 / TRACK');
    expect(html).toContain('Consolidated Ledger');
    expect(html).toContain('02 / UNDERSTAND');
    expect(html).toContain('Smart Rebalancing');
    expect(html).toContain('03 / PLAN');
    expect(html).toContain('Future Projections');
  });

  it('does NOT contain heavy full dashboard screenshot or duplicate features bento', () => {
    const html = renderLanding();
    expect(html).not.toContain('snapshot-dashboard-img');
    expect(html).not.toContain('Institutional precision for personal wealth.');
  });

  it('renders multiple perspectives section for Student, Business, and Big Tech', () => {
    const html = renderLanding();
    expect(html).toContain('Built for Different Financial Horizons');
    expect(html).toContain('One FinSight. Multiple perspectives.');
    expect(html).toContain('Student Wealth Portal');
    expect(html).toContain('Business Treasury');
    expect(html).toContain('Tech &amp; Quantitative');
    expect(html).toContain('Preview Student Dashboard');
    expect(html).toContain('Preview Business Dashboard');
    expect(html).toContain('Preview Big Tech Dashboard');
  });

  it('renders the compact refined closing CTA banner with action buttons', () => {
    const html = renderLanding();
    expect(html).toContain('Take control of your financial clarity.');
    expect(html).toContain('closing-cta-card');
    expect(html).toContain('closing-trust-row');
    expect(html).toContain('No Broker Credentials');
    expect(html).toContain('100% Client-Side Private');
    expect(html).toContain('Instant Access');
  });
});
