import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = authService.getCurrentUser();
    if (stored) {
      setUser(stored);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const user = await authService.login(email, password);
    setUser(user);
    return user;
  }, []);

  const signup = useCallback(async (name, email, password) => {
    const user = await authService.signup(name, email, password);
    setUser(user);
    return user;
  }, []);

  const updateProfile = useCallback(async ({ name, avatar, currentPassword, newPassword }) => {
    const updated = await authService.updateUserProfile({ name, avatar, currentPassword, newPassword });
    setUser(updated);
    return updated;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
