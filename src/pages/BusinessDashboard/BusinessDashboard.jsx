import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PortfolioCard from '../../components/PortfolioCard';
import PortfolioChart from '../../components/PortfolioChart';
import AllocationCard from '../../components/AllocationCard';
import AllocationDonut from '../../components/AllocationDonut';
import RebalanceEngine from '../../components/RebalanceEngine';
import HoldingsTable from '../../components/HoldingsTable';
import FutureSimulation from '../../components/FutureSimulation';
import AssistantCard from '../../components/AssistantCard';
import ManagePortfolioModal from '../../components/ManagePortfolioModal';
import { formatCurrency } from '../../utils/financialCalculations';

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
  onUpdateMonthlySavings,
  onUpdateTargetAllocations
}) {
  const {
    portfolioValue,
    portfolioRawValue,
    totalTreasuryAssets,
    cashReserves,
    monthlyOperatingExpenses,
    cashRunway,
    netFinancialPosition,
    totalLiabilities,
    missingFields = [],
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

  const activeInvestments = useMemo(() => {
    if (financialData?.investments && financialData.investments.length > 0) {
      return financialData.investments;
    }
    if (user?.isDemo) {
      return [
        { id: 'biz-1', name: 'Infosys Ltd', type: 'Stocks', investedAmount: 380000, currentValue: 420000, targetAllocation: 25 },
        { id: 'biz-2', name: 'HDFC Bank', type: 'Stocks', investedAmount: 360000, currentValue: 385000, targetAllocation: 20 },
        { id: 'biz-3', name: 'Reliance Industries', type: 'Stocks', investedAmount: 330000, currentValue: 340000, targetAllocation: 15 },
        { id: 'biz-4', name: 'Tata Consultancy Services', type: 'Stocks', investedAmount: 300000, currentValue: 290000, targetAllocation: 10 },
        { id: 'biz-5', name: 'ICICI Corp Bond Fund', type: 'Bonds', investedAmount: 225000, currentValue: 230000, targetAllocation: 15 },
        { id: 'biz-6', name: 'Embassy Office Parks REIT', type: 'Real Estate', investedAmount: 165000, currentValue: 177000, targetAllocation: 15 }
      ];
    }
    return [];
  }, [financialData?.investments, user?.isDemo]);

  const openManageModal = (tab = 'investments') => {
    setModalInitialTab(tab);
    setIsModalOpen(true);
  };

  const businessTitle = data?.businessName
    ? `${data.businessName} Portfolio`
    : (user?.name ? `${user.name} Portfolio` : 'Corporate Treasury Portfolio');

  return (
    <div className="dashboard-wrapper">
      <div className="dash-header-row">
        <div>
          <span className="eyebrow">CORPORATE TREASURY INTELLIGENCE</span>
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

      {/* Actionable Missing Profile Banner */}
      {missingFields && missingFields.length > 0 && (
        <div style={{
          background: 'var(--surface-hover)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <strong style={{ color: 'var(--text)', fontSize: '13px' }}>Treasury Metrics Incomplete: </strong>
            <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
              {missingFields.map(m => m.label).join(', ')} not configured. Configure them in Settings to compute operational Cash Runway and Net Financial Position.
            </span>
          </div>
          <Link to="/settings?tab=financial" className="btn btn-outline btn-small" style={{ fontSize: '12px' }}>
            Configure in Settings →
          </Link>
        </div>
      )}

      <div className="dash-metrics-grid">
        <PortfolioCard
          title="Total Treasury Assets"
          value={totalTreasuryAssets || portfolioValue}
          change={performance !== 'No data yet' ? performance : null}
          isPositive={isPositive}
          subtitle={`Holdings: ${portfolioValue} | Cash: ${cashReserves || '₹0'}`}
        />

        <PortfolioCard
          title="Cash Runway"
          value={cashRunway?.formatted || 'Not configured'}
          change={cashRunway?.isCalculated ? (cashRunway.status === 'healthy' ? 'Healthy Runway' : cashRunway.status === 'caution' ? 'Caution Runway' : 'Critical Runway') : 'Burn Rate Missing'}
          isPositive={cashRunway?.status === 'healthy'}
          subtitle={`Monthly Burn: ${monthlyOperatingExpenses || 'Not specified'}`}
        />

        <PortfolioCard
          title="Net Financial Position"
          value={netFinancialPosition?.formatted || 'N/A'}
          change={netFinancialPosition?.isVerified ? (netFinancialPosition?.isPositive ? 'Net Positive Assets' : 'Liability Deficit') : (netFinancialPosition?.badgeText || 'Unverified Position')}
          isPositive={Boolean(netFinancialPosition?.isVerified && netFinancialPosition?.isPositive)}
          subtitle={netFinancialPosition?.isVerified ? `Total Debt: ${totalLiabilities || '₹0'}` : 'Liabilities unconfigured in Settings'}
        />

        <PortfolioCard
          title="Allocation Drift"
          value={allocationDrift}
          change={driftConfigured ? 'Calculated' : 'Unconfigured'}
          isPositive={driftConfigured}
          subtitle="Quarterly target threshold: 5.0%"
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
          <PortfolioChart height={240} portfolioValue={portfolioRawValue} user={user} />
        </div>

        <AllocationDonut
          allocations={allocations}
          investments={activeInvestments}
          height={240}
          title="Corporate Treasury Allocation Donut"
          subtitle="Current vs target asset distribution with drift alerts"
        />
      </div>

      <div className="grid-2col">
        <AllocationCard
          allocations={allocations}
          drift={allocationDrift}
          insight={insightMessage}
          title="Corporate Asset Allocation Breakdown"
        />

        <FutureSimulation
          initialPrincipal={portfolioRawValue ?? 0}
          defaultMonthly={financialData?.monthlySavings !== null && financialData?.monthlySavings !== undefined ? Number(financialData.monthlySavings) : (user?.isDemo ? 25000 : 0)}
          defaultRate={12}
        />
      </div>

      {/* Target Rebalancing Engine */}
      <RebalanceEngine
        investments={activeInvestments}
        monthlySavings={financialData?.monthlySavings !== null && financialData?.monthlySavings !== undefined ? formatCurrency(financialData.monthlySavings) : (user?.isDemo ? '₹25,000' : 'Not provided')}
        onOpenManageModal={openManageModal}
      />

      {/* Holdings Table */}
      <HoldingsTable holdings={holdings} title="Corporate Treasury Holdings" />

      {/* Market Outlook & Corporate Financial Assistant (At the end) */}
      <div className="grid-2col">
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', background: 'var(--bg)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
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

        {/* AI Assistant (Rendered once at the bottom) */}
        <AssistantCard
          suggestions={assistantSuggestions}
          title="Corporate Financial Assistant"
          role="business"
        />
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
