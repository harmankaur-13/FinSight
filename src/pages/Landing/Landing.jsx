import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../../components/Toast';
import { getRoleDashboardPath } from '../../hooks/useFinanceData';

export default function Landing({ onDemoLogin }) {
  const navigate = useNavigate();
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2400);
  };

  const handleDemoClick = (role = 'student') => {
    if (onDemoLogin) {
      onDemoLogin(role);
      triggerToast('Loading demo dashboard...');
      setTimeout(() => {
        navigate(getRoleDashboardPath(role));
      }, 500);
    } else {
      navigate('/login');
    }
  };

  const scrollToFeatures = () => {
    const el = document.getElementById('features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow">
            PERSONAL WEALTH INTELLIGENCE
          </div>

          <h1 className="hero-title">
            Everything your money needs
            <span>in one platform.</span>
          </h1>

          <p className="hero-text">
            Bring your investments, financial goals, market insights, and
            portfolio decisions together in one place.
          </p>

          <div className="hero-actions">
            <button 
              className="btn btn-primary btn-large" 
              id="heroStart"
              onClick={() => navigate('/signup')}
            >
              Get Started Free <span>→</span>
            </button>
            <button 
              className="btn btn-outline btn-large" 
              id="demoBtn"
              onClick={() => handleDemoClick('student')}
            >
              Explore Live Demo
            </button>
          </div>

          <div className="trust-row">
            <div>
              <strong>01</strong>
              <span>Track</span>
            </div>
            <div>
              <strong>02</strong>
              <span>Understand</span>
            </div>
            <div>
              <strong>03</strong>
              <span>Rebalance</span>
            </div>
          </div>
        </div>

        {/* Product Visual: Clean, balanced single card preview */}
        <div className="hero-visual">
          <div className="dashboard-card">
            <div className="card-top">
              <div>
                <p className="muted">Total portfolio</p>
                <h2>₹12,84,650</h2>
              </div>
              <span className="gain">+12.48%</span>
            </div>

            <div className="chart">
              <div className="chart-grid"></div>
              <svg viewBox="0 0 520 200" preserveAspectRatio="none">
                <path
                  className="area"
                  d="M0 160 C50 145 70 130 110 138 C150 146 170 115 210 125 C250 135 280 88 320 102 C360 115 400 68 440 78 C480 88 500 50 520 42 L520 200 L0 200 Z"
                />
                <path
                  className="line"
                  d="M0 160 C50 145 70 130 110 138 C150 146 170 115 210 125 C250 135 280 88 320 102 C360 115 400 68 440 78 C480 88 500 50 520 42"
                />
              </svg>
            </div>

            <div className="stats">
              <div>
                <span>Equities</span>
                <strong>60%</strong>
              </div>
              <div>
                <span>Bonds</span>
                <strong>25%</strong>
              </div>
              <div>
                <span>Crypto</span>
                <strong>15%</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="section-heading">
          <p className="eyebrow">ONE PLACE. CLEARER DECISIONS.</p>
          <h2>Everything your money needs.</h2>
        </div>

        <div className="feature-grid">
          <article>
            <div className="feature-number">01</div>
            <h3>Portfolio overview</h3>
            <p>See your assets, performance and allocation at a glance.</p>
          </article>

          <article>
            <div className="feature-number">02</div>
            <h3>Smart rebalancing</h3>
            <p>Compare target vs actual allocation and get a clear trade list.</p>
          </article>

          <article>
            <div className="feature-number">03</div>
            <h3>Market intelligence</h3>
            <p>Understand market movements with useful news and insights.</p>
          </article>
        </div>
      </section>

      {/* Audience Section */}
      <section className="audience" id="dashboards">
        <div className="section-heading">
          <p className="eyebrow">BUILT FOR DIFFERENT GOALS</p>
          <h2>One FinSight. Multiple perspectives.</h2>
        </div>

        <div className="audience-grid">
          <div 
            className="audience-card" 
            onClick={() => handleDemoClick('student')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleDemoClick('student')}
          >
            <span className="card-number">01</span>
            <h3>Student</h3>
            <p>Learn about money, build habits and understand your finances.</p>
            <span className="btn-link">Preview Dashboard →</span>
          </div>

          <div 
            className="audience-card" 
            onClick={() => handleDemoClick('business')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleDemoClick('business')}
          >
            <span className="card-number">02</span>
            <h3>Business</h3>
            <p>Monitor investments, market trends and financial performance.</p>
            <span className="btn-link">Preview Dashboard →</span>
          </div>

          <div 
            className="audience-card" 
            onClick={() => handleDemoClick('tech')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleDemoClick('tech')}
          >
            <span className="card-number">03</span>
            <h3>Big Tech</h3>
            <p>Explore predictive insights and data-driven financial decisions.</p>
            <span className="btn-link">Preview Dashboard →</span>
          </div>
        </div>
      </section>

      <Toast message={toastMsg} show={showToast} />
    </>
  );
}

