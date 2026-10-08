import React from 'react';
<<<<<<< HEAD
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps routes that require authentication.
 * - Unauthenticated users are redirected to /login.
 * - Authenticated users trying to access /login or /signup are redirected to /.
 * - While the session is loading, renders nothing (avoids flash redirect).
 */
const ProtectedRoute = ({ children, guestOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // Await session restore before deciding

  if (guestOnly) {
    // For /login and /signup: redirect logged-in users to home
    if (user) return <Navigate to="/" replace />;
    return children;
  }

  // For all protected routes: redirect guests to /login
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

export default ProtectedRoute;
=======
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
>>>>>>> e883d64c5ae1301afbf20416eb17f417981ae5df
