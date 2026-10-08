import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';

import Navbar from './components/Navbar';
import Home from './pages/Home';
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
    <AppProvider>
      <Router>
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
            </Routes>
          </main>
        </div>
        <Toaster 
          position="bottom-center"
          toastOptions={{
            style: {
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(12px)',
              color: '#1F3636',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              fontWeight: 500,
              boxShadow: '0 10px 30px rgba(31, 54, 54, 0.12)'
            },
          }}
        />
      </Router>
    </AppProvider>
  );
}
