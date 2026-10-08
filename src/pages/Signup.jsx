import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const VALIDATIONS = {
  name: (v) => !v.trim() ? 'Full name is required.' : v.trim().length < 2 ? 'Name must be at least 2 characters.' : '',
  username: (v) => !v.trim() ? 'Username is required.' : !/^[a-z0-9_]{3,20}$/.test(v.trim()) ? 'Username: 3–20 chars, lowercase, letters, numbers, underscore only.' : '',
  email: (v) => !v.trim() ? 'Email address is required.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? 'Enter a valid email address.' : '',
  password: (v) => !v ? 'Password is required.' : v.length < 6 ? 'Password must be at least 6 characters.' : '',
  confirmPassword: (v, pw) => !v ? 'Please confirm your password.' : v !== pw ? 'Passwords do not match.' : '',
};

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fields, setFields] = useState({ name: '', username: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const setField = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    // Clear field error on change
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
    setServerError('');
  };

  const validate = () => {
    const newErrors = {
      name: VALIDATIONS.name(fields.name),
      username: VALIDATIONS.username(fields.username),
      email: VALIDATIONS.email(fields.email),
      password: VALIDATIONS.password(fields.password),
      confirmPassword: VALIDATIONS.confirmPassword(fields.confirmPassword, fields.password),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await register({
        name: fields.name.trim(),
        username: fields.username.trim().toLowerCase(),
        email: fields.email.trim().toLowerCase(),
        password: fields.password,
      });
      toast.success('Account created! Welcome to SocialSphere 🎉');
      navigate('/', { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.error || 'Registration failed. Please check your information and try again.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-panel">
        {/* Brand */}
        <div className="auth-brand">
          <span className="brand-dot" />
          <span className="brand-text">SocialSphere</span>
        </div>

        <h1 className="auth-title">Join SocialSphere</h1>
        <p className="auth-subtitle">Create an account to connect, share, and discover creators</p>

        {/* Server Error Banner */}
        {serverError && (
          <div className="auth-error-banner" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Full Name */}
          <div className="auth-field">
            <label htmlFor="signup-name" className="auth-label">Full Name <span className="auth-required">*</span></label>
            <input
              id="signup-name"
              type="text"
              className={`glass-input${errors.name ? ' auth-input-error' : ''}`}
              placeholder="Your full name"
              value={fields.name}
              onChange={(e) => setField('name', e.target.value)}
              autoComplete="name"
              autoFocus
            />
            {errors.name && <span className="auth-field-error">{errors.name}</span>}
          </div>

          {/* Username */}
          <div className="auth-field">
            <label htmlFor="signup-username" className="auth-label">Username <span className="auth-required">*</span></label>
            <div className="auth-prefix-wrapper">
              <span className="auth-prefix">@</span>
              <input
                id="signup-username"
                type="text"
                className={`glass-input with-prefix${errors.username ? ' auth-input-error' : ''}`}
                placeholder="yourhandle"
                value={fields.username}
                onChange={(e) => setField('username', e.target.value)}
                autoComplete="username"
              />
            </div>
            {errors.username && <span className="auth-field-error">{errors.username}</span>}
          </div>

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="signup-email" className="auth-label">Email Address <span className="auth-required">*</span></label>
            <input
              id="signup-email"
              type="email"
              className={`glass-input${errors.email ? ' auth-input-error' : ''}`}
              placeholder="you@example.com"
              value={fields.email}
              onChange={(e) => setField('email', e.target.value)}
              autoComplete="email"
            />
            {errors.email && <span className="auth-field-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="signup-password" className="auth-label">Password <span className="auth-required">*</span></label>
            <div className="auth-password-wrapper">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                className={`glass-input${errors.password ? ' auth-input-error' : ''}`}
                placeholder="Min. 6 characters"
                value={fields.password}
                onChange={(e) => setField('password', e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="auth-field-error">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="auth-field">
            <label htmlFor="signup-confirm" className="auth-label">Confirm Password <span className="auth-required">*</span></label>
            <div className="auth-password-wrapper">
              <input
                id="signup-confirm"
                type={showConfirm ? 'text' : 'password'}
                className={`glass-input${errors.confirmPassword ? ' auth-input-error' : ''}`}
                placeholder="Repeat your password"
                value={fields.confirmPassword}
                onChange={(e) => setField('confirmPassword', e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <span className="auth-field-error">{errors.confirmPassword}</span>}
          </div>

          <button
            type="submit"
            id="signup-submit"
            className="glass-button primary auth-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="auth-spinner" aria-hidden="true" />
            ) : (
              <UserPlus size={18} />
            )}
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
