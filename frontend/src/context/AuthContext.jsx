import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cineticket_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('cineticket_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      API.get('/auth/me')
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('cineticket_user', JSON.stringify(res.data));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { access_token, user: userData } = res.data;
    setToken(access_token);
    setUser(userData);
    localStorage.setItem('cineticket_token', access_token);
    localStorage.setItem('cineticket_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (fullName, email, password, role = 'user') => {
    const res = await API.post('/auth/register', { full_name: fullName, email, password, role });
    const { access_token, user: userData } = res.data;
    setToken(access_token);
    setUser(userData);
    localStorage.setItem('cineticket_token', access_token);
    localStorage.setItem('cineticket_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('cineticket_token');
    localStorage.removeItem('cineticket_user');
  };

  const toggleFavorite = async (movieId) => {
    if (!token) return false;
    try {
      const res = await API.post(`/auth/favorites/${movieId}`);
      if (user) {
        const updatedUser = { ...user, favorites: res.data.favorites };
        setUser(updatedUser);
        localStorage.setItem('cineticket_user', JSON.stringify(updatedUser));
      }
      return res.data.action;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        toggleFavorite,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
