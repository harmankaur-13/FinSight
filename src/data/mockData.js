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
  educationalModules: [],
  financialKnowledgeResources: [
    {
      id: 'res-1',
      title: 'Zerodha Varsity: Technical Analysis & Charting',
      platform: 'Zerodha Varsity',
      domain: 'zerodha.com/varsity',
      url: 'https://zerodha.com/varsity/module/technical-analysis/',
      topic: 'Trading & Technical Analysis',
      difficulty: 'Beginner to Intermediate',
      format: 'Comprehensive Course',
      summary: 'The industry-standard technical trading curriculum in India. Covers candlestick theory, chart patterns, support & resistance, moving averages, and momentum indicators.',
      takeaways: [
        'Single & multiple candlestick patterns',
        'Support, resistance, & trendline breakout dynamics',
        'Dow Theory & volume confirmation filters',
        'Moving averages, RSI, and MACD indicators'
      ]
    },
    {
      id: 'res-2',
      title: 'TradingView Education: Interactive Charting & Market Mechanics',
      platform: 'TradingView',
      domain: 'tradingview.com',
      url: 'https://www.tradingview.com/education/',
      topic: 'Trading & Technical Analysis',
      difficulty: 'Intermediate',
      format: 'Interactive Tooling',
      summary: 'Hands-on training in multi-timeframe price action, trend channels, Fibonacci retracements, and configuring risk-defined stop-losses on institutional charts.',
      takeaways: [
        'Multi-timeframe charting architecture',
        'Trend channels & volatility breakout envelopes',
        'Order flow & volume profile mechanics',
        'Interactive paper trading setup'
      ]
    },
    {
      id: 'res-3',
      title: 'BabyPips: School of Pipsology (Price Action & Structure)',
      platform: 'BabyPips',
      domain: 'babypips.com',
      url: 'https://www.babypips.com/learn',
      topic: 'Trading & Technical Analysis',
      difficulty: 'Beginner to Advanced',
      format: 'Structured Curriculum',
      summary: 'Acclaimed global academy breaking down market structure, liquidity pools, breakout vs range strategies, and strict position-sizing mathematics.',
      takeaways: [
        'Market structure & price action identification',
        'Risk-to-reward ratio calculations (1:2+)',
        'Distinguishing true breakouts from liquidity traps',
        'Trading plan design & disciplined journaling'
      ]
    },
    {
      id: 'res-4',
      title: 'Zerodha Varsity: Fundamental Analysis & Financial Statements',
      platform: 'Zerodha Varsity',
      domain: 'zerodha.com/varsity',
      url: 'https://zerodha.com/varsity/module/fundamental-analysis/',
      topic: 'Fundamental Valuation',
      difficulty: 'Intermediate',
      format: 'Course Modules',
      summary: 'A structured blueprint for analyzing corporate balance sheets, P&L statements, cash flows, and computing vital corporate valuation multiples.',
      takeaways: [
        'Reading balance sheet assets, liabilities, & equity',
        'Calculating P/E, P/B, EV/EBITDA, and ROCE ratios',
        'Operating cash flows vs reported net profits',
        'Evaluating economic moats & business longevity'
      ]
    },
    {
      id: 'res-5',
      title: 'Screener.in: Financial Statement Analyzer & Stock Screener',
      platform: 'Screener.in',
      domain: 'screener.in',
      url: 'https://www.screener.in/',
      topic: 'Fundamental Valuation',
      difficulty: 'Practical Tool',
      format: 'Financial Data Portal',
      summary: 'The primary fundamental research portal for Indian equities. Access 10+ years of balance sheets, concall transcripts, shareholding trends, and custom filters.',
      takeaways: [
        '10-year historical financial records & trends',
        'Quarterly earnings concalls & investor presentations',
        'Peer group valuation & margin comparisons',
        'Custom screening formulas for undervalued stocks'
      ]
    },
    {
      id: 'res-6',
      title: 'Investopedia: Stock Market Order Execution & Trading Basics',
      platform: 'Investopedia',
      domain: 'investopedia.com',
      url: 'https://www.investopedia.com/trading-4427765',
      topic: 'Stock Markets & Exchanges',
      difficulty: 'Foundational',
      format: 'Reference Guide',
      summary: 'Authoritative guide to stock exchange mechanics, market depth, bid-ask spread liquidity, market vs limit vs stop-loss orders, and trade settlement rules.',
      takeaways: [
        'Market vs Limit vs Stop-loss order types',
        'Bid-Ask spread & order book depth dynamics',
        'Clearing houses, depository participants, & brokers',
        'Circuit breakers & exchange trading halts'
      ]
    },
    {
      id: 'res-7',
      title: 'NSE India Investor Academy: Indian Market Architecture',
      platform: 'NSE India',
      domain: 'nseindia.com',
      url: 'https://www.nseindia.com/learn/investor-education',
      topic: 'Stock Markets & Exchanges',
      difficulty: 'Institutional',
      format: 'Official Exchange Portal',
      summary: 'Official education initiative by the National Stock Exchange of India. Explains exchange operations, Nifty benchmark indices, and T+1 rolling settlements.',
      takeaways: [
        'Primary vs secondary market operations',
        'T+1 rolling settlement and delivery obligations',
        'Index construction & market-cap weighting criteria',
        'Retail investor protections and market transparency'
      ]
    },
    {
      id: 'res-8',
      title: 'Bogleheads: The Philosophy of Low-Cost Index Investing',
      platform: 'Bogleheads Wiki',
      domain: 'bogleheads.org',
      url: 'https://www.bogleheads.org/wiki/Bogleheads%C2%AE_investment_philosophy',
      topic: 'Investing & Asset Allocation',
      difficulty: 'Core Philosophy',
      format: 'Reference Wiki',
      summary: 'Derived from Vanguard founder John Bogle, this guide outlines passive broad-market compounding, the three-fund portfolio, and avoiding active fund fee drag.',
      takeaways: [
        'Broad market index diversification over stock picking',
        'Minimizing expense ratios & turnover taxation',
        'Three-fund portfolio architecture for students',
        'Systematic dollar-cost averaging through all cycles'
      ]
    },
    {
      id: 'res-9',
      title: 'Morningstar Classroom: Asset Allocation & Fund Evaluation',
      platform: 'Morningstar',
      domain: 'morningstar.com',
      url: 'https://www.morningstar.com/learn',
      topic: 'Investing & Asset Allocation',
      difficulty: 'Intermediate',
      format: 'Analyst Academy',
      summary: 'Institutional-grade tutorials on asset allocation modeling, portfolio risk-adjusted returns (Sharpe ratio, Alpha, Beta), and fund overlap elimination.',
      takeaways: [
        'Modern portfolio allocation principles & drift',
        'Risk-adjusted performance metrics (Sharpe & Beta)',
        'Mutual fund expense drag compounding math',
        'Style box & sector concentration analysis'
      ]
    },
    {
      id: 'res-10',
      title: 'Zerodha Varsity: Risk Management & Trading Mindset',
      platform: 'Zerodha Varsity',
      domain: 'zerodha.com/varsity',
      url: 'https://zerodha.com/varsity/module/risk-management-mindset/',
      topic: 'Risk & Trading Psychology',
      difficulty: 'Crucial for Traders',
      format: 'Strategy Blueprint',
      summary: 'The dividing line between profitable traders and ruined accounts. Covers position sizing formulas, drawdown math, the 1-2% account risk rule, and cognitive bias control.',
      takeaways: [
        'The 1% - 2% maximum account risk rule per trade',
        'Position sizing mathematical calculations',
        'Asymmetric drawdown recovery mathematics',
        'Managing FOMO, revenge trading, and greed'
      ]
    },
    {
      id: 'res-11',
      title: 'SEBI Investor Education Portal: Rights, Safety & SCORES',
      platform: 'SEBI India',
      domain: 'investor.sebi.gov.in',
      url: 'https://investor.sebi.gov.in/',
      topic: 'Regulations & Investor Protection',
      difficulty: 'Essential Safety',
      format: 'Statutory Authority',
      summary: 'Official retail investor protection hub by India’s capital markets regulator. Covers Demat account security, broker verification, SCORES grievance redressal, and avoiding illicit schemes.',
      takeaways: [
        'Investor rights & broker code of conduct',
        'SEBI SCORES online grievance dispute system',
        'Demat account safety & two-factor authorization',
        'Recognizing illegal tip channels and fake advisory'
      ]
    },
    {
      id: 'res-12',
      title: 'Reserve Bank of India (RBI): Financial Education & Macro Policy',
      platform: 'RBI Financial Education',
      domain: 'rbi.org.in',
      url: 'https://rbi.org.in/financialeducation/',
      topic: 'Macroeconomics & Central Banking',
      difficulty: 'Macroeconomic Context',
      format: 'Central Bank Portal',
      summary: 'Foundational economic literacy from India’s central banking authority. Explains repo rates, inflation drivers, liquidity adjustments, debt markets, and deposit insurance.',
      takeaways: [
        'Monetary policy & repo rate transmission',
        'Inflation mechanics & purchasing power protection',
        'Government securities (G-Sec) & treasury bills',
        'Banking regulations & DICGC deposit protection'
      ]
    }
  ],
  videoTutorials: [],
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
