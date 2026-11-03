import React from 'react';
import { ABOUT_DATA } from '../../data/mockData';
import './About.css';

export default function About() {
  return (
    <div className="about-page-container">
      {/* 1. Terminal Executive Header */}
      <header className="about-header">
        <span className="eyebrow">PURPOSE &amp; METHODOLOGY</span>
        <h1 className="page-title">About FinSight</h1>
        <p className="page-subtitle">
          Building a calm, disciplined financial intelligence platform designed to replace noise with actionable clarity.
        </p>

        {/* Platform Architecture Telemetry Strip */}
        <div className="about-telemetry-strip" aria-label="FinSight Platform Specs">
          <div className="about-telemetry-item">
            <span className="about-telemetry-dot" />
            <span>Client-Side Private Engine</span>
          </div>
          <div className="about-telemetry-item">
            <span className="about-telemetry-dot" />
            <span>Deterministic Math Simulations</span>
          </div>
          <div className="about-telemetry-item">
            <span className="about-telemetry-dot" />
            <span>Zero Broker Credential Lock-In</span>
          </div>
          <div className="about-telemetry-item">
            <span className="about-telemetry-dot" />
            <span>Multi-Perspective Intelligence</span>
          </div>
        </div>
      </header>

      {/* 2. Asymmetric Manifesto Terminal (Problem vs Solution) */}
      <section className="about-manifesto-terminal" aria-label="Problem and Solution Manifesto">
        {/* Left Pane: The Problem */}
        <article className="manifesto-pane problem-pane">
          <div className="manifesto-badge-row">
            <span className="manifesto-badge problem">THE PROBLEM</span>
            <span className="manifesto-pane-label">Market Friction</span>
          </div>
          <h2 className="manifesto-title">Fragmented Financial Decisions</h2>
          <p className="manifesto-statement">{ABOUT_DATA.problemStatement}</p>
          <p className="manifesto-description">
            Retail and commercial investors alike are bombarded by daily market volatility, sensationalized media headlines, and opaque fee structures. This often leads to portfolio drift and poor timing decisions.
          </p>

          <div className="manifesto-points-list">
            <div className="manifesto-point-item">
              <span className="manifesto-point-bullet error">•</span>
              <span>Emotional overreaction to short-term headlines and social sentiment</span>
            </div>
            <div className="manifesto-point-item">
              <span className="manifesto-point-bullet error">•</span>
              <span>Silent allocation drift across unmonitored asset classes</span>
            </div>
            <div className="manifesto-point-item">
              <span className="manifesto-point-bullet error">•</span>
              <span>Siloed balances without consolidated portfolio variance visibility</span>
            </div>
          </div>
        </article>

        {/* Right Pane: The Solution */}
        <article className="manifesto-pane solution-pane">
          <div className="manifesto-badge-row">
            <span className="manifesto-badge solution">THE SOLUTION</span>
            <span className="manifesto-pane-label">FinSight Architecture</span>
          </div>
          <h2 className="manifesto-title">Our Core Philosophy</h2>
          <p className="manifesto-statement">{ABOUT_DATA.solution}</p>
          <p className="manifesto-description">
            By separating financial education, business treasury monitoring, and enterprise risk into purpose-built perspectives, FinSight empowers every user to act with confidence.
          </p>

          <div className="manifesto-points-list">
            <div className="manifesto-point-item">
              <span className="manifesto-point-bullet success">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>Objective mathematical modeling replacing speculative predictions</span>
            </div>
            <div className="manifesto-point-item">
              <span className="manifesto-point-bullet success">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>Real-time allocation variance tracking with explicit rebalance orders</span>
            </div>
            <div className="manifesto-point-item">
              <span className="manifesto-point-bullet success">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>Tailored workspaces for students, growing companies, and enterprises</span>
            </div>
          </div>
        </article>
      </section>

      {/* 3. Guiding Pillars Bento Grid */}
      <section className="about-section-container" aria-labelledby="pillars-heading">
        <div className="about-section-header">
          <div className="section-header-meta">
            <span className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>CORE TENETS</span>
            <h2 id="pillars-heading" className="about-section-title">Our Guiding Pillars</h2>
          </div>
          <p className="about-section-subtitle">The foundational principles behind the FinSight architecture</p>
        </div>

        <div className="pillars-bento-grid">
          {ABOUT_DATA.pillars.map((pillar, idx) => (
            <div
              key={pillar.title}
              className={`pillar-bento-item ${idx === 0 || idx === 3 ? 'pillar-wide' : ''}`}
            >
              <div className="pillar-item-top">
                <span className="pillar-index">0{idx + 1}</span>
                <span className="pillar-discipline-tag">
                  {idx === 0 ? 'Foundation' : idx === 1 ? 'Discipline' : idx === 2 ? 'Modeling' : 'Context'}
                </span>
              </div>
              <h3 className="pillar-title">{pillar.title}</h3>
              <p className="pillar-description">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Execution Workflow Pipeline ("From Financial Data to Clearer Decisions") */}
      <section className="about-section-container" aria-labelledby="workflow-heading">
        <div className="about-section-header">
          <div className="section-header-meta">
            <span className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>HOW FINSIGHT WORKS</span>
            <h2 id="workflow-heading" className="about-section-title">From Financial Data to Clearer Decisions</h2>
          </div>
          <p className="about-section-subtitle">
            FinSight brings your financial picture into one organized workspace, helping you understand what you own, track how your portfolio changes, and identify where your attention may be needed.
          </p>
        </div>

        <div className="workflow-steps-pipeline">
          <div className="workflow-step-card">
            <div className="workflow-step-top">
              <span className="workflow-step-number">01</span>
              <span className="workflow-step-badge">Stage 1</span>
            </div>
            <h3 className="workflow-step-title">See the Full Picture</h3>
            <p className="workflow-step-desc">
              Bring portfolio holdings, asset allocation, performance, and financial goals together to understand where you stand.
            </p>
          </div>

          <div className="workflow-step-divider" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>

          <div className="workflow-step-card">
            <div className="workflow-step-top">
              <span className="workflow-step-number">02</span>
              <span className="workflow-step-badge">Stage 2</span>
            </div>
            <h3 className="workflow-step-title">Understand What Matters</h3>
            <p className="workflow-step-desc">
              Explore market developments, allocation changes, risk indicators, and financial insights without getting lost in unnecessary noise.
            </p>
          </div>

          <div className="workflow-step-divider" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>

          <div className="workflow-step-card">
            <div className="workflow-step-top">
              <span className="workflow-step-number">03</span>
              <span className="workflow-step-badge">Stage 3</span>
            </div>
            <h3 className="workflow-step-title">Make More Informed Decisions</h3>
            <p className="workflow-step-desc">
              Compare your current allocation with your targets, explore potential future outcomes, and evaluate possible adjustments before acting.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Institutional Mission Callout */}
      <section className="about-mission-card" aria-label="FinSight Mission">
        <span className="about-mission-eyebrow">MISSION STATEMENT</span>
        <blockquote className="about-mission-quote">
          &ldquo;{ABOUT_DATA.mission}&rdquo;
        </blockquote>
        <div className="about-mission-meta">
          <span>FinSight Architecture Group</span>
          <span className="about-mission-dot">•</span>
          <span>Client-Side Private</span>
          <span className="about-mission-dot">•</span>
          <span>Zero-Broker Lock-In</span>
        </div>
      </section>
    </div>
  );
}
