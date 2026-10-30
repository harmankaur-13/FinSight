import React, { useState, useEffect, useMemo } from 'react';
import RatingCard from '../../components/RatingCard';
import { RATINGS_DATA } from '../../data/mockData';
import { fetchStockQuote, formatCurrencyINR } from '../../services/ratingsApi';
import './Ratings.css';

export default function Ratings() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [quotes, setQuotes] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Fetch daily quotes on component mount with cleanup to prevent stale state on unmount
  useEffect(() => {
    let isMounted = true;

    async function loadQuotes() {
      setIsLoading(true);

      const symbols = RATINGS_DATA.map((item) => item.symbol);
      const settledResults = await Promise.allSettled(
        symbols.map((sym) => fetchStockQuote(sym))
      );

      if (!isMounted) return;

      const quotesMap = {};
      settledResults.forEach((res, index) => {
        const symbol = symbols[index];
        if (res.status === 'fulfilled') {
          quotesMap[symbol] = {
            status: 'success',
            data: res.value
          };
        } else {
          quotesMap[symbol] = {
            status: 'error',
            error: res.reason?.message || 'Failed to fetch quote'
          };
        }
      });

      setQuotes(quotesMap);
      setIsLoading(false);
    }

    loadQuotes();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredRatings = useMemo(() => {
    return RATINGS_DATA.filter((item) => {
      const matchesFilter = filter === 'All' || item.rating === filter || item.riskLevel === filter;
      const q = search.toLowerCase().trim();
      const matchesSearch = !q ||
        item.name.toLowerCase().includes(q) ||
        item.symbol.toLowerCase().includes(q) ||
        item.sector.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  const successQuotes = Object.values(quotes).filter((q) => q && q.status === 'success' && q.data);
  const successCount = successQuotes.length;
  const totalCount = RATINGS_DATA.length;
  const hasLiveQuotes = successCount > 0;

  // Extract latest date among successful quotes
  const latestDate = successQuotes
    .map((q) => q.data.date)
    .filter(Boolean)
    .sort()
    .reverse()[0] || '';

  // Calculate market universe metrics
  const strongBuyCount = RATINGS_DATA.filter(r => r.rating === 'Strong Buy').length;
  const lowRiskCount = RATINGS_DATA.filter(r => r.riskLevel === 'Low').length;

  return (
    <div className="container" style={{ padding: '40px 0 90px' }}>
      {/* Page Header */}
      <div className="page-header">
        <span className="eyebrow">ILLUSTRATIVE RESEARCH &amp; BENCHMARKS</span>
        <h1 className="page-title">Stock &amp; Asset Ratings</h1>
        <p className="page-subtitle">
          Institutional research consensus, price targets, valuation multiples, and live daily market closing prices.
        </p>
      </div>

      {/* Connection & Status Banner */}
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
              backgroundColor: isLoading
                ? 'var(--muted)'
                : hasLiveQuotes
                  ? 'var(--green)'
                  : 'var(--gold)',
              display: 'inline-block'
            }}
          />
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>
            {isLoading
              ? 'Connecting Market Feed'
              : hasLiveQuotes
                ? (successCount === totalCount ? 'Daily Closing Feed (TejHQ)' : 'Partial Market Feed (TejHQ)')
                : 'Sample Valuation Data'}
          </span>
          <span style={{ color: 'var(--muted)' }}>•</span>
          <span style={{ color: 'var(--muted)' }}>
            {isLoading
              ? 'Fetching daily NSE closing quotes via TejHQ API...'
              : hasLiveQuotes
                ? (successCount === totalCount
                  ? `Daily closing prices via TejHQ (NSE) as of ${latestDate}. Illustrative research ratings and targets; not verified analyst consensus.`
                  : `${successCount} of ${totalCount} closing prices updated via TejHQ. Unavailable stocks display sample prices.`)
                : 'Market API offline. Showing sample prices and illustrative research ratings.'}
          </span>
        </div>

        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: isLoading
              ? 'var(--muted)'
              : hasLiveQuotes
                ? 'var(--green-dark)'
                : 'var(--muted)',
            background: isLoading
              ? 'var(--surface-2)'
              : hasLiveQuotes
                ? 'var(--green-light)'
                : 'var(--surface-2)',
            padding: '2px 8px',
            borderRadius: '4px'
          }}
        >
          {isLoading
            ? 'Updating...'
            : hasLiveQuotes
              ? (successCount === totalCount ? 'Daily Close API' : 'Partial EOD Feed')
              : 'Sample Data'}
        </span>
      </div>

      {/* Market Breadth Summary Strip */}
      <div className="stock-summary-strip">
        <div className="stock-summary-item">
          <span className="stock-summary-label">Universe Tracked</span>
          <span className="stock-summary-value">{totalCount} Equities</span>
          <span className="stock-summary-sub">Large-cap NSE leaders</span>
        </div>
        <div className="stock-summary-item">
          <span className="stock-summary-label">High Conviction</span>
          <span className="stock-summary-value" style={{ color: 'var(--green)' }}>
            {strongBuyCount} Strong Buys
          </span>
          <span className="stock-summary-sub">Top upside potential</span>
        </div>
        <div className="stock-summary-item">
          <span className="stock-summary-label">Risk Distribution</span>
          <span className="stock-summary-value">
            {lowRiskCount} Low Risk
          </span>
          <span className="stock-summary-sub">Defensive blue-chips</span>
        </div>
        <div className="stock-summary-item">
          <span className="stock-summary-label">Market Source</span>
          <span className="stock-summary-value" style={{ fontSize: '16px', paddingTop: '4px' }}>
            {hasLiveQuotes ? 'TejHQ (NSE)' : 'Curated Sample'}
          </span>
          <span className="stock-summary-sub">End-of-day daily close</span>
        </div>
      </div>

      {/* Toolbar: Category Filters, Search Input, and View Mode Switcher */}
      <div className="stock-toolbar-row">
        <div className="category-tabs" style={{ margin: 0 }}>
          {['All', 'Strong Buy', 'Buy', 'Hold', 'Low', 'Medium'].map((tab) => {
            const label = tab === 'Low' || tab === 'Medium' ? `${tab} Risk` : tab;
            return (
              <button
                key={tab}
                type="button"
                className={`cat-tab ${filter === tab ? 'active' : ''}`}
                onClick={() => setFilter(tab)}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div className="stock-search-wrap">
            <span className="stock-search-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by company or ticker..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="stock-search-input"
              aria-label="Search by company or ticker"
            />
            {search && (
              <button
                type="button"
                className="stock-search-clear"
                onClick={() => setSearch('')}
                aria-label="Clear stock search"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>

          {/* View Mode Toggle: Cards vs Table */}
          <div className="stock-view-switcher" role="radiogroup" aria-label="View layout">
            <button
              type="button"
              className={`btn-view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid cards layout"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>Cards</span>
            </button>
            <button
              type="button"
              className={`btn-view-toggle ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              aria-label="Tabular layout"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW A: Cards Grid */}
      {viewMode === 'grid' && (
        <div className="ratings-grid">
          {filteredRatings.map((rating) => (
            <RatingCard
              key={rating.id}
              rating={rating}
              quote={quotes[rating.symbol]}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}

      {/* VIEW B: High-Density Institutional Table */}
      {viewMode === 'table' && filteredRatings.length > 0 && (
        <div className="stocks-table-container">
          <div className="stocks-table-scroll">
            <table className="stocks-table">
              <thead>
                <tr>
                  <th>Ticker &amp; Company</th>
                  <th>Sector</th>
                  <th>Closing Price</th>
                  <th>12M Target</th>
                  <th>Rating</th>
                  <th>P/E</th>
                  <th>Risk Profile</th>
                  <th>Sentiment</th>
                  <th>Outlook</th>
                </tr>
              </thead>
              <tbody>
                {filteredRatings.map((rating) => {
                  const q = quotes[rating.symbol];
                  const hasLive = Boolean(q && q.status === 'success' && q.data);
                  const priceStr = isLoading
                    ? '—'
                    : hasLive
                      ? formatCurrencyINR(q.data.price) || rating.price
                      : rating.price;

                  return (
                    <tr key={rating.id}>
                      <td>
                        <div className="stocks-table-symbol">{rating.symbol}</div>
                        <div className="stocks-table-company">{rating.name}</div>
                      </td>
                      <td style={{ color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                        {rating.sector}
                      </td>
                      <td>
                        <div className="stocks-table-price">{priceStr}</div>
                        <span style={{ fontSize: '10px', color: 'var(--muted)' }}>
                          {hasLive ? 'Daily Close' : 'Sample'}
                        </span>
                      </td>
                      <td>
                        <div className="stocks-table-target">{rating.target}</div>
                      </td>
                      <td>
                        <span className={`rating-badge rating-${rating.ratingType}`} style={{ fontSize: '10px', padding: '2px 6px' }}>
                          {rating.rating}
                        </span>
                      </td>
                      <td><strong>{rating.peRatio}</strong></td>
                      <td>
                        <span className={`stock-risk-text ${rating.riskLevel === 'Low' ? 'low-risk' : 'med-risk'}`} style={{ fontWeight: 600 }}>
                          {rating.riskLevel}
                        </span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>{rating.sentiment}</td>
                      <td style={{ maxWidth: '280px', color: 'var(--muted)', fontSize: '11px', lineHeight: 1.4 }}>
                        {rating.rationale}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredRatings.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            color: 'var(--muted)'
          }}
        >
          <h3 style={{ fontSize: '18px', marginBottom: '6px', color: 'var(--text)', fontFamily: 'Space Grotesk, sans-serif' }}>
            No stocks found
          </h3>
          <p style={{ fontSize: '13px', margin: '0 auto 16px', maxWidth: '420px', lineHeight: 1.5 }}>
            No ratings match your current filter and search query. Try clearing the search or switching filters.
          </p>
          {(search || filter !== 'All') && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setSearch('');
                setFilter('All');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
