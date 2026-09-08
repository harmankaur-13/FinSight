import React from 'react';

export default function EducationCard({ modules = [], videos = [] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="panel-card">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">Financial Learning Modules</h3>
            <span className="panel-subtitle">Foundational concepts in modern personal finance</span>
          </div>
        </div>

        <div className="edu-grid">
          {modules.map((m) => (
            <div key={m.id} className="edu-card">
              <div className="edu-thumb">
                <span className="edu-tag">{m.category}</span>
                <span className="edu-duration">{m.readTime}</span>
              </div>
              <div className="edu-content">
                <h4>{m.title}</h4>
                <p>{m.summary}</p>
                <div className="edu-footer">Start Learning →</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel-card">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">Curated Video Tutorials</h3>
            <span className="panel-subtitle">Hand-picked video walk-throughs for practical wealth management</span>
          </div>
        </div>

        <div className="edu-grid">
          {videos.map((v) => (
            <div key={v.id} className="edu-card">
              <div
                className="edu-thumb"
                style={{ background: 'linear-gradient(135deg, #17231f, #276653)' }}
              >
                <span className="edu-tag">{v.topic}</span>
                <span className="edu-duration">{v.duration}</span>
              </div>
              <div className="edu-content">
                <h4>{v.title}</h4>
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: '12px' }}>
                  Source: {v.channel}
                </p>
                <div className="edu-footer" style={{ marginTop: '12px' }}>
                  Watch Video →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
