import React from 'react';
import FloatingSettings from './FloatingSettings';

export default function SettingsButton({ user, onLogout, size = 'default', className = '' }) {
  return (
    <FloatingSettings
      user={user}
      onLogout={onLogout}
      showProfilePill={false}
      size={size}
      className={className}
    />
  );
}
