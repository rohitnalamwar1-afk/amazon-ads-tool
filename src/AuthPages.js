import { useState } from 'react';
import './Auth.css';

const FEATURES = [
  {
    icon: '◫',
    title: 'Unified Campaign Dashboard',
    desc: 'Manage Sponsored Products, Brands, and Display in one place.',
  },
  {
    icon: '◎',
    title: 'AI-Powered Bid Optimization',
    desc: 'Reduce ACoS with smart bid recommendations.',
  },
  {
    icon: '▤',
    title: 'Real-Time Performance Reports',
    desc: 'Track spend, ROAS, and revenue as it happens.',
  },
];

function AuthBranding() {
  return (
    <div className="auth-branding">
      <div className="auth-branding-content">
        <div className="auth-logo">
          <span className="auth-logo-icon">▲</span>
          <span className="auth-logo-text">AdFlow</span>
        </div>
        <p className="auth-tagline">
          The smartest way to manage your Amazon Ads
        </p>
        <ul className="auth-features">
          {FEATURES.map((f) => (
            <li key={f.title} className="auth-feature">
              <span className="auth-feature-icon">{f.icon}</span>
              <div>
                <p className="auth-feature-title">{f.title}</p>
                <p className="auth-feature-desc">{f.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function LoginPage({ onSignIn, onGoToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignIn();
  };

  return (
    <div className="auth-page">
      <AuthBranding />
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <h1 className="auth-form-title">Welcome back</h1>
          <p className="auth-form-subtitle">Sign in to your AdFlow account</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <div className="form-field-row">
                <label htmlFor="login-password">Password</label>
                <button type="button" className="auth-link auth-link-small">
                  Forgot Password?
                </button>
              </div>
              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-auth-primary">
              Sign In
            </button>
          </form>

          <p className="auth-switch">
            Don&apos;t have an account?{' '}
            <button type="button" className="auth-link" onClick={onGoToSignup}>
              Sign up
            </button>
          </p>

          <div className="auth-divider">
            <span>Or continue with</span>
          </div>

          <div className="auth-social-buttons">
            <button
              type="button"
              className="btn-social btn-google"
              onClick={onSignIn}
            >
              <span className="social-icon">G</span>
              Google
            </button>
            <button
              type="button"
              className="btn-social btn-amazon"
              onClick={onSignIn}
            >
              <span className="social-icon">a</span>
              Amazon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SignupPage({ onSignUp, onGoToLogin }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!acceptedTerms) {
      setError('Please accept the Terms and Conditions to continue.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    onSignUp();
  };

  return (
    <div className="auth-page">
      <AuthBranding />
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <h1 className="auth-form-title">Create your account</h1>
          <p className="auth-form-subtitle">Start optimizing your Amazon Ads today</p>

          {error && <p className="auth-error">{error}</p>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="signup-name">Full Name</label>
              <input
                id="signup-name"
                type="text"
                placeholder="Alex Morgan"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="signup-company">Company Name</label>
              <input
                id="signup-company"
                type="text"
                placeholder="NorthPeak Retail"
                value={form.company}
                onChange={(e) => update('company', e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                placeholder="Create a password"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="signup-confirm">Confirm Password</label>
              <input
                id="signup-confirm"
                type="password"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={(e) => update('confirmPassword', e.target.value)}
                required
              />
            </div>

            <label className="terms-checkbox">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              <span>
                I agree to the{' '}
                <button type="button" className="auth-link auth-link-inline">
                  Terms and Conditions
                </button>{' '}
                and{' '}
                <button type="button" className="auth-link auth-link-inline">
                  Privacy Policy
                </button>
              </span>
            </label>

            <button type="submit" className="btn-auth-primary">
              Create Account
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <button type="button" className="auth-link" onClick={onGoToLogin}>
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
