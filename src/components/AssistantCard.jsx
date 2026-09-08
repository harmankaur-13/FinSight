import React, { useState } from 'react';

export default function AssistantCard({
  suggestions = [
    'How do I rebalance my portfolio back to 60/25/15?',
    'What is an index fund and why should I start with it?',
    'Is my 2.4% allocation drift safe?',
    'How much should I keep in my emergency fund?'
  ],
  title = 'FinSight Assistant',
  role = 'student'
}) {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `Hello, I am your FinSight intelligence assistant. How can I help you analyze your portfolio or explain financial concepts today?`
    }
  ]);
  const [inputVal, setInputVal] = useState('');

  const handleSend = (textToSend) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    const userMsg = { sender: 'user', text };
    let replyText = 'FinSight analysis: Based on your current portfolio parameters, maintaining your target allocation discipline yields optimal risk-adjusted returns.';

    const lower = text.toLowerCase();
    if (lower.includes('rebalance') || lower.includes('60/25/15')) {
      replyText = 'To rebalance back to 60/25/15 target: Direct your next fresh monthly capital (e.g. ₹3,500) into whichever asset class has fallen below its target percentage, rather than selling existing holdings and incurring tax.';
    } else if (lower.includes('index fund')) {
      replyText = 'An index fund is a low-cost mutual fund that tracks a market benchmark like the Nifty 50 or S&P 500. It offers broad diversification, minimal expense ratios, and historically beats the vast majority of active stock pickers over 10+ year horizons.';
    } else if (lower.includes('drift')) {
      replyText = 'A 2.4% allocation drift is well within the acceptable threshold of +/- 5%. No immediate rebalancing transaction is required at this stage.';
    } else if (lower.includes('emergency fund')) {
      replyText = 'A standard emergency fund should cover 3 to 6 months of mandatory living expenses in high-liquidity, low-risk accounts like high-yield savings or overnight liquid debt funds.';
    } else if (lower.includes('tech') || lower.includes('cloud') || lower.includes('sector')) {
      replyText = 'Technology sector exposure of 52% offers high growth velocity but elevates sensitivity to semiconductor and cloud hardware CapEx cycles. Consider hedging with defensive infrastructure debt.';
    } else if (lower.includes('trajectory') || lower.includes('4-year') || lower.includes('projections')) {
      replyText = 'The 4-year projection models a CAGR of 16-20% based on baseline compound assumptions. Regular stress-testing against market pullbacks is recommended.';
    }

    setMessages((prev) => [...prev, userMsg, { sender: 'assistant', text: replyText }]);
    setInputVal('');
  };

  return (
    <div className="panel-card assistant-container">
      <div className="panel-header">
        <div>
          <h3 className="panel-title">{title}</h3>
          <span className="panel-subtitle">On-demand financial reasoning and portfolio support</span>
        </div>
        <span className="gain" style={{ fontSize: '11px' }}>
          Active
        </span>
      </div>

      <div className="chat-history">
        {messages.map((m, idx) => (
          <div key={idx} className={`chat-bubble ${m.sender}`}>
            {m.text}
          </div>
        ))}
      </div>

      <div className="prompt-chips">
        {suggestions.slice(0, 3).map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            className="prompt-chip"
            onClick={() => handleSend(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="chat-input-row"
      >
        <input
          type="text"
          placeholder="Ask a financial question..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
        />
        <button type="submit" className="btn btn-primary btn-small">
          Send
        </button>
      </form>
    </div>
  );
}
