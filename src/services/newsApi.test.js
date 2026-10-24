import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatNewsDate,
  normalizeCategory,
  normalizeFinnhubArticle,
  fetchMarketNews
} from './newsApi.js';

describe('formatNewsDate', () => {
  it('returns "Recent" when timestamp is null or missing', () => {
    expect(formatNewsDate(null)).toBe('Recent');
    expect(formatNewsDate(undefined)).toBe('Recent');
    expect(formatNewsDate('invalid')).toBe('Recent');
  });

  it('formats a valid UNIX timestamp into a readable date', () => {
    // 1725667200 -> Sep 7, 2024 (UTC)
    const formatted = formatNewsDate(1725667200);
    expect(typeof formatted).toBe('string');
    expect(formatted).not.toBe('Recent');
    expect(formatted).toMatch(/[A-Za-z]{3}\s\d{2},\s\d{4}/);
  });
});

describe('normalizeCategory', () => {
  it('safely handles missing, null, or invalid categories', () => {
    expect(normalizeCategory(null)).toBe('Markets');
    expect(normalizeCategory(undefined)).toBe('Markets');
    expect(normalizeCategory('')).toBe('Markets');
    expect(normalizeCategory(123)).toBe('Markets');
  });

  it('normalizes common Finnhub category strings', () => {
    expect(normalizeCategory('general')).toBe('Markets');
    expect(normalizeCategory('top news')).toBe('Markets');
    expect(normalizeCategory('forex')).toBe('Markets');
    expect(normalizeCategory('company')).toBe('Business');
    expect(normalizeCategory('business')).toBe('Business');
    expect(normalizeCategory('crypto')).toBe('Crypto');
    expect(normalizeCategory('technology')).toBe('Technology');
    expect(normalizeCategory('tech')).toBe('Technology');
    expect(normalizeCategory('stocks')).toBe('Stocks');
    expect(normalizeCategory('economy')).toBe('Economy');
  });

  it('is case-insensitive and trims whitespace', () => {
    expect(normalizeCategory('  GENERAL  ')).toBe('Markets');
    expect(normalizeCategory('CRYPTO')).toBe('Crypto');
    expect(normalizeCategory('tEchNoLogy')).toBe('Technology');
  });
});

describe('normalizeFinnhubArticle', () => {
  it('returns null for null or non-object inputs', () => {
    expect(normalizeFinnhubArticle(null)).toBeNull();
    expect(normalizeFinnhubArticle('string')).toBeNull();
    expect(normalizeFinnhubArticle(123)).toBeNull();
  });

  it('correctly maps raw Finnhub fields to the FinSight card schema', () => {
    const raw = {
      id: 101,
      category: 'top news',
      datetime: 1725667200,
      headline: 'Tech blue-chips rally on cloud demand',
      summary: 'Enterprise software sales surged in the latest quarter.',
      source: 'Financial Times',
      url: 'https://example.com/article/101'
    };

    const normalized = normalizeFinnhubArticle(raw);

    expect(normalized).toEqual({
      id: 101,
      category: 'Markets', // 'top news' maps cleanly to 'Markets'
      headline: 'Tech blue-chips rally on cloud demand',
      summary: 'Enterprise software sales surged in the latest quarter.',
      source: 'Financial Times',
      date: expect.any(String),
      readTime: expect.stringMatching(/\d+\smin read/),
      url: 'https://example.com/article/101'
    });
  });

  it('provides safe fallback values for missing optional fields', () => {
    const raw = {
      id: 202
      // missing category, datetime, headline, summary, source, url
    };

    const normalized = normalizeFinnhubArticle(raw, 0);

    expect(normalized.id).toBe(202);
    expect(normalized.category).toBe('Markets');
    expect(normalized.headline).toBe('Market Update');
    expect(normalized.summary).toBe('');
    expect(normalized.source).toBe('Market News');
    expect(normalized.date).toBe('Recent');
    expect(normalized.url).toBe('');
  });

  it('preserves custom category names with capital letter', () => {
    const raw = {
      id: 303,
      category: 'crypto'
    };
    const normalized = normalizeFinnhubArticle(raw);
    expect(normalized.category).toBe('Crypto');
  });
});

describe('fetchMarketNews', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('throws an error if API key is missing or blank', async () => {
    await expect(fetchMarketNews('general', '')).rejects.toThrow(
      'Finnhub API key is missing. Add VITE_FINNHUB_API_KEY to your local .env file.'
    );
  });

  it('throws an error if API key is the default template placeholder', async () => {
    await expect(fetchMarketNews('general', 'your_finnhub_api_key_here')).rejects.toThrow(
      'Finnhub API key is missing. Add VITE_FINNHUB_API_KEY to your local .env file.'
    );
  });

  it('throws rate limit error when status is 429', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests'
    }));

    await expect(fetchMarketNews('general', 'valid_test_key')).rejects.toThrow(
      'Finnhub API rate limit reached (60 calls/minute on free tier).'
    );
  });

  it('throws invalid key error when status is 401 or 403', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized'
    }));

    await expect(fetchMarketNews('general', 'wrong_key')).rejects.toThrow(
      'Invalid or unauthorized Finnhub API key.'
    );
  });

  it('handles network failure gracefully', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network down')));

    await expect(fetchMarketNews('general', 'test_key')).rejects.toThrow(
      'Network error: Unable to reach Finnhub API.'
    );
  });

  it('throws error when Finnhub returns an empty array', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue([])
    }));

    await expect(fetchMarketNews('general', 'test_key')).rejects.toThrow(
      'No news articles returned from Finnhub.'
    );
  });

  it('successfully fetches and normalizes articles when API succeeds', async () => {
    const mockArticles = [
      {
        id: 1,
        category: 'general',
        datetime: 1725667200,
        headline: 'Global markets hold steady',
        summary: 'Equities remained resilient today.',
        source: 'Reuters',
        url: 'https://reuters.com/article/1'
      }
    ];

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(mockArticles)
    }));

    const result = await fetchMarketNews('general', 'valid_test_key');

    expect(result).toHaveLength(1);
    expect(result[0].headline).toBe('Global markets hold steady');
    expect(result[0].source).toBe('Reuters');
    expect(result[0].url).toBe('https://reuters.com/article/1');
  });
});
