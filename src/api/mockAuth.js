// Mock auth service — simulates registration/login with localStorage
// Used when DEMO_MODE is true

const USERS_KEY = 'demo_users';
const TOKEN_KEY = 'token';

const generateId = () => `u${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
const generateToken = (userId) => `demo_token_${userId}_${Date.now()}`;

const avatarURLs = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-152450438940-b1c1722653e1?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop',
];

function getUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Seed demo users on first load
function seedUsers() {
  if (getUsers().length === 0) {
    const demoUsers = [
      {
        id: 'u_demo_1',
        name: 'Demo User',
        username: 'demouser',
        email: 'demo@example.com',
        password: 'demo123',
        avatar: avatarURLs[0],
        bio: '',
        followers: [],
        following: [],
      },
    ];
    saveUsers(demoUsers);
  }
}

seedUsers();

// Register: create a new user, store in localStorage
export async function demoRegister({ name, username, email, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      if (users.find(u => u.username === username)) {
        return reject({ response: { data: { error: 'Username already taken' } } });
      }
      if (users.find(u => u.email === email)) {
        return reject({ response: { data: { error: 'Email already registered' } } });
      }

      const newUser = {
        id: generateId(),
        name,
        username,
        email,
        password, // In demo mode, plain-text is fine
        avatar: avatarURLs[Math.floor(Math.random() * avatarURLs.length)],
        bio: '',
        followers: [],
        following: [],
      };

      users.push(newUser);
      saveUsers(users);

      const token = generateToken(newUser.id);
      localStorage.setItem(TOKEN_KEY, token);

      resolve({
        data: {
          token,
          user: {
            id: newUser.id,
            name: newUser.name,
            username: newUser.username,
            email: newUser.email,
            avatar: newUser.avatar,
            bio: newUser.bio,
            followersCount: 0,
            followingCount: 0,
          },
        },
      });
    }, 500); // Simulate network delay
  });
}

// Login: check localStorage users
export async function demoLogin(identifier, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      const user = users.find(
        u => (u.email === identifier || u.username === identifier) && u.password === password
      );

      if (!user) {
        return reject({ response: { data: { error: 'Invalid credentials' } } });
      }

      const token = generateToken(user.id);
      localStorage.setItem(TOKEN_KEY, token);

      resolve({
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            followersCount: user.followers?.length || 0,
            followingCount: user.following?.length || 0,
          },
        },
      });
    }, 500);
  });
}

// Get current user from token
export function demoGetCurrentUser() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  const users = getUsers();
  const userId = token.replace('demo_token_', '').split('_')[0];
  const user = users.find(u => u.id === userId);

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    followersCount: user.followers?.length || 0,
    followingCount: user.following?.length || 0,
  };
}

// Logout
export function demoLogout() {
  localStorage.removeItem(TOKEN_KEY);
}
