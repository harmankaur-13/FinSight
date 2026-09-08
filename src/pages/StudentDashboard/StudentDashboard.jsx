import React from 'react';
import { formatHumanName } from '../../hooks/useFinanceData';
import PortfolioCard from '../../components/PortfolioCard';
import PortfolioChart from '../../components/PortfolioChart';
import AllocationCard from '../../components/AllocationCard';
import AssistantCard from '../../components/AssistantCard';
import EducationCard from '../../components/EducationCard';

export default function StudentDashboard({ data, user }) {
  const {
    portfolioValue,
    performance,
    isPositive,
    monthlySavings,
    allocationDrift,
    insightMessage,
    allocations,
    goals,
    educationalModules,
    videoTutorials,
    assistantSuggestions
  } = data;

  const displayName = formatHumanName(user?.name) || 'Aman';

  return (
    <div className="dashboard-wrapper">
      <div className="dash-header-row">
        <div>
          <span className="eyebrow eyebrow-gold">STUDENT WEALTH PORTAL</span>
          <h1 className="page-title">
            Welcome back, {displayName}
          </h1>
          <p className="page-subtitle">
            Track your foundational investments, monitor target allocation drift, and build long-term financial knowledge.
          </p>
        </div>
      </div>

      <div className="dash-metrics-grid">
        <PortfolioCard
          title="Total Portfolio Value"
          value={portfolioValue}
          change={performance}
          isPositive={isPositive}
          subtitle="Updated across all connected holdings"
        />

        <PortfolioCard
          title="Monthly Investment Pace"
          value={monthlySavings}
          change="+₹500 vs last month"
          isPositive={true}
          subtitle="Systematic monthly capital addition"
        />

        <PortfolioCard
          title="Allocation Drift"
          value={allocationDrift}
          change="Within Range"
          isPositive={true}
          subtitle="Max target deviation limit: 5.0%"
        />

        <PortfolioCard
          title="Active Learning Streak"
          value="4 Modules"
          change="Foundations"
          isPositive={true}
          subtitle="Personal finance progress"
        />
      </div>

      <div className="grid-2col">
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Portfolio Performance History</h3>
              <span className="panel-subtitle">Cumulative asset growth over time</span>
            </div>
            <span className="gain">{performance} Overall</span>
          </div>
          <PortfolioChart height={240} />
        </div>

        <AllocationCard
          allocations={allocations}
          drift={allocationDrift}
          insight={insightMessage}
          title="Student Asset Allocation"
        />
      </div>

      <div className="grid-2col">
        {/* Goal Tracker */}
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Financial Goal Milestones</h3>
              <span className="panel-subtitle">Target savings and investment checkpoints</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {goals.map((g, idx) => {
              const pct = Math.min(100, Math.round((g.current / g.target) * 100));
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <strong>{g.title}</strong>
                    <span>
                      {g.unit}{g.current.toLocaleString('en-IN')} / {g.unit}{g.target.toLocaleString('en-IN')} ({pct}%)
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Assistant */}
        <AssistantCard
          suggestions={assistantSuggestions}
          title="FinSight Student Assistant"
          role="student"
        />
      </div>

      {/* Educational & YouTube Section */}
      <EducationCard
        modules={educationalModules}
        videos={videoTutorials}
      />
    </div>
  );
}
