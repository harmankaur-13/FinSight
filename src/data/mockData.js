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
    { name: 'Equities', percentage: 60, target: 60, color: '#2e7d66' },
    { name: 'Bonds', percentage: 25, target: 25, color: '#6366f1' },
    { name: 'Crypto', percentage: 15, target: 15, color: '#d97706' }
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
    { name: 'Stocks', percentage: 50, target: 50, color: '#2e7d66' },
    { name: 'Bonds', percentage: 25, target: 20, color: '#6366f1' },
    { name: 'Real Estate', percentage: 15, target: 20, color: '#b45309' },
    { name: 'Mutual Funds', percentage: 10, target: 10, color: '#0284c7' }
  ],
  holdings: [
    { company: 'Infosys Ltd', symbol: 'INFY', value: '₹4,20,000', change: '+3.4%', isPositive: true, allocation: '22.8%', sector: 'Technology', type: 'Stocks' },
    { company: 'HDFC Bank', symbol: 'HDFCBANK', value: '₹3,85,000', change: '+1.2%', isPositive: true, allocation: '20.9%', sector: 'Banking', type: 'Stocks' },
    { company: 'Reliance Industries', symbol: 'RELIANCE', value: '₹3,40,000', change: '+0.8%', isPositive: true, allocation: '18.5%', sector: 'Energy / Conglomerate', type: 'Stocks' },
    { company: 'Tata Consultancy Services', symbol: 'TCS', value: '₹2,90,000', change: '-0.4%', isPositive: false, allocation: '15.7%', sector: 'IT Services', type: 'Stocks' },
    { company: 'ICICI Corp Bond Fund', symbol: 'ICICIBOND', value: '₹2,30,000', change: '+0.2%', isPositive: true, allocation: '12.5%', sector: 'Fixed Income', type: 'Bonds' },
    { company: 'Embassy Office Parks REIT', symbol: 'EMBASSY', value: '₹1,77,000', change: '+1.8%', isPositive: true, allocation: '9.6%', sector: 'Real Estate', type: 'Real Estate' }
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
    { name: 'Stocks', percentage: 50, target: 50, color: '#2e7d66' },
    { name: 'ETFs', percentage: 20, target: 20, color: '#2563eb' },
    { name: 'Bonds', percentage: 15, target: 15, color: '#6366f1' },
    { name: 'Crypto', percentage: 15, target: 15, color: '#d97706' }
  ],
  holdings: [
    { company: 'NVIDIA Corp', symbol: 'NVDA', value: '₹1.25 Cr', change: '+28.4%', isPositive: true, allocation: '25.9%', sector: 'Semiconductors & AI', type: 'Stocks' },
    { company: 'Microsoft Cloud Unit', symbol: 'MSFT', value: '₹1.10 Cr', change: '+14.2%', isPositive: true, allocation: '22.8%', sector: 'Cloud SaaS', type: 'Stocks' },
    { company: 'Amazon AWS Infrastructure', symbol: 'AMZN', value: '₹85.0L', change: '+11.8%', isPositive: true, allocation: '17.6%', sector: 'Cloud Compute', type: 'ETFs' },
    { company: 'Alphabet DeepMind Tech', symbol: 'GOOGL', value: '₹62.0L', change: '+8.5%', isPositive: true, allocation: '12.9%', sector: 'AI Platforms', type: 'Stocks' },
    { company: 'Sovereign Tech Bond ETF', symbol: 'TECHBOND', value: '₹55.0L', change: '+3.2%', isPositive: true, allocation: '11.4%', sector: 'Fixed Income', type: 'Bonds' },
    { company: 'Enterprise Digital Reserves', symbol: 'BTC-ETH', value: '₹45.0L', change: '+22.6%', isPositive: true, allocation: '9.3%', sector: 'Digital Assets', type: 'Crypto' }
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
    summary: 'The Monetary Policy Committee voted unanimously to keep policy rates unchanged at 6.50%, citing resilient domestic growth and stable core inflation trajectories.',
    source: 'Financial Express',
    date: 'Sep 07, 2026',
    readTime: '3 min read',
    url: 'https://financialexpress.com/market-intelligence/rbi-mpc-benchmark-repo-rate-september-2026',
    related: 'HDFCBANK,SBIN',
    whatHappened: 'The Monetary Policy Committee (MPC) of the Reserve Bank of India concluded its bi-monthly review with a unanimous decision to hold the benchmark policy repo rate at 6.50%. The standing deposit facility (SDF) rate remains at 6.25%, and the marginal standing facility (MSF) rate stays at 6.75%. The committee reiterated its policy stance of remaining focused on withdrawal of accommodation to ensure inflation aligns with the 4.0% medium-term target.',
    whyDidItHappen: 'The policy decision followed headline CPI readings stabilizing within the RBI’s tolerance band (2–6%) at 4.2% in the latest quarter. Domestic GDP expansion remained resilient at 6.8%, reducing urgency for pre-emptive monetary easing. However, volatile food pricing and ongoing global supply chain adjustments advised caution against premature rate cuts.',
    whyDoesItMatter: 'Steady benchmark rates anchor domestic borrowing costs for retail mortgages, corporate working capital loans, and municipal bond issuances. For commercial banks, it stabilizes net interest margins (NIMs). For retail investors and students, high fixed-deposit yields remain attractive for capital preservation before an eventual rate-cutting cycle commences.',
    marketImpact: {
      affectedSectors: ['Banking & Financial Services', 'Real Estate & Infrastructure'],
      symbols: ['HDFCBANK', 'SBIN'],
      priceMovement: null,
      contextNote: 'Market reaction was broadly neutral as the status quo was fully priced into forward overnight index swap (OIS) curves. Sovereign 10-year benchmark yields held steady at 7.04%.',
      isEstablished: true
    },
    keyTakeaways: [
      'Monetary Policy Committee held the benchmark repo rate at 6.50% by unanimous consensus.',
      'Domestic GDP growth projection maintained at a resilient 6.8% for the fiscal year.',
      'Core inflation stabilized at 4.2%, but food price volatility justifies a cautious monetary stance.',
      'Bank fixed deposit and sovereign bond yields are anticipated to remain elevated in the near term.'
    ]
  },
  {
    id: 2,
    category: 'Technology',
    headline: 'Semiconductor Fabrication Ecosystem Gains Momentum with Major Capital Commitments',
    summary: 'Leading chipmakers and technology consortiums report accelerated construction timelines for regional manufacturing units, boosting high-tech infrastructure sentiment.',
    source: 'Tech Market Wire',
    date: 'Sep 06, 2026',
    readTime: '4 min read',
    url: 'https://techmarketwire.com/semiconductor-fabrication-infrastructure-capital-deployment-2026',
    related: 'TSM,INTC,NVDA',
    whatHappened: 'Multiple semiconductor consortiums announced accelerated progress on two flagship semiconductor packaging and wafer fabrication facilities. Key engineering contracts totaling ₹38,000 crore have been finalized for cleanroom construction, high-purity gas delivery systems, and advanced photolithography tool procurement. The first pilot testing phases are now projected for completion six months ahead of schedule.',
    whyDidItHappen: 'The progress is driven by government approval under the Production-Linked Incentive (PLI) scheme for advanced hardware, coupled with surging enterprise demand for local chip packaging to support specialized artificial intelligence accelerators and automotive electronics.',
    whyDoesItMatter: 'Building domestic fabrication capacity directly reduces geopolitical supply vulnerability for industrial and consumer hardware. It creates high-value engineering employment, attracts specialized tier-1 chemical suppliers, and strengthens long-term technology self-reliance across emerging hardware ecosystems.',
    marketImpact: {
      affectedSectors: ['Semiconductors & Hardware', 'Industrial Infrastructure'],
      symbols: ['TSM', 'INTC', 'NVDA'],
      priceMovement: null,
      contextNote: 'Capital goods and industrial engineering suppliers witnessed increased institutional inquiry, while long-duration hardware equipment orders showed steady backlog expansion.',
      isEstablished: true
    },
    keyTakeaways: [
      'Two major wafer fabrication packaging units report construction milestones ahead of schedule.',
      '₹38,000 crore in tier-1 infrastructure and cleanroom procurement contracts confirmed.',
      'Government PLI disbursements and fast-track environmental approvals catalyzed early milestones.',
      'Long-term hardware sovereignty expected to compress automotive and computing supply lead times.'
    ]
  },
  {
    id: 3,
    category: 'Economy',
    headline: 'Manufacturing PMI Reaches Six-Month High on Robust Export Orders and Domestic Demand',
    summary: 'Factory output expanded at its fastest clip in half a year, supported by favorable raw material pricing and strengthening supply networks.',
    source: 'Economic Review',
    date: 'Sep 06, 2026',
    readTime: '3 min read',
    url: 'https://economicreview.org/manufacturing-pmi-six-month-high-export-orders',
    related: 'TATASTEEL,LT',
    whatHappened: 'The headline Purchasing Managers\' Index (PMI) for the manufacturing sector rose to 58.4 in August, up from 57.1 in July, marking the strongest operational expansion recorded in six months. Survey respondents reported sharp increases in new business inquiries, heightened commercial vehicle orders, and sustained replenishment of finished goods inventories.',
    whyDidItHappen: 'Accelerated manufacturing output was supported by softening intermediate input costs, particularly for industrial metals and petrochemical derivatives. Strengthening bilateral trade agreements and sustained domestic infrastructure capital expenditure under federal allocations stimulated robust order books.',
    whyDoesItMatter: 'A reading of 58.4 significantly exceeds the neutral 50.0 threshold, confirming robust macroeconomic momentum. Sustained industrial expansion supports corporate tax collection, strengthens balance sheets of heavy capital equipment manufacturers, and fosters healthy private sector capital deployment.',
    marketImpact: {
      affectedSectors: ['Manufacturing & Industrial', 'Materials & Infrastructure'],
      symbols: ['TATASTEEL', 'LT'],
      priceMovement: null,
      contextNote: 'Heavy engineering and basic materials indices reflected positive underlying sentiment, supported by low finished inventory overhang and resilient forward booking schedules.',
      isEstablished: true
    },
    keyTakeaways: [
      'Manufacturing PMI expanded to 58.4 in August, comfortably above the 50.0 baseline.',
      'New export order indices grew at their most rapid pace in two consecutive quarters.',
      'Input cost inflation for industrial metals and petrochemicals softened to sustainable rates.',
      'Capacity utilization across domestic factory floors surpassed 76%, signaling future capex needs.'
    ]
  },
  {
    id: 4,
    category: 'Stocks',
    headline: 'Information Technology Blue-Chips Rally Following Strong Cloud Pipeline Announcements',
    summary: 'Major IT services exporters recorded notable gains as enterprise clients in North America and Europe expanded long-term software modernization pacts.',
    source: 'Market Monitor',
    date: 'Sep 05, 2026',
    readTime: '2 min read',
    url: 'https://marketmonitor.com/equities/it-blue-chips-cloud-modernization-agreements',
    related: 'INFY,TCS',
    whatHappened: 'Tier-1 IT services providers announced multiple multi-year enterprise transformation contract renewals, with an aggregate total contract value (TCV) exceeding $4.2 billion over five years. The agreements center on migrating core legacy ERP systems into multi-cloud architectures and implementing proprietary generative AI governance frameworks for banking clients.',
    whyDidItHappen: 'Following two quarters of cautious discretionary IT budget freezes, Fortune 500 financial institutions and healthcare providers restarted delayed software modernization initiatives to harvest cloud efficiency dividends and modernize compliance pipelines.',
    whyDoesItMatter: 'IT exports constitute a cornerstone of services trade balance and foreign exchange inflows. Expanding TCV pipelines indicate improving revenue visibility for upcoming fiscal quarters, supporting high operating cash flow conversions and predictable dividend distributions.',
    marketImpact: {
      affectedSectors: ['Enterprise Software & Cloud', 'Technology Services'],
      symbols: ['INFY', 'TCS'],
      priceMovement: null,
      contextNote: 'Sector valuation multiples stabilized following multiple quarters of margin compression, with institutional research desks raising medium-term contract execution probabilities.',
      isEstablished: true
    },
    keyTakeaways: [
      'Aggregate software enterprise contract renewals reached $4.2 billion over a multi-year horizon.',
      'Financial services and healthcare enterprises led the resumption of discretionary cloud spending.',
      'Generative AI governance and security integration featured in over 70% of new deal scopes.',
      'Predictable cash conversions reinforce sector balance sheets and supportive dividend policies.'
    ]
  },
  {
    id: 5,
    category: 'Crypto',
    headline: 'Institutional Digital Asset Inflows Stabilize as Regulatory Frameworks Clarify',
    summary: 'Regulated spot asset funds observed consistent net weekly inflows, reflecting disciplined institutional participation and reduced retail speculation.',
    source: 'Digital Asset Journal',
    date: 'Sep 05, 2026',
    readTime: '3 min read',
    url: 'https://digitalassetjournal.com/institutional-inflows-regulatory-compliance-etf',
    related: 'COIN',
    whatHappened: 'Regulated spot digital asset exchange-traded products reported four consecutive weeks of positive net capital inflows, absorbing over $680 million across North American and European authorized funds. Secondary market annualized volatility compressed to multi-month lows of 38%, underscoring a transition toward institutional custody.',
    whyDidItHappen: 'The stabilization followed the implementation of standardized cross-border custody reporting guidelines by international securities regulators, establishing clear legal definitions for bankruptcy-remote digital asset reserves and audited proof-of-solvency.',
    whyDoesItMatter: 'Institutional asset allocators require regulatory clarity, insured qualified custody, and deep liquidity before committing sovereign wealth or endowment capital. Reduced speculation and tighter bid-ask spreads position digital assets as a mature alternative portfolio diversifier rather than an unhedged speculative trade.',
    marketImpact: {
      affectedSectors: ['Digital Assets & Web3', 'Fintech & Brokerage'],
      symbols: ['COIN'],
      priceMovement: null,
      contextNote: 'Derivatives open interest skewed toward call options on compliant exchanges, with basis spreads aligning closely with traditional money market risk-free rates.',
      isEstablished: true
    },
    keyTakeaways: [
      'Regulated spot exchange-traded funds recorded $680 million in net institutional inflows over 30 days.',
      'Annualized realized volatility moderated to 38%, approaching multi-year lows.',
      'Standardized international custody and proof-of-solvency guidelines improved fiduciary confidence.',
      'Digital asset allocations increasingly treated as non-correlated alternative risk sleeves.'
    ]
  },
  {
    id: 6,
    category: 'Business',
    headline: 'Corporate Treasury Allocation Trends Toward High-Grade Liquid Debt and Short-Term Instruments',
    summary: 'CFOs in technology and commercial sectors prioritize capital preservation while maintaining swift deployment flexibility for strategic acquisitions.',
    source: 'Treasury Outlook',
    date: 'Sep 04, 2026',
    readTime: '4 min read',
    url: 'https://treasuryoutlook.com/corporate-finance/treasury-liquidity-short-term-debt-allocation',
    related: 'JPM,GS',
    whatHappened: 'Corporate treasury managers across mid-to-large capitalization companies increased their allocation to 91-day treasury bills, AAA-rated commercial paper, and overnight repo agreements by 14% quarter-over-quarter. Total liquid reserves deployed in ultra-short duration fixed-income vehicles touched record quarterly highs.',
    whyDidItHappen: 'With benchmark short-term interest rates holding near cyclical peaks, corporate treasurers are harvesting risk-free yields between 6.8% and 7.1% without taking on interest rate duration risk or credit spread volatility.',
    whyDoesItMatter: 'Disciplined corporate liquidity management protects working capital against sudden credit market freezes and provides dry powder for non-dilutive strategic mergers or bolt-on acquisitions when private valuations undergo rationalization.',
    marketImpact: {
      affectedSectors: ['Banking & Financial Services', 'Corporate Finance'],
      symbols: ['JPM', 'GS'],
      priceMovement: null,
      contextNote: 'Money market fund assets under management continued expanding, providing abundant liquidity to short-tenor sovereign debt issuances and top-rated corporate issuers.',
      isEstablished: true
    },
    keyTakeaways: [
      'Corporate allocations to 91-day treasury bills and high-grade commercial paper rose 14% QoQ.',
      'Treasurers are capturing 6.8% to 7.1% annual yields with near-zero duration exposure.',
      'Conservative cash preservation shields operating cash flows from macroeconomic tightening.',
      'Substantial corporate dry powder maintained for opportunistic strategic acquisitions.'
    ]
  },
  {
    id: 7,
    category: 'Markets',
    headline: 'Global Sovereign Bond Yields Tighten Following Synchronized Central Bank Signals',
    summary: 'Long-duration government bond prices appreciated globally as investors recalibrated terminal interest rate expectations across major currencies.',
    source: 'Global Bond Insight',
    date: 'Sep 04, 2026',
    readTime: '3 min read',
    url: 'https://globalbondinsight.com/fixed-income/sovereign-yield-curves-central-bank-forward-guidance',
    related: 'TLT',
    whatHappened: 'Ten-year sovereign benchmark bond yields compressed across the US, UK, and Eurozone, declining by an average of 12 to 18 basis points over the trading week. The rally in government bond prices followed coordinated forward guidance statements from central bank governors indicating that global rate hike cycles have reached their structural zenith.',
    whyDidItHappen: 'Synchronized disinflation indicators across major developed economies, accompanied by cooling labor market vacancies, provided policymakers the room to signal that policy rates have achieved sufficiently restrictive levels to anchor long-term price stability.',
    whyDoesItMatter: 'Sovereign bond yields establish the global risk-free rate used to discount all future cash flows across equities, commercial real estate, and project finance. Declining yields compress debt refinancing costs for sovereign governments and lower capital costs for private enterprises.',
    marketImpact: {
      affectedSectors: ['Banking & Financial Services', 'Sovereign Debt'],
      symbols: ['TLT'],
      priceMovement: null,
      contextNote: 'Sovereign yield curve inversions eased modestly as intermediate-to-long maturity bonds attracted institutional liability-driven asset managers and pension fund allocations.',
      isEstablished: true
    },
    keyTakeaways: [
      'Global 10-year sovereign yields declined 12 to 18 basis points across major developed markets.',
      'Central bank forward guidance confirmed policy rates are at structurally restrictive peaks.',
      'Cooling wage inflation and normalized supply chains supported long-duration bond valuations.',
      'Lower sovereign benchmark yields provide breathing room for commercial debt refinancing.'
    ]
  },
  {
    id: 8,
    category: 'Stocks',
    headline: 'Renewable Energy Equities Attract Domestic Mutual Fund Accumulation on Grid Expansion Mandates',
    summary: 'Solar and wind infrastructure suppliers witnessed steady institutional accumulation on expanding state transmission capacity contracts.',
    source: 'Equity Focus',
    date: 'Sep 03, 2026',
    readTime: '3 min read',
    url: 'https://equityfocus.in/renewables/green-energy-grid-transmission-institutional-inflows',
    related: 'ADANIGREEN,TATAPOWER',
    whatHappened: 'Domestic institutional investors (DIIs) and green energy ESG mutual funds increased net equity allocations across power transmission engineering companies, solar module manufacturers, and battery storage providers. Inflows accelerated following the formal award of ₹22,500 crore in high-voltage direct current (HVDC) interstate transmission projects.',
    whyDidItHappen: 'The allocation surge was prompted by statutory government mandates requiring 50% non-fossil energy generation by 2030, paired with rapid expansion of dedicated green energy transmission corridors connecting desert solar installations to metropolitan industrial hubs.',
    whyDoesItMatter: 'Power transmission infrastructure was previously the critical bottleneck preventing renewable power evacuation. These contract awards provide 3-to-4 years of verified revenue visibility for infrastructure suppliers and de-risk commercial solar farm project economics.',
    marketImpact: {
      affectedSectors: ['Clean Energy & Renewables', 'Industrial Infrastructure'],
      symbols: ['ADANIGREEN', 'TATAPOWER'],
      priceMovement: null,
      contextNote: 'Order books for grid transmission suppliers expanded by 28% year-over-year, leading equity analysts to revise multi-year revenue compounding estimates upward.',
      isEstablished: true
    },
    keyTakeaways: [
      'Domestic mutual funds deployed substantial net capital into renewable grid infrastructure equities.',
      '₹22,500 crore in interstate high-voltage transmission contracts awarded to private consortiums.',
      'Government statutory mandates targeting 50% non-fossil power by 2030 ensure durable order pipelines.',
      'Transmission corridor expansion unblocks previously stranded solar and wind generating capacity.'
    ]
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
  },
  {
    id: 'r-7',
    symbol: 'SBIN',
    name: 'State Bank of India',
    sector: 'Banking & Financials',
    price: '₹825.00',
    target: '₹950.00',
    rating: 'Buy',
    ratingType: 'buy',
    sentiment: '78% Positive',
    riskLevel: 'Low',
    peRatio: '10.8',
    rationale: 'Illustrative research profile: Robust deposit franchise, sustained asset quality improvements with declining gross NPAs, and steady credit growth across corporate and retail lending.'
  },
  {
    id: 'r-8',
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd',
    sector: 'Banking & Financials',
    price: '₹1,260.00',
    target: '₹1,450.00',
    rating: 'Strong Buy',
    ratingType: 'strong-buy',
    sentiment: '88% Positive',
    riskLevel: 'Low',
    peRatio: '17.6',
    rationale: 'Illustrative research profile: Consistent return on assets, resilient net interest margin delivery, and market-leading digital underwriting across retail and business banking segments.'
  },
  {
    id: 'r-9',
    symbol: 'BHARTIARTL',
    name: 'Bharti Airtel Ltd',
    sector: 'Telecommunications',
    price: '₹1,640.00',
    target: '₹1,880.00',
    rating: 'Buy',
    ratingType: 'buy',
    sentiment: '81% Positive',
    riskLevel: 'Medium',
    peRatio: '42.3',
    rationale: 'Illustrative research profile: Industry-leading ARPU expansion, continuous premium customer additions, and disciplined capital allocation across 5G network rollouts and enterprise cloud services.'
  },
  {
    id: 'r-10',
    symbol: 'ITC',
    name: 'ITC Limited',
    sector: 'Consumer Goods',
    price: '₹480.00',
    target: '₹540.00',
    rating: 'Hold',
    ratingType: 'hold',
    sentiment: '64% Neutral',
    riskLevel: 'Low',
    peRatio: '27.5',
    rationale: 'Illustrative research profile: Steady cash generation from core cigarette operations, reliable dividend yield, and progressive margin expansion in diversified FMCG and agribusiness verticals.'
  },
  {
    id: 'r-11',
    symbol: 'M&M',
    name: 'Mahindra & Mahindra Ltd',
    sector: 'Automotive & Farm Equipment',
    price: '₹2,820.00',
    target: '₹3,200.00',
    rating: 'Strong Buy',
    ratingType: 'strong-buy',
    sentiment: '84% Positive',
    riskLevel: 'Medium',
    peRatio: '29.4',
    rationale: 'Illustrative research profile: Dominant market leadership in core SUV and tractor manufacturing, accelerating commercial electric vehicle rollout, and disciplined capital allocation across core businesses.'
  },
  {
    id: 'r-12',
    symbol: 'SUNPHARMA',
    name: 'Sun Pharmaceutical Industries',
    sector: 'Pharmaceuticals & Healthcare',
    price: '₹1,720.00',
    target: '₹1,950.00',
    rating: 'Buy',
    ratingType: 'buy',
    sentiment: '76% Positive',
    riskLevel: 'Low',
    peRatio: '35.1',
    rationale: 'Illustrative research profile: Strong expansion in global specialty dermatology and ophthalmology portfolios supporting top-line resilience and domestic formulation market leadership.'
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
