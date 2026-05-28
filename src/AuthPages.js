import { useState } from 'react';
import './Auth.css';

function AuthBranding() {
  return (
    <div className="auth-brand-panel">
      <div className="auth-brand-content">
        <div className="auth-logo">
          <span className="auth-logo-icon">▲</span>
          <span className="auth-logo-text">AdFlow</span>
        </div>
        <p className="auth-tagline">
          The smartest way to manage your Amazon Ads
        </p>
        <div className="auth-features">
          <div className="auth-feature">
            <span className="auth-feature-icon">◫</span>
            <div>
              <p className="auth-feature-title">Unified Campaign Dashboard</p>
              <p className="auth-feature-desc">
                Manage Sponsored Products, Brands, and Display in one place.
              </p>
            </div>
          </div>
          <div className="auth-feature">
            <span className="auth-feature-icon">◎</span>
            <div>
              <p className="auth-feature-title">AI-Powered Bid Optimization</p>
              <p className="auth-feature-desc">
                Reduce ACoS with smart bid recommendations.
              </p>
            </div>
          </div>
          <div className="auth-feature">
            <span className="auth-feature-icon">▤</span>
            <div>
              <p className="auth-feature-title">Real-Time Performance Reports</p>
              <p className="auth-feature-desc">
                Track spend, ROAS, and revenue as it happens.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoginPage({ onSignIn, onGoToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState('agency');
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('adflow_token', data.token);
        localStorage.setItem('adflow_user', JSON.stringify(data.user));
        onSignIn(data.user, loginType);
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('Cannot connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <AuthBranding />
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <h1 className="auth-form-title">Welcome back</h1>
          <p className="auth-form-subtitle">Sign in to your AdFlow account</p>
          <div style={{display:'flex',gap:'8px',marginBottom:'20px',background:'rgba(255,255,255,0.05)',borderRadius:'8px',padding:'4px'}}>
  <button type="button" onClick={() => setLoginType('agency')} style={{flex:1,padding:'8px',borderRadius:'6px',border:'none',cursor:'pointer',background:loginType==='agency'?'#f59e0b':'transparent',color:loginType==='agency'?'#000':'#888',fontWeight:loginType==='agency'?'600':'400',fontSize:'13px'}}>
    Agency / Admin
  </button>
  <button type="button" onClick={() => setLoginType('brand')} style={{flex:1,padding:'8px',borderRadius:'6px',border:'none',cursor:'pointer',background:loginType==='brand'?'#f59e0b':'transparent',color:loginType==='brand'?'#000':'#888',fontWeight:loginType==='brand'?'600':'400',fontSize:'13px'}}>
    Brand
  </button>
</div>

          {error && (
            <div style={{
              background: 'rgba(248,113,113,0.15)',
              border: '1px solid #f87171',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#f87171',
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

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
            <button
              type="submit"
              className="btn-auth-primary"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
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
              onClick={() => setError('Google login coming soon!')}
            >
              <span className="social-icon">G</span>
              Google
            </button>
            <button
              type="button"
              className="btn-social btn-amazon"
              onClick={() => setError('Amazon login coming soon!')}
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
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.terms) {
      setError('Please accept the terms and conditions');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          companyName: formData.companyName,
          role: 'brand'
        })
      });

      const data = await res.json();

      if (data.success) {
        onSignUp();
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Cannot connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <AuthBranding />
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <h1 className="auth-form-title">Create your account</h1>
          <p className="auth-form-subtitle">
            Start managing your Amazon Ads smarter
          </p>

          {error && (
            <div style={{
              background: 'rgba(248,113,113,0.15)',
              border: '1px solid #f87171',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#f87171',
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="signup-name">Full Name</label>
              <input
                id="signup-name"
                name="fullName"
                type="text"
                placeholder="Your name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                name="email"
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="signup-company">Company Name</label>
              <input
                id="signup-company"
                name="companyName"
                type="text"
                placeholder="Your company"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="signup-confirm">Confirm Password</label>
              <input
                id="signup-confirm"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-checkbox">
              <input
                id="signup-terms"
                name="terms"
                type="checkbox"
                checked={formData.terms}
                onChange={handleChange}
              />
              <label htmlFor="signup-terms">
                I agree to the Terms and Conditions
              </label>
            </div>
            <button
              type="submit"
              className="btn-auth-primary"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
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