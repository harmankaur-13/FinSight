import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PublicLayout({ user, onLogout }) {
  return (
    <div className="app-container">
      <Navbar user={user} onLogout={onLogout} />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer user={user} />
    </div>
  );
}

