import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import type { User, AuthResponse } from '../lib/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');

    if (storedUser && accessToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });

    const { accessToken } = response.data.data;
    localStorage.setItem('accessToken', accessToken);

    // Get user info from token (you could also have a separate endpoint)
    // For simplicity, we'll decode the JWT or call a user endpoint
    const userResponse = await api.get('/users/profile');
    const userData = (userResponse.data as any).data as User;

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/register', {
      name,
      email,
      password,
    });

    const { accessToken } = response.data.data;
    localStorage.setItem('accessToken', accessToken);

    // Get user info
    const userResponse = await api.get('/users/profile');
    const userData = (userResponse.data as any).data as User;

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
