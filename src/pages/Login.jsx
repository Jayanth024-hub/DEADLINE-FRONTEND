import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(location.state?.message || (location.state?.registered ? 'Registration successful! Please sign in with your credentials.' : ''));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      const role = (res.user?.role || '').toUpperCase();
      if (role === 'FACULTY') navigate('/faculty/dashboard');
      else if (role === 'COORDINATOR') navigate('/coordinator/dashboard');
      else if (role === 'ADMINISTRATOR' || role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Pre-fill demo credentials in the input fields so the user can easily test the real backend authentication
  const handlePrefill = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-icon-sq" style={{ margin: '0 auto 12px' }}>
            IQ
          </div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your DeadlineIQ account</p>
        </div>

        {regSuccess && (
          <div style={{ 
            background: '#ecfdf5', 
            border: '1px solid #6ee7b7', 
            borderRadius: '8px', 
            padding: '10px 14px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#065f46', 
            fontSize: '13px', 
            marginBottom: '18px' 
          }}>
            <CheckCircle2 size={16} />
            <span>{regSuccess}</span>
          </div>
        )}

        {error && (
          <div style={{ 
            background: '#fee2e2', 
            border: '1px solid #fca5a5', 
            borderRadius: '8px', 
            padding: '10px 14px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#991b1b', 
            fontSize: '13px', 
            marginBottom: '18px' 
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="saas-form-group">
            <label className="saas-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="saas-input"
                placeholder="user@deadlineiq.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="saas-form-group">
            <label className="saas-label">Password</label>
            <input
              type="password"
              className="saas-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', fontSize: '13px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <span style={{ color: 'var(--primary-blue)', cursor: 'pointer', fontWeight: 600 }}>
              Forgot password?
            </span>
          </div>

          <div style={{ marginTop: '10px' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>
              Already have an account?
            </p>
            <button 
              type="submit" 
              className="saas-btn saas-btn-primary" 
              style={{ width: '100%', padding: '11px', fontSize: '14px', fontWeight: 600 }}
              disabled={loading}
            >
              {loading ? 'Authenticating with Spring Boot...' : 'Sign In'} <ArrowRight size={15} />
            </button>
          </div>
        </form>

        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
          <p style={{ margin: '0 0 10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            New to DeadlineIQ?
          </p>
          <Link 
            to="/register" 
            className="saas-btn saas-btn-secondary" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '100%', 
              padding: '10px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              boxSizing: 'border-box'
            }}
          >
            Create an account
          </Link>
        </div>

        {/* Demo Account Prefill Chips */}
        <div className="demo-account-pills">
          <div className="demo-pills-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <KeyRound size={12} /> Seeded Demo Credentials (click to fill)
          </div>
          <div className="demo-pills-row">
            <button 
              type="button" 
              className="saas-btn saas-btn-secondary saas-btn-sm" 
              onClick={() => handlePrefill('student@deadlineiq.com', 'STUDENT')}
              title="student@deadlineiq.com / password123"
            >
              🎓 Student
            </button>
            <button 
              type="button" 
              className="saas-btn saas-btn-secondary saas-btn-sm" 
              onClick={() => handlePrefill('faculty@deadlineiq.com', 'FACULTY')}
              title="faculty@deadlineiq.com / password123"
            >
              👨‍🏫 Faculty
            </button>
            <button 
              type="button" 
              className="saas-btn saas-btn-secondary saas-btn-sm" 
              onClick={() => handlePrefill('coordinator@deadlineiq.com', 'COORDINATOR')}
              title="coordinator@deadlineiq.com / password123"
            >
              💼 Coordinator
            </button>
            <button 
              type="button" 
              className="saas-btn saas-btn-secondary saas-btn-sm" 
              onClick={() => handlePrefill('admin@deadlineiq.com', 'ADMINISTRATOR')}
              title="admin@deadlineiq.com / password123"
            >
              🛡️ Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
