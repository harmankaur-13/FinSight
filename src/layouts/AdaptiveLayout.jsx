import React from 'react';
import PublicLayout from './PublicLayout';
import DashboardLayout from './DashboardLayout';

export default function AdaptiveLayout({ user, onLogout, onSwitchRole }) {
  const isAuth = Boolean(user?.isLoggedIn && !user?.needsOnboarding);

  if (isAuth) {
    return (
      <DashboardLayout
        user={user}
        onLogout={onLogout}
        onSwitchRole={onSwitchRole}
      />
    );
  }

  return <PublicLayout user={user} onLogout={onLogout} />;
}
