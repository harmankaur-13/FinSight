import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatHumanName } from '../../hooks/useFinanceData';
import PortfolioCard from '../../components/PortfolioCard';
import PortfolioChart from '../../components/PortfolioChart';
import AllocationCard from '../../components/AllocationCard';
import AllocationDonut from '../../components/AllocationDonut';
import RebalanceEngine from '../../components/RebalanceEngine';
import AssistantCard from '../../components/AssistantCard';
import EducationCard, { getStudiedResourcesKey } from '../../components/EducationCard';
import ManagePortfolioModal from '../../components/ManagePortfolioModal';

export default function StudentDashboard({
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
    monthlySavings,
    monthlyIncome,
    monthlyExpenses,
    savingsRate,
    missingFields = [],
    allocationDrift,
    driftConfigured,
    insightMessage,
    allocations,
    goals = [],
    educationalModules,
    financialKnowledgeResources,
    assistantSuggestions
  } = data;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState('investments');

  const displayName = formatHumanName(user?.name) || 'Student';

  // Compute active investments (from user's real data or demo profile)
  const activeInvestments = useMemo(() => {
    if (financialData?.investments && financialData.investments.length > 0) {
      return financialData.investments;
    }
    if (user?.isDemo) {
      return [
        { id: 'demo-1', name: 'Nifty 50 Index Fund', type: 'Stocks', investedAmount: 14000, currentValue: 15240, targetAllocation: 60 },
        { id: 'demo-2', name: 'Govt Treasury Bond ETF', type: 'Bonds', investedAmount: 6000, currentValue: 6350, targetAllocation: 25 },
        { id: 'demo-3', name: 'Bitcoin & Ethereum', type: 'Crypto', investedAmount: 3444, currentValue: 3810, targetAllocation: 15 }
      ];
    }
    return [];
  }, [financialData?.investments, user?.isDemo]);

  const studiedStorageKey = useMemo(() => getStudiedResourcesKey(user), [
    user?.id,
    user?.email,
    user?.isDemo,
    user?.userType
  ]);

  const [studiedResources, setStudiedResources] = useState(() => {
    try {
      if (typeof localStorage === 'undefined') return user?.isDemo ? ['res-1'] : [];
      const saved = localStorage.getItem(studiedStorageKey);
      if (saved) return JSON.parse(saved);
      return user?.isDemo ? ['res-1'] : [];
    } catch (e) {
      return user?.isDemo ? ['res-1'] : [];
    }
  });

  // Sync studiedResources when active user changes
  useEffect(() => {
    try {
      if (typeof localStorage === 'undefined') return;
      const saved = localStorage.getItem(studiedStorageKey);
      if (saved) {
        setStudiedResources(JSON.parse(saved));
      } else {
        setStudiedResources(user?.isDemo ? ['res-1'] : []);
      }
    } catch (e) {
      setStudiedResources(user?.isDemo ? ['res-1'] : []);
    }
  }, [studiedStorageKey, user?.isDemo]);

  const handleToggleResourceStudied = (resId) => {
    setStudiedResources((prev) => {
      const next = prev.includes(resId)
        ? prev.filter((id) => id !== resId)
        : [...prev, resId];
      try {
        localStorage.setItem(studiedStorageKey, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const openManageModal = (tab = 'investments') => {
    setModalInitialTab(tab);
    setIsModalOpen(true);
  };

  const studiedCount = studiedResources.length;
  const totalResourcesCount = financialKnowledgeResources?.length || 12;

  const hasGoals = Array.isArray(goals) && goals.length > 0;

  return (
    <div className="dashboard-wrapper">
      <div className="dash-header-row">
        <div>
          <span className="eyebrow">STUDENT WEALTH PORTAL</span>
          <h1 className="page-title">
            Welcome back, {displayName}
          </h1>
          <p className="page-subtitle">
            Track your investments, monitor target allocation drift, and build long-term financial knowledge.
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
            Manage Portfolio
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
            <strong style={{ color: 'var(--text)', fontSize: '13px' }}>Profile Information Missing: </strong>
            <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
              {missingFields.map(m => m.label).join(', ')}. Set these in Settings to calculate your personal Savings Rate and automated rebalancing alerts.
            </span>
          </div>
          <Link to="/settings?tab=financial" className="btn btn-outline btn-small" style={{ fontSize: '12px' }}>
            Configure in Settings →
          </Link>
        </div>
      )}

      <div className="dash-metrics-grid">
        <PortfolioCard
          title="Total Portfolio Value"
          value={portfolioValue}
          change={performance !== 'No data yet' ? performance : null}
          isPositive={isPositive}
          subtitle="Calculated across all connected holdings"
        />

        <PortfolioCard
          title="Monthly Investment Pace"
          value={monthlySavings}
          change={savingsRate?.isCalculated ? `${savingsRate.formatted} Savings Rate` : (monthlySavings !== 'Not provided' ? 'Active Pace' : 'Not Set')}
          isPositive={monthlySavings !== 'Not provided'}
          subtitle={savingsRate?.isCalculated ? `Savings Rate of Monthly Income` : 'Systematic monthly capital addition'}
        />

        <PortfolioCard
          title="Allocation Drift"
          value={allocationDrift}
          change={driftConfigured ? 'Calculated' : 'Unconfigured'}
          isPositive={driftConfigured}
          subtitle={driftConfigured ? 'Max target deviation limit: 5.0%' : 'Set targets to track drift'}
        />

        <PortfolioCard
          title="Curriculum Mastery"
          value={`${studiedCount} of ${totalResourcesCount} Studied`}
          change={studiedCount === totalResourcesCount ? '100% Completed' : `${Math.round((studiedCount / (totalResourcesCount || 1)) * 100)}% Progress`}
          isPositive={studiedCount > 0}
          subtitle="Verified financial curriculums"
        />
      </div>

      <div className="grid-2col">
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Portfolio Performance</h3>
              <span className="panel-subtitle">Asset growth trajectory</span>
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
          title="Student Asset Allocation Donut"
          subtitle="Current vs target distribution with drift alerts"
        />
      </div>

      <div className="grid-2col">
        <AllocationCard
          allocations={allocations}
          drift={allocationDrift}
          insight={insightMessage}
          title="Student Asset Allocation Breakdown"
        />

        {/* Goal Tracker */}
        <div className="panel-card">
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 className="panel-title">Financial Goal Milestones</h3>
              <span className="panel-subtitle">Target savings and investment checkpoints</span>
            </div>
            <button
              type="button"
              className="btn btn-outline btn-small"
              onClick={() => openManageModal('goals')}
            >
              + Add / Edit Goals
            </button>
          </div>

          {!hasGoals ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>
              <p style={{ margin: 0, marginBottom: '12px' }}>No financial goals added yet.</p>
              <button
                type="button"
                className="btn btn-primary btn-small"
                onClick={() => openManageModal('goals')}
              >
                + Set Up Your First Goal
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {goals.map((g, idx) => {
                const current = Number(g.current) || 0;
                const target = Number(g.target) || 1;
                const pct = Math.min(100, Math.round((current / target) * 100));
                return (
                  <div key={g.id || idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <strong>{g.title}</strong>
                      <span>
                        {g.unit || '₹'}{current.toLocaleString('en-IN')} / {g.unit || '₹'}{target.toLocaleString('en-IN')} ({pct}%)
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
          )}
        </div>
      </div>

      {/* Portfolio Rebalancing Engine */}
      <RebalanceEngine
        investments={activeInvestments}
        monthlySavings={monthlySavings}
        onOpenManageModal={openManageModal}
      />

      {/* Financial & Trading Knowledge Hub */}
      <EducationCard
        resources={financialKnowledgeResources}
        studiedResources={studiedResources}
        onToggleResourceStudied={handleToggleResourceStudied}
        user={user}
      />

      {/* AI Assistant (Rendered once at the bottom) */}
      <AssistantCard
        suggestions={assistantSuggestions}
        title="FinSight Student Assistant"
        role="student"
      />

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
