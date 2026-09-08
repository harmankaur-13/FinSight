import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <Link to="/" className="logo">
        <span>F</span> FinSight
      </Link>
      <p>See your money clearly. Make better decisions.</p>
      <small>© 2026 FinSight. Built for smarter financial decisions.</small>
    </footer>
  );
}
