# FinSight — Code Execution & Data Flow Architecture

> **Project:** FinSight — Personal & Business Financial Intelligence Platform  
> **Repository:** `harmankaur-13/FinSight`  
> **Document:** `flow.md`  
> **Author & Lead Developer:** Harman Kaur & Team  
> **Date:** October 2026

---

## 1. High-Level Execution Overview

FinSight is an entirely client-side, local-first Single-Page Application (SPA). There is no intermediary Node.js or Express backend server; all routing, business logic, state derivation, mathematical rebalancing, and external API integrations execute directly within the user's browser runtime.

```mermaid
flowchart TD
    HTML[index.html] --> Main[main.jsx]
    Main --> ThemeProv[ThemeProvider in ThemeContext.jsx]
    ThemeProv --> App[App.jsx]
    App --> Hook[useFinanceData Hook]
    
    subgraph State_Init [State Initialization]
        Hook --> LocalUser[(localStorage: finsight_user)]
        Hook --> LocalData[(localStorage: finsight_financial_data)]
        Hook --> LocalAccounts[(localStorage: finsight_accounts)]
    end

    subgraph Routing_Engine [Routing & Layout Dispatch]
        App --> Router[BrowserRouter & Routes]
        Router --> Public[PublicLayout]
        Router --> Adaptive[AdaptiveLayout]
        Router --> Protected[ProtectedRoute]
        Protected --> DashLayout[DashboardLayout]
    end

    subgraph Views [Page Views]
        DashLayout --> Student[StudentDashboard]
        DashLayout --> Business[BusinessDashboard]
        DashLayout --> Tech[TechDashboard]
        DashLayout --> Settings[Settings Page]
        DashLayout --> FloatSettings[FloatingSettings Overlay]
        Adaptive --> News[News Page]
        Adaptive --> Ratings[Ratings Page]
        Adaptive --> Features[Features Page]
        Adaptive --> About[About Page]
    end

    subgraph External_APIs [External Data Feeds]
        News --> Finnhub[Finnhub Market News API]
        Ratings --> TejHQ[TejHQ NSE Daily Quotes API]
    end
```

---

## 2. Application Bootstrapping & Lifecycle Flow

```mermaid
sequenceDiagram
    autonumber
    participant Browser as Browser Client
    participant Main as src/main.jsx
    participant Theme as src/context/ThemeContext.jsx
    participant App as src/App.jsx
    participant Hook as src/hooks/useFinanceData.js
    participant Storage as Browser localStorage

    Browser->>Main: Load HTML & bundle entry
    Main->>Theme: Mount <ThemeProvider>
    Theme->>Storage: Read 'finsight_theme'
    alt Theme found in localStorage
        Storage-->>Theme: Return 'light' or 'dark'
    else Theme not in localStorage
        Theme->>Browser: Check window.matchMedia('(prefers-color-scheme: dark)')
        Browser-->>Theme: Match result (true/false)
    end
    Theme->>Browser: Set document.documentElement[data-theme] & toggle .dark
    Theme->>App: Render <App />
    App->>Hook: Execute useFinanceData()
    Hook->>Storage: Read 'finsight_user'
    Hook->>Storage: Read 'finsight_financial_data'
    Hook->>Hook: Compute memoized studentData, businessData, techData
    Hook-->>App: Return user, isAuthenticated, financialData, mutations, persona data
    App->>Browser: Render active route matching window.location.pathname
```

### Step-by-Step Code Walkthrough:
1. **Entry Point (`index.html`):** The browser loads the DOM root `<div id="root"></div>` and downloads `/src/main.jsx`.
2. **Theme Initialization (`src/context/ThemeContext.jsx`):**
   - The `ThemeProvider` runs its lazy state initializer:
     ```javascript
     const [theme, setThemeState] = useState(() => {
       const saved = localStorage.getItem('finsight_theme');
       if (saved === 'light' || saved === 'dark') return saved;
       if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
       return 'light';
     });
     ```
   - In a `useEffect`, it synchronizes the DOM:
     ```javascript
     document.documentElement.setAttribute('data-theme', theme);
     document.documentElement.classList.toggle('dark', theme === 'dark');
     ```
   - Registers a media query listener for OS-level theme changes.
3. **Application State Hook (`src/hooks/useFinanceData.js`):**
   - The central `useFinanceData()` hook is invoked at the root of `App.jsx`.
   - Reads `finsight_user`, parsing the stored JSON and applying `formatHumanName(parsed.name)` to ensure human-friendly display names.
   - Reads `finsight_financial_data` keyed by lowercase email.
   - Derives all computed financial outputs via `useMemo` (`calculatedStudentData`, `calculatedBusinessData`, `calculatedTechData`).

---

## 3. Routing, Route Guards & Layout Resolution Flow

```mermaid
flowchart TD
    Start([Route Requested: URL]) --> CheckPath{Path Type}

    CheckPath -->|/| CheckLandingAuth{Is Authenticated & Onboarded?}
    CheckLandingAuth -->|Yes| RedirRole[Redirect to Role Dashboard via getRoleDashboardPath]
    CheckLandingAuth -->|No| RenderLanding[Render Landing Page in PublicLayout]

    CheckPath -->|/login or /signup| CheckAuth{Is Authenticated?}
    CheckAuth -->|Yes| RedirRole
    CheckAuth -->|No| RenderAuth[Render Login / Signup Page]

    CheckPath -->|/onboarding| CheckOnboardAuth{Is Logged In?}
    CheckOnboardAuth -->|Yes| RenderOnboarding[Render Onboarding Wizard]
    CheckOnboardAuth -->|No| RedirectLogin[Redirect to /login]

    CheckPath -->|/features, /news, /ratings, /about| AdaptiveCheck{Is Logged In?}
    AdaptiveCheck -->|Yes| RenderDashLayout[Wrap in DashboardLayout]
    AdaptiveCheck -->|No| RenderPubLayout[Wrap in PublicLayout]

    CheckPath -->|/student-dashboard| GuardStudent{Role == student?}
    GuardStudent -->|Yes| RenderStudent[Render StudentDashboard]
    GuardStudent -->|No| RejectRole[Redirect to user's assigned dashboard]

    CheckPath -->|/business-dashboard| GuardBiz{Role == business?}
    GuardBiz -->|Yes| RenderBiz[Render BusinessDashboard]
    GuardBiz -->|No| RejectRole

    CheckPath -->|/tech-dashboard| GuardTech{Role == tech?}
    GuardTech -->|Yes| RenderTech[Render TechDashboard]
    GuardTech -->|No| RejectRole

    CheckPath -->|/settings| RenderSettings[Render Settings Page]
```

### Route Guard Implementation Details (`ProtectedRoute.jsx`):
- **Authentication Check:** If `user.isLoggedIn` is false, redirects to `/login` with `replace: true`.
- **Onboarding Check:** If `requireOnboardingCompleted` is true and `user.needsOnboarding` is true, intercepts navigation and redirects to `/onboarding`.
- **Role Isolation Check:** If `allowedRole` is specified and `user.userType !== allowedRole`, redirects to `getRoleDashboardPath(user.userType)` to prevent cross-persona pollution.

---

## 4. State Management & Data Mutation Pipeline

All persistent mutations follow an atomic unidirectional data flow:

```mermaid
sequenceDiagram
    autonumber
    participant UI as Component (e.g. ManagePortfolioModal)
    participant Hook as useFinanceData.js
    participant PureMath as financialCalculations.js
    participant Storage as localStorage (finsight_financial_data)
    participant Dashboard as Active Persona Dashboard

    UI->>Hook: addInvestment({ name: "TCS", type: "Stocks", investedAmount: 50000, currentValue: 54000 })
    Hook->>Hook: Sanitize inputs & assign unique UUID (inv-172985...)
    Hook->>Hook: Update financialData.investments array
    Hook->>Storage: Persist updated dictionary under user.email key
    Hook->>PureMath: calculatePortfolioValue(newInvestments)
    PureMath-->>Hook: ₹54,000
    Hook->>PureMath: calculateAssetAllocations(newInvestments)
    PureMath-->>Hook: [{ name: 'Stocks', percentage: 100, value: 54000 }]
    Hook->>PureMath: calculateAllocationDrift(newInvestments, allocations)
    PureMath-->>Hook: Drift analysis object
    Hook->>Dashboard: Re-render dashboard with updated memoized properties
    Dashboard->>UI: Close modal & display Toast confirmation
```

### Core Mutations in `useFinanceData.js`:
- `addInvestment(investment)`: Generates crypto-random ID, normalizes numbers, pushes to `financialData.investments`, and writes to `localStorage`.
- `updateInvestment(id, updated)`: Performs immutable `.map()` update over holdings array.
- `deleteInvestment(id)`: Filters out targeted investment by ID.
- `addGoal(goal)`, `updateGoal(id, updated)`, `deleteGoal(id)`: Manages custom milestone tracking for student and personal savers.
- `updateMonthlySavings(amount)`: Modifies monthly savings parameter, instantly updating compound projections.
- `updateProfile(profileData)`: Synchronizes name, email, avatar, persona, and initial balances across both `finsight_user` and `finsight_accounts`.

---

## 5. Market News API Flow (`services/newsApi.js`)

```mermaid
sequenceDiagram
    autonumber
    participant Page as src/pages/News/News.jsx
    participant Service as src/services/newsApi.js
    participant Finnhub as Finnhub REST API
    participant Fallback as src/data/mockData.js

    Page->>Page: User mounts page or selects category (e.g. "Technology")
    Page->>Service: fetchMarketNews("technology")
    Service->>Service: Read VITE_FINNHUB_API_KEY from environment
    alt API Key Missing or Invalid
        Service-->>Page: Throw "Finnhub API key is missing"
        Page->>Fallback: Load curated NEWS_DATA
        Page->>Page: Set isUsingFallback = true & show Info Banner
    else API Key Present
        Service->>Service: Build URLSearchParams({ category, token })
        Service->>Finnhub: GET https://finnhub.io/api/v1/news?...
        alt HTTP 200 OK
            Finnhub-->>Service: Return JSON array of raw articles
            loop For each article
                Service->>Service: normalizeFinnhubArticle(raw, index)
                Service->>Service: formatNewsDate(raw.datetime)
                Service->>Service: normalizeCategory(raw.category)
                Service->>Service: Calculate read time from word count
            end
            Service-->>Page: Return normalized article objects
            Page->>Page: Set newsArticles = normalized & render NewsCard list
        else HTTP 429 Rate Limit or Error
            Finnhub-->>Service: HTTP 429 / 500
            Service-->>Page: Throw descriptive error
            Page->>Fallback: Load curated NEWS_DATA
            Page->>Page: Set isUsingFallback = true & show Warning Banner
        end
    end
```

---

## 6. Live Stock Ratings & NSE Quotes Flow (`services/ratingsApi.js`)

```mermaid
sequenceDiagram
    autonumber
    participant Page as src/pages/Ratings/Ratings.jsx
    participant Service as src/services/ratingsApi.js
    participant TejHQ as TejHQ Daily OHLCV API
    participant StaticData as src/data/mockData.js

    Page->>Page: Mount page with 12 curated equities (INFY, TCS, RELIANCE, etc.)
    loop For each equity symbol
        Page->>Service: fetchStockQuote(symbol)
        Service->>Service: Validate symbol against SUPPORTED_SYMBOLS whitelist
        alt Symbol Not Whitelisted
            Service-->>Page: Throw "Unsupported symbol"
            Page->>StaticData: Retain static benchmark quote
        else Symbol Valid
            Service->>TejHQ: GET https://api.tejhq.dev/v1/ohlcv/nse/{SYMBOL}
            alt Network & HTTP Success
                TejHQ-->>Service: JSON with payload.data array
                Service->>Service: Find row with latest date timestamp
                Service->>Service: normalizeTejHqRow(symbol, latestRow)
                Service->>Service: Calculate change & changePercent vs prev_close
                Service-->>Page: Return { price, previousClose, change, changePercent }
                Page->>Page: Update liveQuotes[symbol] state
                Page->>Page: Render RatingCard with "Live NSE Quote" green badge
            else Network Fails or Non-200
                TejHQ-->>Service: Error / Timeout
                Service-->>Page: Catch error
                Page->>StaticData: Retain static benchmark quote
                Page->>Page: Render RatingCard with "Offline Reference" badge
            end
        end
    end
```

---

## 7. Portfolio Rebalancing Engine Flow (`RebalanceEngine.jsx`)

```mermaid
flowchart TD
    Mount[User opens Rebalance Engine tab] --> LoadAllocs[Compute currentAllocations from holdings]
    LoadAllocs --> CheckTargets{Targets configured in holdings?}
    CheckTargets -->|Yes| SetUserTargets[Pre-populate targets from holdings]
    CheckTargets -->|No| SetDefaultTargets[Pre-populate default targets 60/25/15]

    SetUserTargets --> UserAdjust[User adjusts slider or inputs newCash]
    SetDefaultTargets --> UserAdjust

    UserAdjust --> ValidateSum{Targets sum to 100%?}
    ValidateSum -->|No| ShowError[Display 'Target allocations must sum to 100%']
    ValidateSum -->|Yes| CallRebalance[Call calculateRebalanceTrades]

    CallRebalance --> ModeCheck{allowSell is true?}
    
    ModeCheck -->|Yes: Full Rebalance| FullRebalance[Calculate ideal target valuation per asset = totalPostValue * targetPct]
    FullRebalance --> DiffCalc[diff = targetVal - currVal]
    DiffCalc --> GenerateFullTrades[Generate BUY trades for diff > 0 and SELL trades for diff < 0]

    ModeCheck -->|No: Buy-Only Mode| ShortfallCalc[Calculate shortfalls against expanded portfolio]
    ShortfallCalc --> ScaleCash[Scale newCash proportionally across shortfalls]
    ScaleCash --> RoundCheck[Prevent rounding overshoot against newCash]
    RoundCheck --> GenerateBuyOnlyTrades[Generate BUY trades only, 0 sells]

    GenerateFullTrades --> DriftAfter[Compute allocationsAfter & maxDriftAfter]
    GenerateBuyOnlyTrades --> DriftAfter
    DriftAfter --> RenderUI[Render Trade Recommendations & Drift Comparison Matrix]
```

---

## 8. Floating Settings & Profile Synchronization Flow

```mermaid
sequenceDiagram
    autonumber
    participant Nav as src/components/DashboardNav.jsx
    participant Drawer as src/components/FloatingSettings.jsx
    participant FullSettings as src/pages/Settings/Settings.jsx
    participant Hook as src/hooks/useFinanceData.js
    participant Theme as src/context/ThemeContext.jsx
    participant Storage as Browser localStorage

    Nav->>Drawer: User clicks gear icon or avatar in top nav
    Drawer->>Drawer: Toggle isOpen state (animate slide-over drawer)
    
    par Quick Theme Switch
        Drawer->>Theme: toggleTheme() or setTheme('dark')
        Theme->>Storage: Write 'finsight_theme'
        Theme->>Nav: CSS Custom Properties update instantly
    and Switch Active Persona
        Drawer->>Hook: switchRole('business')
        Hook->>Storage: Update finsight_user.userType = 'business'
        Hook->>Nav: Re-render nav links for Business Dashboard
    and Navigate to Full Settings
        Drawer->>FullSettings: Click "Open Full Settings" -> navigate('/settings')
    end

    FullSettings->>FullSettings: Render 5 tabs (Profile, Preferences, Appearance, Alerts, Security)
    FullSettings->>Hook: updateProfile({ name: "Harman Kaur", avatar: "...", preferences: {...} })
    Hook->>Storage: Persist to 'finsight_accounts' and 'finsight_user'
    Hook-->>FullSettings: Show Toast: "Settings saved successfully"
```

---

## 9. Comprehensive Function Call Cross-Reference Table

| Caller File & Function | Callee File & Function | Arguments Passed | Return Value | Purpose & Side Effect |
| :--- | :--- | :--- | :--- | :--- |
| `App.jsx:App()` | `useFinanceData()` | None | State & dispatch object | Initializes global user session, holdings CRUD, and memoized persona datasets. |
| `App.jsx:App()` | `getRoleDashboardPath()` | `user.userType` | String path (e.g. `"/student-dashboard"`) | Directs authenticated users to their specific dashboard route. |
| `useFinanceData.js` | `formatHumanName()` | `rawInput` (string) | Formatted string (e.g. `"Harman Kaur"`) | Cleans email addresses, splits camelCase, and separates unspaced Indian surnames. |
| `useFinanceData.js` | `calculatePortfolioValue()` | `investments` (array) | Number (`totalValue`) | Computes portfolio market valuation with fallback to invested amount. |
| `useFinanceData.js` | `calculateTotalInvested()` | `investments` (array) | Number (`totalInvested`) | Aggregates base invested capital expenditure across all holdings. |
| `useFinanceData.js` | `calculateProfitLoss()` | `investments` (array) | Number (`profitLoss`) | Derives net absolute financial return ($\text{Valuation} - \text{Invested}$). |
| `useFinanceData.js` | `calculatePerformance()` | `investments` (array) | Object (`{ percentage, formatted, isPositive, raw }`) | Generates formatted percentage returns (e.g. `"+12.4%"`). |
| `useFinanceData.js` | `calculateAssetAllocations()` | `investments` (array) | Array of allocation objects | Groups holdings by asset class, calculating percentage weights and colors. |
| `useFinanceData.js` | `calculateAllocationDrift()` | `investments`, `allocations` | Object (`{ driftText, hasTarget, isConfigured, value }`) | Computes maximum percentage deviation between actual and target allocations. |
| `RebalanceEngine.jsx` | `calculateRebalanceTrades()` | `investments`, `targets`, `options` | Optimization result object | Computes exact BUY and SELL trades, remaining cash, and post-rebalance drift. |
| `FutureSimulation.jsx` | Compound Math Formula | `initialPrincipal`, `years`, `monthly`, `rate` | Number (`simulatedTotal`) | Calculates future compounded investment balance via financial annuity formula. |
| `PortfolioChart.jsx` | `getStoredValueHistory()` | `storageKey` | Array of `{ date, totalValue }` | Reads sorted daily portfolio value snapshots from `localStorage`. |
| `PortfolioChart.jsx` | `saveValueSnapshot()` | `totalValue`, `dateStr` | Array of `{ date, totalValue }` | Appends or updates today's portfolio snapshot (capped at 365 entries). |
| `PortfolioChart.jsx` | `filterHistoryByTimeframe()` | `history`, `timeframe` | Filtered array | Filters historical points by 1M, 6M, 1Y, or ALL cutoff dates. |
| `PortfolioChart.jsx` | `generateProjectedGrowth()` | `baseValue`, `expectedReturn`, `months` | Array of projected points | Synthesizes compound growth points when historical data has <2 points. |
| `News.jsx:loadNews()` | `fetchMarketNews()` | `category`, `customApiKey` | Promise resolving to normalized articles | Fetches real-time financial headlines from Finnhub with offline fallback. |
| `newsApi.js` | `normalizeCategory()` | `rawCategory` | Standardized string | Normalizes arbitrary category strings into standard FinSight categories. |
| `newsApi.js` | `formatNewsDate()` | `unixTimestamp` | String (`"Oct 23, 2026"`) | Converts UNIX seconds epoch into human-readable date. |
| `Ratings.jsx:loadQuotes()` | `fetchStockQuote()` | `symbol`, `customFetch` | Promise resolving to quote object | Fetches daily NSE OHLCV quotes from TejHQ with symbol whitelist validation. |
| `ratingsApi.js` | `isSupportedSymbol()` | `symbol` | Boolean | Verifies symbol against `SUPPORTED_SYMBOLS` whitelist before URL construction. |
| `ratingsApi.js` | `normalizeTejHqRow()` | `symbol`, `row` | Quote object | Extracts latest closing price and computes change vs previous close. |
| `ratingsApi.js` | `formatCurrencyINR()` | `amount` | String (`"₹1,840.50"`) | Formats numeric price into standard Indian Rupee notation. |
| `Settings.jsx:handleSave()` | `updateProfile()` | `profileData` | None | Persists updated user name, avatar, and persona preferences to `localStorage`. |
