import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('bookticket_user');
      const savedToken = localStorage.getItem('bookticket_token');
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedToken) setToken(savedToken);
    } catch {
      localStorage.removeItem('bookticket_user');
      localStorage.removeItem('bookticket_token');
    }
  }, []);

  useEffect(() => {
    if (token) {
      API.get('/auth/me')
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('bookticket_user', JSON.stringify(res.data));
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
    localStorage.setItem('bookticket_token', access_token);
    localStorage.setItem('bookticket_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (fullName, email, password, role = 'user') => {
    const res = await API.post('/auth/register', { full_name: fullName, email, password, role });
    const { access_token, user: userData } = res.data;
    setToken(access_token);
    setUser(userData);
    localStorage.setItem('bookticket_token', access_token);
    localStorage.setItem('bookticket_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('bookticket_token');
    localStorage.removeItem('bookticket_user');
  };

  const toggleFavorite = async (movieId) => {
    if (!token) return false;
    try {
      const res = await API.post(`/auth/favorites/${movieId}`);
      if (user) {
        const updatedUser = { ...user, favorites: res.data.favorites };
        setUser(updatedUser);
        localStorage.setItem('bookticket_user', JSON.stringify(updatedUser));
      }
      return res.data.action;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const refreshUser = async () => {
    if (!token) return null;
    try {
      const res = await API.get('/auth/me');
      setUser(res.data);
      localStorage.setItem('bookticket_user', JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const topUpWallet = async (amount) => {
    if (!token) return null;
    const res = await API.post('/auth/wallet/topup', { amount: Number(amount) });
    await refreshUser();
    return res.data;
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
        refreshUser,
        topUpWallet,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
