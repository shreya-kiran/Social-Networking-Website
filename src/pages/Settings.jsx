import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  KeyRound, 
  Trash2, 
  LogOut, 
  AlertTriangle, 
  X, 
  ShieldCheck, 
  Lock 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

export default function Settings() {
  const navigate = useNavigate();
  const { 
    currentUser, 
    changePassword, 
    deleteAccount, 
    logout, 
    login, 
    isLoggedIn 
  } = useAppContext();

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Please enter your current password');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    const success = changePassword(currentPassword, newPassword);
    if (success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmationText.trim().toUpperCase() !== 'DELETE') {
      toast.error('Please type "DELETE" to confirm account deletion');
      return;
    }
    setIsDeleteModalOpen(false);
    deleteAccount();
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isLoggedIn) {
    return (
      <div className="glass-panel form-container" style={{ textAlign: 'center', padding: '60px 24px' }}>
        <LogOut size={56} style={{ color: 'var(--color-orange)', marginBottom: '16px' }} />
        <h2>You are logged out</h2>
        <p className="text-muted" style={{ marginBottom: '24px' }}>
          Log in again to manage your account settings and social feeds.
        </p>
        <button className="glass-button primary" onClick={login}>
          Log Back In as Demo User
        </button>
      </div>
    );
  }

  return (
    <div className="settings-page-container">
      <div className="feed-header">
        <h1>Settings</h1>
        <p className="text-muted" style={{ marginTop: '6px' }}>
          Manage your security, account credentials, and preferences
        </p>
      </div>

      <div className="settings-sections">
        {/* Section 1: Change Password */}
        <div className="glass-panel settings-card">
          <div className="settings-card-header">
            <div className="settings-icon-wrap">
              <KeyRound size={22} />
            </div>
            <div>
              <h3>Change Password</h3>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                Ensure your account is using a strong, unique password.
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="settings-form">
            <div className="form-group">
              <label>Current Password</label>
              <div className="password-input-wrap">
                <Lock size={18} className="input-inner-icon" />
                <input 
                  type="password"
                  className="glass-input with-prefix-icon"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>New Password</label>
              <div className="password-input-wrap">
                <Lock size={18} className="input-inner-icon" />
                <input 
                  type="password"
                  className="glass-input with-prefix-icon"
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <div className="password-input-wrap">
                <Lock size={18} className="input-inner-icon" />
                <input 
                  type="password"
                  className="glass-input with-prefix-icon"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-actions" style={{ marginTop: '8px' }}>
              <button type="submit" className="glass-button primary">
                <ShieldCheck size={18} /> Save Password
              </button>
            </div>
          </form>
        </div>

        {/* Section 2: Account Actions & Session */}
        <div className="glass-panel settings-card">
          <div className="settings-card-header">
            <div className="settings-icon-wrap" style={{ color: 'var(--color-teal-dark)' }}>
              <LogOut size={22} />
            </div>
            <div>
              <h3>Session Management</h3>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                Active as <strong style={{ color: 'var(--color-text-main)' }}>@{currentUser.username}</strong>
              </p>
            </div>
          </div>

          <div className="session-actions-row">
            <p className="text-muted" style={{ fontSize: '0.95rem' }}>
              Need to take a break or switch devices? You can log out safely anytime.
            </p>
            <button className="glass-button" onClick={handleLogout}>
              <LogOut size={18} /> Log Out
            </button>
          </div>
        </div>

        {/* Section 3: Danger Zone / Delete Account */}
        <div className="glass-panel settings-card danger-zone-card">
          <div className="settings-card-header">
            <div className="settings-icon-wrap danger">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h3 style={{ color: '#ff4d4f' }}>Danger Zone</h3>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                Permanently delete your profile, media, comments, and interactions.
              </p>
            </div>
          </div>

          <div className="danger-zone-content">
            <p style={{ fontSize: '0.95rem', color: '#684545', lineHeight: 1.5 }}>
              Once you delete your account, there is no going back. All published posts, followers connections, and messages will be permanently wiped.
            </p>
            <button 
              className="glass-button danger-solid-btn"
              onClick={() => {
                setDeleteConfirmationText('');
                setIsDeleteModalOpen(true);
              }}
            >
              <Trash2 size={18} /> Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Account Deletion Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-content glass-panel delete-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <AlertTriangle size={24} style={{ color: '#ff4d4f' }} />
                <h3 style={{ color: '#ff4d4f' }}>Delete Account Permanently</h3>
              </div>
              <button 
                className="icon-btn close-btn" 
                onClick={() => setIsDeleteModalOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="delete-modal-body">
              <p style={{ lineHeight: 1.6, marginBottom: '16px' }}>
                This action is irreversible. To proceed, please type <strong style={{ color: '#ff4d4f', letterSpacing: '1px' }}>DELETE</strong> in the box below:
              </p>

              <input 
                type="text"
                className="glass-input danger-input"
                placeholder="Type DELETE to confirm"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                autoFocus
              />
            </div>

            <div className="modal-actions-row">
              <button 
                className="glass-button" 
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="glass-button danger-solid-btn"
                onClick={handleConfirmDelete}
                disabled={deleteConfirmationText.trim().toUpperCase() !== 'DELETE'}
              >
                <Trash2 size={18} /> Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
