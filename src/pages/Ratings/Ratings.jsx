import React, { useState, useEffect } from 'react';
import RatingCard from '../../components/RatingCard';
import { RATINGS_DATA } from '../../data/mockData';
import { fetchStockQuote } from '../../services/ratingsApi';

export default function Ratings() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [quotes, setQuotes] = useState({});
  const [isLoading, setIsLoading] = useState(true);

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

  const filteredRatings = RATINGS_DATA.filter((item) => {
    const matchesFilter = filter === 'All' || item.rating === filter || item.riskLevel === filter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.symbol.toLowerCase().includes(search.toLowerCase()) ||
                          item.sector.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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

  return (
    <div className="container" style={{ padding: '40px 0 90px' }}>
      <div className="page-header">
        <span className="eyebrow">ILLUSTRATIVE RESEARCH</span>
        <h1 className="page-title">Stock & Asset Ratings</h1>
        <p className="page-subtitle">
          Illustrative stock ratings, research targets, valuations, and risk indicators.
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', margin: '24px 0' }}>
        <div className="category-tabs" style={{ margin: 0 }}>
          {['All', 'Strong Buy', 'Buy', 'Hold', 'Low', 'Medium'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`cat-tab ${filter === tab ? 'active' : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab === 'Low' || tab === 'Medium' ? `${tab} Risk` : tab}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search by company or ticker..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input"
          style={{ maxWidth: '280px', height: '40px' }}
        />
      </div>

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
          <h3 style={{ fontSize: '18px', marginBottom: '6px', color: 'var(--text)' }}>
            No stocks found
          </h3>
          <p style={{ fontSize: '13px', margin: 0 }}>
            No ratings match your current filter and search query. Try clearing the search or switching filters.
          </p>
        </div>
      )}
    </div>
  );
}
