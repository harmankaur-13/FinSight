import { Navigate, Outlet } from 'react-router-dom';
import { getRoleDashboardPath } from '../hooks/useFinanceData';

export default function ProtectedRoute({
  user,
  requireOnboardingCompleted = true,
  allowedRole,
  children
}) {
  if (!user || !user.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requireOnboardingCompleted && user.needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  // Demo accounts can view and preview all dashboards
  if (user.isDemo) {
    return children ? children : <Outlet />;
  }

  // Real authenticated accounts are strictly locked to their configured profile dashboard
  const role = user.userType || 'student';

  if (allowedRole) {
    const isAllowed = Array.isArray(allowedRole)
      ? allowedRole.includes(role)
      : role === allowedRole;

    if (!isAllowed) {
      return <Navigate to={getRoleDashboardPath(role)} replace />;
    }
  }

  return children ? children : <Outlet />;
}
