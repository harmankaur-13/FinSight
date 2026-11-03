import React, { useState, useEffect, useMemo } from 'react';
import Toast from './Toast';

const STORAGE_KEY_STUDIED_RESOURCES = 'finsight_studied_resources';

const TOPIC_DISCIPLINES = [
  {
    id: 'Trading & Technical Analysis',
    shortLabel: 'Technical Analysis',
    desc: 'Chart patterns, price action, volume confirmation, and momentum indicators.'
  },
  {
    id: 'Fundamental Valuation',
    shortLabel: 'Fundamental Valuation',
    desc: 'Balance sheets, cash flows, valuation multiples (P/E, ROCE), and corporate screening.'
  },
  {
    id: 'Stock Markets & Exchanges',
    shortLabel: 'Markets & Orders',
    desc: 'Order types, market depth, bid-ask spreads, and T+1 exchange settlement mechanics.'
  },
  {
    id: 'Investing & Asset Allocation',
    shortLabel: 'Asset Allocation',
    desc: 'Low-cost index compounding, risk-adjusted returns (Sharpe ratio), and drift rebalancing.'
  },
  {
    id: 'Risk & Trading Psychology',
    shortLabel: 'Risk & Mindset',
    desc: 'The 1-2% account risk rule, position sizing formulas, drawdown math, and discipline.'
  },
  {
    id: 'Regulations & Investor Protection',
    shortLabel: 'Regulations',
    desc: 'Statutory investor rights, Demat safety, SCORES grievance redressal, and scam defense.'
  },
  {
    id: 'Macroeconomics & Central Banking',
    shortLabel: 'Macroeconomics',
    desc: 'Monetary policy transmission, repo rates, inflation drivers, and sovereign debt markets.'
  }
];

export default function EducationCard({
  resources = [],
  studiedResources = null,
  onToggleResourceStudied = null
}) {
  // Local state fallbacks if not controlled by parent
  const [localStudiedResources, setLocalStudiedResources] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDIED_RESOURCES);
      return saved ? JSON.parse(saved) : ['res-1'];
    } catch (e) {
      return ['res-1'];
    }
  });

  const activeStudied = studiedResources || localStudiedResources;

  // Search and Topic filter state — defaults to focused first topic for clean, unbloated view
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('Trading & Technical Analysis');

  // Active Resource Syllabus Modal
  const [activeResourceModal, setActiveResourceModal] = useState(null);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2400);
  };

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveResourceModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleStudied = (resId) => {
    if (onToggleResourceStudied) {
      onToggleResourceStudied(resId);
    } else {
      setLocalStudiedResources((prev) => {
        const next = prev.includes(resId)
          ? prev.filter((id) => id !== resId)
          : [...prev, resId];
        try {
          localStorage.setItem(STORAGE_KEY_STUDIED_RESOURCES, JSON.stringify(next));
        } catch (e) {}
        return next;
      });
    }
    const isNowStudied = !activeStudied.includes(resId);
    triggerToast(isNowStudied ? 'Curriculum marked as studied!' : 'Removed from studied list.');
  };

  // Topic counts
  const topicCounts = useMemo(() => {
    const counts = { All: resources.length };
    TOPIC_DISCIPLINES.forEach((disc) => {
      counts[disc.id] = resources.filter((r) => r.topic === disc.id).length;
    });
    return counts;
  }, [resources]);

  // Current active discipline object
  const currentDiscipline = useMemo(() => {
    return TOPIC_DISCIPLINES.find((d) => d.id === selectedTopic);
  }, [selectedTopic]);

  // Filtered resources
  const displayedResources = useMemo(() => {
    // When searching, search across all resources
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return resources.filter((item) => {
        const inTitle = item.title?.toLowerCase().includes(q);
        const inPlatform = item.platform?.toLowerCase().includes(q);
        const inSummary = item.summary?.toLowerCase().includes(q);
        const inTopic = item.topic?.toLowerCase().includes(q);
        const inDomain = item.domain?.toLowerCase().includes(q);
        const inTakeaways = item.takeaways?.some((t) => t.toLowerCase().includes(q));

        return inTitle || inPlatform || inSummary || inTopic || inDomain || inTakeaways;
      });
    }

    if (selectedTopic === 'All') {
      return resources;
    }

    return resources.filter((item) => item.topic === selectedTopic);
  }, [resources, selectedTopic, searchTerm]);

  const completionPct = resources.length > 0
    ? Math.round((activeStudied.length / resources.length) * 100)
    : 0;

  return (
    <div className="panel-card" id="trading-knowledge-hub">
      {/* Panel Header */}
      <div className="panel-header">
        <div>
          <h3 className="panel-title">Financial & Trading Knowledge Hub</h3>
          <span className="panel-subtitle">
            Curated institutional platforms, official exchange portals, and market analysis tools
          </span>
        </div>
        <div className="hub-header-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{activeStudied.length} of {resources.length} Studied ({completionPct}%)</span>
        </div>
      </div>

      {/* Clean Management Toolbar */}
      <div className="hub-toolbar">
        {/* Search Field */}
        <div className="hub-search-wrapper">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="hub-search-icon">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search platforms, topics, or concepts (e.g. Technical Analysis, Screener, SEBI, Candlestick)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="hub-search-input"
            aria-label="Search financial resources"
          />
          {searchTerm && (
            <button
              type="button"
              className="hub-search-clear"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>

        {/* Clean Topic Navigation Pills */}
        <div className="hub-topic-bar" role="tablist" aria-label="Topic Categories">
          {TOPIC_DISCIPLINES.map((disc) => {
            const count = topicCounts[disc.id] || 0;
            const isActive = !searchTerm && selectedTopic === disc.id;
            return (
              <button
                key={disc.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`hub-topic-pill ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTopic(disc.id);
                }}
              >
                <span>{disc.shortLabel}</span>
                <span className="hub-pill-count">{count}</span>
              </button>
            );
          })}

          <button
            type="button"
            role="tab"
            aria-selected={!searchTerm && selectedTopic === 'All'}
            className={`hub-topic-pill ${!searchTerm && selectedTopic === 'All' ? 'active' : ''}`}
            onClick={() => {
              setSearchTerm('');
              setSelectedTopic('All');
            }}
          >
            <span>All Disciplines</span>
            <span className="hub-pill-count">{topicCounts.All || 0}</span>
          </button>
        </div>
      </div>

      {/* Active Discipline Context Banner (When not searching) */}
      {!searchTerm && currentDiscipline && selectedTopic !== 'All' && (
        <div className="hub-discipline-banner">
          <div className="hub-banner-title">
            <span>{currentDiscipline.id}</span>
            <span className="hub-banner-count">({displayedResources.length} Curricula)</span>
          </div>
          <span className="hub-banner-desc">{currentDiscipline.desc}</span>
        </div>
      )}

      {/* Search Result Banner */}
      {searchTerm && (
        <div className="hub-discipline-banner">
          <div className="hub-banner-title">
            <span>Search Results for "{searchTerm}"</span>
            <span className="hub-banner-count">({displayedResources.length} found)</span>
          </div>
          <button
            type="button"
            className="hub-banner-clear-link"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Curated Resources Grid (Clean, unbloated, compact cards) */}
      {displayedResources.length === 0 ? (
        <div className="hub-empty-state">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 8px', opacity: 0.4 }}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <h4 style={{ margin: '0 0 4px', fontSize: '14.5px' }}>No curricula match your search</h4>
          <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)' }}>
            Try a different search term or select one of the discipline tabs above.
          </p>
          <button
            type="button"
            className="btn btn-outline btn-small"
            onClick={() => {
              setSearchTerm('');
              setSelectedTopic('Trading & Technical Analysis');
            }}
            style={{ marginTop: '12px' }}
          >
            Back to Technical Analysis
          </button>
        </div>
      ) : (
        <div className="hub-grid">
          {displayedResources.map((res) => {
            const isStudied = activeStudied.includes(res.id);
            return (
              <div key={res.id} className={`hub-card ${isStudied ? 'studied' : ''}`}>
                {/* Top Row: Platform • Domain & Studied Status */}
                <div className="hub-card-header">
                  <div className="hub-card-source">
                    <span className="hub-platform-name">{res.platform}</span>
                    <span className="hub-meta-sep">•</span>
                    <span className="hub-domain-link">{res.domain}</span>
                  </div>

                  <div className="hub-card-tags">
                    <span className="hub-level-badge">{res.difficulty}</span>
                    {isStudied && (
                      <span className="hub-studied-badge">
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Studied
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h4 className="hub-card-title">{res.title}</h4>

                {/* Crisp 1-sentence value hook */}
                <p className="hub-card-summary">{res.summary}</p>

                {/* Footer Bar: Format on left, Actions on right */}
                <div className="hub-card-footer">
                  <span className="hub-format-text">{res.format}</span>

                  <div className="hub-card-actions">
                    <button
                      type="button"
                      className={`hub-study-btn ${isStudied ? 'studied' : ''}`}
                      onClick={() => handleToggleStudied(res.id)}
                      title={isStudied ? 'Remove from studied' : 'Mark as studied'}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{isStudied ? 'Studied' : 'Mark Studied'}</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-ghost btn-small hub-syllabus-btn"
                      onClick={() => setActiveResourceModal(res)}
                      title="View full curriculum breakdown & study takeaways"
                    >
                      Syllabus Details
                    </button>

                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-small hub-visit-btn"
                      title={`Open ${res.platform} official curriculum`}
                    >
                      <span>Open Portal</span>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CURRICULUM SYLLABUS MODAL (Houses all comprehensive takeaways cleanly) */}
      {activeResourceModal && (
        <div className="modal-backdrop" onClick={() => setActiveResourceModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="hub-level-badge" style={{ background: 'var(--green-light)', color: 'var(--green-dark)' }}>
                  {activeResourceModal.platform}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  {activeResourceModal.domain}
                </span>
                {activeStudied.includes(activeResourceModal.id) && (
                  <span className="hub-studied-badge">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginRight: '3px' }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Studied
                  </span>
                )}
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-small"
                onClick={() => setActiveResourceModal(null)}
                style={{ padding: '6px' }}
                aria-label="Close modal"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
                <span className="hub-topic-badge">{activeResourceModal.topic}</span>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>•</span>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{activeResourceModal.difficulty}</span>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>•</span>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{activeResourceModal.format}</span>
              </div>

              <h2 style={{ fontSize: '20px', lineHeight: 1.35, marginBottom: '12px', color: 'var(--text)' }}>
                {activeResourceModal.title}
              </h2>

              <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '20px' }}>
                {activeResourceModal.summary}
              </p>

              {activeResourceModal.takeaways && (
                <div className="checklist-box" style={{ margin: '0 0 20px 0' }}>
                  <h4 style={{ fontSize: '14px', color: 'var(--green-dark)', margin: 0, marginBottom: '10px' }}>
                    Syllabus Mastery Takeaways
                  </h4>
                  {activeResourceModal.takeaways.map((note, idx) => (
                    <div key={idx} className="checklist-item">
                      <span className="checklist-icon" style={{ color: 'var(--accent-text)' }}>›</span>
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ background: 'var(--surface-2)', borderLeft: '3px solid var(--green)', padding: '12px 14px', borderRadius: '4px', fontSize: '12px', lineHeight: 1.55, color: 'var(--muted)' }}>
                <strong>Student Practice Tip:</strong> Practice these concepts alongside live charts or screening tools like Screener.in before allocating capital to verify price action and fundamentals in real market conditions.
              </div>
            </div>

            <div className="modal-footer">
              <a
                href={activeResourceModal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-small"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <span>Launch {activeResourceModal.platform} Official Site</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </a>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  className={activeStudied.includes(activeResourceModal.id) ? "btn btn-outline btn-small" : "btn btn-ghost btn-small"}
                  onClick={() => handleToggleStudied(activeResourceModal.id)}
                >
                  {activeStudied.includes(activeResourceModal.id) ? 'Marked as Studied' : 'Mark as Studied'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-small"
                  onClick={() => setActiveResourceModal(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toast message={toastMsg} show={showToast} />
    </div>
  );
}
