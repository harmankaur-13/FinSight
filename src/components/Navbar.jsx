import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const isAuth = Boolean(user?.isLoggedIn && !user?.needsOnboarding);
  const role = user?.userType || 'student';
  const dashPath = role === 'business' ? '/business-dashboard' : role === 'tech' ? '/tech-dashboard' : '/student-dashboard';

  return (
    <header className="navbar">
      <Link to={isAuth ? dashPath : "/"} className="logo">
        <span>F</span> FinSight
      </Link>

      <nav>
        {!isAuth && (
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
        )}
        {isAuth && (
          <NavLink to={dashPath} className={({ isActive }) => (isActive ? 'active' : '')}>
            Dashboard
          </NavLink>
        )}
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
      </nav>

      <div className="nav-actions">
        {isAuth ? (
          <>
            <button 
              className="btn btn-ghost"
              onClick={() => navigate(dashPath)}
            >
              Dashboard
            </button>
            <button 
              className="btn btn-outline" 
              onClick={() => {
                if (onLogout) onLogout();
                navigate('/login');
              }}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <button 
              className="btn btn-ghost" 
              id="navLoginBtn"
              onClick={() => navigate('/login')}
            >
              Log in
            </button>
            <button 
              className="btn btn-primary" 
              id="navSignupBtn"
              onClick={() => navigate('/signup')}
            >
              Get Started
            </button>
          </>
        )}
      </div>
    </header>
  );
}
