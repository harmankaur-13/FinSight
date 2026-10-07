import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import {
  ASSET_COLORS,
  formatCurrency,
  calculateAssetAllocations
} from '../utils/financialCalculations';

// Custom Tooltip showing Actual %, Target %, Amount, and Drift Alert
function DonutTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const hasTarget = data.target !== null && data.target !== undefined;
  const drift = hasTarget ? Math.abs(data.percentage - data.target) : null;
  const isDriftHigh = drift !== null && drift > 5.0;

  return (
    <div className="donut-tooltip-card">
      <div className="donut-tooltip-header">
        <span className="asset-color-dot" style={{ backgroundColor: data.color }} />
        <strong className="donut-tooltip-title">{data.name}</strong>
      </div>
      <div className="donut-tooltip-row">
        <span className="donut-tooltip-label">Current Value:</span>
        <strong>{formatCurrency(data.value)} ({data.percentage}%)</strong>
      </div>
      <div className="donut-tooltip-row">
        <span className="donut-tooltip-label">Target Allocation:</span>
        <span style={{ fontWeight: 600, color: hasTarget ? 'var(--text)' : 'var(--muted)' }}>
          {hasTarget ? `${data.target}%` : 'Not configured'}
        </span>
      </div>
      {hasTarget && (
        <div className="donut-tooltip-row">
          <span className="donut-tooltip-label">Drift:</span>
          <span style={{ fontWeight: 700, color: isDriftHigh ? 'var(--error)' : 'var(--green-dark)' }}>
            {drift.toFixed(1)}%
          </span>
        </div>
      )}
      {isDriftHigh && (
        <div className="donut-tooltip-alert">
          ⚠ Drift exceeds 5.0% threshold
        </div>
      )}
    </div>
  );
}

export default function AllocationDonut({
  allocations: passedAllocations,
  investments = [],
  height = 240,
  title = 'Asset Allocation Donut',
  subtitle = 'Current vs target asset distribution'
}) {
  // Use passed allocations or compute from investments
  const allocations = useMemo(() => {
    if (Array.isArray(passedAllocations) && passedAllocations.length > 0) {
      return passedAllocations.map((a) => ({
        ...a,
        color: a.color || ASSET_COLORS[a.name] || ASSET_COLORS['Other'],
        drift: (a.target !== null && a.target !== undefined) ? Math.abs(a.percentage - a.target) : null
      }));
    }
    if (Array.isArray(investments) && investments.length > 0) {
      const computed = calculateAssetAllocations(investments);
      return computed.map((a) => ({
        ...a,
        drift: (a.target !== null && a.target !== undefined) ? Math.abs(a.percentage - a.target) : null
      }));
    }
    return [];
  }, [passedAllocations, investments]);

  const hasData = allocations.length > 0 && allocations.some((a) => a.percentage > 0 || a.value > 0);

  const totalValue = useMemo(() => {
    return allocations.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
  }, [allocations]);

  const highDriftCount = useMemo(() => {
    return allocations.filter((a) => a.drift !== null && a.drift > 5.0).length;
  }, [allocations]);

  return (
    <div className="panel-card allocation-donut-card">
      <div className="panel-header">
        <div>
          <h3 className="panel-title">{title}</h3>
          <span className="panel-subtitle">{subtitle}</span>
        </div>
        {highDriftCount > 0 && (
          <span className="loss" style={{ fontSize: '11px', padding: '3px 8px' }}>
            ⚠ {highDriftCount} {highDriftCount === 1 ? 'Asset' : 'Assets'} Drift &gt; 5%
          </span>
        )}
      </div>

      {!hasData ? (
        <div className="donut-empty-state" style={{ minHeight: `${height}px` }}>
          <div className="empty-icon-circle">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
              <path d="M22 12A10 10 0 0 0 12 2v10z" />
            </svg>
          </div>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '13px' }}>
            No investment allocation data available.
          </p>
        </div>
      ) : (
        <div className="donut-content-layout">
          {/* Donut Chart Container */}
          <div className="donut-chart-wrapper" style={{ height: `${height}px`, minHeight: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocations}
                  dataKey="percentage"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="58%"
                  outerRadius="84%"
                  paddingAngle={3}
                  stroke="var(--surface)"
                  strokeWidth={2}
                  isAnimationActive={true}
                >
                  {allocations.map((entry, index) => {
                    const isHighDrift = entry.drift !== null && entry.drift > 5.0;
                    return (
                      <Cell
                        key={`cell-${entry.name}-${index}`}
                        fill={entry.color}
                        stroke={isHighDrift ? 'var(--error)' : 'var(--surface)'}
                        strokeWidth={isHighDrift ? 2.5 : 1.5}
                      />
                    );
                  })}
                </Pie>
                <Tooltip content={<DonutTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Center Label */}
            <div className="donut-center-label">
              <span className="donut-center-sub">Total Capital</span>
              <strong className="donut-center-value">
                {totalValue > 0 ? formatCurrency(totalValue) : '100%'}
              </strong>
            </div>
          </div>

          {/* Allocation Legend with Drift Indicators */}
          <div className="donut-legend-list">
            {allocations.map((item) => {
              const hasTarget = item.target !== null && item.target !== undefined;
              const isHighDrift = item.drift !== null && item.drift > 5.0;

              return (
                <div
                  key={item.name}
                  className={`donut-legend-row ${isHighDrift ? 'has-drift-alert' : ''}`}
                >
                  <div className="donut-legend-left">
                    <span className="asset-color-dot" style={{ backgroundColor: item.color }} />
                    <span className="donut-legend-name">{item.name}</span>
                  </div>

                  <div className="donut-legend-right">
                    <strong className="donut-legend-pct">{item.percentage}%</strong>
                    <span className="donut-legend-target">
                      {hasTarget ? `Target: ${item.target}%` : 'No Target'}
                    </span>
                    {isHighDrift && (
                      <span className="drift-warning-pill" title={`Allocation drift of ${item.drift.toFixed(1)}% exceeds 5% threshold`}>
                        ⚠ {item.drift.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
