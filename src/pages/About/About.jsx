import { ABOUT_DATA } from '../../data/mockData';

export default function About() {
  return (
    <div className="container" style={{ padding: '40px 0 90px' }}>
      <div className="page-header">
        <span className="eyebrow">PURPOSE & METHODOLOGY</span>
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
              <div style={{ fontSize: '12px', color: 'var(--accent-text)', fontWeight: 700, marginBottom: '6px' }}>
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

      <div className="panel-card">
        <div className="panel-header" style={{ marginBottom: '24px', paddingBottom: '16px' }}>
          <div>
            <span className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>HOW FINSIGHT WORKS</span>
            <h3 className="panel-title" style={{ fontSize: '22px', letterSpacing: '-0.4px', margin: '4px 0 8px' }}>
              From Financial Data to Clearer Decisions
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.6, maxWidth: '780px', margin: 0 }}>
              FinSight brings your financial picture into one organized workspace, helping you understand what you own, track how your portfolio changes, and identify where your attention may be needed.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div style={{ background: 'var(--bg)', padding: '22px 20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '12px', color: 'var(--accent-text)', fontWeight: 700, marginBottom: '8px', fontFamily: 'Space Grotesk' }}>
              01
            </div>
            <h4 style={{ fontSize: '16px', marginBottom: '8px', color: 'var(--text)' }}>See the Full Picture</h4>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
              Bring portfolio holdings, asset allocation, performance, and financial goals together to understand where you stand.
            </p>
          </div>

          <div style={{ background: 'var(--bg)', padding: '22px 20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '12px', color: 'var(--accent-text)', fontWeight: 700, marginBottom: '8px', fontFamily: 'Space Grotesk' }}>
              02
            </div>
            <h4 style={{ fontSize: '16px', marginBottom: '8px', color: 'var(--text)' }}>Understand What Matters</h4>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
              Explore market developments, allocation changes, risk indicators, and financial insights without getting lost in unnecessary noise.
            </p>
          </div>

          <div style={{ background: 'var(--bg)', padding: '22px 20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '12px', color: 'var(--accent-text)', fontWeight: 700, marginBottom: '8px', fontFamily: 'Space Grotesk' }}>
              03
            </div>
            <h4 style={{ fontSize: '16px', marginBottom: '8px', color: 'var(--text)' }}>Make More Informed Decisions</h4>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
              Compare your current allocation with your targets, explore potential future outcomes, and evaluate possible adjustments before acting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
