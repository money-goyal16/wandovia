import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, fetchCurrentUser } from '../services/api';

const AuthContext = createContext();

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
  const [authError, setAuthError] = useState(null);

  // On first load, if a token exists, try to resolve who the user is
  useEffect(() => {
    const token = localStorage.getItem('trailmuse-token');
    if (!token) {
      setLoading(false);
      return;
    }

    fetchCurrentUser()
      .then((currentUser) => setUser(currentUser))
      .catch(() => {
        localStorage.removeItem('trailmuse-token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const { token, user: loggedInUser } = await loginUser({ email, password });
      localStorage.setItem('trailmuse-token', token);
      setUser(loggedInUser);
      return true;
    } catch (err) {
      setAuthError(err.response?.data?.error || 'Login failed. Is the backend running?');
      return false;
    }
  };

  const register = async (name, email, password) => {
    setAuthError(null);
    try {
      const { token, user: newUser } = await registerUser({ name, email, password });
      localStorage.setItem('trailmuse-token', token);
      setUser(newUser);
      return true;
    } catch (err) {
      setAuthError(err.response?.data?.error || 'Registration failed. Is the backend running?');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('trailmuse-token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, authError, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
