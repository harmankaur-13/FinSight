import React, { useState } from 'react';
import RatingCard from '../../components/RatingCard';
import { RATINGS_DATA } from '../../data/mockData';

export default function Ratings() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredRatings = RATINGS_DATA.filter((item) => {
    const matchesFilter = filter === 'All' || item.rating === filter || item.riskLevel === filter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.symbol.toLowerCase().includes(search.toLowerCase()) ||
                          item.sector.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="container" style={{ padding: '40px 0 90px' }}>
      <div className="page-header">
        <span className="eyebrow eyebrow-gold">INSTITUTIONAL CONSENSUS</span>
        <h1 className="page-title">Stock & Asset Ratings</h1>
        <p className="page-subtitle">
          Independent quantitative ratings, 12-month analyst targets, price-to-earnings valuations, and risk matrices.
        </p>
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
          <RatingCard key={rating.id} rating={rating} />
        ))}
      </div>
    </div>
  );
}
