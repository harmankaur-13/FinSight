import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound({ user }) {
  const isAuth = Boolean(user?.isLoggedIn);
  const role = user?.userType || 'student';
  const dashPath = role === 'business' ? '/business-dashboard' : role === 'tech' ? '/tech-dashboard' : '/student-dashboard';

  return (
    <div className="container" style={{ padding: '80px 0', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <span className="eyebrow eyebrow-gold">ERROR 404</span>
      <h1 style={{ fontSize: '56px', letterSpacing: '-2px', margin: '12px 0' }}>
        Page Not Found
      </h1>
      <p style={{ color: 'var(--muted)', maxWidth: '480px', marginBottom: '30px' }}>
        The financial analysis or page you are looking for does not exist or has been relocated.
      </p>

      <div style={{ display: 'flex', gap: '12px' }}>
        <Link to="/" className="btn btn-outline">
          Return Home
        </Link>
        {isAuth && (
          <Link to={dashPath} className="btn btn-primary">
            Go to Dashboard
          </Link>
        )}
      </div>
    </div>
  );
}
