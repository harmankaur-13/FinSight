import React from 'react';

export default function NewsCard({ article, onReadMore }) {
  return (
    <article className="news-card">
      <div>
        <div className="news-meta">
          <span className="news-tag">{article.category}</span>
          <span>{article.readTime}</span>
        </div>

        <h3>{article.headline}</h3>
        <p>{article.summary}</p>
      </div>

      <div className="news-footer">
        <span>{article.source} • {article.date}</span>
        <button
          type="button"
          className="btn btn-ghost btn-small"
          onClick={() => onReadMore && onReadMore(article)}
          style={{ color: 'var(--green)', fontWeight: 700 }}
        >
          Read Article →
        </button>
      </div>
    </article>
  );
}
