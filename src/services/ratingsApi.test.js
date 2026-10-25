import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  TEJHQ_BASE_URL,
  SUPPORTED_SYMBOLS,
  isSupportedSymbol,
  formatCurrencyINR,
  normalizeTejHqRow,
  fetchStockQuote
} from './ratingsApi.js';

describe('SUPPORTED_SYMBOLS and isSupportedSymbol', () => {
  it('contains the exact 12 FinSight Ratings symbols', () => {
    expect(SUPPORTED_SYMBOLS).toEqual([
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
  });

  it('correctly identifies supported symbols regardless of casing or whitespace', () => {
    expect(isSupportedSymbol('INFY')).toBe(true);
    expect(isSupportedSymbol('hdfcbank')).toBe(true);
    expect(isSupportedSymbol(' Reliance ')).toBe(true);
    expect(isSupportedSymbol('tcs')).toBe(true);
    expect(isSupportedSymbol('lt')).toBe(true);
    expect(isSupportedSymbol('Titan')).toBe(true);
    expect(isSupportedSymbol('sbin')).toBe(true);
    expect(isSupportedSymbol('icicibank')).toBe(true);
    expect(isSupportedSymbol('BhartiAirtel')).toBe(false);
    expect(isSupportedSymbol('bhartiartl')).toBe(true);
    expect(isSupportedSymbol('itc')).toBe(true);
    expect(isSupportedSymbol('m&m')).toBe(true);
    expect(isSupportedSymbol(' M&M ')).toBe(true);
    expect(isSupportedSymbol('sunpharma')).toBe(true);
  });

  it('rejects unsupported symbols, null, undefined, and non-string inputs', () => {
    expect(isSupportedSymbol('AAPL')).toBe(false);
    expect(isSupportedSymbol('GOOGL')).toBe(false);
    expect(isSupportedSymbol('SPY')).toBe(false);
    expect(isSupportedSymbol('')).toBe(false);
    expect(isSupportedSymbol('   ')).toBe(false);
    expect(isSupportedSymbol(null)).toBe(false);
    expect(isSupportedSymbol(undefined)).toBe(false);
    expect(isSupportedSymbol(123)).toBe(false);
    expect(isSupportedSymbol({})).toBe(false);
  });
});

describe('formatCurrencyINR', () => {
  it('formats numbers into Indian Rupee currency strings', () => {
    expect(formatCurrencyINR(1153.8)).toBe('₹1,153.80');
    expect(formatCurrencyINR(3647)).toBe('₹3,647.00');
    expect(formatCurrencyINR(1840.5)).toBe('₹1,840.50');
  });

  it('returns null for non-numeric, null, undefined, or NaN inputs', () => {
    expect(formatCurrencyINR(null)).toBeNull();
    expect(formatCurrencyINR(undefined)).toBeNull();
    expect(formatCurrencyINR('invalid')).toBeNull();
    expect(formatCurrencyINR(NaN)).toBeNull();
  });
});

describe('normalizeTejHqRow', () => {
  it('normalizes a valid row with positive gain correctly', () => {
    const rawRow = {
      date: '2024-04-15',
      open: 1480.0,
      high: 1515.0,
      low: 1475.0,
      close: 1500.0,
      last: 1502.0,
      prev_close: 1450.0,
      volume: 1200000
    };

    const normalized = normalizeTejHqRow('INFY', rawRow);

    expect(normalized).toEqual({
      symbol: 'INFY',
      date: '2024-04-15',
      price: 1500.0,
      previousClose: 1450.0,
      change: 50.0,
      changePercent: 3.45 // (50 / 1450) * 100 = 3.4482... -> 3.45
    });
  });

  it('normalizes a valid row with loss correctly', () => {
    const rawRow = {
      date: '2024-04-15',
      close: 1400.0,
      prev_close: 1450.0
    };

    const normalized = normalizeTejHqRow('INFY', rawRow);

    expect(normalized).toEqual({
      symbol: 'INFY',
      date: '2024-04-15',
      price: 1400.0,
      previousClose: 1450.0,
      change: -50.0,
      changePercent: -3.45
    });
  });

  it('safely handles missing or undefined prev_close without throwing', () => {
    const rawRow = {
      date: '2024-04-15',
      close: 1500.0
    };

    const normalized = normalizeTejHqRow('INFY', rawRow);

    expect(normalized).toEqual({
      symbol: 'INFY',
      date: '2024-04-15',
      price: 1500.0,
      previousClose: null,
      change: null,
      changePercent: null
    });
  });

  it('safely handles zero or negative prev_close without dividing by zero', () => {
    const rawRowZero = {
      date: '2024-04-15',
      close: 1500.0,
      prev_close: 0
    };
    const normalizedZero = normalizeTejHqRow('INFY', rawRowZero);
    expect(normalizedZero.change).toBeNull();
    expect(normalizedZero.changePercent).toBeNull();

    const rawRowNeg = {
      date: '2024-04-15',
      close: 1500.0,
      prev_close: -50
    };
    const normalizedNeg = normalizeTejHqRow('INFY', rawRowNeg);
    expect(normalizedNeg.change).toBeNull();
    expect(normalizedNeg.changePercent).toBeNull();
  });

  it('throws when row is null or not an object', () => {
    expect(() => normalizeTejHqRow('INFY', null)).toThrow(/Invalid data row received/);
    expect(() => normalizeTejHqRow('INFY', 'invalid')).toThrow(/Invalid data row received/);
  });

  it('throws when date is missing or invalid', () => {
    expect(() => normalizeTejHqRow('INFY', { close: 1500 })).toThrow(/Missing or invalid date/);
    expect(() => normalizeTejHqRow('INFY', { date: 'not-a-date', close: 1500 })).toThrow(/Missing or invalid date/);
  });

  it('throws when close price is non-positive or invalid', () => {
    expect(() => normalizeTejHqRow('INFY', { date: '2024-04-15' })).toThrow(/Invalid closing price/);
    expect(() => normalizeTejHqRow('INFY', { date: '2024-04-15', close: 'invalid' })).toThrow(/Invalid closing price/);
    expect(() => normalizeTejHqRow('INFY', { date: '2024-04-15', close: 0 })).toThrow(/Invalid closing price/);
    expect(() => normalizeTejHqRow('INFY', { date: '2024-04-15', close: -100 })).toThrow(/Invalid closing price/);
  });
});

describe('fetchStockQuote', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('rejects unsupported symbols without making any network request', async () => {
    const mockFetch = vi.fn();

    await expect(fetchStockQuote('AAPL', mockFetch)).rejects.toThrow(
      `Unsupported symbol: "AAPL". Supported symbols are: ${SUPPORTED_SYMBOLS.join(', ')}.`
    );
    await expect(fetchStockQuote('MSFT', mockFetch)).rejects.toThrow(/Unsupported symbol/);
    await expect(fetchStockQuote('', mockFetch)).rejects.toThrow(/Invalid symbol provided/);
    await expect(fetchStockQuote(null, mockFetch)).rejects.toThrow(/Invalid symbol provided/);

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('successfully fetches and normalizes quotes for all twelve supported symbols', async () => {
    for (const symbol of SUPPORTED_SYMBOLS) {
      const mockPayload = {
        data: [
          {
            date: '2024-04-15',
            open: 2000,
            high: 2050,
            low: 1980,
            close: 2020,
            prev_close: 2000,
            volume: 500000
          }
        ]
      };

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockPayload)
      });

      const quote = await fetchStockQuote(symbol, mockFetch);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(`${TEJHQ_BASE_URL}/${encodeURIComponent(symbol)}`);
      expect(quote).toEqual({
        symbol,
        date: '2024-04-15',
        price: 2020,
        previousClose: 2000,
        change: 20,
        changePercent: 1.0
      });
    }
  });

  it('encodes symbols with special characters like M&M safely in the request URL', async () => {
    const mockPayload = {
      data: [{ date: '2024-04-15', close: 2850, prev_close: 2800 }]
    };
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(mockPayload)
    });

    const quote = await fetchStockQuote('M&M', mockFetch);
    expect(mockFetch).toHaveBeenCalledWith(`${TEJHQ_BASE_URL}/M%26M`);
    expect(quote.symbol).toBe('M&M');
    expect(quote.price).toBe(2850);
  });

  it('correctly selects the most recent row when data rows are out of chronological order', async () => {
    const mockPayload = {
      data: [
        { date: '2024-04-10', close: 1400, prev_close: 1390 },
        { date: '2024-04-18', close: 1550, prev_close: 1520 }, // latest row
        { date: '2024-04-12', close: 1420, prev_close: 1400 },
        { date: '2024-04-16', close: 1500, prev_close: 1480 },
        { date: '2024-04-05', close: 1380, prev_close: 1370 }
      ]
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(mockPayload)
    });

    const quote = await fetchStockQuote('INFY', mockFetch);

    expect(quote.date).toBe('2024-04-18');
    expect(quote.price).toBe(1550);
    expect(quote.previousClose).toBe(1520);
    expect(quote.change).toBe(30);
    expect(quote.changePercent).toBe(1.97);
  });

  it('works with the default global fetch when customFetch is omitted', async () => {
    const mockPayload = {
      data: [{ date: '2024-04-15', close: 3000, prev_close: 2950 }]
    };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(mockPayload)
    }));

    const quote = await fetchStockQuote('TCS');
    expect(quote.symbol).toBe('TCS');
    expect(quote.price).toBe(3000);
    expect(fetch).toHaveBeenCalledWith(`${TEJHQ_BASE_URL}/TCS`);
  });

  it('handles network failure cleanly', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Failed to connect'));

    await expect(fetchStockQuote('RELIANCE', mockFetch)).rejects.toThrow(
      'Network error: Unable to reach TejHQ API for symbol RELIANCE.'
    );
  });

  it('handles unsuccessful HTTP response status codes', async () => {
    const mockFetch500 = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });

    await expect(fetchStockQuote('HDFCBANK', mockFetch500)).rejects.toThrow(
      'TejHQ API error for HDFCBANK: Received HTTP 500 (Internal Server Error).'
    );

    const mockFetch404 = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    });

    await expect(fetchStockQuote('LT', mockFetch404)).rejects.toThrow(
      'TejHQ API error for LT: Received HTTP 404 (Not Found).'
    );
  });

  it('handles malformed JSON payload', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockRejectedValue(new Error('Unexpected token < in JSON'))
    });

    await expect(fetchStockQuote('TITAN', mockFetch)).rejects.toThrow(
      'Failed to parse TejHQ response as JSON for symbol TITAN.'
    );
  });

  it('handles empty or non-array data in payload', async () => {
    const mockEmptyData = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ data: [] })
    });

    await expect(fetchStockQuote('INFY', mockEmptyData)).rejects.toThrow(
      'No market data returned for symbol INFY.'
    );

    const mockNullData = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ data: null })
    });

    await expect(fetchStockQuote('INFY', mockNullData)).rejects.toThrow(
      'No market data returned for symbol INFY.'
    );
  });

  it('handles payload where rows contain invalid or missing dates', async () => {
    const mockInvalidDates = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({
        data: [
          { close: 1000 },
          { date: null, close: 1000 },
          { date: 'invalid-date', close: 1000 }
        ]
      })
    });

    await expect(fetchStockQuote('INFY', mockInvalidDates)).rejects.toThrow(
      'No valid date entries found in data for symbol INFY.'
    );
  });

  it('handles payload where latest row has invalid price', async () => {
    const mockBadPrice = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({
        data: [{ date: '2024-04-15', close: -50, prev_close: 100 }]
      })
    });

    await expect(fetchStockQuote('INFY', mockBadPrice)).rejects.toThrow(
      'Invalid closing price received for symbol INFY: -50'
    );
  });
});
