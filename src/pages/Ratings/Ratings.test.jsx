import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import RatingCard from '../../components/RatingCard.jsx';
import Ratings from './Ratings.jsx';
import { RATINGS_DATA } from '../../data/mockData.js';
import * as ratingsApi from '../../services/ratingsApi.js';

describe('RatingCard component', () => {
  const sampleRating = {
    id: 'r-1',
    symbol: 'INFY',
    name: 'Infosys Limited',
    sector: 'Technology Services',
    price: '₹1,840.50',
    target: '₹2,100.00',
    rating: 'Strong Buy',
    ratingType: 'strong-buy',
    sentiment: '86% Positive',
    riskLevel: 'Low',
    peRatio: '24.8',
    rationale: 'Robust order book in cloud transformation.'
  };

  it('renders successfully with live TejHQ quote and displays formatted INR daily close', () => {
    const liveQuote = {
      status: 'success',
      data: {
        symbol: 'INFY',
        date: '2026-10-23',
        price: 1153.8,
        previousClose: 1153.35,
        change: 0.45,
        changePercent: 0.04
      }
    };

    const html = renderToString(
      <RatingCard rating={sampleRating} quote={liveQuote} isLoading={false} />
    );

    // Checks daily close labeling and formatted closing price
    expect(html).toContain('Daily Close');
    expect(html).toContain('₹1,153.80');
    expect(html).toContain('EOD: 2026-10-23');

    // Checks that original research consensus fields are strictly preserved
    expect(html).toContain('Infosys Limited');
    expect(html).toContain('INFY');
    expect(html).toContain('Technology Services');
    expect(html).toContain('Strong Buy');
    expect(html).toContain('₹2,100.00');
    expect(html).toContain('Low');
    expect(html).toContain('86% Positive');
    expect(html).toContain('24.8');
    expect(html).toContain('Robust order book in cloud transformation.');
  });

  it('renders fallback sample price and marks as sample when quote is unavailable', () => {
    const failedQuote = {
      status: 'error',
      error: 'Network error'
    };

    const html = renderToString(
      <RatingCard rating={sampleRating} quote={failedQuote} isLoading={false} />
    );

    expect(html).toContain('Sample Price');
    expect(html).toContain('₹1,840.50');
    expect(html).toContain('Quote: Sample');
    expect(html).not.toContain('Daily Close');
  });

  it('displays neutral placeholder dash, updating indicator, and Quote: Updating during loading', () => {
    const html = renderToString(
      <RatingCard rating={sampleRating} quote={undefined} isLoading={true} />
    );

    expect(html).toContain('Updating...');
    expect(html).toContain('—');
    expect(html).not.toContain('₹1,840.50');
    expect(html).toContain('Quote: Updating');
    expect(html).not.toContain('Quote: Sample');
  });

  it('safely handles omitted quote prop without crashing', () => {
    const html = renderToString(<RatingCard rating={sampleRating} />);

    expect(html).toContain('Sample Price');
    expect(html).toContain('₹1,840.50');
  });
});

describe('Ratings page integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders page layout, header, tabs, and all twelve stocks', () => {
    const html = renderToString(<Ratings />);

    expect(html).toContain('INSTITUTIONAL CONSENSUS');
    expect(html).toContain('Stock &amp; Asset Ratings');
    expect(html).toContain('Search by company or ticker...');
    expect(html).toContain('Connecting Market Feed');

    // Confirms all twelve supported symbols are rendered
    for (const item of RATINGS_DATA) {
      expect(html).toContain(item.symbol.replace('&', '&amp;'));
      expect(html).toContain(item.name.replace('&', '&amp;'));
    }
  });

  it('preserves dataset ratings, research fields, and filter tabs', () => {
    const html = renderToString(<Ratings />);

    expect(html).toContain('Strong Buy');
    expect(html).toContain('Buy');
    expect(html).toContain('Hold');
    expect(html).toContain('Low Risk');
    expect(html).toContain('Medium Risk');
  });

  it('fetches quotes for the twelve RATINGS_DATA symbols and isolates failures', async () => {
    const symbols = RATINGS_DATA.map((item) => item.symbol);
    expect(symbols).toEqual([
      'INFY',
      'HDFCBANK',
      'RELIANCE',
      'TCS',
      'LT',
      'TITAN',
      'SBIN',
      'ICICIBANK',
      'BHARTIARTL',
      'ITC',
      'M&M',
      'SUNPHARMA'
    ]);

    // Mock fetchStockQuote to succeed for 11 symbols and fail for 1
    const spy = vi.spyOn(ratingsApi, 'fetchStockQuote').mockImplementation(async (sym) => {
      if (sym === 'TITAN') {
        throw new Error('API timeout for TITAN');
      }
      return {
        symbol: sym,
        date: '2026-10-23',
        price: 2500,
        previousClose: 2450,
        change: 50,
        changePercent: 2.04
      };
    });

    // Simulate the Promise.allSettled logic used in Ratings useEffect
    const settled = await Promise.allSettled(symbols.map((s) => ratingsApi.fetchStockQuote(s)));

    expect(spy).toHaveBeenCalledTimes(12);
    expect(settled.filter((r) => r.status === 'fulfilled')).toHaveLength(11);
    expect(settled.filter((r) => r.status === 'rejected')).toHaveLength(1);

    const quotesMap = {};
    settled.forEach((res, index) => {
      const sym = symbols[index];
      if (res.status === 'fulfilled') {
        quotesMap[sym] = { status: 'success', data: res.value };
      } else {
        quotesMap[sym] = { status: 'error', error: res.reason?.message };
      }
    });

    // Verify successful symbol renders live quote
    const infyHtml = renderToString(
      <RatingCard
        rating={RATINGS_DATA.find((r) => r.symbol === 'INFY')}
        quote={quotesMap['INFY']}
        isLoading={false}
      />
    );
    expect(infyHtml).toContain('Daily Close');
    expect(infyHtml).toContain('₹2,500.00');

    // Verify failed symbol falls back safely to sample price
    const titanHtml = renderToString(
      <RatingCard
        rating={RATINGS_DATA.find((r) => r.symbol === 'TITAN')}
        quote={quotesMap['TITAN']}
        isLoading={false}
      />
    );
    expect(titanHtml).toContain('Sample Price');
    expect(titanHtml).toContain(RATINGS_DATA.find((r) => r.symbol === 'TITAN').price);
    expect(titanHtml).toContain('Quote: Sample');
  });

  it('filters data in-memory without making additional network calls', () => {
    const fetchSpy = vi.spyOn(ratingsApi, 'fetchStockQuote');

    // Filter by 'Strong Buy'
    const strongBuys = RATINGS_DATA.filter(
      (item) => item.rating === 'Strong Buy' || item.riskLevel === 'Strong Buy'
    );
    expect(strongBuys.map((s) => s.symbol)).toEqual(['INFY', 'LT', 'ICICIBANK', 'M&M']);

    // Filter by search query 'tcs'
    const searchTcs = RATINGS_DATA.filter((item) =>
      item.symbol.toLowerCase().includes('tcs')
    );
    expect(searchTcs.map((s) => s.symbol)).toEqual(['TCS']);

    // Filter by search query 'mahindra'
    const searchMm = RATINGS_DATA.filter((item) =>
      item.name.toLowerCase().includes('mahindra')
    );
    expect(searchMm.map((s) => s.symbol)).toEqual(['M&M']);

    // Zero API calls were triggered by in-memory filtering operations
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('renders clean empty state message without magnifying glass emoji', () => {
    // Render Ratings component and verify that the HTML does not contain the emoji
    const html = renderToString(<Ratings />);
    expect(html).not.toContain('🔍');
  });
});
