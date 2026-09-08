import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../../components/Toast';

export default function Onboarding({ user, onUpdateProfile }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('student');
  const [investments, setInvestments] = useState(['Stocks', 'Mutual Funds']);
  const [goals, setGoals] = useState(['Portfolio growth', 'Learning about investing']);
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2400);
  };

  const toggleInvestment = (item) => {
    setInvestments((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleGoal = (item) => {
    setGoals((prev) =>
      prev.includes(item) ? prev.filter((g) => g !== item) : [...prev, item]
    );
  };

  const handleFinish = () => {
    onUpdateProfile({
      userType,
      investments,
      goals
    });

    triggerToast('Configuring your personalized dashboard...');

    setTimeout(() => {
      if (userType === 'business') {
        navigate('/business-dashboard');
      } else if (userType === 'tech') {
        navigate('/tech-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    }, 700);
  };

  const progressPercent = (step / 3) * 100;

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <div className="progress-bar-wrap">
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="step-badge">Step {step} of 3</div>

        {step === 1 && (
          <div>
            <h1 className="onboarding-title">How will you use FinSight?</h1>
            <p className="onboarding-desc">
              Select the perspective that best matches your financial goals.
            </p>

            <div className="options-grid">
              <div
                className={`option-card ${userType === 'student' ? 'selected' : ''}`}
                onClick={() => setUserType('student')}
              >
                <div className="option-title">Student</div>
                <div className="option-desc">
                  Learn about money, build good investment habits, and understand basic allocations.
                </div>
              </div>

              <div
                className={`option-card ${userType === 'business' ? 'selected' : ''}`}
                onClick={() => setUserType('business')}
              >
                <div className="option-title">Business</div>
                <div className="option-desc">
                  Monitor corporate treasury holdings, market exposure, cashflow trends, and future valuations.
                </div>
              </div>

              <div
                className={`option-card ${userType === 'tech' ? 'selected' : ''}`}
                onClick={() => setUserType('tech')}
              >
                <div className="option-title">Large / Tech Company</div>
                <div className="option-desc">
                  Analyze sector exposure, enterprise cost/loss risks, cloud CapEx, and multi-year simulations.
                </div>
              </div>
            </div>

            <div className="onboarding-actions">
              <div></div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep(2)}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="onboarding-title">What have you invested in?</h1>
            <p className="onboarding-desc">
              Select all asset categories you currently hold or plan to track.
            </p>

            <div className="options-grid">
              {[
                { name: 'Stocks', desc: 'Direct equity holdings and blue-chips' },
                { name: 'Bonds', desc: 'Government & corporate fixed income' },
                { name: 'Crypto', desc: 'Digital assets and protocol tokens' },
                { name: 'Mutual Funds', desc: 'Active & index diversified funds' },
                { name: 'ETFs', desc: 'Exchange-traded thematic baskets' },
                { name: 'Other', desc: 'Real estate, REITs, or cash reserves' }
              ].map((inv) => (
                <div
                  key={inv.name}
                  className={`option-card ${
                    investments.includes(inv.name) ? 'selected' : ''
                  }`}
                  onClick={() => toggleInvestment(inv.name)}
                >
                  <div className="option-title">{inv.name}</div>
                  <div className="option-desc">{inv.desc}</div>
                </div>
              ))}
            </div>

            <div className="onboarding-actions">
              <button
                type="button"
                className="btn btn-outline btn-small"
                onClick={() => setStep(1)}
              >
                ← Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep(3)}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="onboarding-title">What do you want to focus on?</h1>
            <p className="onboarding-desc">
              FinSight will customize your primary intelligence widgets based on your focus.
            </p>

            <div className="options-grid">
              {[
                { name: 'Portfolio growth', desc: 'Maximizing long-term compound asset accumulation' },
                { name: 'Risk', desc: 'Limiting downside volatility and monitoring sector concentration' },
                { name: 'Market trends', desc: 'Tracking macroeconomic shifts and industry news' },
                { name: 'Future projections', desc: 'Simulating 1 to 5 year compound wealth trajectory' },
                { name: 'Learning about investing', desc: 'Foundational financial modules and video lessons' }
              ].map((goal) => (
                <div
                  key={goal.name}
                  className={`option-card ${
                    goals.includes(goal.name) ? 'selected' : ''
                  }`}
                  onClick={() => toggleGoal(goal.name)}
                >
                  <div className="option-title">{goal.name}</div>
                  <div className="option-desc">{goal.desc}</div>
                </div>
              ))}
            </div>

            <div className="onboarding-actions">
              <button
                type="button"
                className="btn btn-outline btn-small"
                onClick={() => setStep(2)}
              >
                ← Back
              </button>
              <button
                type="button"
                className="btn btn-primary btn-large"
                onClick={handleFinish}
              >
                Build My Dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      <Toast message={toastMsg} show={showToast} />
    </div>
  );
}
