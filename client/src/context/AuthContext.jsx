import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user session on mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get('/auth/me');
        setUser(response.data);
      } catch (error) {
        console.log('Failed to restore session:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.log('Login error:', error);
      const message = error.response?.data?.message || 'Login failed. Check credentials.';
      return { success: false, message };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser, sidebarOpen, setSidebarOpen }}>
      {children}
    </AuthContext.Provider>
  );
};
