import React, { useState } from 'react';
<<<<<<< HEAD
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
=======
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
>>>>>>> e883d64c5ae1301afbf20416eb17f417981ae5df

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
<<<<<<< HEAD
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Please enter your email or username.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      await login(identifier.trim(), password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.error || 'Invalid credentials. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
=======
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const errors = {};
    if (!identifier.trim()) {
      errors.identifier = 'Please enter your email or username';
    }
    if (!password) {
      errors.password = 'Please enter your password';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      await login(identifier.trim(), password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Invalid credentials. Please check your username/email and password.';
      setServerError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
>>>>>>> e883d64c5ae1301afbf20416eb17f417981ae5df
    }
  };

  return (
<<<<<<< HEAD
    <div className="auth-page">
      <div className="auth-card glass-panel">
        {/* Brand */}
        <div className="auth-brand">
          <span className="brand-dot" />
          <span className="brand-text">SocialSphere</span>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to continue connecting with creators</p>

        {/* Server Error Banner */}
        {error && (
          <div className="auth-error-banner" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
=======
    <div className="auth-page-wrapper">
      <div className="glass-panel form-container auth-card">
        <div className="auth-header">
          <div className="auth-icon-badge">
            <LogIn size={26} />
          </div>
          <h2>Sign In to SocialSphere</h2>
          <p className="text-muted">Enter your credentials to access your feed and messages</p>
        </div>

        {serverError && (
          <div className="form-server-error">
            <AlertCircle size={18} className="error-icon" />
            <span>{serverError}</span>
>>>>>>> e883d64c5ae1301afbf20416eb17f417981ae5df
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
<<<<<<< HEAD
          {/* Email or Username */}
          <div className="auth-field">
            <label htmlFor="login-identifier" className="auth-label">Email or Username</label>
            <input
              id="login-identifier"
              type="text"
              className="glass-input"
              placeholder="Enter email or username"
              value={identifier}
              onChange={(e) => { setIdentifier(e.target.value); setError(''); }}
              autoComplete="username"
              autoFocus
            />
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="login-password" className="auth-label">Password</label>
            <div className="auth-password-wrapper">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="glass-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
=======
          <div className="form-group">
            <label htmlFor="login-identifier">Email or Username</label>
            <div className="password-input-wrap">
              <Mail size={18} className="input-inner-icon" />
              <input
                id="login-identifier"
                type="text"
                className={`glass-input with-prefix-icon ${fieldErrors.identifier ? 'input-error' : ''}`}
                placeholder="you@domain.com or @username"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (fieldErrors.identifier) {
                    setFieldErrors((prev) => ({ ...prev, identifier: '' }));
                  }
                  if (serverError) setServerError('');
                }}
                disabled={isLoading}
                autoComplete="username"
              />
            </div>
            {fieldErrors.identifier && (
              <span className="field-error-text">{fieldErrors.identifier}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <div className="password-input-wrap">
              <Lock size={18} className="input-inner-icon" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className={`glass-input with-prefix-icon with-suffix-icon ${fieldErrors.password ? 'input-error' : ''}`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({ ...prev, password: '' }));
                  }
                  if (serverError) setServerError('');
                }}
                disabled={isLoading}
>>>>>>> e883d64c5ae1301afbf20416eb17f417981ae5df
                autoComplete="current-password"
              />
              <button
                type="button"
<<<<<<< HEAD
                className="auth-eye-btn"
                onClick={() => setShowPassword((v) => !v)}
=======
                className="password-toggle-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex="-1"
>>>>>>> e883d64c5ae1301afbf20416eb17f417981ae5df
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
<<<<<<< HEAD
          </div>

          <button
            type="submit"
            id="login-submit"
            className="glass-button primary auth-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="auth-spinner" aria-hidden="true" />
            ) : (
              <LogIn size={18} />
            )}
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer-text">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="auth-link">Create one</Link>
        </p>
=======
            {fieldErrors.password && (
              <span className="field-error-text">{fieldErrors.password}</span>
            )}
          </div>

          <div className="form-actions" style={{ marginTop: '12px' }}>
            <button
              type="submit"
              className="glass-button primary auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="btn-spinner" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="auth-card-footer">
          <span>Don't have an account?</span>
          <Link to="/signup" className="auth-link">
            Create an account
          </Link>
        </div>
>>>>>>> e883d64c5ae1301afbf20416eb17f417981ae5df
      </div>
    </div>
  );
}
