import React from 'react';
import PortfolioCard from '../../components/PortfolioCard';
import PortfolioChart from '../../components/PortfolioChart';
import AllocationCard from '../../components/AllocationCard';
import ProjectionCard from '../../components/ProjectionCard';
import AssistantCard from '../../components/AssistantCard';

export default function TechDashboard({ data, user }) {
  const {
    portfolioValue,
    performance,
    isPositive,
    costLossExposure,
    allocationDrift,
    insightMessage,
    allocations,
    riskAreas,
    crunchAcquisition,
    projections,
    assistantSuggestions
  } = data;

  return (
    <div className="dashboard-wrapper">
      <div className="dash-header-row">
        <div>
          <span className="eyebrow eyebrow-gold">ENTERPRISE TREASURY & TECH PERSPECTIVE</span>
          <h1 className="page-title">
            {user?.name || 'Apex Technologies Enterprise'}
          </h1>
          <p className="page-subtitle">
            Sector concentration analytics, infrastructure cost/loss risk, 4-year simulated trajectories, and strategic crunch acquisitions.
          </p>
        </div>
      </div>

      <div className="dash-metrics-grid">
        <PortfolioCard
          title="Enterprise Portfolio Value"
          value={portfolioValue}
          change={performance}
          isPositive={isPositive}
          subtitle="Consolidated multi-entity treasury"
        />

        <PortfolioCard
          title="Tech Sector Exposure"
          value="52.0%"
          change="High Focus"
          isPositive={true}
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
          value="₹9.40 Cr"
          change="+20.2% Sim. CAGR"
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
            <span className="gain">{performance} Annual</span>
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
    </div>
  );
}
