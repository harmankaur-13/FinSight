// Mock Financial Data for FinSight Application
// Structured for educational clarity and effortless future backend integration (Node/Express/MongoDB)

export const STUDENT_DATA = {
  userType: 'student',
  name: 'Aman Sharma',
  email: 'student@finsight.demo',
  portfolioValue: '₹25,400',
  portfolioRawValue: 25400,
  performance: '+8.4%',
  isPositive: true,
  monthlySavings: '₹3,500',
  allocationDrift: '2.4%',
  insightMessage: 'Your portfolio is currently within your target allocation range.',
  allocations: [
    { name: 'Equities', percentage: 60, target: 60, color: '#276653' },
    { name: 'Bonds', percentage: 25, target: 25, color: '#b88746' },
    { name: 'Crypto', percentage: 15, target: 15, color: '#68736d' }
  ],
  goals: [
    { title: 'Emergency Fund', current: 20000, target: 30000, unit: '₹' },
    { title: 'First ₹50,000 Milestone', current: 25400, target: 50000, unit: '₹' },
    { title: 'Annual Book & Course Fund', current: 7500, target: 10000, unit: '₹' }
  ],
  educationalModules: [
    {
      id: 'edu-1',
      title: 'Understanding Diversification',
      category: 'Core Fundamentals',
      readTime: '5 min read',
      difficulty: 'Beginner',
      image: '/images/diversification.jpg',
      summary: 'Learn how spreading capital across uncorrelated asset classes limits downside while preserving long-term growth.',
      heroQuote: 'Diversification is the only free lunch in investing.',
      sections: [
        {
          heading: 'Why You Shouldn’t Put All Eggs in One Basket',
          body: 'When you invest 100% of your money into a single company or single sector, your financial destiny is tied entirely to that specific business. If that sector faces supply chain issues, regulatory crackdowns, or leadership failure, your portfolio can crash overnight. True diversification spreads risk across uncorrelated asset classes so that when one falls, another cushions the blow.'
        },
        {
          heading: 'The 3 Pillar Asset Classes for Students',
          body: '1. Equities (Stocks & Index Funds): Your high-powered wealth compounding engine (historical 12-14% CAGR over 10+ years).\n2. Fixed Income (Bonds & FDs): Stability and capital preservation with predictable yield (6-8% return).\n3. Cash & Alternatives (Gold, Liquid Funds, Crypto): High liquidity for emergencies and non-correlated inflation protection.'
        },
        {
          heading: 'A Practical Stress-Test Example',
          body: 'Consider a 20% stock market correction:\n• 100% Equity Portfolio: Falls by ₹5,000 on a ₹25,000 base.\n• 60/25/15 Diversified Portfolio: Equities drop ₹3,000, while Bonds & Gold gain or stay steady, limiting total loss to under ₹1,800. You remain calm and avoid emotional panic-selling.'
        }
      ],
      actionSteps: [
        'Review your current asset distribution against your 60/25/15 target.',
        'Never concentrate more than 10% of total wealth in any single stock or token.',
        'Rebalance semi-annually or whenever an asset drifts more than 5% from target.'
      ],
      quiz: {
        question: 'What is the primary mathematical benefit of portfolio diversification across uncorrelated assets?',
        options: [
          'Guaranteed positive returns every single trading week',
          'Reducing portfolio drawdown and risk without sacrificing long-term returns proportionally',
          'Eliminating the need to ever pay capital gains taxes',
          'Allowing you to trade daily with leverage'
        ],
        correctIndex: 1,
        explanation: 'Diversification reduces unsystematic (company-specific) volatility through uncorrelated asset classes, providing a smooth and sustainable wealth compounding path.'
      }
    },
    {
      id: 'edu-2',
      title: 'Beginner Investing Concepts',
      category: 'Investing 101',
      readTime: '7 min read',
      difficulty: 'Foundational',
      image: '/images/investing-concepts.jpg',
      summary: 'Demystifying compound interest, systematic investment plans (SIPs), and index funds with zero jargon.',
      heroQuote: 'Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn’t, pays it.',
      sections: [
        {
          heading: 'The Magic of Compound Growth & The Rule of 72',
          body: 'Compound interest means you earn returns not just on your initial capital, but on the accumulated returns of past years. A handy mental math trick is the Rule of 72: Divide 72 by your expected annual return to find how many years it takes for your investment to double.\n• At 12% annual return: 72 / 12 = 6 years to double.\n• At 15% return: 72 / 15 = 4.8 years to double.'
        },
        {
          heading: 'Why Automated SIPs Beat Market Timing',
          body: 'Trying to predict when the stock market hits the bottom is virtually impossible even for Wall Street pros. A Systematic Investment Plan (SIP) invests a fixed sum (e.g. ₹3,500) automatically every month. When markets drop, your fixed amount buys MORE units; when markets rise, you buy fewer. This Rupee-Cost Averaging lowers your average purchase price effortlessly.'
        },
        {
          heading: 'Active Stock Picking vs Low-Cost Index Funds',
          body: 'Over a 10 to 15-year period, more than 85% of active fund managers fail to beat passive benchmark indices like the Nifty 50 or S&P 500. By investing in broad index funds with expense ratios under 0.20%, you capture total market growth while saving thousands in management fees.'
        }
      ],
      actionSteps: [
        'Automate your monthly SIP on salary or allowance day to pay yourself first.',
        'Prioritize low-cost index funds before attempting speculative stock picking.',
        'Increase your monthly contribution by 10% each year as your income grows.'
      ],
      quiz: {
        question: 'Under the Rule of 72, how many years will it take for ₹25,000 to double to ₹50,000 at a 12% annual compounding rate?',
        options: [
          '12 years',
          '8.5 years',
          '6 years',
          '10 years'
        ],
        correctIndex: 2,
        explanation: '72 divided by 12 = 6 years. With consistent compounding at 12%, your initial ₹25,000 doubles to ₹50,000 in exactly 6 years.'
      }
    },
    {
      id: 'edu-3',
      title: 'Understanding Market Risk',
      category: 'Risk Management',
      readTime: '6 min read',
      difficulty: 'Intermediate',
      image: '/images/market-risk.jpg',
      summary: 'The crucial difference between systematic market risk and company-specific risk, and how to stay resilient.',
      heroQuote: 'Risk comes from not knowing what you are doing.',
      sections: [
        {
          heading: 'Systematic vs Unsystematic Risk',
          body: '• Systematic (Macro) Risk: Market-wide shocks such as inflation spikes, interest rate changes, or global geopolitical tensions that affect all businesses simultaneously. This risk cannot be diversified away.\n• Unsystematic (Company) Risk: Specific business vulnerabilities such as accounting fraud, loss of key clients, or supply shortages. This risk CAN be diversified away by holding 50+ businesses in an index fund.'
        },
        {
          heading: 'Volatility vs Permanent Loss of Capital',
          body: 'Price fluctuations on your screen are VOLATILITY, not loss. A temporary 15% drawdown in an index fund recovers when the underlying economy grows. Permanent loss only happens when you invest in flawed companies that go bankrupt, or when you panic-sell at the market bottom.'
        },
        {
          heading: 'Developing Emotional Discipline',
          body: 'Market corrections of 10% happen almost every calendar year. Cultivating a disciplined mindset allows you to view market pullbacks as discounted accumulation opportunities rather than existential threats.'
        }
      ],
      actionSteps: [
        'Never invest money you will need in the next 12-24 months into equities.',
        'Build a separate liquid emergency fund so you never need to sell stocks in a crash.',
        'Write an Investment Policy Statement outlining what actions to take during 20% drops.'
      ],
      quiz: {
        question: 'Which type of risk is eliminated when you invest in a broad market index fund?',
        options: [
          'Systematic macroeconomic risk',
          'Company-specific (unsystematic) risk',
          'Global interest rate fluctuations',
          'Currency exchange rate risk'
        ],
        correctIndex: 1,
        explanation: 'Company-specific risk is eliminated because no single business failure can drastically damage an entire diversified index of 50 to 500 leading companies.'
      }
    },
    {
      id: 'edu-4',
      title: 'Portfolio Allocation Basics',
      category: 'Asset Strategy',
      readTime: '8 min read',
      difficulty: 'Practical',
      image: '/images/portfolio-allocation.jpg',
      summary: 'How time horizons and personal risk tolerances should dictate your target equity-debt split.',
      heroQuote: 'Asset allocation accounts for over 90% of a portfolio’s long-term performance variation.',
      sections: [
        {
          heading: 'Time Horizon: The Ultimate Arbitrage',
          body: 'As a student with a 25 to 35-year time horizon before retirement, time is your greatest financial asset. You have the runway to endure short-term market cycles in exchange for superior long-term compound growth. This allows an aggressive 60-80% equity baseline compared to older investors nearing retirement.'
        },
        {
          heading: 'Balancing Risk Capacity and Risk Tolerance',
          body: '• Risk Capacity: The objective mathematical ability to take risk based on age, income stability, and debt obligations.\n• Risk Tolerance: The psychological emotional comfort level with seeing account values fluctuate on red market days. Your strategy must honor both.'
        },
        {
          heading: 'Smart Rebalancing Without Tax Penalties',
          body: 'When stocks surge and your equity allocation drifts from 60% up to 70%, rather than selling stocks and incurring capital gains tax, direct your NEXT monthly SIPs into bonds and debt until your portfolio naturally glides back to 60/25/15 balance.'
        }
      ],
      actionSteps: [
        'Determine your personal investment goal horizon for every rupee you invest.',
        'Maintain a 5% drift threshold before executing any portfolio rebalancing.',
        'Use incoming monthly capital to rebalance rather than selling winners prematurely.'
      ],
      quiz: {
        question: 'If strong stock performance causes your equity allocation to drift from 60% up to 72%, what is the most tax-efficient rebalancing action for a student?',
        options: [
          'Sell all equity holdings immediately and hold 100% cash',
          'Direct incoming monthly savings into fixed income and debt until balance is restored',
          'Take on personal loans to buy even more equities',
          'Do nothing and stop monitoring the portfolio forever'
        ],
        correctIndex: 1,
        explanation: 'Directing new monthly savings into lagging asset classes rebalances your target allocation cleanly without triggering capital gains taxes or broker trading commissions.'
      }
    }
  ],
  videoTutorials: [
    {
      id: 'yt-1',
      title: 'Mastering Index Fund Investing for Beginners',
      channel: 'FinSight Learning Lab',
      duration: '14:20',
      topic: 'Index Funds',
      image: '/images/video-index-funds.jpg',
      embedUrl: 'https://www.youtube.com/embed/fwe-PJRq1Ao',
      videoUrl: 'https://www.youtube.com/watch?v=fwe-PJRq1Ao',
      summary: 'A comprehensive beginner guide breaking down how index funds replicate market indices like Nifty 50 & S&P 500 with rock-bottom expense ratios.',
      chapters: [
        { time: '00:00', title: 'What is an Index Fund?' },
        { time: '03:45', title: 'Active Mutual Funds vs Passive Index Funds' },
        { time: '07:20', title: 'Expense Ratios & Tracking Error Explained' },
        { time: '11:10', title: 'How to Place Your First SIP Order' }
      ],
      keyNotes: [
        'Index funds replicate benchmark indices and remove fund manager human bias.',
        'Expense ratios under 0.20% save thousands in compounding costs over 20 years.',
        'Consistency through automated monthly SIPs beats market timing.'
      ]
    },
    {
      id: 'yt-2',
      title: 'How Asset Allocation Actually Works',
      channel: 'Financial Foundations',
      duration: '11:45',
      topic: 'Portfolio Strategy',
      image: '/images/video-asset-allocation.jpg',
      embedUrl: 'https://www.youtube.com/embed/o5T2QZ1Wz40',
      videoUrl: 'https://www.youtube.com/watch?v=o5T2QZ1Wz40',
      summary: 'Discover how top institutional wealth managers construct resilient multi-asset portfolios across equities, government bonds, and cash.',
      chapters: [
        { time: '00:00', title: 'The Core Principles of Asset Classes' },
        { time: '02:50', title: 'Correlation Matrices & Risk Reduction' },
        { time: '06:15', title: 'Designing the 60/25/15 Student Portfolio' },
        { time: '09:30', title: 'When and How Often to Rebalance' }
      ],
      keyNotes: [
        'Asset allocation accounts for over 90% of long-term portfolio return variance.',
        'Bonds provide stability and liquidity during severe stock market downturns.',
        'Maintain a +/- 5% tolerance band before triggering a rebalance.'
      ]
    },
    {
      id: 'yt-3',
      title: 'Building Your First Emergency Fund',
      channel: 'Wealth Building 101',
      duration: '09:10',
      topic: 'Personal Finance',
      image: '/images/video-emergency-fund.jpg',
      embedUrl: 'https://www.youtube.com/embed/Ede_4I-t0Jc',
      videoUrl: 'https://www.youtube.com/watch?v=Ede_4I-t0Jc',
      summary: 'Step-by-step guide to calculating your essential living expenses, where to park your liquid emergency cash, and avoiding high-interest debt.',
      chapters: [
        { time: '00:00', title: 'Why an Emergency Fund is Step Zero' },
        { time: '02:15', title: 'Calculating 3 to 6 Months of True Expenses' },
        { time: '05:00', title: 'Best Accounts: High-Yield Savings vs Liquid Funds' },
        { time: '07:30', title: 'Rules for When (and When Not) to Use It' }
      ],
      keyNotes: [
        'An emergency fund protects your investments from forced liquidation during emergencies.',
        'Keep emergency funds in separate, easily accessible accounts without lock-in penalties.',
        'Target 3 months for students / 6 months for freelancers and business owners.'
      ]
    },
    {
      id: 'yt-4',
      title: 'Crypto vs Equities: Risk & Volatility Explained',
      channel: 'Macro Analysis Hub',
      duration: '16:30',
      topic: 'Crypto & Assets',
      image: '/images/video-crypto-equities.jpg',
      embedUrl: 'https://www.youtube.com/embed/Yb68g5x44z4',
      videoUrl: 'https://www.youtube.com/watch?v=Yb68g5x44z4',
      summary: 'A deep comparative analysis between cashflow-generating productive equities and speculative decentralized digital assets.',
      chapters: [
        { time: '00:00', title: 'Fundamental Differences: Cashflow vs Scarcity' },
        { time: '04:20', title: 'Historical Volatility and Maximum Drawdowns' },
        { time: '09:15', title: 'Sizing Alternative Assets in a Student Portfolio (5-15% Max)' },
        { time: '13:40', title: 'Custody, Security & Tax Implications' }
      ],
      keyNotes: [
        'Equities represent ownership in companies with real earnings and dividends.',
        'Crypto operates on supply scarcity and network adoption with significantly higher volatility.',
        'Never allocate more than 10-15% of your total portfolio to high-risk digital assets.'
      ]
    }
  ],
  assistantSuggestions: [
    'How do I rebalance my portfolio back to 60/25/15?',
    'What is an index fund and why should I start with it?',
    'Is my 2.4% allocation drift safe?',
    'How much should I keep in my emergency fund?'
  ]
};

export const BUSINESS_DATA = {
  userType: 'business',
  name: 'Nexus Ventures',
  email: 'business@finsight.demo',
  portfolioValue: '₹18,42,000',
  portfolioRawValue: 1842000,
  marketExposure: '68%',
  performance: '+14.2%',
  isPositive: true,
  allocationDrift: '3.8%',
  insightMessage: 'Corporate treasury allocation is optimized with strong cash reserves for quarterly obligations.',
  allocations: [
    { name: 'Equities', percentage: 50, target: 50, color: '#276653' },
    { name: 'Corporate Debt', percentage: 25, target: 20, color: '#b88746' },
    { name: 'Real Estate & REITs', percentage: 15, target: 20, color: '#68736d' },
    { name: 'Liquid Cash', percentage: 10, target: 10, color: '#dce9e2' }
  ],
  holdings: [
    { company: 'Infosys Ltd', symbol: 'INFY', value: '₹4,20,000', change: '+3.4%', isPositive: true, allocation: '22.8%', sector: 'Technology' },
    { company: 'HDFC Bank', symbol: 'HDFCBANK', value: '₹3,85,000', change: '+1.2%', isPositive: true, allocation: '20.9%', sector: 'Banking' },
    { company: 'Reliance Industries', symbol: 'RELIANCE', value: '₹3,40,000', change: '+0.8%', isPositive: true, allocation: '18.5%', sector: 'Energy / Conglomerate' },
    { company: 'Tata Consultancy Services', symbol: 'TCS', value: '₹2,90,000', change: '-0.4%', isPositive: false, allocation: '15.7%', sector: 'IT Services' },
    { company: 'ICICI Corp Bond Fund', symbol: 'ICICIBOND', value: '₹2,30,000', change: '+0.2%', isPositive: true, allocation: '12.5%', sector: 'Fixed Income' },
    { company: 'Embassy Office Parks REIT', symbol: 'EMBASSY', value: '₹1,77,000', change: '+1.8%', isPositive: true, allocation: '9.6%', sector: 'Real Estate' }
  ],
  marketOutlook: 'Moderately bullish bias with steady institutional liquidity and manageable interest rate risks across commercial segments.',
  riskMetrics: {
    portfolioBeta: '0.94',
    annualizedVolatility: '11.2%',
    sharpeRatio: '1.82',
    stressTestLoss: '₹1.15L (Max Simulated)'
  },
  assistantSuggestions: [
    'Analyze sector concentration in my top holdings',
    'Simulate portfolio returns for next 3 fiscal years',
    'How does rising interest rate affect our debt allocation?',
    'Show liquidity analysis for next quarter'
  ]
};

export const TECH_DATA = {
  userType: 'tech',
  name: 'Apex Technologies Enterprise',
  email: 'enterprise@finsight.demo',
  portfolioValue: '₹4.82 Cr',
  portfolioRawValue: 48200000,
  performance: '+19.6%',
  isPositive: true,
  allocationDrift: '4.1%',
  costLossExposure: '₹18.4L',
  insightMessage: 'Enterprise holdings exhibit strong technological moat with balanced exposure across cloud and infrastructure.',
  allocations: [
    { name: 'Technology & AI', percentage: 52, target: 50, color: '#276653' },
    { name: 'Infrastructure & Cloud', percentage: 21, target: 20, color: '#b88746' },
    { name: 'Energy & Cleantech', percentage: 14, target: 15, color: '#68736d' },
    { name: 'Strategic Venture Assets', percentage: 13, target: 15, color: '#8e9a93' }
  ],
  riskAreas: [
    { area: 'Technology Sector Volatility', severity: 'Medium', note: 'Exposure heavily weighted towards compute and SaaS platforms.' },
    { area: 'Data Center Infrastructure Cost', severity: 'High', note: 'CapEx escalations projected across regional server clusters.' },
    { area: 'Currency & Foreign Exchange', severity: 'Low', note: 'USD/INR fluctuations hedged with derivative contracts.' }
  ],
  crunchAcquisition: {
    title: 'Market Downturn Acquisition Opportunity',
    target: 'Cloud Native Infrastructure Unit',
    valuation: '35% Discount to Historical Peak',
    rationale: 'Positive operating cashflow with strategic compute synergies during industry crunch periods.'
  },
  projections: [
    { year: '2026', projectedValue: '₹4.82 Cr', simulatedGrowth: 'Base', status: 'Current' },
    { year: '2027', projectedValue: '₹5.64 Cr', simulatedGrowth: '+17.0%', status: 'Simulated' },
    { year: '2028', projectedValue: '₹6.58 Cr', simulatedGrowth: '+16.6%', status: 'Simulated' },
    { year: '2029', projectedValue: '₹7.82 Cr', simulatedGrowth: '+18.8%', status: 'Simulated' },
    { year: '2030', projectedValue: '₹9.40 Cr', simulatedGrowth: '+20.2%', status: 'Simulated' }
  ],
  assistantSuggestions: [
    'Explain the 4-year simulated enterprise trajectory',
    'Assess potential loss exposure under market crunch conditions',
    'What are the primary risk vectors in our cloud infrastructure holdings?',
    'Generate capital reallocation strategy for 2027'
  ]
};

export const FEATURES_DATA = [
  {
    number: '01',
    title: 'Portfolio Tracking',
    description: 'Unified real-time visibility across equities, fixed income, crypto, and cash assets with precision analytics.'
  },
  {
    number: '02',
    title: 'Allocation Analysis',
    description: 'Deep breakdown of portfolio weights across sectors, risk levels, and asset classes to maintain balanced exposure.'
  },
  {
    number: '03',
    title: 'Allocation Drift Detection',
    description: 'Automated monitoring of target vs actual asset distribution, alerting you when allocations deviate from targets.'
  },
  {
    number: '04',
    title: 'Market Insights',
    description: 'Curated financial news, macro indicators, and sector trends distilled into clean, actionable briefings.'
  },
  {
    number: '05',
    title: 'Future Value Simulation',
    description: 'Interactive compound interest and return modeling engine allowing users to forecast 1 to 5 year trajectories.'
  },
  {
    number: '06',
    title: 'Financial News Feed',
    description: 'Categorized stream covering Markets, Tech, Economy, Stocks, Crypto, and Business without clickbait or noise.'
  },
  {
    number: '07',
    title: 'Stock & Asset Ratings',
    description: 'Independent analyst consensus, sentiment metrics, and structured risk scores across leading financial instruments.'
  },
  {
    number: '08',
    title: 'Personalized Recommendations',
    description: 'Tailored suggestions based on your user profile — whether student learner, growing business, or tech company.'
  },
  {
    number: '09',
    title: 'Educational Resources',
    description: 'Foundational investing curricula and video tutorials designed to demystify wealth management without jargon.'
  },
  {
    number: '10',
    title: 'FinSight Assistant',
    description: 'An integrated conversational intelligence helper to explain financial concepts and simulate strategic decisions.'
  }
];

export const NEWS_DATA = [
  {
    id: 1,
    category: 'Markets',
    headline: 'Reserve Bank of India Maintains Benchmark Repo Rate Amid Steady Inflation Outlook',
    summary: 'The Monetary Policy Committee voted unanimously to keep policy rates unchanged, citing resilient domestic growth and stable core inflation trajectories.',
    source: 'Financial Express',
    date: 'Sep 07, 2026',
    readTime: '3 min read'
  },
  {
    id: 2,
    category: 'Technology',
    headline: 'Semiconductor Fabrication Ecosystem Gains Momentum with Major Capital Commitments',
    summary: 'Leading chipmakers report accelerated construction timelines for regional manufacturing units, boosting high-tech infrastructure sentiment.',
    source: 'Tech Market Wire',
    date: 'Sep 06, 2026',
    readTime: '4 min read'
  },
  {
    id: 3,
    category: 'Economy',
    headline: 'Manufacturing PMI Reaches Six-Month High on Robust Export Orders and Domestic Demand',
    summary: 'Factory output expanded at its fastest clip in half a year, supported by favorable raw material pricing and strengthening supply networks.',
    source: 'Economic Review',
    date: 'Sep 06, 2026',
    readTime: '3 min read'
  },
  {
    id: 4,
    category: 'Stocks',
    headline: 'Information Technology Blue-Chips Rally Following Strong Cloud Pipeline Announcements',
    summary: 'Major IT services exporters recorded notable gains as enterprise clients in North America expanded long-term software modernization pacts.',
    source: 'Market Monitor',
    date: 'Sep 05, 2026',
    readTime: '2 min read'
  },
  {
    id: 5,
    category: 'Crypto',
    headline: 'Institutional Digital Asset Inflows Stabilize as Regulatory Frameworks Clarify',
    summary: 'Regulated spot asset funds observed consistent net weekly inflows, reflecting disciplined institutional participation and reduced retail speculation.',
    source: 'Digital Asset Journal',
    date: 'Sep 05, 2026',
    readTime: '3 min read'
  },
  {
    id: 6,
    category: 'Business',
    headline: 'Corporate Treasury Allocation Trends Toward High-Grade Liquid Debt and Short-Term Instruments',
    summary: 'CFOs in technology and commercial sectors prioritize capital preservation while maintaining swift deployment flexibility for strategic acquisitions.',
    source: 'Treasury Outlook',
    date: 'Sep 04, 2026',
    readTime: '4 min read'
  },
  {
    id: 7,
    category: 'Markets',
    headline: 'Global Sovereign Bond Yields Tighten Following Synchronized Central Bank Signals',
    summary: 'Long-duration government bond prices appreciated globally as investors recalibrated terminal interest rate expectations across major currencies.',
    source: 'Global Bond Insight',
    date: 'Sep 04, 2026',
    readTime: '3 min read'
  },
  {
    id: 8,
    category: 'Stocks',
    headline: 'Renewable Energy Equities Attract Domestic Mutual Fund Accumulation on Grid Expansion Mandates',
    summary: 'Solar and wind infrastructure suppliers witnessed steady institutional accumulation on expanding state transmission capacity contracts.',
    source: 'Equity Focus',
    date: 'Sep 03, 2026',
    readTime: '3 min read'
  }
];

export const RATINGS_DATA = [
  {
    id: 'r-1',
    symbol: 'INFY',
    name: 'Infosys Limited',
    sector: 'Technology Services',
    price: '₹1,840.50',
    target: '₹2,100.00',
    rating: 'Strong Buy',
    ratingType: 'strong-buy',
    sentiment: '86% Positive',
    riskLevel: 'Low',
    peRatio: '24.8',
    rationale: 'Robust order book in cloud transformation, industry-leading operating margins, and healthy free cash flow generation.'
  },
  {
    id: 'r-2',
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    sector: 'Banking & Financials',
    price: '₹1,690.20',
    target: '₹1,950.00',
    rating: 'Buy',
    ratingType: 'buy',
    sentiment: '79% Positive',
    riskLevel: 'Low',
    peRatio: '18.4',
    rationale: 'Consistent net interest margin stability, disciplined loan book underwriting, and expanding retail branch footprint.'
  },
  {
    id: 'r-3',
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    sector: 'Energy & Retail',
    price: '₹2,980.00',
    target: '₹3,320.00',
    rating: 'Buy',
    ratingType: 'buy',
    sentiment: '74% Positive',
    riskLevel: 'Medium',
    peRatio: '26.1',
    rationale: 'Strong consumer retail footfall and digital subscriber growth offsetting cyclical oil-to-chemicals refining swings.'
  },
  {
    id: 'r-4',
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    sector: 'IT Consulting',
    price: '₹4,120.00',
    target: '₹4,450.00',
    rating: 'Hold',
    ratingType: 'hold',
    sentiment: '62% Neutral',
    riskLevel: 'Low',
    peRatio: '28.3',
    rationale: 'Premium valuation multiples currently reflect near-term earnings delivery; defensive cash balance remains impeccable.'
  },
  {
    id: 'r-5',
    symbol: 'LT',
    name: 'Larsen & Toubro Ltd',
    sector: 'Infrastructure & Engineering',
    price: '₹3,560.00',
    target: '₹4,000.00',
    rating: 'Strong Buy',
    ratingType: 'strong-buy',
    sentiment: '91% Positive',
    riskLevel: 'Medium',
    peRatio: '31.2',
    rationale: 'Unprecedented domestic infrastructure order inflow and international hydrocarbon contract expansions.'
  },
  {
    id: 'r-6',
    symbol: 'TITAN',
    name: 'Titan Company Ltd',
    sector: 'Consumer Discretionary',
    price: '₹3,410.00',
    target: '₹3,750.00',
    rating: 'Hold',
    ratingType: 'hold',
    sentiment: '58% Neutral',
    riskLevel: 'Medium',
    peRatio: '78.5',
    rationale: 'High consumer brand equity balanced against elevated gold raw material volatility and high valuation multiples.'
  }
];

export const ABOUT_DATA = {
  mission: 'To bring absolute clarity, disciplined asset allocation, and predictive financial intelligence to every modern individual and enterprise.',
  problemStatement: 'Managing modern wealth across traditional equities, debt instruments, emerging digital assets, and cash reserves often results in fragmented visibility, unintended allocation drift, and emotional decision-making.',
  solution: 'FinSight solves this by unifying portfolio tracking, automated target drift detection, dynamic rebalancing simulations, and tailored user perspectives into one calm, trustworthy interface.',
  pillars: [
    {
      title: 'Financial Clarity',
      desc: 'No clutter, no noise, and zero distraction. See your true net exposure and performance in seconds.'
    },
    {
      title: 'Discipline Over Speculation',
      desc: 'Focus on strategic asset allocation and rebalancing rather than chasing short-term market hype.'
    },
    {
      title: 'Simulated Foresight',
      desc: 'Understand the mathematical impact of compound interest, cashflow additions, and crunch scenarios before you allocate capital.'
    },
    {
      title: 'Contextual Intelligence',
      desc: 'Distinct dashboard experiences crafted specifically for students learning the ropes, businesses managing cash, and tech enterprises assessing risk.'
    }
  ]
};
