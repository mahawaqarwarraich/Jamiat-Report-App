import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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

  // Set up axios defaults
  axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

  // Function to verify token with backend
  const verifyToken = async (token) => {
    try {
      console.log('Verifying token with backend...');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get('/users/profile');
      console.log('Token verification successful:', response.data);
      return { success: true, user: response.data };
    } catch (error) {
      console.error('Token verification failed:', error.response?.status, error.response?.data);
      return { success: false, error: error.response?.data?.message };
    }
  };

  useEffect(() => {
    // Check if user is logged in on app start
    const initializeAuth = async () => {
      try {
        console.log('Initializing authentication...');
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        console.log('Stored token exists:', !!token);
        console.log('Stored user data exists:', !!userData);

        if (token && userData) {
          // Verify token with backend
          const verification = await verifyToken(token);
          
          if (verification.success) {
            setUser(verification.user);
            console.log('Session restored successfully');
          } else {
            // Token is invalid, clear storage
            console.log('Token verification failed:', verification.error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            console.log('Invalid token, session cleared');
          }
        } else {
          console.log('No stored session found');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear any corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
        console.log('Authentication initialization complete');
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/users/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      console.log('Login successful, session established');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('Attempting to register user:', userData.email);
      const response = await axios.post('/users/register', userData);
      const { token, user } = response.data;
      
      console.log('Registration successful, setting up authentication');
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      console.log('User logged in automatically after registration');
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    console.log('Logout successful, session cleared');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 