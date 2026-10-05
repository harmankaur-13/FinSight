import React, { useState } from 'react';
import PortfolioCard from '../../components/PortfolioCard';
import PortfolioChart from '../../components/PortfolioChart';
import AllocationCard from '../../components/AllocationCard';
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
  onUpdateMonthlySavings
}) {
  const {
    portfolioValue,
    performance,
    isPositive,
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

  const openManageModal = (tab = 'investments') => {
    setModalInitialTab(tab);
    setIsModalOpen(true);
  };

  const enterpriseTitle = user?.name ? `${user.name} Enterprise` : 'Enterprise Treasury';

  return (
    <div className="dashboard-wrapper">
      <div className="dash-header-row">
        <div>
          <span className="eyebrow eyebrow-gold">ENTERPRISE TREASURY & TECH PERSPECTIVE</span>
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

      <div className="dash-metrics-grid">
        <PortfolioCard
          title="Enterprise Portfolio Value"
          value={portfolioValue}
          change={performance !== 'No data yet' ? performance : null}
          isPositive={isPositive}
          subtitle="Consolidated multi-entity treasury"
        />

        <PortfolioCard
          title="Tech Sector Exposure"
          value={techSectorExposure || '0%'}
          change={techSectorExposure && techSectorExposure !== '0%' ? 'Active Allocation' : 'No Data'}
          isPositive={techSectorExposure && techSectorExposure !== '0%'}
          subtitle="Cloud SaaS and compute infrastructure"
        />

        <PortfolioCard
          title="Current Loss Exposure"
          value={costLossExposure}
          change="Simulated Max Drawdown"
          isPositive={false}
          subtitle="Stress-tested across supply volatility"
        />

        <PortfolioCard
          title="2030 Projected Trajectory"
          value={projections && projections.length > 0 ? projections[projections.length - 1].projectedValue : '₹0'}
          change={projections && projections.length > 0 && projections[projections.length - 1].simulatedGrowth !== 'No data' ? '+75.0% Sim. Total' : 'No Data'}
          isPositive={true}
          subtitle="Illustrative compound scenario"
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
          <PortfolioChart height={240} />
        </div>

        <AllocationCard
          allocations={allocations}
          drift={allocationDrift}
          insight={insightMessage}
          title="Sector Concentration"
        />
      </div>

      {/* Holdings Table */}
      <HoldingsTable holdings={holdings} title="Enterprise Portfolio Holdings" />

      {/* 4-Year Valuation Projections & Cost/Loss Analysis */}
      <ProjectionCard
        projections={projections}
        costLoss={costLossExposure}
        crunchData={crunchAcquisition}
      />

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
                      background: r.severity === 'High' ? 'var(--error-light)' : r.severity === 'Medium' ? 'var(--gold-light)' : 'var(--green-light)',
                      color: r.severity === 'High' ? 'var(--error)' : r.severity === 'Medium' ? '#7d5722' : 'var(--green-dark)'
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
