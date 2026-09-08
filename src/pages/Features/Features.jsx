import React from 'react';
import { FEATURES_DATA } from '../../data/mockData';

export default function Features() {
  return (
    <div className="container" style={{ padding: '40px 0 90px' }}>
      <div className="page-header">
        <span className="eyebrow eyebrow-gold">CAPABILITIES & ARCHITECTURE</span>
        <h1 className="page-title">Designed for absolute financial clarity.</h1>
        <p className="page-subtitle">
          Explore the tools and intelligence modules that help individuals, growing businesses, and technology enterprises manage their wealth with discipline.
        </p>
      </div>

      <div className="feature-grid" style={{ marginTop: '30px' }}>
        {FEATURES_DATA.map((feat) => (
          <article key={feat.number}>
            <div className="feature-number">{feat.number}</div>
            <h3>{feat.title}</h3>
            <p>{feat.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
