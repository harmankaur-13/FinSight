import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../../components/Toast';
import { getRoleDashboardPath } from '../../hooks/useFinanceData';
import './Landing.css';

export default function Landing({ onDemoLogin }) {
  const navigate = useNavigate();
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [trackHorizon, setTrackHorizon] = useState('1Y');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2400);
  };

  // Sparkline data for Pillar 1
  const horizonData = {
    '1M': {
      line: 'M0 48 C40 45 80 40 120 42 C160 45 200 32 250 28 L300 24',
      gain: '+2.4%'
    },
    '6M': {
      line: 'M0 52 C40 48 80 44 120 46 C160 48 200 26 250 20 L300 16',
      gain: '+7.8%'
    },
    '1Y': {
      line: 'M0 55 C40 50 80 42 120 45 C160 48 200 28 250 22 L300 12',
      gain: '+12.48%'
    }
  };

  const activeHorizon = horizonData[trackHorizon] || horizonData['1Y'];

  return (
    <>
      {/* ========================================================
          1. HERO SECTION (WITH ARCHITECTURAL BACKDROP & TELEMETRY)
          ======================================================== */}
      <section className="landing-hero-section">
        {/* Layered architectural background & gradient overlay */}
        <div className="hero-backdrop-container" aria-hidden="true">
          <div className="hero-backdrop-image" />
          <div className="hero-backdrop-mask" />
        </div>

        <div className="hero-layout-grid">
          {/* Left Column: Hero Content */}
          <div className="hero-content-column">
            <h1 className="hero-headline">
              Everything your money needs,
              <span>crafted for clearer decisions.</span>
            </h1>

            <p className="hero-subhead">
              Bring multi-asset portfolios, automated target rebalancing, real-time market
              intelligence, and deterministic future trajectory simulations together into a single,
              institutional-grade workspace.
            </p>

            <div className="hero-cta-group">
              <button
                className="btn btn-primary btn-large"
                id="heroStart"
                onClick={() => navigate('/signup')}
              >
                Get Started Free <span>→</span>
              </button>
            </div>

            <div className="hero-telemetry-row">
              <div className="hero-telemetry-item">
                <span className="hero-telemetry-num">01 / TRACK</span>
                <span className="hero-telemetry-label">Multi-Asset Ledger</span>
                <span className="hero-telemetry-desc">Equities, Fixed Income, Crypto & Cash</span>
              </div>
              <div className="hero-telemetry-item">
                <span className="hero-telemetry-num">02 / UNDERSTAND</span>
                <span className="hero-telemetry-label">Variance & Drift</span>
                <span className="hero-telemetry-desc">Real-time target allocation deviation</span>
              </div>
              <div className="hero-telemetry-item">
                <span className="hero-telemetry-num">03 / REBALANCE</span>
                <span className="hero-telemetry-label">Calculated Orders</span>
                <span className="hero-telemetry-desc">Clear trade execution lists</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Telemetry Card */}
          <div className="hero-visual-column">
            <div className="hero-telemetry-card">
              <div className="hero-card-header">
                <div className="hero-card-meta">
                  <span className="hero-card-caption">Total Net Portfolio</span>
                  <div className="hero-card-val">₹12,84,650</div>
                </div>
                <span className="hero-card-badge-gain">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                  +12.48%
                </span>
              </div>

              {/* Chart Visualization */}
              <div className="hero-chart-container">
                <div className="hero-chart-gridlines" />
                <svg className="hero-chart-svg" viewBox="0 0 540 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="heroGreenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent-text)" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="var(--accent-text)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    className="hero-chart-area"
                    d="M0 160 C50 145 100 130 160 138 C220 146 270 115 330 122 C390 130 430 85 480 75 C510 68 530 46 540 42 L540 200 L0 200 Z"
                  />
                  <path
                    className="hero-chart-stroke"
                    d="M0 160 C50 145 100 130 160 138 C220 146 270 115 330 122 C390 130 430 85 480 75 C510 68 530 46 540 42"
                  />
                </svg>
              </div>

              {/* Asset Allocation Distribution */}
              <div className="hero-allocation-wrapper">
                <div className="hero-allocation-bar">
                  <div className="alloc-seg-equities" title="Equities: 60%" />
                  <div className="alloc-seg-bonds" title="Fixed Income: 25%" />
                  <div className="alloc-seg-crypto" title="Crypto: 15%" />
                </div>

                <div className="hero-alloc-legend">
                  <div className="alloc-legend-item">
                    <span className="alloc-legend-title">
                      <span className="alloc-legend-dot" style={{ background: 'var(--green)' }} />
                      Equities
                    </span>
                    <strong>60%</strong>
                  </div>
                  <div className="alloc-legend-item">
                    <span className="alloc-legend-title">
                      <span className="alloc-legend-dot" style={{ background: 'var(--gold)' }} />
                      Bonds
                    </span>
                    <strong>25%</strong>
                  </div>
                  <div className="alloc-legend-item">
                    <span className="alloc-legend-title">
                      <span className="alloc-legend-dot" style={{ background: 'var(--text-secondary)' }} />
                      Crypto
                    </span>
                    <strong>15%</strong>
                  </div>
                </div>
              </div>

              {/* Micro Insight Callout */}
              <div className="hero-micro-insight">
                <svg className="hero-micro-insight-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 14 14" />
                </svg>
                <span>Drift tolerance within target threshold (&lt;0.8%). Next review in 14 days.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. ONE PLACE. CLEARER DECISIONS. (3 INTERACTIVE PILLARS)
          Replaces dense screenshot with clean, spacious capability cards
          ======================================================== */}
      <section className="clearer-decisions-section" id="capabilities">
        <div className="section-header-centered">
          <span className="section-eyebrow">ONE PLACE. CLEARER DECISIONS.</span>
          <h2 className="section-headline">Everything your money needs.</h2>
          <p className="section-subheadline">
            Three core disciplines unified into a single client-side platform—free of clutter and complexity.
          </p>
        </div>

        <div className="pillars-grid">
          {/* Pillar 1: Track */}
          <div className="pillar-card">
            <div className="pillar-top">
              <span className="pillar-num">01 / TRACK</span>
              <span className="pillar-badge">Multi-Asset</span>
            </div>
            <h3>Consolidated Ledger</h3>
            <p>Unify equities, fixed income, crypto, and cash with real-time portfolio valuation.</p>

            <div className="pillar-widget">
              <div className="pillar-stat-row">
                <div>
                  <span className="pillar-caption">Total Net Worth</span>
                  <div className="pillar-val">₹12,84,650</div>
                </div>
                <div className="pillar-horizon-row">
                  {['1M', '6M', '1Y'].map((h) => (
                    <button
                      key={h}
                      className={`pillar-horizon-btn ${trackHorizon === h ? 'active' : ''}`}
                      onClick={() => setTrackHorizon(h)}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pillar-mini-chart">
                <svg viewBox="0 0 300 70" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="pillarChartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent-text)" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="var(--accent-text)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`${activeHorizon.line} L300 70 L0 70 Z`}
                    fill="url(#pillarChartGrad)"
                  />
                  <path
                    d={activeHorizon.line}
                    fill="none"
                    stroke="var(--accent-text)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="pillar-alloc-row">
                <span className="alloc-pill alloc-pill-eq">Equities 60%</span>
                <span className="alloc-pill alloc-pill-bd">Bonds 25%</span>
                <span className="alloc-pill alloc-pill-cr">Crypto 15%</span>
              </div>
            </div>
          </div>

          {/* Pillar 2: Understand */}
          <div className="pillar-card">
            <div className="pillar-top">
              <span className="pillar-num">02 / UNDERSTAND</span>
              <span className="pillar-badge">Drift Engine</span>
            </div>
            <h3>Smart Rebalancing</h3>
            <p>Compare target vs actual allocation and generate instant, tax-efficient trade lists.</p>

            <div className="pillar-widget">
              <div className="pillar-drift-bars">
                <div className="drift-row">
                  <span className="drift-asset">Equities</span>
                  <div className="drift-track">
                    <div className="drift-fill" style={{ width: '62%' }} />
                  </div>
                  <span className="drift-tag drift-tag-over">+2.1% Trim</span>
                </div>
                <div className="drift-row">
                  <span className="drift-asset">Bonds</span>
                  <div className="drift-track">
                    <div className="drift-fill drift-fill-gold" style={{ width: '23%' }} />
                  </div>
                  <span className="drift-tag drift-tag-under">-1.8% Add</span>
                </div>
                <div className="drift-row">
                  <span className="drift-asset">Crypto</span>
                  <div className="drift-track">
                    <div className="drift-fill drift-fill-dark" style={{ width: '15%' }} />
                  </div>
                  <span className="drift-tag drift-tag-ok">Balanced</span>
                </div>
              </div>

              <div className="pillar-trade-pill">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Order Ready: Trim ₹15k Equities → Bonds</span>
              </div>
            </div>
          </div>

          {/* Pillar 3: Plan */}
          <div className="pillar-card">
            <div className="pillar-top">
              <span className="pillar-num">03 / PLAN</span>
              <span className="pillar-badge">Simulations</span>
            </div>
            <h3>Future Projections</h3>
            <p>Stress-test 10-year wealth trajectories with deterministic compound growth modeling.</p>

            <div className="pillar-widget">
              <div className="pillar-stat-row">
                <div>
                  <span className="pillar-caption">10Y Expected (12% CAGR)</span>
                  <div className="pillar-val" style={{ color: 'var(--accent-text)' }}>₹72.8 Lakhs</div>
                </div>
                <span className="pillar-confidence-badge">92% Confidence</span>
              </div>

              <div className="pillar-mini-chart">
                <svg viewBox="0 0 300 70" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="pillarSimGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent-text)" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="var(--accent-text)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 65 C80 60 160 48 240 28 L300 10 L300 70 L0 70 Z"
                    fill="url(#pillarSimGrad)"
                  />
                  <path
                    d="M0 65 C80 60 160 48 240 28 L300 10"
                    fill="none"
                    stroke="var(--accent-text)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0 65 C80 62 160 55 240 42 L300 32"
                    fill="none"
                    stroke="var(--muted)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                </svg>
              </div>

              <div className="pillar-footer-note">
                <span>Modeled on ₹25,000 / month systematic pace</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. AUDIENCE & PERSPECTIVES (STUDENT, BUSINESS, TECH)
          ======================================================== */}
      <section className="perspectives-section" id="dashboards">
        <div className="section-header-centered">
          <span className="section-eyebrow">Built for Different Financial Horizons</span>
          <h2 className="section-headline">One FinSight. Multiple perspectives.</h2>
          <p className="section-subheadline">
            Whether building personal wealth habits or monitoring commercial liquidity, FinSight
            adapts its interface to your exact operational complexity.
          </p>
        </div>

        <div className="perspectives-grid">
          {/* Card 1: Student */}
          <div
            className="perspective-card"
            onClick={() => navigate('/onboarding')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/onboarding')}
          >
            <div className="perspective-card-top">
              <span className="perspective-role-badge">Personal & Beginner</span>
              <span className="perspective-num">01</span>
            </div>
            <div>
              <h3>Student Wealth Portal</h3>
              <p>
                Demystify finance with foundational literacy modules, index fund trackers, and
                monthly savings habits designed for early-career compounding.
              </p>
              <div className="perspective-feature-list">
                <div className="perspective-feature-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>SIP & Allowance Goal Tracking</span>
                </div>
                <div className="perspective-feature-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Financial & Trading Knowledge Hub</span>
                </div>
              </div>
            </div>
            <div className="perspective-card-action">
              <span>Get Started with Student Portal</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 2: Business */}
          <div
            className="perspective-card"
            onClick={() => navigate('/onboarding')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/onboarding')}
          >
            <div className="perspective-card-top">
              <span className="perspective-role-badge">Commercial & SME</span>
              <span className="perspective-num">02</span>
            </div>
            <div>
              <h3>Business Treasury</h3>
              <p>
                Monitor corporate cash reserves, runway burn projections, working capital
                liquidity, and macroeconomic risk factors affecting company holdings.
              </p>
              <div className="perspective-feature-list">
                <div className="perspective-feature-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Runway & Working Capital Health</span>
                </div>
                <div className="perspective-feature-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Treasury Yield & Liquidity Allocation</span>
                </div>
              </div>
            </div>
            <div className="perspective-card-action">
              <span>Get Started with Business Treasury</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 3: Big Tech */}
          <div
            className="perspective-card"
            onClick={() => navigate('/onboarding')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/onboarding')}
          >
            <div className="perspective-card-top">
              <span className="perspective-role-badge">Quantitative & Advanced</span>
              <span className="perspective-num">03</span>
            </div>
            <div>
              <h3>Tech & Quantitative</h3>
              <p>
                Engineered for analytical professionals. Deep beta calculations, volatility
                matrices, and algorithmic rebalancing rules for modern multi-asset portfolios.
              </p>
              <div className="perspective-feature-list">
                <div className="perspective-feature-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Sharpe Ratio & Variance Analysis</span>
                </div>
                <div className="perspective-feature-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Dynamic Allocation Drift Matrices</span>
                </div>
              </div>
            </div>
            <div className="perspective-card-action">
              <span>Get Started with Enterprise Analytics</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. CLOSING CTA BANNER (COMPACT, SLEEK, REFINED)
          ======================================================== */}
      <section className="closing-cta-section">
        <div className="closing-cta-card">
          <div className="closing-cta-content">
            <span className="closing-cta-eyebrow">Personal Wealth Intelligence</span>
            <h2 className="closing-cta-headline">Take control of your financial clarity.</h2>
            <p className="closing-cta-subhead">
              Track multi-asset portfolios, optimize allocations, and stress-test your future with institutional precision.
            </p>

            <div className="closing-cta-buttons">
              <button
                className="btn btn-primary btn-large"
                onClick={() => navigate('/signup')}
              >
                Get Started Free <span>→</span>
              </button>
            </div>

            <div className="closing-trust-row">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                No Broker Credentials
              </span>
              <span className="trust-dot">•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                100% Client-Side Private
              </span>
              <span className="trust-dot">•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Instant Access
              </span>
            </div>
          </div>
        </div>
      </section>

      <Toast message={toastMsg} show={showToast} />
    </>
  );
}
