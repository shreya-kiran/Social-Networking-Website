import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, UserCheck, UserPlus, Users } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function FollowersModal({ isOpen, onClose, initialTab = 'followers', profileUserId }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigate = useNavigate();
  const { currentUser, getUser, toggleFollow } = useAppContext();

  if (!isOpen) return null;

  const targetUser = profileUserId ? getUser(profileUserId) : currentUser;
  if (!targetUser) return null;

  // Retrieve user lists
  const followersIds = targetUser.followersUsers || [];
  const followingIds = targetUser.followingUsers || [];

  const followersList = followersIds.map(id => getUser(id)).filter(Boolean);
  const followingList = followingIds.map(id => getUser(id)).filter(Boolean);

  const displayList = activeTab === 'followers' ? followersList : followingList;

  const handleUserClick = (userId) => {
    onClose();
    if (userId === currentUser.id) {
      navigate('/profile');
    } else {
      navigate(`/user/${userId}`);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Users size={22} className="modal-icon" />
            <h3>Connections</h3>
          </div>
          <button className="icon-btn close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="modal-tabs">
          <button 
            className={`modal-tab ${activeTab === 'followers' ? 'active' : ''}`}
            onClick={() => setActiveTab('followers')}
          >
            Followers <span className="tab-badge">{followersList.length}</span>
          </button>
          <button 
            className={`modal-tab ${activeTab === 'following' ? 'active' : ''}`}
            onClick={() => setActiveTab('following')}
          >
            Following <span className="tab-badge">{followingList.length}</span>
          </button>
        </div>

        {/* User List */}
        <div className="modal-user-list">
          {displayList.length > 0 ? (
            displayList.map(user => {
              const isMe = user.id === currentUser.id;
              const isFollowing = currentUser.followingUsers.includes(user.id);

              return (
                <div key={user.id} className="user-row-card">
                  <div 
                    className="user-row-info"
                    onClick={() => handleUserClick(user.id)}
                  >
                    <img src={user.avatar} alt={user.name} className="avatar row-avatar" />
                    <div className="user-names">
                      <span className="user-name">{user.name}</span>
                      <span className="user-handle">@{user.username}</span>
                    </div>
                  </div>

                  {!isMe && (
                    <button 
                      className={`glass-button btn-sm ${isFollowing ? 'following' : 'primary'}`}
                      onClick={() => toggleFollow(user.id)}
                    >
                      {isFollowing ? (
                        <><UserCheck size={14} /> Following</>
                      ) : (
                        <><UserPlus size={14} /> Follow</>
                      )}
                    </button>
                  )}
                  {isMe && (
                    <span className="badge-you">You</span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="empty-state modal-empty">
              <Users size={36} className="empty-icon" />
              <p>
                {activeTab === 'followers' 
                  ? 'No followers yet' 
                  : 'Not following anyone yet'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
