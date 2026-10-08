import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, MessageSquare, Bell, Settings, LogIn, UserPlus, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { DEMO_MODE } from '../config/demoMode';

export default function Navbar() {
  const { currentUser, unreadNotificationsCount, unreadMessagesCount } = useAppContext();
  const { user } = useAuth();

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-content">
        <div className="nav-brand">
          <NavLink to="/" className="brand-logo-link">
            <span className="brand-dot" />
            <span className="brand-text">SocialSphere</span>
          </NavLink>
        </div>

        {user ? (
          <>
            <div className="nav-links">
              <NavLink to="/" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} title="Feed">
                <Home size={20} />
                <span className="nav-label">Feed</span>
              </NavLink>

              <NavLink to="/search" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} title="Find People">
                <Search size={20} />
                <span className="nav-label">Search</span>
              </NavLink>

              <NavLink to="/messages" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} title="Messages">
                <div className="nav-icon-badge-wrapper">
                  <MessageSquare size={20} />
                  {unreadMessagesCount > 0 && (
                    <span className="nav-unread-badge">{unreadMessagesCount}</span>
                  )}
                </div>
                <span className="nav-label">Messages</span>
              </NavLink>

              <NavLink to="/notifications" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} title="Notifications">
                <div className="nav-icon-badge-wrapper">
                  <Bell size={20} />
                  {unreadNotificationsCount > 0 && (
                    <span className="nav-unread-badge">{unreadNotificationsCount}</span>
                  )}
                </div>
                <span className="nav-label">Alerts</span>
              </NavLink>

              <NavLink to="/settings" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} title="Settings">
                <Settings size={20} />
                <span className="nav-label">Settings</span>
              </NavLink>
            </div>
            
            <NavLink to="/profile" className="nav-user-link" title="My Profile">
              <img 
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop'} 
                alt={currentUser?.name || 'User Profile'} 
                className="avatar nav-avatar" 
              />
            </NavLink>
          </>
        ) : (
          <div className="nav-links">
            <NavLink to="/login" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <LogIn size={18} />
              <span className="nav-label">Sign In</span>
            </NavLink>
            <NavLink to="/signup" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <UserPlus size={18} />
              <span className="nav-label">Sign Up</span>
            </NavLink>
          </div>
        )}
      </div>

      {/* Demo mode badge */}
      {DEMO_MODE && (
        <div className="demo-mode-badge">
          <Sparkles size={14} />
          <span>DEMO MODE</span>
        </div>
      )}
    </nav>
  );
}
