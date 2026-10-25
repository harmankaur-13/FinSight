/**
 * FinSight - TejHQ Ratings & Stock Market API Service
 * 
 * Fetches free, keyless daily OHLCV market quotes for Indian equities (NSE)
 * from TejHQ: https://api.tejhq.dev/v1/ohlcv/nse/{SYMBOL}
 * 
 * Features:
 * - Keyless REST requests (no API key or auth token required)
 * - Strict symbol whitelist validation before URL construction
 * - Date-based ordering to reliably extract the latest row
 * - Safe change and percentage calculation against previous close
 * - Comprehensive error handling for network, HTTP, and data shape anomalies
 */

export const TEJHQ_BASE_URL = 'https://api.tejhq.dev/v1/ohlcv/nse';

/**
 * Supported stock symbols corresponding to FinSight's Ratings page equities.
 * Strictly whitelisted to avoid interpolating arbitrary inputs into endpoints.
 */
export const SUPPORTED_SYMBOLS = Object.freeze([
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

/**
 * Checks whether a given symbol is currently supported.
 * 
 * @param {string} symbol - Stock ticker to check
 * @returns {boolean} True if symbol is supported
 */
export function isSupportedSymbol(symbol) {
  if (!symbol || typeof symbol !== 'string') {
    return false;
  }
  return SUPPORTED_SYMBOLS.includes(symbol.trim().toUpperCase());
}

/**
 * Formats a numeric price into standard Indian Rupee currency representation.
 * 
 * @param {number} amount - Numeric value to format
 * @returns {string|null} Formatted INR currency string (e.g. "₹1,840.50") or null
 */
export function formatCurrencyINR(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return null;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Normalizes a raw TejHQ daily OHLCV row into a clean, predictable quote object.
 * 
 * @param {string} symbol - Validated uppercase stock symbol
 * @param {object} row - Raw OHLCV row from TejHQ data array
 * @returns {object} Normalized quote object
 * @throws {Error} If row is missing, date is invalid, or price is non-positive
 */
export function normalizeTejHqRow(symbol, row) {
  if (!row || typeof row !== 'object') {
    throw new Error(`Invalid data row received for symbol ${symbol}.`);
  }

  if (!row.date || typeof row.date !== 'string' || isNaN(new Date(row.date).getTime())) {
    throw new Error(`Missing or invalid date in market row for symbol ${symbol}.`);
  }

  const price = Number(row.close);
  if (isNaN(price) || price <= 0) {
    throw new Error(`Invalid closing price received for symbol ${symbol}: ${row.close}`);
  }

  const prevCloseRaw = row.prev_close;
  const previousClose = prevCloseRaw !== undefined && prevCloseRaw !== null && !isNaN(Number(prevCloseRaw))
    ? Number(prevCloseRaw)
    : null;

  let change = null;
  let changePercent = null;

  if (typeof previousClose === 'number' && previousClose > 0) {
    change = Number((price - previousClose).toFixed(2));
    changePercent = Number(((change / previousClose) * 100).toFixed(2));
  }

  return {
    symbol,
    date: row.date,
    price,
    previousClose,
    change,
    changePercent
  };
}

/**
 * Fetches the latest available quote for a supported stock symbol from TejHQ.
 * 
 * @param {string} symbol - Ticker symbol (e.g. 'INFY', 'TCS')
 * @param {Function} [customFetch=fetch] - Optional fetch function for testing
 * @returns {Promise<object>} Normalized quote object with latest price & change
 * @throws {Error} Descriptive error on validation failure, network issue, or invalid data
 */
export async function fetchStockQuote(symbol, customFetch = fetch) {
  // 1. Validate symbol against supported whitelist before any network request
  if (!symbol || typeof symbol !== 'string') {
    throw new Error(`Invalid symbol provided: "${symbol}". Symbol must be a non-empty string.`);
  }

  const cleanSymbol = symbol.trim().toUpperCase();
  if (!SUPPORTED_SYMBOLS.includes(cleanSymbol)) {
    throw new Error(
      `Unsupported symbol: "${symbol}". Supported symbols are: ${SUPPORTED_SYMBOLS.join(', ')}.`
    );
  }

  // 2. Build URL safely with whitelisted symbol (encodeURIComponent ensures characters like '&' in 'M&M' are URL-safe)
  const endpoint = `${TEJHQ_BASE_URL}/${encodeURIComponent(cleanSymbol)}`;

  // 3. Perform network request
  let response;
  try {
    response = await customFetch(endpoint);
  } catch (networkError) {
    throw new Error(`Network error: Unable to reach TejHQ API for symbol ${cleanSymbol}.`);
  }

  // 4. Verify HTTP response status
  if (!response.ok) {
    throw new Error(
      `TejHQ API error for ${cleanSymbol}: Received HTTP ${response.status} (${response.statusText || 'Request failed'}).`
    );
  }

  // 5. Parse JSON payload
  let payload;
  try {
    payload = await response.json();
  } catch (parseError) {
    throw new Error(`Failed to parse TejHQ response as JSON for symbol ${cleanSymbol}.`);
  }

  // 6. Verify payload contains non-empty data array
  if (!payload || typeof payload !== 'object' || !Array.isArray(payload.data) || payload.data.length === 0) {
    throw new Error(`No market data returned for symbol ${cleanSymbol}.`);
  }

  // 7. Find the row with the most recent date (do not assume array is presorted)
  let latestRow = null;
  let latestTimestamp = -Infinity;

  for (const row of payload.data) {
    if (!row || !row.date || typeof row.date !== 'string') continue;
    const ts = new Date(row.date).getTime();
    if (!isNaN(ts) && ts > latestTimestamp) {
      latestTimestamp = ts;
      latestRow = row;
    }
  }

  if (!latestRow || latestTimestamp === -Infinity) {
    throw new Error(`No valid date entries found in data for symbol ${cleanSymbol}.`);
  }

  // 8. Normalize and return the latest row
  return normalizeTejHqRow(cleanSymbol, latestRow);
}
