import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../../components/Toast';

export default function Login({ onLogin, onDemoLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    const res = onLogin(trimmedEmail, password);
    triggerToast('Login successful!');

    setTimeout(() => {
      if (res.user.needsOnboarding) {
        navigate('/onboarding');
      } else {
        const role = res.user.userType || 'student';
        if (role === 'business') navigate('/business-dashboard');
        else if (role === 'tech') navigate('/tech-dashboard');
        else navigate('/student-dashboard');
      }
    }, 500);
  };

  const handleDemo = () => {
    triggerToast('Opening FinSight demo...');
    const demoUser = onDemoLogin('student');
    setTimeout(() => {
      navigate('/student-dashboard');
    }, 500);
  };

  const handleForgot = (e) => {
    e.preventDefault();
    triggerToast('Password reset will be available soon.');
  };

  return (
    <main className="auth-page">
      <section className="intro">
        <Link to="/" className="brand">
          <div className="brand-icon">F</div>
          <span>FinSight</span>
        </Link>

        <div className="intro-content">
          <p className="eyebrow">PERSONAL WEALTH INTELLIGENCE</p>
          <h1>
            Your money.<br />
            <span>Your decisions.</span>
          </h1>
          <p className="intro-text">
            Track your portfolio, understand market movements and make smarter financial
            decisions — all in one place.
          </p>

          <div className="steps">
            <div>
              <strong>01</strong>
              <span>Track</span>
            </div>
            <div>
              <strong>02</strong>
              <span>Understand</span>
            </div>
            <div>
              <strong>03</strong>
              <span>Rebalance</span>
            </div>
          </div>
        </div>

        <p className="copyright">
          © 2026 FinSight. Built for smarter financial decisions.
        </p>
      </section>

      <section className="auth-area">
        <div className="auth-card">
          <Link to="/" className="mobile-brand">
            <div className="brand-icon">F</div>
            <span>FinSight</span>
          </Link>

          <div className="header">
            <p className="label" id="modeLabel">WELCOME BACK</p>
            <h2 id="title">Welcome back</h2>
            <p id="subtitle">Log in to continue to your financial dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} id="authForm">
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <div className="label-row">
                <label htmlFor="password">Password</label>
                <a href="#forgot" onClick={handleForgot} id="forgot">
                  Forgot password?
                </a>
              </div>
              <div className="password-box">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  id="togglePassword"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && <p className="error" id="error">{error}</p>}

            <button className="submit-btn" type="submit" id="submitBtn">
              Log in
            </button>
          </form>

          <div className="switch">
            <span id="switchText">Don't have an account?</span>
            <Link to="/signup" id="switchBtn">Create account</Link>
          </div>

          <div className="divider">
            <span>or</span>
          </div>

          <button
            className="demo-btn"
            type="button"
            id="demoBtn"
            onClick={handleDemo}
          >
            Continue with demo
          </button>
          <p className="note">No real financial data required for the demo.</p>
        </div>
      </section>

      <Toast message={toastMsg} show={showToast} />
    </main>
  );
}
