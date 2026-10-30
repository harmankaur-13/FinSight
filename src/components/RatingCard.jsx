import React from 'react';
import { formatCurrencyINR } from '../services/ratingsApi';

export default function RatingCard({ rating, quote, isLoading = false }) {
  const getBadgeClass = (type) => {
    if (type === 'strong-buy') return 'rating-strong-buy';
    if (type === 'buy') return 'rating-buy';
    return 'rating-hold';
  };

  const hasLiveQuote = Boolean(quote && quote.status === 'success' && quote.data);
  const rawPrice = hasLiveQuote ? quote.data.price : null;
  const displayedPrice = isLoading
    ? '—'
    : hasLiveQuote
      ? formatCurrencyINR(rawPrice) || rating.price
      : rating.price;

  // Calculate approximate research target upside / downside
  let upsidePercent = null;
  let isPositiveUpside = true;
  if (!isLoading && rating.target) {
    const cleanNum = (str) => {
      if (typeof str === 'number') return str;
      if (!str) return 0;
      return parseFloat(String(str).replace(/[^0-9.]/g, ''));
    };
    const currentVal = hasLiveQuote ? rawPrice : cleanNum(rating.price);
    const targetVal = cleanNum(rating.target);
    if (currentVal && targetVal && currentVal > 0) {
      const diff = ((targetVal - currentVal) / currentVal) * 100;
      isPositiveUpside = diff >= 0;
      upsidePercent = diff > 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`;
    }
  }

  // Live daily change if supplied by market feed
  const hasDailyChange = hasLiveQuote && typeof quote.data.change === 'number';
  const changeVal = hasDailyChange ? quote.data.change : 0;
  const changePct = hasDailyChange ? Number(quote.data.changePercent || 0) : 0;
  const isPositive = hasDailyChange && changeVal > 0;
  const isNegative = hasDailyChange && changeVal < 0;

  let movementNode = null;
  if (isLoading) {
    movementNode = (
      <span className="stock-daily-movement neutral">
        Updating today...
      </span>
    );
  } else if (hasDailyChange) {
    const formattedDiff = formatCurrencyINR(Math.abs(changeVal));
    if (isPositive) {
      movementNode = (
        <span className="stock-daily-movement positive">
          {`+${formattedDiff} (+${changePct.toFixed(2)}%) today`}
        </span>
      );
    } else if (isNegative) {
      movementNode = (
        <span className="stock-daily-movement negative">
          {`-${formattedDiff} (${changePct.toFixed(2)}%) today`}
        </span>
      );
    } else {
      movementNode = (
        <span className="stock-daily-movement neutral">
          ₹0.00 (0.00%) today
        </span>
      );
    }
  } else {
    movementNode = (
      <span className="stock-daily-movement sample">
        Baseline sample valuation
      </span>
    );
  }

  return (
    <article className="rating-card" aria-label={`${rating.name} stock research card`}>
      {/* 1. Header: Symbol, Company Name, Sector & Rating Badge */}
      <div className="rating-card-header">
        <div className="stock-identity">
          <div className="stock-symbol-row">
            <span className="stock-ticker-pill">{rating.symbol}</span>
            <span className="stock-sector-byline">{rating.sector}</span>
          </div>
          <h3 className="stock-company-title" title={rating.name}>{rating.name}</h3>
        </div>

        <div className="stock-header-badge">
          <span className={`rating-badge ${getBadgeClass(rating.ratingType)}`}>
            {rating.rating}
          </span>
        </div>
      </div>

      {/* 2. Main Price Section: Large prominent price & daily movement */}
      <div className="stock-hero-price-card">
        <div className="stock-hero-price-line">
          <span className="stock-hero-price">{displayedPrice}</span>
        </div>

        <div className="stock-hero-movement-line">
          {movementNode}
          <span className="stock-price-timestamp">
            {hasLiveQuote
              ? `Daily Close • EOD: ${quote.data.date}`
              : isLoading
                ? 'Updating... • Quote: Updating'
                : 'Sample Price • Quote: Sample'}
          </span>
        </div>
      </div>

      {/* 3. Supporting Metrics: 12M Target, P/E Ratio, Risk Level */}
      <div className="stock-supporting-metrics">
        <div className="stock-metric-cell">
          <span className="stock-metric-heading">12M Target</span>
          <span className="stock-metric-primary">{rating.target}</span>
          {upsidePercent ? (
            <span className={`stock-metric-sub ${isPositiveUpside ? 'positive' : 'negative'}`}>
              {`${upsidePercent} ${isPositiveUpside ? 'upside' : 'downside'}`}
            </span>
          ) : (
            <span className="stock-metric-sub muted">—</span>
          )}
        </div>

        <div className="stock-metric-cell">
          <span className="stock-metric-heading">P/E Ratio</span>
          <span className="stock-metric-primary">{rating.peRatio}</span>
          <span className="stock-metric-sub muted">TTM Multiple</span>
        </div>

        <div className="stock-metric-cell">
          <span className="stock-metric-heading">Risk Level</span>
          <span className={`stock-metric-primary risk-${rating.riskLevel === 'Low' ? 'low' : 'med'}`}>
            {rating.riskLevel}
          </span>
          <span className="stock-metric-sub muted">Volatility</span>
        </div>
      </div>

      {/* 4. Research Outlook: Structured Rationale & Research Sentiment */}
      <div className="stock-research-outlook">
        <div className="stock-outlook-header-row">
          <div className="stock-outlook-caption">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            <span>Research Outlook</span>
          </div>
          {rating.sentiment && (
            <span className="stock-sentiment-pill" title="Illustrative research sentiment score">
              Sentiment: <strong>{rating.sentiment}</strong>
            </span>
          )}
        </div>
        <p className="stock-outlook-paragraph">
          {rating.rationale}
        </p>
      </div>

      {/* 5. Minimal Disclaimer Footnote */}
      <div className="stock-card-disclaimer">
        <span>Illustrative research &bull; Not financial advice</span>
        <span>NSE Equity</span>
      </div>
    </article>
  );
}
