import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { formatCurrency } from '../utils/financialCalculations';
import {
  getStoredValueHistory,
  saveValueSnapshot,
  filterHistoryByTimeframe,
  generateProjectedGrowth,
  getUserValueHistoryKey
} from '../utils/valueHistory';

// Custom Tooltip for Portfolio History & Projections
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  const item = payload[0].payload;
  const isProjection = Boolean(item.isProjection);
  const val = item.totalValue;

  return (
    <div className="chart-tooltip-card">
      <div className="chart-tooltip-date">
        {item.date}
        {isProjection ? (
          <span className="proj-tag">Simulated Projection</span>
        ) : (
          <span className="history-tag" style={{ marginLeft: '6px', fontSize: '10px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--green)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>Historical Snapshot</span>
        )}
      </div>
      <div className="chart-tooltip-value">
        {formatCurrency(val)}
      </div>
      {isProjection && (
        <div className="chart-tooltip-note">
          Based on simulated compound growth
        </div>
      )}
    </div>
  );
}

export default function PortfolioChart({
  height = 230,
  interactive = true,
  portfolioValue = null,
  user = null
}) {
  const [timeframe, setTimeframe] = useState('1Y');
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [viewMode, setViewMode] = useState('history'); // 'history' | 'projection'

  const storageKey = useMemo(() => getUserValueHistoryKey(user), [
    user?.id,
    user?.email,
    user?.isDemo,
    user?.userType
  ]);

  const [history, setHistory] = useState(() => getStoredValueHistory(storageKey));

  // Determine effective current portfolio value strictly from props
  const numericCurrentValue = useMemo(() => {
    if (portfolioValue !== null && portfolioValue !== undefined && !isNaN(Number(portfolioValue))) {
      return Math.max(0, Number(portfolioValue));
    }
    return 0;
  }, [portfolioValue]);

  // Sync history when user or numericCurrentValue changes
  useEffect(() => {
    if (numericCurrentValue > 0) {
      const updated = saveValueSnapshot(numericCurrentValue, null, storageKey);
      setHistory(updated);
    } else {
      setHistory(getStoredValueHistory(storageKey));
    }
  }, [numericCurrentValue, storageKey]);

  const hasRealHistory = history.length >= 2;
  const hasNoData = numericCurrentValue === 0;
  const isSimulatedView = hasNoData ? false : (!hasRealHistory || viewMode === 'projection');

  // Compute Chart Data (Filtered Real History OR Projected Growth)
  const chartData = useMemo(() => {
    if (hasNoData) {
      return [];
    }

    if (hasRealHistory && viewMode === 'history') {
      return filterHistoryByTimeframe(history, timeframe);
    }

    // Projected Growth Mode (Explicitly simulated)
    let months = 12;
    if (timeframe === '1M') months = 1;
    else if (timeframe === '6M') months = 6;
    else if (timeframe === '1Y') months = 12;
    else if (timeframe === 'ALL') months = 36;

    return generateProjectedGrowth(numericCurrentValue, expectedReturn, months);
  }, [hasNoData, hasRealHistory, viewMode, history, timeframe, numericCurrentValue, expectedReturn]);

  // Format Y Axis Ticks (₹ in K / L / Cr)
  const formatYAxis = (val) => {
    if (val === 0) return '₹0';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${Math.round(val / 1000)}K`;
    return `₹${val}`;
  };

  // Format X Axis Dates
  const formatXAxis = (dateStr) => {
    if (!dateStr) return '';
    try {
      const [, m, d] = dateStr.split('-');
      if (!m || !d) return dateStr;
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthName = monthNames[parseInt(m, 10) - 1] || m;
      return `${monthName} ${parseInt(d, 10)}`;
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="portfolio-chart-container">
      {/* Top Controls Row: View Toggle, Timeframe Buttons & Mode Badge */}
      <div className="chart-controls-bar">
        <div className="chart-mode-indicator">
          {hasNoData ? (
            <span className="projection-warning-badge">
              Historical data unavailable
            </span>
          ) : !isSimulatedView ? (
            <span className="real-history-badge">
              <span className="dot-pulse" /> Real Performance History
            </span>
          ) : (
            <span className="projection-warning-badge" title="Displaying simulated compound growth.">
              Projection — not actual performance
            </span>
          )}
        </div>

        {interactive && !hasNoData && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {hasRealHistory && (
              <div className="chart-view-toggle" style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  className={`tf-btn ${viewMode === 'history' ? 'active' : ''}`}
                  onClick={() => setViewMode('history')}
                >
                  History
                </button>
                <button
                  type="button"
                  className={`tf-btn ${viewMode === 'projection' ? 'active' : ''}`}
                  onClick={() => setViewMode('projection')}
                >
                  Projection (Simulated)
                </button>
              </div>
            )}
            <div className="chart-timeframe-buttons">
              {['1M', '6M', '1Y', 'ALL'].map((tf) => (
                <button
                  key={tf}
                  type="button"
                  className={`tf-btn ${timeframe === tf ? 'active' : ''}`}
                  onClick={() => setTimeframe(tf)}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Expected Return Slider in Projected Mode */}
      {isSimulatedView && !hasNoData && numericCurrentValue > 0 && (
        <div className="projection-slider-card">
          <div className="projection-slider-header">
            <span className="slider-hint">
              Simulated Growth Horizon ({timeframe}): <strong>{expectedReturn}% Expected Return</strong>
            </span>
            <span className="projection-note">Adjust slider to model different compound return rates</span>
          </div>
          <input
            type="range"
            min="4"
            max="25"
            step="1"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(Number(e.target.value))}
            className="fin-slider projection-rate-slider"
            aria-label="Expected annual return rate"
          />
        </div>
      )}

      {/* Recharts Area Chart or Empty State */}
      <div className="chart" style={{ height: `${height}px` }}>
        {hasNoData ? (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', textAlign: 'center', padding: '16px' }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '13px', color: 'var(--text)' }}>Historical data unavailable</p>
            <p style={{ margin: '6px 0 0', fontSize: '12px' }}>Add investments to begin recording dated portfolio snapshots.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="chartGreenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--green)" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="var(--green)" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--chart-grid-line)"
              />

              <XAxis
                dataKey="date"
                tickFormatter={formatXAxis}
                tick={{ fontSize: 11, fill: 'var(--muted)' }}
                stroke="var(--border)"
                tickLine={false}
                axisLine={{ stroke: 'var(--border)' }}
              />

              <YAxis
                tickFormatter={formatYAxis}
                tick={{ fontSize: 11, fill: 'var(--muted)' }}
                stroke="var(--border)"
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
              />

              <Tooltip content={<ChartTooltip />} />

              <Area
                type="monotone"
                dataKey="totalValue"
                stroke="var(--green)"
                strokeWidth={2.5}
                fill="url(#chartGreenGrad)"
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
