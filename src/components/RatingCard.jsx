import React from 'react';

export default function RatingCard({ rating }) {
  const getBadgeClass = (type) => {
    if (type === 'strong-buy') return 'rating-strong-buy';
    if (type === 'buy') return 'rating-buy';
    return 'rating-hold';
  };

  return (
    <div className="rating-card">
      <div className="rating-card-header">
        <div>
          <div className="ticker-symbol" style={{ fontSize: '18px' }}>{rating.name}</div>
          <div className="ticker-name" style={{ fontSize: '12px' }}>{rating.symbol} • {rating.sector}</div>
        </div>
        <span className={`rating-badge ${getBadgeClass(rating.ratingType)}`}>
          {rating.rating}
        </span>
      </div>

      <div className="rating-stats-row">
        <div className="rating-stat-item">
          <span>Current Price</span>
          <strong>{rating.price}</strong>
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
      </div>
    </div>
  );
}
