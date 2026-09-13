import React, { useState, useEffect } from 'react';
import Toast from './Toast';

const STORAGE_KEY_COMPLETED_MODULES = 'finsight_completed_modules';
const STORAGE_KEY_WATCHED_VIDEOS = 'finsight_watched_videos';

export default function EducationCard({
  modules = [],
  videos = [],
  completedModules = null,
  onToggleModuleComplete = null,
  watchedVideos = null,
  onToggleVideoWatched = null
}) {
  // Local state fallbacks if not controlled by parent
  const [localCompletedModules, setLocalCompletedModules] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLETED_MODULES);
      return saved ? JSON.parse(saved) : ['edu-1'];
    } catch (e) {
      return ['edu-1'];
    }
  });

  const [localWatchedVideos, setLocalWatchedVideos] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WATCHED_VIDEOS);
      return saved ? JSON.parse(saved) : ['yt-1'];
    } catch (e) {
      return ['yt-1'];
    }
  });

  const activeCompleted = completedModules || localCompletedModules;
  const activeWatched = watchedVideos || localWatchedVideos;

  // Active Modals
  const [activeModule, setActiveModule] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  // Quiz state for active module
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState(null);

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
        setActiveModule(null);
        setActiveVideo(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleModuleClick = (mod) => {
    setActiveModule(mod);
    setSelectedQuizAnswer(null);
  };

  const handleToggleComplete = (modId) => {
    if (onToggleModuleComplete) {
      onToggleModuleComplete(modId);
    } else {
      setLocalCompletedModules((prev) => {
        const next = prev.includes(modId)
          ? prev.filter((id) => id !== modId)
          : [...prev, modId];
        try {
          localStorage.setItem(STORAGE_KEY_COMPLETED_MODULES, JSON.stringify(next));
        } catch (e) {}
        return next;
      });
    }
    const isNowDone = !activeCompleted.includes(modId);
    triggerToast(isNowDone ? '🎉 Module completed! Streak updated.' : 'Module marked as in-progress.');
  };

  const handleToggleWatched = (vidId) => {
    if (onToggleVideoWatched) {
      onToggleVideoWatched(vidId);
    } else {
      setLocalWatchedVideos((prev) => {
        const next = prev.includes(vidId)
          ? prev.filter((id) => id !== vidId)
          : [...prev, vidId];
        try {
          localStorage.setItem(STORAGE_KEY_WATCHED_VIDEOS, JSON.stringify(next));
        } catch (e) {}
        return next;
      });
    }
    const isNowDone = !activeWatched.includes(vidId);
    triggerToast(isNowDone ? '✓ Video marked as watched!' : 'Video marked as unwatched.');
  };

  const currentModuleIndex = modules.findIndex((m) => m.id === activeModule?.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Financial Learning Modules */}
      <div className="panel-card">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">Financial Learning Modules</h3>
            <span className="panel-subtitle">Foundational concepts in modern personal finance</span>
          </div>
          <span className="gain" style={{ fontSize: '11px' }}>
            {activeCompleted.length} of {modules.length} Completed
          </span>
        </div>

        <div className="edu-grid">
          {modules.map((m) => {
            const isCompleted = activeCompleted.includes(m.id);
            return (
              <div
                key={m.id}
                className="edu-card"
                onClick={() => handleModuleClick(m)}
                title={`Read ${m.title}`}
              >
                <div className="edu-thumb">
                  {m.image && (
                    <img src={m.image} alt={m.title} className="edu-thumb-img" />
                  )}
                  <div className="edu-thumb-overlay" />
                  <div style={{ display: 'flex', gap: '6px', position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
                    <span className="edu-tag" style={{ position: 'static' }}>{m.category}</span>
                    {isCompleted && (
                      <span className="badge-completed">✓ Completed</span>
                    )}
                  </div>
                  <span className="edu-duration">{m.readTime}</span>
                </div>
                <div className="edu-content">
                  <h4>{m.title}</h4>
                  <p>{m.summary}</p>
                  <div className="edu-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{isCompleted ? 'Review Module →' : 'Start Learning →'}</span>
                    {m.difficulty && (
                      <span style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase' }}>
                        {m.difficulty}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Curated Video Tutorials */}
      <div className="panel-card">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">Curated Video Tutorials</h3>
            <span className="panel-subtitle">Hand-picked video walk-throughs for practical wealth management</span>
          </div>
          <span className="gain" style={{ fontSize: '11px' }}>
            {activeWatched.length} of {videos.length} Watched
          </span>
        </div>

        <div className="edu-grid">
          {videos.map((v) => {
            const isWatched = activeWatched.includes(v.id);
            return (
              <div
                key={v.id}
                className="edu-card"
                onClick={() => setActiveVideo(v)}
                title={`Watch ${v.title}`}
              >
                <div className="edu-thumb">
                  {v.image && (
                    <img src={v.image} alt={v.title} className="edu-thumb-img" />
                  )}
                  <div className="edu-thumb-overlay" />
                  <div className="play-btn-overlay">
                    <div className="play-icon-circle">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
                    <span className="edu-tag" style={{ position: 'static' }}>{v.topic}</span>
                    {isWatched && (
                      <span className="badge-watched">✓ Watched</span>
                    )}
                  </div>
                  <span className="edu-duration">{v.duration}</span>
                </div>
                <div className="edu-content">
                  <h4>{v.title}</h4>
                  <p style={{ margin: 0, color: 'var(--muted)', fontSize: '12px' }}>
                    Source: {v.channel}
                  </p>
                  <div className="edu-footer" style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{isWatched ? 'Watch Again →' : 'Watch Video →'}</span>
                    <span style={{ fontSize: '10px', color: 'var(--muted)' }}>HD Tutorial</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Module Reader Modal */}
      {activeModule && (
        <div className="modal-backdrop" onClick={() => setActiveModule(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="edu-tag" style={{ position: 'static', background: 'var(--green-light)', color: 'var(--green-dark)' }}>
                  {activeModule.category}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  {activeModule.readTime}
                </span>
                {activeCompleted.includes(activeModule.id) && (
                  <span className="badge-completed">✓ Completed</span>
                )}
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-small"
                onClick={() => setActiveModule(null)}
                style={{ padding: '6px' }}
                aria-label="Close reader"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              {activeModule.image && (
                <div className="modal-hero-banner">
                  <img src={activeModule.image} alt={activeModule.title} />
                </div>
              )}

              <h2 style={{ fontSize: '24px', lineHeight: 1.3, marginBottom: '16px', color: 'var(--text)' }}>
                {activeModule.title}
              </h2>

              {activeModule.heroQuote && (
                <div className="hero-quote-box">
                  "{activeModule.heroQuote}"
                </div>
              )}

              {activeModule.sections?.map((sec, idx) => (
                <div key={idx} className="lesson-section">
                  <h3>{sec.heading}</h3>
                  <p>{sec.body}</p>
                </div>
              ))}

              {activeModule.actionSteps && (
                <div className="checklist-box">
                  <h4 style={{ fontSize: '15px', color: 'var(--green-dark)', margin: 0, marginBottom: '8px' }}>
                    Student Action Checklist
                  </h4>
                  {activeModule.actionSteps.map((step, idx) => (
                    <div key={idx} className="checklist-item">
                      <span className="checklist-icon">✓</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeModule.quiz && (
                <div className="quiz-container">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="eyebrow" style={{ margin: 0 }}>KNOWLEDGE CHECK</span>
                    <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Quick Concept Test</span>
                  </div>
                  <h4 style={{ fontSize: '14.5px', marginBottom: '14px', lineHeight: 1.4 }}>
                    {activeModule.quiz.question}
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {activeModule.quiz.options.map((opt, optIdx) => {
                      const isSelected = selectedQuizAnswer === optIdx;
                      const hasAnswered = selectedQuizAnswer !== null;
                      const isCorrect = optIdx === activeModule.quiz.correctIndex;

                      let optClass = 'quiz-option';
                      if (hasAnswered) {
                        if (isCorrect) optClass += ' correct';
                        else if (isSelected) optClass += ' incorrect';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          className={optClass}
                          onClick={() => setSelectedQuizAnswer(optIdx)}
                        >
                          <span style={{ fontWeight: 700, minWidth: '20px' }}>
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span style={{ flex: 1 }}>{opt}</span>
                          {hasAnswered && isCorrect && <span>✓</span>}
                          {hasAnswered && isSelected && !isCorrect && <span>✗</span>}
                        </button>
                      );
                    })}
                  </div>

                  {selectedQuizAnswer !== null && (
                    <div
                      style={{
                        marginTop: '14px',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        lineHeight: 1.5,
                        background: selectedQuizAnswer === activeModule.quiz.correctIndex ? 'rgba(39, 102, 83, 0.1)' : 'rgba(217, 83, 79, 0.1)',
                        border: `1px solid ${selectedQuizAnswer === activeModule.quiz.correctIndex ? 'rgba(39, 102, 83, 0.3)' : 'rgba(217, 83, 79, 0.3)'}`,
                        color: 'var(--text)'
                      }}
                    >
                      <strong>{selectedQuizAnswer === activeModule.quiz.correctIndex ? 'Correct!' : 'Explanation:'}</strong>{' '}
                      {activeModule.quiz.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-small"
                  disabled={currentModuleIndex <= 0}
                  onClick={() => {
                    if (currentModuleIndex > 0) {
                      handleModuleClick(modules[currentModuleIndex - 1]);
                    }
                  }}
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-small"
                  disabled={currentModuleIndex >= modules.length - 1}
                  onClick={() => {
                    if (currentModuleIndex < modules.length - 1) {
                      handleModuleClick(modules[currentModuleIndex + 1]);
                    }
                  }}
                >
                  Next →
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  type="button"
                  className={activeCompleted.includes(activeModule.id) ? "btn btn-outline btn-small" : "btn btn-primary btn-small"}
                  onClick={() => handleToggleComplete(activeModule.id)}
                >
                  {activeCompleted.includes(activeModule.id) ? '✓ Completed' : 'Mark as Completed'}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-small"
                  onClick={() => setActiveModule(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Video Tutorial Player Modal */}
      {activeVideo && (
        <div className="modal-backdrop" onClick={() => setActiveVideo(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="edu-tag" style={{ position: 'static', background: 'var(--green-light)', color: 'var(--green-dark)' }}>
                  {activeVideo.topic}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  {activeVideo.duration} • {activeVideo.channel}
                </span>
                {activeWatched.includes(activeVideo.id) && (
                  <span className="badge-watched">✓ Watched</span>
                )}
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-small"
                onClick={() => setActiveVideo(null)}
                style={{ padding: '6px' }}
                aria-label="Close player"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              {/* Video Player Embed */}
              <div className="video-player-container">
                <iframe
                  src={activeVideo.embedUrl}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <h2 style={{ fontSize: '20px', lineHeight: 1.35, marginBottom: '8px', color: 'var(--text)' }}>
                {activeVideo.title}
              </h2>

              <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '16px' }}>
                {activeVideo.summary}
              </p>

              {/* Video Chapters */}
              {activeVideo.chapters && (
                <div style={{ marginBottom: '20px' }}>
                  <span className="eyebrow" style={{ fontSize: '10px' }}>LESSON CHAPTERS</span>
                  <div className="chapters-list">
                    {activeVideo.chapters.map((ch, idx) => (
                      <div key={idx} className="chapter-pill">
                        <strong>{ch.time}</strong>
                        <span>{ch.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Notes */}
              {activeVideo.keyNotes && (
                <div className="checklist-box" style={{ margin: 0 }}>
                  <h4 style={{ fontSize: '14.5px', color: 'var(--green-dark)', margin: 0, marginBottom: '8px' }}>
                    Key Study Takeaways
                  </h4>
                  {activeVideo.keyNotes.map((note, idx) => (
                    <div key={idx} className="checklist-item">
                      <span className="checklist-icon" style={{ color: 'var(--gold)' }}>★</span>
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <a
                href={activeVideo.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-small"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                Open on YouTube ↗
              </a>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  type="button"
                  className={activeWatched.includes(activeVideo.id) ? "btn btn-outline btn-small" : "btn btn-primary btn-small"}
                  onClick={() => handleToggleWatched(activeVideo.id)}
                >
                  {activeWatched.includes(activeVideo.id) ? '✓ Watched' : 'Mark as Watched'}
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-small"
                  onClick={() => setActiveVideo(null)}
                >
                  Done Watching
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
