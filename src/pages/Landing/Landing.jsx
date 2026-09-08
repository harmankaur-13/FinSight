import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../../components/Toast';

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
        if (role === 'business') navigate('/business-dashboard');
        else if (role === 'tech') navigate('/tech-dashboard');
        else navigate('/student-dashboard');
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
      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow">
            <span className="pulse"></span>
            PERSONAL WEALTH INTELLIGENCE
          </div>

          <h1 className="hero-title">
            Make every financial
            <span>decision count.</span>
          </h1>

          <p className="hero-text">
            FinSight brings your investments, goals, market insights and
            rebalancing decisions into one intelligent dashboard.
          </p>

          <div className="hero-actions">
            <button 
              className="btn btn-primary btn-large" 
              id="heroStart"
              onClick={scrollToFeatures}
            >
              Explore your finances <span>→</span>
            </button>
            <button 
              className="btn btn-outline btn-large" 
              id="demoBtn"
              onClick={() => handleDemoClick('student')}
            >
              View demo
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

        <div className="hero-visual">
          <div className="glow"></div>

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
              <svg viewBox="0 0 520 220" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGradLanding" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#276653" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#276653" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  className="area"
                  fill="url(#areaGradLanding)"
                  d="M0 185 C45 170 60 150 95 160 C130 170 145 135 180 145 C220 158 235 105 275 120 C315 135 325 85 365 100 C400 112 425 65 460 78 C485 88 500 55 520 48 L520 220 L0 220 Z"
                />
                <path
                  className="line"
                  d="M0 185 C45 170 60 150 95 160 C130 170 145 135 180 145 C220 158 235 105 275 120 C315 135 325 85 365 100 C400 112 425 65 460 78 C485 88 500 55 520 48"
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

          <div className="float-card allocation-float">
            <div className="mini-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <path d="M12 3 A9 9 0 0 1 12 21 Z" />
              </svg>
            </div>
            <div>
              <small>Allocation drift</small>
              <strong>2.4%</strong>
            </div>
          </div>

          <div className="float-card insight-float">
            <div className="mini-icon">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L22 12L12 22L2 12Z" />
              </svg>
            </div>
            <div>
              <small>FinSight insight</small>
              <strong>Portfolio is healthy</strong>
            </div>
          </div>
        </div>
      </section>

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

      <section className="audience" id="dashboards">
        <div>
          <p className="eyebrow">BUILT FOR DIFFERENT GOALS</p>
          <h2>One FinSight. Multiple perspectives.</h2>
        </div>

        <div className="audience-grid">
          <div 
            className="audience-card student" 
            style={{ cursor: 'pointer' }}
            onClick={() => handleDemoClick('student')}
          >
            <span className="card-number">01</span>
            <h3>Student</h3>
            <p>Learn about money, build habits and understand your finances.</p>
            <span className="btn-link">Preview Dashboard →</span>
          </div>

          <div 
            className="audience-card business" 
            style={{ cursor: 'pointer' }}
            onClick={() => handleDemoClick('business')}
          >
            <span className="card-number">02</span>
            <h3>Business</h3>
            <p>Monitor investments, market trends and financial performance.</p>
            <span className="btn-link">Preview Dashboard →</span>
          </div>

          <div 
            className="audience-card enterprise" 
            style={{ cursor: 'pointer' }}
            onClick={() => handleDemoClick('tech')}
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
