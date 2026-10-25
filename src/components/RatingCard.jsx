import React from 'react';
import { formatCurrencyINR } from '../services/ratingsApi';

export default function RatingCard({ rating, quote, isLoading = false }) {
  const getBadgeClass = (type) => {
    if (type === 'strong-buy') return 'rating-strong-buy';
    if (type === 'buy') return 'rating-buy';
    return 'rating-hold';
  };

  const hasLiveQuote = Boolean(quote && quote.status === 'success' && quote.data);
  const displayedPrice = isLoading
    ? '—'
    : hasLiveQuote
      ? formatCurrencyINR(quote.data.price) || rating.price
      : rating.price;

  return (
    <div className="rating-card">
      <div className="rating-card-header">
        <div>
          <div className="ticker-symbol" style={{ fontSize: '18px' }}>{rating.name}</div>
          <div className="ticker-name" style={{ fontSize: '12px' }}>{rating.symbol} • {rating.sector}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <span className={`rating-badge ${getBadgeClass(rating.ratingType)}`}>
            {rating.rating}
          </span>
          {hasLiveQuote ? (
            <span
              style={{
                fontSize: '10px',
                color: 'var(--green-dark)',
                background: 'var(--green-light)',
                padding: '1px 6px',
                borderRadius: '4px',
                fontWeight: 600
              }}
            >
              Daily Close
            </span>
          ) : !isLoading ? (
            <span
              style={{
                fontSize: '10px',
                color: 'var(--muted)',
                background: 'var(--surface-2)',
                padding: '1px 6px',
                borderRadius: '4px',
                fontWeight: 500
              }}
            >
              Sample Price
            </span>
          ) : (
            <span
              style={{
                fontSize: '10px',
                color: 'var(--muted)',
                background: 'var(--surface-2)',
                padding: '1px 6px',
                borderRadius: '4px'
              }}
            >
              Updating...
            </span>
          )}
        </div>
      </div>

      <div className="rating-stats-row">
        <div className="rating-stat-item">
          <span>{hasLiveQuote ? 'Daily Close' : (isLoading ? 'Updating...' : 'Sample Price')}</span>
          <strong>{displayedPrice}</strong>
        </div>
        <div className="rating-stat-item">
          <span>12M Target</span>
          <strong style={{ color: 'var(--green)' }}>{rating.target}</strong>
        </div>
        <div className="rating-stat-item">
          <span>Risk Level</span>
          <strong>{rating.riskLevel}</strong>
        </div>
      </div>

      <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '14px', lineHeight: '1.5' }}>
        {rating.rationale}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--muted)', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
        <span>Sentiment: <strong>{rating.sentiment}</strong></span>
        <span>P/E: <strong>{rating.peRatio}</strong></span>
        <span>{hasLiveQuote ? `EOD: ${quote.data.date}` : (isLoading ? 'Quote: Updating' : 'Quote: Sample')}</span>
      </div>
    </div>
  );
}
