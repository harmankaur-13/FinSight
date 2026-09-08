import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ user, requireOnboardingCompleted = true }) {
  if (!user || !user.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requireOnboardingCompleted && user.needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
