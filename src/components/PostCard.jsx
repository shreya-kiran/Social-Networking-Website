import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Trash2, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function PostCard({ post }) {
  const { currentUser, getUser, deletePost, toggleLike, addComment } = useAppContext();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const author = getUser(post.authorId);
  const isOwnPost = author.id === currentUser.id;

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
  };

  if (!author) return null;

  return (
    <div className="glass-panel post-card">
      <div className="post-header">
        <Link to={isOwnPost ? '/profile' : `/user/${author.id}`} className="post-user-info" style={{ textDecoration: 'none', color: 'inherit' }}>
          <img src={author.avatar} alt={author.name} className="avatar" />
          <div>
            <div className="post-author-name">
              {author.name} <span className="text-muted">@{author.username}</span>
            </div>
            <div className="post-time">{formatDistanceToNow(post.createdAt, { addSuffix: true })}</div>
          </div>
        </Link>
        {isOwnPost && (
          <button 
            className="glass-button icon-btn delete-btn" 
            onClick={() => deletePost(post.id)}
            title="Delete post"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="post-content">
        {post.text}
      </div>

      {post.image && (
        <div className="post-image-container">
          <img src={post.image} alt="Post content" className="post-image" />
        </div>
      )}

      <div className="post-actions">
        <button 
          className={`glass-button post-action-btn ${post.hasLiked ? 'liked' : ''}`}
          onClick={() => toggleLike(post.id)}
        >
          <Heart size={20} fill={post.hasLiked ? "currentColor" : "none"} /> 
          {post.likes}
        </button>
        <button 
          className="glass-button post-action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle size={20} /> 
          {post.comments.length}
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <form className="add-comment" onSubmit={handleCommentSubmit}>
            <input 
              type="text" 
              className="glass-input" 
              placeholder="Write a comment..." 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit" className="glass-button primary" disabled={!commentText.trim()}>
              <Send size={16} />
            </button>
          </form>

          {post.comments.length > 0 && (
            <div className="comment-list">
              {post.comments.map(comment => {
                const commentAuthor = getUser(comment.authorId);
                return (
                  <div key={comment.id} className="comment-item">
                    <img 
                      src={commentAuthor?.avatar || "https://i.pravatar.cc/150?u=placeholder"} 
                      alt="avatar" 
                      className="avatar" 
                      style={{ width: '32px', height: '32px' }} 
                    />
                    <div>
                      <div className="comment-author">{commentAuthor?.name} <span className="text-muted" style={{ fontWeight: 'normal', fontSize: '0.85em' }}>@{commentAuthor?.username}</span></div>
                      <div className="comment-text">{comment.text}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
