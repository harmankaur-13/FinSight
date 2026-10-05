import React from 'react';

export default function HoldingsTable({ holdings = [], title = 'Portfolio Holdings' }) {
  const hasHoldings = Array.isArray(holdings) && holdings.length > 0;

  return (
    <div className="panel-card">
      <div className="panel-header">
        <div>
          <h3 className="panel-title">{title}</h3>
          <span className="panel-subtitle">Current asset positions and weightings</span>
        </div>
      </div>

      <div className="holdings-table-wrap">
        <table className="fin-table">
          <thead>
            <tr>
              <th>Asset / Company</th>
              <th>Sector / Type</th>
              <th>Current Value</th>
              <th>Gain / Return</th>
              <th>Allocation</th>
            </tr>
          </thead>
          <tbody>
            {!hasHoldings ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--muted)', fontSize: '13px' }}>
                  No holdings recorded. Add investments to populate your holdings table.
                </td>
              </tr>
            ) : (
              holdings.map((h, i) => (
                <tr key={h.id || i}>
                  <td>
                    <div className="ticker-symbol">{h.company}</div>
                    <div className="ticker-name">{h.symbol}</div>
                  </td>
                  <td style={{ color: 'var(--muted)' }}>{h.sector || h.type || 'General'}</td>
                  <td style={{ fontWeight: 600 }}>{h.value}</td>
                  <td>
                    <span className={h.isPositive ? 'gain' : 'loss'}>
                      {h.change}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{h.allocation}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
