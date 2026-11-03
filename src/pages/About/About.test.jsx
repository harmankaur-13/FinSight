import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import About from './About.jsx';
import { ABOUT_DATA } from '../../data/mockData.js';

describe('About Page Component', () => {
  it('renders page header, purpose eyebrow, and subtitle', () => {
    const html = renderToString(<About />);

    expect(html).toContain('PURPOSE &amp; METHODOLOGY');
    expect(html).toContain('About FinSight');
    expect(html).toContain('Building a calm, disciplined financial intelligence platform');
  });

  it('renders the problem and solution manifesto cards', () => {
    const html = renderToString(<About />);

    expect(html).toContain('THE PROBLEM');
    expect(html).toContain('Fragmented Financial Decisions');
    expect(html).toContain(ABOUT_DATA.problemStatement);

    expect(html).toContain('THE SOLUTION');
    expect(html).toContain('Our Core Philosophy');
    expect(html).toContain(ABOUT_DATA.solution);
  });

  it('renders all guiding pillars from data', () => {
    const html = renderToString(<About />);

    expect(html).toContain('Our Guiding Pillars');
    for (const pillar of ABOUT_DATA.pillars) {
      expect(html).toContain(pillar.title);
      expect(html).toContain(pillar.desc);
    }
  });

  it('renders the 3-step workflow roadmap', () => {
    const html = renderToString(<About />);

    expect(html).toContain('HOW FINSIGHT WORKS');
    expect(html).toContain('From Financial Data to Clearer Decisions');
    expect(html).toContain('See the Full Picture');
    expect(html).toContain('Understand What Matters');
    expect(html).toContain('Make More Informed Decisions');
  });

  it('renders institutional mission callout and strictly contains no emojis', () => {
    const html = renderToString(<About />);

    expect(html).toContain(ABOUT_DATA.mission);
    expect(html).toContain('Client-Side Private');

    // Emoji pattern check
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    expect(emojiRegex.test(html)).toBe(false);
  });
});

