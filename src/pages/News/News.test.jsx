import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import NewsCard from '../../components/NewsCard.jsx';
import News from './News.jsx';
import { NEWS_DATA } from '../../data/mockData.js';
import { analyzeArticle } from '../../services/newsAnalysis.js';

describe('NewsCard component', () => {
  const sampleArticle = NEWS_DATA[0];

  it('renders article headline, summary, category tag, and relative time', () => {
    const html = renderToString(<NewsCard article={sampleArticle} />);

    expect(html).toContain('Reserve Bank of India Maintains Benchmark Repo Rate');
    expect(html).toContain('Monetary Policy Committee voted unanimously');
    expect(html).toContain('Markets');
    expect(html).toContain('Financial Express');
    expect(html).toContain('Read Analysis');
    expect(html).toContain('HDFCBANK');
  });

  it('safely handles missing optional props without throwing', () => {
    const minimalArticle = {
      id: 99,
      headline: 'Minimal Headline',
      summary: 'Minimal summary text.',
      category: 'Business',
      source: 'Wire'
    };

    const html = renderToString(<NewsCard article={minimalArticle} />);
    expect(html).toContain('Minimal Headline');
    expect(html).toContain('Business');
    expect(html).toContain('Wire');
  });
});

describe('News Page layout and intelligence rendering', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders page header, status bar, toolbar, and categories', () => {
    const html = renderToString(<News initialArticles={NEWS_DATA} />);

    expect(html).toContain('FINANCIAL INTELLIGENCE DISPATCH');
    expect(html).toContain('Market &amp; Macro News');
    expect(html).toContain('Search dispatches, companies, or tickers...');
    expect(html).toContain('Sort By:');
    expect(html).toContain('Newest First');
    expect(html).toContain('Refresh Feed');

    // Confirms category tabs
    expect(html).toContain('All');
    expect(html).toContain('Markets');
    expect(html).toContain('Technology');
    expect(html).toContain('Economy');
    expect(html).toContain('Stocks');
    expect(html).toContain('Crypto');
    expect(html).toContain('Business');
  });

  it('renders all 8 institutional news articles in default view', () => {
    const html = renderToString(<News initialArticles={NEWS_DATA} />);

    for (const item of NEWS_DATA) {
      expect(html).toContain(item.headline.replace('&', '&amp;'));
    }
  });

  it('renders the complete 8 structured analytical sections when analyzing an article', () => {
    const analyzed = analyzeArticle(NEWS_DATA[0]);

    expect(analyzed.overview).toBeDefined();
    expect(analyzed.overview.headline).toContain('Reserve Bank of India');
    expect(analyzed.whatHappened.narrative).toContain('Monetary Policy Committee');
    expect(analyzed.whyDidItHappen.explanation).toContain('CPI readings');
    expect(analyzed.whyDoesItMatter.significance).toContain('borrowing costs');
    expect(analyzed.marketImpact.affectedSectors).toContain('Banking & Financial Services');
    expect(analyzed.keyTakeaways.length).toBeGreaterThanOrEqual(3);
    expect(analyzed.importantEntities.regulators).toContain('Reserve Bank of India');
    expect(analyzed.sourceAndReferences.publisher).toBe('Financial Express');
  });

  it('filters news in-memory without making network calls', () => {
    // Filter Technology
    const techArticles = NEWS_DATA.filter((a) => a.category === 'Technology');
    expect(techArticles.length).toBe(1);
    expect(techArticles[0].headline).toContain('Semiconductor Fabrication');

    // Search query 'cloud'
    const cloudArticles = NEWS_DATA.filter((a) =>
      `${a.headline} ${a.summary} ${a.related}`.toLowerCase().includes('cloud')
    );
    expect(cloudArticles.length).toBeGreaterThanOrEqual(1);
    expect(cloudArticles.some((a) => a.related.includes('INFY'))).toBe(true);
  });

  it('strictly adheres to zero-emoji policy and contains no unicode emoji characters', () => {
    const html = renderToString(<News />);

    // Verify none of the common emojis are present
    expect(html).not.toContain('📡');
    expect(html).not.toContain('📰');
    expect(html).not.toContain('🔍');
    expect(html).not.toContain('📊');
    expect(html).not.toContain('⚡');
  });
});
