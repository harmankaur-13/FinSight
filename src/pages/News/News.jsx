import React, { useState } from 'react';
import NewsCard from '../../components/NewsCard';
import { NEWS_DATA } from '../../data/mockData';

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeArticle, setActiveArticle] = useState(null);

  const categories = ['All', 'Markets', 'Technology', 'Economy', 'Stocks', 'Crypto', 'Business'];

  const filteredNews = selectedCategory === 'All'
    ? NEWS_DATA
    : NEWS_DATA.filter((item) => item.category === selectedCategory);

  return (
    <div className="container" style={{ padding: '40px 0 90px' }}>
      <div className="page-header">
        <span className="eyebrow eyebrow-gold">FINANCIAL INTELLIGENCE DISPATCH</span>
        <h1 className="page-title">Market & Macro News</h1>
        <p className="page-subtitle">
          Curated institutional insights, central bank monetary updates, and corporate developments with zero distraction.
        </p>
      </div>

      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`cat-tab ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="news-grid">
        {filteredNews.map((article) => (
          <NewsCard
            key={article.id}
            article={article}
            onReadMore={(art) => setActiveArticle(art)}
          />
        ))}
      </div>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(23, 35, 31, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setActiveArticle(null)}
        >
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '36px',
              maxWidth: '650px',
              width: '100%',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span className="news-tag">{activeArticle.category}</span>
              <button
                type="button"
                className="btn btn-ghost btn-small"
                onClick={() => setActiveArticle(null)}
                style={{ padding: '6px' }}
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <h2 style={{ fontSize: '24px', lineHeight: 1.3, marginBottom: '14px' }}>
              {activeArticle.headline}
            </h2>

            <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '20px' }}>
              By {activeArticle.source} • {activeArticle.date} • {activeArticle.readTime}
            </div>

            <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--text)', marginBottom: '20px' }}>
              {activeArticle.summary}
            </p>

            <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--muted)', background: 'var(--bg)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <strong>Market Takeaway:</strong> Institutional investors are factoring this development into risk models. Continue monitoring asset allocation alignment against your target parameters.
            </p>

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setActiveArticle(null)}
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
