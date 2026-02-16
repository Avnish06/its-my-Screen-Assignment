import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../api/config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setUser(storedUser);
      axios.defaults.headers.common['x-auth-token'] = token;
      console.log('User restored from localStorage:', storedUser?.username);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      console.log('Attempting login for user:', username);
      const res = await axios.post(`${API_URL}/auth/login`, { username, password });
      const { token, user: userData } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['x-auth-token'] = token;
      setUser(userData);
      console.log('Login successful:', userData.username);
      return userData;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  };

  const register = async (username, email, fullName, password) => {
    try {
      console.log('Attempting registration for user:', username);
      const res = await axios.post(`${API_URL}/auth/register`, { username, email, fullName, password });
      const { token, user: userData } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['x-auth-token'] = token;
      setUser(userData);
      console.log('Registration successful:', userData.username);
      return userData;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out user:', user?.username);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
  };


  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
