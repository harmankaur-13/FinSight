import React, { useState, useMemo } from 'react';
import { formatHumanName } from '../../hooks/useFinanceData';
import PortfolioCard from '../../components/PortfolioCard';
import PortfolioChart from '../../components/PortfolioChart';
import AllocationCard from '../../components/AllocationCard';
import AllocationDonut from '../../components/AllocationDonut';
import RebalanceEngine from '../../components/RebalanceEngine';
import AssistantCard from '../../components/AssistantCard';
import EducationCard from '../../components/EducationCard';
import ManagePortfolioModal from '../../components/ManagePortfolioModal';

const STORAGE_KEY_COMPLETED_MODULES = 'finsight_completed_modules';
const STORAGE_KEY_WATCHED_VIDEOS = 'finsight_watched_videos';

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
  onUpdateMonthlySavings
}) {
  const {
    portfolioValue,
    portfolioRawValue,
    performance,
    isPositive,
    monthlySavings,
    allocationDrift,
    driftConfigured,
    insightMessage,
    allocations,
    goals = [],
    educationalModules,
    videoTutorials,
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

  const [completedModules, setCompletedModules] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLETED_MODULES);
      return saved ? JSON.parse(saved) : ['edu-1'];
    } catch (e) {
      return ['edu-1'];
    }
  });

  const [watchedVideos, setWatchedVideos] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WATCHED_VIDEOS);
      return saved ? JSON.parse(saved) : ['yt-1'];
    } catch (e) {
      return ['yt-1'];
    }
  });

  const handleToggleModuleComplete = (modId) => {
    setCompletedModules((prev) => {
      const next = prev.includes(modId)
        ? prev.filter((id) => id !== modId)
        : [...prev, modId];
      try {
        localStorage.setItem(STORAGE_KEY_COMPLETED_MODULES, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleToggleVideoWatched = (vidId) => {
    setWatchedVideos((prev) => {
      const next = prev.includes(vidId)
        ? prev.filter((id) => id !== vidId)
        : [...prev, vidId];
      try {
        localStorage.setItem(STORAGE_KEY_WATCHED_VIDEOS, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const openManageModal = (tab = 'investments') => {
    setModalInitialTab(tab);
    setIsModalOpen(true);
  };

  const completedCount = completedModules.length;
  const totalCount = educationalModules?.length || 4;

  const hasGoals = Array.isArray(goals) && goals.length > 0;

  return (
    <div className="dashboard-wrapper">
      <div className="dash-header-row">
        <div>
          <span className="eyebrow eyebrow-gold">STUDENT WEALTH PORTAL</span>
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
          change={monthlySavings !== 'Not provided' ? 'Active Pace' : 'Not Set'}
          isPositive={monthlySavings !== 'Not provided'}
          subtitle="Systematic monthly capital addition"
        />

        <PortfolioCard
          title="Allocation Drift"
          value={allocationDrift}
          change={driftConfigured ? 'Calculated' : 'Unconfigured'}
          isPositive={driftConfigured}
          subtitle={driftConfigured ? 'Max target deviation limit: 5.0%' : 'Set targets to track drift'}
        />

        <PortfolioCard
          title="Active Learning Streak"
          value={`${completedCount} of ${totalCount} Done`}
          change={completedCount === totalCount ? '100% Completed' : `${Math.round((completedCount / totalCount) * 100)}% Progress`}
          isPositive={completedCount > 0}
          subtitle="Financial mastery milestones"
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
          <PortfolioChart height={240} portfolioValue={portfolioRawValue} />
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

        {/* AI Assistant */}
        <AssistantCard
          suggestions={assistantSuggestions}
          title="FinSight Student Assistant"
          role="student"
        />
      </div>

      {/* Portfolio Rebalancing Engine */}
      <RebalanceEngine
        investments={activeInvestments}
        monthlySavings={monthlySavings}
        onOpenManageModal={openManageModal}
      />

      <div className="grid-2col">
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
        completedModules={completedModules}
        onToggleModuleComplete={handleToggleModuleComplete}
        watchedVideos={watchedVideos}
        onToggleVideoWatched={handleToggleVideoWatched}
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
