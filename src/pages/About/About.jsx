import React from 'react';
import { ABOUT_DATA } from '../../data/mockData';

export default function About() {
  return (
    <div className="container" style={{ padding: '40px 0 90px' }}>
      <div className="page-header">
        <span className="eyebrow eyebrow-gold">PURPOSE & METHODOLOGY</span>
        <h1 className="page-title">About FinSight</h1>
        <p className="page-subtitle">
          Building a calm, disciplined financial intelligence platform designed to replace noise with actionable clarity.
        </p>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <span className="eyebrow">THE PROBLEM</span>
          <h3 style={{ marginTop: '6px' }}>Fragmented Financial Decisions</h3>
          <p>{ABOUT_DATA.problemStatement}</p>
          <p>
            Retail and commercial investors alike are bombarded by daily market volatility, sensationalized media headlines, and opaque fee structures. This often leads to portfolio drift and poor timing decisions.
          </p>
        </div>

        <div className="about-card">
          <span className="eyebrow">THE SOLUTION</span>
          <h3 style={{ marginTop: '6px' }}>Our Core Philosophy</h3>
          <p>{ABOUT_DATA.solution}</p>
          <p>
            By separating financial education, business treasury monitoring, and enterprise risk into purpose-built perspectives, FinSight empowers every user to act with confidence.
          </p>
        </div>
      </div>

      <div className="panel-card" style={{ marginBottom: '40px' }}>
        <div className="panel-header">
          <div>
            <h3 className="panel-title">Our Guiding Pillars</h3>
            <span className="panel-subtitle">The foundational principles behind the FinSight architecture</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {ABOUT_DATA.pillars.map((pillar, idx) => (
            <div key={idx} style={{ background: 'var(--bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: 700, marginBottom: '6px' }}>
                0{idx + 1}
              </div>
              <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>{pillar.title}</h4>
              <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="about-card" style={{ background: 'var(--green-light)', borderColor: 'rgba(39, 102, 83, 0.25)' }}>
        <span className="eyebrow" style={{ color: 'var(--green-dark)' }}>PLATFORM ROADMAP</span>
        <h3 style={{ color: 'var(--green-dark)', marginTop: '6px' }}>Future Vision & Extensibility</h3>
        <p style={{ color: 'var(--text)' }}>
          FinSight is structured as a modern modular React Single Page Application. In subsequent phases, it will seamlessly integrate with real financial broker APIs, automated bank feeds, and persistent Node.js/Express/MongoDB backends without requiring frontend visual refactoring.
        </p>
      </div>
    </div>
  );
}
