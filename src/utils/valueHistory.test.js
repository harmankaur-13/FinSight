import { describe, it, expect, beforeEach } from 'vitest';
import {
  getStoredValueHistory,
  saveValueSnapshot,
  filterHistoryByTimeframe,
  generateProjectedGrowth,
  STORAGE_KEY_VALUE_HISTORY
} from './valueHistory.js';

// Setup in-memory mock for localStorage in Node environment
const storageMap = new Map();
const mockLocalStorage = {
  getItem: (key) => storageMap.get(key) || null,
  setItem: (key, val) => storageMap.set(key, String(val)),
  removeItem: (key) => storageMap.delete(key),
  clear: () => storageMap.clear()
};
globalThis.localStorage = mockLocalStorage;

describe('valueHistory helper', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  describe('getStoredValueHistory & Malformed Data Handling', () => {
    it('returns empty array when nothing is stored', () => {
      const history = getStoredValueHistory();
      expect(history).toEqual([]);
    });

    it('handles malformed JSON in localStorage gracefully without throwing', () => {
      localStorage.setItem(STORAGE_KEY_VALUE_HISTORY, '{invalid_json');
      const history = getStoredValueHistory();
      expect(history).toEqual([]);
    });

    it('handles non-array stored data gracefully', () => {
      localStorage.setItem(STORAGE_KEY_VALUE_HISTORY, JSON.stringify({ not: 'an array' }));
      const history = getStoredValueHistory();
      expect(history).toEqual([]);
    });

    it('filters out invalid or corrupt objects in the history array', () => {
      const corruptData = [
        { date: '2026-01-01', totalValue: 20000 },
        null,
        'invalid item',
        { date: 123, totalValue: 'bad' },
        { date: '2026-01-02', totalValue: 21000 }
      ];
      localStorage.setItem(STORAGE_KEY_VALUE_HISTORY, JSON.stringify(corruptData));
      const history = getStoredValueHistory();
      expect(history).toHaveLength(2);
      expect(history[0]).toEqual({ date: '2026-01-01', totalValue: 20000 });
      expect(history[1]).toEqual({ date: '2026-01-02', totalValue: 21000 });
    });
  });

  describe('saveValueSnapshot & Daily Deduplication', () => {
    it('saves a new snapshot with date and totalValue', () => {
      const result = saveValueSnapshot(25000, '2026-09-01');
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ date: '2026-09-01', totalValue: 25000 });

      const stored = getStoredValueHistory();
      expect(stored).toEqual([{ date: '2026-09-01', totalValue: 25000 }]);
    });

    it('deduplicates multiple snapshots on the same day by updating the value', () => {
      saveValueSnapshot(25000, '2026-09-01');
      saveValueSnapshot(26500, '2026-09-01'); // Same day update

      const stored = getStoredValueHistory();
      expect(stored).toHaveLength(1);
      expect(stored[0]).toEqual({ date: '2026-09-01', totalValue: 26500 });
    });

    it('records distinct snapshots for different dates in ascending order', () => {
      saveValueSnapshot(30000, '2026-09-03');
      saveValueSnapshot(20000, '2026-09-01');
      saveValueSnapshot(25000, '2026-09-02');

      const stored = getStoredValueHistory();
      expect(stored).toHaveLength(3);
      expect(stored[0].date).toBe('2026-09-01');
      expect(stored[1].date).toBe('2026-09-02');
      expect(stored[2].date).toBe('2026-09-03');
    });

    it('ignores invalid or NaN totalValue without crashing', () => {
      saveValueSnapshot(25000, '2026-09-01');
      const res = saveValueSnapshot(NaN, '2026-09-02');
      expect(res).toHaveLength(1);
      expect(res[0].totalValue).toBe(25000);
    });
  });

  describe('365-Day Cap', () => {
    it('caps total history entries at 365, keeping the most recent', () => {
      const initialHistory = [];
      const baseDate = new Date('2025-01-01');

      for (let i = 0; i < 400; i++) {
        const d = new Date(baseDate);
        d.setDate(baseDate.getDate() + i);
        initialHistory.push({
          date: d.toISOString().split('T')[0],
          totalValue: 10000 + i * 10
        });
      }
      localStorage.setItem(STORAGE_KEY_VALUE_HISTORY, JSON.stringify(initialHistory));

      // Add 401st snapshot
      const updated = saveValueSnapshot(50000, '2026-10-07');
      expect(updated.length).toBe(365);
      expect(updated[updated.length - 1]).toEqual({ date: '2026-10-07', totalValue: 50000 });
    });
  });

  describe('filterHistoryByTimeframe', () => {
    const mockHistory = [
      { date: '2025-01-01', totalValue: 10000 },
      { date: '2026-02-01', totalValue: 12000 },
      { date: '2026-05-01', totalValue: 18000 },
      { date: '2026-09-20', totalValue: 24000 },
      { date: '2026-10-01', totalValue: 25000 }
    ];
    const refDate = new Date('2026-10-07');

    it('returns all items for timeframe ALL', () => {
      const filtered = filterHistoryByTimeframe(mockHistory, 'ALL', refDate);
      expect(filtered).toHaveLength(5);
    });

    it('filters to last 1 month for 1M', () => {
      const filtered = filterHistoryByTimeframe(mockHistory, '1M', refDate);
      expect(filtered.map(i => i.date)).toEqual(['2026-09-20', '2026-10-01']);
    });

    it('filters to last 6 months for 6M', () => {
      const filtered = filterHistoryByTimeframe(mockHistory, '6M', refDate);
      expect(filtered.map(i => i.date)).toEqual(['2026-05-01', '2026-09-20', '2026-10-01']);
    });

    it('filters to last 1 year for 1Y', () => {
      const filtered = filterHistoryByTimeframe(mockHistory, '1Y', refDate);
      expect(filtered.map(i => i.date)).toEqual(['2026-02-01', '2026-05-01', '2026-09-20', '2026-10-01']);
    });
  });

  describe('generateProjectedGrowth', () => {
    it('generates month-by-month compound growth points', () => {
      const points = generateProjectedGrowth(10000, 12, 12, new Date('2026-01-01'));
      expect(points).toHaveLength(13); // month 0 to month 12
      expect(points[0].totalValue).toBe(10000);
      expect(points[0].isProjection).toBe(true);
      // At 12% annual compounding (1% monthly), year 1 value is 10000 * (1.01)^12 ~ 11268
      expect(points[12].totalValue).toBe(11268);
    });

    it('handles 0 baseValue gracefully', () => {
      const points = generateProjectedGrowth(0, 10, 6, new Date('2026-01-01'));
      expect(points).toHaveLength(7);
      expect(points.every(p => p.totalValue === 0)).toBe(true);
    });
  });
});
