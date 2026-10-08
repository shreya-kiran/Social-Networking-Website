import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, UserPlus, UserCheck, UserX, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const navigate = useNavigate();
  const { currentUser, users, toggleFollow } = useAppContext();

  // Debounce logic (~300ms delay)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim());
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Filter users by name or username (exclude current user from search results or label clearly)
  const query = debouncedTerm.toLowerCase().replace(/^@/, '');
  
  const filteredUsers = query
    ? users.filter(u => 
        u.name.toLowerCase().includes(query) || 
        u.username.toLowerCase().includes(query)
      )
    : users; // When empty, display suggested community members!

  const handleUserClick = (userId) => {
    if (userId === currentUser.id) {
      navigate('/profile');
    } else {
      navigate(`/user/${userId}`);
    }
  };

  return (
    <div className="search-page-container">
      <div className="feed-header">
        <h1>Find People</h1>
        <p className="text-muted" style={{ marginTop: '6px' }}>
          Discover creators, designers, and developers across the platform
        </p>
      </div>

      {/* Search Input Box */}
      <div className="glass-panel search-bar-box">
        <div className="search-input-wrapper">
          <SearchIcon size={20} className="search-icon" />
          <input 
            type="text"
            className="glass-input search-input"
            placeholder="Search by name or @username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          {searchTerm && (
            <button 
              className="clear-search-btn" 
              onClick={() => setSearchTerm('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Search Section Header */}
      <div className="search-results-header">
        <span className="results-badge">
          {debouncedTerm ? (
            `Results for "${debouncedTerm}"`
          ) : (
            <><Sparkles size={16} /> Suggested People to Follow</>
          )}
        </span>
        <span className="results-count">
          {filteredUsers.length} {filteredUsers.length === 1 ? 'person' : 'people'}
        </span>
      </div>

      {/* Results List */}
      <div className="search-results-list">
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => {
            const isFollowing = currentUser.followingUsers.includes(user.id);
            const isMe = user.id === currentUser.id;

            return (
              <div key={user.id} className="glass-panel user-result-card">
                <div 
                  className="user-result-left"
                  onClick={() => handleUserClick(user.id)}
                >
                  <img src={user.avatar} alt={user.name} className="avatar search-avatar" />
                  <div className="user-result-details">
                    <div className="name-wrapper">
                      <h4 className="user-result-name">{user.name}</h4>
                      <span className="user-result-handle">@{user.username}</span>
                    </div>
                    {user.bio && (
                      <p className="user-result-bio">{user.bio}</p>
                    )}
                  </div>
                </div>

                <div className="user-result-actions">
                  {!isMe ? (
                    <button 
                      className={`glass-button ${isFollowing ? 'following' : 'primary'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFollow(user.id);
                      }}
                    >
                      {isFollowing ? (
                        <><UserCheck size={16} /> Following</>
                      ) : (
                        <><UserPlus size={16} /> Follow</>
                      )}
                    </button>
                  ) : (
                    <span className="badge-you">You</span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state glass-panel search-empty">
            <UserX size={48} className="empty-icon" />
            <h3>No users found</h3>
            <p className="text-muted">
              We couldn't find anyone matching "{debouncedTerm}". Try searching with a different name or handle.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
