import React, { useState } from 'react';

export default function PortfolioChart({ height = 230, interactive = true }) {
  const [timeframe, setTimeframe] = useState('1Y');

  // Variations in curve based on selected timeframe
  const paths = {
    '1M': {
      area: 'M0 160 C50 155 100 140 150 145 C200 150 250 130 300 120 C350 110 400 95 450 90 C480 85 500 70 520 65 L520 220 L0 220 Z',
      line: 'M0 160 C50 155 100 140 150 145 C200 150 250 130 300 120 C350 110 400 95 450 90 C480 85 500 70 520 65'
    },
    '6M': {
      area: 'M0 175 C40 160 80 170 130 150 C180 130 230 140 280 115 C330 90 380 110 430 85 C470 70 500 60 520 52 L520 220 L0 220 Z',
      line: 'M0 175 C40 160 80 170 130 150 C180 130 230 140 280 115 C330 90 380 110 430 85 C470 70 500 60 520 52'
    },
    '1Y': {
      area: 'M0 185 C45 170 60 150 95 160 C130 170 145 135 180 145 C220 158 235 105 275 120 C315 135 325 85 365 100 C400 112 425 65 460 78 C485 88 500 55 520 48 L520 220 L0 220 Z',
      line: 'M0 185 C45 170 60 150 95 160 C130 170 145 135 180 145 C220 158 235 105 275 120 C315 135 325 85 365 100 C400 112 425 65 460 78 C485 88 500 55 520 48'
    },
    'ALL': {
      area: 'M0 195 C60 180 120 160 180 150 C240 140 300 110 360 90 C420 70 470 50 520 35 L520 220 L0 220 Z',
      line: 'M0 195 C60 180 120 160 180 150 C240 140 300 110 360 90 C420 70 470 50 520 35'
    }
  };

  const activePath = paths[timeframe] || paths['1Y'];

  return (
    <div className="portfolio-chart-container">
      {interactive && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginBottom: '8px' }}>
          {['1M', '6M', '1Y', 'ALL'].map(tf => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              style={{
                border: '1px solid var(--border)',
                background: timeframe === tf ? 'var(--green)' : 'transparent',
                color: timeframe === tf ? '#fff' : 'var(--muted)',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {tf}
            </button>
          ))}
        </div>
      )}

      <div className="chart" style={{ height: `${height}px` }}>
        <div className="chart-grid"></div>
        <svg viewBox="0 0 520 220" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGreenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#276653" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#276653" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path className="area" fill="url(#chartGreenGrad)" d={activePath.area} />
          <path className="line" d={activePath.line} />
        </svg>
      </div>
    </div>
  );
}
