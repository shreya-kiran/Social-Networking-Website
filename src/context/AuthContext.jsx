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
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
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
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
