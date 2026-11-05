import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PortfolioCard from '../../components/PortfolioCard';
import PortfolioChart from '../../components/PortfolioChart';
import AllocationCard from '../../components/AllocationCard';
import AllocationDonut from '../../components/AllocationDonut';
import RebalanceEngine from '../../components/RebalanceEngine';
import ProjectionCard from '../../components/ProjectionCard';
import HoldingsTable from '../../components/HoldingsTable';
import AssistantCard from '../../components/AssistantCard';
import ManagePortfolioModal from '../../components/ManagePortfolioModal';

export default function TechDashboard({
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
    performance,
    isPositive,
    annualTechBudget,
    monthlyTechExpenditure,
    annualizedSpending,
    budgetUtilization,
    spendingBreakdown = {},
    spendingBreakdownItems = [],
    techAssets = [],
    missingFields = [],
    costLossExposure,
    techSectorExposure,
    allocationDrift,
    driftConfigured,
    insightMessage,
    allocations,
    holdings,
    riskAreas,
    crunchAcquisition,
    projections,
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
        { id: 'tech-1', name: 'NVIDIA Corp', type: 'Stocks', investedAmount: 9700000, currentValue: 12500000, targetAllocation: 25 },
        { id: 'tech-2', name: 'Microsoft Cloud Unit', type: 'Stocks', investedAmount: 9600000, currentValue: 11000000, targetAllocation: 25 },
        { id: 'tech-3', name: 'Amazon AWS Infrastructure', type: 'ETFs', investedAmount: 7600000, currentValue: 8500000, targetAllocation: 20 },
        { id: 'tech-4', name: 'Alphabet DeepMind Tech', type: 'Stocks', investedAmount: 5700000, currentValue: 6200000, targetAllocation: 10 },
        { id: 'tech-5', name: 'Sovereign Tech Bond ETF', type: 'Bonds', investedAmount: 5300000, currentValue: 5500000, targetAllocation: 10 },
        { id: 'tech-6', name: 'Enterprise Digital Reserves', type: 'Crypto', investedAmount: 3600000, currentValue: 4500000, targetAllocation: 10 }
      ];
    }
    return [];
  }, [financialData?.investments, user?.isDemo]);

  const openManageModal = (tab = 'investments') => {
    setModalInitialTab(tab);
    setIsModalOpen(true);
  };

  const enterpriseTitle = data?.organizationName
    ? `${data.organizationName} Enterprise`
    : (user?.name ? `${user.name} Enterprise` : 'Enterprise Treasury');

  return (
    <div className="dashboard-wrapper">
      <div className="dash-header-row">
        <div>
          <span className="eyebrow">ENTERPRISE TREASURY & TECH PERSPECTIVE</span>
          <h1 className="page-title">
            {enterpriseTitle}
          </h1>
          <p className="page-subtitle">
            Sector concentration analytics, infrastructure cost/loss risk, multi-year simulated trajectories, and strategic asset planning.
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
            Manage Enterprise Assets
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
            <strong style={{ color: 'var(--text)', fontSize: '13px' }}>Technology Parameters Incomplete: </strong>
            <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
              {missingFields.map(m => m.label).join(', ')} not configured. Configure in Settings to monitor real-time Budget Utilization Rate.
            </span>
          </div>
          <Link to="/settings?tab=financial" className="btn btn-outline btn-small" style={{ fontSize: '12px' }}>
            Configure in Settings →
          </Link>
        </div>
      )}

      <div className="dash-metrics-grid">
        <PortfolioCard
          title="Enterprise Portfolio Value"
          value={portfolioValue}
          change={performance !== 'No data yet' ? performance : null}
          isPositive={isPositive}
          subtitle="Consolidated multi-entity treasury"
        />

        <PortfolioCard
          title="Annual Tech Budget Utilization"
          value={budgetUtilization?.formatted || 'Not configured'}
          change={budgetUtilization?.isCalculated ? (budgetUtilization.status === 'on_track' ? 'On Track (<85%)' : budgetUtilization.status === 'warning' ? 'Approaching Limit' : 'Over Budget (>100%)') : 'Budget Unset'}
          isPositive={budgetUtilization?.status === 'on_track'}
          subtitle={annualTechBudget !== 'Not configured' ? `Budget: ${annualTechBudget} (Annualized Run-Rate)` : 'Budget not configured'}
        />

        <PortfolioCard
          title="Monthly Tech Expenditure"
          value={monthlyTechExpenditure || 'Not configured'}
          change="Active OpEx Burn"
          isPositive={true}
          subtitle="Cloud infrastructure & software commitments"
        />

        <PortfolioCard
          title="Tech Sector Exposure"
          value={techSectorExposure || '0%'}
          change={techSectorExposure && techSectorExposure !== '0%' ? 'Active Allocation' : 'No Data'}
          isPositive={techSectorExposure && techSectorExposure !== '0%'}
          subtitle="Cloud SaaS and compute infrastructure"
        />
      </div>

      <div className="grid-2col">
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Enterprise Capital History & Performance</h3>
              <span className="panel-subtitle">Long-term corporate treasury trajectory</span>
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
          title="Enterprise Asset Allocation Donut"
          subtitle="Current vs target asset distribution with drift alerts"
        />
      </div>

      {/* Target Rebalancing Engine */}
      <RebalanceEngine
        investments={activeInvestments}
        onOpenManageModal={openManageModal}
      />

      <div className="grid-2col">
        <AllocationCard
          allocations={allocations}
          drift={allocationDrift}
          insight={insightMessage}
          title="Sector Concentration & Breakdown"
        />

        <ProjectionCard
          projections={projections}
          costLoss={costLossExposure}
          crunchData={crunchAcquisition}
        />
      </div>

      {/* Holdings Table */}
      <HoldingsTable holdings={holdings} title="Enterprise Portfolio Holdings" />

      {/* Technology Spending Breakdown Table */}
      {spendingBreakdownItems && spendingBreakdownItems.length > 0 && (
        <div className="panel-card" style={{ marginBottom: '24px' }}>
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Technology Expenditure Breakdown</h3>
              <span className="panel-subtitle">Category allocation across infrastructure, licenses, and operations</span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Total: {monthlyTechExpenditure}/mo
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '12px' }}>
                  <th style={{ padding: '10px 12px' }}>Category</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Monthly Amount</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>% of Total</th>
                </tr>
              </thead>
              <tbody>
                {spendingBreakdownItems.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px', fontWeight: 500, color: 'var(--text)' }}>{item.category}</td>
                    <td style={{ padding: '12px', textAlign: 'right', color: 'var(--text)' }}>{item.monthlyAmount}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: 'var(--primary)' }}>{item.formattedPercentage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Risk Vectors & Strategic AI Assistant */}
      <div className="grid-2col">
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Enterprise Risk Areas</h3>
              <span className="panel-subtitle">Operational & macroeconomic exposure points</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {riskAreas.map((r, idx) => (
              <div 
                key={idx} 
                style={{ 
                  background: 'var(--bg)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '10px', 
                  padding: '14px' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '13px', color: 'var(--text)' }}>{r.area}</strong>
                  <span 
                    style={{ 
                      fontSize: '10px', 
                      fontWeight: 700, 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      background: r.severity === 'High' ? 'var(--error-light)' : r.severity === 'Medium' ? 'var(--surface-2)' : 'var(--green-light)',
                      color: r.severity === 'High' ? 'var(--error)' : r.severity === 'Medium' ? 'var(--text)' : 'var(--green-dark)',
                      border: r.severity === 'Medium' ? '1px solid var(--border)' : 'none'
                    }}
                  >
                    {r.severity} Severity
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>{r.note}</p>
              </div>
            ))}
          </div>
        </div>

        <AssistantCard
          suggestions={assistantSuggestions}
          title="Enterprise Risk & M&A Assistant"
          role="tech"
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
