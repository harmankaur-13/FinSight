import React from 'react';
import { calculateRelativeTime, extractEntities } from '../services/newsAnalysis';

export default function NewsCard({ article, onReadMore }) {
  if (!article) return null;

  const relativeTime = calculateRelativeTime(article.datetime || article.date);

  // Extract key entity chips (tickers or primary sector)
  let tickerTags = [];
  if (article.related && typeof article.related === 'string') {
    tickerTags = article.related.split(',').map(s => s.trim()).filter(Boolean).slice(0, 2);
  } else if (article.symbols && Array.isArray(article.symbols)) {
    tickerTags = article.symbols.slice(0, 2);
  } else {
    const extracted = extractEntities(`${article.headline} ${article.summary}`);
    tickerTags = extracted.tickers.slice(0, 2);
  }

  return (
    <article
      className="news-card"
      onClick={() => onReadMore && onReadMore(article)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onReadMore && onReadMore(article);
        }
      }}
      aria-label={`Read financial analysis: ${article.headline}`}
    >
      <div className="news-card-body">
        <div className="news-meta">
          <div className="news-meta-left">
            <span className="news-tag">{article.category}</span>
            {tickerTags.length > 0 && (
              <div className="news-card-tickers">
                {tickerTags.map((ticker) => (
                  <span key={ticker} className="news-ticker-badge">
                    {ticker}
                  </span>
                ))}
              </div>
            )}
          </div>
          <span className="news-relative-time" title={article.date}>
            {relativeTime}
          </span>
        </div>

        <h3 className="news-card-headline">{article.headline}</h3>
        <p className="news-card-summary">{article.summary}</p>
      </div>

      <div className="news-footer">
        <div className="news-source-byline">
          <span className="news-source-name">{article.source}</span>
          <span className="news-bullet-separator">•</span>
          <span className="news-read-time">{article.readTime || '3 min read'}</span>
        </div>

        <button
          type="button"
          className="btn-read-analysis"
          onClick={(e) => {
            e.stopPropagation();
            onReadMore && onReadMore(article);
          }}
          aria-label={`Read analysis on ${article.headline}`}
        >
          <span>Read Analysis</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </article>
  );
}
