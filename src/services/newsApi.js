/**
 * FinSight - Market News API Service
 * 
 * Fetches real-time financial market news from the Finnhub API:
 * https://finnhub.io/docs/api/market-news
 * 
 * Demonstrates frontend concepts:
 * - Environment variables (import.meta.env)
 * - Constructing query parameters (URLSearchParams)
 * - Asynchronous HTTP requests (fetch, async/await, Promises)
 * - HTTP status checking and error handling
 * - Data normalization (mapping API responses to component props)
 */

const FINNHUB_NEWS_URL = 'https://finnhub.io/api/v1/news';

/**
 * Normalizes category strings from Finnhub or raw input into standard FinSight categories.
 * Handles missing values, case-insensitivity, and aliases safely.
 * 
 * @param {string|null} cat - Raw category string
 * @returns {string} Standardized category name (e.g. 'Markets', 'Crypto', 'Technology')
 */
export function normalizeCategory(cat) {
  if (!cat || typeof cat !== 'string') {
    return 'Markets';
  }

  const clean = cat.trim().toLowerCase();
  if (clean === 'general' || clean === 'top news' || clean === 'forex') {
    return 'Markets';
  }
  if (clean === 'company' || clean === 'merger' || clean === 'business') {
    return 'Business';
  }
  if (clean === 'crypto') {
    return 'Crypto';
  }
  if (clean === 'technology' || clean === 'tech') {
    return 'Technology';
  }
  if (clean === 'stocks' || clean === 'stock') {
    return 'Stocks';
  }
  if (clean === 'economy') {
    return 'Economy';
  }

  // Capitalize first letter for any other category
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

/**
 * Formats a UNIX timestamp (seconds) into a clean, human-readable date.
 * Example: 1729656000 -> "Oct 23, 2026"
 * 
 * @param {number|null} unixTimestamp - Epoch time in seconds from Finnhub
 * @returns {string} Formatted date string or 'Recent'
 */
export function formatNewsDate(unixTimestamp) {
  if (!unixTimestamp || typeof unixTimestamp !== 'number') {
    return 'Recent';
  }

  try {
    // JavaScript Date expects milliseconds, so multiply seconds by 1000
    const dateObj = new Date(unixTimestamp * 1000);
    if (isNaN(dateObj.getTime())) {
      return 'Recent';
    }

    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  } catch {
    return 'Recent';
  }
}

/**
 * Normalizes a single Finnhub article object into FinSight's internal news structure.
 * 
 * Finnhub raw fields:
 * - id: number
 * - category: string (e.g. "top news", "general")
 * - datetime: number (UNIX timestamp in seconds)
 * - headline: string
 * - summary: string
 * - source: string (e.g. "Yahoo", "Bloomberg")
 * - url: string (link to original article)
 * 
 * @param {object} raw - Raw article object from Finnhub
 * @param {number} index - Position index for fallback unique ID
 * @returns {object|null} Normalized article matching FinSight's card schema
 */
export function normalizeFinnhubArticle(raw, index = 0) {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  // 1. Format publication date
  const date = formatNewsDate(raw.datetime);

  // 2. Standardize category for display safely
  const category = normalizeCategory(raw.category);

  // 3. Estimate reading time from text length (~180 words per minute)
  const combinedText = `${raw.headline || ''} ${raw.summary || ''}`.trim();
  const wordCount = combinedText ? combinedText.split(/\s+/).length : 0;
  const estimatedMins = Math.max(1, Math.min(10, Math.ceil(wordCount / 60)));
  const readTime = `${estimatedMins} min read`;

  return {
    id: raw.id || `finnhub-${index + 1}-${raw.datetime || Date.now()}`,
    category,
    headline: typeof raw.headline === 'string' && raw.headline.trim() 
      ? raw.headline.trim() 
      : 'Market Update',
    summary: typeof raw.summary === 'string' ? raw.summary.trim() : '',
    source: typeof raw.source === 'string' && raw.source.trim() 
      ? raw.source.trim() 
      : 'Market News',
    date,
    readTime,
    url: typeof raw.url === 'string' ? raw.url.trim() : ''
  };
}

/**
 * Fetches market news articles from Finnhub and returns normalized data.
 * 
 * @param {string} category - Finnhub news category (default: 'general')
 * @param {string|null} customApiKey - Optional API key override (useful for testing)
 * @returns {Promise<Array>} List of normalized articles
 * @throws {Error} Clear, descriptive error if key is missing, network fails, or rate limit hit
 */
export async function fetchMarketNews(category = 'general', customApiKey = null) {
  // Step 1: Read API key from Vite environment variables (or test override)
  const apiKey = (customApiKey !== null ? customApiKey : import.meta.env.VITE_FINNHUB_API_KEY) || '';

  // Step 2: Validate API key before initiating any network request
  if (!apiKey || apiKey.trim() === '' || apiKey.trim() === 'your_finnhub_api_key_here') {
    throw new Error('Finnhub API key is missing. Add VITE_FINNHUB_API_KEY to your local .env file.');
  }

  // Step 3: Build query string using URLSearchParams
  const params = new URLSearchParams({
    category: category || 'general',
    token: apiKey.trim()
  });
  const endpoint = `${FINNHUB_NEWS_URL}?${params.toString()}`;

  // Step 4: Perform the HTTP request with error handling
  let response;
  try {
    response = await fetch(endpoint);
  } catch (networkError) {
    throw new Error('Network error: Unable to reach Finnhub API. Please check your internet connection.');
  }

  // Step 5: Check HTTP status code
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Finnhub API rate limit reached (60 calls/minute on free tier). Please wait a moment and try again.');
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error('Invalid or unauthorized Finnhub API key. Please check your VITE_FINNHUB_API_KEY.');
    }
    throw new Error(`Finnhub API request failed with HTTP status ${response.status}.`);
  }

  // Step 6: Parse JSON payload safely
  let data;
  try {
    data = await response.json();
  } catch (parseError) {
    throw new Error('Failed to parse Finnhub response as JSON.');
  }

  // Step 7: Verify data structure
  if (!Array.isArray(data)) {
    throw new Error('Unexpected response format: Finnhub did not return a list of articles.');
  }

  if (data.length === 0) {
    throw new Error('No news articles returned from Finnhub.');
  }

  // Step 8: Normalize articles into FinSight schema
  const normalizedArticles = data
    .map((item, index) => normalizeFinnhubArticle(item, index))
    .filter(Boolean);

  if (normalizedArticles.length === 0) {
    throw new Error('No valid news articles could be processed from the response.');
  }

  return normalizedArticles;
}
