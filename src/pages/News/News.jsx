import React, { useState, useEffect, useMemo } from 'react';
import NewsCard from '../../components/NewsCard';
import { NEWS_DATA } from '../../data/mockData';
import { fetchMarketNews } from '../../services/newsApi';
import { analyzeArticle, calculateRelativeTime, formatFullTimestamp } from '../../services/newsAnalysis';
import './News.css';

export default function News({ initialArticles = null }) {
  const [articles, setArticles] = useState(initialArticles || []);
  const [isLoading, setIsLoading] = useState(!initialArticles);
  const [isLive, setIsLive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'readTime'
  const [visibleCount, setVisibleCount] = useState(9);
  const [activeArticle, setActiveArticle] = useState(null);

  const categories = ['All', 'Markets', 'Technology', 'Economy', 'Stocks', 'Crypto', 'Business'];

  // Fetch articles on mount
  const loadNews = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const liveArticles = await fetchMarketNews('general');
      setArticles(liveArticles);
      setIsLive(true);
    } catch (err) {
      // Fall back gracefully to curated sample/archived data
      setArticles(NEWS_DATA);
      setIsLive(false);

      // Sanitize error message to prevent exposing internal keys or raw URLs
      const safeMsg = err && typeof err.message === 'string'
        ? err.message.replace(/token=[^&\s]+/gi, 'token=***')
        : 'Live market feed is currently offline.';
      setErrorMessage(safeMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  // Scroll to top when activeArticle changes
  useEffect(() => {
    if (activeArticle) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeArticle]);

  // Safe category matcher
  const matchesCategory = (itemCategory, targetCategory) => {
    if (!itemCategory || !targetCategory) return false;
    return itemCategory.trim().toLowerCase() === targetCategory.trim().toLowerCase();
  };

  // Filter & Search Logic
  const filteredArticles = useMemo(() => {
    let result = articles;

    // 1. Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter((item) => matchesCategory(item.category, selectedCategory));
    }

    // 2. Search Query (headline, summary, source, category, tickers)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        const headlineMatch = (item.headline || '').toLowerCase().includes(q);
        const summaryMatch = (item.summary || '').toLowerCase().includes(q);
        const sourceMatch = (item.source || '').toLowerCase().includes(q);
        const categoryMatch = (item.category || '').toLowerCase().includes(q);
        const tickerMatch = (item.related || '').toLowerCase().includes(q);
        return headlineMatch || summaryMatch || sourceMatch || categoryMatch || tickerMatch;
      });
    }

    // 3. Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'newest') {
        const timeA = a.datetime || (a.date ? new Date(a.date).getTime() : 0);
        const timeB = b.datetime || (b.date ? new Date(b.date).getTime() : 0);
        return timeB - timeA;
      }
      if (sortBy === 'oldest') {
        const timeA = a.datetime || (a.date ? new Date(a.date).getTime() : 0);
        const timeB = b.datetime || (b.date ? new Date(b.date).getTime() : 0);
        return timeA - timeB;
      }
      if (sortBy === 'readTime') {
        const parseRead = (str) => {
          const match = (str || '').match(/\d+/);
          return match ? parseInt(match[0], 10) : 3;
        };
        return parseRead(a.readTime) - parseRead(b.readTime);
      }
      return 0;
    });

    return result;
  }, [articles, selectedCategory, searchQuery, sortBy]);

  // Compute live counts per category for the tabs
  const categoryCounts = useMemo(() => {
    const counts = { All: articles.length };
    categories.forEach((cat) => {
      if (cat !== 'All') {
        counts[cat] = articles.filter((item) => matchesCategory(item.category, cat)).length;
      }
    });
    return counts;
  }, [articles]);

  // Visible sliced articles for pagination
  const displayedArticles = filteredArticles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArticles.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

  // If live feed has 0 articles for selected category, offer curated sample articles as reference
  const matchingSampleFallback = (isLive && selectedCategory !== 'All' && filteredArticles.length === 0)
    ? NEWS_DATA.filter((item) => matchesCategory(item.category, selectedCategory))
    : [];

  // Prepared analysis for active article
  const activeAnalysis = useMemo(() => {
    if (!activeArticle) return null;
    return analyzeArticle(activeArticle);
  }, [activeArticle]);

  // Next / Previous article navigation inside reader
  const handleNextArticle = () => {
    const currentIndex = articles.findIndex((a) => a.id === activeArticle.id);
    if (currentIndex !== -1 && currentIndex < articles.length - 1) {
      setActiveArticle(articles[currentIndex + 1]);
    } else if (articles.length > 0) {
      setActiveArticle(articles[0]);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 0 90px' }}>
      {/* =========================================================================
          VIEW A: DEDICATED ARTICLE DETAIL READING EXPERIENCE
          ========================================================================= */}
      {activeAnalysis ? (
        <div className="article-reader-container">
          {/* Breadcrumb Navigation & Top Action Bar */}
          <nav className="reader-breadcrumb-nav" aria-label="Article navigation">
            <button
              type="button"
              className="btn-back-to-news"
              onClick={() => setActiveArticle(null)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to News Intelligence</span>
            </button>

            <div className="reader-nav-badges">
              <span className="news-tag">{activeAnalysis.overview.category}</span>
              <span className={`news-status-badge ${isLive ? 'live' : 'sample'}`}>
                {isLive ? 'Live API Dispatch' : 'Curated Research Archive'}
              </span>
            </div>
          </nav>

          {/* Article Header & Byline */}
          <header className="reader-article-header">
            <h1 className="reader-article-headline">
              {activeAnalysis.overview.headline}
            </h1>

            <div className="reader-byline-strip">
              <div className="reader-byline-left">
                <span>By <strong className="reader-source-strong">{activeAnalysis.overview.source}</strong></span>
                <span className="news-bullet-separator">•</span>
                <span>{activeAnalysis.overview.fullTimestamp}</span>
                <span className="news-bullet-separator">•</span>
                <span>{activeAnalysis.overview.relativeTime}</span>
                <span className="news-bullet-separator">•</span>
                <span>{activeAnalysis.overview.readTime}</span>
              </div>

              {activeAnalysis.overview.url && typeof activeAnalysis.overview.url === 'string' && activeAnalysis.overview.url.startsWith('http') && (
                <a
                  href={activeAnalysis.overview.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-read-original-link"
                >
                  <span>Read on {activeAnalysis.overview.source}</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              )}
            </div>
          </header>

          {/* Two-Column Editorial Layout */}
          <div className="reader-editorial-layout">
            {/* Left Column: Structured Analytical Sections */}
            <main className="reader-main-column">
              {/* SECTION 1: Article Overview */}
              <section className="reader-section-card" aria-labelledby="section-overview-heading">
                <div className="reader-section-header">
                  <div className="reader-section-title-wrap">
                    <span className="reader-section-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </span>
                    <h2 id="section-overview-heading" className="reader-section-title">
                      1. Article Overview
                    </h2>
                  </div>
                  <span className="news-cat-badge">{activeAnalysis.overview.category}</span>
                </div>

                <p className="reader-narrative-text">
                  {activeAnalysis.overview.summary}
                </p>

                {activeAnalysis.overview.symbols && activeAnalysis.overview.symbols.length > 0 && (
                  <div className="reader-facts-row">
                    <span className="reader-facts-label">Associated Symbols:</span>
                    {activeAnalysis.overview.symbols.map((sym) => (
                      <span key={sym} className="reader-fact-pill">{sym}</span>
                    ))}
                  </div>
                )}
              </section>

              {/* SECTION 2: What Happened? */}
              <section className="reader-section-card" aria-labelledby="section-what-happened-heading">
                <div className="reader-section-header">
                  <div className="reader-section-title-wrap">
                    <span className="reader-section-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                    </span>
                    <h2 id="section-what-happened-heading" className="reader-section-title">
                      2. What Happened?
                    </h2>
                  </div>
                  <span className="reader-facts-label">
                    Subject: {activeAnalysis.whatHappened.primarySubject}
                  </span>
                </div>

                <p className="reader-narrative-text">
                  {activeAnalysis.whatHappened.narrative}
                </p>

                {activeAnalysis.whatHappened.keyFacts && activeAnalysis.whatHappened.keyFacts.length > 0 && (
                  <div className="reader-facts-row">
                    <span className="reader-facts-label">Reported Figures:</span>
                    {activeAnalysis.whatHappened.keyFacts.map((fact, idx) => (
                      <span key={`fact-${idx}`} className="reader-fact-pill">{fact}</span>
                    ))}
                  </div>
                )}
              </section>

              {/* SECTION 3: Why Did It Happen? */}
              <section className="reader-section-card" aria-labelledby="section-why-happened-heading">
                <div className="reader-section-header">
                  <div className="reader-section-title-wrap">
                    <span className="reader-section-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                      </svg>
                    </span>
                    <h2 id="section-why-happened-heading" className="reader-section-title">
                      3. Why Did It Happen?
                    </h2>
                  </div>
                  <span className={`reader-catalyst-status ${activeAnalysis.whyDidItHappen.isAvailable ? 'available' : 'omitted'}`}>
                    {activeAnalysis.whyDidItHappen.isAvailable ? 'Verified Driver' : 'Disclosure Precaution'}
                  </span>
                </div>

                <p className="reader-narrative-text">
                  {activeAnalysis.whyDidItHappen.explanation}
                </p>

                {activeAnalysis.whyDidItHappen.catalysts && activeAnalysis.whyDidItHappen.catalysts.length > 0 && (
                  <div className="reader-catalyst-box">
                    <div className="reader-facts-label" style={{ marginBottom: '6px' }}>
                      Primary Catalyst Identified:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: 'var(--text)' }}>
                      {activeAnalysis.whyDidItHappen.catalysts.map((cat, i) => (
                        <li key={`cat-${i}`}>{cat}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>

              {/* SECTION 4: Why Does It Matter? */}
              <section className="reader-section-card" aria-labelledby="section-why-matter-heading">
                <div className="reader-section-header">
                  <div className="reader-section-title-wrap">
                    <span className="reader-section-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                    </span>
                    <h2 id="section-why-matter-heading" className="reader-section-title">
                      4. Why Does It Matter?
                    </h2>
                  </div>
                  <span className="reader-facts-label">Strategic Significance</span>
                </div>

                <p className="reader-narrative-text">
                  {activeAnalysis.whyDoesItMatter.significance}
                </p>

                <div className="reader-context-notice">
                  <strong>Standard Methodology:</strong> {activeAnalysis.whyDoesItMatter.contextualNote}
                </div>
              </section>

              {/* SECTION 5: Market Impact */}
              <section className="reader-section-card" aria-labelledby="section-market-impact-heading">
                <div className="reader-section-header">
                  <div className="reader-section-title-wrap">
                    <span className="reader-section-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                      </svg>
                    </span>
                    <h2 id="section-market-impact-heading" className="reader-section-title">
                      5. Market Impact & Financial Context
                    </h2>
                  </div>
                  <span className="reader-facts-label">
                    {activeAnalysis.marketImpact.isEstablished ? 'Established' : 'Neutral Disclosure'}
                  </span>
                </div>

                <div className={`reader-impact-status-banner ${activeAnalysis.marketImpact.isEstablished ? 'established' : 'unestablished'}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {activeAnalysis.marketImpact.isEstablished ? (
                      <polyline points="20 6 9 17 4 12"></polyline>
                    ) : (
                      <circle cx="12" cy="12" r="10"></circle>
                    )}
                  </svg>
                  <span>{activeAnalysis.marketImpact.contextNote}</span>
                </div>

                <div className="reader-impact-details-grid">
                  <div className="reader-impact-metric-box">
                    <div className="reader-metric-label">Affected Sectors</div>
                    <div className="reader-metric-value">
                      {activeAnalysis.marketImpact.affectedSectors.join(', ') || 'Broad Market Indices'}
                    </div>
                  </div>

                  <div className="reader-impact-metric-box">
                    <div className="reader-metric-label">Reported Price Reaction</div>
                    <div className="reader-metric-value">
                      {activeAnalysis.marketImpact.priceMovement || 'Not quantified in dispatch'}
                    </div>
                  </div>
                </div>
              </section>

              {/* Bottom Back Button & Switcher */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px' }}>
                <button
                  type="button"
                  className="btn-back-to-news"
                  onClick={() => setActiveArticle(null)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  <span>Return to News Feed</span>
                </button>

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleNextArticle}
                >
                  <span>Next Dispatch →</span>
                </button>
              </div>
            </main>

            {/* Right Column: Intelligence Sidebar */}
            <aside className="reader-sidebar" aria-label="Article intelligence and entities">
              {/* SECTION 6: Key Takeaways (3-5 items) */}
              <div className="reader-sidebar-card">
                <h3 className="reader-sidebar-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="9 11 12 14 22 4"></polyline>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                  <span>6. Key Takeaways</span>
                </h3>

                <ul className="reader-takeaways-list">
                  {activeAnalysis.keyTakeaways.map((takeaway, idx) => (
                    <li key={`takeaway-${idx}`} className="reader-takeaway-item">
                      <span className="reader-takeaway-bullet">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </span>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* SECTION 7: Important Entities */}
              <div className="reader-sidebar-card">
                <h3 className="reader-sidebar-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                  <span>7. Important Entities</span>
                </h3>

                {activeAnalysis.importantEntities.tickers.length > 0 && (
                  <div className="reader-entity-group">
                    <div className="reader-entity-subheading">Tracked Tickers</div>
                    <div className="reader-entity-chips-wrap">
                      {activeAnalysis.importantEntities.tickers.map((t) => (
                        <span key={t} className="reader-entity-chip ticker">{t}</span>
                      ))}
                    </div>
                  </div>
                )}

                {activeAnalysis.importantEntities.companies.length > 0 && (
                  <div className="reader-entity-group">
                    <div className="reader-entity-subheading">Identified Companies</div>
                    <div className="reader-entity-chips-wrap">
                      {activeAnalysis.importantEntities.companies.map((c) => (
                        <span key={c} className="reader-entity-chip">{c}</span>
                      ))}
                    </div>
                  </div>
                )}

                {activeAnalysis.importantEntities.regulators.length > 0 && (
                  <div className="reader-entity-group">
                    <div className="reader-entity-subheading">Regulatory Bodies</div>
                    <div className="reader-entity-chips-wrap">
                      {activeAnalysis.importantEntities.regulators.map((r) => (
                        <span key={r} className="reader-entity-chip">{r}</span>
                      ))}
                    </div>
                  </div>
                )}

                {activeAnalysis.importantEntities.sectors.length > 0 && (
                  <div className="reader-entity-group">
                    <div className="reader-entity-subheading">Relevant Sectors</div>
                    <div className="reader-entity-chips-wrap">
                      {activeAnalysis.importantEntities.sectors.map((s) => (
                        <span key={s} className="reader-entity-chip">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 8: Source and References */}
              <div className="reader-sidebar-card">
                <h3 className="reader-sidebar-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                  <span>8. Source & Verification</span>
                </h3>

                <div className="reader-source-card">
                  <div className="reader-source-name-large">
                    {activeAnalysis.sourceAndReferences.publisher}
                  </div>
                  <div className="reader-source-metadata">
                    <div>Published: {activeAnalysis.sourceAndReferences.publishedAt}</div>
                    <div>Recorded: {activeAnalysis.sourceAndReferences.relativeTime}</div>
                  </div>

                  {activeAnalysis.sourceAndReferences.url && typeof activeAnalysis.sourceAndReferences.url === 'string' && activeAnalysis.sourceAndReferences.url.startsWith('http') && (
                    <a
                      href={activeAnalysis.sourceAndReferences.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                      style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}
                    >
                      <span>Read Original Article</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                  )}

                  <div className="reader-disclaimer-text">
                    {activeAnalysis.sourceAndReferences.attributionNote}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      ) : (
        /* =========================================================================
           VIEW B: MAIN NEWS FEED (Professional Scanning & Filtering)
           ========================================================================= */
        <div>
          <div className="page-header">
            <span className="eyebrow">FINANCIAL INTELLIGENCE DISPATCH</span>
            <h1 className="page-title">Market & Macro News</h1>
            <p className="page-subtitle">
              Institutional-grade market developments, central bank policy trajectories, and corporate earnings analysis with verified attribution.
            </p>
          </div>

          {/* Connection & Status Banner */}
          {!isLoading && (
            <div className="news-status-banner">
              <div className="news-status-info">
                <span className={`news-status-indicator ${isLive ? 'live' : 'sample'}`} />
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                  {isLive ? 'Live Market Feed' : 'Curated Research Archive'}
                </span>
                <span style={{ color: 'var(--border)' }}>•</span>
                <span style={{ color: 'var(--muted)' }}>
                  {isLive
                    ? 'Connected to Finnhub API market-news service'
                    : (errorMessage || 'Live API feed offline. Serving verified institutional sample dispatches.')}
                </span>
              </div>

              <span className={`news-status-badge ${isLive ? 'live' : 'sample'}`}>
                {isLive ? 'Live API Feed' : 'Archive Dispatch'}
              </span>
            </div>
          )}

          {/* Toolbar: Search, Sort, Refresh */}
          <div className="news-toolbar">
            <div className="news-controls-row">
              {/* Search Bar */}
              <div className="news-search-box">
                <span className="news-search-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </span>
                <input
                  type="text"
                  className="news-search-input"
                  placeholder="Search dispatches, companies, or tickers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search news dispatches"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="news-search-clear"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search query"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>

              {/* Controls Right: Sort & Refresh */}
              <div className="news-filters-right">
                <label className="news-select-label">
                  <span>Sort By:</span>
                  <select
                    className="news-sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort news dispatches"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="readTime">Shortest Read</option>
                  </select>
                </label>

                <button
                  type="button"
                  className="btn-refresh-feed"
                  onClick={loadNews}
                  disabled={isLoading}
                  aria-label="Refresh news feed"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <polyline points="1 20 1 14 7 14"></polyline>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                  </svg>
                  <span>Refresh Feed</span>
                </button>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="news-category-bar" role="tablist" aria-label="News categories">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === cat}
                  className={`news-cat-tab ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  <span>{cat}</span>
                  <span className="news-cat-badge">{categoryCounts[cat] || 0}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Loading Skeletons */}
          {isLoading && (
            <div className="news-cards-grid" aria-busy="true" aria-label="Loading dispatches">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={`skel-${n}`} className="news-card" style={{ minHeight: '220px', opacity: 0.7 }}>
                  <div>
                    <div className="news-meta">
                      <span style={{ width: '60px', height: '14px', borderRadius: '4px', background: 'var(--surface-2)', display: 'inline-block' }} />
                      <span style={{ width: '45px', height: '12px', borderRadius: '4px', background: 'var(--surface-2)', display: 'inline-block' }} />
                    </div>
                    <div style={{ width: '85%', height: '18px', borderRadius: '4px', background: 'var(--surface-2)', marginBottom: '10px' }} />
                    <div style={{ width: '60%', height: '18px', borderRadius: '4px', background: 'var(--surface-2)', marginBottom: '16px' }} />
                    <div style={{ width: '100%', height: '12px', borderRadius: '4px', background: 'var(--surface-2)', marginBottom: '8px' }} />
                    <div style={{ width: '75%', height: '12px', borderRadius: '4px', background: 'var(--surface-2)' }} />
                  </div>
                  <div className="news-footer">
                    <span style={{ width: '90px', height: '12px', borderRadius: '4px', background: 'var(--surface-2)', display: 'inline-block' }} />
                    <span style={{ width: '70px', height: '12px', borderRadius: '4px', background: 'var(--surface-2)', display: 'inline-block' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* News Article Grid */}
          {!isLoading && displayedArticles.length > 0 && (
            <>
              <div className="news-cards-grid">
                {displayedArticles.map((article) => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    onReadMore={(art) => setActiveArticle(art)}
                  />
                ))}
              </div>

              {/* Load More Pagination Bar */}
              {hasMore && (
                <div className="news-pagination-bar">
                  <span className="news-pagination-info">
                    Showing {displayedArticles.length} of {filteredArticles.length} dispatches
                  </span>
                  <button
                    type="button"
                    className="btn-load-more"
                    onClick={handleLoadMore}
                  >
                    <span>Load More Dispatches</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}

          {/* Empty State / Live Category Fallback to Sample Archive */}
          {!isLoading && filteredArticles.length === 0 && (
            <div>
              <div
                style={{
                  textAlign: 'center',
                  padding: matchingSampleFallback.length > 0 ? '24px 20px' : '52px 24px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  color: 'var(--muted)',
                  marginBottom: matchingSampleFallback.length > 0 ? '24px' : '0'
                }}
              >
                <div style={{ marginBottom: '12px', color: 'var(--muted)' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--text)', fontFamily: 'Space Grotesk, sans-serif' }}>
                  {searchQuery
                    ? `No dispatches matching "${searchQuery}"`
                    : `No active dispatches under ${selectedCategory}`}
                </h3>
                <p style={{ fontSize: '13px', margin: '0 auto 16px', maxWidth: '440px', lineHeight: 1.5 }}>
                  {searchQuery
                    ? 'Try refining your search terms or clearing the filter to view all available market dispatches.'
                    : (isLive && matchingSampleFallback.length > 0
                      ? 'The real-time feed currently has no stories in this category. Reference dispatches from our archive are provided below.'
                      : 'Check back later for new dispatches or explore other categories.')}
                </p>
                {searchQuery && (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear Search Filter
                  </button>
                )}
              </div>

              {/* Clearly labeled Sample Archive reference cards */}
              {matchingSampleFallback.length > 0 && (
                <div>
                  <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="eyebrow" style={{ margin: 0 }}>
                      SAMPLE ARCHIVE • {selectedCategory.toUpperCase()}
                    </span>
                    <span className="news-status-badge sample">
                      Archived Reference
                    </span>
                  </div>

                  <div className="news-cards-grid">
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
        </div>
      )}
    </div>
  );
}
