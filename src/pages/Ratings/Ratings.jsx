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
    <div className="ratings-page-container">
      {/* Page Header */}
      <div className="ratings-header">
        <span className="eyebrow">ILLUSTRATIVE RESEARCH &amp; BENCHMARKS</span>
        <h1 className="page-title">Stock &amp; Asset Ratings</h1>
        <p className="page-subtitle">
          Institutional research consensus, price targets, valuation multiples, and live daily market closing prices.
        </p>
      </div>

      {/* Screen-reader live region for accessibility and feed status */}
      <div className="sr-only" aria-live="polite">
        {isLoading
          ? 'Connecting Market Feed'
          : hasLiveQuotes
            ? (successCount === totalCount ? 'Daily Closing Feed (TejHQ)' : 'Partial Market Feed (TejHQ)')
            : 'Sample Valuation Data'}
      </div>

      {/* Terminal Overview Hub (Asymmetric: Market Breadth Matrix + Benchmark Spotlight) */}
      <section className="terminal-overview-hub" aria-label="Market Overview &amp; Benchmark Spotlight">
        {/* Left Column: 2x2 Market Breadth Matrix */}
        <div className="stock-summary-strip">
          <div className="stock-summary-item">
            <span className="stock-summary-label">Universe Tracked</span>
            <span className="stock-summary-value">{totalCount} Equities</span>
            <span className="stock-summary-sub">Large-cap NSE leaders</span>
          </div>
          <div className="stock-summary-item">
            <span className="stock-summary-label">High Conviction</span>
            <span className="stock-summary-value high-conviction">
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
            <span className="stock-summary-value source-label">
              {hasLiveQuotes ? 'TejHQ (NSE)' : 'Curated Sample'}
            </span>
            <span className="stock-summary-sub">End-of-day daily close</span>
          </div>
        </div>

        {/* Right Column: Featured Benchmark Spotlight Hero */}
        <div className="stock-spotlight-hero">
          <div className="spotlight-hero-top">
            <div className="spotlight-eyebrow-row">
              <span className="spotlight-hero-eyebrow">BENCHMARK SPOTLIGHT</span>
              <span className="rating-badge rating-strong-buy">Strong Buy</span>
            </div>
            <div className="spotlight-asset-identity">
              <span className="spotlight-ticker">{RATINGS_DATA[0].symbol}</span>
              <span className="spotlight-name">{RATINGS_DATA[0].name}</span>
              <span className="spotlight-sector">• {RATINGS_DATA[0].sector}</span>
            </div>
          </div>

          <div className="spotlight-hero-body">
            <div className="spotlight-price-block">
              <span className="spotlight-price-caption">Closing Benchmark</span>
              <div className="spotlight-price-value">
                {isLoading
                  ? '—'
                  : quotes[RATINGS_DATA[0].symbol]?.status === 'success'
                    ? formatCurrencyINR(quotes[RATINGS_DATA[0].symbol].data.price)
                    : RATINGS_DATA[0].price}
              </div>
              <span className="spotlight-price-sub">
                {hasLiveQuotes ? 'EOD NSE Daily Close' : 'Sample Research Valuation'}
              </span>
            </div>

            <div className="spotlight-metrics-block">
              <div className="spotlight-metric-tile">
                <span className="spotlight-tile-label">12M Target</span>
                <span className="spotlight-tile-val">{RATINGS_DATA[0].target}</span>
                <span className="spotlight-tile-sub positive">+14.1% upside</span>
              </div>
              <div className="spotlight-metric-tile">
                <span className="spotlight-tile-label">P/E Multiple</span>
                <span className="spotlight-tile-val">{RATINGS_DATA[0].peRatio}</span>
                <span className="spotlight-tile-sub muted">TTM Multiple</span>
              </div>
            </div>
          </div>

          <div className="spotlight-hero-footer">
            <p className="spotlight-rationale-text">
              &ldquo;{RATINGS_DATA[0].rationale}&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Universe Section Header & Toolbar */}
      <div className="stock-section-divider">
        <span className="stock-section-heading">COVERAGE UNIVERSE</span>
        <span className="stock-section-count">{filteredRatings.length} Equities</span>
      </div>

      {/* Toolbar: Category Filters, Search Input, and View Mode Switcher */}
      <div className="stock-toolbar-row">
        <div className="category-tabs">
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

        <div className="stock-toolbar-right">
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
                      <td className="stocks-table-sector">
                        {rating.sector}
                      </td>
                      <td>
                        <div className="stocks-table-price">{priceStr}</div>
                        <span className="stocks-table-sub">
                          {hasLive ? 'Daily Close' : 'Sample'}
                        </span>
                      </td>
                      <td>
                        <div className="stocks-table-target">{rating.target}</div>
                      </td>
                      <td>
                        <span className={`rating-badge rating-${rating.ratingType}`}>
                          {rating.rating}
                        </span>
                      </td>
                      <td><strong>{rating.peRatio}</strong></td>
                      <td>
                        <span className={`stock-risk-text ${rating.riskLevel === 'Low' ? 'low-risk' : 'med-risk'}`}>
                          {rating.riskLevel}
                        </span>
                      </td>
                      <td className="stocks-table-sentiment">{rating.sentiment}</td>
                      <td className="stocks-table-rationale">
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
        <div className="ratings-empty-state">
          <h3 className="ratings-empty-title">
            No stocks found
          </h3>
          <p className="ratings-empty-desc">
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
