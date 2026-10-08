import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, MessageSquare, Bell, Settings, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Navbar() {
  const { currentUser, unreadNotificationsCount, unreadMessagesCount } = useAppContext();

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-content">
        <div className="nav-brand">
          <NavLink to="/" className="brand-logo-link">
            <span className="brand-dot" />
            <span className="brand-text">SocialSphere</span>
          </NavLink>
        </div>

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
          <img src={currentUser.avatar} alt={currentUser.name} className="avatar nav-avatar" />
        </NavLink>
      </div>
    </nav>
  );
}
