import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useFinanceData, getRoleDashboardPath } from './hooks/useFinanceData';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdaptiveLayout from './layouts/AdaptiveLayout';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Landing from './pages/Landing/Landing';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Onboarding from './pages/Onboarding/Onboarding';
import StudentDashboard from './pages/StudentDashboard/StudentDashboard';
import BusinessDashboard from './pages/BusinessDashboard/BusinessDashboard';
import TechDashboard from './pages/TechDashboard/TechDashboard';
import Features from './pages/Features/Features';
import News from './pages/News/News';
import Ratings from './pages/Ratings/Ratings';
import About from './pages/About/About';
import NotFound from './pages/NotFound/NotFound';

export default function App() {
  const {
    user,
    isAuthenticated,
    financialData,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    addGoal,
    updateGoal,
    deleteGoal,
    updateMonthlySavings,
    login,
    signup,
    demoLogin,
    logout,
    updateProfile,
    switchRole,
    studentData,
    businessData,
    techData
  } = useFinanceData();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Landing Page (Redirects to dashboard if already logged in) */}
        <Route element={<PublicLayout user={user} onLogout={logout} />}>
          <Route 
            path="/" 
            element={
              isAuthenticated && !user?.needsOnboarding ? (
                <Navigate to={getRoleDashboardPath(user?.userType)} replace />
              ) : (
                <Landing onDemoLogin={demoLogin} />
              )
            } 
          />
        </Route>

        {/* Shared Content Pages (Adaptive: Uses DashboardLayout when logged in, PublicLayout when logged out) */}
        <Route
          element={
            <AdaptiveLayout
              user={user}
              onLogout={logout}
              onSwitchRole={switchRole}
            />
          }
        >
          <Route path="/features" element={<Features />} />
          <Route path="/news" element={<News />} />
          <Route path="/ratings" element={<Ratings />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound user={user} />} />
        </Route>

        {/* Standalone Auth Pages */}
        <Route
          path="/login"
          element={
            isAuthenticated && !user?.needsOnboarding ? (
              <Navigate to={getRoleDashboardPath(user?.userType)} replace />
            ) : (
              <Login onLogin={login} onDemoLogin={demoLogin} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated && !user?.needsOnboarding ? (
              <Navigate to={getRoleDashboardPath(user?.userType)} replace />
            ) : (
              <Signup onSignup={signup} onDemoLogin={demoLogin} />
            )
          }
        />

        {/* Onboarding Wizard (Requires Auth, but allows incomplete onboarding) */}
        <Route element={<ProtectedRoute user={user} requireOnboardingCompleted={false} />}>
          <Route
            path="/onboarding"
            element={<Onboarding user={user} onUpdateProfile={updateProfile} />}
          />
        </Route>

        {/* Protected Dashboard Routes Wrapped in DashboardLayout */}
        <Route element={<ProtectedRoute user={user} requireOnboardingCompleted={true} />}>
          <Route
            element={
              <DashboardLayout
                user={user}
                onLogout={logout}
                onSwitchRole={switchRole}
              />
            }
          >
            {/* Generic /dashboard auto-redirects based on user type */}
            <Route
              path="/dashboard"
              element={<Navigate to={getRoleDashboardPath(user?.userType)} replace />}
            />
            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute user={user} allowedRole="student">
                  <StudentDashboard
                    data={studentData}
                    user={user}
                    financialData={financialData}
                    onAddInvestment={addInvestment}
                    onUpdateInvestment={updateInvestment}
                    onDeleteInvestment={deleteInvestment}
                    onAddGoal={addGoal}
                    onUpdateGoal={updateGoal}
                    onDeleteGoal={deleteGoal}
                    onUpdateMonthlySavings={updateMonthlySavings}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/business-dashboard"
              element={
                <ProtectedRoute user={user} allowedRole="business">
                  <BusinessDashboard
                    data={businessData}
                    user={user}
                    financialData={financialData}
                    onAddInvestment={addInvestment}
                    onUpdateInvestment={updateInvestment}
                    onDeleteInvestment={deleteInvestment}
                    onAddGoal={addGoal}
                    onUpdateGoal={updateGoal}
                    onDeleteGoal={deleteGoal}
                    onUpdateMonthlySavings={updateMonthlySavings}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tech-dashboard"
              element={
                <ProtectedRoute user={user} allowedRole="tech">
                  <TechDashboard
                    data={techData}
                    user={user}
                    financialData={financialData}
                    onAddInvestment={addInvestment}
                    onUpdateInvestment={updateInvestment}
                    onDeleteInvestment={deleteInvestment}
                    onAddGoal={addGoal}
                    onUpdateGoal={updateGoal}
                    onDeleteGoal={deleteGoal}
                    onUpdateMonthlySavings={updateMonthlySavings}
                  />
                </ProtectedRoute>
              }
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
