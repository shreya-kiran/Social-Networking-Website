<<<<<<< HEAD
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while restoring session

  // On mount: if token exists, restore session via GET /auth/me
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    api.get('/auth/me')
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        // Token is invalid or expired
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (identifier, password) => {
    const res = await api.post('/auth/login', { identifier, password });
    const { token, user: userData } = res.data;
    localStorage.setItem('token', token);
    setUser(userData);
    return userData;
  };

  const register = async ({ name, username, email, password }) => {
    const res = await api.post('/auth/register', { name, username, email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem('token', token);
    setUser(userData);
    return userData;
=======
import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user from token on app load
  useEffect(() => {
    const restoreUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await API.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error('Failed to restore user session:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    restoreUser();
  }, []);

  const login = async (identifier, password) => {
    const payload = typeof identifier === 'object' && identifier !== null 
      ? identifier 
      : { identifier, password };

    const response = await API.post('/auth/login', payload);
    const { token, user: loggedInUser } = response.data;

    if (token) {
      localStorage.setItem('token', token);
    }
    setUser(loggedInUser);
    return response.data;
  };

  const register = async (userData) => {
    const response = await API.post('/auth/register', userData);
    const { token, user: registeredUser } = response.data;

    if (token) {
      localStorage.setItem('token', token);
    }
    setUser(registeredUser);
    return response.data;
>>>>>>> e883d64c5ae1301afbf20416eb17f417981ae5df
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
<<<<<<< HEAD
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
=======
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        setUser
      }}
    >
>>>>>>> e883d64c5ae1301afbf20416eb17f417981ae5df
      {children}
    </AuthContext.Provider>
  );
};
<<<<<<< HEAD
=======

export default AuthContext;
>>>>>>> e883d64c5ae1301afbf20416eb17f417981ae5df
