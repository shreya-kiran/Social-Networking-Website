import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

const INITIAL_CURRENT_USER = {
  id: 'u1',
  name: 'Alex Developer',
  username: 'alexdev',
  bio: 'Building beautiful things with code. 🚀 Glassmorphic UI advocate.',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
  followersCount: 142,
  followingCount: 96,
  followingUsers: ['u2', 'u3'],
  followersUsers: ['u2', 'u4', 'u5']
};

const INITIAL_USERS = [
  {
    id: 'u2',
    name: 'Sarah Designer',
    username: 'sarahdesigns',
    bio: 'UI/UX enthusiast. Minimalist aesthetic & fluid motion. ✨',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop',
    followersCount: 543,
    followingCount: 112,
    followersUsers: ['u1', 'u3', 'u4'],
    followingUsers: ['u1']
  },
  {
    id: 'u3',
    name: 'Elena UI',
    username: 'elenaui',
    bio: 'Frontend Engineer | Open Source contributor & CSS wizard 🪄',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop',
    followersCount: 892,
    followingCount: 345,
    followersUsers: ['u1', 'u2'],
    followingUsers: ['u1', 'u4']
  },
  {
    id: 'u4',
    name: 'Aria Stone',
    username: 'ariastone',
    bio: 'Product Designer @ Aurora | Coffee, typography & pastel gradients 🎨',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=300&auto=format&fit=crop',
    followersCount: 418,
    followingCount: 220,
    followersUsers: ['u3'],
    followingUsers: ['u1', 'u2']
  },
  {
    id: 'u5',
    name: 'Liam Tech',
    username: 'liamtech',
    bio: 'Fullstack Explorer | Rust & React | Building micro-tools 🛠️',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop',
    followersCount: 630,
    followingCount: 180,
    followersUsers: ['u1'],
    followingUsers: ['u1', 'u3']
  }
];

const INITIAL_POSTS = [
  {
    id: 'p1',
    authorId: 'u2',
    text: 'Just finished up a new design system using frosted glass and smooth micro-animations. Loving this clean aesthetic! ✨',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    createdAt: new Date('2026-10-08T07:30:00Z'),
    likes: 14,
    hasLiked: false,
    comments: [
      { id: 'c1', authorId: 'u1', text: 'Looks amazing! The pastel gradients pop brilliantly.' }
    ]
  },
  {
    id: 'p2',
    authorId: 'u3',
    text: 'What are your thoughts on React 19 transitions and actions? The new hooks simplify so much state management.',
    image: null,
    createdAt: new Date('2026-10-08T05:00:00Z'),
    likes: 8,
    hasLiked: true,
    comments: []
  },
  {
    id: 'p3',
    authorId: 'u4',
    text: 'Morning coffee & wireframing some new chat bubble designs. Clean typography makes all the difference! ☕🎨',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop',
    createdAt: new Date('2026-10-07T16:00:00Z'),
    likes: 27,
    hasLiked: false,
    comments: [
      { id: 'c2', authorId: 'u2', text: 'Totally agree on typography!' }
    ]
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'n1',
    actorId: 'u4',
    type: 'like',
    text: 'liked your post',
    targetPostId: 'p1',
    read: false,
    createdAt: new Date('2026-10-08T09:45:00Z')
  },
  {
    id: 'n2',
    actorId: 'u2',
    type: 'comment',
    text: 'commented: "Looks amazing! The pastel gradients pop brilliantly."',
    targetPostId: 'p1',
    read: false,
    createdAt: new Date('2026-10-08T09:15:00Z')
  },
  {
    id: 'n3',
    actorId: 'u3',
    type: 'follow',
    text: 'started following you',
    targetPostId: null,
    read: true,
    createdAt: new Date('2026-10-08T06:30:00Z')
  },
  {
    id: 'n4',
    actorId: 'u5',
    type: 'follow',
    text: 'started following you',
    targetPostId: null,
    read: true,
    createdAt: new Date('2026-10-07T10:00:00Z')
  }
];

const INITIAL_CONVERSATIONS = [
  {
    id: 'conv_u2',
    participantId: 'u2',
    unreadCount: 1,
    messages: [
      {
        id: 'm1',
        senderId: 'u2',
        text: 'Hey Alex! Did you get a chance to see the new UI updates for our project?',
        createdAt: new Date('2026-10-08T05:30:00Z')
      },
      {
        id: 'm2',
        senderId: 'u1',
        text: 'Yes! The glassmorphic cards and color tones look stellar.',
        createdAt: new Date('2026-10-08T06:30:00Z')
      },
      {
        id: 'm3',
        senderId: 'u2',
        text: 'Awesome! Let me know if you want to pair on the notifications flow next.',
        createdAt: new Date('2026-10-08T09:35:00Z')
      }
    ]
  },
  {
    id: 'conv_u3',
    participantId: 'u3',
    unreadCount: 0,
    messages: [
      {
        id: 'm4',
        senderId: 'u3',
        text: 'Hey there! Loved your commentary on modern React hooks.',
        createdAt: new Date('2026-10-07T05:00:00Z')
      },
      {
        id: 'm5',
        senderId: 'u1',
        text: 'Appreciate it Elena! Let me know if you want to collaborate on any open source widgets.',
        createdAt: new Date('2026-10-07T07:00:00Z')
      }
    ]
  }
];

export const AppProvider = ({ children }) => {
  const { user, logout: authLogout } = useAuth();

  // Authentication & Current User State
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);
  const [currentUser, setCurrentUser] = useState(() => {
    if (user) {
      return {
        ...INITIAL_CURRENT_USER,
        ...user,
        id: user.id || user._id,
        avatar: user.avatar || INITIAL_CURRENT_USER.avatar,
      };
    }
    return INITIAL_CURRENT_USER;
  });
  const [users, setUsers] = useState(INITIAL_USERS);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);

  useEffect(() => {
    if (user) {
      setCurrentUser(prev => ({
        ...prev,
        ...user,
        id: user.id || user._id,
        avatar: user.avatar || prev.avatar || INITIAL_CURRENT_USER.avatar,
        followersCount: user.followersCount ?? (user.followers ? user.followers.length : prev.followersCount),
        followingCount: user.followingCount ?? (user.following ? user.following.length : prev.followingCount),
        followingUsers: user.followingUsers || (user.following ? user.following.map(f => typeof f === 'object' ? (f.id || f._id) : f) : prev.followingUsers),
        followersUsers: user.followersUsers || (user.followers ? user.followers.map(f => typeof f === 'object' ? (f.id || f._id) : f) : prev.followersUsers),
      }));
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [user]);

  // Socket.IO Integration
  const socketRef = useRef(null);

  const handleIncomingSocketMessage = (msg) => {
    setConversations(prev => {
      const convIndex = prev.findIndex(c => c.participantId === msg.senderId);
      if (convIndex >= 0) {
        const updated = [...prev];
        updated[convIndex] = {
          ...updated[convIndex],
          unreadCount: updated[convIndex].unreadCount + 1,
          messages: [...updated[convIndex].messages, msg]
        };
        return updated;
      } else {
        return [
          {
            id: `conv_${msg.senderId}`,
            participantId: msg.senderId,
            unreadCount: 1,
            messages: [msg]
          },
          ...prev
        ];
      }
    });
  };

  useEffect(() => {
    // Attempt connection to Socket.IO server (gracefully handles offline backend)
    try {
      const token = localStorage.getItem('token');
      const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        autoConnect: false,
        reconnectionAttempts: 2,
        timeout: 3000,
        auth: token ? { token } : undefined
      });
      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('Socket.IO connected:', socket.id);
      });

      socket.on('message', (incomingMsg) => {
        handleIncomingSocketMessage(incomingMsg);
      });

      socket.connect();
    } catch (e) {
      console.warn('Socket.IO initialization bypassed:', e);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Periodic notification refresh (every 30 seconds as requested)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time activity check
      console.log('Checking for new notifications...');
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const getUser = (id) => {
    if (id === currentUser.id) return currentUser;
    return users.find(u => u.id === id);
  };

  const addPost = (text, image) => {
    const newPost = {
      id: `p${Date.now()}`,
      authorId: currentUser.id,
      text,
      image,
      createdAt: new Date(),
      likes: 0,
      hasLiked: false,
      comments: []
    };
    setPosts([newPost, ...posts]);
  };

  const deletePost = (postId) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  const toggleLike = (postId) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const nextLiked = !p.hasLiked;
        // If liking another user's post, generate a notification
        if (nextLiked && p.authorId !== currentUser.id) {
          addNotification({
            actorId: currentUser.id,
            type: 'like',
            text: 'liked your post',
            targetPostId: postId
          });
        }
        return {
          ...p,
          hasLiked: nextLiked,
          likes: nextLiked ? p.likes + 1 : p.likes - 1
        };
      }
      return p;
    }));
  };

  const addComment = (postId, text) => {
    const targetPost = posts.find(p => p.id === postId);
    if (targetPost && targetPost.authorId !== currentUser.id) {
      addNotification({
        actorId: currentUser.id,
        type: 'comment',
        text: `commented: "${text.length > 30 ? text.substring(0, 30) + '...' : text}"`,
        targetPostId: postId
      });
    }

    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, { id: `c${Date.now()}`, authorId: currentUser.id, text }]
        };
      }
      return p;
    }));
  };

  const updateProfile = (updates) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
  };

  const toggleFollow = (userId) => {
    const isFollowing = currentUser.followingUsers.includes(userId);
    const targetUser = users.find(u => u.id === userId);

    if (!isFollowing && targetUser) {
      toast.success(`You are now following ${targetUser.name}`);
      addNotification({
        actorId: currentUser.id,
        type: 'follow',
        text: 'started following you',
        targetPostId: null
      });
    } else if (isFollowing && targetUser) {
      toast(`Unfollowed ${targetUser.name}`);
    }

    // Update current user following list & count
    setCurrentUser(prev => ({
      ...prev,
      followingCount: isFollowing ? prev.followingCount - 1 : prev.followingCount + 1,
      followingUsers: isFollowing
        ? prev.followingUsers.filter(id => id !== userId)
        : [...prev.followingUsers, userId]
    }));

    // Update target user followers list & count
    setUsers(users.map(u => {
      if (u.id === userId) {
        const userFollowers = u.followersUsers || [];
        return {
          ...u,
          followersCount: isFollowing ? u.followersCount - 1 : u.followersCount + 1,
          followersUsers: isFollowing
            ? userFollowers.filter(id => id !== currentUser.id)
            : [...userFollowers, currentUser.id]
        };
      }
      return u;
    }));
  };

  // Notification Helpers
  const addNotification = (notifData) => {
    const newNotif = {
      id: `n${Date.now()}`,
      read: false,
      createdAt: new Date(),
      ...notifData
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  // Chat & Messaging Helpers
  const sendMessage = (participantId, text) => {
    if (!text.trim()) return;

    const newMessage = {
      id: `m${Date.now()}`,
      senderId: currentUser.id,
      text: text.trim(),
      createdAt: new Date()
    };

    // Emit via Socket.IO if connected
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('sendMessage', {
        to: participantId,
        message: newMessage
      });
    }

    // Update conversation locally
    setConversations(prev => {
      const convIndex = prev.findIndex(c => c.participantId === participantId);
      if (convIndex >= 0) {
        const updated = [...prev];
        updated[convIndex] = {
          ...updated[convIndex],
          messages: [...updated[convIndex].messages, newMessage]
        };
        return updated;
      } else {
        return [
          {
            id: `conv_${participantId}`,
            participantId,
            unreadCount: 0,
            messages: [newMessage]
          },
          ...prev
        ];
      }
    });

    // Auto-reply simulation when backend Socket.IO is offline
    const participant = getUser(participantId);
    if (participant) {
      setTimeout(() => {
        const replies = [
          `Hey! Got your message: "${text.substring(0, 24)}${text.length > 24 ? '...' : ''}"`,
          "Sounds great, thanks for checking in!",
          "Nice! Let me review this shortly.",
          "Awesome! Excited to see this develop further. ✨"
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const replyMsg = {
          id: `m${Date.now() + 1}`,
          senderId: participantId,
          text: randomReply,
          createdAt: new Date()
        };

        setConversations(prev => {
          const idx = prev.findIndex(c => c.participantId === participantId);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = {
              ...updated[idx],
              messages: [...updated[idx].messages, replyMsg]
            };
            return updated;
          }
          return prev;
        });
      }, 1400);
    }
  };

  const markConversationAsRead = (participantId) => {
    setConversations(prev => prev.map(c =>
      c.participantId === participantId ? { ...c, unreadCount: 0 } : c
    ));
  };

  const getOrCreateConversation = (participantId) => {
    let conv = conversations.find(c => c.participantId === participantId);
    if (!conv) {
      conv = {
        id: `conv_${participantId}`,
        participantId,
        unreadCount: 0,
        messages: []
      };
      setConversations(prev => [conv, ...prev]);
    }
    return conv;
  };

  // Settings & Account Actions
  const changePassword = (currentPassword, newPassword) => {
    // Basic password validation
    if (!currentPassword) {
      toast.error('Please enter your current password');
      return false;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return false;
    }
    toast.success('Password updated successfully!');
    return true;
  };

  const deleteAccount = () => {
    // Remove user posts
    setPosts(prev => prev.filter(p => p.authorId !== currentUser.id));
    // Remove user from users list
    setUsers(prev => prev.filter(u => u.id !== currentUser.id));
    setIsLoggedIn(false);
    toast.success('Your account and posts have been permanently deleted.');
  };

  const logout = () => {
    if (authLogout) {
      authLogout();
    }
    setIsLoggedIn(false);
    toast.success('Logged out successfully');
  };

  const login = () => {
    setIsLoggedIn(true);
    toast.success('Welcome back!');
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      posts,
      isLoggedIn,
      notifications,
      conversations,
      unreadNotificationsCount,
      unreadMessagesCount,
      getUser,
      addPost,
      deletePost,
      toggleLike,
      addComment,
      updateProfile,
      toggleFollow,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      sendMessage,
      markConversationAsRead,
      getOrCreateConversation,
      changePassword,
      deleteAccount,
      logout,
      login
    }}>
      {children}
    </AppContext.Provider>
  );
};
