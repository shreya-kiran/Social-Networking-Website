import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, UserPlus, CheckCheck, Bell, BellOff } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAppContext } from '../context/AppContext';

export default function Notifications() {
  const navigate = useNavigate();
  const { 
    notifications, 
    getUser, 
    markNotificationAsRead, 
    markAllNotificationsAsRead 
  } = useAppContext();

  // Sort newest first
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handleNotificationClick = (notif) => {
    markNotificationAsRead(notif.id);

    if (notif.type === 'follow') {
      navigate(`/user/${notif.actorId}`);
    } else if (notif.targetPostId) {
      // Navigate to Home or user profile where the post is visible
      navigate(`/?post=${notif.targetPostId}`);
    } else {
      navigate(`/user/${notif.actorId}`);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <div className="notif-badge-icon like"><Heart size={14} fill="#FF8C52" color="#FF8C52" /></div>;
      case 'comment':
        return <div className="notif-badge-icon comment"><MessageCircle size={14} fill="#359FA0" color="#359FA0" /></div>;
      case 'follow':
        return <div className="notif-badge-icon follow"><UserPlus size={14} color="#8AD6D1" /></div>;
      default:
        return <div className="notif-badge-icon default"><Bell size={14} /></div>;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-page-container">
      <div className="notifications-header-box">
        <div className="feed-header" style={{ marginBottom: '0', textAlign: 'left' }}>
          <h1>Notifications</h1>
          <p className="text-muted" style={{ marginTop: '4px' }}>
            Stay updated with likes, comments, and new followers
          </p>
        </div>

        {unreadCount > 0 && (
          <button 
            className="glass-button mark-all-read-btn"
            onClick={markAllNotificationsAsRead}
          >
            <CheckCheck size={18} /> Mark all as read
          </button>
        )}
      </div>

      <div className="notifications-list">
        {sortedNotifications.length > 0 ? (
          sortedNotifications.map(notif => {
            const actor = getUser(notif.actorId) || {
              name: 'Community Member',
              avatar: 'https://i.pravatar.cc/150?u=anon',
              username: 'member'
            };

            return (
              <div 
                key={notif.id}
                className={`glass-panel notification-card ${!notif.read ? 'unread-card' : ''}`}
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="notif-avatar-wrapper">
                  <img src={actor.avatar} alt={actor.name} className="avatar notif-avatar" />
                  {getNotificationIcon(notif.type)}
                </div>

                <div className="notif-content">
                  <p className="notif-text">
                    <span className="notif-actor-name">{actor.name}</span>{' '}
                    <span className="notif-action-text">{notif.text}</span>
                  </p>
                  <span className="notif-time">
                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                  </span>
                </div>

                {!notif.read && (
                  <div className="notif-unread-indicator" title="Unread" />
                )}
              </div>
            );
          })
        ) : (
          <div className="empty-state glass-panel notifications-empty">
            <BellOff size={48} className="empty-icon" />
            <h3>No notifications yet</h3>
            <p className="text-muted">When people interact with your profile or posts, you'll see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
