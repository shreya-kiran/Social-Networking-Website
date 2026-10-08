import React from 'react';
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
