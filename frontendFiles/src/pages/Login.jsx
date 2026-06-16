import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Correct path to your styles directory

function Login() {
  const handleSocialLogin = (provider) => {
    // Points directly to your Spring Boot backend's OAuth redirect endpoints
    const BACKEND_URL = "http://localhost:8080";
    window.location.href = `${BACKEND_URL}/oauth2/authorization/${provider}`;
  };

  return (
    <div className="page-container">

      {/* Top Logo */}
            <div className="auth-logo-section">
              <div style={{ width: '32px', height: '32px', color: '#818cf8' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '100%', height: '100%' }}>
                  <path d="M12 22V12m0 0c-2-1-4-1-5-3s0-4 2-4 3 2 3 4m0-4c2-1 4-1 5-3s0-4-2-4-3 2-3 4" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="auth-logo-text">nervix</span>
            </div>

      {/* Main Authentication Card */}
      <div className="auth-card">

        <div className="text-center">
          <h2 className="card-title">Welcome back</h2>
          <p className="card-subtitle">Please log in to your account</p>
        </div>

        {/* Login Credentials Form */}
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              placeholder="Enter username or email"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="form-input"
            />
          </div>

          {/* Forgot Password Navigation */}
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <Link to="/forgot-password" className="text-link" style={{ fontSize: '13px' }}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn-primary">
            Log In &rarr;
          </button>
        </form>

        {/* Structural Content Divider */}
        <div className="relative flex py-5 items-center" style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
          <div style={{ flexGrow: 1, borderTop: '1px solid #1f293d' }}></div>
          <span style={{ flexShrink: 0, margin: '0 16px', color: '#4b5563', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            or continue with
          </span>
          <div style={{ flexGrow: 1, borderTop: '1px solid #1f293d' }}></div>
        </div>

        {/* Social OAuth Handlers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => handleSocialLogin('google')}
            className="w-full flex items-center justify-center gap-3 bg-[#0d1424] border border-gray-800 hover:bg-[#151f36] text-white py-2.5 rounded-lg transition-colors"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              backgroundColor: '#0d1424',
              border: '1px solid #1f293d',
              borderRadius: '8px',
              padding: '10px',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            <svg style={{ height: '20px', width: '20px' }} viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.227C18.26 1.487 15.477 0 12.24 0 5.58 0 0 5.58 0 12.24s5.58 12.24 12.24 12.24c6.96 0 11.57-4.854 11.57-11.77 0-.79-.086-1.39-.197-1.925H12.24z"/>
            </svg>
            Sign in with Google
          </button>

          <button
            onClick={() => handleSocialLogin('github')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              backgroundColor: '#0d1424',
              border: '1px solid #1f293d',
              borderRadius: '8px',
              padding: '10px',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            <svg style={{ height: '20px', width: '20px' }} fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.48 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.008.069-.008 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            Sign in with GitHub
          </button>
        </div>

        {/* Core Navigation Sign Up Footer */}
        <div className="footer-text">
          Don't have an account?{' '}
          <Link to="/signup" className="text-link" style={{ fontWeight: '500' }}>
            Sign Up
          </Link>
        </div>

        {/* Legal Disclaimers */}
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#4b5563', marginTop: '24px' }}>
          By continuing you agree to our <a href="#terms" style={{ color: '#9ca3af', textDecoration: 'underline' }}>Terms &amp; Privacy</a>.
        </p>

      </div>
    </div>
  );
}

export default Login;