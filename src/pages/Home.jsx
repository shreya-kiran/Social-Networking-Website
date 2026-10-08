import React, { useState } from 'react';
import { Image as ImageIcon, Send } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import PostCard from '../components/PostCard';

function CreatePost() {
  const { currentUser, addPost } = useAppContext();
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  const handleSubmit = () => {
    if (!text.trim() && !image.trim()) return;
    addPost(text, image || null);
    setText('');
    setImage('');
    setShowImageInput(false);
  };

  return (
    <div className="glass-panel create-post-box">
      <div className="create-post-top">
        <img src={currentUser.avatar} alt="You" className="avatar" />
        <textarea 
          className="glass-input"
          placeholder="What's on your mind?"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      
      {showImageInput && (
        <div className="create-post-top" style={{ marginBottom: '16px' }}>
          <div style={{ width: '48px' }}></div>
          <input 
            type="text" 
            className="glass-input" 
            placeholder="Paste image URL here..."
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>
      )}

      <div className="create-post-actions">
        <div className="action-buttons">
          <button 
            className="glass-button icon-btn" 
            title="Add Image"
            onClick={() => setShowImageInput(!showImageInput)}
          >
            <ImageIcon size={20} />
          </button>
        </div>
        <button 
          className="glass-button primary" 
          onClick={handleSubmit}
          disabled={!text.trim() && !image.trim()}
        >
          Post <Send size={16} />
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const { posts } = useAppContext();

  return (
    <div>
      <header className="feed-header">
        <h1>My Feed</h1>
      </header>

      <CreatePost />

      <div className="posts-list">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
