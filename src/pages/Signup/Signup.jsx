import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../../components/Toast';

export default function Signup({ onSignup, onDemoLogin }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
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

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError('Please enter your full name.');
      return;
    }
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!termsAgreed) {
      setError('Please accept the Terms of Service.');
      return;
    }

    onSignup(trimmedName, trimmedEmail, password);
    triggerToast('Account created successfully!');

    setTimeout(() => {
      navigate('/onboarding');
    }, 600);
  };

  const handleDemo = () => {
    triggerToast('Opening FinSight demo...');
    onDemoLogin('student');
    setTimeout(() => {
      navigate('/student-dashboard');
    }, 500);
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
            <p className="label">GET STARTED</p>
            <h2>Create your account</h2>
            <p>Start managing your financial journey with FinSight.</p>
          </div>

          <form onSubmit={handleSubmit} id="authForm">
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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

            <div className="field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="terms">
              <label>
                <input
                  type="checkbox"
                  id="termsCheck"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                />
                <span>
                  I agree to the <a href="#terms">Terms of Service</a> and{' '}
                  <a href="#privacy">Privacy Policy</a>.
                </span>
              </label>
            </div>

            {error && <p className="error" id="error">{error}</p>}

            <button className="submit-btn" type="submit" id="submitBtn">
              Create account
            </button>
          </form>

          <div className="switch">
            <span id="switchText">Already have an account?</span>
            <Link to="/login" id="switchBtn">Log in</Link>
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
