import React, { useState } from 'react';
import PortfolioCard from '../../components/PortfolioCard';
import PortfolioChart from '../../components/PortfolioChart';
import AllocationCard from '../../components/AllocationCard';
import HoldingsTable from '../../components/HoldingsTable';
import FutureSimulation from '../../components/FutureSimulation';
import AssistantCard from '../../components/AssistantCard';
import ManagePortfolioModal from '../../components/ManagePortfolioModal';

export default function BusinessDashboard({
  data,
  user,
  financialData,
  onAddInvestment,
  onUpdateInvestment,
  onDeleteInvestment,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
  onUpdateMonthlySavings
}) {
  const {
    portfolioValue,
    portfolioRawValue,
    marketExposure,
    performance,
    isPositive,
    allocationDrift,
    driftConfigured,
    insightMessage,
    allocations,
    holdings,
    marketOutlook,
    riskMetrics,
    assistantSuggestions
  } = data;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState('investments');

  const openManageModal = (tab = 'investments') => {
    setModalInitialTab(tab);
    setIsModalOpen(true);
  };

  const businessTitle = user?.name ? `${user.name} Portfolio` : 'Corporate Treasury Portfolio';

  return (
    <div className="dashboard-wrapper">
      <div className="dash-header-row">
        <div>
          <span className="eyebrow eyebrow-gold">CORPORATE TREASURY INTELLIGENCE</span>
          <h1 className="page-title">
            {businessTitle}
          </h1>
          <p className="page-subtitle">
            Commercial asset monitoring, corporate liquidity risk, holdings breakdown, and future capital simulation.
          </p>
        </div>

        <div className="dash-header-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => openManageModal('investments')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '6px' }}>
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            Manage Holdings
          </button>
        </div>
      </div>

      <div className="dash-metrics-grid">
        <PortfolioCard
          title="Total Treasury Assets"
          value={portfolioValue}
          change={performance !== 'No data yet' ? performance : null}
          isPositive={isPositive}
          subtitle="Consolidated commercial valuation"
        />

        <PortfolioCard
          title="Active Market Exposure"
          value={marketExposure || '0%'}
          change={marketExposure && marketExposure !== '0%' ? 'Active Allocation' : 'No Assets'}
          isPositive={marketExposure && marketExposure !== '0%'}
          subtitle="Capital deployed in active equities & debt"
        />

        <PortfolioCard
          title="Allocation Drift"
          value={allocationDrift}
          change={driftConfigured ? 'Calculated' : 'Unconfigured'}
          isPositive={driftConfigured}
          subtitle="Quarterly target threshold: 5.0%"
        />

        <PortfolioCard
          title="Portfolio Sharpe Ratio"
          value={riskMetrics?.sharpeRatio || 'N/A'}
          change={riskMetrics?.sharpeRatio && riskMetrics.sharpeRatio !== 'N/A' ? 'Risk-Adjusted Yield' : 'No Data'}
          isPositive={riskMetrics?.sharpeRatio !== 'N/A'}
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
            <span className={isPositive ? 'gain' : 'loss'}>
              {performance !== 'No data yet' ? `${performance} Overall` : 'No data yet'}
            </span>
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
      <HoldingsTable holdings={holdings} title="Corporate Treasury Holdings" />

      {/* Future Value Simulation + Market Outlook */}
      <div className="grid-2col">
        <FutureSimulation
          initialPrincipal={portfolioRawValue || 0}
          defaultMonthly={financialData?.monthlySavings ? Number(financialData.monthlySavings) : 25000}
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
                <strong>{riskMetrics?.annualizedVolatility || 'N/A'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block' }}>Stress Test Loss (Max)</span>
                <strong style={{ color: 'var(--error)' }}>{riskMetrics?.stressTestLoss || 'N/A'}</strong>
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

      {/* Manage Portfolio Modal */}
      <ManagePortfolioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        financialData={financialData}
        onAddInvestment={onAddInvestment}
        onUpdateInvestment={onUpdateInvestment}
        onDeleteInvestment={onDeleteInvestment}
        onAddGoal={onAddGoal}
        onUpdateGoal={onUpdateGoal}
        onDeleteGoal={onDeleteGoal}
        onUpdateMonthlySavings={onUpdateMonthlySavings}
        initialTab={modalInitialTab}
      />
    </div>
  );
}
