import { describe, it, expect } from 'vitest';
import {
  calculateRelativeTime,
  formatFullTimestamp,
  extractEntities,
  extractQuantitativeFacts,
  analyzeArticle
} from './newsAnalysis.js';

describe('newsAnalysis service', () => {
  describe('calculateRelativeTime', () => {
    it('returns "Recently" for null or undefined input', () => {
      expect(calculateRelativeTime(null)).toBe('Recently');
      expect(calculateRelativeTime(undefined)).toBe('Recently');
      expect(calculateRelativeTime('invalid-date')).toBe('Recently');
    });

    it('calculates relative time for recent UNIX timestamps', () => {
      const nowSeconds = Math.floor(Date.now() / 1000);
      expect(calculateRelativeTime(nowSeconds - 30)).toBe('Just now');
      expect(calculateRelativeTime(nowSeconds - 180)).toBe('3m ago');
      expect(calculateRelativeTime(nowSeconds - 7200)).toBe('2h ago');
    });

    it('handles ISO or formatted date strings gracefully', () => {
      const res = calculateRelativeTime('2026-09-07T10:00:00Z');
      expect(typeof res).toBe('string');
      expect(res.length).toBeGreaterThan(0);
    });
  });

  describe('formatFullTimestamp', () => {
    it('returns "Recent Dispatch" for missing timestamp', () => {
      expect(formatFullTimestamp(null)).toBe('Recent Dispatch');
      expect(formatFullTimestamp(undefined)).toBe('Recent Dispatch');
    });

    it('formats valid epoch timestamp into detailed date and time', () => {
      // 1725667200 -> Sep 7, 2024
      const formatted = formatFullTimestamp(1725667200);
      expect(formatted).toMatch(/2024/);
      expect(formatted).toContain('•');
    });
  });

  describe('extractEntities', () => {
    it('accurately identifies companies, tickers, regulators, and sectors', () => {
      const text = 'Reserve Bank of India raised alarms as Infosys and Tata Consultancy Services expanded into US cloud data centers.';
      const entities = extractEntities(text, 'INFY,TCS');

      expect(entities.regulators).toContain('Reserve Bank of India');
      expect(entities.companies).toContain('Infosys Limited');
      expect(entities.tickers).toContain('INFY');
      expect(entities.tickers).toContain('TCS');
      expect(entities.sectors).toContain('Enterprise Software & Cloud');
    });

    it('handles empty inputs safely without crashing', () => {
      const entities = extractEntities('', null);
      expect(entities.companies).toEqual([]);
      expect(entities.tickers).toEqual([]);
      expect(entities.regulators).toEqual([]);
    });
  });

  describe('extractQuantitativeFacts', () => {
    it('extracts percentages and currency metrics', () => {
      const text = 'Factory output jumped +8.4% with ₹25,000 crore invested in new equipment while inflation rose 2.1%.';
      const facts = extractQuantitativeFacts(text);

      expect(facts).toContain('+8.4%');
      expect(facts).toContain('2.1%');
      expect(facts.some(f => f.includes('25,000'))).toBe(true);
    });
  });

  describe('analyzeArticle', () => {
    it('returns null for invalid article input', () => {
      expect(analyzeArticle(null)).toBeNull();
      expect(analyzeArticle('string')).toBeNull();
    });

    it('generates all 8 structured financial intelligence sections for a standard article', () => {
      const article = {
        id: 101,
        headline: 'Reserve Bank of India Maintains Benchmark Repo Rate Amid Steady Inflation Outlook',
        summary: 'The Monetary Policy Committee voted unanimously to keep policy rates unchanged, citing resilient domestic growth and stable core inflation trajectories.',
        category: 'Markets',
        source: 'Financial Express',
        date: 'Sep 07, 2026',
        datetime: 1788771200,
        readTime: '3 min read',
        url: 'https://example.com/rbi-rate-decision'
      };

      const analysis = analyzeArticle(article);

      expect(analysis).not.toBeNull();
      expect(analysis.id).toBe(101);

      // 1. Overview
      expect(analysis.overview.headline).toBe(article.headline);
      expect(analysis.overview.source).toBe('Financial Express');
      expect(analysis.overview.category).toBe('Markets');
      expect(analysis.overview.url).toBe(article.url);

      // 2. What Happened
      expect(analysis.whatHappened.narrative).toContain('Monetary Policy Committee');
      expect(analysis.whatHappened.primarySubject).toBeDefined();

      // 3. Why Did It Happen
      expect(analysis.whyDidItHappen).toBeDefined();
      expect(typeof analysis.whyDidItHappen.isAvailable).toBe('boolean');

      // 4. Why Does It Matter
      expect(analysis.whyDoesItMatter.significance).toBeDefined();
      expect(analysis.whyDoesItMatter.contextualNote).toContain('Contextual Interpretation');

      // 5. Market Impact (strictly neutral if not reported)
      expect(analysis.marketImpact).toBeDefined();
      expect(analysis.marketImpact.isEstablished).toBe(false);
      expect(analysis.marketImpact.priceMovement).toBeNull();
      expect(analysis.marketImpact.contextNote).toContain('Market impact is not established');

      // 6. Key Takeaways (3-5 items)
      expect(Array.isArray(analysis.keyTakeaways)).toBe(true);
      expect(analysis.keyTakeaways.length).toBeGreaterThanOrEqual(3);
      expect(analysis.keyTakeaways.length).toBeLessThanOrEqual(5);

      // 7. Important Entities
      expect(analysis.importantEntities.regulators).toContain('Reserve Bank of India');

      // 8. Source & References
      expect(analysis.sourceAndReferences.publisher).toBe('Financial Express');
      expect(analysis.sourceAndReferences.url).toBe(article.url);
      expect(analysis.sourceAndReferences.attributionNote).toContain('Reported by Financial Express');
    });

    it('honors pre-analyzed custom fields when provided in curated sample data', () => {
      const customArticle = {
        id: 999,
        headline: 'Semiconductor Fabrication Ecosystem Gains Momentum',
        summary: 'Leading chipmakers report accelerated construction timelines.',
        category: 'Technology',
        source: 'Tech Market Wire',
        date: 'Sep 06, 2026',
        whatHappened: 'Multiple consortiums have accelerated fab construction by six months.',
        whyDidItHappen: 'Government performance-linked incentives unlocked capital tranches early.',
        whyDoesItMatter: 'Secures high-tech sovereignty and lowers import dependency for microchips.',
        marketImpact: {
          affectedSectors: ['Semiconductors & Hardware', 'Industrial Infrastructure'],
          symbols: ['TSM', 'INTC'],
          priceMovement: null,
          contextNote: 'Long-term capex cycle; immediate quarterly earnings impact remains muted.',
          isEstablished: true
        },
        keyTakeaways: [
          'Capex cycles accelerated by 6 months ahead of initial projection.',
          'State subsidies cleared without bureaucratic delay.',
          'Domestic supply chain integration expected by Q3 next year.'
        ]
      };

      const analysis = analyzeArticle(customArticle);

      expect(analysis.whatHappened.narrative).toBe(customArticle.whatHappened);
      expect(analysis.whyDidItHappen.explanation).toBe(customArticle.whyDidItHappen);
      expect(analysis.whyDoesItMatter.significance).toBe(customArticle.whyDoesItMatter);
      expect(analysis.marketImpact.affectedSectors).toEqual(['Semiconductors & Hardware', 'Industrial Infrastructure']);
      expect(analysis.keyTakeaways).toEqual(customArticle.keyTakeaways);
    });
  });
});
