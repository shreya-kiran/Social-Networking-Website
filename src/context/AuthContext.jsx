import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { DEMO_MODE } from '../config/demoMode';
import { demoRegister, demoLogin, demoGetCurrentUser, demoLogout } from '../api/mockAuth';

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
  const [loading, setLoading] = useState(true); // true while restoring session

  // On mount: restore the session (mock or real)
  useEffect(() => {
    const restoreUser = async () => {
      if (DEMO_MODE) {
        setUser(demoGetCurrentUser());
      } else {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const res = await api.get('/auth/me');
            setUser(res.data);
          } catch (error) {
            console.error('Failed to restore user session:', error);
            localStorage.removeItem('token');
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    restoreUser();
  }, []);

  const login = async (identifier, password) => {
    if (DEMO_MODE) {
      const res = await demoLogin(identifier, password);
      const { token, user: loggedInUser } = res.data;
      if (token) localStorage.setItem('token', token);
      setUser(loggedInUser);
      return res.data;
    }

    const payload =
      typeof identifier === 'object' && identifier !== null
        ? identifier
        : { identifier, password };

    const res = await api.post('/auth/login', payload);
    const { token, user: loggedInUser } = res.data;

    if (token) localStorage.setItem('token', token);
    setUser(loggedInUser);
    return res.data;
  };

  const register = async (userData) => {
    if (DEMO_MODE) {
      const res = await demoRegister(userData);
      const { token, user: registeredUser } = res.data;

      if (token) localStorage.setItem('token', token);
      setUser(registeredUser);
      return res.data;
    }

    const res = await api.post('/auth/register', userData);
    const { token, user: registeredUser } = res.data;

    if (token) localStorage.setItem('token', token);
    setUser(registeredUser);
    return res.data;
  };

  const logout = () => {
    if (DEMO_MODE) {
      demoLogout();
    }
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
