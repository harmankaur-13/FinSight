import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { formatHumanName } from '../hooks/useFinanceData';

export default function DashboardNav({ user, onLogout, onSwitchRole }) {
  const navigate = useNavigate();
  const role = user?.userType || 'student';
  const displayName = formatHumanName(user?.name);

  const getDashboardRoute = () => {
    if (role === 'business') return '/business-dashboard';
    if (role === 'tech') return '/tech-dashboard';
    return '/student-dashboard';
  };

  const roleTitle = role === 'tech' ? 'Large / Tech Enterprise' : role === 'business' ? 'Business Intelligence' : 'Student Learner';

  return (
    <div className="dashboard-nav-wrapper">
      <div className="dashboard-nav">
        <div className="dash-nav-left">
          <Link to="/" className="logo">
            <span>F</span> FinSight
          </Link>
          
          <span className="role-badge">{roleTitle}</span>

          <div className="dash-nav-links">
            <NavLink 
              to={getDashboardRoute()} 
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Dashboard
            </NavLink>
            <NavLink to="/features" className={({ isActive }) => (isActive ? 'active' : '')}>
              Features
            </NavLink>
            <NavLink to="/news" className={({ isActive }) => (isActive ? 'active' : '')}>
              News
            </NavLink>
            <NavLink to="/ratings" className={({ isActive }) => (isActive ? 'active' : '')}>
              Ratings
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
              About
            </NavLink>
          </div>
        </div>

        <div className="dash-nav-right">
          {/* Demo preview switcher to test different roles easily */}
          <div className="demo-switcher" title="Preview different dashboard roles">
            <span>Demo View:</span>
            <button 
              className={role === 'student' ? 'active' : ''} 
              onClick={() => {
                onSwitchRole('student');
                navigate('/student-dashboard');
              }}
            >
              Student
            </button>
            <button 
              className={role === 'business' ? 'active' : ''} 
              onClick={() => {
                onSwitchRole('business');
                navigate('/business-dashboard');
              }}
            >
              Business
            </button>
            <button 
              className={role === 'tech' ? 'active' : ''} 
              onClick={() => {
                onSwitchRole('tech');
                navigate('/tech-dashboard');
              }}
            >
              Big Tech
            </button>
          </div>

          <div className="user-profile-pill">
            <div className="user-avatar">
              {(displayName || 'U').charAt(0).toUpperCase()}
            </div>
            <span style={{ fontWeight: 600 }}>{displayName}</span>
          </div>

          <button 
            className="btn btn-outline btn-small"
            onClick={() => {
              onLogout();
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
