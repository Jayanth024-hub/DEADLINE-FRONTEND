import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, notificationService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(() => notificationService.getNotifications());

  // On mount, verify session with backend
  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        const verified = await authService.verifySession();
        if (isMounted) setUser(verified);
      } catch (e) {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    checkAuth();

    const handleAuthChange = () => {
      setUser(authService.getCurrentUser());
    };
    window.addEventListener('auth_state_changed', handleAuthChange);
    return () => {
      isMounted = false;
      window.removeEventListener('auth_state_changed', handleAuthChange);
    };
  }, []);

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    setUser(result.user);
    return result;
  };

  const register = async (userData) => {
    // Note: Do NOT automatically log in after registration. User must sign in.
    return await authService.register(userData);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const markNotificationRead = (id) => {
    const updated = notificationService.markAsRead(id);
    setNotifications(updated);
  };

  const markAllNotificationsRead = () => {
    const updated = notificationService.markAllAsRead();
    setNotifications(updated);
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    register,
    logout,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    unreadCount: notifications.filter(n => n.unread).length
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
