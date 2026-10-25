<p align="center">
  <picture>
    <source
      media="(prefers-color-scheme: dark)"
      srcset="./public/images/finsight-logo-dark.png"
    />
    <source
      media="(prefers-color-scheme: light)"
      srcset="./public/images/finsight-logo.png"
    />
    <img
      src="./public/images/finsight-logo.png"
      alt="FinSight Logo"
      width="400"
    />
  </picture>
</p>

# FinSight

> Personal & Business Financial Intelligence Platform

FinSight is a modern financial intelligence and portfolio analytics web platform designed to help users track, manage, simulate, and optimize their investments through persona-tailored dashboards.

It brings multi-asset portfolio tracking, live market quotes, illustrative research ratings, real-time financial news, portfolio rebalancing, future value simulations, and personalized financial preferences together into a unified, responsive interface with native light and dark modes.

---

## Key Features

### 1. Tailored Multi-Persona Dashboards
FinSight dynamically adapts its dashboard interface, metrics, and workflows to three distinct personas:
- **Student Learner (`/student-dashboard`)**: Monthly savings tracking, emergency fund milestones, custom financial goals, interactive financial education modules, video explainers, future value compound simulations, and contextual assistant suggestions.
- **Business Intelligence (`/business-dashboard`)**: Working capital health, revenue and operating runway metrics, active equity/debt holdings, market risk concentration, multi-year financial projections, and portfolio asset management.
- **Tech / Enterprise (`/tech-dashboard`)**: Large enterprise sector exposure, cost/loss risk metrics, strategic acquisition simulation (e.g. Crunch acquisition scenario), target allocation drift monitoring, and executive rebalancing recommendations.
- **One-Click Demo Switcher**: Instant switching between Student, Business, and Big Tech personas from the navigation bar without re-authenticating.

### 2. User Profile & Floating Settings
- **Discreet Floating Settings Panel**: Accessible via a persistent top-navigation gear trigger and profile avatar on all authenticated pages.
- **Personal Information**: Customizable avatar with presets or custom image URLs, human-friendly name parsing (`formatHumanName`), email management, and active persona switching.
- **Persona-Specific Financial Preferences**: Isolated financial preference fields tailored to each persona (Student budget & savings goals, Business working capital & runway thresholds, Tech enterprise capital budgets & allocation targets).
- **Appearance & Theme**: Seamless Light and Dark mode switching powered by React `ThemeContext` and CSS variables, synchronized with system preferences and persistent in `localStorage`.
- **Security & Privacy Safeguards**: Local-first architecture disclosure, secure sign-out, and protected reset safeguards.

### 3. Live Stock Ratings & Equity Intelligence (`/ratings`)
- **12 Curated Equities**: Comprehensive tracking across major Indian and global market sectors:
  - Reliance Industries (`RELIANCE`), Tata Consultancy Services (`TCS`), Infosys (`INFY`), HDFC Bank (`HDFCBANK`), ICICI Bank (`ICICIBANK`), Tata Motors (`TATAMOTORS`), Bharti Airtel (`BHARTIARTL`), ITC Limited (`ITC`), State Bank of India (`SBIN`), Larsen & Toubro (`LT`), Hindustan Unilever (`HINDUNILVR`), and Mahindra & Mahindra (`M&M`).
- **Live Finnhub Quotes & Graceful Fallback**: Fetches live market prices with seamless offline fallback to curated sample data and clear status badges.
- **Comprehensive Research Analytics**: Illustrative buy/hold/sell consensus gauges, target price spreads, P/E ratios, risk indicators, and market sentiment metrics.
- **Dynamic Filtering & Search**: Real-time filtering by sector (Tech, Banking, Auto, FMCG, Conglomerate, Infrastructure), sorting by price, rating, or market cap, and live keyword search.

### 4. Real-Time Financial News (`/news`)
- **Live Market News Feed**: Integrates with the Finnhub Market News API with resilient fallback to curated market intelligence.
- **Category Filtering**: Explore news across Markets, Technology, Economy, Global, and Cryptocurrency.
- **Rich Article Cards**: Sentiment analysis tags, relative publication timestamps, source attribution, and external article reading links.

### 5. Portfolio Management & Interactive Rebalance Engine
- **Full Investment CRUD**: Add, edit, and delete holdings across five asset classes: Equities, Mutual Funds, Fixed Income, Crypto, and Cash.
- **Real-Time Financial Calculations**: Instant recalculation of total portfolio valuation, invested capital, net profit/loss, and asset allocation percentages.
- **Automated Rebalancing Engine**: Calculates portfolio drift against target allocations and generates recommended buy/sell rebalancing trades with exact currency amounts.

### 6. Interactive Visualizations & Simulations
- **Portfolio Performance Chart**: Interactive Recharts time-series line chart tracking historical portfolio value and growth trajectories.
- **Interactive Asset Allocation Donut**: Custom SVG donut chart featuring animated hover highlights, percentage breakdowns, and legend indicators.
- **Future Value Compound Calculator**: Interactive compounding simulation with configurable monthly contributions, investment time horizons (1–30 years), and expected annual returns.

### 7. Authentication, Onboarding & Routing
- **Complete Auth System**: Sign up, login, demo guest access, and profile switching.
- **Guided Onboarding Wizard (`/onboarding`)**: Collects investment experience, risk tolerance, and starting balances to bootstrap a tailored portfolio.
- **Route Protection**: Role-based `ProtectedRoute` guards and `AdaptiveLayout` ensuring public visitors and authenticated members receive appropriate navigation and access.

---

## Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18 (Functional Components, Hooks) |
| **Build Tool & Dev Server** | Vite 5 |
| **Routing** | React Router DOM v6 (Nested Routes, Protected Route Guards, Adaptive Layouts) |
| **Charts & Visualizations** | Recharts & Custom SVG Visualizations |
| **Styling & Design System** | Vanilla CSS3 (Custom Properties / Design Tokens, Light/Dark Modes, Glassmorphism, Micro-animations) |
| **State & Persistence** | React Context (`ThemeContext`), Custom Hooks (`useFinanceData`), LocalStorage |
| **APIs & Data Services** | Finnhub Stock Quote & Market News APIs with resilient offline fallbacks |
| **Testing** | Vitest (132 unit and integration tests across 8 test suites) |

---

## Project Structure

```text
FinSight/
├── public/                 # Static assets, favicons, and media
├── src/
│   ├── components/         # Reusable UI components, modals, and charts
│   ├── context/            # Global ThemeContext (Light/Dark mode)
│   ├── data/               # Mock data and stock datasets
│   ├── hooks/              # Custom hooks (useFinanceData)
│   ├── layouts/            # Layout wrappers (AdaptiveLayout, DashboardLayout, PublicLayout)
│   ├── pages/              # Application route views and dashboards
│   ├── services/           # Market quotes and news API services
│   ├── utils/              # Financial calculation logic and utilities
│   ├── App.jsx             # Router and top-level route configuration
│   ├── index.css           # Global design system, theme tokens, and typography
│   └── main.jsx            # React root entry point
├── index.html              # HTML entry point
├── package.json            # Project dependencies and scripts
└── vite.config.js          # Vite configuration
```
