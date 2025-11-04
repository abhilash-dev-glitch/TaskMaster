import { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (token) {
          const { data } = await authAPI.getProfile();
          setUser(data);
        }
      } catch (error) {
        console.error('Auth check failed', error);
        localStorage.removeItem('userToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login user
  const login = async (email, password) => {
    try {
      setError('');
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem('userToken', data.token);
      setUser(data);
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      setError('');
      const { data } = await authAPI.register(userData);
      localStorage.setItem('userToken', data.token);
      setUser(data);
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('userToken');
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setError('');
      const { data } = await authAPI.updateProfile(userData);
      setUser(data);
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Update failed');
      return { success: false, error: error.response?.data?.message || 'Update failed' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
