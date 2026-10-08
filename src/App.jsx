import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Search from './pages/Search';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import MyProfile from './pages/MyProfile';
import EditProfile from './pages/EditProfile';
import UserProfile from './pages/UserProfile';

import './index.css';

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            {/* Guest-only routes: redirect logged-in users to "/" */}
            <Route
              path="/login"
              element={
                <ProtectedRoute guestOnly>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <ProtectedRoute guestOnly>
                  <Signup />
                </ProtectedRoute>
              }
            />

            {/* Protected routes: require authentication */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className="app-layout">
                    <Navbar />
                    <main className="app-container">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/messages" element={<Messages />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/profile" element={<MyProfile />} />
                        <Route path="/edit-profile" element={<EditProfile />} />
                        <Route path="/user/:id" element={<UserProfile />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>

          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(12px)',
                color: '#1F3636',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                fontWeight: 500,
                boxShadow: '0 10px 30px rgba(31, 54, 54, 0.12)',
              },
            }}
          />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}
