import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Edit3 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import PostCard from '../components/PostCard';
import FollowersModal from '../components/FollowersModal';

export default function MyProfile() {
  const { currentUser, posts } = useAppContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('followers');

  const myPosts = posts.filter(p => p.authorId === currentUser.id);

  const openFollowers = () => {
    setModalTab('followers');
    setModalOpen(true);
  };

  const openFollowing = () => {
    setModalTab('following');
    setModalOpen(true);
  };

  const followersCount = (currentUser.followersUsers && currentUser.followersUsers.length) || currentUser.followersCount || 0;
  const followingCount = (currentUser.followingUsers && currentUser.followingUsers.length) || currentUser.followingCount || 0;

  return (
    <div>
      <div className="glass-panel profile-header">
        <div className="profile-top">
          <img src={currentUser.avatar} alt={currentUser.name} className="profile-avatar" />
          <div className="profile-info">
            <h2>{currentUser.name}</h2>
            <p className="profile-username">@{currentUser.username}</p>
            <p className="profile-bio">{currentUser.bio}</p>
            
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-num">{myPosts.length}</span> Posts
              </div>
              <div className="stat pointer" onClick={openFollowers} title="View followers">
                <span className="stat-num">{followersCount}</span> Followers
              </div>
              <div className="stat pointer" onClick={openFollowing} title="View following">
                <span className="stat-num">{followingCount}</span> Following
              </div>
            </div>

            <div className="profile-actions-row">
              <Link to="/edit-profile" className="glass-button" title="Edit Profile Details">
                <Edit3 size={18} /> Edit Profile
              </Link>
              <Link to="/settings" className="glass-button" title="Account Settings">
                <Settings size={18} /> Settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="posts-list">
        {myPosts.length > 0 ? (
          myPosts.map(post => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="empty-state glass-panel">No posts yet. Share something with the community!</div>
        )}
      </div>

      {/* Followers & Following Popup Modal */}
      <FollowersModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialTab={modalTab}
        profileUserId={currentUser.id}
      />
    </div>
  );
}
