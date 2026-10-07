// Portfolio Value History & Projection Utilities for FinSight

export const STORAGE_KEY_VALUE_HISTORY = 'finsight_value_history';

function getStorage() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
    if (typeof localStorage !== 'undefined') return localStorage;
  } catch (e) {
    return null;
  }
  return null;
}

/**
 * Safely load and validate portfolio value history from localStorage
 * Handles missing, malformed, or non-array data gracefully.
 *
 * @param {string} storageKey - localStorage key
 * @returns {Array<{ date: string, totalValue: number }>} Sorted history array
 */
export function getStoredValueHistory(storageKey = STORAGE_KEY_VALUE_HISTORY) {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const saved = storage.getItem(storageKey);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    // Filter and sanitize valid entries
    return parsed
      .filter((item) => item && typeof item === 'object' && typeof item.date === 'string' && !isNaN(Number(item.totalValue)))
      .map((item) => ({
        date: item.date.trim(),
        totalValue: Math.round(Number(item.totalValue))
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (e) {
    return [];
  }
}

/**
 * Save a daily portfolio value snapshot to localStorage
 * - Deduplicates to max 1 snapshot per day (updates value if date matches)
 * - Caps history at 365 entries (most recent 365 days)
 *
 * @param {number} totalValue - Current total portfolio value in ₹
 * @param {string|null} dateStr - Optional ISO date string (YYYY-MM-DD), defaults to today
 * @param {string} storageKey - localStorage key
 * @returns {Array<{ date: string, totalValue: number }>} Updated history array
 */
export function saveValueSnapshot(totalValue, dateStr = null, storageKey = STORAGE_KEY_VALUE_HISTORY) {
  if (totalValue === undefined || totalValue === null || isNaN(Number(totalValue))) {
    return getStoredValueHistory(storageKey);
  }

  const numVal = Math.round(Number(totalValue));
  const date = dateStr ? String(dateStr).trim() : new Date().toISOString().split('T')[0];

  const currentHistory = getStoredValueHistory(storageKey);

  // Check if snapshot for this date already exists
  const existingIdx = currentHistory.findIndex((item) => item.date === date);

  let updatedHistory;
  if (existingIdx >= 0) {
    // Update existing snapshot for the day
    updatedHistory = [...currentHistory];
    updatedHistory[existingIdx] = { date, totalValue: numVal };
  } else {
    // Append new snapshot
    updatedHistory = [...currentHistory, { date, totalValue: numVal }];
  }

  // Sort by date ascending
  updatedHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Cap at most recent 365 entries
  if (updatedHistory.length > 365) {
    updatedHistory = updatedHistory.slice(updatedHistory.length - 365);
  }

  const storage = getStorage();
  if (storage) {
    try {
      storage.setItem(storageKey, JSON.stringify(updatedHistory));
    } catch (e) {
      // Silent fail in non-storage environments
    }
  }

  return updatedHistory;
}

/**
 * Filter history items by timeframe (1M, 6M, 1Y, ALL)
 *
 * @param {Array<{ date: string, totalValue: number }>} history
 * @param {'1M'|'6M'|'1Y'|'ALL'} timeframe
 * @param {Date|string} referenceDate
 * @returns {Array<{ date: string, totalValue: number }>} Filtered history
 */
export function filterHistoryByTimeframe(history = [], timeframe = '1Y', referenceDate = new Date()) {
  if (!Array.isArray(history) || history.length === 0) return [];
  if (timeframe === 'ALL') return history;

  const now = new Date(referenceDate);
  const cutoff = new Date(now);

  if (timeframe === '1M') {
    cutoff.setMonth(now.getMonth() - 1);
  } else if (timeframe === '6M') {
    cutoff.setMonth(now.getMonth() - 6);
  } else if (timeframe === '1Y') {
    cutoff.setFullYear(now.getFullYear() - 1);
  }

  const filtered = history.filter((item) => new Date(item.date).getTime() >= cutoff.getTime());
  return filtered.length > 0 ? filtered : history;
}

/**
 * Generate compound-growth projection points when history has fewer than 2 data points
 * Clearly labeled as projected data, not real performance.
 *
 * @param {number} baseValue - Current portfolio value in ₹
 * @param {number} expectedAnnualReturn - Annual return % (e.g. 10 for 10%)
 * @param {number} months - Number of future months to project (default 12)
 * @param {Date|string} startDate - Starting date for projection
 * @returns {Array<{ date: string, totalValue: number, isProjection: true, monthIndex: number }>}
 */
export function generateProjectedGrowth(baseValue = 0, expectedAnnualReturn = 10, months = 12, startDate = new Date()) {
  const val = Math.max(0, Number(baseValue) || 0);
  const rate = Number(expectedAnnualReturn) || 10;
  const count = Math.max(1, Math.min(60, Number(months) || 12));
  const points = [];

  const start = new Date(startDate);
  const r = rate / 100 / 12; // Monthly compounding rate

  for (let m = 0; m <= count; m++) {
    const d = new Date(start);
    d.setMonth(start.getMonth() + m);
    const dateLabel = d.toISOString().split('T')[0];

    // Compound formula: V0 * (1 + r)^m
    const projectedVal = Math.round(val * Math.pow(1 + r, m));

    points.push({
      date: dateLabel,
      totalValue: projectedVal,
      isProjection: true,
      monthIndex: m
    });
  }

  return points;
}
