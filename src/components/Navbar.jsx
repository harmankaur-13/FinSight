import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        <span>F</span> FinSight
      </Link>

      <nav>
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Home
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
      </nav>

      <div className="nav-actions">
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
      </div>
    </header>
  );
}
