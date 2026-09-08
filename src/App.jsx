import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useFinanceData } from './hooks/useFinanceData';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Components
import ProtectedRoute from './components/ProtectedRoute';

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

  // Helper to determine active dashboard route based on user profile
  const getRoleDashboardPath = () => {
    if (!user) return '/login';
    if (user.needsOnboarding) return '/onboarding';
    if (user.userType === 'business') return '/business-dashboard';
    if (user.userType === 'tech') return '/tech-dashboard';
    return '/student-dashboard';
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes Wrapped in PublicLayout */}
        <Route element={<PublicLayout />}>
          <Route 
            path="/" 
            element={<Landing onDemoLogin={demoLogin} />} 
          />
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
              <Navigate to={getRoleDashboardPath()} replace />
            ) : (
              <Login onLogin={login} onDemoLogin={demoLogin} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated && !user?.needsOnboarding ? (
              <Navigate to={getRoleDashboardPath()} replace />
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
              element={<Navigate to={getRoleDashboardPath()} replace />}
            />
            <Route
              path="/student-dashboard"
              element={<StudentDashboard data={studentData} user={user} />}
            />
            <Route
              path="/business-dashboard"
              element={<BusinessDashboard data={businessData} user={user} />}
            />
            <Route
              path="/tech-dashboard"
              element={<TechDashboard data={techData} user={user} />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
