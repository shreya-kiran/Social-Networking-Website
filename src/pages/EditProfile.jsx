import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

export default function EditProfile() {
  const { currentUser, updateProfile } = useAppContext();
  const navigate = useNavigate();

  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio);
  const [avatar, setAvatar] = useState(currentUser.avatar);

  const handleSave = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (username.length < 3 || username.length > 20) {
      toast.error('Username must be between 3 and 20 characters');
      return;
    }

    // In a real app, check for username uniqueness here

    updateProfile({ name, username, bio, avatar });
    toast.success('Profile saved');
    navigate('/profile');
  };

  return (
    <div className="glass-panel form-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSave} className="edit-profile-form">
        <div className="form-group avatar-edit">
          <img src={avatar || 'https://i.pravatar.cc/150?u=placeholder'} alt="Preview" className="profile-avatar preview" />
          <div className="avatar-inputs">
            <label>Avatar URL</label>
            <input 
              type="text" 
              className="glass-input" 
              value={avatar} 
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="Paste image URL here"
            />
            <button type="button" className="glass-button btn-sm" onClick={() => setAvatar('')}>Remove Avatar</button>
          </div>
        </div>

        <div className="form-group">
          <label>Name *</label>
          <input 
            type="text" 
            className="glass-input" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Username *</label>
          <div className="username-input-wrapper">
            <span className="username-prefix">@</span>
            <input 
              type="text" 
              className="glass-input with-prefix" 
              value={username} 
              onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ''))}
              minLength={3}
              maxLength={20}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea 
            className="glass-input" 
            value={bio} 
            onChange={(e) => setBio(e.target.value)}
            maxLength={150}
            rows={3}
          />
          <div className="char-count">{bio.length}/150</div>
        </div>

        <div className="form-actions">
          <button type="button" className="glass-button" onClick={() => navigate('/profile')}>Cancel</button>
          <button type="submit" className="glass-button primary">Save Changes</button>
        </div>
      </form>
    </div>
  );
}
