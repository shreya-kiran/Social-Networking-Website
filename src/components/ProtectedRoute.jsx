import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, guestOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading-container">
        <div className="glass-panel auth-loading-box">
          <div className="auth-spinner" />
          <p className="text-muted" style={{ marginTop: '12px', fontWeight: 500 }}>
            Loading SocialSphere...
          </p>
        </div>
      </div>
    );
  }

  // Guest-only routes: redirect authenticated users to home "/"
  if (guestOnly) {
    if (user) {
      return <Navigate to="/" replace />;
    }
    return children ? children : <Outlet />;
  }

  // Protected routes: redirect unauthenticated users to "/login"
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}
