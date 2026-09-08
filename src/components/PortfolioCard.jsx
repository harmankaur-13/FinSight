import React from 'react';

export default function PortfolioCard({
  title = 'Total portfolio',
  value = '₹12,84,650',
  change = '+12.48%',
  isPositive = true,
  subtitle,
  children
}) {
  return (
    <div className="metric-card">
      <div className="metric-header">
        <span>{title}</span>
        {change && (
          <span className={isPositive ? 'gain' : 'loss'}>
            {change}
          </span>
        )}
      </div>

      <div className="metric-value">{value}</div>

      {subtitle && (
        <div className="metric-footer">
          <span>{subtitle}</span>
        </div>
      )}

      {children}
    </div>
  );
}
