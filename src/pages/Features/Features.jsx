import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinanceData, getRoleDashboardPath } from '../../hooks/useFinanceData';
import './Features.css';

// Semantic Geometric SVG Icons (strictly no emojis)
function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

export default function Features() {
  const navigate = useNavigate();
  const { user, demoLogin } = useFinanceData();

  // Interactive state for Section 3 (Market News categories)
  const [activeNewsCategory, setActiveNewsCategory] = useState('All');

  // Interactive state for Section 5 (Compound Simulation horizon)
  const [simYears, setSimYears] = useState(3);

  // Dynamic compound calculation for Section 5 demo
  // Formula: P*(1+r)^t + PMT * [((1+r)^t - 1) / r]
  // P = 2,50,000, PMT = 15,000/mo, conservative CAGR = 11%
  const simulatedValues = {
    1: '₹4,60,250',
    3: '₹9,82,400',
    5: '₹16,74,800'
  };

  // Safe navigation for primary "Explore FinSight" / "Get Started" CTAs
  // Never overwrites or corrupts active user sessions
  const handleGetStarted = () => {
    if (user?.isLoggedIn) {
      if (user?.needsOnboarding) {
        navigate('/onboarding');
      } else {
        navigate(getRoleDashboardPath(user?.userType));
      }
    } else {
      navigate('/signup');
    }
  };

  // Safe navigation for "Explore Live Demo"
  // If user is already authenticated with real data, navigates to their own dashboard
  // to avoid overwriting their session or localStorage data
  const handleExploreDemo = () => {
    if (user?.isLoggedIn && !user?.isDemo) {
      navigate(getRoleDashboardPath(user?.userType));
    } else {
      demoLogin('student');
      navigate(getRoleDashboardPath('student'));
    }
  };

  // Safe navigation for the three persona workspace buttons
  // Respects real accounts vs demo accounts, protecting user data
  const handleWorkspaceNavigation = (role) => {
    if (user?.isLoggedIn) {
      if (user?.isDemo) {
        demoLogin(role);
        navigate(getRoleDashboardPath(role));
      } else {
        // Authenticated real user is locked to their role by ProtectedRoute
        if (user.userType === role) {
          navigate(getRoleDashboardPath(role));
        } else {
          navigate(getRoleDashboardPath(user.userType));
        }
      }
    } else {
      demoLogin(role);
      navigate(getRoleDashboardPath(role));
    }
  };

  // Curated market intelligence sample items for Section 3
  const newsItems = [
    {
      category: 'Economy',
      time: '4 min read',
      title: 'Monetary Policy Stance & Domestic Liquidity Conditions',
      summary: 'Interbank overnight rates stay anchored as central banking authorities balance core inflation containment with systematic credit growth.',
      context: 'Linked to: Fixed Income Yields & Debt Allocations'
    },
    {
      category: 'Technology',
      time: '3 min read',
      title: 'Hyperscale Infrastructure Capex Accelerates Across Datacenters',
      summary: 'Leading cloud platforms expand hardware capital expenditure to sustain high-density AI compute workflows and enterprise automation.',
      context: 'Linked to: Enterprise Tech Equity Holdings'
    },
    {
      category: 'Markets',
      time: '5 min read',
      title: 'Corporate Margin Resilience Across Large-Cap Benchmarks',
      summary: 'Deflating input costs and operating leverage support bottom-line stability across diversified industrial and manufacturing leaders.',
      context: 'Linked to: Broad Index Fund Weights'
    },
    {
      category: 'Business',
      time: '4 min read',
      title: 'Treasury Working Capital Management in Volatile Rate Cycles',
      summary: 'Corporate CFOs allocate higher percentages to sovereign liquid instruments to hedge short-term operational runway risk.',
      context: 'Linked to: Business Cash & Liquidity Reserves'
    }
  ];

  const filteredNews = activeNewsCategory === 'All'
    ? newsItems.slice(0, 3)
    : newsItems.filter((item) => item.category === activeNewsCategory);

  return (
    <div className="container features-page">
      {/* ====================================================================
          Hero Section
          ==================================================================== */}
      <section className="features-hero" aria-labelledby="hero-heading">
        <div className="features-hero-content">
          <div className="features-eyebrow">
            <span>FINANCIAL INTELLIGENCE</span>
          </div>

          <h1 id="hero-heading" className="features-hero-title">
            Your Financial Data Has a Story. Make Sense of It.
          </h1>

          <p className="features-hero-desc">
            FinSight brings your financial information, market context, and investment insights
            together to help you understand where you stand, identify what needs attention, and plan what comes next.
          </p>

          <div className="features-hero-actions">
            <button
              type="button"
              className="btn btn-primary btn-large"
              onClick={handleGetStarted}
            >
              Explore FinSight <ArrowRightIcon />
            </button>
            <button
              type="button"
              className="btn btn-outline btn-large"
              onClick={handleExploreDemo}
            >
              Explore Live Demo
            </button>
          </div>
        </div>

        {/* Hero Visual: Authentic screenshot of the actual FinSight Dashboard */}
        <div className="features-hero-visual">
          <div className="features-browser-frame">
            <div className="features-browser-header">
              <div className="features-browser-dots" aria-hidden="true">
                <span className="features-browser-dot" />
                <span className="features-browser-dot" />
                <span className="features-browser-dot" />
              </div>

              <div className="features-browser-url">
                <LockIcon />
                <span>app.finsight.fi/student-wealth-portal</span>
              </div>

              <span className="features-browser-badge">Sample Demo Interface</span>
            </div>

            <div className="features-browser-content">
              <img
                src="/images/dashboard-preview.png"
                alt="FinSight Student Wealth Portal sample demo dashboard interface displaying portfolio allocation, monthly investment pace, and educational progress."
                className="features-browser-img"
                loading="eager"
              />
            </div>

            <div className="features-hero-telemetry">
              <div className="features-telemetry-item">
                <span className="features-telemetry-label">Multi-Asset Tracking</span>
                <span className="features-telemetry-value">Equities, Fixed Income, Crypto & Cash in a unified view.</span>
              </div>
              <div className="features-telemetry-item">
                <span className="features-telemetry-label">Allocation Drift Tracking</span>
                <span className="features-telemetry-value">Visual indicators when asset allocations deviate from your chosen targets.</span>
              </div>
              <div className="features-telemetry-item">
                <span className="features-telemetry-label">Private & Client-Side</span>
                <span className="features-telemetry-value">Your sensitive financial records stay safely on your local device.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          Financial Intelligence Sections (Alternating Layout)
          ==================================================================== */}
      <div className="features-section-group">
        {/* Section 1 — Understand Your Financial Position */}
        <section className="features-split-section" id="financial-position" aria-labelledby="section-1-heading">
          <div className="features-section-text">
            <span className="features-section-num">01 / CONSOLIDATED OVERVIEW</span>
            <h2 id="section-1-heading" className="features-section-title">
              See the bigger picture, not just individual numbers.
            </h2>
            <p className="features-section-body">
              Get a consolidated view of your financial information through an organized dashboard.
              Explore portfolio allocation, asset distribution, performance indicators, and financial progress in one place.
            </p>

            <ul className="features-capability-list">
              <li className="features-capability-item">
                <span className="features-check-icon"><CheckIcon /></span>
                <span><strong>Consolidated Dashboard:</strong> Aggregates disparate holdings into a single, cohesive balance sheet.</span>
              </li>
              <li className="features-capability-item">
                <span className="features-check-icon"><CheckIcon /></span>
                <span><strong>Asset Distribution:</strong> Instant clarity across growth equities, fixed income securities, and liquid reserves.</span>
              </li>
              <li className="features-capability-item">
                <span className="features-check-icon"><CheckIcon /></span>
                <span><strong>Performance Indicators:</strong> Transparent annualized return indicators paired with systematic monthly pacing.</span>
              </li>
            </ul>
          </div>

          <div className="features-section-visual">
            <div className="features-visual-card">
              <div className="features-card-topbar">
                <div className="features-card-heading">
                  <span>Sample Multi-Asset Portfolio Summary</span>
                  <span className="features-card-subhead">Consolidated Balance Sheet</span>
                </div>
                <span className="features-status-pill neutral">Sample Data</span>
              </div>

              <div className="features-kpi-grid">
                <div className="features-kpi-box">
                  <span className="features-kpi-label">Sample Total Capital</span>
                  <div className="features-kpi-value">₹18,42,000</div>
                </div>
                <div className="features-kpi-box">
                  <span className="features-kpi-label">Sample Annualized Yield</span>
                  <div className="features-kpi-gain">+12.4%</div>
                </div>
                <div className="features-kpi-box">
                  <span className="features-kpi-label">Sample Monthly Pace</span>
                  <div className="features-kpi-value">₹25,000</div>
                </div>
              </div>

              {/* Progress Distribution Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600 }}>
                <span>Sample Asset Distribution</span>
                <span style={{ color: 'var(--muted)' }}>100% Capital Allocated</span>
              </div>

              <div className="features-progress-stack">
                <div className="features-progress-bar equities" style={{ width: '58%' }} title="Equities 58%" />
                <div className="features-progress-bar bonds" style={{ width: '27%' }} title="Bonds 27%" />
                <div className="features-progress-bar liquid" style={{ width: '15%' }} title="Liquid Reserves 15%" />
              </div>

              <div className="features-asset-rows">
                <div className="features-asset-row">
                  <div className="features-asset-info">
                    <span className="features-asset-dot equities" />
                    <strong>Equities & Index Funds</strong>
                  </div>
                  <div>
                    <span style={{ fontWeight: 700 }}>58.0%</span>
                    <span className="features-asset-target"> (Target: 60%)</span>
                  </div>
                </div>

                <div className="features-asset-row">
                  <div className="features-asset-info">
                    <span className="features-asset-dot bonds" />
                    <strong>Fixed Income & Sovereign Debt</strong>
                  </div>
                  <div>
                    <span style={{ fontWeight: 700 }}>27.0%</span>
                    <span className="features-asset-target"> (Target: 25%)</span>
                  </div>
                </div>

                <div className="features-asset-row">
                  <div className="features-asset-info">
                    <span className="features-asset-dot liquid" />
                    <strong>Liquid Reserves & Cash</strong>
                  </div>
                  <div>
                    <span style={{ fontWeight: 700 }}>15.0%</span>
                    <span className="features-asset-target"> (Target: 15%)</span>
                  </div>
                </div>
              </div>

              <div className="features-card-footnote">
                Sample data for illustration. Real metrics reflect your configured holdings.
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 — Spot What Needs Attention */}
        <section className="features-split-section reverse" id="drift-monitoring" aria-labelledby="section-2-heading">
          <div className="features-section-text">
            <span className="features-section-num">02 / ALLOCATION DISCIPLINE</span>
            <h2 id="section-2-heading" className="features-section-title">
              Know when your portfolio moves away from your plan.
            </h2>
            <p className="features-section-body">
              Track your target asset allocation against your current holdings.
              Identify allocation differences and understand where your portfolio may need attention.
            </p>

            <ul className="features-capability-list">
              <li className="features-capability-item">
                <span className="features-check-icon"><CheckIcon /></span>
                <span><strong>Target Allocation Guardrails:</strong> Define optimal asset percentages tailored to your risk capacity.</span>
              </li>
              <li className="features-capability-item">
                <span className="features-check-icon"><CheckIcon /></span>
                <span><strong>Allocation Drift Detection:</strong> Pinpoint when market appreciation causes holdings to drift from your plan.</span>
              </li>
              <li className="features-capability-item">
                <span className="features-check-icon"><CheckIcon /></span>
                <span><strong>Rebalance Direction:</strong> Clear actionable guidance to restore target equilibrium without emotional guesswork.</span>
              </li>
            </ul>
          </div>

          <div className="features-section-visual">
            <div className="features-visual-card">
              <div className="features-card-topbar">
                <div className="features-card-heading">
                  <span>Sample Allocation Drift Analysis</span>
                  <span className="features-card-subhead">Target vs Actual Drift</span>
                </div>
                <span className="features-status-pill warning">Sample Drift Indicator</span>
              </div>

              <div className="features-drift-alert-box">
                <div className="features-drift-alert-icon">
                  <AlertIcon />
                </div>
                <div className="features-drift-alert-text">
                  <span className="features-drift-alert-title">Sample Drift Flag: +4.2% Equity Drift</span>
                  Illustrative scenario: Market gains pushed Equities above a 60.0% target. Drift exceeds a ±3.0% tolerance band.
                </div>
              </div>

              <div className="features-drift-table">
                {/* Equities Row */}
                <div className="features-drift-item">
                  <div className="features-drift-header-row">
                    <span>Equities & Growth</span>
                    <div className="features-drift-val-badges">
                      <span className="features-drift-badge overweight">+4.2% Overweight</span>
                    </div>
                  </div>
                  <div className="features-drift-track">
                    <div className="features-drift-current-bar" style={{ width: '64.2%', background: '#276653' }} />
                    <div className="features-drift-target-marker" style={{ left: '60%' }} title="Target: 60%" />
                  </div>
                  <div className="features-drift-meta-sub">
                    <span>Current: 64.2%</span>
                    <span>Target: 60.0%</span>
                  </div>
                </div>

                {/* Bonds Row */}
                <div className="features-drift-item">
                  <div className="features-drift-header-row">
                    <span>Fixed Income ETF</span>
                    <div className="features-drift-val-badges">
                      <span className="features-drift-badge underweight">-2.9% Underweight</span>
                    </div>
                  </div>
                  <div className="features-drift-track">
                    <div className="features-drift-current-bar" style={{ width: '22.1%', background: '#4f46e5' }} />
                    <div className="features-drift-target-marker" style={{ left: '25%' }} title="Target: 25%" />
                  </div>
                  <div className="features-drift-meta-sub">
                    <span>Current: 22.1%</span>
                    <span>Target: 25.0%</span>
                  </div>
                </div>

                {/* Cash & Crypto Row */}
                <div className="features-drift-item">
                  <div className="features-drift-header-row">
                    <span>Cash & Crypto</span>
                    <div className="features-drift-val-badges">
                      <span className="features-drift-badge balanced">In Band (-1.3%)</span>
                    </div>
                  </div>
                  <div className="features-drift-track">
                    <div className="features-drift-current-bar" style={{ width: '13.7%', background: '#b88746' }} />
                    <div className="features-drift-target-marker" style={{ left: '15%' }} title="Target: 15%" />
                  </div>
                  <div className="features-drift-meta-sub">
                    <span>Current: 13.7%</span>
                    <span>Target: 15.0%</span>
                  </div>
                </div>
              </div>

              <div className="features-card-footnote">
                Illustrative rebalancing calculation: Shows how allocating upcoming savings helps bring assets back to targets without selling.
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 — Turn Market Information Into Context */}
        <section className="features-split-section" id="market-context" aria-labelledby="section-3-heading">
          <div className="features-section-text">
            <span className="features-section-num">03 / CONTEXTUAL AWARENESS</span>
            <h2 id="section-3-heading" className="features-section-title">
              Stay informed without getting lost in information.
            </h2>
            <p className="features-section-body">
              Explore market news across finance, technology, business, and the economy.
              Understand relevant developments and keep market information connected to your financial dashboard.
            </p>

            <ul className="features-capability-list">
              <li className="features-capability-item">
                <span className="features-check-icon"><CheckIcon /></span>
                <span><strong>Signal Over Noise:</strong> Curated executive briefs designed for serious investors, free from sensationalist clickbait.</span>
              </li>
              <li className="features-capability-item">
                <span className="features-check-icon"><CheckIcon /></span>
                <span><strong>Portfolio Relevance:</strong> Every macroeconomic brief connects back to relevant asset classes and holdings.</span>
              </li>
              <li className="features-capability-item">
                <span className="features-check-icon"><CheckIcon /></span>
                <span><strong>Sector Coverage:</strong> Categorized streams spanning Markets, Technology, Economy, and Business.</span>
              </li>
            </ul>
          </div>

          <div className="features-section-visual">
            <div className="features-visual-card">
              <div className="features-card-topbar">
                <div className="features-card-heading">
                  <span>Sample Market Intelligence Feed</span>
                  <span className="features-card-subhead">Noise-Filtered Intelligence Stream</span>
                </div>
                <span className="features-status-pill neutral">Curated Sample Briefs</span>
              </div>

              {/* Category Filter Tabs */}
              <div className="features-news-tabs" role="tablist" aria-label="Market News Categories">
                {['All', 'Economy', 'Technology', 'Markets', 'Business'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={activeNewsCategory === cat}
                    className={`features-news-tab ${activeNewsCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveNewsCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="features-news-feed" id="news-feed">
                {filteredNews.map((item, idx) => (
                  <article key={idx} className="features-news-item">
                    <div className="features-news-meta">
                      <span className="features-news-category">{item.category}</span>
                      <span className="features-news-time">• {item.time}</span>
                    </div>
                    <h3 className="features-news-headline">{item.title}</h3>
                    <p className="features-news-summary">{item.summary}</p>
                    <div className="features-news-context-tag">
                      <span>{item.context}</span>
                    </div>
                  </article>
                ))}
              </div>

              <div className="features-card-footnote">
                Sample curated market briefs illustrating how news context connects with dashboard holdings.
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 — Explore Before You Decide */}
        <section className="features-split-section reverse" id="investment-research" aria-labelledby="section-4-heading">
          <div className="features-section-text">
            <span className="features-section-num">04 / DECISION CONTEXT</span>
            <h2 id="section-4-heading" className="features-section-title">
              Evaluate opportunities with more context.
            </h2>
            <p className="features-section-body">
              Explore illustrative stock ratings, research targets, valuations, and risk indicators.
              Compare available information to better understand potential investment opportunities.
            </p>

            <ul className="features-capability-list">
              <li className="features-capability-item">
                <span className="features-check-icon"><CheckIcon /></span>
                <span><strong>Multi-Factor Valuations:</strong> Compare P/E ratios, price-to-book multiples, and 52-week trading ranges.</span>
              </li>
              <li className="features-capability-item">
                <span className="features-check-icon"><CheckIcon /></span>
                <span><strong>Risk Volatility Indicators:</strong> Measure beta risk, sector cyclicality, and asset exposure.</span>
              </li>
              <li className="features-capability-item">
                <span className="features-check-icon"><CheckIcon /></span>
                <span><strong>Objective Sandbox:</strong> Structured comparative tools to study market trends without emotional impulse.</span>
              </li>
            </ul>
          </div>

          <div className="features-section-visual">
            <div className="features-visual-card">
              <div className="features-card-topbar">
                <div className="features-card-heading">
                  <span>Sample Investment Research Sandbox</span>
                  <span className="features-card-subhead">Illustrative Instrument Metrics</span>
                </div>
                <span className="features-status-pill neutral">Educational Sample View</span>
              </div>

              <div className="features-disclaimer-banner">
                <InfoIcon />
                <span>
                  <strong>Illustrative Sample Data:</strong> For educational context only. Does not imply verified analyst consensus, investment advice, or guaranteed recommendations.
                </span>
              </div>

              <div className="features-research-list">
                {/* TCS Row */}
                <div className="features-research-row">
                  <div className="features-research-instrument">
                    <span className="features-research-ticker">TCS</span>
                    <span className="features-research-sector">Tata Consultancy Services • IT</span>
                  </div>
                  <div className="features-research-metric">
                    <span className="features-research-metric-label">Valuation</span>
                    <span className="features-research-metric-val">P/E 28.4</span>
                  </div>
                  <div className="features-research-metric" style={{ alignItems: 'flex-end' }}>
                    <span className="features-rating-pill accumulate">Accumulate (Sample)</span>
                    <span style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>Beta: 0.82 (Moderate)</span>
                  </div>
                </div>

                {/* HDFC Bank Row */}
                <div className="features-research-row">
                  <div className="features-research-instrument">
                    <span className="features-research-ticker">HDFCBANK</span>
                    <span className="features-research-sector">HDFC Bank Ltd • Financials</span>
                  </div>
                  <div className="features-research-metric">
                    <span className="features-research-metric-label">Valuation</span>
                    <span className="features-research-metric-val">P/B 2.6</span>
                  </div>
                  <div className="features-research-metric" style={{ alignItems: 'flex-end' }}>
                    <span className="features-rating-pill buy">Buy (Sample)</span>
                    <span style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>Beta: 0.95 (Defensive)</span>
                  </div>
                </div>

                {/* Infosys Row */}
                <div className="features-research-row">
                  <div className="features-research-instrument">
                    <span className="features-research-ticker">INFY</span>
                    <span className="features-research-sector">Infosys Ltd • Tech Services</span>
                  </div>
                  <div className="features-research-metric">
                    <span className="features-research-metric-label">Valuation</span>
                    <span className="features-research-metric-val">P/E 24.1</span>
                  </div>
                  <div className="features-research-metric" style={{ alignItems: 'flex-end' }}>
                    <span className="features-rating-pill hold">Hold (Sample)</span>
                    <span style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>Beta: 1.05 (Market)</span>
                  </div>
                </div>
              </div>

              <div className="features-card-footnote">
                Illustrative evaluation framework. FinSight separates speculative hype from structured financial data.
              </div>
            </div>
          </div>
        </section>

        {/* Section 5 — Plan Beyond Today */}
        <section className="features-split-section" id="goals-planning" aria-labelledby="section-5-heading">
          <div className="features-section-text">
            <span className="features-section-num">05 / FUTURE TRAJECTORY</span>
            <h2 id="section-5-heading" className="features-section-title">
              Give your financial goals a direction.
            </h2>
            <p className="features-section-body">
              Define financial goals, explore savings projections, and understand how
              different financial assumptions can influence your future plans.
            </p>

            <ul className="features-capability-list">
              <li className="features-capability-item">
                <span className="features-check-icon"><CheckIcon /></span>
                <span><strong>Milestone Roadmaps:</strong> Track tangible progress towards emergency reserves, major purchases, or financial freedom.</span>
              </li>
              <li className="features-capability-item">
                <span className="features-check-icon"><CheckIcon /></span>
                <span><strong>Compound Simulation:</strong> Visualize how systematic monthly capital contributions compound over 1 to 5 years.</span>
              </li>
              <li className="features-capability-item">
                <span className="features-check-icon"><CheckIcon /></span>
                <span><strong>Assumption Testing:</strong> Explore how adjusting your savings velocity affects your projected timeline.</span>
              </li>
            </ul>
          </div>

          <div className="features-section-visual">
            <div className="features-visual-card">
              <div className="features-card-topbar">
                <div className="features-card-heading">
                  <span>Sample Goals & Trajectory</span>
                  <span className="features-card-subhead">Milestone Tracking & Compound Projections</span>
                </div>
                <span className="features-status-pill success">Sample Plan</span>
              </div>

              {/* Goal Milestones */}
              <div className="features-goal-items">
                <div className="features-goal-card">
                  <div className="features-goal-top">
                    <span>Sample Goal: Emergency Liquidity Reserve</span>
                    <strong style={{ color: 'var(--green-dark)' }}>80% Achieved</strong>
                  </div>
                  <div className="features-goal-progress-track">
                    <div className="features-goal-progress-fill" style={{ width: '80%' }} />
                  </div>
                  <div className="features-goal-subtext">
                    <span>₹2,40,000 Saved</span>
                    <span>Target: ₹3,00,000 (6 Months Expenses)</span>
                  </div>
                </div>

                <div className="features-goal-card">
                  <div className="features-goal-top">
                    <span>Sample Goal: First ₹10 Lakh Milestone</span>
                    <strong style={{ color: 'var(--accent-text)' }}>58% Achieved</strong>
                  </div>
                  <div className="features-goal-progress-track">
                    <div className="features-goal-progress-fill" style={{ width: '58%', background: '#b88746' }} />
                  </div>
                  <div className="features-goal-subtext">
                    <span>₹5,80,000 Accumulated</span>
                    <span>Target: ₹10,00,000</span>
                  </div>
                </div>
              </div>

              {/* Interactive Horizon Simulator */}
              <div className="features-sim-box">
                <div className="features-sim-toggle-row">
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block' }}>Monthly Addition: ₹15,000</span>
                    <strong style={{ fontSize: '13px' }}>Sample Compounding Projection</strong>
                  </div>
                  <div className="features-sim-toggles" role="group" aria-label="Simulation Time Horizon">
                    {[1, 3, 5].map((y) => (
                      <button
                        key={y}
                        type="button"
                        aria-pressed={simYears === y}
                        className={`features-sim-btn ${simYears === y ? 'active' : ''}`}
                        onClick={() => setSimYears(y)}
                      >
                        {y} {y === 1 ? 'Year' : 'Years'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="features-sim-output">
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block' }}>Projected Capital in {simYears} {simYears === 1 ? 'Year' : 'Years'}</span>
                    <span className="features-sim-output-val">{simulatedValues[simYears]}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--green-dark)', fontWeight: 600 }}>11% Illustrative CAGR</span>
                </div>
              </div>

              <div className="features-card-footnote">
                Sample compound calculations based on standard mathematical compounding formulas. All projections are illustrative and subject to market variability.
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ====================================================================
          Section 6 — A Workspace That Understands Your Goals
          ==================================================================== */}
      <section className="features-perspectives-section" id="perspectives" aria-labelledby="section-6-heading">
        <div className="features-perspectives-header">
          <span className="features-section-num">06 / PURPOSE-BUILT WORKSPACES</span>
          <h2 id="section-6-heading" className="features-section-title">
            Different financial needs deserve different perspectives.
          </h2>
          <p className="features-section-body" style={{ margin: '0 auto', maxWidth: '640px' }}>
            FinSight does not force everyone into a generic dashboard template. Choose the workspace designed specifically for your scale, goals, and depth.
          </p>
        </div>

        <div className="features-perspectives-grid">
          {/* Column 1: Student */}
          <article className="features-perspective-card student">
            <div className="features-perspective-top">
              <span className="features-perspective-num">01</span>
              <span className="features-perspective-badge">FOUNDATIONAL</span>
            </div>

            <h3 className="features-perspective-title">Student</h3>
            <p className="features-perspective-tagline">
              Budgeting, savings, financial goals, and financial learning.
            </p>
            <p className="features-perspective-desc">
              Cultivate lifelong wealth habits. Master core principles like diversification and compound interest through structured, jargon-free guides.
            </p>

            <ul className="features-perspective-bullets">
              <li className="features-perspective-bullet">
                <span className="features-bullet-marker">✓</span>
                <span>Milestone-based budgeting & emergency fund accumulation</span>
              </li>
              <li className="features-perspective-bullet">
                <span className="features-bullet-marker">✓</span>
                <span>Systematic monthly savings tracking (SIP pace)</span>
              </li>
              <li className="features-perspective-bullet">
                <span className="features-bullet-marker">✓</span>
                <span>Curated financial learning modules & foundational investing guides</span>
              </li>
              <li className="features-perspective-bullet">
                <span className="features-bullet-marker">✓</span>
                <span>Target asset allocation models (60/25/15 rule)</span>
              </li>
            </ul>

            <button
              type="button"
              className="btn btn-outline features-perspective-action"
              onClick={() => handleWorkspaceNavigation('student')}
            >
              Explore Student Workspace →
            </button>
          </article>

          {/* Column 2: Business */}
          <article className="features-perspective-card business">
            <div className="features-perspective-top">
              <span className="features-perspective-num">02</span>
              <span className="features-perspective-badge">OPERATIONAL</span>
            </div>

            <h3 className="features-perspective-title">Business</h3>
            <p className="features-perspective-tagline">
              Financial holdings, exposure, and business-oriented projections.
            </p>
            <p className="features-perspective-desc">
              Engineered for founders and finance leads managing corporate cash. Monitor treasury balances, preserve working capital, and plan financial runways.
            </p>

            <ul className="features-perspective-bullets">
              <li className="features-perspective-bullet">
                <span className="features-bullet-marker">✓</span>
                <span>Consolidated corporate treasury & cash balance tracking</span>
              </li>
              <li className="features-perspective-bullet">
                <span className="features-bullet-marker">✓</span>
                <span>Working capital liquidity buffers & runway modeling</span>
              </li>
              <li className="features-perspective-bullet">
                <span className="features-bullet-marker">✓</span>
                <span>Portfolio rebalancing calculations for commercial holdings</span>
              </li>
              <li className="features-perspective-bullet">
                <span className="features-bullet-marker">✓</span>
                <span>Future capital simulations & compound growth projections</span>
              </li>
            </ul>

            <button
              type="button"
              className="btn btn-outline features-perspective-action"
              onClick={() => handleWorkspaceNavigation('business')}
            >
              Explore Business Workspace →
            </button>
          </article>

          {/* Column 3: Tech-Enterprise */}
          <article className="features-perspective-card tech">
            <div className="features-perspective-top">
              <span className="features-perspective-num">03</span>
              <span className="features-perspective-badge">ENTERPRISE</span>
            </div>

            <h3 className="features-perspective-title">Tech-Enterprise</h3>
            <p className="features-perspective-tagline">
              Sector exposure, risk indicators, and investment perspectives.
            </p>
            <p className="features-perspective-desc">
              Constructed for quantitative thinkers and tech professionals. Monitor high-beta technology exposures, analyze volatility factors, and assess allocation balance.
            </p>

            <ul className="features-perspective-bullets">
              <li className="features-perspective-bullet">
                <span className="features-bullet-marker">✓</span>
                <span>Sector concentration tracking across high-growth tech</span>
              </li>
              <li className="features-perspective-bullet">
                <span className="features-bullet-marker">✓</span>
                <span>Quantitative risk indicators & beta volatility sensitivity</span>
              </li>
              <li className="features-perspective-bullet">
                <span className="features-bullet-marker">✓</span>
                <span>Market outlook & technology trends commentary</span>
              </li>
              <li className="features-perspective-bullet">
                <span className="features-bullet-marker">✓</span>
                <span>Digital asset and liquidity allocation tracking</span>
              </li>
            </ul>

            <button
              type="button"
              className="btn btn-outline features-perspective-action"
              onClick={() => handleWorkspaceNavigation('tech')}
            >
              Explore Tech Workspace →
            </button>
          </article>
        </div>
      </section>

      {/* ====================================================================
          Final CTA Section
          ==================================================================== */}
      <section className="features-final-cta" aria-labelledby="cta-heading">
        <div className="features-final-cta-content">
          <h2 id="cta-heading" className="features-final-cta-title">
            One Platform. Different Financial Perspectives.
          </h2>

          <p className="features-final-cta-desc">
            Whether you're beginning your financial journey, managing business finances,
            or exploring technology-sector investments, FinSight gives you a structured place to understand your financial information.
          </p>

          <span className="features-final-cta-closing">
            Less scattered information. More informed decisions.
          </span>

          <div className="features-final-cta-buttons">
            <button
              type="button"
              className="btn btn-primary btn-large"
              onClick={handleGetStarted}
            >
              Explore FinSight <ArrowRightIcon />
            </button>
            <button
              type="button"
              className="btn btn-outline btn-large"
              onClick={handleExploreDemo}
            >
              Explore Live Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
