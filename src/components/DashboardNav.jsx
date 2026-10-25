import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getRoleDashboardPath } from '../hooks/useFinanceData';
import FloatingSettings from './FloatingSettings';

export default function DashboardNav({ user, onLogout, onSwitchRole }) {
  const navigate = useNavigate();
  const role = user?.userType || 'student';

  const getDashboardRoute = () => getRoleDashboardPath(role);

  const roleTitle = role === 'tech' ? 'Large / Tech Enterprise' : role === 'business' ? 'Business Intelligence' : 'Student Learner';

  return (
    <div className="dashboard-nav-wrapper">
      <div className="dashboard-nav">
        <div className="dash-nav-left">
          <Link to={getDashboardRoute()} className="logo">
            <span>F</span> FinSight
          </Link>
          
          <span className="role-badge">{roleTitle}</span>
        </div>

        <nav className="dash-nav-links">
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
        </nav>

        <div className="dash-nav-right">
          {user?.isDemo && (
            <div className="demo-switcher" title="Preview different dashboard roles in Demo mode">
              <span>Demo View:</span>
              <button 
                type="button"
                className={role === 'student' ? 'active' : ''} 
                onClick={() => {
                  if (onSwitchRole) onSwitchRole('student');
                  navigate('/student-dashboard');
                }}
              >
                Student
              </button>
              <button 
                type="button"
                className={role === 'business' ? 'active' : ''} 
                onClick={() => {
                  if (onSwitchRole) onSwitchRole('business');
                  navigate('/business-dashboard');
                }}
              >
                Business
              </button>
              <button 
                type="button"
                className={role === 'tech' ? 'active' : ''} 
                onClick={() => {
                  if (onSwitchRole) onSwitchRole('tech');
                  navigate('/tech-dashboard');
                }}
              >
                Big Tech
              </button>
            </div>
          )}

          <FloatingSettings user={user} onLogout={onLogout} />

          <button 
            className="btn btn-outline btn-small"
            onClick={() => {
              if (onLogout) onLogout();
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
