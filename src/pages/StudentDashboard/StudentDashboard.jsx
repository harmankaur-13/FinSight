import React, { useState } from 'react';
import { formatHumanName } from '../../hooks/useFinanceData';
import PortfolioCard from '../../components/PortfolioCard';
import PortfolioChart from '../../components/PortfolioChart';
import AllocationCard from '../../components/AllocationCard';
import AssistantCard from '../../components/AssistantCard';
import EducationCard from '../../components/EducationCard';

const STORAGE_KEY_COMPLETED_MODULES = 'finsight_completed_modules';
const STORAGE_KEY_WATCHED_VIDEOS = 'finsight_watched_videos';

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

  const completedCount = completedModules.length;
  const totalCount = educationalModules?.length || 4;

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
        completedModules={completedModules}
        onToggleModuleComplete={handleToggleModuleComplete}
        watchedVideos={watchedVideos}
        onToggleVideoWatched={handleToggleVideoWatched}
      />
    </div>
  );
}
