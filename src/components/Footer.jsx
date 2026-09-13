import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer({ user }) {
  const isAuth = Boolean(user?.isLoggedIn && !user?.needsOnboarding);
  const role = user?.userType || 'student';
  const dashPath = role === 'business' ? '/business-dashboard' : role === 'tech' ? '/tech-dashboard' : '/student-dashboard';

  return (
    <footer>
      <Link to={isAuth ? dashPath : "/"} className="logo">
        <span>F</span> FinSight
      </Link>
      <p>See your money clearly. Make better decisions.</p>
      <small>© 2026 FinSight. Built for smarter financial decisions.</small>
    </footer>
  );
}
