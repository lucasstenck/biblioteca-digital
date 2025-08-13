import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../services/api';
import { User, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  register: (credentials: {
    login: string;
    email: string;
    numero: string;
    senha: string;
    confirmarSenha: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      const userData = await SecureStore.getItemAsync('user_data');

      if (token && userData) {
        const user = JSON.parse(userData);
        setUser(user);
        
        // Verificar se o token ainda é válido
        try {
          await authService.getProfile();
        } catch (error) {
          // Token inválido, limpar dados
          await logout();
        }
      }
    } catch (error) {
      console.error('Erro ao verificar status de autenticação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response: ApiResponse<AuthResponse> = await authService.login({ email, senha });

      if (response.success && response.data) {
        const { user, token } = response.data;
        

        
        // Se o backend não retornou created_at, adicionar a data atual
        const userWithDate = {
          ...user,
          created_at: user.created_at || new Date().toISOString()
        };
        
        // Salvar dados no SecureStore
        await SecureStore.setItemAsync('auth_token', token);
        await SecureStore.setItemAsync('user_data', JSON.stringify(userWithDate));
        
        setUser(userWithDate);
        return true;
      }
      console.log('Login falhou:', response);
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: {
    login: string;
    email: string;
    numero: string;
    senha: string;
    confirmarSenha: string;
  }): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response: ApiResponse<AuthResponse> = await authService.register(credentials);

      if (response.success && response.data) {
        const { user, token } = response.data;
        

        
        // Se o backend não retornou created_at, adicionar a data atual
        const userWithDate = {
          ...user,
          created_at: user.created_at || new Date().toISOString()
        };
        
        // Salvar dados no SecureStore
        await SecureStore.setItemAsync('auth_token', token);
        await SecureStore.setItemAsync('user_data', JSON.stringify(userWithDate));
        
        setUser(userWithDate);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro no registro:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('user_data');
      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      SecureStore.setItemAsync('user_data', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
