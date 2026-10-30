import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { getRoleDashboardPath } from '../hooks/useFinanceData';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth = Boolean(user?.isLoggedIn && !user?.needsOnboarding);
  const role = user?.userType || 'student';
  const dashPath = getRoleDashboardPath(role);

  return (
    <header className="navbar">
      <div className="nav-left">
        <Link to={isAuth ? dashPath : "/"} className="logo">
          <span>F</span> FinSight
        </Link>
      </div>

      <nav className="nav-center">
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
        <NavLink
          to="/stocks"
          className={({ isActive }) => (isActive || location.pathname === '/markets' || location.pathname === '/ratings' ? 'active' : '')}
        >
          Stocks
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
          About
        </NavLink>
      </nav>

      <div className="nav-actions">
        {!isAuth && <ThemeToggle />}
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
