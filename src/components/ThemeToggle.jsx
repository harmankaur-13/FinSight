import React from 'react';
import SettingsButton from './SettingsButton';

// Replaced mode toggle with settings option per user specification
export default function ThemeToggle(props) {
  return <SettingsButton {...props} />;
}
