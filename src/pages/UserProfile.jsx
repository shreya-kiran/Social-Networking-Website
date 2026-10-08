import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquare, ShieldBan, UserPlus, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';
import PostCard from '../components/PostCard';
import FollowersModal from '../components/FollowersModal';

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, getUser, posts, toggleFollow } = useAppContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('followers');

  const user = getUser(id);

  if (!user) {
    return <div className="glass-panel empty-state">User not found.</div>;
  }

  // Redirect to My Profile if they click their own user id
  if (user.id === currentUser.id) {
    navigate('/profile');
    return null;
  }

  const userPosts = posts.filter(p => p.authorId === user.id);
  const isFollowing = currentUser.followingUsers.includes(user.id);

  const followersCount = (user.followersUsers && user.followersUsers.length) || user.followersCount || 0;
  const followingCount = (user.followingUsers && user.followingUsers.length) || user.followingCount || 0;

  const openFollowers = () => {
    setModalTab('followers');
    setModalOpen(true);
  };

  const openFollowing = () => {
    setModalTab('following');
    setModalOpen(true);
  };

  const handleStartMessage = () => {
    navigate(`/messages?user=${user.id}`);
  };

  return (
    <div>
      <div className="glass-panel profile-header">
        <div className="profile-top">
          <img src={user.avatar} alt={user.name} className="profile-avatar" />
          <div className="profile-info">
            <h2>{user.name}</h2>
            <p className="profile-username">@{user.username}</p>
            <p className="profile-bio">{user.bio}</p>
            
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-num">{userPosts.length}</span> Posts
              </div>
              <div className="stat pointer" onClick={openFollowers} title="View followers">
                <span className="stat-num">{followersCount}</span> Followers
              </div>
              <div className="stat pointer" onClick={openFollowing} title="View following">
                <span className="stat-num">{followingCount}</span> Following
              </div>
            </div>
            
            <div className="profile-actions-row">
              <button 
                className={`glass-button ${isFollowing ? 'following' : 'primary'}`} 
                onClick={() => toggleFollow(user.id)}
              >
                {isFollowing ? <><UserCheck size={18} /> Following</> : <><UserPlus size={18} /> Follow</>}
              </button>
              <button 
                className="glass-button" 
                onClick={handleStartMessage}
                title={`Chat with ${user.name}`}
              >
                <MessageSquare size={18} /> Message
              </button>
              <button 
                className="glass-button danger-light" 
                onClick={() => toast('User blocked')}
                title="Block user"
              >
                <ShieldBan size={18} /> Block
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="posts-list">
        {userPosts.length > 0 ? (
          userPosts.map(post => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="empty-state glass-panel">No posts yet from @{user.username}.</div>
        )}
      </div>

      {/* Followers & Following Popup Modal */}
      <FollowersModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialTab={modalTab}
        profileUserId={user.id}
      />
    </div>
  );
}
