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
      summary: 'Learn how spreading capital across uncorrelated asset classes limits downside while preserving long-term growth.'
    },
    {
      id: 'edu-2',
      title: 'Beginner Investing Concepts',
      category: 'Investing 101',
      readTime: '7 min read',
      summary: 'Demystifying compound interest, systematic investment plans (SIPs), and index funds with zero jargon.'
    },
    {
      id: 'edu-3',
      title: 'Understanding Market Risk',
      category: 'Risk Management',
      readTime: '6 min read',
      summary: 'The crucial difference between systematic market risk and company-specific risk, and how to stay resilient.'
    },
    {
      id: 'edu-4',
      title: 'Portfolio Allocation Basics',
      category: 'Asset Strategy',
      readTime: '8 min read',
      summary: 'How time horizons and personal risk tolerances should dictate your target equity-debt split.'
    }
  ],
  videoTutorials: [
    {
      id: 'yt-1',
      title: 'Mastering Index Fund Investing for Beginners',
      channel: 'FinSight Learning Lab',
      duration: '14:20',
      topic: 'Index Funds'
    },
    {
      id: 'yt-2',
      title: 'How Asset Allocation Actually Works',
      channel: 'Financial Foundations',
      duration: '11:45',
      topic: 'Portfolio Strategy'
    },
    {
      id: 'yt-3',
      title: 'Building Your First Emergency Fund',
      channel: 'Wealth Building 101',
      duration: '09:10',
      topic: 'Personal Finance'
    },
    {
      id: 'yt-4',
      title: 'Crypto vs Equities: Risk & Volatility Explained',
      channel: 'Macro Analysis Hub',
      duration: '16:30',
      topic: 'Crypto & Assets'
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
