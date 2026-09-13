import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardNav from '../components/DashboardNav';
import Footer from '../components/Footer';

export default function DashboardLayout({ user, onLogout, onSwitchRole }) {
  return (
    <div className="app-container">
      <DashboardNav 
        user={user} 
        onLogout={onLogout} 
        onSwitchRole={onSwitchRole} 
      />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer user={user} />
    </div>
  );
}
