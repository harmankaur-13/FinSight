import React, { useState, useEffect } from 'react';
import NewsCard from '../../components/NewsCard';
import { NEWS_DATA } from '../../data/mockData';
import { fetchMarketNews } from '../../services/newsApi';

export default function News() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeArticle, setActiveArticle] = useState(null);

  const categories = ['All', 'Markets', 'Technology', 'Economy', 'Stocks', 'Crypto', 'Business'];

  // Fetch articles on component mount with cleanup to prevent stale updates on unmount
  useEffect(() => {
    let isMounted = true;

    async function loadNews() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const liveArticles = await fetchMarketNews('general');
        if (!isMounted) return;

        setArticles(liveArticles);
        setIsLive(true);
      } catch (err) {
        if (!isMounted) return;

        // Fall back gracefully to curated sample/archived data
        setArticles(NEWS_DATA);
        setIsLive(false);

        // Sanitize error message to prevent exposing internal keys or raw URLs
        const safeMsg = err && typeof err.message === 'string'
          ? err.message.replace(/token=[^&\s]+/gi, 'token=***')
          : 'Live market feed is currently offline.';
        setErrorMessage(safeMsg);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadNews();

    return () => {
      isMounted = false;
    };
  }, []);

  // Safe, case-insensitive helper for category matching
  const matchesCategory = (itemCategory, targetCategory) => {
    if (!itemCategory || !targetCategory) return false;
    return itemCategory.trim().toLowerCase() === targetCategory.trim().toLowerCase();
  };

  // Filter in-memory articles without issuing repeated network requests on tab change
  const filteredNews = selectedCategory === 'All'
    ? articles
    : articles.filter((item) => matchesCategory(item.category, selectedCategory));

  // If live feed has 0 articles for selected category, find matching sample articles as reference
  const matchingSampleFallback = (isLive && selectedCategory !== 'All' && filteredNews.length === 0)
    ? NEWS_DATA.filter((item) => matchesCategory(item.category, selectedCategory))
    : [];

  return (
    <div className="container" style={{ padding: '40px 0 90px' }}>
      <div className="page-header">
        <span className="eyebrow">FINANCIAL INTELLIGENCE DISPATCH</span>
        <h1 className="page-title">Market & Macro News</h1>
        <p className="page-subtitle">
          Curated institutional insights, central bank monetary updates, and corporate developments with zero distraction.
        </p>
      </div>

      {/* Connection & Status Banner */}
      {!isLoading && (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '10px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            fontSize: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isLive ? 'var(--green)' : 'var(--gold)',
                display: 'inline-block'
              }}
            />
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>
              {isLive ? 'Live Market Feed' : 'Archived Sample Data'}
            </span>
            <span style={{ color: 'var(--muted)' }}>•</span>
            <span style={{ color: 'var(--muted)' }}>
              {isLive
                ? 'Market news via Finnhub API'
                : (errorMessage || 'Live feed unavailable. Displaying curated sample articles.')}
            </span>
          </div>

          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: isLive ? 'var(--green-dark)' : 'var(--muted)',
              background: isLive ? 'var(--green-light)' : 'var(--surface-2)',
              padding: '2px 8px',
              borderRadius: '4px'
            }}
          >
            {isLive ? 'Live API' : 'Sample Dispatch'}
          </span>
        </div>
      )}

      {/* Category Tabs */}
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

      {/* Loading Skeleton Grid */}
      {isLoading && (
        <div className="news-grid" aria-busy="true" aria-label="Loading news">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={`skeleton-${n}`}
              className="news-card"
              style={{ minHeight: '220px', opacity: 0.7 }}
            >
              <div>
                <div className="news-meta">
                  <span
                    style={{
                      display: 'inline-block',
                      width: '60px',
                      height: '14px',
                      borderRadius: '4px',
                      background: 'var(--surface-2)'
                    }}
                  />
                  <span
                    style={{
                      display: 'inline-block',
                      width: '45px',
                      height: '12px',
                      borderRadius: '4px',
                      background: 'var(--surface-2)'
                    }}
                  />
                </div>
                <div
                  style={{
                    width: '85%',
                    height: '18px',
                    borderRadius: '4px',
                    background: 'var(--surface-2)',
                    marginBottom: '10px'
                  }}
                />
                <div
                  style={{
                    width: '60%',
                    height: '18px',
                    borderRadius: '4px',
                    background: 'var(--surface-2)',
                    marginBottom: '16px'
                  }}
                />
                <div
                  style={{
                    width: '100%',
                    height: '12px',
                    borderRadius: '4px',
                    background: 'var(--surface-2)',
                    marginBottom: '8px'
                  }}
                />
                <div
                  style={{
                    width: '75%',
                    height: '12px',
                    borderRadius: '4px',
                    background: 'var(--surface-2)'
                  }}
                />
              </div>
              <div className="news-footer" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '90px',
                    height: '12px',
                    borderRadius: '4px',
                    background: 'var(--surface-2)'
                  }}
                />
                <span
                  style={{
                    display: 'inline-block',
                    width: '70px',
                    height: '12px',
                    borderRadius: '4px',
                    background: 'var(--surface-2)'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* News Article Grid */}
      {!isLoading && filteredNews.length > 0 && (
        <div className="news-grid">
          {filteredNews.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              onReadMore={(art) => setActiveArticle(art)}
            />
          ))}
        </div>
      )}

      {/* Empty State / Live Category Fallback to Sample Archive */}
      {!isLoading && filteredNews.length === 0 && (
        <div>
          <div
            style={{
              textAlign: 'center',
              padding: matchingSampleFallback.length > 0 ? '24px 20px' : '48px 24px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              color: 'var(--muted)',
              marginBottom: matchingSampleFallback.length > 0 ? '24px' : '0'
            }}
          >
            <div style={{ fontSize: matchingSampleFallback.length > 0 ? '20px' : '24px', marginBottom: '8px' }}>
              {isLive ? '📡' : '📰'}
            </div>
            <h3 style={{ fontSize: '18px', marginBottom: '6px', color: 'var(--text)' }}>
              {isLive
                ? `No live ${selectedCategory} stories available right now.`
                : 'No articles found'}
            </h3>
            <p style={{ fontSize: '13px', margin: 0 }}>
              {isLive
                ? (matchingSampleFallback.length > 0
                    ? `Finnhub's real-time feed currently has no dispatches in this category. Showing reference dispatches from our sample archive below.`
                    : `Check back later for new ${selectedCategory} dispatches or explore other categories.`)
                : (selectedCategory === 'All'
                    ? 'No market dispatches are currently available.'
                    : `No archived articles available under the "${selectedCategory}" category.`)}
            </p>
          </div>

          {/* Clearly labeled Sample Archive reference cards */}
          {matchingSampleFallback.length > 0 && (
            <div>
              <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="eyebrow" style={{ margin: 0 }}>
                  SAMPLE ARCHIVE • {selectedCategory.toUpperCase()}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--muted)',
                    background: 'var(--surface-2)',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}
                >
                  Archived Reference
                </span>
              </div>

              <div className="news-grid">
                {matchingSampleFallback.map((article) => (
                  <NewsCard
                    key={`sample-${article.id}`}
                    article={article}
                    onReadMore={(art) => setActiveArticle(art)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Article Reader Modal */}
      {activeArticle && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--modal-overlay)',
            backdropFilter: 'blur(6px)',
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

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
              {activeArticle.url && typeof activeArticle.url === 'string' && activeArticle.url.startsWith('http') && (
                <a
                  href={activeArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  Read on Source ↗
                </a>
              )}
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
