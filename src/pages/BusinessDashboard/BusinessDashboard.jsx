import React from 'react';
import PortfolioCard from '../../components/PortfolioCard';
import PortfolioChart from '../../components/PortfolioChart';
import AllocationCard from '../../components/AllocationCard';
import HoldingsTable from '../../components/HoldingsTable';
import FutureSimulation from '../../components/FutureSimulation';
import AssistantCard from '../../components/AssistantCard';

export default function BusinessDashboard({ data, user }) {
  const {
    portfolioValue,
    marketExposure,
    performance,
    isPositive,
    allocationDrift,
    insightMessage,
    allocations,
    holdings,
    marketOutlook,
    riskMetrics,
    assistantSuggestions
  } = data;

  return (
    <div className="dashboard-wrapper">
      <div className="dash-header-row">
        <div>
          <span className="eyebrow eyebrow-gold">CORPORATE TREASURY INTELLIGENCE</span>
          <h1 className="page-title">
            {user?.name || 'Nexus Ventures'} Portfolio
          </h1>
          <p className="page-subtitle">
            Commercial asset monitoring, corporate liquidity risk, holdings breakdown, and future capital simulation.
          </p>
        </div>
      </div>

      <div className="dash-metrics-grid">
        <PortfolioCard
          title="Total Treasury Assets"
          value={portfolioValue}
          change={performance}
          isPositive={isPositive}
          subtitle="Consolidated commercial valuation"
        />

        <PortfolioCard
          title="Active Market Exposure"
          value={marketExposure}
          change="Optimal"
          isPositive={true}
          subtitle="Capital deployed in active equities & debt"
        />

        <PortfolioCard
          title="Allocation Drift"
          value={allocationDrift}
          change="3.8% Drift"
          isPositive={true}
          subtitle="Quarterly target threshold: 5.0%"
        />

        <PortfolioCard
          title="Portfolio Sharpe Ratio"
          value={riskMetrics.sharpeRatio}
          change="Low Beta (0.94)"
          isPositive={true}
          subtitle="Risk-adjusted yield metric"
        />
      </div>

      <div className="grid-2col">
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Treasury Performance Curve</h3>
              <span className="panel-subtitle">Historical growth with interactive timeframe analysis</span>
            </div>
            <span className="gain">{performance} YTD</span>
          </div>
          <PortfolioChart height={240} />
        </div>

        <AllocationCard
          allocations={allocations}
          drift={allocationDrift}
          insight={insightMessage}
          title="Corporate Asset Allocation"
        />
      </div>

      {/* Holdings Table */}
      <HoldingsTable holdings={holdings} />

      {/* Future Value Simulation + Market Outlook */}
      <div className="grid-2col">
        <FutureSimulation
          initialPrincipal={1842000}
          defaultMonthly={50000}
          defaultRate={12}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Market Outlook Panel */}
          <div className="panel-card">
            <div className="panel-header">
              <div>
                <h3 className="panel-title">Market Outlook & Risk Overview</h3>
                <span className="panel-subtitle">Institutional macroeconomic assessment</span>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.6, marginBottom: '18px' }}>
              {marketOutlook}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'var(--bg)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block' }}>Annualized Volatility</span>
                <strong>{riskMetrics.annualizedVolatility}</strong>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block' }}>Stress Test Loss (Max)</span>
                <strong style={{ color: 'var(--error)' }}>{riskMetrics.stressTestLoss}</strong>
              </div>
            </div>
          </div>

          {/* AI Assistant */}
          <AssistantCard
            suggestions={assistantSuggestions}
            title="Corporate Financial Assistant"
            role="business"
          />
        </div>
      </div>
    </div>
  );
}
