import React from 'react';

export default function HoldingsTable({ holdings = [], title = 'Portfolio Holdings' }) {
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
              <th>Sector</th>
              <th>Current Value</th>
              <th>24h Change</th>
              <th>Allocation</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h, i) => (
              <tr key={i}>
                <td>
                  <div className="ticker-symbol">{h.company}</div>
                  <div className="ticker-name">{h.symbol}</div>
                </td>
                <td style={{ color: 'var(--muted)' }}>{h.sector || 'General'}</td>
                <td style={{ fontWeight: 600 }}>{h.value}</td>
                <td>
                  <span className={h.isPositive ? 'gain' : 'loss'}>
                    {h.change}
                  </span>
                </td>
                <td style={{ fontWeight: 600 }}>{h.allocation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
