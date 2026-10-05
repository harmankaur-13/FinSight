import React from 'react';

export default function PortfolioCard({
  title = 'Total portfolio',
  value = '₹0',
  change = null,
  isPositive = true,
  subtitle,
  children
}) {
  const showChange = change !== null && change !== undefined && change !== '' && change !== 'null';

  return (
    <div className="metric-card">
      <div className="metric-header">
        <span>{title}</span>
        {showChange && (
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
