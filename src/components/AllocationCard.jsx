import React from 'react';

export default function AllocationCard({
  allocations = [],
  drift = '2.4%',
  insight = 'Your portfolio is currently within your target allocation range.',
  title = 'Asset Allocation'
}) {
  return (
    <div className="panel-card">
      <div className="panel-header">
        <div>
          <h3 className="panel-title">{title}</h3>
          <span className="panel-subtitle">Target vs Current Distribution</span>
        </div>
      </div>

      <div className="allocations-list">
        {allocations.map((item, idx) => (
          <div key={idx} className="allocation-item">
            <div className="allocation-label-row">
              <span>{item.name}</span>
              <strong>{item.percentage}%</strong>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color || 'var(--green)'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {drift && (
        <div className="drift-badge-box">
          <div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>
              Allocation Drift
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 700 }}>
              Target deviation: {drift}
            </div>
          </div>
          <span className="gain" style={{ fontSize: '11px' }}>
            Balanced
          </span>
        </div>
      )}

      {insight && (
        <div className="insight-callout-box">
          <div className="mini-icon" style={{ minWidth: '28px', height: '28px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L22 12L12 22L2 12Z" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--green-dark)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              FinSight Insight
            </div>
            <p style={{ margin: 0, marginTop: '2px' }}>{insight}</p>
          </div>
        </div>
      )}
    </div>
  );
}
