import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, MessageSquare, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAppContext } from '../context/AppContext';

export default function Messages() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { 
    currentUser, 
    conversations, 
    getUser, 
    sendMessage, 
    markConversationAsRead,
    getOrCreateConversation
  } = useAppContext();

  const targetUserParam = searchParams.get('user');

  // Active chat state initialized from URL param or default first conversation
  const [activeParticipantId, setActiveParticipantId] = useState(() => {
    if (targetUserParam) return targetUserParam;
    return conversations.length > 0 ? conversations[0].participantId : null;
  });
  const [inputText, setInputText] = useState('');
  const [mobileView, setMobileView] = useState(() => targetUserParam ? 'chat' : 'list');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (targetUserParam) {
      getOrCreateConversation(targetUserParam);
      setActiveParticipantId(targetUserParam);
      markConversationAsRead(targetUserParam);
      setMobileView('chat');
    }
  }, [targetUserParam]);

  // When activeParticipantId changes, mark messages read & auto scroll
  useEffect(() => {
    if (activeParticipantId) {
      markConversationAsRead(activeParticipantId);
    }
  }, [activeParticipantId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeParticipantId]);

  const activeConversation = conversations.find(c => c.participantId === activeParticipantId);
  const activeUser = activeParticipantId ? getUser(activeParticipantId) : null;

  const handleSelectConversation = (participantId) => {
    setActiveParticipantId(participantId);
    markConversationAsRead(participantId);
    setMobileView('chat');
  };

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeParticipantId) return;
    sendMessage(activeParticipantId, inputText);
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="messages-layout-wrapper">
      <div className="feed-header" style={{ marginBottom: '20px' }}>
        <h1>Messages</h1>
      </div>

      <div className="glass-panel messages-container">
        {/* Left Side: Conversation List */}
        <div className={`conversations-sidebar ${mobileView === 'chat' ? 'hide-mobile' : ''}`}>
          <div className="sidebar-header">
            <h3>Conversations</h3>
            <span className="conv-badge">{conversations.length}</span>
          </div>

          <div className="conversations-scroll-list">
            {conversations.length > 0 ? (
              conversations.map(conv => {
                const participant = getUser(conv.participantId);
                if (!participant) return null;

                const lastMsg = conv.messages[conv.messages.length - 1];
                const isActive = conv.participantId === activeParticipantId;

                return (
                  <div
                    key={conv.id}
                    className={`conversation-item ${isActive ? 'active' : ''} ${conv.unreadCount > 0 ? 'unread' : ''}`}
                    onClick={() => handleSelectConversation(conv.participantId)}
                  >
                    <div className="conv-avatar-wrap">
                      <img src={participant.avatar} alt={participant.name} className="avatar conv-avatar" />
                      {conv.unreadCount > 0 && (
                        <span className="unread-dot" />
                      )}
                    </div>

                    <div className="conv-info">
                      <div className="conv-top-line">
                        <span className="conv-name">{participant.name}</span>
                        {lastMsg && (
                          <span className="conv-time">
                            {formatDistanceToNow(new Date(lastMsg.createdAt), { addSuffix: false })}
                          </span>
                        )}
                      </div>
                      <div className="conv-bottom-line">
                        <p className="conv-preview">
                          {lastMsg ? (
                            lastMsg.senderId === currentUser.id 
                              ? `You: ${lastMsg.text}` 
                              : lastMsg.text
                          ) : (
                            'No messages yet'
                          )}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="unread-count-pill">{conv.unreadCount}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-conversations text-muted">
                <MessageSquare size={36} className="empty-icon" />
                <p>No conversations yet.</p>
                <p style={{ fontSize: '0.85rem' }}>Start chatting with people from the community!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Chat Window */}
        <div className={`chat-window ${mobileView === 'list' ? 'hide-mobile' : ''}`}>
          {activeUser ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <button 
                  className="icon-btn mobile-back-btn" 
                  onClick={() => setMobileView('list')}
                  aria-label="Back to conversations"
                >
                  <ArrowLeft size={20} />
                </button>

                <div 
                  className="chat-header-user"
                  onClick={() => navigate(`/user/${activeUser.id}`)}
                >
                  <img src={activeUser.avatar} alt={activeUser.name} className="avatar chat-header-avatar" />
                  <div>
                    <h4 className="chat-header-name">{activeUser.name}</h4>
                    <span className="chat-header-handle">@{activeUser.username}</span>
                  </div>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="chat-messages-area">
                <div className="chat-start-notice">
                  <Sparkles size={20} className="notice-icon" />
                  <span>End-to-end connected conversation with {activeUser.name}</span>
                </div>

                {activeConversation && activeConversation.messages.length > 0 ? (
                  activeConversation.messages.map(msg => {
                    const isMine = msg.senderId === currentUser.id;
                    return (
                      <div 
                        key={msg.id} 
                        className={`message-row ${isMine ? 'mine' : 'theirs'}`}
                      >
                        {!isMine && (
                          <img 
                            src={activeUser.avatar} 
                            alt={activeUser.name} 
                            className="avatar msg-avatar" 
                          />
                        )}
                        <div className={`message-bubble ${isMine ? 'bubble-mine' : 'bubble-theirs'}`}>
                          <p className="message-text">{msg.text}</p>
                          <span className="message-timestamp">
                            {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-chat-state">
                    <p>Say hello to start the conversation!</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form className="chat-input-bar" onSubmit={handleSend}>
                <input 
                  type="text" 
                  className="glass-input chat-text-input" 
                  placeholder={`Message ${activeUser.name}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
                <button 
                  type="submit" 
                  className="glass-button primary send-btn"
                  disabled={!inputText.trim()}
                  title="Send message"
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="no-chat-selected">
              <MessageSquare size={48} className="empty-icon" />
              <h3>Select a conversation</h3>
              <p className="text-muted">Choose a chat from the left or message someone from their profile.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
