import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    }
  };

  return (
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
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
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
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex="-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
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
      </div>
    </div>
  );
}
