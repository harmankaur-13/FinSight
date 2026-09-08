import React, { useState, useMemo } from 'react';

export default function FutureSimulation({
  initialPrincipal = 1842000,
  defaultMonthly = 25000,
  defaultRate = 12
}) {
  const [years, setYears] = useState(3);
  const [monthlyContribution, setMonthlyContribution] = useState(defaultMonthly);
  const [expectedRate, setExpectedRate] = useState(defaultRate);

  // Compound calculation: P * (1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)]
  const simulatedTotal = useMemo(() => {
    const r = expectedRate / 100 / 12;
    const n = years * 12;
    const compoundPrincipal = initialPrincipal * Math.pow(1 + r, n);
    const compoundMonthly = monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
    return Math.round(compoundPrincipal + compoundMonthly);
  }, [initialPrincipal, years, monthlyContribution, expectedRate]);

  // Formatter for Indian Rupee notation
  const formattedValue = useMemo(() => {
    return '₹' + simulatedTotal.toLocaleString('en-IN');
  }, [simulatedTotal]);

  return (
    <div className="panel-card">
      <div className="panel-header">
        <div>
          <h3 className="panel-title">Future Value Simulation</h3>
          <span className="panel-subtitle">Interactive mathematical compound projection</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: 'var(--bg)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block' }}>Initial Capital</span>
          <strong style={{ fontSize: '16px' }}>₹{initialPrincipal.toLocaleString('en-IN')}</strong>
        </div>
        <div style={{ background: 'var(--green-light)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(39,102,83,0.2)' }}>
          <span style={{ fontSize: '11px', color: 'var(--green-dark)', display: 'block', fontWeight: 600 }}>Projected Value in {years} Years</span>
          <strong style={{ fontSize: '20px', color: 'var(--green-dark)', fontFamily: 'Space Grotesk' }}>{formattedValue}</strong>
        </div>
      </div>

      <div className="slider-group">
        <div className="slider-label-row">
          <span>Time Horizon: {years} {years === 1 ? 'Year' : 'Years'}</span>
        </div>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          className="fin-slider"
        />
      </div>

      <div className="slider-group">
        <div className="slider-label-row">
          <span>Monthly Capital Addition: ₹{monthlyContribution.toLocaleString('en-IN')}</span>
        </div>
        <input
          type="range"
          min="0"
          max="100000"
          step="5000"
          value={monthlyContribution}
          onChange={(e) => setMonthlyContribution(Number(e.target.value))}
          className="fin-slider"
        />
      </div>

      <div className="slider-group">
        <div className="slider-label-row">
          <span>Estimated Annual Return: {expectedRate}% CAGR</span>
        </div>
        <input
          type="range"
          min="6"
          max="20"
          step="1"
          value={expectedRate}
          onChange={(e) => setExpectedRate(Number(e.target.value))}
          className="fin-slider"
        />
      </div>

      <div className="simulation-disclaimer">
        <strong>Important Safety Notice:</strong> All projected calculations are illustrative estimates based on compound rate models. Past performance does not guarantee future results. Market returns vary over time.
      </div>
    </div>
  );
}
