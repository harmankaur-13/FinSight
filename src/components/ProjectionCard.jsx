import React from 'react';

export default function ProjectionCard({ projections = [], costLoss = '₹18.4L', crunchData }) {
  return (
    <div className="panel-card">
      <div className="panel-header">
        <div>
          <h3 className="panel-title">4-Year Enterprise Valuation Projection</h3>
          <span className="panel-subtitle">Multi-year capital trajectory modeling (2026 – 2030)</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {projections.map((p, idx) => (
          <div 
            key={idx} 
            style={{ 
              background: p.status === 'Current' ? 'var(--surface-2)' : 'var(--bg)', 
              border: '1px solid var(--border)', 
              borderRadius: '10px', 
              padding: '14px 12px',
              textAlign: 'center' 
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700 }}>{p.year}</div>
            <div style={{ fontSize: '16px', fontWeight: 700, margin: '4px 0', color: 'var(--text)', fontFamily: 'Space Grotesk' }}>
              {p.projectedValue}
            </div>
            <span 
              className={p.status === 'Current' ? 'gain' : 'gain'} 
              style={{ fontSize: '10px', padding: '2px 6px' }}
            >
              {p.simulatedGrowth}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
        <div style={{ background: 'var(--error-light)', border: '1px solid #f2c7c2', borderRadius: '10px', padding: '16px' }}>
          <span style={{ fontSize: '11px', color: 'var(--error)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Cost / Loss Analysis
          </span>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--error)', margin: '4px 0', fontFamily: 'Space Grotesk' }}>
            {costLoss}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
            Estimated maximum drawdown risk under unfavorable currency and cloud compute pricing shifts.
          </p>
        </div>

        {crunchData && (
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px' }}>
            <span style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {crunchData.title}
            </span>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', margin: '4px 0' }}>
              {crunchData.target}
            </div>
            <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
              {crunchData.rationale} ({crunchData.valuation})
            </p>
          </div>
        )}
      </div>

      <div className="simulation-disclaimer">
        <strong>Projection Disclaimer:</strong> These figures represent mathematical scenario modeling and sensitivity simulations. They do not constitute guaranteed investment returns or financial underwriting.
      </div>
    </div>
  );
}
